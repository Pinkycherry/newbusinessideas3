<?php
/**
 * Settings → BBI Data.
 *
 * Where the Supabase connection is configured and the data source is chosen.
 * Everything on this screen is capability-gated to `manage_options` and nonce
 * -checked; the key field in particular is a credential input and is treated
 * as one.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

/**
 * Add the menu entry.
 */
function bbi_settings_menu() {
	add_options_page(
		__( 'BBI Data', 'bbi' ),
		__( 'BBI Data', 'bbi' ),
		'manage_options',
		'bbi-data',
		'bbi_settings_page'
	);
}
add_action( 'admin_menu', 'bbi_settings_menu' );

/**
 * Handle a submission.
 *
 * @return string|null A status message, or null when nothing was posted.
 */
function bbi_settings_handle_post() {
	if ( ! isset( $_POST['bbi_data_nonce'] ) ) {
		return null;
	}
	if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['bbi_data_nonce'] ) ), 'bbi_save_data' ) ) {
		return __( 'That form had expired. Nothing was saved — try again.', 'bbi' );
	}
	if ( ! current_user_can( 'manage_options' ) ) {
		return __( 'You do not have permission to change these settings.', 'bbi' );
	}

	if ( isset( $_POST['bbi_flush'] ) ) {
		$removed = bbi_supabase_flush_cache();
		/* translators: %d: number of cached responses cleared. */
		return sprintf( _n( 'Cleared %d cached response.', 'Cleared %d cached responses.', $removed, 'bbi' ), $removed );
	}

	$current = bbi_supabase_settings();

	$posted_key = isset( $_POST['bbi_key'] ) ? trim( sanitize_text_field( wp_unslash( $_POST['bbi_key'] ) ) ) : '';

	// An unchanged field posts back the masked placeholder, never the real
	// key. Writing that placeholder into the option would destroy a working
	// connection every time any other setting on this page was saved.
	if ( '' === $posted_key || bbi_mask_key( $current['key'] ) === $posted_key ) {
		$key = $current['key'];
	} else {
		$key = $posted_key;
	}

	$settings = array(
		'url'     => isset( $_POST['bbi_url'] ) ? esc_url_raw( trim( wp_unslash( $_POST['bbi_url'] ) ) ) : '',
		'key'     => $key,
		'source'  => isset( $_POST['bbi_source'] ) && in_array( $_POST['bbi_source'], array( 'wp', 'live', 'fallback' ), true )
			? sanitize_text_field( wp_unslash( $_POST['bbi_source'] ) )
			: 'fallback',
		'ttl'     => isset( $_POST['bbi_ttl'] ) ? max( 0, min( 86400, (int) $_POST['bbi_ttl'] ) ) : 300,
		'enabled' => ! empty( $_POST['bbi_enabled'] ),
	);

	update_option( BBI_SUPABASE_OPT, $settings, false );

	// A changed connection invalidates everything cached against the old one.
	bbi_supabase_flush_cache();

	if ( 'service_role' === bbi_supabase_key_role( $settings['key'] ) ) {
		return __( 'Saved — but that key is a SERVICE ROLE key and will not be used. It bypasses row-level security and grants write access to every table. Replace it with the anon key, and revoke the one you pasted.', 'bbi' );
	}

	return __( 'Saved.', 'bbi' );
}

/**
 * Show only enough of a key to recognise it.
 *
 * @param string $key Raw key.
 * @return string
 */
function bbi_mask_key( $key ) {
	$key = (string) $key;
	if ( strlen( $key ) < 12 ) {
		return '';
	}
	return substr( $key, 0, 6 ) . str_repeat( '•', 24 ) . substr( $key, -4 );
}

/**
 * Render the screen.
 */
