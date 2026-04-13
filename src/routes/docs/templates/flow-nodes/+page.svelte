<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import FlowDiagram from '$lib/components/FlowDiagram.svelte';
  import ConfigPanel from '$lib/components/ConfigPanel.svelte';
</script>

<svelte:head><title>Flow Nodes — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Flow Nodes</h1>
  <p class="text-muted-foreground text-lg mb-8">
    Deep dive into FlowNodeModel — the building blocks of every conversation flow. Each node defines a distinct phase with its own prompts, actions, functions, and config overrides.
  </p>

  <!-- ───────── Overview ───────── -->
  <h2 id="overview">Overview</h2>
  <p>
    Each node in a template's flow represents a distinct phase of the conversation. The agent enters the
    <code>initial_node</code> at the start and transitions between nodes via function calls. Nodes define what
    the LLM should do (<strong>task messages</strong>), what happens on entry/exit (<strong>pre/post actions</strong>),
    and what tools the LLM can invoke (<strong>functions</strong>).
  </p>
  <p>
    Nodes are the primary unit of customization in Breeze Buddy. Every conversation — from simple greetings to complex multi-step workflows — is assembled by composing nodes and wiring them together through function transitions.
  </p>

  <FlowDiagram steps={["Enter Node", "Run pre_actions", "LLM processes task_messages", "LLM calls function", "Run hooks + post_actions", "Transition to next node"]} variant="customize" />

  <!-- ───────── FlowNode Fields ───────── -->
  <h2 id="flow-node-model">FlowNodeModel Fields</h2>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>node_name</code></td><td><code>string</code></td><td>Unique identifier for this node within the flow</td></tr>
        <tr><td><code>task_messages</code></td><td><code>List[TaskMessage]</code></td><td>System/user messages that instruct the LLM what to do in this node</td></tr>
        <tr><td><code>role_messages</code></td><td><code>List[TaskMessage]</code></td><td>Additional role-specific messages (e.g. persona instructions, tone directives)</td></tr>
        <tr><td><code>pre_actions</code></td><td><code>List[FlowAction]</code></td><td>Actions executed <strong>before</strong> the LLM processes task messages</td></tr>
        <tr><td><code>post_actions</code></td><td><code>List[FlowAction]</code></td><td>Actions executed <strong>after</strong> leaving the node</td></tr>
        <tr><td><code>functions</code></td><td><code>List[FlowFunction]</code></td><td>Node-scoped functions the LLM can call (tools) — used for transitions and data collection</td></tr>
        <tr><td><code>vad_config</code></td><td><code>Optional[VadConfig]</code></td><td>Node-level VAD override (resets to template default on transition)</td></tr>
        <tr><td><code>interruption</code></td><td><code>Optional[InterruptionConfig]</code></td><td>Node-level interruption override (resets to template default on transition)</td></tr>
        <tr><td><code>input_collection</code></td><td><code>Optional[InputCollectionConfig]</code></td><td>DTMF/speech input collection config for this node</td></tr>
      </tbody>
    </table>
  </div>

  <!-- ───────── ConfigPanel ───────── -->
  <ConfigPanel title="FlowNode JSON Structure" icon="🧩" variant="customize">
    <div class="space-y-3 text-sm">
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">Identity</span>
        <code class="text-amber-400">node_name</code>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">LLM Instructions</span>
        <code class="text-amber-400">task_messages + role_messages</code>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">Lifecycle</span>
        <code class="text-amber-400">pre_actions → LLM → post_actions</code>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">Tools</span>
        <code class="text-amber-400">functions (with hooks + transitions)</code>
      </div>
      <div class="flex items-baseline justify-between">
        <span class="text-muted-foreground">Overrides</span>
        <code class="text-amber-400">vad_config, interruption, input_collection</code>
      </div>
    </div>
  </ConfigPanel>

  <!-- ───────── Task Messages ───────── -->
  <h2 id="task-messages">Task Messages</h2>
  <p>
    Task messages are the LLM instructions for a node. They follow the standard chat-completion message format
    and support <code>{`{variable}`}</code> placeholder syntax for dynamic content. These are the <strong>primary way to customize what the agent says and does</strong> in each conversation phase.
  </p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>role</code></td><td><code>string</code></td><td>Message role — typically <code>"system"</code> or <code>"user"</code></td></tr>
        <tr><td><code>content</code></td><td><code>string</code></td><td>Message content — supports <code>{`{variable}`}</code> placeholders resolved at runtime</td></tr>
      </tbody>
    </table>
  </div>

  <CodeBlock lang="json" filename="task-message-example.json" code={`{
  "task_messages": [
    {
      "role": "system",
      "content": "You are calling {customer_name} about their appointment on {appointment_date} with {doctor_name}. Be polite and professional. Your goals: 1) Confirm they can make the appointment, 2) If not, collect a preferred reschedule date."
    }
  ],
  "role_messages": [
    {
      "role": "system",
      "content": "Speak in a warm, conversational Indian English tone. Keep responses under 2 sentences. Use the customer's first name."
    }
  ]
}`} />

  <Callout type="tip" title="Variable Placeholders">
    <p>Any <code>{`{placeholder}`}</code> in message content is resolved from the lead payload, template secrets, or credential secrets at call time. See <a href="/docs/templates/variables">Variable Substitution</a> for details.</p>
  </Callout>

  <!-- ───────── Flow Actions ───────── -->
  <h2 id="flow-actions">Flow Actions (Pre &amp; Post)</h2>
  <p>
    Actions execute at specific lifecycle points of a node. <code>pre_actions</code> run before the LLM
    processes the node; <code>post_actions</code> run after the node is exited.
  </p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>type</code></td><td><code>"tts_say" | "end_conversation" | "function"</code></td><td>The action type to execute</td></tr>
        <tr><td><code>text</code></td><td><code>Optional[string]</code></td><td>Text to speak (for <code>tts_say</code> type)</td></tr>
        <tr><td><code>handler</code></td><td><code>Optional[string]</code></td><td>Handler function name (for <code>function</code> type)</td></tr>
        <tr><td><code>args</code></td><td><code>Optional[object]</code></td><td>Arguments to pass to the handler function</td></tr>
      </tbody>
    </table>
  </div>

  <h3 id="action-types">Action Types</h3>

  <h4 id="tts-say"><code>tts_say</code></h4>
  <p>Speaks the given text immediately via TTS. Commonly used in <code>pre_actions</code> to greet the customer before the LLM starts processing. Supports <code>{`{variable}`}</code> substitution.</p>

  <CodeBlock lang="json" code={`{
  "type": "tts_say",
  "text": "Hello {customer_name}! Please hold for just a moment while I pull up your information."
}`} />

  <h4 id="end-conversation"><code>end_conversation</code></h4>
  <p>Ends the conversation immediately. Typically used in <code>post_actions</code> of a farewell node.</p>

  <CodeBlock lang="json" code={`{
  "type": "end_conversation"
}`} />

  <h4 id="function-action"><code>function</code></h4>
  <p>Calls an internal handler function with optional arguments. Useful for muting STT, playing audio, or triggering platform operations.</p>

  <CodeBlock lang="json" code={`{
  "type": "function",
  "handler": "mute_stt",
  "args": { "duration": 3 }
}`} />

  <h3 id="pre-actions">Pre-Actions</h3>
  <p>
    <code>pre_actions</code> run <strong>before</strong> the LLM processes the node's task messages. Common use cases:
  </p>
  <ul>
    <li>Speaking an initial greeting via <code>tts_say</code> so the customer hears something immediately</li>
    <li>Muting STT temporarily while audio plays</li>
    <li>Calling a setup handler before the conversation begins</li>
  </ul>

  <h3 id="post-actions">Post-Actions</h3>
  <p>
    <code>post_actions</code> run <strong>after</strong> leaving the node (triggered by a function that transitions to another node). Common use cases:
  </p>
  <ul>
    <li>Ending the conversation after a farewell node</li>
    <li>Firing a cleanup handler</li>
  </ul>

  <!-- ───────── Node Transitions ───────── -->
  <h2 id="node-transitions">Node Transition Patterns</h2>
  <p>
    Nodes transition to other nodes through <strong>functions</strong>. When the LLM calls a function with a <code>transition_to</code> value, the conversation moves to that node. This is the only way to navigate between nodes.
  </p>

  <FlowDiagram steps={["greeting", "collect_details", "confirm_order", "farewell"]} variant="customize" />

  <p>Common transition patterns:</p>
  <ul>
    <li><strong>Linear flow:</strong> greeting → collect → confirm → farewell</li>
    <li><strong>Branching:</strong> greeting → (confirm OR reschedule) → farewell</li>
    <li><strong>Loopback:</strong> collect_details → (insufficient data? stay on collect_details) → confirm</li>
    <li><strong>Hub-and-spoke:</strong> main_menu → (billing | support | orders) → main_menu</li>
  </ul>

  <Callout type="info" title="Stay on Current Node">
    <p>Set <code>transition_to: null</code> on a function to stay on the current node after execution. This is useful for data collection functions where you want to gather more information without changing the conversation phase.</p>
  </Callout>

  <!-- ───────── Node-Level Overrides ───────── -->
  <h2 id="node-level-overrides">Per-Node Configuration Overrides</h2>
  <p>
    Nodes can override template-level VAD, interruption, and input collection settings. These overrides follow
    the <strong>reset-then-apply</strong> pattern — on every node transition, configs reset to template defaults first, then node-level overrides apply.
  </p>

  <Callout type="warning" title="Reset-then-Apply Pattern">
    <p>On every node transition, VAD, interruption, and input collection configs are <strong>reset to template defaults</strong> first, then the node-level overrides are applied. This prevents configuration bleed between nodes.</p>
  </Callout>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Override</th><th>Reset Behavior</th><th>Use Case</th></tr></thead>
      <tbody>
        <tr><td><code>vad_config</code></td><td>Reset to template VAD settings</td><td>Increase silence threshold for nodes expecting long pauses (thinking time)</td></tr>
        <tr><td><code>interruption</code></td><td>Reset to template interruption settings</td><td>Disable interruption during critical information delivery</td></tr>
        <tr><td><code>input_collection</code></td><td>Reset to <code>null</code> (disabled)</td><td>Enable DTMF input collection for specific nodes (e.g. OTP entry, menu selection)</td></tr>
      </tbody>
    </table>
  </div>

  <CodeBlock lang="json" filename="node-override-examples.json" code={`{
  "vad_config": {
    "stop_secs": 2.0
  },
  "interruption": {
    "allowed": false
  },
  "input_collection": {
    "type": "dtmf",
    "max_digits": 6,
    "timeout_secs": 15,
    "terminator": "#"
  }
}`} />

  <!-- ───────── Complete Node Example ───────── -->
  <h2 id="complete-node-example">Complete FlowNode Example</h2>
  <p>A fully populated node definition with task messages, pre/post actions, functions, hooks, and overrides:</p>

  <ConfigPanel title="Node: collect_details" icon="📝" variant="customize">
    <div class="space-y-3 text-sm">
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">Task</span>
        <span class="text-amber-400">Collect delivery date + time slot</span>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">Pre-Action</span>
        <code class="text-amber-400">tts_say greeting</code>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">Functions</span>
        <code class="text-amber-400">delivery_scheduled → farewell</code>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">Hooks</span>
        <code class="text-amber-400">update_outcome + send_http_request</code>
      </div>
      <div class="flex items-baseline justify-between">
        <span class="text-muted-foreground">Overrides</span>
        <code class="text-amber-400">VAD 1.5s, interruption disabled</code>
      </div>
    </div>
  </ConfigPanel>

  <CodeBlock lang="json" filename="collect-details-node.json" code={`{
  "node_name": "collect_details",
  "task_messages": [
    {
      "role": "system",
      "content": "You are collecting delivery details from {customer_name}. Ask for their preferred delivery date and time slot. Available slots: morning (9am-12pm), afternoon (12pm-5pm), evening (5pm-9pm)."
    }
  ],
  "role_messages": [
    {
      "role": "system",
      "content": "Speak in a friendly, conversational tone. Keep responses concise."
    }
  ],
  "pre_actions": [
    {
      "type": "tts_say",
      "text": "Great, let me help you schedule your delivery."
    }
  ],
  "post_actions": [],
  "functions": [
    {
      "name": "delivery_scheduled",
      "description": "Customer has confirmed a delivery date and time slot",
      "properties": {
        "delivery_date": {
          "type": "string",
          "description": "The delivery date in YYYY-MM-DD format"
        },
        "time_slot": {
          "type": "string",
          "enum": ["morning", "afternoon", "evening"],
          "description": "The preferred time slot"
        }
      },
      "required": ["delivery_date", "time_slot"],
      "transition_to": "farewell",
      "hooks": [
        {
          "name": "update_outcome_in_database",
          "expected_fields": {
            "outcome": { "source": "static", "value": "scheduled" },
            "delivery_date": { "source": "llm" },
            "time_slot": { "source": "llm" }
          }
        },
        {
          "name": "send_http_request",
          "expected_fields": {
            "delivery_date": { "source": "llm" },
            "time_slot": { "source": "llm" },
            "customer_id": { "source": "static", "value": "{customer_id}" }
          },
          "http_request": {
            "url": "https://api.example.com/deliveries",
            "method": "POST",
            "headers": { "Authorization": "Bearer {api_token}" },
            "body": {
              "customer_id": "{customer_id}",
              "date": "<<delivery_date>>",
              "slot": "<<time_slot>>"
            }
          }
        }
      ]
    }
  ],
  "vad_config": {
    "stop_secs": 1.5
  },
  "interruption": {
    "allowed": false
  },
  "input_collection": null
}`} />

  <!-- ───────── Multi-Node Template ───────── -->
  <h2 id="multi-node-example">Multi-Node Template Example</h2>
  <p>A complete template showing how multiple nodes wire together through function transitions:</p>

  <FlowDiagram steps={["greeting (confirm / reschedule)", "reschedule (collect new date)", "farewell (end conversation)"]} variant="customize" />

  <CodeBlock lang="json" filename="multi-node-flow.json" code={`{
  "initial_node": "greeting",
  "nodes": [
    {
      "node_name": "greeting",
      "task_messages": [
        {
          "role": "system",
          "content": "You are calling {customer_name} about their appointment on {appointment_date}. Ask if they can make it or need to reschedule."
        }
      ],
      "role_messages": [],
      "pre_actions": [
        { "type": "tts_say", "text": "Hello, this is {clinic_name} calling." }
      ],
      "post_actions": [],
      "functions": [
        {
          "name": "confirmed",
          "description": "Customer confirms the appointment",
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
          "name": "needs_reschedule",
          "description": "Customer wants to reschedule",
          "properties": {},
          "required": [],
          "transition_to": "reschedule",
          "hooks": []
        }
      ]
    },
    {
      "node_name": "reschedule",
      "task_messages": [
        {
          "role": "system",
          "content": "Help {customer_name} find a new appointment time. Available dates: Monday through Friday, 9am to 5pm."
        }
      ],
      "role_messages": [],
      "pre_actions": [],
      "post_actions": [],
      "functions": [
        {
          "name": "new_date_selected",
          "description": "Customer has chosen a new date and time",
          "properties": {
            "new_date": { "type": "string", "description": "New date (YYYY-MM-DD)" },
            "new_time": { "type": "string", "description": "New time (HH:MM)" }
          },
          "required": ["new_date", "new_time"],
          "transition_to": "farewell",
          "hooks": [
            {
              "name": "update_outcome_in_database",
              "expected_fields": {
                "outcome": { "source": "static", "value": "rescheduled" },
                "new_date": { "source": "llm" },
                "new_time": { "source": "llm" }
              }
            }
          ]
        }
      ],
      "vad_config": { "stop_secs": 2.0 }
    },
    {
      "node_name": "farewell",
      "task_messages": [
        {
          "role": "system",
          "content": "Thank the customer and wish them a great day. End the call naturally."
        }
      ],
      "role_messages": [],
      "pre_actions": [],
      "post_actions": [{ "type": "end_conversation" }],
      "functions": []
    }
  ],
  "global_functions": [],
  "end_conversation_callbacks": []
}`} />

  <Callout type="tip" title="Design Tip">
    <p>Keep nodes focused on a single task. A node that tries to do too much leads to confused LLM behavior. Break complex workflows into multiple small, well-defined nodes connected by clear transition functions.</p>
  </Callout>
</div>
