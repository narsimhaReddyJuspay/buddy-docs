<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import FlowDiagram from '$lib/components/FlowDiagram.svelte';
  import ConfigPanel from '$lib/components/ConfigPanel.svelte';
</script>

<svelte:head><title>Global Functions — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Global Functions</h1>
  <p class="text-muted-foreground text-lg mb-8">
    Functions available across all nodes — HTTP integrations and built-in handlers that work everywhere in the conversation, regardless of which node the agent is in.
  </p>

  <!-- ───────── Overview ───────── -->
  <h2 id="overview">Overview</h2>
  <p>
    Unlike node-scoped functions (which are only available in a specific node), <strong>global functions</strong> are
    available across <strong>all nodes</strong> in the flow. They are defined at the template level in the
    <code>flow.global_functions</code> array and come in two types:
  </p>
  <ul>
    <li><strong>GlobalHttpFunction</strong> (<code>type: "http"</code>) — Makes an HTTP call, <strong>blocks</strong> the conversation, and returns the response to the LLM</li>
    <li><strong>GlobalBuiltinFunction</strong> (<code>type: "builtin"</code>) — Maps to an internal platform handler</li>
  </ul>

  <FlowDiagram steps={["LLM triggers global function", "Check type (http / builtin)", "Execute handler", "Return result to LLM", "Conversation continues in same node"]} variant="customize" />

  <!-- ───────── Global vs Node ───────── -->
  <h2 id="global-vs-node">Global vs Node Functions</h2>

  <Callout type="info" title="When to Use Which?">
    <p>Node functions handle <strong>transitions and node-specific outcomes</strong>. Global functions handle <strong>utility operations needed everywhere</strong> — data lookups, agent transfers, time checks.</p>
  </Callout>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Aspect</th><th>Node Functions</th><th>Global Functions</th></tr></thead>
      <tbody>
        <tr><td><strong>Scope</strong></td><td>Available only in the node where defined</td><td>Available in <strong>every</strong> node in the flow</td></tr>
        <tr><td><strong>Transitions</strong></td><td>Can transition to other nodes via <code>transition_to</code></td><td>Do <strong>not</strong> transition — conversation stays in current node</td></tr>
        <tr><td><strong>Side Effects</strong></td><td>Fire-and-forget hooks (non-blocking)</td><td>HTTP type <strong>blocks</strong> and returns data to LLM; builtin runs internal handler</td></tr>
        <tr><td><strong>Return Value</strong></td><td>No return value to LLM</td><td>HTTP functions return the API response to the LLM</td></tr>
        <tr><td><strong>Use Case</strong></td><td>Conversation flow control, outcome recording</td><td>Data lookups, live agent transfer, utility operations</td></tr>
        <tr><td><strong>Defined In</strong></td><td><code>node.functions[]</code></td><td><code>flow.global_functions[]</code></td></tr>
      </tbody>
    </table>
  </div>

  <!-- ───────── Common Use Cases ───────── -->
  <h2 id="common-use-cases">Common Use Cases</h2>

  <div class="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
    <div class="card-customize group transition-all duration-200 hover:-translate-y-0.5">
      <div class="p-5">
        <div class="flex items-center gap-2 mb-2"><svg class="h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><h3 class="text-sm font-semibold text-amber-400">Data Lookups</h3></div>
        <p class="text-xs text-muted-foreground">Check order status, account balance, appointment details — from any node.</p>
      </div>
    </div>
    <div class="card-customize group transition-all duration-200 hover:-translate-y-0.5">
      <div class="p-5">
        <div class="flex items-center gap-2 mb-2"><svg class="h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg><h3 class="text-sm font-semibold text-amber-400">Agent Transfer</h3></div>
        <p class="text-xs text-muted-foreground">Transfer to a live human agent whenever the customer requests it.</p>
      </div>
    </div>
    <div class="card-customize group transition-all duration-200 hover:-translate-y-0.5">
      <div class="p-5">
        <div class="flex items-center gap-2 mb-2"><svg class="h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><h3 class="text-sm font-semibold text-amber-400">Utility Ops</h3></div>
        <p class="text-xs text-muted-foreground">Get current time, repeat information, or perform platform operations.</p>
      </div>
    </div>
  </div>

  <!-- ───────── HTTP Global Function ───────── -->
  <h2 id="global-http-function">GlobalHttpFunction (type: "http")</h2>
  <p>
    HTTP global functions make an outbound HTTP call and <strong>block the conversation</strong> until the response is received.
    The response is returned to the LLM so it can use the data in the conversation. This is fundamentally different from
    hook-based HTTP requests which are fire-and-forget.
  </p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>type</code></td><td><code>"http"</code></td><td>Identifies this as an HTTP global function</td></tr>
        <tr><td><code>name</code></td><td><code>string</code></td><td>Function name (used as the LLM tool name)</td></tr>
        <tr><td><code>description</code></td><td><code>string</code></td><td>Tells the LLM when to call this function</td></tr>
        <tr><td><code>properties</code></td><td><code>JSON Schema</code></td><td>Parameter definitions for the LLM to extract</td></tr>
        <tr><td><code>required</code></td><td><code>string[]</code></td><td>Required parameter names</td></tr>
        <tr><td><code>pre_actions</code></td><td><code>List[FlowAction]</code></td><td>Actions to run before the HTTP call (e.g. <code>tts_say</code> "Let me check that for you")</td></tr>
        <tr><td><code>post_actions</code></td><td><code>List[FlowAction]</code></td><td>Actions to run after the HTTP call completes</td></tr>
        <tr><td><code>expected_fields</code></td><td><code>Dict[string, FieldConfig]</code></td><td>Field source mapping for the request</td></tr>
        <tr><td><code>http_request</code></td><td><code>HttpRequestConfig</code></td><td>Full HTTP request configuration</td></tr>
      </tbody>
    </table>
  </div>

  <Callout type="warning" title="Blocking Call">
    <p>Unlike hook HTTP requests (fire-and-forget), global HTTP functions <strong>block the conversation</strong> until the response arrives. The LLM waits for and uses the response data. Use <code>pre_actions</code> with a <code>tts_say</code> to keep the customer engaged while waiting.</p>
  </Callout>

  <h3 id="http-example-order">Order Status Lookup</h3>
  <p>A function that checks order status by calling an external API:</p>

  <CodeBlock lang="json" filename="check-order-status.json" code={`{
  "type": "http",
  "name": "check_order_status",
  "description": "Look up the current status of a customer's order when they ask about it",
  "properties": {
    "order_id": {
      "type": "string",
      "description": "The order ID provided by the customer"
    }
  },
  "required": ["order_id"],
  "pre_actions": [
    {
      "type": "tts_say",
      "text": "Let me check on that order for you, one moment."
    }
  ],
  "post_actions": [],
  "expected_fields": {
    "order_id": { "source": "llm" },
    "account_id": { "source": "static", "value": "{account_id}" }
  },
  "http_request": {
    "url": "https://api.example.com/orders/{order_id}/status",
    "method": "GET",
    "headers": {
      "Authorization": "Bearer {api_secret}",
      "Content-Type": "application/json"
    },
    "query_params": {
      "account": "<<account_id>>"
    },
    "body": {},
    "auth": "none",
    "timeout": 10,
    "max_retries": 3
  }
}`} />

  <h3 id="http-example-balance">Account Balance Lookup</h3>

  <CodeBlock lang="json" filename="get-account-balance.json" code={`{
  "type": "http",
  "name": "get_account_balance",
  "description": "Check the customer's current account balance when they ask about it",
  "properties": {},
  "required": [],
  "pre_actions": [
    {
      "type": "tts_say",
      "text": "Let me pull up your account balance."
    }
  ],
  "post_actions": [],
  "expected_fields": {
    "customer_id": { "source": "static", "value": "{customer_id}" }
  },
  "http_request": {
    "url": "https://api.example.com/accounts/<<customer_id>>/balance",
    "method": "GET",
    "headers": {
      "Authorization": "Bearer {api_secret}"
    },
    "query_params": {},
    "body": {},
    "auth": "none",
    "timeout": 10,
    "max_retries": 3
  }
}`} />

  <!-- ───────── Builtin Global Function ───────── -->
  <h2 id="global-builtin-function">GlobalBuiltinFunction (type: "builtin")</h2>
  <p>
    Built-in global functions map to internal handlers that are part of the Breeze Buddy platform. They don't require
    HTTP configuration — instead, they reference a handler by name.
  </p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>type</code></td><td><code>"builtin"</code></td><td>Identifies this as a built-in global function</td></tr>
        <tr><td><code>name</code></td><td><code>string</code></td><td>Function name (used as the LLM tool name)</td></tr>
        <tr><td><code>description</code></td><td><code>string</code></td><td>Tells the LLM when to call this function</td></tr>
        <tr><td><code>handler</code></td><td><code>string</code></td><td>Internal handler name to execute</td></tr>
        <tr><td><code>pre_tts_message</code></td><td><code>Optional[string]</code></td><td>Text spoken via TTS <strong>before</strong> the handler executes</td></tr>
      </tbody>
    </table>
  </div>

  <h3 id="builtin-handlers">Available Built-in Handlers</h3>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Handler</th><th>Description</th><th>Notes</th></tr></thead>
      <tbody>
        <tr><td><code>connect_to_live_agent</code></td><td>Transfers the call to a live human agent via warm transfer</td><td>Requires <code>transfer_number</code> in template configurations. See <a href="/docs/telephony/warm-transfer">Warm Transfer</a> docs.</td></tr>
        <tr><td><code>get_current_time</code></td><td>Returns the current date and time to the LLM</td><td>Useful when the agent needs to reference the current time in conversation</td></tr>
      </tbody>
    </table>
  </div>

  <h3 id="builtin-example-transfer">Live Agent Transfer</h3>

  <CodeBlock lang="json" filename="connect-to-live-agent.json" code={`{
  "type": "builtin",
  "name": "connect_to_live_agent",
  "description": "Transfer the customer to a live human agent when they explicitly request to speak with a person or when the issue cannot be resolved by the AI",
  "handler": "connect_to_live_agent",
  "pre_tts_message": "Sure, let me connect you with a live agent. Please hold for a moment."
}`} />

  <h3 id="builtin-example-time">Get Current Time</h3>

  <CodeBlock lang="json" filename="get-current-time.json" code={`{
  "type": "builtin",
  "name": "get_current_time",
  "description": "Get the current date and time when the customer asks what time it is or when time context is needed",
  "handler": "get_current_time",
  "pre_tts_message": null
}`} />

  <!-- ───────── ConfigPanel: Global Function List ───────── -->
  <h2 id="global-function-list">Recommended Global Function Set</h2>
  <p>A typical template includes these global functions that cover most common cross-node needs:</p>

  <ConfigPanel title="Recommended Global Functions" icon="🌐" variant="customize">
    <div class="space-y-3 text-sm">
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">connect_to_live_agent</span>
        <span class="text-amber-400">builtin — warm transfer to human</span>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">get_current_time</span>
        <span class="text-amber-400">builtin — date/time context</span>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">check_order_status</span>
        <span class="text-amber-400">http — external API lookup</span>
      </div>
      <div class="flex items-baseline justify-between">
        <span class="text-muted-foreground">get_account_balance</span>
        <span class="text-amber-400">http — external API lookup</span>
      </div>
    </div>
  </ConfigPanel>

  <!-- ───────── Template Placement ───────── -->
  <h2 id="template-placement">Placing Global Functions in a Template</h2>
  <p>
    Global functions are defined in the <code>flow.global_functions</code> array of the template. Both HTTP and built-in
    functions can be mixed in the same array.
  </p>

  <CodeBlock lang="json" filename="global-functions-in-template.json" code={`{
  "flow": {
    "initial_node": "greeting",
    "nodes": [ "..." ],
    "global_functions": [
      {
        "type": "http",
        "name": "check_order_status",
        "description": "Look up order status when the customer asks",
        "properties": {
          "order_id": { "type": "string", "description": "Order ID" }
        },
        "required": ["order_id"],
        "pre_actions": [
          { "type": "tts_say", "text": "Let me check that for you." }
        ],
        "post_actions": [],
        "expected_fields": {
          "order_id": { "source": "llm" }
        },
        "http_request": {
          "url": "https://api.example.com/orders/<<order_id>>",
          "method": "GET",
          "headers": { "Authorization": "Bearer {api_secret}" },
          "query_params": {},
          "body": {},
          "auth": "none",
          "timeout": 10,
          "max_retries": 3
        }
      },
      {
        "type": "builtin",
        "name": "connect_to_live_agent",
        "description": "Transfer to a live agent when requested",
        "handler": "connect_to_live_agent",
        "pre_tts_message": "Connecting you now, please hold."
      },
      {
        "type": "builtin",
        "name": "get_current_time",
        "description": "Get the current date and time",
        "handler": "get_current_time",
        "pre_tts_message": null
      }
    ],
    "end_conversation_callbacks": []
  }
}`} />

  <!-- ───────── Best Practices ───────── -->
  <h2 id="best-practices">Best Practices</h2>

  <Callout type="tip" title="Global Function Design">
    <p>Use global HTTP functions for data lookups the agent might need in any node (order status, account info). Use built-in functions for platform operations (transfer, time). Keep node-specific logic and transitions in node functions.</p>
  </Callout>

  <ul>
    <li><strong>Always add <code>pre_actions</code> to HTTP functions:</strong> The API call blocks the conversation. A quick <code>tts_say</code> like "Let me check that" keeps the customer engaged.</li>
    <li><strong>Set reasonable timeouts:</strong> Global HTTP functions block the LLM. Use <code>timeout: 10</code> and <code>max_retries: 3</code> as sensible defaults.</li>
    <li><strong>Don't overload global functions:</strong> Only make functions global if they genuinely need to be accessible from multiple nodes. Node-specific tools should stay as node functions.</li>
    <li><strong>Use descriptive descriptions:</strong> Global functions compete with node functions for LLM attention. Make descriptions very specific about when to call them.</li>
  </ul>
</div>