function bbi_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'You do not have permission to view this page.', 'bbi' ) );
	}

	$notice   = bbi_settings_handle_post();
	$settings = bbi_supabase_settings();
	$test     = null;

	if ( isset( $_POST['bbi_test'] ) && isset( $_POST['bbi_data_nonce'] ) && wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['bbi_data_nonce'] ) ), 'bbi_save_data' ) ) {
		$test = bbi_supabase_test();
	}

	$wp_count = (int) wp_count_posts( 'bbi_idea' )->publish;
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'BBI Data', 'bbi' ); ?></h1>

		<?php if ( $notice ) : ?>
			<div class="notice notice-info"><p><?php echo esc_html( $notice ); ?></p></div>
		<?php endif; ?>

		<?php if ( $test ) : ?>
			<div class="notice <?php echo $test['ok'] ? 'notice-success' : 'notice-error'; ?>">
				<p><?php echo esc_html( $test['message'] ); ?></p>
			</div>
		<?php endif; ?>

		<p>
			<?php
			printf(
				/* translators: %d: number of published ideas in WordPress. */
				esc_html( _n( 'WordPress currently holds %d published idea.', 'WordPress currently holds %d published ideas.', $wp_count, 'bbi' ) ),
				absint( $wp_count )
			);
			?>
		</p>

		<form method="post">
			<?php wp_nonce_field( 'bbi_save_data', 'bbi_data_nonce' ); ?>

			<h2><?php esc_html_e( 'Where the site reads its ideas from', 'bbi' ); ?></h2>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><?php esc_html_e( 'Data source', 'bbi' ); ?></th>
					<td>
						<fieldset>
							<label>
								<input type="radio" name="bbi_source" value="fallback" <?php checked( $settings['source'], 'fallback' ); ?> />
								<strong><?php esc_html_e( 'WordPress, falling back to Supabase', 'bbi' ); ?></strong>
							</label>
							<p class="description">
								<?php esc_html_e( 'Recommended. Reads WordPress posts when there are any, and Supabase when there are not — so a fresh install shows real data immediately and switches itself over the moment the import runs.', 'bbi' ); ?>
							</p>
							<br />
							<label>
								<input type="radio" name="bbi_source" value="live" <?php checked( $settings['source'], 'live' ); ?> />
								<strong><?php esc_html_e( 'Supabase, live', 'bbi' ); ?></strong>
							</label>
							<p class="description">
								<?php esc_html_e( 'Always reads Supabase. Content edited in wp-admin will not appear, because nothing here is being read.', 'bbi' ); ?>
							</p>
							<br />
							<label>
								<input type="radio" name="bbi_source" value="wp" <?php checked( $settings['source'], 'wp' ); ?> />
								<strong><?php esc_html_e( 'WordPress only', 'bbi' ); ?></strong>
							</label>
							<p class="description">
								<?php esc_html_e( 'No outbound requests at all. Use this once the import has run and editing has moved into wp-admin.', 'bbi' ); ?>
							</p>
						</fieldset>
					</td>
				</tr>
			</table>

			<h2><?php esc_html_e( 'Supabase connection', 'bbi' ); ?></h2>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><label for="bbi_enabled"><?php esc_html_e( 'Enabled', 'bbi' ); ?></label></th>
					<td>
						<label>
							<input type="checkbox" id="bbi_enabled" name="bbi_enabled" value="1" <?php checked( $settings['enabled'] ); ?> />
							<?php esc_html_e( 'Allow the site to contact Supabase', 'bbi' ); ?>
						</label>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="bbi_url"><?php esc_html_e( 'Project URL', 'bbi' ); ?></label></th>
					<td>
						<input type="url" class="regular-text" id="bbi_url" name="bbi_url"
							value="<?php echo esc_attr( $settings['url'] ); ?>"
							placeholder="https://xxxxxxxx.supabase.co" />
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="bbi_key"><?php esc_html_e( 'Anon key', 'bbi' ); ?></label></th>
					<td>
						<input type="text" class="large-text code" id="bbi_key" name="bbi_key" autocomplete="off"
							value="<?php echo esc_attr( bbi_mask_key( $settings['key'] ) ); ?>"
							placeholder="<?php esc_attr_e( 'Paste the anon / publishable key', 'bbi' ); ?>" />
						<p class="description">
							<strong><?php esc_html_e( 'Use the anon key, not the service role key.', 'bbi' ); ?></strong>
							<?php esc_html_e( 'A service role key bypasses row-level security and grants write access to every table in the project, and anything stored here also lives in every database backup. The anon key grants exactly what the public website already grants, which is all this needs. A service role key pasted here is detected and refused.', 'bbi' ); ?>
						</p>
						<p class="description">
							<?php esc_html_e( 'Leave the masked value untouched to keep the existing key.', 'bbi' ); ?>
						</p>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="bbi_ttl"><?php esc_html_e( 'Cache lifetime', 'bbi' ); ?></label></th>
					<td>
						<input type="number" id="bbi_ttl" name="bbi_ttl" min="0" max="86400" step="10"
							value="<?php echo esc_attr( (string) $settings['ttl'] ); ?>" />
						<?php esc_html_e( 'seconds', 'bbi' ); ?>
						<p class="description">
							<?php esc_html_e( '0 fetches on every single page view. That is genuinely real time and it is also the fastest way to spend a free-tier request allowance — 300 seconds is close enough to live for a library that changes a few times a day.', 'bbi' ); ?>
						</p>
					</td>
				</tr>
			</table>

			<p class="submit">
				<button type="submit" class="button button-primary"><?php esc_html_e( 'Save', 'bbi' ); ?></button>
				<button type="submit" name="bbi_test" value="1" class="button"><?php esc_html_e( 'Test connection', 'bbi' ); ?></button>
				<button type="submit" name="bbi_flush" value="1" class="button"><?php esc_html_e( 'Clear cache', 'bbi' ); ?></button>
			</p>
		</form>

		<h2><?php esc_html_e( 'Importing into WordPress', 'bbi' ); ?></h2>
		<p>
			<?php esc_html_e( 'Reading live is for checking the data. Editing it in wp-admin means importing it, which needs WP-CLI on the host:', 'bbi' ); ?>
		</p>
		<p><code>wp bbi import --url=&lt;project url&gt; --key=&lt;key&gt; --dry-run</code></p>
		<p class="description">
			<?php esc_html_e( 'The importer matches on the Supabase primary key, so running it twice updates rows in place rather than duplicating them. It never writes to Supabase.', 'bbi' ); ?>
		</p>
	</div>
	<?php
}

/**
 * Warn on every admin screen if a service role key is stored.
 *
 * A one-time notice on the settings page is not enough for a credential this
 * dangerous — whoever pasted it may not be the person who next logs in.
 */
function bbi_settings_admin_notice() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$key = bbi_supabase_settings()['key'];
	if ( '' === $key || 'service_role' !== bbi_supabase_key_role( $key ) ) {
		return;
	}
	echo '<div class="notice notice-error"><p><strong>';
	esc_html_e( 'BBI: a Supabase service role key is stored in this site.', 'bbi' );
	echo '</strong> ';
	esc_html_e( 'It is being refused rather than used, so the connection is inactive. That key grants full read and write access to every table and bypasses row-level security. Revoke it in the Supabase dashboard and replace it with the anon key under Settings → BBI Data.', 'bbi' );
	echo '</p></div>';
}
add_action( 'admin_notices', 'bbi_settings_admin_notice' );
