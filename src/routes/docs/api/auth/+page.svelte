<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import ApiEndpoint from '$lib/components/ApiEndpoint.svelte';
</script>

<svelte:head><title>Authentication — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Authentication</h1>
  <p class="text-muted-foreground text-lg mb-8">JWT-based authentication, server-to-server tokens, and role-based access control.</p>

  <h2 id="overview">Overview</h2>
  <p>
    All API requests must include a valid Bearer token in the <code>Authorization</code> header.
    Breeze Buddy supports two token types: short-lived <strong>access tokens</strong> obtained via
    user login, and long-lived <strong>server-to-server (S2S) tokens</strong> for backend
    integrations.
  </p>

  <CodeBlock lang="bash" code={`Authorization: Bearer <token>`} />

  <h2 id="login">Login</h2>
  <p>Authenticate with email and password to receive a JWT access token.</p>

  <ApiEndpoint method="POST" path="/login" />

  <h3 id="login-request">Request Body</h3>

  <CodeBlock lang="json" code={`{
  "email": "user@example.com",
  "password": "your-password"
}`} />

  <h3 id="login-response">Response</h3>

  <CodeBlock lang="json" code={`{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "usr_abc123",
    "email": "user@example.com",
    "role": "admin",
    "reseller_id": "res_001"
  }
}`} />

  <Callout type="info" title="Token Expiry">
    <p>Access tokens are short-lived. Refresh by calling <code>/login</code> again when the token expires.</p>
  </Callout>

  <h2 id="s2s-tokens">Server-to-Server Tokens</h2>
  <p>
    For backend integrations that need long-lived credentials, generate an S2S token.
    These tokens do not expire automatically and should be stored securely.
  </p>

  <ApiEndpoint method="POST" path="/s2s-token" />

  <h3 id="s2s-request">Request Body</h3>

  <CodeBlock lang="json" code={`{
  "name": "my-backend-integration",
  "role": "merchant",
  "reseller_id": "res_001",
  "merchant_id": "mer_abc"
}`} />

  <h3 id="s2s-response">Response</h3>

  <CodeBlock lang="json" code={`{
  "token": "s2s_eyJhbGciOiJIUzI1NiIs...",
  "name": "my-backend-integration",
  "created_at": "2025-01-15T10:30:00Z"
}`} />

  <Callout type="warning" title="Keep S2S Tokens Secure">
    <p>S2S tokens grant persistent access. Store them in environment variables or a secrets manager — never commit them to source control.</p>
  </Callout>

  <h2 id="authorization-header">Authorization Header</h2>
  <p>Include the token in every API request:</p>

  <CodeBlock lang="bash" code={`curl -X GET https://api.breezebuddy.ai/templates \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."`} />

  <h2 id="rbac">Role-Based Access Control (RBAC)</h2>
  <p>
    Every token carries a role that determines which resources the caller can access.
    The API enforces RBAC on all endpoints.
  </p>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr>
          <th>Role</th>
          <th>Scope</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><code>admin</code></td><td>Global</td><td>Full access to all resources across all resellers and merchants.</td></tr>
        <tr><td><code>reseller</code></td><td>Reseller</td><td>Access to all merchants and templates under the reseller.</td></tr>
        <tr><td><code>merchant</code></td><td>Merchant</td><td>Access limited to the merchant's own templates and leads.</td></tr>
        <tr><td><code>user</code></td><td>User</td><td>Read-only access to assigned resources.</td></tr>
      </tbody>
    </table>
  </div>

  <Callout type="info" title="RBAC Filtering">
    <p>List endpoints automatically filter results based on the caller's role. An <code>admin</code> sees all records; a <code>merchant</code> sees only their own.</p>
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
        <tr><td><code>401</code></td><td>Unauthorized</td><td>Missing or expired token.</td></tr>
        <tr><td><code>403</code></td><td>Forbidden</td><td>Token role lacks permission for the resource.</td></tr>
        <tr><td><code>422</code></td><td>Unprocessable Entity</td><td>Invalid credentials in login request.</td></tr>
      </tbody>
    </table>
  </div>
</div>
