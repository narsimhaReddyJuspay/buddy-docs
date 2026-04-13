<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
</script>

<svelte:head><title>LLM Configuration — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>LLM Configuration</h1>
  <p class="text-muted-foreground text-lg mb-8">Configure the language model powering your voice agent's intelligence.</p>

  <h2 id="overview">Overview</h2>
  <p>
    The <code>llm_configurations</code> field in <code>ConfigurationModel</code> controls which
    language model is used and its generation parameters. Breeze Buddy currently uses
    <strong>Azure OpenAI</strong> with GPT-4o as the default model.
  </p>

  <h2 id="fields">LLMConfiguration Fields</h2>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr><th>Field</th><th>Type</th><th>Default</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>model</code></td><td><code>str</code></td><td><code>gpt-4o</code></td><td>Azure OpenAI model deployment name.</td></tr>
        <tr><td><code>temperature</code></td><td><code>float</code></td><td>—</td><td>Controls randomness. Lower values (0.0–0.3) are more deterministic; higher values (0.7–1.0) are more creative.</td></tr>
      </tbody>
    </table>
  </div>

  <h2 id="temperature-guide">Temperature Guide</h2>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr><th>Range</th><th>Behaviour</th><th>Use Case</th></tr>
      </thead>
      <tbody>
        <tr><td><code>0.0–0.2</code></td><td>Highly deterministic, consistent</td><td>Data collection, compliance scripts</td></tr>
        <tr><td><code>0.3–0.5</code></td><td>Balanced</td><td>Customer support, appointment reminders</td></tr>
        <tr><td><code>0.6–0.8</code></td><td>More varied phrasing</td><td>Sales, conversational flows</td></tr>
        <tr><td><code>0.9–1.0</code></td><td>Highly creative</td><td>Brainstorming, casual chat</td></tr>
      </tbody>
    </table>
  </div>

  <h2 id="json-example">JSON Example</h2>

  <CodeBlock lang="json" code={`{
  "configurations": {
    "llm_configurations": {
      "model": "gpt-4o",
      "temperature": 0.4
    }
  }
}`} />

  <h2 id="azure-openai">Azure OpenAI</h2>
  <p>
    All LLM calls route through Azure OpenAI. The <code>model</code> field corresponds to
    the Azure deployment name (not the raw OpenAI model name). Your Azure deployment must
    be configured in the Breeze Buddy backend.
  </p>

  <Callout type="info" title="Model availability">
    <p>The available models depend on your Azure OpenAI deployment configuration. GPT-4o is the default and recommended model for voice agent use cases due to its balance of quality and latency.</p>
  </Callout>

  <h2 id="observability">Observability with Langfuse</h2>
  <p>
    All LLM calls are automatically traced via <strong>Langfuse</strong>. This gives you
    visibility into:
  </p>
  <ul>
    <li><strong>Cost tracking</strong> — token usage and cost per call.</li>
    <li><strong>Latency</strong> — time-to-first-token and total generation time.</li>
    <li><strong>Token usage</strong> — prompt tokens, completion tokens, total tokens per request.</li>
    <li><strong>Request/response logs</strong> — full prompt and completion text for debugging.</li>
  </ul>

  <Callout type="tip" title="Debugging prompts">
    <p>Use the Langfuse dashboard to inspect the exact prompts sent to the LLM. This is invaluable for debugging unexpected agent behavior — you can see exactly what system/task messages the model received.</p>
  </Callout>

  <h2 id="per-template">Per-Template Configuration</h2>
  <p>
    Each template can specify its own LLM configuration. This allows you to use different
    models or temperatures for different use cases — for example, a lower temperature for
    compliance-heavy scripts and a higher one for sales conversations.
  </p>

  <CodeBlock lang="json" code={`// Compliance template — deterministic
{
  "name": "compliance-verification",
  "configurations": {
    "llm_configurations": {
      "model": "gpt-4o",
      "temperature": 0.1
    }
  }
}

// Sales template — conversational
{
  "name": "sales-outreach",
  "configurations": {
    "llm_configurations": {
      "model": "gpt-4o",
      "temperature": 0.7
    }
  }
}`} />
</div>
