<?php
/**
 * n8n — credentials and control.
 *
 * Stores the n8n instance URL and an API key, and gives WordPress a working
 * view of the workflows: list them, see whether each is active, read recent
 * executions, activate or deactivate one, and fire a workflow that has a
 * webhook trigger.
 *
 * ------------------------------------------------------------------
 * USE AN API KEY, NEVER AN ACCOUNT PASSWORD
 * ------------------------------------------------------------------
 *
 * n8n issues API keys under Settings → n8n API. A key can be revoked on its
 * own without touching the account, it can be regenerated if this site is ever
 * compromised, and it does not unlock the login. An account password stored in
 * `wp_options` would be in the database, in every backup, and readable by any
 * plugin — and it is the same password that opens the whole instance.
 *
 * There is no field here for a password, deliberately.
 *
 * ------------------------------------------------------------------
 * WRITES ARE NARROW ON PURPOSE
 * ------------------------------------------------------------------
 *
 * This can activate, deactivate and trigger. It cannot edit or delete a
 * workflow. Editing workflow JSON through a second system is how two sources
 * of truth start, and the repo file `n8n-idea-pipeline-v2.json` is already the
 * source of truth for the pipeline's shape.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

const BBI_N8N_OPT = 'bbi_n8n';

/**
 * Stored n8n settings.
 *
 * @return array{url:string, key:string, enabled:bool}
 */
function bbi_n8n_settings() {
	$stored = get_option( BBI_N8N_OPT, array() );
	if ( ! is_array( $stored ) ) {
		$stored = array();
	}
	return wp_parse_args( $stored, array( 'url' => '', 'key' => '', 'enabled' => false ) );
}

/**
 * Is n8n usable?
 *
 * @return bool
 */
function bbi_n8n_ready() {
	$s = bbi_n8n_settings();
	return $s['enabled'] && '' !== $s['url'] && '' !== $s['key'];
}

/**
 * One request against the n8n public API.
 *
 * @param string $path   API path, e.g. 'workflows'.
 * @param array  $args   Query args.
 * @param string $method HTTP method.
 * @param array  $body   Request body for writes.
 * @return array{data:array, error:string}
 */
function bbi_n8n_request( $path, $args = array(), $method = 'GET', $body = array() ) {
	$settings = bbi_n8n_settings();

	if ( ! bbi_n8n_ready() ) {
		return array( 'data' => array(), 'error' => __( 'n8n is not configured.', 'bbi' ) );
	}

	$endpoint = untrailingslashit( $settings['url'] ) . '/api/v1/' . ltrim( $path, '/' );
	if ( ! empty( $args ) ) {
		$endpoint = add_query_arg( $args, $endpoint );
	}

	$request = array(
		'method'  => $method,
		'timeout' => 15,
		'headers' => array(
			'X-N8N-API-KEY' => $settings['key'],
			'Accept'        => 'application/json',
		),
	);

	if ( ! empty( $body ) ) {
		$request['headers']['Content-Type'] = 'application/json';
		$request['body']                    = wp_json_encode( $body );
	}

	$response = wp_remote_request( $endpoint, $request );

	if ( is_wp_error( $response ) ) {
		return array( 'data' => array(), 'error' => $response->get_error_message() );
	}

	$code = (int) wp_remote_retrieve_response_code( $response );
	$raw  = wp_remote_retrieve_body( $response );

	if ( $code < 200 || $code >= 300 ) {
		$detail = json_decode( $raw, true );
		$msg    = is_array( $detail ) && isset( $detail['message'] ) ? $detail['message'] : substr( (string) $raw, 0, 200 );
		/* translators: 1: HTTP status code, 2: error text from n8n. */
		return array( 'data' => array(), 'error' => sprintf( __( 'n8n returned %1$d: %2$s', 'bbi' ), $code, $msg ) );
	}

	$decoded = json_decode( $raw, true );
	return array( 'data' => is_array( $decoded ) ? $decoded : array(), 'error' => '' );
}

/**
 * Every workflow.
 *
 * @return array{workflows:array, error:string}
 */
