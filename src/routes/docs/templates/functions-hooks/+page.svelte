<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import FlowDiagram from '$lib/components/FlowDiagram.svelte';
  import ConfigPanel from '$lib/components/ConfigPanel.svelte';
</script>

<svelte:head><title>Functions &amp; Hooks — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Functions &amp; Hooks</h1>
  <p class="text-muted-foreground text-lg mb-8">
    Customize agent behavior with LLM-callable functions, side-effect hooks, and transition logic. Functions are the tools that give your agent the ability to act.
  </p>

  <!-- ───────── Overview ───────── -->
  <h2 id="overview">Overview</h2>
  <p>
    Functions are the tools the LLM can invoke during a conversation. Each node defines its own set of functions,
    and the LLM decides which to call based on the function's <code>description</code>. When a function is called,
    its hooks fire as side effects (fire-and-forget), and the conversation optionally transitions to a new node.
  </p>

  <FlowDiagram steps={["LLM decides to call function", "Extract arguments from conversation", "Fire hooks (async, non-blocking)", "Execute transition_to (if set)", "Enter new node"]} variant="customize" />

  <!-- ───────── Function Fields ───────── -->
  <h2 id="flow-function">FlowFunction Fields</h2>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>name</code></td><td><code>string</code></td><td>Unique function name within the node (used as the tool name for the LLM)</td></tr>
        <tr><td><code>description</code></td><td><code>string</code></td><td>Tells the LLM <strong>when</strong> to call this function — be specific and descriptive</td></tr>
        <tr><td><code>properties</code></td><td><code>JSON Schema</code></td><td>Parameter definitions following JSON Schema format — defines what the LLM should extract</td></tr>
        <tr><td><code>required</code></td><td><code>string[]</code></td><td>List of required parameter names from <code>properties</code></td></tr>
        <tr><td><code>transition_to</code></td><td><code>Optional[string]</code></td><td>Node to transition to after execution. <code>null</code> = stay on current node</td></tr>
        <tr><td><code>hooks</code></td><td><code>List[HookConfig]</code></td><td>Side-effect hooks fired asynchronously when this function is called</td></tr>
      </tbody>
    </table>
  </div>

  <Callout type="info" title="Description Matters">
    <p>The <code>description</code> field is critical — it's what the LLM uses to decide when to invoke the function. Write clear, specific descriptions. For example: <em>"Customer has confirmed the appointment date and time"</em> is much better than <em>"Confirm appointment"</em>.</p>
  </Callout>

  <!-- ───────── How LLM Uses Functions ───────── -->
  <h2 id="llm-function-usage">How the LLM Uses Functions</h2>
  <p>
    Functions are registered as <strong>tools</strong> in the LLM context. The LLM reads each function's <code>name</code>,
    <code>description</code>, and <code>properties</code> to decide when and how to call them. The flow:
  </p>
  <ol>
    <li>The LLM receives the node's task messages plus the list of available functions (node + global)</li>
    <li>Based on the conversation, the LLM decides to call a function and extracts argument values</li>
    <li>The system validates arguments against <code>properties</code> and <code>required</code></li>
    <li>Hooks execute asynchronously (non-blocking)</li>
    <li>If <code>transition_to</code> is set, the conversation moves to that node</li>
  </ol>

  <!-- ───────── Properties Schema ───────── -->
  <h2 id="properties-schema">Properties (JSON Schema)</h2>
  <p>
    The <code>properties</code> field follows standard <strong>JSON Schema</strong> format. Each property defines a parameter
    the LLM should extract from the conversation.
  </p>

  <CodeBlock lang="json" filename="function-properties.json" code={`{
  "properties": {
    "preferred_date": {
      "type": "string",
      "description": "The customer's preferred date in YYYY-MM-DD format"
    },
    "time_of_day": {
      "type": "string",
      "enum": ["morning", "afternoon", "evening"],
      "description": "Preferred time of day"
    },
    "notes": {
      "type": "string",
      "description": "Any additional notes from the customer"
    }
  },
  "required": ["preferred_date", "time_of_day"]
}`} />

  <!-- ───────── Transition Behavior ───────── -->
  <h2 id="transition-behavior">Transition Behavior</h2>
  <ul>
    <li><code>transition_to: "next_node"</code> — conversation moves to the named node after function execution</li>
    <li><code>transition_to: null</code> — conversation stays on the current node (useful for data collection without state change)</li>
  </ul>

  <!-- ───────── Function Examples ───────── -->
  <h2 id="function-examples">Function Examples</h2>

  <h3 id="navigate-function">Navigation Function</h3>
  <p>A function that transitions the conversation to a new node:</p>

  <CodeBlock lang="json" filename="navigate-to-node.json" code={`{
  "name": "wants_to_reschedule",
  "description": "Customer indicates they cannot make the current appointment and wants to find a new time",
  "properties": {},
  "required": [],
  "transition_to": "reschedule_node",
  "hooks": [
    {
      "name": "update_outcome_in_database",
      "expected_fields": {
        "outcome": { "source": "static", "value": "reschedule_requested" }
      }
    }
  ]
}`} />

  <h3 id="collect-data-function">Data Collection Function</h3>
  <p>A function that collects structured data from the conversation:</p>

  <CodeBlock lang="json" filename="collect-email.json" code={`{
  "name": "collect_email",
  "description": "Customer has provided their email address for confirmation",
  "properties": {
    "email": {
      "type": "string",
      "description": "The customer's email address"
    },
    "consent": {
      "type": "boolean",
      "description": "Whether the customer consents to receiving emails"
    }
  },
  "required": ["email"],
  "transition_to": "confirm_details",
  "hooks": [
    {
      "name": "update_outcome_in_database",
      "expected_fields": {
        "outcome": { "source": "static", "value": "email_collected" },
        "email": { "source": "llm" },
        "consent": { "source": "llm" }
      }
    },
    {
      "name": "send_http_request",
      "expected_fields": {
        "email": { "source": "llm" },
        "customer_id": { "source": "static", "value": "{customer_id}" }
      },
      "http_request": {
        "url": "https://api.example.com/contacts/update",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer {api_token}",
          "Content-Type": "application/json"
        },
        "body": {
          "id": "{customer_id}",
          "email": "<<email>>"
        }
      }
    }
  ]
}`} />

  <h3 id="end-call-function">End Call Function</h3>
  <p>A function that stays on the current node (farewell) and records the outcome:</p>

  <CodeBlock lang="json" filename="end-call.json" code={`{
  "name": "end_call",
  "description": "Customer has finished the conversation and is ready to hang up",
  "properties": {
    "satisfaction": {
      "type": "string",
      "enum": ["satisfied", "neutral", "unsatisfied"],
      "description": "Overall customer satisfaction inferred from the conversation"
    }
  },
  "required": [],
  "transition_to": null,
  "hooks": [
    {
      "name": "update_outcome_in_database",
      "expected_fields": {
        "outcome": { "source": "static", "value": "completed" },
        "satisfaction": { "source": "llm" },
        "completed_at": { "source": "computed", "value": "utc_now_minus_hours:0" }
      }
    }
  ]
}`} />

  <!-- ───────── Hooks ───────── -->
  <h2 id="hooks">Hooks: Pre &amp; Post Actions on Functions</h2>
  <p>
    Hooks are fire-and-forget side effects that execute asynchronously (via <code>asyncio.create_task</code>) when a function
    is called. They do <strong>not</strong> block the conversation — the agent continues immediately.
  </p>

  <Callout type="warning" title="Fire-and-Forget">
    <p>Hooks are dispatched via <code>asyncio.create_task</code> and do <strong>not</strong> block the conversation. If a hook fails, the conversation continues unaffected. Check logs for hook execution errors.</p>
  </Callout>

  <h3 id="hook-config">HookConfig Fields</h3>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>name</code></td><td><code>string</code></td><td>Hook identifier — determines which handler runs</td></tr>
        <tr><td><code>expected_fields</code></td><td><code>Dict[string, FieldConfig]</code></td><td>Map of field names to their source configuration</td></tr>
        <tr><td><code>http_request</code></td><td><code>Optional[HttpRequestConfig]</code></td><td>HTTP request config (required for <code>send_http_request</code> hook)</td></tr>
      </tbody>
    </table>
  </div>

  <!-- ───────── Hook Types ───────── -->
  <h2 id="hook-types">Available Hook Types</h2>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Hook Name</th><th>Description</th><th>Requires <code>http_request</code></th><th>Use Case</th></tr></thead>
      <tbody>
        <tr><td><code>update_outcome_in_database</code></td><td>Updates the lead's outcome and metadata fields in the database</td><td>No</td><td>Recording call results, saving extracted data</td></tr>
        <tr><td><code>send_http_request</code></td><td>Fires an HTTP request to an external service (fire-and-forget)</td><td>Yes</td><td>CRM updates, webhook notifications, appointment bookings</td></tr>
        <tr><td><code>set_transfer_flag</code></td><td>Sets a Redis context flag for warm transfer coordination</td><td>No</td><td>Flagging calls for live agent handoff</td></tr>
      </tbody>
    </table>
  </div>

  <!-- ───────── Field Sources ───────── -->
  <h2 id="field-sources">Field Source Types</h2>
  <p>Each field in <code>expected_fields</code> specifies where its value comes from:</p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Source</th><th>Value Field</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>static</code></td><td>Required</td><td>Hardcoded value — set at template design time. Supports <code>{`{variable}`}</code> substitution.</td></tr>
        <tr><td><code>llm</code></td><td>Not used</td><td>Value comes from the LLM function call arguments (extracted from conversation)</td></tr>
        <tr><td><code>computed</code></td><td>Required</td><td>Dynamic value computed at runtime (e.g. <code>utc_now_minus_hours:1</code>)</td></tr>
      </tbody>
    </table>
  </div>

  <CodeBlock lang="json" filename="field-sources.json" code={`{
  "expected_fields": {
    "outcome": { "source": "static", "value": "confirmed" },
    "campaign_id": { "source": "static", "value": "{campaign_id}" },
    "preferred_date": { "source": "llm" },
    "customer_reason": { "source": "llm" },
    "called_at": { "source": "computed", "value": "utc_now_minus_hours:0" }
  }
}`} />

  <!-- ───────── Hook Examples ───────── -->
  <h2 id="hook-examples">Hook Examples</h2>

  <h3 id="hook-update-outcome">update_outcome_in_database</h3>
  <p>Updates the lead record with outcome information and metadata extracted during the conversation.</p>

  <CodeBlock lang="json" code={`{
  "name": "update_outcome_in_database",
  "expected_fields": {
    "outcome": { "source": "static", "value": "interested" },
    "preferred_date": { "source": "llm" },
    "notes": { "source": "llm" }
  }
}`} />

  <h3 id="hook-send-http">send_http_request</h3>
  <p>Sends an HTTP request to an external API. Fire-and-forget — does not block the conversation.</p>

  <CodeBlock lang="json" code={`{
  "name": "send_http_request",
  "expected_fields": {
    "customer_name": { "source": "static", "value": "{customer_name}" },
    "outcome": { "source": "static", "value": "confirmed" },
    "appointment_date": { "source": "llm" }
  },
  "http_request": {
    "url": "https://api.example.com/webhooks/call-result",
    "method": "POST",
    "headers": {
      "Authorization": "Bearer {api_secret}",
      "Content-Type": "application/json"
    },
    "body": {
      "name": "<<customer_name>>",
      "result": "<<outcome>>",
      "date": "<<appointment_date>>"
    },
    "auth": "none",
    "timeout": 10,
    "max_retries": 3
  }
}`} />

  <h3 id="hook-set-transfer">set_transfer_flag</h3>
  <p>Sets the warm transfer context in Redis, signaling that the call should be transferred to a live agent.</p>

  <CodeBlock lang="json" code={`{
  "name": "set_transfer_flag",
  "expected_fields": {
    "transfer_reason": { "source": "llm" }
  }
}`} />

  <!-- ───────── ConfigPanel: Complete Function ───────── -->
  <h2 id="complete-function">Complete Function with Hooks</h2>
  <p>A full function definition showing all features together:</p>

  <ConfigPanel title="Function: appointment_rescheduled" icon="📅" variant="customize">
    <div class="space-y-3 text-sm">
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">Parameters</span>
        <code class="text-amber-400">new_date, new_time, reason</code>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">Required</span>
        <code class="text-amber-400">new_date, new_time</code>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">Transition</span>
        <code class="text-amber-400">→ farewell</code>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">Hook 1</span>
        <code class="text-amber-400">update_outcome_in_database</code>
      </div>
      <div class="flex items-baseline justify-between">
        <span class="text-muted-foreground">Hook 2</span>
        <code class="text-amber-400">send_http_request (reschedule API)</code>
      </div>
    </div>
  </ConfigPanel>

  <CodeBlock lang="json" filename="complete-function.json" code={`{
  "name": "appointment_rescheduled",
  "description": "Customer wants to reschedule their appointment to a new date and time",
  "properties": {
    "new_date": {
      "type": "string",
      "description": "New appointment date in YYYY-MM-DD format"
    },
    "new_time": {
      "type": "string",
      "description": "New appointment time in HH:MM format"
    },
    "reason": {
      "type": "string",
      "description": "Reason for rescheduling"
    }
  },
  "required": ["new_date", "new_time"],
  "transition_to": "farewell",
  "hooks": [
    {
      "name": "update_outcome_in_database",
      "expected_fields": {
        "outcome": { "source": "static", "value": "rescheduled" },
        "new_date": { "source": "llm" },
        "new_time": { "source": "llm" },
        "reason": { "source": "llm" },
        "rescheduled_at": { "source": "computed", "value": "utc_now_minus_hours:0" }
      }
    },
    {
      "name": "send_http_request",
      "expected_fields": {
        "new_date": { "source": "llm" },
        "new_time": { "source": "llm" },
        "lead_id": { "source": "static", "value": "{lead_id}" }
      },
      "http_request": {
        "url": "https://api.example.com/appointments/reschedule",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer {api_secret}",
          "Content-Type": "application/json"
        },
        "query_params": {},
        "body": {
          "lead_id": "<<lead_id>>",
          "date": "<<new_date>>",
          "time": "<<new_time>>"
        },
        "auth": "none",
        "timeout": 10,
        "max_retries": 3
      }
    }
  ]
}`} />

  <!-- ───────── HTTP Request Config ───────── -->
  <h2 id="http-request-config">HttpRequestConfig</h2>
  <p>Configuration for outbound HTTP requests used by the <code>send_http_request</code> hook:</p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Field</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>url</code></td><td><code>string</code></td><td>—</td><td>Target URL (supports <code>{`{variable}`}</code> substitution)</td></tr>
        <tr><td><code>method</code></td><td><code>"GET" | "POST" | "PUT" | "PATCH" | "DELETE"</code></td><td>—</td><td>HTTP method</td></tr>
        <tr><td><code>headers</code></td><td><code>object</code></td><td><code>{`{}`}</code></td><td>Request headers (supports <code>{`{variable}`}</code> substitution)</td></tr>
        <tr><td><code>query_params</code></td><td><code>object</code></td><td><code>{`{}`}</code></td><td>URL query parameters</td></tr>
        <tr><td><code>body</code></td><td><code>object</code></td><td><code>{`{}`}</code></td><td>Request body — <code>{`{variable}`}</code> for template vars, <code>&lt;&lt;field&gt;&gt;</code> for hook fields</td></tr>
        <tr><td><code>auth</code></td><td><code>"none" | "bearer" | "basic" | "api_key"</code></td><td><code>"none"</code></td><td>Authentication method</td></tr>
        <tr><td><code>timeout</code></td><td><code>number</code></td><td><code>10</code></td><td>Request timeout in seconds</td></tr>
        <tr><td><code>max_retries</code></td><td><code>number</code></td><td><code>3</code></td><td>Maximum retry attempts on failure</td></tr>
      </tbody>
    </table>
  </div>

  <!-- ───────── Naming Best Practices ───────── -->
  <h2 id="best-practices">Best Practices</h2>

  <Callout type="tip" title="Function Naming Conventions">
    <p>Use descriptive, action-oriented names that reflect <strong>what happened</strong>, not what to do. Examples: <code>appointment_confirmed</code>, <code>wants_to_reschedule</code>, <code>email_collected</code>. This helps the LLM understand when the condition is met.</p>
  </Callout>

  <ul>
    <li><strong>Descriptions over names:</strong> The LLM relies primarily on the <code>description</code> field. Make it a clear sentence explaining the trigger condition.</li>
    <li><strong>One function per outcome:</strong> Each distinct conversation outcome should have its own function with a clear transition path.</li>
    <li><strong>Use enums for constrained values:</strong> When a parameter has a limited set of valid values, use <code>enum</code> in the JSON Schema.</li>
    <li><strong>Mark required fields:</strong> Only mark parameters as <code>required</code> if the function truly cannot proceed without them.</li>
    <li><strong>Hook ordering:</strong> Place <code>update_outcome_in_database</code> hooks first, then <code>send_http_request</code> hooks. DB updates are faster and more reliable.</li>
  </ul>
</div>
