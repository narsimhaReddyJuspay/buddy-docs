<script lang="ts">
  import Callout from '$lib/components/Callout.svelte';
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
      Breeze Buddy<br/>
      <span style="background: linear-gradient(135deg, var(--buddy-purple), var(--buddy-purple-light)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Voice AI Platform</span>
    </h1>

    <p class="text-base text-muted-foreground max-w-2xl leading-relaxed">
      Breeze Buddy is an enterprise-grade <strong class="text-foreground">conversational voice AI platform</strong> that enables businesses to deploy intelligent voice agents at scale — across phone calls and web applications — without writing a single line of agent logic.
    </p>
  </div>

  <!-- What is Breeze Buddy -->
  <h2 id="what-is-breeze-buddy">What is Breeze Buddy?</h2>

  <p>
    Breeze Buddy is a fully managed voice AI backend that handles the entire lifecycle of a voice conversation —
    from receiving a lead, placing or connecting a call, running a real-time speech pipeline (STT → LLM → TTS),
    navigating a <a href="/docs/templates/overview">template-driven conversation flow</a>, to delivering structured outcomes via <a href="/docs/misc/webhooks">webhooks</a>.
  </p>

  <p>
    Think of it as <strong>a programmable voice agent as a service</strong>. You define <em>what</em> the agent should
    say and do through <a href="/docs/templates/flow-nodes">JSON templates</a>, and Breeze Buddy handles the <em>how</em> — infrastructure, real-time audio
    processing, telephony integration, retry logic, <a href="/docs/misc/analytics">analytics</a>, and <a href="/docs/advanced/observability">observability</a>.
  </p>

  <div class="my-6 not-prose grid grid-cols-1 sm:grid-cols-3 gap-3">
    <div class="rounded-xl border border-border bg-card p-4">
      <div class="flex items-center gap-2 mb-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg" style="background: color-mix(in srgb, var(--buddy-purple) 12%, transparent);">
          <svg class="h-4 w-4" style="color: var(--buddy-purple-light);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
        </div>
        <span class="text-sm font-semibold text-foreground">No-Code Agent Logic</span>
      </div>
      <p class="text-xs text-muted-foreground leading-relaxed">Define conversation flows, prompts, and transitions in <a href="/docs/templates/overview" class="text-muted-foreground underline">JSON templates</a>. Deploy changes instantly without code releases.</p>
    </div>
    <div class="rounded-xl border border-border bg-card p-4">
      <div class="flex items-center gap-2 mb-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg" style="background: color-mix(in srgb, var(--buddy-purple) 12%, transparent);">
          <svg class="h-4 w-4" style="color: var(--buddy-purple-light);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3h5v5"/><path d="M4 20L21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/></svg>
        </div>
        <span class="text-sm font-semibold text-foreground">Dual Transport</span>
      </div>
      <p class="text-xs text-muted-foreground leading-relaxed">Use <a href="/docs/daily/overview" class="text-muted-foreground underline">Daily WebRTC</a> for browser-based voice or <a href="/docs/telephony/overview" class="text-muted-foreground underline">Telephony</a> (Twilio, Plivo, Exotel) for phone calls — same template, same API.</p>
    </div>
    <div class="rounded-xl border border-border bg-card p-4">
      <div class="flex items-center gap-2 mb-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg" style="background: color-mix(in srgb, var(--buddy-purple) 12%, transparent);">
          <svg class="h-4 w-4" style="color: var(--buddy-purple-light);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        </div>
        <span class="text-sm font-semibold text-foreground">Enterprise Ready</span>
      </div>
      <p class="text-xs text-muted-foreground leading-relaxed">Multi-tenant <a href="/docs/auth/rbac" class="text-muted-foreground underline">RBAC</a>, rate limiting, blacklists, retry logic, <a href="/docs/misc/analytics" class="text-muted-foreground underline">analytics</a>, <a href="/docs/advanced/observability" class="text-muted-foreground underline">Langfuse observability</a> — all built in.</p>
    </div>
  </div>

  <!-- How it's different -->
  <h2 id="how-its-different">How is it Different?</h2>

  <p>Most voice AI solutions require you to write agent code, manage WebSocket connections, handle audio streams, and orchestrate STT/LLM/TTS yourself. Breeze Buddy abstracts all of that:</p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr><th>Capability</th><th>Typical Voice AI</th><th>Breeze Buddy</th></tr>
      </thead>
      <tbody>
        <tr><td>Agent logic</td><td>Custom Python/Node code</td><td><strong><a href="/docs/templates/overview">JSON templates</a></strong> — no deployment needed</td></tr>
        <tr><td>Conversation flow</td><td>Hard-coded state machines</td><td><strong><a href="/docs/templates/flow-nodes">Graph-based flow nodes</a></strong> with LLM-driven transitions</td></tr>
        <tr><td>Voice pipeline</td><td>Stitch together STT + LLM + TTS</td><td><strong><a href="/docs/advanced/pipeline">Managed pipeline</a></strong> — <a href="https://github.com/pipecat-ai/pipecat" target="_blank" rel="noopener">Pipecat-AI</a> under the hood</td></tr>
        <tr><td>Telephony</td><td>Write Twilio/Plivo integrations</td><td><strong><a href="/docs/telephony/overview">Built-in</a></strong> — Twilio, Plivo, Exotel with auto-retry</td></tr>
        <tr><td>Browser voice</td><td>Build custom WebRTC client</td><td><strong><a href="/docs/daily/web-sdk">Daily SDK + RTVI</a></strong> — 10 lines of code</td></tr>
        <tr><td>Provider switching</td><td>Rewrite integration layer</td><td><strong><a href="/docs/config/template">Per-template config</a></strong> — swap STT/TTS/LLM in JSON</td></tr>
        <tr><td>Multi-tenancy</td><td>Build yourself</td><td><strong><a href="/docs/auth/rbac">Native RBAC</a></strong> — admin &gt; reseller &gt; merchant &gt; user</td></tr>
        <tr><td>Analytics</td><td>Custom dashboards</td><td><strong><a href="/docs/misc/analytics">Built-in query API</a></strong> — sentiment, outcomes, funnels</td></tr>
      </tbody>
    </table>
  </div>

  <!-- Key Use Cases -->
  <h2 id="use-cases">Key Use Cases</h2>

  <div class="not-prose">
    <ul class="space-y-2 my-4">
      <li class="flex items-start gap-2 text-sm text-muted-foreground">
        <svg class="h-4 w-4 mt-0.5 shrink-0" style="color: var(--buddy-purple-light);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>
        <span><strong class="text-foreground">Appointment reminders & confirmations</strong> — outbound calls with date/time confirmation and rescheduling</span>
      </li>
      <li class="flex items-start gap-2 text-sm text-muted-foreground">
        <svg class="h-4 w-4 mt-0.5 shrink-0" style="color: var(--buddy-purple-light);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>
        <span><strong class="text-foreground">Lead qualification</strong> — automated voice screening with <a href="/docs/advanced/input-collection" class="text-muted-foreground underline">structured data collection</a></span>
      </li>
      <li class="flex items-start gap-2 text-sm text-muted-foreground">
        <svg class="h-4 w-4 mt-0.5 shrink-0" style="color: var(--buddy-purple-light);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>
        <span><strong class="text-foreground">Customer support IVR</strong> — <a href="/docs/telephony/inbound" class="text-muted-foreground underline">inbound call handling</a> with <a href="/docs/advanced/ivr" class="text-muted-foreground underline">intent routing</a> and <a href="/docs/telephony/warm-transfer" class="text-muted-foreground underline">warm transfer</a> to humans</span>
      </li>
      <li class="flex items-start gap-2 text-sm text-muted-foreground">
        <svg class="h-4 w-4 mt-0.5 shrink-0" style="color: var(--buddy-purple-light);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>
        <span><strong class="text-foreground">Survey & feedback collection</strong> — multi-question voice surveys with <a href="/docs/misc/analytics" class="text-muted-foreground underline">sentiment analysis</a></span>
      </li>
      <li class="flex items-start gap-2 text-sm text-muted-foreground">
        <svg class="h-4 w-4 mt-0.5 shrink-0" style="color: var(--buddy-purple-light);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>
        <span><strong class="text-foreground">In-app voice assistants</strong> — embed real-time voice AI in web/mobile apps via <a href="/docs/daily/overview" class="text-muted-foreground underline">Daily WebRTC</a></span>
      </li>
    </ul>
  </div>

  <!-- Integration paths — primary CTA cards -->
  <h2 id="choose-integration">Choose Your Integration</h2>

  <p>Breeze Buddy supports two transport modes. Both use the same <a href="/docs/templates/overview">template system</a> and <a href="/docs/misc/leads">Leads API</a> — the only difference is how audio reaches the user. See the <a href="/docs/architecture">Architecture</a> page for the full request lifecycle.</p>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 not-prose">
    <a href="/docs/daily/overview" class="doc-card group">
      <div class="flex h-10 w-10 items-center justify-center rounded-lg" style="background: color-mix(in srgb, var(--buddy-purple) 12%, transparent);">
        <svg class="h-5 w-5" style="color: var(--buddy-purple-light);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="m7 21 5-3 5 3"/></svg>
      </div>
      <div>
        <span class="text-base font-semibold text-foreground">Daily WebRTC</span>
        <p class="text-sm text-muted-foreground mt-1.5 leading-relaxed">Embed real-time voice AI into web and mobile apps. Low-latency audio via Daily's WebRTC infrastructure, RTVI events, and recording support.</p>
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
        <p class="text-sm text-muted-foreground mt-1.5 leading-relaxed">Place and receive phone calls through Twilio, Plivo, or Exotel. Outbound campaigns, inbound routing, and warm transfer.</p>
      </div>
      <div class="flex items-center gap-2 mt-auto pt-2">
        <span class="text-xs font-medium" style="color: var(--buddy-orange-light);">Configure &#8594;</span>
        <span class="badge-orange text-[0.5625rem]">PSTN</span>
      </div>
    </a>
  </div>

  <!-- How it works — brief summary with link to arch -->
  <h2 id="how-it-works">How It Works</h2>

  <p>The core workflow is simple:</p>

  <div class="not-prose">
    <ol class="step-list my-6 list-none pl-0">
      <li>
        <strong class="text-foreground text-sm">Push a lead via API</strong>
        <p class="text-[0.8125rem] text-muted-foreground mt-1 leading-relaxed">Send a request to the <a href="/docs/misc/leads" style="color: var(--buddy-purple-light);">Leads API</a> with your template, payload, and <a href="/docs/config/call-execution" style="color: var(--buddy-purple-light);">execution mode</a></p>
      </li>
      <li>
        <strong class="text-foreground text-sm">Platform validates and routes</strong>
        <p class="text-[0.8125rem] text-muted-foreground mt-1 leading-relaxed"><a href="/docs/advanced/pre-checks" class="text-muted-foreground underline">Pre-checks</a>, template schema match, and <a href="/docs/misc/numbers#blacklist" class="text-muted-foreground underline">number blacklist</a> are validated. Then the lead is routed to <a href="/docs/daily/overview" class="text-muted-foreground underline">Daily</a> or <a href="/docs/telephony/overview" class="text-muted-foreground underline">Telephony</a>.</p>
      </li>
      <li>
        <strong class="text-foreground text-sm">Voice pipeline processes in real-time</strong>
        <p class="text-[0.8125rem] text-muted-foreground mt-1 leading-relaxed"><a href="/docs/config/stt" class="text-muted-foreground underline">STT</a> &#8594; <a href="/docs/config/llm" class="text-muted-foreground underline">LLM</a> &#8594; <a href="/docs/config/tts" class="text-muted-foreground underline">TTS</a> pipeline processes audio. The LLM navigates <a href="/docs/templates/flow-nodes" class="text-muted-foreground underline">template nodes</a> via <a href="/docs/templates/functions-hooks" class="text-muted-foreground underline">function calling</a>.</p>
      </li>
      <li>
        <strong class="text-foreground text-sm">Receive webhook callbacks</strong>
        <p class="text-[0.8125rem] text-muted-foreground mt-1 leading-relaxed">Get full transcription, collected data, outcome status, and analytics via the <a href="/docs/misc/webhooks" class="text-muted-foreground underline">reporting webhook</a>.</p>
      </li>
    </ol>
  </div>

  <Callout type="info" title="See the full picture">
    <p>For the detailed request lifecycle with flow diagrams, execution modes, and platform stack, see the <a href="/docs/architecture" style="color: var(--buddy-purple-light); text-decoration: underline;">Architecture</a> page.</p>
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
      <p class="text-xs text-muted-foreground leading-relaxed">Swap between Soniox, Deepgram, Google, ElevenLabs, Cartesia per template</p>
    </a>
    <a href="/docs/config/vad" class="doc-card-orange group">
      <span class="text-sm font-semibold text-foreground">VAD & Interruption</span>
      <p class="text-xs text-muted-foreground leading-relaxed">Fine-tune voice activity detection, turn-taking, and barge-in handling</p>
    </a>
  </div>

  <!-- Next steps -->
  <h2 id="next-steps">Next Steps</h2>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6 not-prose">
    <a href="/docs/architecture" class="doc-card group">
      <span class="text-sm font-semibold text-foreground">Architecture</span>
      <p class="text-xs text-muted-foreground">System design, request lifecycle & flow diagrams</p>
    </a>
    <a href="/docs/auth/overview" class="doc-card group">
      <span class="text-sm font-semibold text-foreground">Authentication</span>
      <p class="text-xs text-muted-foreground">Set up API tokens and RBAC</p>
    </a>
    <a href="/docs/quickstart" class="doc-card-orange group">
      <span class="text-sm font-semibold text-foreground">Quick Start</span>
      <p class="text-xs text-muted-foreground">Your first voice agent in 5 minutes</p>
    </a>
    <a href="/docs/templates/overview" class="doc-card-orange group">
      <span class="text-sm font-semibold text-foreground">Build a Template</span>
      <p class="text-xs text-muted-foreground">Design your conversation flow</p>
    </a>
  </div>
</div>
