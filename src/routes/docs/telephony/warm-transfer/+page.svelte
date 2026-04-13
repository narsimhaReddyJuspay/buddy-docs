<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import ApiEndpoint from '$lib/components/ApiEndpoint.svelte';
  import FlowDiagram from '$lib/components/FlowDiagram.svelte';
  import ConfigPanel from '$lib/components/ConfigPanel.svelte';
</script>

<svelte:head><title>Warm Transfer — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Warm Transfer</h1>
  <p class="text-muted-foreground text-base mb-6">
    Seamlessly hand off an active conversation from the AI agent to a live human agent, with provider-specific transfer mechanisms across Twilio, Plivo, and Exotel.
  </p>

  <!-- ───────── How It Works ───────── -->
  <h2 id="how-it-works">How Warm Transfer Works</h2>
  <p>
    Warm transfer allows the AI agent to connect the customer to a live human agent mid-conversation. The built-in
    <code>connect_to_live_agent</code> handler orchestrates the entire flow: it resolves the transfer number from
    the template configuration, sets a Redis transfer flag, and executes the provider-specific handoff mechanism.
  </p>

  <FlowDiagram steps={["LLM Triggers Transfer", "Resolve Transfer Number", "Set Redis Flag", "Provider Handoff", "AI Disconnects", "Customer + Agent"]} variant="integrate" />

  <div class="step-list">
    <div class="step-list-item">
      <div class="step-list-number">1</div>
      <div><strong>LLM triggers transfer</strong> — The LLM invokes the <code>connect_to_live_agent</code> function when the customer requests a human agent.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">2</div>
      <div><strong>Resolve transfer number</strong> — The handler reads <code>transfer_number</code> from the template's <code>configurations</code> object.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">3</div>
      <div><strong>Set Redis flag</strong> — A transfer flag is stored in Redis so the status callback can distinguish a transfer-initiated disconnection from a normal hangup.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">4</div>
      <div><strong>Provider handoff</strong> — The provider-specific transfer mechanism is executed (Conference, calls.transfer, or applet bridge).</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">5</div>
      <div><strong>AI disconnects</strong> — The AI agent exits the call. The customer continues with the live agent.</div>
    </div>
  </div>

  <!-- ───────── Template Configuration ───────── -->
  <h2 id="template-configuration">Template Configuration</h2>
  <p>To enable warm transfer, add the <code>transfer_number</code> to the template's configurations and register the built-in function in <code>global_builtin_functions</code>:</p>

  <CodeBlock lang="json" filename="template-transfer-config.json" code={`{
  "configurations": {
    "transfer_number": "+1234567890"
  },
  "global_builtin_functions": [
    {
      "name": "connect_to_live_agent",
      "description": "Transfer the customer to a live human agent when they request to speak with a person.",
      "parameters": {}
    }
  ]
}`} />

  <ConfigPanel title="Transfer Settings" icon="🔀" variant="integrate">
    <div class="space-y-3 text-sm">
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">transfer_number</span>
        <span class="text-foreground">Destination phone number for the live agent</span>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">Function name</span>
        <code class="text-violet-400">connect_to_live_agent</code>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">Scope</span>
        <span class="text-foreground">Global built-in — available across all nodes</span>
      </div>
      <div class="flex items-baseline justify-between">
        <span class="text-muted-foreground">Redis flag TTL</span>
        <code class="text-violet-400">300 seconds (5 minutes)</code>
      </div>
    </div>
  </ConfigPanel>

  <Callout type="info" title="Global Built-in Function">
    <p><code>connect_to_live_agent</code> is a global built-in — it's available in every conversation node without per-node registration. Simply add it to <code>global_builtin_functions</code> in the template.</p>
  </Callout>

  <!-- ───────── Provider Flows ───────── -->
  <h2 id="provider-flows">Provider-Specific Flows</h2>
  <p>Each telephony provider implements warm transfer differently. The <code>connect_to_live_agent</code> handler automatically executes the correct flow based on the call's provider.</p>

  <!-- Twilio -->
  <h3 id="twilio-transfer">Twilio — Conference API</h3>
  <p>Twilio uses the <strong>Conference API</strong> for a seamless three-way connection with minimal audio gap:</p>

  <FlowDiagram steps={["Customer Placed in Conference", "Live Agent Dialed In", "AI Disconnects", "Customer + Agent Continue"]} variant="integrate" />

  <div class="step-list">
    <div class="step-list-item">
      <div class="step-list-number">1</div>
      <div>The customer's active call is moved into a <strong>conference room</strong>.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">2</div>
      <div>The transfer target (live agent) is <strong>dialed into the same conference</strong>.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">3</div>
      <div>The AI agent <strong>disconnects</strong> from the conference.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">4</div>
      <div>Customer and live agent continue the conversation in the conference room.</div>
    </div>
  </div>

  <Callout type="tip" title="No Audio Gap">
    <p>The Conference API ensures near-zero audio interruption. The customer hears only a brief moment of silence while the live agent is being connected.</p>
  </Callout>

  <!-- Plivo -->
  <h3 id="plivo-transfer">Plivo — calls.transfer()</h3>
  <p>Plivo uses <code>calls.transfer()</code> to redirect the active call to a webhook that returns <code>&lt;Dial&gt;</code> XML:</p>

  <FlowDiagram steps={["calls.transfer() → /dial-up", "Webhook Returns Dial XML", "Customer Bridged to Agent", "AI Disconnects"]} variant="integrate" />

  <div class="step-list">
    <div class="step-list-item">
      <div class="step-list-number">1</div>
      <div><code>calls.transfer()</code> redirects the active call to the <code>/plivo/dial-up</code> webhook.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">2</div>
      <div>The webhook resolves the transfer number and returns Plivo XML: <code>&lt;Dial&gt;&lt;Number&gt;</code>.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">3</div>
      <div>Plivo bridges the customer to the live agent number.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">4</div>
      <div>The AI agent disconnects from the call.</div>
    </div>
  </div>

  <ApiEndpoint method="POST" path="/plivo/dial-up" description="Dial-up webhook — returns Plivo XML to bridge the customer to the transfer target." />

  <CodeBlock lang="xml" filename="plivo-dial-response.xml" code={`<Response>
  <Dial callerId="{outbound_number}">
    <Number>{transfer_number}</Number>
  </Dial>
</Response>`} />

  <!-- Exotel -->
  <h3 id="exotel-transfer">Exotel — Applet Bridge</h3>
  <p>Exotel follows a unique pattern where the <strong>AI disconnects first</strong> and the applet takes over the call flow:</p>

  <FlowDiagram steps={["AI Disconnects", "Applet Calls /dial-up", "Returns Plain-Text Number", "Exotel Native Bridge"]} variant="integrate" />

  <div class="step-list">
    <div class="step-list-item">
      <div class="step-list-number">1</div>
      <div>The AI agent <strong>disconnects</strong> from the active call.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">2</div>
      <div>Exotel's applet makes a REST call to the <code>/exotel/dial-up</code> webhook.</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">3</div>
      <div>The webhook returns the live agent's phone number as <strong>plain text</strong> (not XML).</div>
    </div>
    <div class="step-list-item">
      <div class="step-list-number">4</div>
      <div>Exotel uses its native bridge to connect the customer to the returned number.</div>
    </div>
  </div>

  <ApiEndpoint method="POST" path="/exotel/dial-up" description="Dial-up webhook — returns the transfer number as plain text for Exotel's native bridge." />

  <CodeBlock lang="python" filename="exotel_transfer.py" code={`def exotel_dial_text(transfer_number: str) -> str:
    """Returns the agent phone number as plain text
    for Exotel's applet bridge mechanism."""
    return transfer_number`} />

  <Callout type="warning" title="Exotel: AI Disconnects First">
    <p>In the Exotel flow, the AI disconnects <em>before</em> the customer is bridged to the live agent. The customer is on hold briefly until the applet completes the bridge. This is fundamentally different from Twilio and Plivo where the AI stays connected during the handoff.</p>
  </Callout>

  <!-- ───────── Provider Comparison ───────── -->
  <h2 id="provider-comparison">Provider Comparison</h2>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Aspect</th><th>Twilio</th><th>Plivo</th><th>Exotel</th></tr></thead>
      <tbody>
        <tr><td><strong>Mechanism</strong></td><td>Conference API</td><td><code>calls.transfer()</code> + webhook</td><td>Applet + webhook</td></tr>
        <tr><td><strong>Response format</strong></td><td>N/A (API-based)</td><td>XML (<code>&lt;Dial&gt;&lt;Number&gt;</code>)</td><td>Plain text (phone number)</td></tr>
        <tr><td><strong>AI disconnect timing</strong></td><td>After agent joins</td><td>After transfer initiated</td><td>Before bridge (first to disconnect)</td></tr>
        <tr><td><strong>Audio gap</strong></td><td>Minimal</td><td>Brief</td><td>Noticeable (during bridge)</td></tr>
        <tr><td><strong>Dial-up webhook</strong></td><td>Not used</td><td><code>/plivo/dial-up</code></td><td><code>/exotel/dial-up</code></td></tr>
      </tbody>
    </table>
  </div>

  <!-- ───────── Redis Transfer Flag ───────── -->
  <h2 id="redis-transfer-flag">Redis Transfer Flag</h2>
  <p>Before initiating the provider-specific transfer, a flag is set in Redis to track the transfer state. This allows status callback handlers to distinguish between a normal hangup and a transfer-initiated disconnection.</p>

  <CodeBlock lang="python" filename="transfer_flag.py" code={`# Transfer flag key pattern
transfer_key = f"transfer:{lead_id}"
await redis.set(transfer_key, transfer_number, ex=300)  # 5-minute TTL`} />

  <ConfigPanel title="Redis Transfer State" icon="🗄️" variant="integrate">
    <div class="space-y-3 text-sm">
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">Key pattern</span>
        <code class="text-violet-400">transfer:&#123;lead_id&#125;</code>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-muted-foreground">Value</span>
        <span class="text-foreground">Transfer target phone number</span>
      </div>
      <div class="flex items-baseline justify-between">
        <span class="text-muted-foreground">TTL</span>
        <code class="text-violet-400">300 seconds (5 minutes)</code>
      </div>
    </div>
  </ConfigPanel>

  <!-- ───────── Success & Failure ───────── -->
  <h2 id="success-and-failure">Success &amp; Failure Handling</h2>

  <h3 id="on-success">On Success</h3>
  <p>When the transfer target answers and the bridge is established:</p>
  <ul>
    <li><code>end_conversation()</code> is called to cleanly terminate the AI session</li>
    <li>The lead status is updated with the transfer outcome</li>
    <li>The Redis transfer flag is cleared</li>
  </ul>

  <h3 id="on-failure">On Failure</h3>
  <p>When the transfer target does not answer or the bridge fails:</p>
  <ul>
    <li>An error message is returned to the AI agent</li>
    <li>The conversation <strong>continues</strong> — the AI resumes talking to the customer</li>
    <li>The AI can inform the customer and offer alternatives (retry, callback, etc.)</li>
  </ul>

  <Callout type="info" title="Resilient Conversations">
    <p>Failed transfers never end the call. The AI agent resumes the conversation automatically and can retry the transfer, offer a scheduled callback, or continue the interaction normally.</p>
  </Callout>

  <!-- ───────── Best Practices ───────── -->
  <h2 id="best-practices">Best Practices</h2>

  <ConfigPanel title="Transfer Best Practices" icon="💡" variant="integrate">
    <div class="space-y-3 text-sm">
      <div class="flex items-center gap-3 border-b border-border/40 pb-2">
        <span class="h-5 w-5 rounded-full bg-violet-500/15 text-violet-400 text-xs flex items-center justify-center shrink-0">1</span>
        <span class="text-foreground">Always define a meaningful <code>description</code> for the <code>connect_to_live_agent</code> function so the LLM knows when to trigger it.</span>
      </div>
      <div class="flex items-center gap-3 border-b border-border/40 pb-2">
        <span class="h-5 w-5 rounded-full bg-violet-500/15 text-violet-400 text-xs flex items-center justify-center shrink-0">2</span>
        <span class="text-foreground">Include the <code>transfer_number</code> in template configurations — it's required for all providers.</span>
      </div>
      <div class="flex items-center gap-3 border-b border-border/40 pb-2">
        <span class="h-5 w-5 rounded-full bg-violet-500/15 text-violet-400 text-xs flex items-center justify-center shrink-0">3</span>
        <span class="text-foreground">Test transfer flows end-to-end with each provider, as the handoff mechanisms differ significantly.</span>
      </div>
      <div class="flex items-center gap-3 border-b border-border/40 pb-2">
        <span class="h-5 w-5 rounded-full bg-violet-500/15 text-violet-400 text-xs flex items-center justify-center shrink-0">4</span>
        <span class="text-foreground">For Exotel, ensure the dial-up applet is properly configured as the AI disconnects before the bridge.</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="h-5 w-5 rounded-full bg-violet-500/15 text-violet-400 text-xs flex items-center justify-center shrink-0">5</span>
        <span class="text-foreground">Monitor Redis for stale transfer flags — they auto-expire after 5 minutes but may indicate failed handoffs.</span>
      </div>
    </div>
  </ConfigPanel>

  <Callout type="danger" title="Missing Transfer Number">
    <p>If <code>transfer_number</code> is not set in the template's configurations, the <code>connect_to_live_agent</code> function will return an error to the LLM and the transfer will not be attempted.</p>
  </Callout>
</div>