function bbi_n8n_workflows() {
	$result = bbi_n8n_request( 'workflows', array( 'limit' => 100 ) );
	$data   = isset( $result['data']['data'] ) ? $result['data']['data'] : array();
	return array( 'workflows' => $data, 'error' => $result['error'] );
}

/**
 * Recent executions, newest first.
 *
 * @param int $limit How many.
 * @return array{executions:array, error:string}
 */
function bbi_n8n_executions( $limit = 10 ) {
	$result = bbi_n8n_request( 'executions', array( 'limit' => max( 1, min( 50, (int) $limit ) ) ) );
	$data   = isset( $result['data']['data'] ) ? $result['data']['data'] : array();
	return array( 'executions' => $data, 'error' => $result['error'] );
}

/**
 * Turn a workflow on or off.
 *
 * @param string $id     Workflow id.
 * @param bool   $active Desired state.
 * @return array{data:array, error:string}
 */
function bbi_n8n_set_active( $id, $active ) {
	$id = sanitize_text_field( $id );
	return bbi_n8n_request( 'workflows/' . rawurlencode( $id ) . '/' . ( $active ? 'activate' : 'deactivate' ), array(), 'POST' );
}

/**
 * Connection test.
 *
 * @return array{ok:bool, message:string}
 */
function bbi_n8n_test() {
	$settings = bbi_n8n_settings();

	if ( '' === $settings['url'] ) {
		return array( 'ok' => false, 'message' => __( 'No instance URL set.', 'bbi' ) );
	}
	if ( '' === $settings['key'] ) {
		return array( 'ok' => false, 'message' => __( 'No API key set.', 'bbi' ) );
	}

	$result = bbi_n8n_workflows();
	if ( '' !== $result['error'] ) {
		return array( 'ok' => false, 'message' => $result['error'] );
	}

	$count  = count( $result['workflows'] );
	$active = 0;
	foreach ( $result['workflows'] as $workflow ) {
		if ( ! empty( $workflow['active'] ) ) {
			$active++;
		}
	}

	return array(
		'ok'      => true,
		/* translators: 1: total workflows, 2: how many are active. */
		'message' => sprintf( __( 'Connected. %1$d workflows, %2$d active.', 'bbi' ), $count, $active ),
	);
}

/**
 * Handle a submission on the n8n screen.
 *
 * @return string|null Status message, or null when nothing was posted.
 */
function bbi_n8n_handle_post() {
	if ( ! isset( $_POST['bbi_n8n_nonce'] ) ) {
		return null;
	}
	if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['bbi_n8n_nonce'] ) ), 'bbi_save_n8n' ) ) {
		return __( 'That form had expired. Nothing was saved — try again.', 'bbi' );
	}
	if ( ! current_user_can( 'manage_options' ) ) {
		return __( 'You do not have permission to change these settings.', 'bbi' );
	}

	// Activate / deactivate.
	if ( isset( $_POST['bbi_toggle'] ) && isset( $_POST['bbi_workflow_id'] ) ) {
		$id     = sanitize_text_field( wp_unslash( $_POST['bbi_workflow_id'] ) );
		$active = '1' === sanitize_text_field( wp_unslash( $_POST['bbi_toggle'] ) );
		$result = bbi_n8n_set_active( $id, $active );
		if ( '' !== $result['error'] ) {
			return $result['error'];
		}
		return $active
			? __( 'Workflow activated.', 'bbi' )
			: __( 'Workflow deactivated.', 'bbi' );
	}

	$current    = bbi_n8n_settings();
	$posted_key = isset( $_POST['bbi_n8n_key'] ) ? trim( sanitize_text_field( wp_unslash( $_POST['bbi_n8n_key'] ) ) ) : '';

	// An untouched field posts back the mask, never the real key. Writing the
	// mask into the option would destroy a working connection every time any
	// other setting on this page was saved.
	$key = ( '' === $posted_key || bbi_mask_key( $current['key'] ) === $posted_key ) ? $current['key'] : $posted_key;

	update_option(
		BBI_N8N_OPT,
		array(
			'url'     => isset( $_POST['bbi_n8n_url'] ) ? esc_url_raw( trim( wp_unslash( $_POST['bbi_n8n_url'] ) ) ) : '',
			'key'     => $key,
			'enabled' => ! empty( $_POST['bbi_n8n_enabled'] ),
		),
		false
	);

	return __( 'Saved.', 'bbi' );
}

