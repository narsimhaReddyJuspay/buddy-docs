<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import FlowDiagram from '$lib/components/FlowDiagram.svelte';
</script>

<svelte:head>
  <title>Breeze Buddy — Developer Documentation</title>
</svelte:head>

<div class="prose">
  <!-- Hero -->
  <div class="relative -mx-2 mb-10 not-prose">
    <div class="flex items-center gap-3 mb-4">
      <span class="badge-purple uppercase tracking-wider text-[0.625rem] font-bold">Developer Documentation</span>
      <span class="badge-neutral text-[0.625rem]">v2.0</span>
    </div>

    <h1 class="text-3xl font-bold tracking-tight text-foreground mb-3" style="letter-spacing: -0.02em;">
      Integrate Voice AI<br/>
      <span style="background: linear-gradient(135deg, var(--buddy-purple), var(--buddy-purple-light)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">into your product</span>
    </h1>

    <p class="text-base text-muted-foreground max-w-xl leading-relaxed">
      Connect real-time conversational AI via <strong class="text-foreground">Daily WebRTC</strong> or <strong class="text-foreground">Telephony</strong>.
      Customize every aspect through JSON-driven templates — no code deployment needed.
    </p>
  </div>

  <!-- Integration paths — primary CTA cards -->
  <h2 id="choose-integration">Choose Your Integration</h2>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 not-prose">
    <a href="/docs/daily/overview" class="doc-card group">
      <div class="flex h-10 w-10 items-center justify-center rounded-lg" style="background: color-mix(in srgb, var(--buddy-purple) 12%, transparent);">
        <svg class="h-5 w-5" style="color: var(--buddy-purple-light);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="m7 21 5-3 5 3"/></svg>
      </div>
      <div>
        <span class="text-base font-semibold text-foreground">Daily WebRTC</span>
        <p class="text-sm text-muted-foreground mt-1.5 leading-relaxed">Integrate real-time voice AI into web and mobile apps using Daily's WebRTC infrastructure. Low-latency audio streaming, RTVI events, and recording support.</p>
      </div>
      <div class="flex items-center gap-2 mt-auto pt-2">
        <span class="text-xs font-medium" style="color: var(--buddy-purple-light);">Get started &#8594;</span>
        <span class="badge-purple text-[0.5625rem]">WebRTC</span>
      </div>
    </a>

    <a href="/docs/telephony/overview" class="doc-card group">
      <div class="flex h-10 w-10 items-center justify-center rounded-lg" style="background: color-mix(in srgb, var(--buddy-orange) 12%, transparent);">
        <svg class="h-5 w-5" style="color: var(--buddy-orange-light);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.11 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
      </div>
      <div>
        <span class="text-base font-semibold text-foreground">Telephony</span>
        <p class="text-sm text-muted-foreground mt-1.5 leading-relaxed">Place and receive phone calls through Twilio, Plivo, or Exotel. Outbound campaigns, inbound routing, and warm transfer to human agents.</p>
      </div>
      <div class="flex items-center gap-2 mt-auto pt-2">
        <span class="text-xs font-medium" style="color: var(--buddy-orange-light);">Configure &#8594;</span>
        <span class="badge-orange text-[0.5625rem]">PSTN</span>
      </div>
    </a>
  </div>

  <!-- How integration works -->
  <h2 id="how-it-works">How Integration Works</h2>

  <p>
    Push a lead with your template configuration via the API. The platform handles the entire voice interaction lifecycle:
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
          <span class="flow-node-desc">POST /push/lead/v2 with template & payload</span>
        </div>
      </div>
      <div class="flow-line"></div>

      <!-- Step 2 -->
      <div class="flow-node">
        <div class="flow-node-icon">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        </div>
        <div>
          <span class="flow-node-title">Validate Template & Payload</span>
          <span class="flow-node-desc">Schema match, number blacklist, template existence</span>
        </div>
      </div>
      <div class="flow-line"></div>

      <!-- Branch -->
      <div class="flow-node">
        <div class="flow-node-icon">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3h5v5"/><path d="M4 20L21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/></svg>
        </div>
        <div>
          <span class="flow-node-title">Route by Execution Mode</span>
          <span class="flow-node-desc">DAILY or TELEPHONY</span>
        </div>
      </div>

      <!-- Branch split -->
      <div class="flex w-full max-w-md mt-0">
        <div class="flex-1 flex flex-col items-center">
          <div class="flow-line"></div>
          <div class="flow-branch-node flow-branch-purple">
            <svg class="h-3.5 w-3.5 mr-1.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="m7 21 5-3 5 3"/></svg>
            Daily Room
          </div>
        </div>
        <div class="flex-1 flex flex-col items-center">
          <div class="flow-line"></div>
          <div class="flow-branch-node flow-branch-orange">
            <svg class="h-3.5 w-3.5 mr-1.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.11 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Phone Call
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

      <!-- Step 4 -->
      <div class="flow-node">
        <div class="flow-node-icon">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
        </div>
        <div>
          <span class="flow-node-title">Voice Pipeline</span>
          <span class="flow-node-desc">STT &#8594; LLM &#8594; TTS real-time processing</span>
        </div>
      </div>
      <div class="flow-line"></div>

      <!-- Step 5 -->
      <div class="flow-node">
        <div class="flow-node-icon">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div>
          <span class="flow-node-title">Conversation</span>
          <span class="flow-node-desc">LLM navigates template nodes via function calling</span>
        </div>
      </div>
      <div class="flow-line"></div>

      <!-- Step 6 -->
      <div class="flow-node flow-node-accent">
        <div class="flow-node-icon">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        </div>
        <div>
          <span class="flow-node-title">Webhook Callback</span>
          <span class="flow-node-desc">Transcription, collected data, outcome & analytics</span>
        </div>
      </div>
    </div>
  </div>

  <div class="not-prose">
    <ol class="step-list my-6 list-none pl-0">
      <li>
        <strong class="text-foreground text-sm">Push a lead via API</strong>
        <p class="text-[0.8125rem] text-muted-foreground mt-1 leading-relaxed">Send <code class="text-[0.75rem] px-1.5 py-0.5 rounded border" style="background: color-mix(in srgb, var(--buddy-purple) 6%, transparent); color: var(--buddy-purple-light); border-color: color-mix(in srgb, var(--buddy-purple) 10%, transparent);">POST /push/lead/v2</code> with your payload, template, and execution mode</p>
      </li>
      <li>
        <strong class="text-foreground text-sm">Platform validates and queues</strong>
        <p class="text-[0.8125rem] text-muted-foreground mt-1 leading-relaxed">Template existence, payload schema match, and number blacklist are validated automatically</p>
      </li>
      <li>
        <strong class="text-foreground text-sm">Voice pipeline processes in real-time</strong>
        <p class="text-[0.8125rem] text-muted-foreground mt-1 leading-relaxed">STT &#8594; LLM &#8594; TTS pipeline processes audio. The LLM navigates template nodes via function calling</p>
      </li>
      <li>
        <strong class="text-foreground text-sm">Receive webhook callbacks</strong>
        <p class="text-[0.8125rem] text-muted-foreground mt-1 leading-relaxed">Get full transcription, collected data, outcome status, and analytics on completion</p>
      </li>
    </ol>
  </div>

  <!-- Minimal example -->
  <h2 id="quick-example">Quick Integration Example</h2>

  <CodeBlock lang="bash" filename="1. Push a lead" code={`curl -X POST https://api.example.com/push/lead/v2 \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "template_name": "appointment-reminder",
    "merchant_id": "merchant-uuid",
    "execution_mode": "DAILY_TEST",
    "payload": {
      "customer_name": "Jane Smith",
      "appointment_date": "2025-01-15"
    }
  }'`} />

  <CodeBlock lang="typescript" filename="2. Connect from your frontend" code={`import Daily from '@daily-co/daily-js';

const callFrame = Daily.createFrame();
await callFrame.join({
  url: response.room_url,
  token: response.token
});

callFrame.on('app-message', (event) => {
  const { type, data } = event.data;
  // Handle transcription, responses, etc.
});`} />

  <Callout type="tip" title="Fastest path">
    <p>Start with <a href="/docs/daily/web-sdk" style="color: var(--buddy-purple-light); text-decoration: underline;">Daily WebRTC</a> — working voice agent in your web app in under 30 minutes.</p>
  </Callout>

  <hr />

  <!-- Customization section -->
  <h2 id="customization">Customize Your Agent</h2>

  <p>Every aspect of the voice experience is configurable through JSON templates. No code deployment needed.</p>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6 not-prose">
    <a href="/docs/templates/flow-nodes" class="doc-card-orange group">
      <span class="text-sm font-semibold text-foreground">Flow Nodes</span>
      <p class="text-xs text-muted-foreground leading-relaxed">Build conversation graphs with directed transitions, branching, and per-node config</p>
    </a>
    <a href="/docs/templates/functions-hooks" class="doc-card-orange group">
      <span class="text-sm font-semibold text-foreground">Functions & Hooks</span>
      <p class="text-xs text-muted-foreground leading-relaxed">Define LLM-callable functions for navigation and data collection with lifecycle hooks</p>
    </a>
    <a href="/docs/config/stt" class="doc-card-orange group">
      <span class="text-sm font-semibold text-foreground">STT / TTS Providers</span>
      <p class="text-xs text-muted-foreground leading-relaxed">Swap between Soniox, Deepgram, Google, Sarvam, ElevenLabs, Cartesia per template</p>
    </a>
    <a href="/docs/config/vad" class="doc-card-orange group">
      <span class="text-sm font-semibold text-foreground">VAD & Interruption</span>
      <p class="text-xs text-muted-foreground leading-relaxed">Fine-tune voice activity detection, turn-taking behavior, and barge-in handling</p>
    </a>
  </div>

  <!-- Execution modes -->
  <h2 id="execution-modes">Execution Modes</h2>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr><th>Mode</th><th>Transport</th><th>Use Case</th></tr>
      </thead>
      <tbody>
        <tr><td><code>DAILY</code></td><td>Daily.co WebRTC rooms</td><td>Production web/mobile voice sessions</td></tr>
        <tr><td><code>DAILY_TEST</code></td><td>Daily.co WebRTC rooms</td><td>Playground / development testing</td></tr>
        <tr><td><code>TELEPHONY</code></td><td>Twilio / Plivo / Exotel</td><td>Production outbound & inbound calls</td></tr>
        <tr><td><code>TELEPHONY_TEST</code></td><td>Twilio / Plivo / Exotel</td><td>Test calls (excluded from analytics)</td></tr>
      </tbody>
    </table>
  </div>

  <!-- Platform stack -->
  <h2 id="platform-stack">Platform Stack</h2>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead><tr><th>Layer</th><th>Technology</th><th>Customizable</th></tr></thead>
      <tbody>
        <tr><td>API</td><td>FastAPI + Uvicorn</td><td>&#8212;</td></tr>
        <tr><td>Voice Engine</td><td>Pipecat-AI</td><td>&#8212;</td></tr>
        <tr><td>WebRTC</td><td>Daily.co</td><td>Room config, recording</td></tr>
        <tr><td>STT</td><td>Soniox, Deepgram, Sarvam, Google, OpenAI</td><td>Per-template</td></tr>
        <tr><td>LLM</td><td>Azure OpenAI (GPT-4o)</td><td>Model, temp, tokens</td></tr>
        <tr><td>TTS</td><td>ElevenLabs, Cartesia, Sarvam, Google</td><td>Voice, speed, style</td></tr>
        <tr><td>Telephony</td><td>Twilio, Plivo, Exotel</td><td>Per-merchant</td></tr>
        <tr><td>Database</td><td>PostgreSQL (asyncpg)</td><td>&#8212;</td></tr>
        <tr><td>Cache</td><td>Redis Cluster</td><td>&#8212;</td></tr>
        <tr><td>Observability</td><td>Langfuse, OpenTelemetry</td><td>Traces, metrics</td></tr>
      </tbody>
    </table>
  </div>

  <!-- Next steps -->
  <h2 id="next-steps">Next Steps</h2>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6 not-prose">
    <a href="/docs/daily/web-sdk" class="doc-card group">
      <span class="text-sm font-semibold text-foreground">Set up Daily SDK</span>
      <p class="text-xs text-muted-foreground">Add voice to your web app</p>
    </a>
    <a href="/docs/telephony/twilio" class="doc-card group">
      <span class="text-sm font-semibold text-foreground">Configure Twilio</span>
      <p class="text-xs text-muted-foreground">Start making phone calls</p>
    </a>
    <a href="/docs/templates/overview" class="doc-card-orange group">
      <span class="text-sm font-semibold text-foreground">Build a Template</span>
      <p class="text-xs text-muted-foreground">Design your conversation flow</p>
    </a>
    <a href="/docs/config/template" class="doc-card-orange group">
      <span class="text-sm font-semibold text-foreground">Configure Providers</span>
      <p class="text-xs text-muted-foreground">Tune STT, TTS, LLM, VAD</p>
    </a>
  </div>
</div>
