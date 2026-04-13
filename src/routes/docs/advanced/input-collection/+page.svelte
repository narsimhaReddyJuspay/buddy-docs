<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
</script>

<svelte:head><title>Input Collection — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Input Collection</h1>
  <p class="text-muted-foreground text-lg mb-8">Accumulate multi-segment speech input for phone numbers, addresses, and other structured data.</p>

  <h2 id="overview">Overview</h2>
  <p>
    Input Collection is a <a href="/docs/templates/flow-nodes">node-level configuration</a> that changes how user speech is handled.
    Instead of sending each speech segment to the LLM immediately, the system waits for the
    user to finish speaking across multiple segments before processing.
  </p>
  <p>
    This is essential for collecting structured data like phone numbers, email addresses, or
    postal addresses — where the user naturally pauses between segments (e.g. "nine eight seven…
    six five four… three two one zero").
  </p>

  <h2 id="how-it-works">How It Works</h2>
  <ol>
    <li>User begins speaking in segments with natural pauses.</li>
    <li>Each segment is accumulated rather than sent immediately to the LLM.</li>
    <li>A timer starts after each segment — if no new speech arrives within <code>user_speech_timeout</code> seconds, the accumulated input is finalized.</li>
    <li>The complete accumulated text is sent to the LLM as a single user turn.</li>
  </ol>

  <h2 id="config">InputCollectionConfig</h2>
  <p>
    Input Collection is configured on individual <code>FlowNodeModel</code> nodes — it is a
    <strong>node-level only</strong> setting, not a global configuration.
  </p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><code>enabled</code></td><td><code>bool</code></td><td><code>false</code></td><td>Enable input collection mode on this node.</td></tr>
        <tr><td><code>user_speech_timeout</code></td><td><code>float</code></td><td>—</td><td>Seconds to wait after the last speech segment before finalizing. Must be <code>&gt;= 0.0</code>.</td></tr>
      </tbody>
    </table>
  </div>

  <Callout type="info" title="Node-Level Only">
    <p>Input Collection is configured per flow node, not globally. Enable it only on nodes where multi-segment input is expected (e.g. "collect phone number" or "collect address" nodes).</p>
  </Callout>

  <h2 id="example">Configuration Example</h2>

  <CodeBlock lang="json" code={`{
  "node_name": "collect_phone",
  "task_messages": [
    {
      "role": "system",
      "content": "Ask the customer for their phone number. Wait for them to speak the full number."
    }
  ],
  "input_collection": {
    "enabled": true,
    "user_speech_timeout": 2.5
  },
  "functions": [
    {
      "name": "phone_collected",
      "description": "Phone number has been collected",
      "properties": {
        "phone_number": { "type": "string", "description": "The collected phone number" }
      },
      "required": ["phone_number"],
      "transition_to": "next_step"
    }
  ]
}`} />

  <h2 id="timeout-tuning">Timeout Tuning</h2>
  <p>
    The <code>user_speech_timeout</code> value controls how long the system waits after the last
    speech segment before considering the input complete:
  </p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr>
          <th>Value</th>
          <th>Use Case</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><code>1.0–2.0s</code></td><td>Short inputs — confirmation codes, yes/no with detail.</td></tr>
        <tr><td><code>2.0–3.0s</code></td><td>Phone numbers — users typically pause between digit groups.</td></tr>
        <tr><td><code>3.0–5.0s</code></td><td>Addresses — longer pauses between street, city, postcode.</td></tr>
      </tbody>
    </table>
  </div>

  <Callout type="warning" title="Too High vs Too Low">
    <p>Setting the timeout too low may cut off the user mid-input. Setting it too high adds unnecessary latency before the agent responds. Test with real speech patterns to find the right balance.</p>
  </Callout>
</div>
