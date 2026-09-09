<?php
/**
 * BBI Assistant — Claude, inside wp-admin.
 *
 * ------------------------------------------------------------------
 * READ THIS BEFORE ASSUMING WHAT IT IS
 * ------------------------------------------------------------------
 *
 * This is NOT a continuation of any conversation held elsewhere. There is no
 * mechanism, anywhere, that moves a Claude Code session into a WordPress
 * install. What this does is start a NEW assistant that begins already knowing
 * this project, and then keeps ITS OWN history here so it does not start over
 * again after that.
 *
 * Two consequences worth being blunt about:
 *
 * 1. It will not remember a decision made in a conversation it was not part
 *    of. What it knows is `bbi_assistant_context()` below plus the transcript
 *    stored on this site — nothing more. Anything important from elsewhere has
 *    to be written into the project brief for it to be carried across.
 *
 * 2. It bills separately. The Anthropic API is pay-as-you-go and is NOT
 *    included in a Claude Pro or Max subscription — a subscription covers
 *    claude.ai and Claude Code, not API calls. This screen is the one place in
 *    the theme that can spend money, so it ships disabled and says so.
 *
 * ------------------------------------------------------------------
 * WHY RAW HTTP AND NOT THE PHP SDK
 * ------------------------------------------------------------------
 *
 * Anthropic publish an official PHP SDK, and in an ordinary PHP project it
 * would be the right choice. A WordPress theme is not one: shipping a Composer
 * vendor tree inside `wp-content/themes` collides with whatever else on the
 * site has already loaded a different version of the same package, and there
 * is no autoloader arbitration in WordPress to resolve it. `wp_remote_post()`
 * is the HTTP layer WordPress already provides and every host already permits.
 *
 * @package BBI
 */

defined( 'ABSPATH' ) || exit;

const BBI_AI_OPT        = 'bbi_assistant';
const BBI_AI_LOG        = 'bbi_assistant_log';
const BBI_AI_MODEL      = 'claude-opus-5';
const BBI_AI_VERSION    = '2023-06-01';
const BBI_AI_MAX_TOKENS = 8000;
const BBI_AI_MAX_TURNS  = 40;

/**
 * Stored assistant settings.
 *
 * @return array{key:string, enabled:bool, effort:string}
 */
function bbi_assistant_settings() {
	$stored = get_option( BBI_AI_OPT, array() );
	if ( ! is_array( $stored ) ) {
		$stored = array();
	}
	return wp_parse_args( $stored, array( 'key' => '', 'enabled' => false, 'effort' => 'high' ) );
}

/**
 * Is the assistant usable?
 *
 * @return bool
 */
function bbi_assistant_ready() {
	$s = bbi_assistant_settings();
	return $s['enabled'] && '' !== trim( $s['key'] );
}

/**
 * The stored transcript.
 *
 * @return array<int, array{role:string, content:string}>
 */
function bbi_assistant_log() {
	$log = get_option( BBI_AI_LOG, array() );
	return is_array( $log ) ? $log : array();
}

/**
 * Append a turn and trim the history.
 *
 * Trimmed from the FRONT, keeping the most recent exchanges. An unbounded
 * transcript grows the input token count of every subsequent request without
 * limit, which is a bill that climbs on its own with nobody watching.
 *
 * @param string $role    'user' or 'assistant'.
 * @param string $content Message text.
 */
function bbi_assistant_append( $role, $content ) {
	$log   = bbi_assistant_log();
	$log[] = array( 'role' => $role, 'content' => (string) $content, 'at' => time() );

	if ( count( $log ) > BBI_AI_MAX_TURNS ) {
		$log = array_slice( $log, count( $log ) - BBI_AI_MAX_TURNS );
	}

	update_option( BBI_AI_LOG, $log, false );
}

/**
 * What the assistant knows about this site before anyone types anything.
 *
 * Every figure here is READ LIVE. None of it is a description of how the site
 * was set up once — an assistant briefed from a stale snapshot confidently
 * tells you about a configuration you changed last week, and it has no way to
 * notice.
 *
 * @return string
 */
