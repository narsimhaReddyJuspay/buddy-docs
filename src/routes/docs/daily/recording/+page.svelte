<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import ApiEndpoint from '$lib/components/ApiEndpoint.svelte';
  import ConfigPanel from '$lib/components/ConfigPanel.svelte';
  import FlowDiagram from '$lib/components/FlowDiagram.svelte';
</script>

<svelte:head><title>Recording — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Daily Recording</h1>
  <p class="text-muted-foreground text-base mb-6">
    Every Daily voice session is cloud-recorded automatically. This guide covers how recording works, how to retrieve audio files, and how to configure storage integration.
  </p>

  <!-- How Recording Works -->
  <h2 id="how-recording-works">How Recording Works</h2>
  <p>
    Daily rooms created by Breeze Buddy have <strong>cloud recording enabled by default</strong>. Recording starts automatically when participants join and captures all audio tracks server-side — no client-side configuration needed.
  </p>

  <FlowDiagram steps={["Session Ends", "Daily Processes Recording", "Fetch via Daily API", "Download Audio", "Upload to Cloud Storage", "Store URL on Lead"]} variant="integrate" />

  <ConfigPanel title="Recording Defaults" icon="🎙️" variant="integrate">
    <div class="overflow-x-auto rounded-xl border border-border my-2">
      <table class="w-full text-sm">
        <thead class="bg-muted/30">
          <tr>
            <th class="text-left p-3 font-semibold text-foreground border-b border-border whitespace-nowrap text-xs uppercase tracking-wider">Setting</th>
            <th class="text-left p-3 font-semibold text-foreground border-b border-border whitespace-nowrap text-xs uppercase tracking-wider">Value</th>
            <th class="text-left p-3 font-semibold text-foreground border-b border-border whitespace-nowrap text-xs uppercase tracking-wider">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr class="hover:bg-muted/20 transition-colors">
            <td class="p-3 text-muted-foreground border-b border-border/60">Recording Mode</td>
            <td class="p-3 text-muted-foreground border-b border-border/60"><code>cloud</code></td>
            <td class="p-3 text-muted-foreground border-b border-border/60">Server-side recording via Daily infrastructure</td>
          </tr>
          <tr class="hover:bg-muted/20 transition-colors">
            <td class="p-3 text-muted-foreground border-b border-border/60">Auto-Start</td>
            <td class="p-3 text-muted-foreground border-b border-border/60"><code>true</code></td>
            <td class="p-3 text-muted-foreground border-b border-border/60">Recording begins when participants join</td>
          </tr>
          <tr class="hover:bg-muted/20 transition-colors">
            <td class="p-3 text-muted-foreground border-b border-border/60">Format</td>
            <td class="p-3 text-muted-foreground border-b border-border/60"><code>mp4</code> (audio)</td>
            <td class="p-3 text-muted-foreground border-b border-border/60">Contains audio tracks from all participants</td>
          </tr>
          <tr class="hover:bg-muted/20 transition-colors">
            <td class="p-3 border-b-0 text-muted-foreground">Room Expiry</td>
            <td class="p-3 border-b-0 text-muted-foreground"><code>1 hour</code></td>
            <td class="p-3 border-b-0 text-muted-foreground">Room auto-deletes; recording persists on Daily servers</td>
          </tr>
        </tbody>
      </table>
    </div>
  </ConfigPanel>

  <!-- Retrieval Flow -->
  <h2 id="retrieval-flow">Recording Retrieval Flow</h2>
  <p>After a session ends, Breeze Buddy automatically retrieves and stores the recording. The process uses the Daily REST API:</p>

  <ol class="step-list not-prose mt-8 mb-8 text-muted-foreground">
    <li>
      <strong class="text-foreground">Locate the recording</strong> — query <code>GET /recordings?room_name=&#123;name&#125;</code> on the Daily API to find recordings for the room.
    </li>
    <li>
      <strong class="text-foreground">Get access link</strong> — call <code>GET /recordings/&#123;id&#125;/access-link</code> to obtain a temporary signed download URL (valid for a limited time).
    </li>
    <li>
      <strong class="text-foreground">Download audio</strong> — fetch the audio bytes from the signed URL.
    </li>
    <li>
      <strong class="text-foreground">Upload to cloud storage</strong> — store the file in your configured storage provider (Google Cloud Storage or AWS S3).
    </li>
    <li>
      <strong class="text-foreground">Update lead record</strong> — the <code>recording_url</code> field on the lead is updated with the permanent storage URL.
    </li>
  </ol>

  <!-- Cloud Storage Configuration -->
  <h2 id="cloud-storage-configuration">Cloud Storage Configuration</h2>
  <p>Configure your storage provider via environment variables:</p>

  <CodeBlock lang="bash" filename=".env" code={`# Google Cloud Storage
RECORDING_STORAGE_PROVIDER=gcs
GCS_BUCKET_NAME=your-recordings-bucket
GCS_CREDENTIALS_FILE=/path/to/service-account.json

# — OR — AWS S3
RECORDING_STORAGE_PROVIDER=s3
S3_BUCKET_NAME=your-recordings-bucket
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1`} />

  <Callout type="warning" title="Storage & Retention">
    <p><strong>Daily-side retention:</strong> Daily stores cloud recordings for <strong>7 days</strong> by default. Breeze Buddy fetches recordings immediately after sessions end, but if retrieval fails, you have a 7-day window to retry.</p>
    <p class="mt-2"><strong>Your storage:</strong> Once uploaded to GCS or S3, retention is governed by your bucket lifecycle policies. Configure appropriate retention and access controls for compliance.</p>
    <p class="mt-2"><strong>Cost:</strong> Cloud recording on Daily incurs additional usage charges. See the <a href="https://www.daily.co/pricing" target="_blank" rel="noopener noreferrer">Daily pricing page</a> for details.</p>
  </Callout>

  <!-- Download Endpoint -->
  <h2 id="download-endpoint">Download Endpoint</h2>
  <p>Retrieve the recording for a specific lead via the Breeze Buddy API:</p>

  <ApiEndpoint method="GET" path="/agent/voice/breeze-buddy/leads/{'{lead_id}'}/recording" description="Returns the audio recording file for the given lead as a binary stream." />

  <h3 id="download-example">Download Example</h3>
  <CodeBlock lang="typescript" filename="download-recording.ts" code={`const response = await fetch(
  \`https://your-api.example.com/agent/voice/breeze-buddy/leads/\${leadId}/recording\`,
  {
    headers: {
      'Authorization': 'Bearer <your-api-key>'
    }
  }
);

if (response.ok) {
  const blob = await response.blob();
  // Save or play the audio
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.play();
} else {
  console.error('Recording not available:', response.status);
}`} />

  <h3 id="curl-example">cURL Example</h3>
  <CodeBlock lang="bash" filename="terminal" code={`curl -H "Authorization: Bearer <your-api-key>" \\
  -o recording.mp4 \\
  https://your-api.example.com/agent/voice/breeze-buddy/leads/{lead_id}/recording`} />

  <!-- Recording in the Lead Lifecycle -->
  <h2 id="lead-lifecycle">Recording in the Lead Lifecycle</h2>
  <p>The recording URL is stored on the lead record once processing completes. You can access it via the Leads API:</p>

  <CodeBlock lang="json" code={`{
  "lead_id": "uuid-of-the-lead",
  "status": "FINISHED",
  "call_id": "room-abc123",
  "recording_url": "https://storage.googleapis.com/your-bucket/recordings/room-abc123.mp4",
  "duration_seconds": 142,
  "outcome": "appointment_confirmed"
}`} />

  <Callout type="tip" title="Webhook Notification">
    <p>Configure a <a href="/docs/misc/webhooks">webhook</a> to receive a notification when recording processing is complete. The webhook payload includes the <code>recording_url</code> so you can trigger downstream workflows automatically.</p>
  </Callout>

  <!-- Troubleshooting -->
  <h2 id="troubleshooting">Troubleshooting</h2>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr>
          <th>Issue</th>
          <th>Cause</th>
          <th>Resolution</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Recording URL is <code>null</code></td>
          <td>Recording retrieval hasn't completed yet</td>
          <td>Wait 1–2 minutes after session ends; check webhook for completion</td>
        </tr>
        <tr>
          <td>Recording download returns 404</td>
          <td>File hasn't been uploaded to cloud storage</td>
          <td>Check storage provider credentials and bucket permissions</td>
        </tr>
        <tr>
          <td>Recording is empty / 0 bytes</td>
          <td>Session ended before audio was exchanged</td>
          <td>Ensure bot joined and at least one audio exchange occurred</td>
        </tr>
        <tr>
          <td>Daily API returns no recordings for room</td>
          <td>Recording processed but Daily retention expired</td>
          <td>Recordings expire after 7 days on Daily — ensure timely retrieval</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Next Steps -->
  <h2 id="next-steps">Next Steps</h2>
  <div class="not-prose feature-grid">
    <a href="/docs/daily/overview" class="card-integrate block no-underline">
      <div class="flex items-start gap-3">
        <span class="text-2xl">🌐</span>
        <div>
          <h3 class="text-sm font-semibold text-foreground mb-1">Daily Overview</h3>
          <p class="text-xs text-muted-foreground">Architecture, connection flow, and room configuration.</p>
        </div>
      </div>
    </a>
    <a href="/docs/misc/leads" class="card-integrate block no-underline">
      <div class="flex items-start gap-3">
        <span class="text-2xl">👤</span>
        <div>
          <h3 class="text-sm font-semibold text-foreground mb-1">Leads API</h3>
          <p class="text-xs text-muted-foreground">Access recording URLs and session metadata on lead records.</p>
        </div>
      </div>
    </a>
    <a href="/docs/misc/webhooks" class="card-integrate block no-underline">
      <div class="flex items-start gap-3">
        <span class="text-2xl">🔔</span>
        <div>
          <h3 class="text-sm font-semibold text-foreground mb-1">Webhooks</h3>
          <p class="text-xs text-muted-foreground">Get notified when recordings are ready for download.</p>
        </div>
      </div>
    </a>
    <a href="/docs/advanced/observability" class="card-integrate block no-underline">
      <div class="flex items-start gap-3">
        <span class="text-2xl">📊</span>
        <div>
          <h3 class="text-sm font-semibold text-foreground mb-1">Observability</h3>
          <p class="text-xs text-muted-foreground">Monitor recording retrieval success rates and latency.</p>
        </div>
      </div>
    </a>
  </div>
</div>
