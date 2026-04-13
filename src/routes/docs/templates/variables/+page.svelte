<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import FlowDiagram from '$lib/components/FlowDiagram.svelte';
  import ConfigPanel from '$lib/components/ConfigPanel.svelte';
  import ApiEndpoint from '$lib/components/ApiEndpoint.svelte';
</script>

<svelte:head><title>Variable Substitution — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Variable Substitution</h1>
  <p class="text-muted-foreground text-lg mb-8">
    Dynamic <code>{`{placeholder}`}</code> syntax for injecting runtime values into templates — power your conversations with per-call data, secrets, and computed values.
  </p>

  <!-- ───────── Overview ───────── -->
  <h2 id="overview">Overview</h2>
  <p>
    Variable substitution allows templates to reference dynamic values using <code>{`{placeholder}`}</code> syntax.
    At call time, these placeholders are resolved from multiple sources and injected into messages, URLs, headers,
    and request bodies. This is how you make a single template serve thousands of different customers with personalized conversations.
  </p>

  <FlowDiagram steps={["Template with {placeholders}", "Lead payload received", "Resolve variables (payload → secrets → credentials)", "Substituted template", "Conversation starts"]} variant="customize" />

  <!-- ───────── Syntax ───────── -->
  <h2 id="syntax">Syntax</h2>
  <p>
    Variables use single curly braces: <code>{`{variable_name}`}</code>. The variable name must match a key
    in one of the resolution sources. Variable names are case-sensitive.
  </p>

  <CodeBlock lang="text" filename="variable-syntax.txt" code={`Hello {customer_name}, I'm calling about your appointment on {appointment_date}.
Your reference number is {order_id}. The clinic number is {clinic_phone}.`} />

  <!-- ───────── Resolution Order ───────── -->
  <h2 id="resolution-order">Resolution Order</h2>
  <p>
    When a <code>{`{placeholder}`}</code> is encountered, the system resolves it by checking sources in priority order.
    The <strong>first match wins</strong>:
  </p>

  <ConfigPanel title="Variable Resolution Order" icon="🔍" variant="customize">
    <div class="space-y-3 text-sm">
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-amber-400 font-semibold">Priority 1</span>
        <span class="text-foreground">Lead Payload <span class="text-muted-foreground text-xs ml-1">(per-call data)</span></span>
      </div>
      <div class="flex items-baseline justify-between border-b border-border/40 pb-2">
        <span class="text-amber-400 font-semibold">Priority 2</span>
        <span class="text-foreground">Template Secrets <span class="text-muted-foreground text-xs ml-1">(shared across calls)</span></span>
      </div>
      <div class="flex items-baseline justify-between">
        <span class="text-amber-400 font-semibold">Priority 3</span>
        <span class="text-foreground">Credential Secrets <span class="text-muted-foreground text-xs ml-1">(merchant-level)</span></span>
      </div>
    </div>
  </ConfigPanel>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Priority</th><th>Source</th><th>Example Keys</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td>1 (highest)</td><td>Lead Payload</td><td><code>customer_name</code>, <code>appointment_date</code>, <code>order_id</code></td><td>Per-call data pushed when creating the lead</td></tr>
        <tr><td>2</td><td>Template Secrets</td><td><code>api_token</code>, <code>webhook_url</code></td><td>Defined in the template's <code>secrets</code> object</td></tr>
        <tr><td>3 (lowest)</td><td>Credential Secrets</td><td><code>api_secret</code>, <code>auth_key</code></td><td>Merchant-level credentials shared across templates</td></tr>
      </tbody>
    </table>
  </div>

  <Callout type="info" title="First Match Wins">
    <p>If a variable exists in both the lead payload and template secrets, the <strong>lead payload value</strong> is used. This allows per-call overrides of template-level defaults.</p>
  </Callout>

  <!-- ───────── Variable Sources ───────── -->
  <h2 id="variable-sources">Variable Sources</h2>

  <h3 id="source-payload">Lead Payload</h3>
  <p>Per-call data pushed via the API when creating a lead. This is the primary source for customer-specific variables.</p>

  <ApiEndpoint method="POST" path="/agent/voice/breeze-buddy/leads" />

  <CodeBlock lang="json" filename="lead-payload.json" code={`{
  "template_id": "abc-123",
  "payload": {
    "customer_name": "Priya Sharma",
    "appointment_date": "2026-04-15",
    "appointment_time": "10:30 AM",
    "doctor_name": "Dr. Mehta",
    "clinic_phone": "+91-9876543210",
    "clinic_name": "HealthFirst Clinic",
    "lead_id": "lead-456"
  }
}`} />

  <h3 id="source-secrets">Template Secrets</h3>
  <p>Secrets defined on the template — shared across all calls on this template. Ideal for API keys, webhook URLs, and auth tokens.</p>

  <CodeBlock lang="json" filename="template-secrets.json" code={`{
  "secrets": {
    "api_token": "sk-live-abc123xyz",
    "webhook_url": "https://hooks.example.com/breeze",
    "callback_auth": "Basic dXNlcjpwYXNz"
  }
}`} />

  <h3 id="source-credentials">Credential Secrets</h3>
  <p>Merchant-level credentials shared across all templates for that merchant. Lowest priority — used as fallback values.</p>

  <CodeBlock lang="json" filename="credential-secrets.json" code={`{
  "api_secret": "sk-merchant-global-key",
  "auth_key": "merchant-auth-abc"
}`} />

  <!-- ───────── Where Variables Work ───────── -->
  <h2 id="where-variables-work">Where Variables Work</h2>
  <p>Variable substitution is supported across the entire template:</p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Location</th><th>Example</th></tr></thead>
      <tbody>
        <tr><td><code>task_messages</code> content</td><td><code>"You are calling {`{customer_name}`} about order {`{order_id}`}"</code></td></tr>
        <tr><td><code>role_messages</code> content</td><td><code>"Address the customer as {`{customer_name}`}"</code></td></tr>
        <tr><td><code>pre_actions</code> tts_say text</td><td><code>"Hello {`{customer_name}`}, thank you for your patience."</code></td></tr>
        <tr><td>HTTP request <code>url</code></td><td><code>"https://api.example.com/orders/{`{order_id}`}"</code></td></tr>
        <tr><td>HTTP request <code>headers</code></td><td><code>"Authorization": "Bearer {`{api_secret}`}"</code></td></tr>
        <tr><td>HTTP request <code>body</code></td><td><code>"customer_id": "{`{customer_id}`}"</code></td></tr>
        <tr><td>Hook field values (static source)</td><td><code>{`{ "source": "static", "value": "{campaign_id}" }`}</code></td></tr>
        <tr><td>Global function <code>pre_tts_message</code></td><td><code>"Looking up your order, {`{customer_name}`}"</code></td></tr>
      </tbody>
    </table>
  </div>

  <!-- ───────── Using Variables in Task Messages ───────── -->
  <h2 id="variables-in-task-messages">Variables in Task Messages</h2>
  <p>The most common use of variables is in task messages — creating dynamic, personalized prompts for each call:</p>

  <CodeBlock lang="json" filename="dynamic-task-message.json" code={`{
  "task_messages": [
    {
      "role": "system",
      "content": "You are calling {customer_name} to remind them about their appointment with {doctor_name} on {appointment_date} at {appointment_time}. The clinic number is {clinic_phone}. If they need to reschedule, provide available slots for next week."
    }
  ]
}`} />

  <p>At call time, this resolves to:</p>

  <CodeBlock lang="json" filename="resolved-task-message.json" code={`{
  "task_messages": [
    {
      "role": "system",
      "content": "You are calling Priya Sharma to remind them about their appointment with Dr. Mehta on 2026-04-15 at 10:30 AM. The clinic number is +91-9876543210. If they need to reschedule, provide available slots for next week."
    }
  ]
}`} />

  <!-- ───────── Dynamic Prompts ───────── -->
  <h2 id="dynamic-prompts">Dynamic Prompts Based on Lead Data</h2>
  <p>
    You can create highly specialized agent behavior by passing rich data in the lead payload. The same template can handle
    completely different conversations based on the payload:
  </p>

  <CodeBlock lang="json" filename="rich-payload-example.json" code={`{
  "payload": {
    "customer_name": "Raj Patel",
    "conversation_type": "overdue_payment",
    "amount_due": "₹4,500",
    "due_date": "2026-04-01",
    "payment_link": "https://pay.example.com/inv-789",
    "available_plans": "3-month EMI at ₹1,600/mo or 6-month EMI at ₹850/mo",
    "language_preference": "Hindi"
  }
}`} />

  <CodeBlock lang="json" filename="dynamic-prompt.json" code={`{
  "task_messages": [
    {
      "role": "system",
      "content": "You are calling {customer_name} regarding an overdue payment of {amount_due} due on {due_date}. Offer the payment link: {payment_link}. If they need a payment plan, offer: {available_plans}. Customer language preference: {language_preference}."
    }
  ]
}`} />

  <!-- ───────── Variables in HTTP Requests ───────── -->
  <h2 id="variables-in-http">Variables in HTTP Requests</h2>
  <p>Variables work in URLs, headers, and bodies. Note the difference between <code>{`{variable}`}</code> (template variable) and <code>&lt;&lt;field&gt;&gt;</code> (hook field reference):</p>

  <CodeBlock lang="json" filename="http-with-variables.json" code={`{
  "http_request": {
    "url": "{webhook_url}/appointments",
    "method": "POST",
    "headers": {
      "Authorization": "{callback_auth}",
      "Content-Type": "application/json"
    },
    "body": {
      "name": "{customer_name}",
      "date": "{appointment_date}",
      "status": "confirmed"
    }
  }
}`} />

  <p>Resolves to:</p>

  <CodeBlock lang="json" filename="resolved-http.json" code={`{
  "http_request": {
    "url": "https://hooks.example.com/breeze/appointments",
    "method": "POST",
    "headers": {
      "Authorization": "Basic dXNlcjpwYXNz",
      "Content-Type": "application/json"
    },
    "body": {
      "name": "Priya Sharma",
      "date": "2026-04-15",
      "status": "confirmed"
    }
  }
}`} />

  <!-- ───────── Built-in Variables ───────── -->
  <h2 id="built-in-variables">Built-in &amp; Computed Variables</h2>
  <p>In addition to user-defined variables, the system provides computed values through the <code>computed</code> field source in hooks:</p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Expression</th><th>Description</th><th>Example Output</th></tr></thead>
      <tbody>
        <tr><td><code>utc_now_minus_hours:0</code></td><td>Current UTC timestamp</td><td><code>2026-04-13T14:30:00Z</code></td></tr>
        <tr><td><code>utc_now_minus_hours:1</code></td><td>UTC timestamp minus 1 hour</td><td><code>2026-04-13T13:30:00Z</code></td></tr>
        <tr><td><code>utc_now_minus_hours:24</code></td><td>UTC timestamp minus 24 hours</td><td><code>2026-04-12T14:30:00Z</code></td></tr>
      </tbody>
    </table>
  </div>

  <CodeBlock lang="json" filename="computed-variable.json" code={`{
  "expected_fields": {
    "outcome": { "source": "static", "value": "confirmed" },
    "called_at": { "source": "computed", "value": "utc_now_minus_hours:0" },
    "customer_name": { "source": "static", "value": "{customer_name}" },
    "preferred_date": { "source": "llm" }
  }
}`} />

  <!-- ───────── Payload Validation ───────── -->
  <h2 id="payload-validation">Payload Validation</h2>
  <p>
    Use <code>expected_payload_schema</code> on the template to validate that required variables are present in every lead payload. This prevents calls from starting with missing data.
  </p>

  <CodeBlock lang="json" filename="payload-schema.json" code={`{
  "expected_payload_schema": {
    "type": "object",
    "properties": {
      "customer_name": { "type": "string" },
      "appointment_date": { "type": "string" },
      "appointment_time": { "type": "string" },
      "doctor_name": { "type": "string" },
      "clinic_phone": { "type": "string" }
    },
    "required": ["customer_name", "appointment_date", "doctor_name"]
  }
}`} />

  <Callout type="warning" title="Unresolved Variables">
    <p>Unresolved placeholders are <strong>not</strong> treated as errors — they remain as literal text (e.g. <code>{`{unknown_var}`}</code> stays as-is). This can cause issues in HTTP URLs or auth headers. Always validate your payload schema to catch missing variables early.</p>
  </Callout>

  <!-- ───────── Escaping ───────── -->
  <h2 id="escaping">Escaping &amp; Edge Cases</h2>

  <Callout type="danger" title="No Escape Syntax">
    <p>There is currently <strong>no escape syntax</strong> for literal curly braces in variable-resolved contexts. If your content needs literal <code>{`{text}`}</code>, avoid using variable names that might match. Use distinctive variable names to prevent accidental resolution.</p>
  </Callout>

  <ul>
    <li><strong>Case sensitivity:</strong> Variable names are case-sensitive. <code>{`{Customer_Name}`}</code> and <code>{`{customer_name}`}</code> are different variables.</li>
    <li><strong>Missing variables:</strong> If a placeholder has no matching key in any source, it remains as literal text.</li>
    <li><strong>Empty values:</strong> If a variable resolves to an empty string, the placeholder is replaced with an empty string (not removed).</li>
    <li><strong>Nested resolution:</strong> Variable substitution is <strong>not</strong> recursive. If a resolved value contains <code>{`{placeholders}`}</code>, they are not resolved again.</li>
    <li><strong>JSON values:</strong> Variables always resolve to strings. If you need numeric values in JSON bodies, the receiving API should handle type coercion.</li>
  </ul>

  <!-- ───────── Best Practices ───────── -->
  <h2 id="best-practices">Best Practices</h2>
  <ul>
    <li>Use <code>expected_payload_schema</code> to validate required variables are present in every lead payload</li>
    <li>Keep sensitive values (API keys, auth tokens) in <strong>template secrets</strong> or <strong>credential secrets</strong> — never in the lead payload</li>
    <li>Use descriptive variable names: <code>{`{customer_name}`}</code> over <code>{`{name}`}</code>, <code>{`{appointment_date}`}</code> over <code>{`{date}`}</code></li>
    <li>Test substitution by creating a lead with the expected payload and reviewing the resolved template in logs</li>
    <li>Document your payload schema — list all expected variables and their formats for API consumers</li>
  </ul>

  <Callout type="tip" title="Debugging Substitution">
    <p>If a variable is not resolved, check: 1) the variable name matches exactly (case-sensitive), 2) the key exists in payload, template secrets, or credential secrets, 3) the lead payload was correctly pushed via the API.</p>
  </Callout>
</div>
