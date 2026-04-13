<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
</script>

<svelte:head><title>Observability — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Observability</h1>
  <p class="text-muted-foreground text-lg mb-8"><a href="https://langfuse.com" target="_blank" rel="noopener">Langfuse</a> tracing, <a href="https://opentelemetry.io" target="_blank" rel="noopener">OpenTelemetry</a> propagation, contextual logging, Slack alerts, and auto-evaluation.</p>

  <h2 id="overview">Overview</h2>
  <p>
    Breeze Buddy provides comprehensive observability across the entire <a href="/docs/advanced/pipeline">voice pipeline</a> — from
    LLM call tracing to structured logging with correlation IDs. This enables debugging,
    performance optimization, cost tracking, and automated quality monitoring.
  </p>

  <!-- ────────── Langfuse ────────── -->

  <h2 id="langfuse">Langfuse Integration</h2>
  <p>
    <a href="https://langfuse.com" target="_blank" rel="noopener noreferrer">Langfuse</a> is
    integrated for full LLM observability. Every LLM call is traced with inputs, outputs,
    latency, and token usage.
  </p>

  <h3 id="langfuse-capabilities">Capabilities</h3>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr>
          <th>Feature</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>LLM Tracing</td><td>Full request/response tracing for every LLM call including system prompts, user messages, and assistant responses.</td></tr>
        <tr><td>Auto-Evaluation</td><td>Background task scheduler runs periodic scoring on completed conversations.</td></tr>
        <tr><td>Cost Tracking</td><td>Token-level cost attribution per call, template, and merchant.</td></tr>
        <tr><td>Latency Metrics</td><td>Time-to-first-token and total response time for each LLM invocation.</td></tr>
      </tbody>
    </table>
  </div>

  <h3 id="langfuse-scores">Langfuse Scores</h3>
  <p>
    Auto-evaluation scores are stored on the <code>LeadCallTracker</code> via the
    <code>langfuse_scores</code> field. These scores are computed by the background evaluation
    scheduler and include metrics like task completion, sentiment, and custom rubrics.
  </p>

  <CodeBlock lang="json" code={`{
  "langfuse_scores": {
    "task_completion": 1.0,
    "sentiment": 0.85,
    "greeting_quality": 0.9,
    "objection_handling": 0.75
  }
}`} />

  <!-- ────────── OpenTelemetry ────────── -->

  <h2 id="opentelemetry">OpenTelemetry</h2>
  <p>
    Breeze Buddy uses OpenTelemetry for distributed trace context propagation across async
    boundaries. This ensures that traces are connected across the voice pipeline's concurrent
    processors.
  </p>

  <h3 id="otel-features">Features</h3>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr>
          <th>Feature</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Trace Context Propagation</td><td>Traces flow across async boundaries (STT → LLM → TTS) with proper parent-child span relationships.</td></tr>
        <tr><td>Span Attributes</td><td>Custom attributes on spans include lead ID, template ID, node name, and provider details.</td></tr>
        <tr><td>Exporter Support</td><td>Compatible with any OTLP-compatible backend (Jaeger, Zipkin, Grafana Tempo, etc.).</td></tr>
      </tbody>
    </table>
  </div>

  <!-- ────────── Contextual Logging ────────── -->

  <h2 id="contextual-logging">Contextual Logging</h2>
  <p>
    All log entries are enriched with contextual information using Python's <code>contextvars</code>.
    This enables structured logging with automatic correlation across the entire call lifecycle.
  </p>

  <h3 id="logging-fields">Contextual Fields</h3>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><code>correlation_id</code></td><td>Unique ID for the entire call session — correlates all logs for one call.</td></tr>
        <tr><td><code>lead_id</code></td><td>The lead being processed.</td></tr>
        <tr><td><code>template_id</code></td><td>The template driving the conversation.</td></tr>
        <tr><td><code>node_name</code></td><td>Current flow node (updated as conversation progresses).</td></tr>
        <tr><td><code>provider</code></td><td>Active telephony or STT/TTS provider.</td></tr>
      </tbody>
    </table>
  </div>

  <CodeBlock lang="json" code={`{
  "timestamp": "2025-01-15T10:35:02.123Z",
  "level": "INFO",
  "message": "LLM response generated",
  "correlation_id": "corr_abc123",
  "lead_id": "lead_abc123",
  "template_id": "tpl_xyz789",
  "node_name": "greeting",
  "latency_ms": 342
}`} />

  <!-- ────────── Slack Alerts ────────── -->

  <h2 id="slack-alerts">Slack Alerts</h2>
  <p>
    Automated Slack alerting triggers notifications when evaluation scores fall below
    configured thresholds. This enables proactive monitoring of voice agent quality.
  </p>

  <h3 id="alert-triggers">Alert Triggers</h3>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr>
          <th>Trigger</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Evaluation Failure</td><td>Langfuse auto-evaluation score drops below the threshold.</td></tr>
        <tr><td>LLM Error Rate</td><td>Elevated error rate from the LLM provider.</td></tr>
        <tr><td>Pipeline Failure</td><td>Voice pipeline crashes or fails to initialize.</td></tr>
      </tbody>
    </table>
  </div>

  <Callout type="info" title="Configuration">
    <p>Slack webhook URLs and alert thresholds are configured via environment variables. Each template can have its own alerting rules.</p>
  </Callout>

  <!-- ────────── Auto-Evaluation ────────── -->

  <h2 id="auto-evaluation">Langfuse Auto-Evaluation</h2>
  <p>
    A background task scheduler periodically evaluates completed conversations against
    configurable scoring rubrics. Scores are written back to Langfuse traces and stored
    on the <code>LeadCallTracker</code>.
  </p>

  <h3 id="evaluation-flow">Evaluation Flow</h3>
  <ol>
    <li>Call completes and transcription is finalized.</li>
    <li>Background scheduler picks up the conversation for evaluation.</li>
    <li>LLM-based scoring evaluates the conversation against rubrics.</li>
    <li>Scores are written to Langfuse and stored in <code>langfuse_scores</code> on the lead.</li>
    <li>If any score breaches the alert threshold, a Slack notification is dispatched.</li>
  </ol>

  <Callout type="tip" title="Custom Rubrics">
    <p>Define custom evaluation rubrics per template to measure domain-specific quality metrics like appointment confirmation rate, upsell success, or compliance adherence.</p>
  </Callout>
</div>
