<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import ConfigPanel from '$lib/components/ConfigPanel.svelte';
</script>

<svelte:head><title>Web SDK Setup — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Web SDK Setup</h1>
  <p class="text-muted-foreground text-base mb-6">
    Step-by-step guide to integrating the Pipecat client SDK with Daily transport in your frontend application — covering installation, connection, event handling, and error recovery.
  </p>

  <!-- Install -->
  <h2 id="install-dependencies">Install Dependencies</h2>
  <p>Install the Pipecat client SDK and Daily transport packages:</p>

  <CodeBlock lang="bash" filename="terminal" code={`# npm
npm install @pipecat-ai/client-js @pipecat-ai/daily-transport @daily-co/daily-js

# pnpm
pnpm add @pipecat-ai/client-js @pipecat-ai/daily-transport @daily-co/daily-js

# yarn
yarn add @pipecat-ai/client-js @pipecat-ai/daily-transport @daily-co/daily-js`} />

  <Callout type="info" title="TypeScript Support">
    <p>All packages ship with built-in TypeScript declarations. No additional <code>@types/*</code> packages are needed.</p>
  </Callout>

  <!-- Initialize Client -->
  <h2 id="initialize-client">Initialize the Client</h2>
  <p>Create the RTVI client with Daily transport and configure it to point at your Breeze Buddy backend:</p>

  <CodeBlock lang="typescript" filename="voice-client.ts" code={`import { RTVIClient } from '@pipecat-ai/client-js';
import { DailyTransport } from '@pipecat-ai/daily-transport';

const transport = new DailyTransport();

const client = new RTVIClient({
  transport,
  params: {
    baseUrl: 'https://your-api.example.com',
    endpoints: {
      connect: '/agent/voice/breeze-buddy/daily/connect'
    }
  },
  enableMic: true,
  enableCam: false
});`} />

  <ConfigPanel title="SDK Configuration Options" icon="⚙️" variant="integrate">
    <div class="overflow-x-auto rounded-xl border border-border my-2">
      <table class="w-full text-sm">
        <thead class="bg-muted/30">
          <tr>
            <th class="text-left p-3 font-semibold text-foreground border-b border-border whitespace-nowrap text-xs uppercase tracking-wider">Option</th>
            <th class="text-left p-3 font-semibold text-foreground border-b border-border whitespace-nowrap text-xs uppercase tracking-wider">Type</th>
            <th class="text-left p-3 font-semibold text-foreground border-b border-border whitespace-nowrap text-xs uppercase tracking-wider">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr class="hover:bg-muted/20 transition-colors">
            <td class="p-3 text-muted-foreground border-b border-border/60"><code>transport</code></td>
            <td class="p-3 text-muted-foreground border-b border-border/60"><code>Transport</code></td>
            <td class="p-3 text-muted-foreground border-b border-border/60">Transport instance — use <code>DailyTransport</code> for WebRTC</td>
          </tr>
          <tr class="hover:bg-muted/20 transition-colors">
            <td class="p-3 text-muted-foreground border-b border-border/60"><code>params.baseUrl</code></td>
            <td class="p-3 text-muted-foreground border-b border-border/60"><code>string</code></td>
            <td class="p-3 text-muted-foreground border-b border-border/60">Base URL of your Breeze Buddy API</td>
          </tr>
          <tr class="hover:bg-muted/20 transition-colors">
            <td class="p-3 text-muted-foreground border-b border-border/60"><code>params.endpoints.connect</code></td>
            <td class="p-3 text-muted-foreground border-b border-border/60"><code>string</code></td>
            <td class="p-3 text-muted-foreground border-b border-border/60">Path to the Daily connect endpoint</td>
          </tr>
          <tr class="hover:bg-muted/20 transition-colors">
            <td class="p-3 text-muted-foreground border-b border-border/60"><code>enableMic</code></td>
            <td class="p-3 text-muted-foreground border-b border-border/60"><code>boolean</code></td>
            <td class="p-3 text-muted-foreground border-b border-border/60">Enable microphone input (required for voice)</td>
          </tr>
          <tr class="hover:bg-muted/20 transition-colors">
            <td class="p-3 border-b-0 text-muted-foreground"><code>enableCam</code></td>
            <td class="p-3 border-b-0 text-muted-foreground"><code>boolean</code></td>
            <td class="p-3 border-b-0 text-muted-foreground">Enable camera — set <code>false</code> for voice-only sessions</td>
          </tr>
        </tbody>
      </table>
    </div>
  </ConfigPanel>

  <!-- Connect to Session -->
  <h2 id="connect-to-session">Connect to a Session</h2>
  <p>After pushing a lead via the Leads API, use the returned <code>lead_id</code> to initiate the voice session:</p>

  <CodeBlock lang="typescript" filename="session.ts" code={`// Connect — this calls /daily/connect internally and joins the room
await client.connect({
  lead_id: 'your-lead-id'
});

console.log('Connected to voice session');

// When the conversation is complete, disconnect cleanly
await client.disconnect();`} />

  <!-- Event Handling -->
  <h2 id="event-handling">Event Handling</h2>
  <p>Register event listeners to react to transcription, bot speech, and session lifecycle events in real time:</p>

  <CodeBlock lang="typescript" filename="events.ts" code={`// Real-time user speech transcription
client.on('userTranscription', (data) => {
  console.log(\`User said: \${data.text}\`);
  // data.final indicates whether the transcription is complete
  if (data.final) {
    appendToTranscript('user', data.text);
  }
});

// Bot text-to-speech output
client.on('botTtsText', (data) => {
  console.log(\`Bot says: \${data.text}\`);
  appendToTranscript('bot', data.text);
});

// Bot joined and pipeline is ready
client.on('botReady', () => {
  console.log('Bot connected — conversation starting');
  showStatus('active');
});

// Session disconnected
client.on('disconnected', () => {
  console.log('Session ended');
  showStatus('ended');
});

// Pipeline latency and token usage metrics
client.on('metrics', (data) => {
  console.log(\`Latency: \${data.total_latency_ms}ms\`);
});`} />

  <!-- Audio Visualization -->
  <h2 id="audio-visualization">Audio Visualization</h2>
  <p>Access the remote audio track to build waveform or volume-level visualizations:</p>

  <CodeBlock lang="typescript" filename="visualizer.ts" code={`client.on('trackStarted', (track, participant) => {
  if (track.kind === 'audio' && !participant.local) {
    // Remote bot audio — connect to Web Audio API
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(
      new MediaStream([track])
    );
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    // Read frequency data for visualization
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    function draw() {
      analyser.getByteFrequencyData(dataArray);
      // Render dataArray to your canvas or visualizer component
      requestAnimationFrame(draw);
    }
    draw();
  }
});`} />

  <!-- Error Handling -->
  <h2 id="error-handling">Error Handling</h2>
  <p>Implement robust error recovery to handle network issues, permission denials, and pipeline errors:</p>

  <CodeBlock lang="typescript" filename="error-handling.ts" code={`// Transport-level errors (network issues, room failures)
client.on('error', (error) => {
  console.error('Transport error:', error);

  if (error.type === 'connection-failed') {
    showError('Unable to connect. Check your network and try again.');
  } else if (error.type === 'mic-permission-denied') {
    showError('Microphone access is required for voice sessions.');
  }
});

// Pipeline processing errors from the bot
client.on('pipelineError', (error) => {
  console.error('Pipeline error:', error);
  showError('The voice assistant encountered an error. Reconnecting...');

  // Attempt reconnection with exponential backoff
  setTimeout(() => client.connect({ lead_id: currentLeadId }), 2000);
});

// Handle unexpected disconnection
client.on('disconnected', () => {
  if (!intentionalDisconnect) {
    showError('Connection lost. Please refresh to reconnect.');
  }
});`} />

  <!-- React Integration -->
  <h2 id="react-integration">React Integration</h2>
  <p>Example React hook wrapping the RTVI client lifecycle:</p>

  <CodeBlock lang="tsx" filename="useVoiceSession.tsx" code={`import { useEffect, useRef, useState, useCallback } from 'react';
import { RTVIClient } from '@pipecat-ai/client-js';
import { DailyTransport } from '@pipecat-ai/daily-transport';

type Status = 'idle' | 'connecting' | 'active' | 'ended' | 'error';

export function useVoiceSession(baseUrl: string) {
  const clientRef = useRef<RTVIClient | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [transcript, setTranscript] = useState<string[]>([]);

  useEffect(() => {
    const transport = new DailyTransport();
    const client = new RTVIClient({
      transport,
      params: {
        baseUrl,
        endpoints: { connect: '/agent/voice/breeze-buddy/daily/connect' }
      },
      enableMic: true,
      enableCam: false
    });

    client.on('botReady', () => setStatus('active'));
    client.on('disconnected', () => setStatus('ended'));
    client.on('error', () => setStatus('error'));
    client.on('userTranscription', (d) => {
      if (d.final) setTranscript((t) => [...t, \`You: \${d.text}\`]);
    });
    client.on('botTtsText', (d) => {
      setTranscript((t) => [...t, \`Bot: \${d.text}\`]);
    });

    clientRef.current = client;
    return () => { client.disconnect(); };
  }, [baseUrl]);

  const connect = useCallback(async (leadId: string) => {
    setStatus('connecting');
    await clientRef.current?.connect({ lead_id: leadId });
  }, []);

  const disconnect = useCallback(async () => {
    await clientRef.current?.disconnect();
  }, []);

  return { status, transcript, connect, disconnect };
}`} />

  <!-- Vanilla JS -->
  <h2 id="vanilla-js">Vanilla JavaScript</h2>
  <p>For non-framework projects, the same SDK works directly:</p>

  <CodeBlock lang="html" filename="index.html" code={`<script type="module">
  import { RTVIClient } from 'https://esm.sh/@pipecat-ai/client-js';
  import { DailyTransport } from 'https://esm.sh/@pipecat-ai/daily-transport';

  const client = new RTVIClient({
    transport: new DailyTransport(),
    params: {
      baseUrl: 'https://your-api.example.com',
      endpoints: { connect: '/agent/voice/breeze-buddy/daily/connect' }
    },
    enableMic: true,
    enableCam: false
  });

  document.getElementById('connect-btn').onclick = async () => {
    await client.connect({ lead_id: document.getElementById('lead-input').value });
  };

  document.getElementById('disconnect-btn').onclick = async () => {
    await client.disconnect();
  };

  client.on('userTranscription', (d) => {
    if (d.final) {
      document.getElementById('transcript').innerHTML +=
        '<p><strong>User:</strong> ' + d.text + '</p>';
    }
  });

  client.on('botTtsText', (d) => {
    document.getElementById('transcript').innerHTML +=
      '<p><strong>Bot:</strong> ' + d.text + '</p>';
  });
</script>`} />

  <!-- Mobile Considerations -->
  <Callout type="warning" title="Mobile Considerations">
    <p><strong>iOS Safari</strong> requires a user gesture (tap) before <code>AudioContext</code> can start. Call <code>client.connect()</code> inside a click/tap handler, not on page load.</p>
    <p class="mt-2"><strong>Android WebView</strong> — ensure <code>WebSettings.setMediaPlaybackRequiresUserGesture(false)</code> is set and microphone permissions are granted via <code>onPermissionRequest</code>.</p>
    <p class="mt-2"><strong>Background audio</strong> — mobile browsers may suspend WebRTC connections when the app is backgrounded. Listen for <code>visibilitychange</code> events and notify users if the session may be interrupted.</p>
  </Callout>

  <!-- Next Steps -->
  <h2 id="next-steps">Next Steps</h2>
  <div class="not-prose feature-grid">
    <a href="/docs/daily/rtvi-events" class="card-integrate block no-underline">
      <div class="flex items-start gap-3">
        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10"><svg class="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></div>
        <div>
          <h3 class="text-sm font-semibold text-foreground mb-1">RTVI Events Reference</h3>
          <p class="text-xs text-muted-foreground">Full event type reference with payload schemas and handling patterns.</p>
        </div>
      </div>
    </a>
    <a href="/docs/daily/overview" class="card-integrate block no-underline">
      <div class="flex items-start gap-3">
        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10"><svg class="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></div>
        <div>
          <h3 class="text-sm font-semibold text-foreground mb-1">Daily Overview</h3>
          <p class="text-xs text-muted-foreground">Architecture, connection flow, and transport configuration details.</p>
        </div>
      </div>
    </a>
  </div>
</div>