function bbi_assistant_context() {
	$ideas      = (int) wp_count_posts( 'bbi_idea' )->publish;
	$faqs       = (int) wp_count_posts( 'bbi_faq' )->publish;
	$categories = wp_count_terms( array( 'taxonomy' => 'bbi_category', 'hide_empty' => false ) );
	$categories = is_wp_error( $categories ) ? 0 : (int) $categories;

	$supabase = bbi_supabase_settings();
	$source   = bbi_source();

	$lines = array();

	$lines[] = 'You are the BBI assistant, running inside the WordPress admin of a site using the BBI custom theme.';
	$lines[] = '';
	$lines[] = 'ABOUT THE PROJECT';
	$lines[] = 'BBI (Bro Business Ideas) at businessidea.io is a free, researched business-idea library. Every idea page answers four things: who specifically pays, how the money works, what will hurt in year one, and a straight founder-fit verdict — including "do not build this one" when that is the honest answer.';
	$lines[] = '';
	$lines[] = 'HOUSE RULES YOU MUST FOLLOW';
	$lines[] = '- Zero fabricated numbers. Every figure must trace to a real source. If you do not know a number, say so.';
	$lines[] = '- Never name an AI vendor in any public-facing copy.';
	$lines[] = '- Never invent a category slug, an idea title, or a statistic. Ask, or say you cannot check.';
	$lines[] = '- Free tiers only for third-party tools until launch.';
	$lines[] = '- Do not write marketing filler. The site\'s voice is plain, direct, and honest about limits.';
	$lines[] = '';
	$lines[] = 'THIS SITE, RIGHT NOW (read live, not a snapshot)';
	$lines[] = sprintf( '- WordPress %s, BBI theme %s, site: %s', get_bloginfo( 'version' ), BBI_VERSION, home_url( '/' ) );
	$lines[] = sprintf( '- %d published ideas, %d FAQs, %d categories', $ideas, $faqs, $categories );
	$lines[] = sprintf( '- Data source setting: %s. Currently resolving to: %s.', $supabase['source'], $source );
	$lines[] = sprintf( '- Supabase: %s', bbi_supabase_ready() ? 'connected' : 'not configured or disabled' );
	$lines[] = sprintf( '- n8n: %s', function_exists( 'bbi_n8n_ready' ) && bbi_n8n_ready() ? 'connected' : 'not configured or disabled' );

	if ( function_exists( 'bbi_n8n_ready' ) && bbi_n8n_ready() ) {
		$workflows = bbi_n8n_workflows();
		if ( '' === $workflows['error'] ) {
			foreach ( $workflows['workflows'] as $workflow ) {
				$lines[] = sprintf(
					'  - workflow "%s" (id %s) — %s',
					isset( $workflow['name'] ) ? $workflow['name'] : '?',
					isset( $workflow['id'] ) ? $workflow['id'] : '?',
					empty( $workflow['active'] ) ? 'inactive' : 'active'
				);
			}
		}
	}

	$brief = trim( (string) get_option( 'bbi_assistant_brief', '' ) );
	if ( '' !== $brief ) {
		$lines[] = '';
		$lines[] = 'PROJECT NOTES (written by the site owner — treat as authoritative)';
		$lines[] = $brief;
	}

	$lines[] = '';
	$lines[] = 'WHAT YOU CAN AND CANNOT DO';
	$lines[] = 'You can read the state above and answer questions, draft copy, explain how the theme works, and plan changes. You cannot edit files, run commands, query the database directly, or change any setting — you have no tools. When something needs doing, say precisely what to do and where.';
	$lines[] = 'If you are asked about a conversation held somewhere else, say plainly that you do not have it. Do not reconstruct it from guesses.';

	return implode( "\n", $lines );
}

/**
 * Send the conversation to Claude.
 *
 * @param string $message The new user message.
 * @return array{reply:string, error:string, usage:array}
 */
