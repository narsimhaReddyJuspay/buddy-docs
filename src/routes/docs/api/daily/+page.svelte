<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import ApiEndpoint from '$lib/components/ApiEndpoint.svelte';
</script>

<svelte:head><title>Daily Connect API — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Daily Connect API</h1>
  <p class="text-muted-foreground text-lg mb-8">Connect to a voice agent session via Daily for browser-based or test interactions.</p>

  <h2 id="overview">Overview</h2>
  <p>
    The Daily Connect endpoint creates a real-time voice session for a lead using
    <a href="https://www.daily.co" target="_blank" rel="noopener noreferrer">Daily</a> as the
    transport layer. This is used for browser-based interactions (via the Web SDK) and playground
    testing.
  </p>

  <h2 id="connect">Connect to Session</h2>

  <ApiEndpoint method="POST" path="/daily/connect" />

  <h3 id="connect-prerequisites">Prerequisites</h3>
  <ul>
    <li>The lead must exist and be in <code>BACKLOG</code> status.</li>
    <li>The lead's <code>execution_mode</code> must be <code>DAILY</code> or <code>DAILY_TEST</code>.</li>
  </ul>

  <h3 id="connect-request">Request Body</h3>

  <CodeBlock lang="json" code={`{
  "lead_id": "lead_abc123"
}`} />

  <h3 id="connect-response">Response</h3>

  <CodeBlock lang="json" code={`{
  "room_url": "https://breezebuddy.daily.co/room_abc123",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "session_id": "sess_xyz789",
  "lead_id": "lead_abc123"
}`} />

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><code>room_url</code></td><td><code>string</code></td><td>Daily room URL to join for the voice session.</td></tr>
        <tr><td><code>token</code></td><td><code>string</code></td><td>Daily meeting token — required to authenticate when joining the room.</td></tr>
        <tr><td><code>session_id</code></td><td><code>string</code></td><td>Unique session identifier for tracking.</td></tr>
        <tr><td><code>lead_id</code></td><td><code>string</code></td><td>The lead associated with this session.</td></tr>
      </tbody>
    </table>
  </div>

  <Callout type="info" title="Using the Response">
    <p>Pass <code>room_url</code> and <code>token</code> to the Daily Web SDK or RTVI client to join the voice session. See the <a href="/docs/daily/web-sdk">Web SDK Setup</a> guide for details.</p>
  </Callout>

  <h2 id="daily-events-ws">Daily Events (WebSocket)</h2>
  <p>
    During an active Daily session, real-time events are exchanged over a WebSocket connection
    managed by the Daily transport layer. These events include participant join/leave, audio
    track state changes, and RTVI application messages.
  </p>

  <Callout type="tip" title="Event Reference">
    <p>See <a href="/docs/daily/rtvi-events">RTVI Events</a> for the complete list of events emitted during a Daily session.</p>
  </Callout>

  <h2 id="error-responses">Error Responses</h2>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr>
          <th>Status</th>
          <th>Meaning</th>
          <th>Common Cause</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><code>400</code></td><td>Bad Request</td><td>Lead is not in <code>BACKLOG</code> status or execution mode is not <code>DAILY</code>/<code>DAILY_TEST</code>.</td></tr>
        <tr><td><code>404</code></td><td>Not Found</td><td>Lead ID does not exist.</td></tr>
        <tr><td><code>500</code></td><td>Server Error</td><td>Failed to create Daily room or generate token.</td></tr>
      </tbody>
    </table>
  </div>
</div>
