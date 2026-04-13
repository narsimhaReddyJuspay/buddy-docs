<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import ApiEndpoint from '$lib/components/ApiEndpoint.svelte';
</script>

<svelte:head><title>Templates API — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Templates API</h1>
  <p class="text-muted-foreground text-lg mb-8">CRUD operations for voice agent templates — create, list, update, and delete.</p>

  <h2 id="overview">Overview</h2>
  <p>
    Templates define the conversational flow, system prompts, functions, and hooks for a voice agent.
    All template endpoints are RBAC-filtered — callers only see templates they have access to based on
    their role, reseller, and merchant scope.
  </p>

  <h2 id="create-template">Create Template</h2>

  <ApiEndpoint method="POST" path="/templates" />

  <h3 id="create-request">Request Body</h3>

  <CodeBlock lang="json" code={`{
  "name": "appointment-reminder",
  "reseller_id": "res_001",
  "merchant_id": "mer_abc",
  "flow": {
    "initial_node": "greeting",
    "nodes": [
      {
        "node_name": "greeting",
        "task_messages": [
          {
            "role": "system",
            "content": "You are a friendly appointment reminder agent. Greet the customer and confirm their appointment on {appointment_date}."
          }
        ],
        "functions": [],
        "pre_actions": [],
        "post_actions": []
      }
    ]
  }
}`} />

  <h3 id="create-response">Response</h3>

  <CodeBlock lang="json" code={`{
  "id": "tpl_xyz789",
  "name": "appointment-reminder",
  "reseller_id": "res_001",
  "merchant_id": "mer_abc",
  "flow": { "..." },
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:30:00Z"
}`} />

  <h2 id="list-templates">List Templates</h2>

  <ApiEndpoint method="GET" path="/templates" />

  <p>Returns all templates visible to the authenticated caller. Results are automatically filtered by RBAC role.</p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr>
          <th>Query Param</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><code>reseller_id</code></td><td><code>string</code></td><td>Filter by reseller (admin/reseller roles).</td></tr>
        <tr><td><code>merchant_id</code></td><td><code>string</code></td><td>Filter by merchant.</td></tr>
      </tbody>
    </table>
  </div>

  <h2 id="get-template">Get Template by ID</h2>

  <ApiEndpoint method="GET" path="/templates/{id}" />

  <p>Returns the full template object including flow definition, functions, and hooks.</p>

  <h2 id="update-template">Update Template</h2>

  <ApiEndpoint method="PUT" path="/templates/{id}" />

  <Callout type="warning" title="GET → Edit → PUT Contract">
    <p>Always <code>GET</code> the template first, modify the returned object, and <code>PUT</code> the entire modified object back. The API replaces the full document — partial updates are not supported.</p>
  </Callout>

  <h3 id="update-request">Request Body</h3>

  <CodeBlock lang="json" code={`{
  "id": "tpl_xyz789",
  "name": "appointment-reminder-v2",
  "reseller_id": "res_001",
  "merchant_id": "mer_abc",
  "flow": {
    "initial_node": "greeting",
    "nodes": [
      {
        "node_name": "greeting",
        "task_messages": [
          {
            "role": "system",
            "content": "You are a friendly appointment reminder agent. Greet the customer by name and confirm their appointment."
          }
        ],
        "functions": [],
        "pre_actions": [],
        "post_actions": []
      }
    ]
  }
}`} />

  <h2 id="delete-template">Delete Template</h2>

  <ApiEndpoint method="DELETE" path="/templates/{id}" />

  <Callout type="danger" title="Deletion Constraint">
    <p>A template cannot be deleted if it is referenced by any existing leads. Cancel or remove the associated leads first.</p>
  </Callout>

  <h2 id="error-responses">Error Responses</h2>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr>
          <th>Status</th>
          <th>Meaning</th>
          <th>Common Cause</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><code>400</code></td><td>Bad Request</td><td>Invalid flow structure or missing required fields.</td></tr>
        <tr><td><code>404</code></td><td>Not Found</td><td>Template ID does not exist or is not accessible.</td></tr>
        <tr><td><code>409</code></td><td>Conflict</td><td>Cannot delete — template is referenced by active leads.</td></tr>
      </tbody>
    </table>
  </div>
</div>