function bbi_assistant_send( $message ) {
	$settings = bbi_assistant_settings();

	if ( ! bbi_assistant_ready() ) {
		return array( 'reply' => '', 'error' => __( 'The assistant is not configured or not enabled.', 'bbi' ), 'usage' => array() );
	}

	$messages = array();
	foreach ( bbi_assistant_log() as $turn ) {
		if ( ! in_array( $turn['role'], array( 'user', 'assistant' ), true ) ) {
			continue;
		}
		if ( '' === trim( (string) $turn['content'] ) ) {
			continue;
		}
		$messages[] = array( 'role' => $turn['role'], 'content' => (string) $turn['content'] );
	}
	$messages[] = array( 'role' => 'user', 'content' => (string) $message );

	// The API requires the first message to be from the user. A trimmed
	// history can begin on an assistant turn, which is a 400 that only shows up
	// once the transcript is long enough to have been cut.
	while ( ! empty( $messages ) && 'user' !== $messages[0]['role'] ) {
		array_shift( $messages );
	}

	$body = array(
		'model'      => BBI_AI_MODEL,
		'max_tokens' => BBI_AI_MAX_TOKENS,
		// The system prompt is stable across a conversation and the transcript
		// grows after it, so it sits in the cacheable prefix.
		'system'     => array(
			array(
				'type'          => 'text',
				'text'          => bbi_assistant_context(),
				'cache_control' => array( 'type' => 'ephemeral' ),
			),
		),
		'messages'   => $messages,
		// Adaptive thinking: the model decides how much reasoning a question
		// needs. `budget_tokens` is rejected outright on this model.
		'thinking'   => array( 'type' => 'adaptive' ),
		'output_config' => array( 'effort' => in_array( $settings['effort'], array( 'low', 'medium', 'high', 'xhigh', 'max' ), true ) ? $settings['effort'] : 'high' ),
	);

	$response = wp_remote_post(
		'https://api.anthropic.com/v1/messages',
		array(
			// Well above the default 5s. A thinking model on a real question
			// routinely takes longer than that, and a timeout here is billed
			// work thrown away.
			'timeout' => 120,
			'headers' => array(
				'x-api-key'         => trim( $settings['key'] ),
				'anthropic-version' => BBI_AI_VERSION,
				'content-type'      => 'application/json',
			),
			'body'    => wp_json_encode( $body ),
		)
	);

	if ( is_wp_error( $response ) ) {
		return array( 'reply' => '', 'error' => $response->get_error_message(), 'usage' => array() );
	}

	$code = (int) wp_remote_retrieve_response_code( $response );
	$raw  = wp_remote_retrieve_body( $response );
	$data = json_decode( $raw, true );

	if ( 200 !== $code ) {
		$msg = is_array( $data ) && isset( $data['error']['message'] ) ? $data['error']['message'] : substr( (string) $raw, 0, 300 );
		if ( 401 === $code ) {
			$msg = __( 'The API key was rejected. Check it is an Anthropic API key from console.anthropic.com, not a subscription login.', 'bbi' );
		}
		/* translators: 1: HTTP status, 2: error text. */
		return array( 'reply' => '', 'error' => sprintf( __( 'Claude returned %1$d: %2$s', 'bbi' ), $code, $msg ), 'usage' => array() );
	}

	if ( ! is_array( $data ) ) {
		return array( 'reply' => '', 'error' => __( 'Claude returned a body that is not JSON.', 'bbi' ), 'usage' => array() );
	}

	// A refusal arrives as a 200 with stop_reason "refusal", not as an error.
	// Reading content without checking this shows the user an empty reply and
	// no explanation for it.
	if ( isset( $data['stop_reason'] ) && 'refusal' === $data['stop_reason'] ) {
		$why = isset( $data['stop_details']['category'] ) ? (string) $data['stop_details']['category'] : '';
		return array(
			'reply' => '',
			'error' => '' !== $why
				/* translators: %s: refusal category reported by the API. */
				? sprintf( __( 'Claude declined to answer that (%s).', 'bbi' ), $why )
				: __( 'Claude declined to answer that.', 'bbi' ),
			'usage' => isset( $data['usage'] ) ? $data['usage'] : array(),
		);
	}

	// `content` is an array of blocks, and on a thinking model the first one is
	// often a thinking block rather than text. Taking content[0].text gives an
	// empty string on a perfectly good response.
	$text = '';
	foreach ( (array) ( isset( $data['content'] ) ? $data['content'] : array() ) as $block ) {
		if ( isset( $block['type'] ) && 'text' === $block['type'] && isset( $block['text'] ) ) {
			$text .= $block['text'];
		}
	}

	if ( '' === trim( $text ) ) {
		return array( 'reply' => '', 'error' => __( 'Claude returned no text. If this repeats, try a shorter message.', 'bbi' ), 'usage' => isset( $data['usage'] ) ? $data['usage'] : array() );
	}

	return array( 'reply' => $text, 'error' => '', 'usage' => isset( $data['usage'] ) ? $data['usage'] : array() );
}

