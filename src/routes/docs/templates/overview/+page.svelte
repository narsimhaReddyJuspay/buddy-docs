<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import FlowDiagram from '$lib/components/FlowDiagram.svelte';
  import ConfigPanel from '$lib/components/ConfigPanel.svelte';
  import ApiEndpoint from '$lib/components/ApiEndpoint.svelte';
</script>

<svelte:head><title>Templates Overview — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Templates Overview</h1>
  <p class="text-muted-foreground text-lg mb-8">
    Customize entire conversation flows with JSON — no code deployment required. Templates are the top-level configuration objects that define every aspect of your voice agent's behavior.
  </p>

  <!-- ───────── What Are Templates ───────── -->
  <h2 id="what-are-templates">What Are Templates?</h2>
  <p>
    A <strong>Template</strong> is the master blueprint for a voice agent conversation. It encapsulates the full conversation graph — nodes, transitions, functions, hooks, variables, and provider configuration — all as structured JSON. Every outbound or inbound call on Breeze Buddy is driven by a template.
  </p>
  <p>
    Templates let you customize <em>everything</em> about a conversation without writing or deploying code. Change how the agent greets callers, what data it collects, when it transfers to a human, and how it reports outcomes — all by editing JSON and pushing it through the API.
  </p>

  <Callout type="tip" title="No-Code Deployment">
    <p>Templates are loaded fresh for every call. Update a template via the API and the next call uses the new version — no restart, no redeployment, no downtime. Iterate on conversation logic as fast as you can edit JSON.</p>
  </Callout>

  <FlowDiagram steps={["Author Template JSON", "POST to API", "Push Lead", "Cron Picks Up Lead", "Template Loaded at Call Time", "Conversation Executes"]} variant="customize" />

  <!-- ───────── Template Model ───────── -->
  <h2 id="template-model">TemplateModel Fields</h2>
  <p>
    <code>TemplateModel</code> is the top-level data structure. It holds the flow definition, configuration overrides, secrets, payload schemas, and metadata.
  </p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>id</code></td><td><code>UUID</code></td><td>Unique identifier for the template (auto-generated)</td></tr>
        <tr><td><code>reseller_id</code></td><td><code>UUID</code></td><td>ID of the reseller that owns this template</td></tr>
        <tr><td><code>merchant_id</code></td><td><code>UUID</code></td><td>ID of the merchant this template belongs to</td></tr>
        <tr><td><code>name</code></td><td><code>string</code></td><td>Human-readable name (e.g. <code>"appointment-reminder"</code>, <code>"order-followup"</code>)</td></tr>
        <tr><td><code>flow</code></td><td><code>FlowModel</code></td><td>The conversation flow — nodes, global functions, and end-of-conversation callbacks</td></tr>
        <tr><td><code>expected_payload_schema</code></td><td><code>JSON Schema</code></td><td>Validates the lead payload before the call starts. Ensures required variables are present.</td></tr>
        <tr><td><code>expected_callback_response_schema</code></td><td><code>JSON Schema</code></td><td>Validates callback response payloads from external services</td></tr>
        <tr><td><code>configurations</code></td><td><code>object</code></td><td>Template-level config overrides — STT, TTS, VAD, LLM, interruption, etc.</td></tr>
        <tr><td><code>secrets</code></td><td><code>object</code></td><td>Template-level secrets for variable substitution (API keys, webhook URLs)</td></tr>
        <tr><td><code>outbound_number_id</code></td><td><code>UUID | null</code></td><td>Default outbound number for calls on this template</td></tr>
        <tr><td><code>is_active</code></td><td><code>boolean</code></td><td>Whether the template is active and eligible for calls</td></tr>
      </tbody>
    </table>
  </div>

  <!-- ───────── Flow Model ───────── -->
  <h2 id="flow-model">FlowModel Structure</h2>
  <p>
    The <code>flow</code> field contains the complete conversation graph. It specifies which node to start on, the list of nodes defining each conversation phase, global functions available everywhere, and callbacks that fire when the conversation ends.
  </p>

  <FlowDiagram steps={["initial_node", "Node A (functions → transition)", "Node B (functions → transition)", "Node C (end_conversation)", "end_conversation_callbacks fire"]} variant="customize" />

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>initial_node</code></td><td><code>string</code></td><td>Name of the first node the agent enters when the conversation starts</td></tr>
        <tr><td><code>nodes</code></td><td><code>FlowNodeModel[]</code></td><td>Array of flow nodes — each defines a distinct phase of the conversation</td></tr>
        <tr><td><code>global_functions</code></td><td><code>array</code></td><td>Functions available in every node (HTTP lookups, built-in handlers)</td></tr>
        <tr><td><code>end_conversation_callbacks</code></td><td><code>array</code></td><td>HTTP callbacks fired when the conversation ends (outcome reporting)</td></tr>
      </tbody>
    </table>
  </div>

  <!-- ───────── Minimal Example ConfigPanel ───────── -->
  <h2 id="minimal-example">Minimal Template</h2>
  <p>The simplest possible template — a single greeting node with one function:</p>

  <ConfigPanel title="Minimal Template Structure" icon="📋" variant="customize">
    <div class="space-y-3 text-sm">
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">Nodes</span>
        <code class="text-amber-400">1 (greeting)</code>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">Functions</span>
        <code class="text-amber-400">1 (end_call)</code>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">Global Functions</span>
        <code class="text-amber-400">0</code>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">Variables Used</span>
        <code class="text-amber-400">{`{customer_name}`}</code>
      </div>
      <div class="flex items-baseline justify-between">
        <span class="text-muted-foreground">Payload Validation</span>
        <code class="text-amber-400">customer_name (required)</code>
      </div>
    </div>
  </ConfigPanel>

  <CodeBlock lang="json" filename="minimal-template.json" code={`{
  "name": "simple-greeter",
  "flow": {
    "initial_node": "greeting",
    "nodes": [
      {
        "node_name": "greeting",
        "task_messages": [
          {
            "role": "system",
            "content": "You are a friendly assistant. Greet the customer by name: {customer_name}. Ask how you can help them today."
          }
        ],
        "role_messages": [],
        "pre_actions": [],
        "post_actions": [],
        "functions": [
          {
            "name": "end_call",
            "description": "Customer is done and wants to end the call",
            "properties": {},
            "required": [],
            "transition_to": null,
            "hooks": [
              {
                "name": "update_outcome_in_database",
                "expected_fields": {
                  "outcome": { "source": "static", "value": "completed" }
                }
              }
            ]
          }
        ]
      }
    ],
    "global_functions": [],
    "end_conversation_callbacks": []
  },
  "expected_payload_schema": {
    "type": "object",
    "properties": {
      "customer_name": { "type": "string" }
    },
    "required": ["customer_name"]
  },
  "configurations": {},
  "secrets": {},
  "is_active": true
}`} />

  <!-- ───────── Complete Example ───────── -->
  <h2 id="complete-example">Complete Template Example</h2>
  <p>A realistic appointment-reminder template with multiple nodes, transitions, hooks, and global functions:</p>

  <CodeBlock lang="json" filename="appointment-reminder.json" code={`{
  "name": "appointment-reminder",
  "flow": {
    "initial_node": "greeting",
    "nodes": [
      {
        "node_name": "greeting",
        "task_messages": [
          {
            "role": "system",
            "content": "You are calling {customer_name} to remind them about their appointment with {doctor_name} on {appointment_date} at {appointment_time}. Be polite and professional. Confirm they can make it."
          }
        ],
        "role_messages": [],
        "pre_actions": [
          { "type": "tts_say", "text": "Hello! This is a call from {clinic_name}." }
        ],
        "post_actions": [],
        "functions": [
          {
            "name": "appointment_confirmed",
            "description": "Customer confirms they will attend the appointment",
            "properties": {},
            "required": [],
            "transition_to": "farewell",
            "hooks": [
              {
                "name": "update_outcome_in_database",
                "expected_fields": {
                  "outcome": { "source": "static", "value": "confirmed" }
                }
              }
            ]
          },
          {
            "name": "wants_to_reschedule",
            "description": "Customer wants to reschedule to a different date or time",
            "properties": {
              "new_date": { "type": "string", "description": "New preferred date (YYYY-MM-DD)" },
              "new_time": { "type": "string", "description": "New preferred time" }
            },
            "required": ["new_date"],
            "transition_to": "farewell",
            "hooks": [
              {
                "name": "update_outcome_in_database",
                "expected_fields": {
                  "outcome": { "source": "static", "value": "rescheduled" },
                  "new_date": { "source": "llm" },
                  "new_time": { "source": "llm" }
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
                  "url": "{webhook_url}/reschedule",
                  "method": "POST",
                  "headers": { "Authorization": "Bearer {api_token}" },
                  "body": {
                    "lead_id": "<<lead_id>>",
                    "date": "<<new_date>>",
                    "time": "<<new_time>>"
                  }
                }
              }
            ]
          }
        ]
      },
      {
        "node_name": "farewell",
        "task_messages": [
          {
            "role": "system",
            "content": "Thank the customer and wish them a great day. End the conversation naturally."
          }
        ],
        "role_messages": [],
        "pre_actions": [],
        "post_actions": [{ "type": "end_conversation" }],
        "functions": []
      }
    ],
    "global_functions": [
      {
        "type": "builtin",
        "name": "connect_to_live_agent",
        "description": "Transfer to a live agent when the customer requests it",
        "handler": "connect_to_live_agent",
        "pre_tts_message": "Let me connect you with someone who can help."
      }
    ],
    "end_conversation_callbacks": []
  },
  "expected_payload_schema": {
    "type": "object",
    "properties": {
      "customer_name": { "type": "string" },
      "doctor_name": { "type": "string" },
      "appointment_date": { "type": "string" },
      "appointment_time": { "type": "string" }
    },
    "required": ["customer_name", "doctor_name", "appointment_date", "appointment_time"]
  },
  "configurations": {
    "tts": { "voice": "alloy" },
    "vad": { "stop_secs": 1.2 }
  },
  "secrets": {
    "api_token": "sk-live-abc123",
    "webhook_url": "https://hooks.example.com/breeze"
  },
  "is_active": true
}`} />

  <!-- ───────── CRUD Operations ───────── -->
  <h2 id="crud-operations">Managing Templates via API</h2>
  <p>Templates are stored in PostgreSQL as JSONB and managed through standard CRUD endpoints:</p>

  <ApiEndpoint method="POST" path="/agent/voice/breeze-buddy/templates" description="Create a new template. Request body is the full TemplateModel JSON." />
  <ApiEndpoint method="GET" path="/agent/voice/breeze-buddy/templates/{'{template_id}'}" description="Retrieve a template by ID." />
  <ApiEndpoint method="PUT" path="/agent/voice/breeze-buddy/templates/{'{template_id}'}" description="Update an existing template. Replaces the entire definition." />
  <ApiEndpoint method="DELETE" path="/agent/voice/breeze-buddy/templates/{'{template_id}'}" description="Delete a template. Only inactive templates with no pending leads can be deleted." />

  <Callout type="info" title="Hot Reload">
    <p>Templates are loaded fresh for each call. Changes take effect on the next call — no restart or redeployment required.</p>
  </Callout>

  <!-- ───────── Template Lifecycle ───────── -->
  <h2 id="template-lifecycle">Template Lifecycle</h2>
  <FlowDiagram steps={["Author JSON", "POST to API", "Validate Schema", "Store in PostgreSQL", "Lead References Template", "Agent Loads at Call Time"]} variant="customize" />

  <!-- ───────── Key Customization Surfaces ───────── -->
  <h2 id="customization-surfaces">Key Customization Surfaces</h2>
  <p>Templates offer deep customization across every layer of the conversation:</p>

  <div class="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
    <div class="card-customize group transition-all duration-200 hover:-translate-y-0.5">
      <div class="p-5">
        <h3 class="text-sm font-semibold text-amber-400 mb-2">🔀 Flow Nodes</h3>
        <p class="text-xs text-muted-foreground">Define conversation phases, system prompts, pre/post actions, and per-node config overrides.</p>
        <a href="/docs/templates/flow-nodes" class="text-xs text-amber-400/80 hover:text-amber-400 mt-2 inline-block">Learn more →</a>
      </div>
    </div>
    <div class="card-customize group transition-all duration-200 hover:-translate-y-0.5">
      <div class="p-5">
        <h3 class="text-sm font-semibold text-amber-400 mb-2">⚡ Functions &amp; Hooks</h3>
        <p class="text-xs text-muted-foreground">LLM-callable tools with side-effect hooks for HTTP calls, database updates, and node transitions.</p>
        <a href="/docs/templates/functions-hooks" class="text-xs text-amber-400/80 hover:text-amber-400 mt-2 inline-block">Learn more →</a>
      </div>
    </div>
    <div class="card-customize group transition-all duration-200 hover:-translate-y-0.5">
      <div class="p-5">
        <h3 class="text-sm font-semibold text-amber-400 mb-2">🌐 Global Functions</h3>
        <p class="text-xs text-muted-foreground">Cross-node functions for data lookups, live agent transfer, and utility operations.</p>
        <a href="/docs/templates/global-functions" class="text-xs text-amber-400/80 hover:text-amber-400 mt-2 inline-block">Learn more →</a>
      </div>
    </div>
    <div class="card-customize group transition-all duration-200 hover:-translate-y-0.5">
      <div class="p-5">
        <h3 class="text-sm font-semibold text-amber-400 mb-2">📝 Variables</h3>
        <p class="text-xs text-muted-foreground">Dynamic placeholder syntax for injecting lead data, secrets, and runtime values into any part of the template.</p>
        <a href="/docs/templates/variables" class="text-xs text-amber-400/80 hover:text-amber-400 mt-2 inline-block">Learn more →</a>
      </div>
    </div>
  </div>
</div>
