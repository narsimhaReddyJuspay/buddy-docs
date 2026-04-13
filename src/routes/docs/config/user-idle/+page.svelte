<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
</script>

<svelte:head><title>User Idle Handling — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>User Idle Handling</h1>
  <p class="text-muted-foreground text-lg mb-8">Automatically prompt silent users and gracefully end calls after repeated inactivity.</p>

  <h2 id="overview">Overview</h2>
  <p>
    When a user goes silent during a call, the idle handling system detects the inactivity
    and takes action — speaking a prompt message, retrying, and eventually ending the call
    if the user remains unresponsive.
  </p>

  <h2 id="fields">UserIdleHandlingConfig Fields</h2>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr><th>Field</th><th>Type</th><th>Default</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>enabled</code></td><td><code>bool</code></td><td>—</td><td>Enable or disable idle detection.</td></tr>
        <tr><td><code>timeout</code></td><td><code>float</code></td><td><code>5.0</code></td><td>Seconds of user silence before triggering idle handling.</td></tr>
        <tr><td><code>idle_message</code></td><td><code>str</code></td><td>—</td><td>Message the bot speaks when the user is idle.</td></tr>
        <tr><td><code>max_retries</code></td><td><code>int</code></td><td><code>3</code></td><td>Maximum number of idle prompts before ending the call.</td></tr>
      </tbody>
    </table>
  </div>

  <h2 id="flow">How It Works</h2>
  <p>The idle handling flow follows this sequence:</p>

  <ol>
    <li>User stops speaking.</li>
    <li>Idle timer starts counting (configured by <code>timeout</code>).</li>
    <li>After <code>timeout</code> seconds of silence, the bot speaks the <code>idle_message</code>.</li>
    <li>The idle counter increments.</li>
    <li>If the user responds, the counter resets to zero and the conversation continues normally.</li>
    <li>If the user stays silent, steps 2–4 repeat.</li>
    <li>After <code>max_retries</code> consecutive idle cycles, the call ends automatically via <code>end_conversation</code>.</li>
  </ol>

  <Callout type="info" title="Counter reset">
    <p>Any user speech resets the idle counter to zero. The user only needs to speak once to prevent the call from ending — it doesn't need to be a long response.</p>
  </Callout>

  <h2 id="json-example">JSON Example</h2>

  <CodeBlock lang="json" code={`{
  "configurations": {
    "user_idle_configuration": {
      "enabled": true,
      "timeout": 5.0,
      "idle_message": "Are you still there? I'm happy to continue whenever you're ready.",
      "max_retries": 3
    }
  }
}`} />

  <h2 id="configuration-tips">Configuration Tips</h2>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr><th>Scenario</th><th>Timeout</th><th>Max Retries</th><th>Idle Message</th></tr>
      </thead>
      <tbody>
        <tr><td>Quick surveys</td><td><code>3.0</code></td><td><code>2</code></td><td>"Are you still there?"</td></tr>
        <tr><td>Customer support</td><td><code>5.0</code></td><td><code>3</code></td><td>"I'm here whenever you're ready to continue."</td></tr>
        <tr><td>Complex forms</td><td><code>8.0</code></td><td><code>4</code></td><td>"Take your time. Let me know when you're ready."</td></tr>
        <tr><td>Sales calls</td><td><code>5.0</code></td><td><code>3</code></td><td>"I'd love to help further. Are you still on the line?"</td></tr>
      </tbody>
    </table>
  </div>

  <Callout type="warning" title="Short timeouts">
    <p>Avoid setting <code>timeout</code> below <code>3.0</code> seconds. Users often pause to think, check information, or multitask. Too-short timeouts feel aggressive and hurt the user experience.</p>
  </Callout>

  <h2 id="disabling">Disabling Idle Handling</h2>
  <p>To disable idle handling, either omit the <code>user_idle_configuration</code> field entirely or set <code>enabled</code> to <code>false</code>:</p>

  <CodeBlock lang="json" code={`{
  "configurations": {
    "user_idle_configuration": {
      "enabled": false
    }
  }
}`} />
</div>