/**
 * Handle a submission on the assistant screen.
 *
 * @return array{notice:string, error:string, usage:array}
 */
function bbi_assistant_handle_post() {
	$out = array( 'notice' => '', 'error' => '', 'usage' => array() );

	if ( ! isset( $_POST['bbi_ai_nonce'] ) ) {
		return $out;
	}
	if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['bbi_ai_nonce'] ) ), 'bbi_save_ai' ) ) {
		$out['error'] = __( 'That form had expired. Nothing was saved — try again.', 'bbi' );
		return $out;
	}
	if ( ! current_user_can( 'manage_options' ) ) {
		$out['error'] = __( 'You do not have permission to use this screen.', 'bbi' );
		return $out;
	}

	if ( isset( $_POST['bbi_ai_clear'] ) ) {
		delete_option( BBI_AI_LOG );
		$out['notice'] = __( 'Conversation cleared.', 'bbi' );
		return $out;
	}

	if ( isset( $_POST['bbi_ai_save'] ) ) {
		$current    = bbi_assistant_settings();
		$posted_key = isset( $_POST['bbi_ai_key'] ) ? trim( sanitize_text_field( wp_unslash( $_POST['bbi_ai_key'] ) ) ) : '';
		$key        = ( '' === $posted_key || bbi_mask_key( $current['key'] ) === $posted_key ) ? $current['key'] : $posted_key;

		update_option(
			BBI_AI_OPT,
			array(
				'key'     => $key,
				'enabled' => ! empty( $_POST['bbi_ai_enabled'] ),
				'effort'  => isset( $_POST['bbi_ai_effort'] ) && in_array( $_POST['bbi_ai_effort'], array( 'low', 'medium', 'high', 'xhigh', 'max' ), true )
					? sanitize_text_field( wp_unslash( $_POST['bbi_ai_effort'] ) )
					: 'high',
			),
			false
		);

		if ( isset( $_POST['bbi_ai_brief'] ) ) {
			update_option( 'bbi_assistant_brief', sanitize_textarea_field( wp_unslash( $_POST['bbi_ai_brief'] ) ), false );
		}

		$out['notice'] = __( 'Saved.', 'bbi' );
		return $out;
	}

	if ( isset( $_POST['bbi_ai_message'] ) ) {
		$message = trim( sanitize_textarea_field( wp_unslash( $_POST['bbi_ai_message'] ) ) );
		if ( '' === $message ) {
			return $out;
		}

		$result = bbi_assistant_send( $message );

		if ( '' !== $result['error'] ) {
			$out['error'] = $result['error'];
			return $out;
		}

		// Only recorded once the call succeeded. Appending the user turn first
		// would leave a dangling question in the transcript every time a
		// request failed, and the next request would resend it.
		bbi_assistant_append( 'user', $message );
		bbi_assistant_append( 'assistant', $result['reply'] );
		$out['usage'] = $result['usage'];
	}

	return $out;
}

/**
 * The assistant screen.
 */
