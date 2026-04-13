<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import ApiEndpoint from '$lib/components/ApiEndpoint.svelte';
</script>

<svelte:head><title>Authentication — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Authentication</h1>
  <p class="text-muted-foreground text-lg mb-8">JWT-based authentication, server-to-server tokens, and <a href="/docs/auth/rbac">role-based access control</a> for all API interactions.</p>

  <h2 id="overview">Overview</h2>
  <p>
    All Breeze Buddy API requests must include a valid Bearer token in the <code>Authorization</code> header.
    The platform supports two token types:
  </p>
  <ul>
    <li><strong>Access tokens</strong> — short-lived JWTs obtained via user login</li>
    <li><strong>Server-to-server (S2S) tokens</strong> — long-lived tokens for backend integrations</li>
  </ul>

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
    S2S tokens are ideal for <a href="/docs/quickstart">server-side integrations</a> that push leads and manage <a href="/docs/templates/overview">templates</a> programmatically.
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
    <p>S2S tokens grant persistent access. Store them in environment variables or a secrets manager — never commit them to source control. For role-level permission details see <a href="/docs/auth/rbac">RBAC</a>.</p>
  </Callout>

  <h2 id="authorization-header">Authorization Header</h2>
  <p>Include the token in every API request:</p>

  <CodeBlock lang="bash" code={`curl -X GET https://api.breezebuddy.ai/templates \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."`} />

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
        <tr><td><code>403</code></td><td>Forbidden</td><td>Token <a href="/docs/auth/rbac">role</a> lacks permission for the resource.</td></tr>
        <tr><td><code>422</code></td><td>Unprocessable Entity</td><td>Invalid credentials in login request.</td></tr>
      </tbody>
    </table>
  </div>
</div>