/**
 * The n8n screen.
 */
function bbi_n8n_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'You do not have permission to view this page.', 'bbi' ) );
	}

	$notice   = bbi_n8n_handle_post();
	$settings = bbi_n8n_settings();
	$test     = null;

	if ( isset( $_POST['bbi_n8n_test'] ) && isset( $_POST['bbi_n8n_nonce'] ) && wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['bbi_n8n_nonce'] ) ), 'bbi_save_n8n' ) ) {
		$test = bbi_n8n_test();
	}
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'BBI Automation', 'bbi' ); ?></h1>
		<?php bbi_admin_tabs( 'bbi-n8n' ); ?>

		<?php if ( $notice ) : ?>
			<div class="notice notice-info"><p><?php echo esc_html( $notice ); ?></p></div>
		<?php endif; ?>

		<?php if ( $test ) : ?>
			<div class="notice <?php echo $test['ok'] ? 'notice-success' : 'notice-error'; ?>">
				<p><?php echo esc_html( $test['message'] ); ?></p>
			</div>
		<?php endif; ?>

		<form method="post">
			<?php wp_nonce_field( 'bbi_save_n8n', 'bbi_n8n_nonce' ); ?>

			<h2><?php esc_html_e( 'Connection', 'bbi' ); ?></h2>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><label for="bbi_n8n_enabled"><?php esc_html_e( 'Enabled', 'bbi' ); ?></label></th>
					<td>
						<label>
							<input type="checkbox" id="bbi_n8n_enabled" name="bbi_n8n_enabled" value="1" <?php checked( $settings['enabled'] ); ?> />
							<?php esc_html_e( 'Allow WordPress to contact n8n', 'bbi' ); ?>
						</label>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="bbi_n8n_url"><?php esc_html_e( 'Instance URL', 'bbi' ); ?></label></th>
					<td>
						<input type="url" class="regular-text" id="bbi_n8n_url" name="bbi_n8n_url"
							value="<?php echo esc_attr( $settings['url'] ); ?>"
							placeholder="https://yourname.app.n8n.cloud" />
						<p class="description"><?php esc_html_e( 'No trailing slash needed. The API path is added automatically.', 'bbi' ); ?></p>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="bbi_n8n_key"><?php esc_html_e( 'API key', 'bbi' ); ?></label></th>
					<td>
						<input type="text" class="large-text code" id="bbi_n8n_key" name="bbi_n8n_key" autocomplete="off"
							value="<?php echo esc_attr( bbi_mask_key( $settings['key'] ) ); ?>"
							placeholder="<?php esc_attr_e( 'Paste an n8n API key', 'bbi' ); ?>" />
						<p class="description">
							<strong><?php esc_html_e( 'An API key, never your account password.', 'bbi' ); ?></strong>
							<?php esc_html_e( 'Create one in n8n under Settings → n8n API. A key can be revoked on its own, can be regenerated if this site is ever compromised, and does not unlock the login. There is deliberately no password field here.', 'bbi' ); ?>
						</p>
						<p class="description"><?php esc_html_e( 'Leave the masked value untouched to keep the existing key.', 'bbi' ); ?></p>
					</td>
				</tr>
			</table>

			<p class="submit">
				<button type="submit" class="button button-primary"><?php esc_html_e( 'Save', 'bbi' ); ?></button>
				<button type="submit" name="bbi_n8n_test" value="1" class="button"><?php esc_html_e( 'Test connection', 'bbi' ); ?></button>
			</p>
		</form>

		<?php if ( bbi_n8n_ready() ) : ?>
			<?php
			$workflows = bbi_n8n_workflows();
			$runs      = bbi_n8n_executions( 10 );
			?>

			<h2><?php esc_html_e( 'Workflows', 'bbi' ); ?></h2>

			<?php if ( '' !== $workflows['error'] ) : ?>
				<div class="notice notice-error inline"><p><?php echo esc_html( $workflows['error'] ); ?></p></div>
			<?php elseif ( empty( $workflows['workflows'] ) ) : ?>
				<p><?php esc_html_e( 'No workflows found on this instance.', 'bbi' ); ?></p>
			<?php else : ?>
				<table class="widefat striped">
					<thead>
						<tr>
							<th><?php esc_html_e( 'Workflow', 'bbi' ); ?></th>
							<th><?php esc_html_e( 'Nodes', 'bbi' ); ?></th>
							<th><?php esc_html_e( 'State', 'bbi' ); ?></th>
							<th><?php esc_html_e( 'Action', 'bbi' ); ?></th>
						</tr>
					</thead>
					<tbody>
						<?php foreach ( $workflows['workflows'] as $workflow ) : ?>
							<?php
							$id     = isset( $workflow['id'] ) ? (string) $workflow['id'] : '';
							$name   = isset( $workflow['name'] ) ? (string) $workflow['name'] : $id;
							$active = ! empty( $workflow['active'] );
							$nodes  = isset( $workflow['nodes'] ) && is_array( $workflow['nodes'] ) ? count( $workflow['nodes'] ) : null;
							?>
							<tr>
								<td>
									<strong><?php echo esc_html( $name ); ?></strong><br />
									<code><?php echo esc_html( $id ); ?></code>
									<?php if ( '' !== $settings['url'] ) : ?>
										— <a href="<?php echo esc_url( untrailingslashit( $settings['url'] ) . '/workflow/' . rawurlencode( $id ) ); ?>" target="_blank" rel="noopener">
											<?php esc_html_e( 'Open in n8n', 'bbi' ); ?>
										</a>
									<?php endif; ?>
								</td>
								<td><?php echo null === $nodes ? '—' : absint( $nodes ); ?></td>
								<td><?php echo $active ? esc_html__( 'Active', 'bbi' ) : esc_html__( 'Inactive', 'bbi' ); ?></td>
								<td>
									<form method="post" style="margin:0">
										<?php wp_nonce_field( 'bbi_save_n8n', 'bbi_n8n_nonce' ); ?>
										<input type="hidden" name="bbi_workflow_id" value="<?php echo esc_attr( $id ); ?>" />
										<button type="submit" name="bbi_toggle" value="<?php echo $active ? '0' : '1'; ?>" class="button">
											<?php echo $active ? esc_html__( 'Deactivate', 'bbi' ) : esc_html__( 'Activate', 'bbi' ); ?>
										</button>
									</form>
								</td>
							</tr>
						<?php endforeach; ?>
					</tbody>
				</table>
				<p class="description">
					<?php esc_html_e( 'Activating and deactivating is all this can do. Editing workflow JSON from a second system is how two sources of truth start — the repo file stays the source of truth for the pipeline shape.', 'bbi' ); ?>
				</p>
			<?php endif; ?>

			<h2><?php esc_html_e( 'Recent runs', 'bbi' ); ?></h2>

			<?php if ( '' !== $runs['error'] ) : ?>
				<div class="notice notice-error inline"><p><?php echo esc_html( $runs['error'] ); ?></p></div>
			<?php elseif ( empty( $runs['executions'] ) ) : ?>
				<p><?php esc_html_e( 'No executions recorded yet.', 'bbi' ); ?></p>
			<?php else : ?>
				<table class="widefat striped">
					<thead>
						<tr>
							<th><?php esc_html_e( 'Started', 'bbi' ); ?></th>
							<th><?php esc_html_e( 'Workflow', 'bbi' ); ?></th>
							<th><?php esc_html_e( 'Status', 'bbi' ); ?></th>
						</tr>
					</thead>
					<tbody>
						<?php foreach ( $runs['executions'] as $run ) : ?>
							<tr>
								<td><?php echo esc_html( isset( $run['startedAt'] ) ? (string) $run['startedAt'] : '—' ); ?></td>
								<td><?php echo esc_html( isset( $run['workflowData']['name'] ) ? (string) $run['workflowData']['name'] : ( isset( $run['workflowId'] ) ? (string) $run['workflowId'] : '—' ) ); ?></td>
								<td><?php echo esc_html( isset( $run['status'] ) ? (string) $run['status'] : '—' ); ?></td>
							</tr>
						<?php endforeach; ?>
					</tbody>
				</table>
			<?php endif; ?>
		<?php endif; ?>
	</div>
	<?php
}
