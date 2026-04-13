<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import FlowDiagram from '$lib/components/FlowDiagram.svelte';
</script>

<svelte:head><title>Architecture — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Architecture</h1>
  <p class="text-muted-foreground text-lg mb-8">
    System design, service boundaries, and data flow of the Breeze Buddy platform.
  </p>

  <h2 id="high-level-overview">High-Level Overview</h2>
  <p>
    Breeze Buddy is a <strong>multi-process, async-first</strong> Python application running on FastAPI.
    Each voice call runs in its own subprocess within a pre-warmed process pool, ensuring isolation and consistent latency.
  </p>

  <FlowDiagram steps={["Client / Phone", "FastAPI Gateway", "Process Pool", "Pipecat Pipeline", "Providers (STT/LLM/TTS)", "Transport (Daily/WebSocket)"]} />

  <h2 id="component-map">Component Map</h2>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Layer</th><th>Component</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><strong>API</strong></td><td><code>app/api/routers/</code></td><td>REST endpoints — templates, leads, telephony webhooks, Daily connect</td></tr>
        <tr><td><strong>Agent</strong></td><td><code>app/ai/voice/agents/breeze_buddy/agent/</code></td><td>Core bot — pipeline assembly, transport setup, flow execution</td></tr>
        <tr><td><strong>Template Engine</strong></td><td><code>app/ai/voice/agents/breeze_buddy/template/</code></td><td>Template loading, context building, variable resolution, node transitions</td></tr>
        <tr><td><strong>Services</strong></td><td><code>app/ai/voice/agents/breeze_buddy/services/</code></td><td>Telephony providers, Daily rooms, call limiter, agent router</td></tr>
        <tr><td><strong>Handlers</strong></td><td><code>app/ai/voice/agents/breeze_buddy/handlers/</code></td><td>Internal (warm transfer, end call, outcome updater) and HTTP handlers</td></tr>
        <tr><td><strong>Database</strong></td><td><code>app/database/</code></td><td>Async queries (SQL builders), accessors (business logic), decoders (row → model)</td></tr>
        <tr><td><strong>Core</strong></td><td><code>app/core/</code></td><td>Static/dynamic config, logging, security, background tasks</td></tr>
      </tbody>
    </table>
  </div>

  <h2 id="configuration-hierarchy">Configuration Hierarchy</h2>
  <p>Configuration follows a cascading precedence model. Lower layers override higher ones:</p>

  <ol>
    <li><strong>Environment variables</strong> — ~198 static settings loaded at startup</li>
    <li><strong>Redis / DevCycle</strong> — Dynamic feature flags, checked per-request</li>
    <li><strong>Template-level config</strong> — STT, TTS, VAD, interruption, LLM settings on the template</li>
    <li><strong>Node-level overrides</strong> — Per-node VAD, interruption, input collection settings</li>
    <li><strong>Playground overrides</strong> — Runtime config override via <code>is_playground=true</code></li>
  </ol>

  <Callout type="info" title="Reset-then-Apply Pattern">
    <p>On every node transition, VAD, interruption, and input collection configs are <strong>reset to template defaults</strong> first, then the node-level overrides are applied. This prevents configuration bleed between nodes.</p>
  </Callout>

  <h2 id="database-pattern">Database Pattern</h2>
  <p>The database layer follows a strict three-tier pattern with no ORM:</p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Layer</th><th>File Pattern</th><th>Responsibility</th></tr></thead>
      <tbody>
        <tr><td><strong>Queries</strong></td><td><code>database/queries/*.py</code></td><td>Pure SQL builders — return query strings and params</td></tr>
        <tr><td><strong>Accessors</strong></td><td><code>database/accessor/*.py</code></td><td>Business logic — call queries, handle transactions, apply rules</td></tr>
        <tr><td><strong>Decoders</strong></td><td><code>database/decoder/*.py</code></td><td>Type conversion — <code>asyncpg.Record</code> → Pydantic models</td></tr>
      </tbody>
    </table>
  </div>

  <h2 id="process-model">Process Model</h2>
  <p>
    Each voice call runs in its own subprocess from a <strong>pre-warmed process pool</strong>.
    This design avoids the 5–6 second cold-start penalty of Python subprocess creation.
  </p>

  <ul>
    <li><strong>Daily room pool</strong> — Pre-created rooms ready for immediate use</li>
    <li><strong>Voice agent process pool</strong> — Pre-warmed Python processes awaiting pipeline assignment</li>
    <li><strong>Pod isolation</strong> — 1-pod-1-call architecture via Smart Router for production scale</li>
  </ul>

  <h2 id="observability">Observability</h2>
  <ul>
    <li><strong>Langfuse</strong> — Full LLM tracing, auto-evaluation, cost tracking, latency metrics</li>
    <li><strong>OpenTelemetry</strong> — Trace context propagation across async boundaries</li>
    <li><strong>Contextual Logging</strong> — <code>contextvars</code>-based structured logging with correlation IDs</li>
    <li><strong>Slack Alerts</strong> — Automated alerting on evaluation failures</li>
  </ul>
</div>