function bbi_assistant_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'You do not have permission to view this page.', 'bbi' ) );
	}

	$state    = bbi_assistant_handle_post();
	$settings = bbi_assistant_settings();
	$log      = bbi_assistant_log();
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'BBI Assistant', 'bbi' ); ?></h1>
		<?php bbi_admin_tabs( 'bbi-assistant' ); ?>

		<?php if ( '' !== $state['notice'] ) : ?>
			<div class="notice notice-info"><p><?php echo esc_html( $state['notice'] ); ?></p></div>
		<?php endif; ?>
		<?php if ( '' !== $state['error'] ) : ?>
			<div class="notice notice-error"><p><?php echo esc_html( $state['error'] ); ?></p></div>
		<?php endif; ?>

		<div class="notice notice-warning inline">
			<p><strong><?php esc_html_e( 'Read this once before enabling.', 'bbi' ); ?></strong></p>
			<p>
				<?php esc_html_e( 'This starts a NEW assistant that begins already knowing this project. It is not a continuation of a conversation held anywhere else — there is no mechanism that moves a Claude Code session into a WordPress install, and it will not remember decisions it was not part of. Write anything important into the project notes below and it carries across.', 'bbi' ); ?>
			</p>
			<p>
				<?php esc_html_e( 'It also costs money. The Anthropic API is pay-as-you-go and is NOT included in a Claude Pro or Max subscription — a subscription covers claude.ai and Claude Code, not API calls. You need an API key from console.anthropic.com with billing set up. This is the only screen in this theme that can spend anything, which is why it ships switched off.', 'bbi' ); ?>
			</p>
		</div>

		<?php if ( bbi_assistant_ready() ) : ?>
			<h2><?php esc_html_e( 'Conversation', 'bbi' ); ?></h2>

			<div style="max-height:56vh;overflow:auto;background:#fff;border:1px solid #dcdcde;padding:16px;margin:0 0 12px">
				<?php if ( empty( $log ) ) : ?>
					<p style="color:#646970;margin:0">
						<?php esc_html_e( 'Nothing yet. It already knows the project and this site\'s current state — ask it something specific.', 'bbi' ); ?>
					</p>
				<?php else : ?>
					<?php foreach ( $log as $turn ) : ?>
						<div style="margin:0 0 18px">
							<p style="margin:0 0 4px;font-weight:600;color:<?php echo 'user' === $turn['role'] ? '#2271b1' : '#1d2327'; ?>">
								<?php echo 'user' === $turn['role'] ? esc_html__( 'You', 'bbi' ) : esc_html__( 'Assistant', 'bbi' ); ?>
							</p>
							<div style="white-space:pre-wrap;line-height:1.6"><?php echo esc_html( $turn['content'] ); ?></div>
						</div>
					<?php endforeach; ?>
				<?php endif; ?>
			</div>

			<?php if ( ! empty( $state['usage'] ) ) : ?>
				<p class="description">
					<?php
					printf(
						/* translators: 1: input tokens, 2: output tokens, 3: tokens read from cache. */
						esc_html__( 'Last request: %1$s input, %2$s output, %3$s read from cache.', 'bbi' ),
						esc_html( number_format_i18n( isset( $state['usage']['input_tokens'] ) ? (int) $state['usage']['input_tokens'] : 0 ) ),
						esc_html( number_format_i18n( isset( $state['usage']['output_tokens'] ) ? (int) $state['usage']['output_tokens'] : 0 ) ),
						esc_html( number_format_i18n( isset( $state['usage']['cache_read_input_tokens'] ) ? (int) $state['usage']['cache_read_input_tokens'] : 0 ) )
					);
					?>
				</p>
			<?php endif; ?>

			<form method="post">
				<?php wp_nonce_field( 'bbi_save_ai', 'bbi_ai_nonce' ); ?>
				<textarea name="bbi_ai_message" rows="4" class="large-text" placeholder="<?php esc_attr_e( 'Ask about the theme, the data, the pipeline, or draft some copy…', 'bbi' ); ?>"></textarea>
				<p class="submit">
					<button type="submit" class="button button-primary"><?php esc_html_e( 'Send', 'bbi' ); ?></button>
					<button type="submit" name="bbi_ai_clear" value="1" class="button"><?php esc_html_e( 'Clear conversation', 'bbi' ); ?></button>
				</p>
				<p class="description">
					<?php
					printf(
						/* translators: %d: number of turns kept. */
						esc_html__( 'The last %d turns are kept and resent with every message, so it remembers this conversation across logins. Older turns are dropped — an unbounded transcript makes every later request cost more, with nobody watching.', 'bbi' ),
						absint( BBI_AI_MAX_TURNS )
					);
					?>
				</p>
			</form>
		<?php endif; ?>

		<h2><?php esc_html_e( 'Setup', 'bbi' ); ?></h2>

		<form method="post">
			<?php wp_nonce_field( 'bbi_save_ai', 'bbi_ai_nonce' ); ?>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><label for="bbi_ai_enabled"><?php esc_html_e( 'Enabled', 'bbi' ); ?></label></th>
					<td>
						<label>
							<input type="checkbox" id="bbi_ai_enabled" name="bbi_ai_enabled" value="1" <?php checked( $settings['enabled'] ); ?> />
							<?php esc_html_e( 'Allow this site to call the Anthropic API (this is what spends money)', 'bbi' ); ?>
						</label>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="bbi_ai_key"><?php esc_html_e( 'Anthropic API key', 'bbi' ); ?></label></th>
					<td>
						<input type="text" class="large-text code" id="bbi_ai_key" name="bbi_ai_key" autocomplete="off"
							value="<?php echo esc_attr( bbi_mask_key( $settings['key'] ) ); ?>"
							placeholder="sk-ant-..." />
						<p class="description">
							<?php esc_html_e( 'From console.anthropic.com → API Keys. A subscription login will not work here — they are different systems. Set a spend limit on the key while you are there; this screen has no cap of its own.', 'bbi' ); ?>
						</p>
						<p class="description"><?php esc_html_e( 'Leave the masked value untouched to keep the existing key.', 'bbi' ); ?></p>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="bbi_ai_effort"><?php esc_html_e( 'Effort', 'bbi' ); ?></label></th>
					<td>
						<select id="bbi_ai_effort" name="bbi_ai_effort">
							<?php foreach ( array( 'low', 'medium', 'high', 'xhigh', 'max' ) as $level ) : ?>
								<option value="<?php echo esc_attr( $level ); ?>" <?php selected( $settings['effort'], $level ); ?>><?php echo esc_html( $level ); ?></option>
							<?php endforeach; ?>
						</select>
						<p class="description">
							<?php esc_html_e( 'How hard it thinks before answering. Higher costs more per message. "high" is the sensible default; drop to "low" for quick lookups, raise to "max" only when being right matters more than the cost.', 'bbi' ); ?>
						</p>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="bbi_ai_brief"><?php esc_html_e( 'Project notes', 'bbi' ); ?></label></th>
					<td>
						<textarea id="bbi_ai_brief" name="bbi_ai_brief" rows="10" class="large-text"><?php echo esc_textarea( (string) get_option( 'bbi_assistant_brief', '' ) ); ?></textarea>
						<p class="description">
							<?php esc_html_e( 'Sent with every message, before anything you type. This is how context from elsewhere gets carried across — decisions made, things not to do, who the audience is. It is the closest thing there is to continuing a conversation the assistant was never part of.', 'bbi' ); ?>
						</p>
					</td>
				</tr>
			</table>

			<p class="submit">
				<button type="submit" name="bbi_ai_save" value="1" class="button button-primary"><?php esc_html_e( 'Save', 'bbi' ); ?></button>
			</p>
		</form>

		<h2><?php esc_html_e( 'What it already knows', 'bbi' ); ?></h2>
		<p class="description"><?php esc_html_e( 'Read live from this site on every message, so it is never describing a setup you have since changed:', 'bbi' ); ?></p>
		<pre style="background:#fff;border:1px solid #dcdcde;padding:12px;overflow:auto;max-height:30vh;white-space:pre-wrap"><?php echo esc_html( bbi_assistant_context() ); ?></pre>
	</div>
	<?php
}
