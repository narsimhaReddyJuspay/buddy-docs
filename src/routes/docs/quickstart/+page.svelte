<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import ApiEndpoint from '$lib/components/ApiEndpoint.svelte';
</script>

<svelte:head><title>Quick Start — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Quick Start</h1>
  <p class="text-muted-foreground text-lg mb-8">Get a voice agent running in under 5 minutes.</p>

  <h2 id="step-1-create-template">Step 1: Create a Template</h2>
  <p>Create a simple greeting template that confirms a user's appointment.</p>

  <ApiEndpoint method="POST" path="/agent/voice/breeze-buddy/templates" />

  <CodeBlock lang="json" code={`{
  "name": "appointment-reminder",
  "flow": {
    "initial_node": "greeting",
    "nodes": [
      {
        "node_name": "greeting",
        "task_messages": [
          {
            "role": "system",
            "content": "You are a friendly appointment reminder agent. Greet the customer by name and confirm their upcoming appointment on {appointment_date} at {appointment_time}. If they confirm, thank them. If they want to reschedule, collect a new preferred date."
          }
        ],
        "role_messages": [],
        "pre_actions": [],
        "post_actions": [],
        "functions": [
          {
            "name": "appointment_confirmed",
            "description": "Customer confirmed the appointment",
            "properties": {},
            "required": [],
            "transition_to": "farewell",
            "hooks": [
              {
                "name": "update_outcome_in_database",
                "expected_fields": {
                  "outcome": { "source": "static", "value": "confirmed" }
                }
              }
            ]
          },
          {
            "name": "appointment_rescheduled",
            "description": "Customer wants to reschedule",
            "properties": {
              "new_date": { "type": "string", "description": "New preferred date" }
            },
            "required": ["new_date"],
            "transition_to": "farewell",
            "hooks": [
              {
                "name": "update_outcome_in_database",
                "expected_fields": {
                  "outcome": { "source": "static", "value": "rescheduled" },
                  "new_date": { "source": "llm" }
                }
              }
            ]
          }
        ]
      },
      {
        "node_name": "farewell",
        "task_messages": [
          {
            "role": "system",
            "content": "Thank the customer and say goodbye politely."
          }
        ],
        "role_messages": [],
        "pre_actions": [],
        "post_actions": [],
        "functions": [
          {
            "name": "end_call",
            "description": "Conversation is complete",
            "properties": {},
            "required": [],
            "transition_to": null,
            "hooks": []
          }
        ]
      }
    ],
    "global_functions": [],
    "end_conversation_callbacks": []
  },
  "configurations": {
    "initial_greeting": "Hi {customer_name}, this is Breeze calling about your appointment.",
    "tts_voice_name": "rhea",
    "stt_configuration": {
      "provider": "deepgram",
      "language": "en",
      "turn_detection": "smart_turn"
    }
  },
  "expected_payload_schema": {
    "type": "object",
    "properties": {
      "customer_name": { "type": "string" },
      "customer_phone": { "type": "string" },
      "appointment_date": { "type": "string" },
      "appointment_time": { "type": "string" }
    },
    "required": ["customer_name", "customer_phone", "appointment_date", "appointment_time"]
  }
}`} />

  <h2 id="step-2-configure-execution">Step 2: Configure Call Execution</h2>
  <p>Set up calling hours, retry logic, and telephony provider.</p>

  <ApiEndpoint method="POST" path="/agent/voice/breeze-buddy/configurations" />

  <CodeBlock lang="json" code={`{
  "reseller_id": "your-reseller-id",
  "template": "appointment-reminder",
  "calling_provider": "TWILIO",
  "call_start_time": "09:00:00",
  "call_end_time": "18:00:00",
  "max_retry": 2,
  "retry_offset": 3600,
  "initial_offset": 0,
  "enable_calling": true,
  "enable_inbound": false,
  "enforce_blacklist": true
}`} />

  <h2 id="step-3-push-lead">Step 3: Push a Lead</h2>

  <ApiEndpoint method="POST" path="/agent/voice/breeze-buddy/push/lead/v2" />

  <CodeBlock lang="json" code={`{
  "request_id": "unique-request-123",
  "template": "appointment-reminder",
  "reseller_id": "your-reseller-id",
  "execution_mode": "TELEPHONY",
  "payload": {
    "customer_name": "John",
    "customer_phone": "+14155551234",
    "appointment_date": "April 15, 2026",
    "appointment_time": "2:30 PM"
  }
}`} />

  <Callout type="tip" title="Test with Daily">
    <p>Set <code>execution_mode</code> to <code>"DAILY_TEST"</code> to test in the browser instead of making a real phone call. Then connect via the <code>/daily/connect</code> endpoint.</p>
  </Callout>

  <h2 id="step-4-monitor">Step 4: Monitor</h2>
  <p>Check the lead status and retrieve the recording after the call:</p>

  <ApiEndpoint method="GET" path="/agent/voice/breeze-buddy/leads/{'{lead_id}'}" />

  <p>The response includes status, outcome, transcription, call timing, and Langfuse scores.</p>
</div>
