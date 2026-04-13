<script lang="ts">
  import Callout from '$lib/components/Callout.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head><title>RBAC — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Role-Based Access Control</h1>
  <p class="text-muted-foreground text-lg mb-8">Multi-tenant authorization with hierarchical roles — admin, reseller, merchant, and user.</p>

  <h2 id="overview">Overview</h2>
  <p>
    Every API token carries a <strong>role</strong> that determines which resources the caller can access.
    Breeze Buddy enforces RBAC on all endpoints automatically — list queries are filtered, and
    mutation requests are validated against the caller's scope.
  </p>

  <h2 id="role-hierarchy">Role Hierarchy</h2>

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

  <h2 id="how-it-works">How RBAC Works</h2>

  <p>When a request comes in, the API:</p>
  <ol>
    <li>Decodes the JWT and extracts the <code>role</code>, <code>reseller_id</code>, and <code>merchant_id</code></li>
    <li>For <strong>list endpoints</strong>: automatically filters results to only show resources the caller owns or has access to</li>
    <li>For <strong>create/update/delete</strong>: validates that the target resource falls within the caller's scope</li>
  </ol>

  <Callout type="info" title="Transparent Filtering">
    <p>List endpoints automatically filter results based on the caller's role. An <code>admin</code> sees all records; a <code>merchant</code> sees only their own. No extra query parameters needed.</p>
  </Callout>

  <h2 id="resource-scoping">Resource Scoping</h2>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr>
          <th>Resource</th>
          <th>admin</th>
          <th>reseller</th>
          <th>merchant</th>
          <th>user</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Templates</td><td>All</td><td>Own reseller</td><td>Own merchant</td><td>Read-only</td></tr>
        <tr><td>Leads</td><td>All</td><td>Own reseller</td><td>Own merchant</td><td>Read-only</td></tr>
        <tr><td>Configurations</td><td>All</td><td>Own reseller</td><td>Read-only</td><td>&#8212;</td></tr>
        <tr><td>Numbers</td><td>All</td><td>Own reseller</td><td>&#8212;</td><td>&#8212;</td></tr>
        <tr><td>Merchants</td><td>All</td><td>Own reseller</td><td>&#8212;</td><td>&#8212;</td></tr>
        <tr><td>Analytics</td><td>All</td><td>Own reseller</td><td>Own merchant</td><td>Read-only</td></tr>
        <tr><td>S2S Tokens</td><td>Create any</td><td>Create for own</td><td>&#8212;</td><td>&#8212;</td></tr>
      </tbody>
    </table>
  </div>

  <h2 id="s2s-roles">S2S Token Roles</h2>
  <p>
    When creating a server-to-server token, you assign it a role. The token inherits the
    same access rules as that role. Most backend integrations use the <code>merchant</code> role
    for least-privilege access.
  </p>

  <CodeBlock lang="json" code={`{
  "name": "my-backend",
  "role": "merchant",
  "reseller_id": "res_001",
  "merchant_id": "mer_abc"
}`} />

  <Callout type="warning" title="Principle of Least Privilege">
    <p>Always assign the most restrictive role that satisfies the integration's needs. Avoid using <code>admin</code> tokens in production services.</p>
  </Callout>
</div>
