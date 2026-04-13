<script lang="ts">
  import Callout from '$lib/components/Callout.svelte';
  import FlowDiagram from '$lib/components/FlowDiagram.svelte';
</script>

<svelte:head><title>Architecture — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Architecture</h1>
  <p class="text-muted-foreground text-lg mb-8">
    System design, request lifecycle, and data flow of the Breeze Buddy platform.
  </p>

  <!-- ─── Request Lifecycle ─── -->
  <h2 id="request-lifecycle">Request Lifecycle</h2>
  <p>
    Every voice interaction starts with a <a href="/docs/misc/leads">lead push</a> and flows through a deterministic pipeline. Here is the full lifecycle:
  </p>

  <!-- Vertical flow diagram -->
  <div class="my-8 not-prose">
    <div class="flex flex-col items-center">
      <!-- Step 1 -->
      <div class="flow-node flow-node-accent">
        <div class="flow-node-icon">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        </div>
        <div>
          <span class="flow-node-title">Push Lead via API</span>
          <span class="flow-node-desc"><a href="/docs/misc/leads" class="text-muted-foreground underline">POST /push/lead/v2</a> with template & payload</span>
        </div>
      </div>
      <div class="flow-line"></div>

      <!-- Step 2 -->
      <div class="flow-node">
        <div class="flow-node-icon">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        </div>
        <div>
          <span class="flow-node-title">Validate & Pre-Check</span>
          <span class="flow-node-desc">Schema match, <a href="/docs/misc/numbers#blacklist" class="text-muted-foreground underline">blacklist</a>, <a href="/docs/advanced/pre-checks" class="text-muted-foreground underline">pre-checks</a>, template existence</span>
        </div>
      </div>
      <div class="flow-line"></div>

      <!-- Routing -->
      <div class="flow-node">
        <div class="flow-node-icon">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3h5v5"/><path d="M4 20L21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/></svg>
        </div>
        <div>
          <span class="flow-node-title">Route by Execution Mode</span>
          <span class="flow-node-desc">See <a href="#execution-modes" class="text-muted-foreground underline">Execution Modes</a> below</span>
        </div>
      </div>

      <!-- Branch split -->
      <div class="flex w-full max-w-md mt-0">
        <div class="flex-1 flex flex-col items-center">
          <div class="flow-line"></div>
          <div class="flow-branch-node flow-branch-purple">
            <svg class="h-3.5 w-3.5 mr-1.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="m7 21 5-3 5 3"/></svg>
            <a href="/docs/daily/overview" class="inherit">Daily Room</a>
          </div>
        </div>
        <div class="flex-1 flex flex-col items-center">
          <div class="flow-line"></div>
          <div class="flow-branch-node flow-branch-orange">
            <svg class="h-3.5 w-3.5 mr-1.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.11 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <a href="/docs/telephony/overview" class="inherit">Phone Call</a>
          </div>
        </div>
      </div>

      <!-- Merge lines -->
      <div class="flex w-full max-w-md">
        <div class="flex-1 flex justify-center"><div class="flow-line"></div></div>
        <div class="flex-1 flex justify-center"><div class="flow-line"></div></div>
      </div>
      <div class="w-full max-w-md flex items-center px-8">
        <div class="flex-1 h-px bg-border"></div>
        <div class="h-3 w-px bg-border"></div>
        <div class="flex-1 h-px bg-border"></div>
      </div>
      <div class="flow-line"></div>

      <!-- Voice Pipeline -->
      <div class="flow-node">
        <div class="flow-node-icon">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
        </div>
        <div>
          <span class="flow-node-title">Voice Pipeline</span>
          <span class="flow-node-desc"><a href="/docs/config/stt" class="text-muted-foreground underline">STT</a> &#8594; <a href="/docs/config/llm" class="text-muted-foreground underline">LLM</a> &#8594; <a href="/docs/config/tts" class="text-muted-foreground underline">TTS</a> real-time processing</span>
        </div>
      </div>
      <div class="flow-line"></div>

      <!-- Conversation -->
      <div class="flow-node">
        <div class="flow-node-icon">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div>
          <span class="flow-node-title">Conversation</span>
          <span class="flow-node-desc">LLM navigates <a href="/docs/templates/flow-nodes" class="text-muted-foreground underline">template nodes</a> via <a href="/docs/templates/functions-hooks" class="text-muted-foreground underline">function calling</a></span>
        </div>
      </div>
      <div class="flow-line"></div>

      <!-- Webhook -->
      <div class="flow-node flow-node-accent">
        <div class="flow-node-icon">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        </div>
        <div>
          <span class="flow-node-title">Webhook Callback</span>
          <span class="flow-node-desc"><a href="/docs/misc/webhooks" class="text-muted-foreground underline">Reporting webhook</a> — transcription, data, outcome & <a href="/docs/misc/analytics" class="text-muted-foreground underline">analytics</a></span>
        </div>
      </div>
    </div>
  </div>

  <!-- ─── High-Level Design ─── -->
  <h2 id="high-level-design">High-Level Design</h2>
  <p>
    Breeze Buddy is a <strong>multi-process, async-first</strong> Python application built on <a href="https://fastapi.tiangolo.com" target="_blank" rel="noopener">FastAPI</a>.
    Each voice call runs in its own subprocess within a pre-warmed process pool, ensuring isolation and consistent latency.
  </p>

  <FlowDiagram steps={["Client / Phone", "FastAPI Gateway", "Process Pool", "Pipecat Pipeline", "Providers (STT/LLM/TTS)", "Transport (Daily/WebSocket)"]} />

  <!-- ─── Component Map ─── -->
  <h2 id="component-map">Component Map</h2>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Layer</th><th>Component</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><strong>API</strong></td><td><code>app/api/routers/</code></td><td>REST endpoints — <a href="/docs/templates/api">templates</a>, <a href="/docs/misc/leads">leads</a>, <a href="/docs/misc/webhooks">webhooks</a>, <a href="/docs/daily/connect-api">Daily connect</a></td></tr>
        <tr><td><strong>Agent</strong></td><td><code>app/ai/voice/agents/breeze_buddy/agent/</code></td><td>Core bot — <a href="/docs/advanced/pipeline">pipeline assembly</a>, transport setup, flow execution</td></tr>
        <tr><td><strong>Template Engine</strong></td><td><code>app/ai/voice/agents/breeze_buddy/template/</code></td><td><a href="/docs/templates/overview">Template loading</a>, context building, <a href="/docs/templates/variables">variable resolution</a>, node transitions</td></tr>
        <tr><td><strong>Services</strong></td><td><code>app/ai/voice/agents/breeze_buddy/services/</code></td><td><a href="/docs/telephony/overview">Telephony providers</a>, <a href="/docs/daily/overview">Daily rooms</a>, call limiter, agent router</td></tr>
        <tr><td><strong>Handlers</strong></td><td><code>app/ai/voice/agents/breeze_buddy/handlers/</code></td><td>Internal (<a href="/docs/telephony/warm-transfer">warm transfer</a>, end call, outcome updater) and HTTP handlers</td></tr>
        <tr><td><strong>Database</strong></td><td><code>app/database/</code></td><td>Async queries (SQL builders), accessors (business logic), decoders (row → model)</td></tr>
        <tr><td><strong>Core</strong></td><td><code>app/core/</code></td><td>Static/dynamic config, logging, <a href="/docs/auth/overview">security</a>, background tasks</td></tr>
      </tbody>
    </table>
  </div>

  <!-- ─── Execution Modes ─── -->
  <h2 id="execution-modes">Execution Modes</h2>
  <p>The <code>execution_mode</code> field on each lead determines how the call is placed. The <a href="/docs/config/call-execution">Call Execution Configuration</a> controls scheduling, retries, and provider selection per template.</p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr><th>Mode</th><th>Transport</th><th>Use Case</th></tr>
      </thead>
      <tbody>
        <tr><td><code>DAILY</code></td><td><a href="https://www.daily.co" target="_blank" rel="noopener">Daily.co</a> WebRTC rooms</td><td>Production web/mobile voice sessions</td></tr>
        <tr><td><code>DAILY_TEST</code></td><td><a href="https://www.daily.co" target="_blank" rel="noopener">Daily.co</a> WebRTC rooms</td><td>Playground / development testing</td></tr>
        <tr><td><code>TELEPHONY</code></td><td><a href="/docs/telephony/twilio">Twilio</a> / <a href="/docs/telephony/plivo">Plivo</a> / <a href="/docs/telephony/exotel">Exotel</a></td><td>Production outbound & <a href="/docs/telephony/inbound">inbound</a> calls</td></tr>
        <tr><td><code>TELEPHONY_TEST</code></td><td><a href="/docs/telephony/twilio">Twilio</a> / <a href="/docs/telephony/plivo">Plivo</a> / <a href="/docs/telephony/exotel">Exotel</a></td><td>Test calls (excluded from <a href="/docs/misc/analytics">analytics</a>)</td></tr>
      </tbody>
    </table>
  </div>

  <!-- ─── Configuration Hierarchy ─── -->
  <h2 id="configuration-hierarchy">Configuration Hierarchy</h2>
  <p>Configuration follows a cascading precedence model. Lower layers override higher ones:</p>

  <ol>
    <li><strong>Environment variables</strong> — ~198 static settings loaded at startup</li>
    <li><strong>Redis / <a href="https://devcycle.com" target="_blank" rel="noopener">DevCycle</a></strong> — Dynamic feature flags, checked per-request</li>
    <li><strong><a href="/docs/config/template">Template-level config</a></strong> — <a href="/docs/config/stt">STT</a>, <a href="/docs/config/tts">TTS</a>, <a href="/docs/config/vad">VAD</a>, <a href="/docs/config/interruption">interruption</a>, <a href="/docs/config/llm">LLM</a> settings</li>
    <li><strong>Node-level overrides</strong> — Per-node <a href="/docs/config/vad">VAD</a>, <a href="/docs/config/interruption">interruption</a>, <a href="/docs/advanced/input-collection">input collection</a> settings</li>
    <li><strong>Playground overrides</strong> — Runtime config override via <code>is_playground=true</code></li>
  </ol>

  <Callout type="info" title="Reset-then-Apply Pattern">
    <p>On every node transition, <a href="/docs/config/vad">VAD</a>, <a href="/docs/config/interruption">interruption</a>, and <a href="/docs/advanced/input-collection">input collection</a> configs are <strong>reset to template defaults</strong> first, then the node-level overrides are applied. This prevents configuration bleed between nodes.</p>
  </Callout>

  <!-- ─── Platform Stack ─── -->
  <h2 id="platform-stack">Platform Stack</h2>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Layer</th><th>Technology</th><th>Customizable</th></tr></thead>
      <tbody>
        <tr><td>API</td><td><a href="https://fastapi.tiangolo.com" target="_blank" rel="noopener">FastAPI</a> + Uvicorn</td><td>&#8212;</td></tr>
        <tr><td>Voice Engine</td><td><a href="https://github.com/pipecat-ai/pipecat" target="_blank" rel="noopener">Pipecat-AI</a></td><td>&#8212;</td></tr>
        <tr><td>WebRTC</td><td><a href="https://www.daily.co" target="_blank" rel="noopener">Daily.co</a></td><td><a href="/docs/daily/recording">Room config, recording</a></td></tr>
        <tr><td>STT</td><td><a href="https://soniox.com" target="_blank" rel="noopener">Soniox</a>, <a href="https://deepgram.com" target="_blank" rel="noopener">Deepgram</a>, <a href="https://sarvam.ai" target="_blank" rel="noopener">Sarvam</a>, Google, OpenAI</td><td><a href="/docs/config/stt">Per-template</a></td></tr>
        <tr><td>LLM</td><td><a href="https://azure.microsoft.com/en-us/products/ai-services/openai-service" target="_blank" rel="noopener">Azure OpenAI</a> (GPT-4o)</td><td><a href="/docs/config/llm">Model, temp, tokens</a></td></tr>
        <tr><td>TTS</td><td><a href="https://elevenlabs.io" target="_blank" rel="noopener">ElevenLabs</a>, <a href="https://cartesia.ai" target="_blank" rel="noopener">Cartesia</a>, <a href="https://sarvam.ai" target="_blank" rel="noopener">Sarvam</a>, Google</td><td><a href="/docs/config/tts">Voice, speed, style</a></td></tr>
        <tr><td>Telephony</td><td><a href="https://www.twilio.com" target="_blank" rel="noopener">Twilio</a>, <a href="https://www.plivo.com" target="_blank" rel="noopener">Plivo</a>, <a href="https://exotel.com" target="_blank" rel="noopener">Exotel</a></td><td><a href="/docs/misc/numbers">Per-merchant</a></td></tr>
        <tr><td>Database</td><td>PostgreSQL (<a href="https://github.com/MagicStack/asyncpg" target="_blank" rel="noopener">asyncpg</a>)</td><td>&#8212;</td></tr>
        <tr><td>Cache</td><td>Redis Cluster</td><td>&#8212;</td></tr>
        <tr><td>Observability</td><td><a href="https://langfuse.com" target="_blank" rel="noopener">Langfuse</a>, <a href="https://opentelemetry.io" target="_blank" rel="noopener">OpenTelemetry</a></td><td><a href="/docs/advanced/observability">Traces, metrics</a></td></tr>
      </tbody>
    </table>
  </div>

  <!-- ─── Database Pattern ─── -->
  <h2 id="database-pattern">Database Pattern</h2>
  <p>The database layer follows a strict three-tier pattern with no ORM:</p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Layer</th><th>File Pattern</th><th>Responsibility</th></tr></thead>
      <tbody>
        <tr><td><strong>Queries</strong></td><td><code>database/queries/*.py</code></td><td>Pure SQL builders — return query strings and params</td></tr>
        <tr><td><strong>Accessors</strong></td><td><code>database/accessor/*.py</code></td><td>Business logic — call queries, handle transactions, apply rules</td></tr>
        <tr><td><strong>Decoders</strong></td><td><code>database/decoder/*.py</code></td><td>Type conversion — <code>asyncpg.Record</code> → <a href="https://docs.pydantic.dev" target="_blank" rel="noopener">Pydantic</a> models</td></tr>
      </tbody>
    </table>
  </div>

  <!-- ─── Process Model ─── -->
  <h2 id="process-model">Process Model</h2>
  <p>
    Each voice call runs in its own subprocess from a <strong>pre-warmed process pool</strong>.
    This design avoids the 5–6 second cold-start penalty of Python subprocess creation.
  </p>

  <ul>
    <li><strong>Daily room pool</strong> — Pre-created rooms ready for immediate use via the <a href="/docs/daily/connect-api">Connect API</a></li>
    <li><strong>Voice agent process pool</strong> — Pre-warmed Python processes awaiting <a href="/docs/advanced/pipeline">pipeline</a> assignment</li>
    <li><strong>Pod isolation</strong> — 1-pod-1-call architecture via Smart Router for production scale</li>
  </ul>

  <!-- ─── Observability ─── -->
  <h2 id="observability">Observability</h2>
  <p>Built-in monitoring and tracing across the entire call lifecycle. See <a href="/docs/advanced/observability">Observability</a> for full details.</p>

  <ul>
    <li><strong><a href="https://langfuse.com" target="_blank" rel="noopener">Langfuse</a></strong> — Full LLM tracing, auto-evaluation, cost tracking, latency metrics</li>
    <li><strong><a href="https://opentelemetry.io" target="_blank" rel="noopener">OpenTelemetry</a></strong> — Trace context propagation across async boundaries</li>
    <li><strong>Contextual Logging</strong> — <code>contextvars</code>-based structured logging with correlation IDs</li>
    <li><strong>Slack Alerts</strong> — Automated alerting on evaluation failures</li>
  </ul>

  <!-- ─── Next Steps ─── -->
  <h2 id="next-steps">Next Steps</h2>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6 not-prose">
    <a href="/docs/quickstart" class="doc-card group">
      <span class="text-sm font-semibold text-foreground">Quick Start</span>
      <p class="text-xs text-muted-foreground">Build your first voice agent in 5 minutes</p>
    </a>
    <a href="/docs/auth/overview" class="doc-card group">
      <span class="text-sm font-semibold text-foreground">Authentication</span>
      <p class="text-xs text-muted-foreground">JWT tokens, S2S tokens, and RBAC</p>
    </a>
    <a href="/docs/templates/overview" class="doc-card-orange group">
      <span class="text-sm font-semibold text-foreground">Template System</span>
      <p class="text-xs text-muted-foreground">How conversation flows are defined</p>
    </a>
    <a href="/docs/advanced/pipeline" class="doc-card-orange group">
      <span class="text-sm font-semibold text-foreground">Voice Pipeline</span>
      <p class="text-xs text-muted-foreground">Deep dive into the STT → LLM → TTS pipeline</p>
    </a>
  </div>
</div>
