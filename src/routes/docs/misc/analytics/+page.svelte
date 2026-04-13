<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import Callout from '$lib/components/Callout.svelte';
  import ApiEndpoint from '$lib/components/ApiEndpoint.svelte';
</script>

<svelte:head><title>Analytics — Breeze Buddy Docs</title></svelte:head>

<div class="prose">
  <h1>Analytics</h1>
  <p class="text-muted-foreground text-lg mb-8">Flexible analytics queries for aggregating call data across templates, merchants, and time ranges.</p>

  <h2 id="overview">Overview</h2>
  <p>
    The analytics API provides a unified query interface for aggregating call data. All
    queries are submitted via a single endpoint with a structured query body supporting
    filtering, pagination, and time granularity.
  </p>

  <h2 id="query-endpoint">Query Endpoint</h2>

  <ApiEndpoint method="POST" path="/analytics" />

  <h3 id="query-types">Supported Query Types</h3>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr>
          <th>Query Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><code>call_count</code></td><td>Total number of calls matching filters.</td></tr>
        <tr><td><code>call_duration</code></td><td>Aggregate duration statistics (avg, min, max, total).</td></tr>
        <tr><td><code>outcome_distribution</code></td><td>Breakdown of call outcomes.</td></tr>
        <tr><td><code>sentiment_distribution</code></td><td>Sentiment score distribution.</td></tr>
        <tr><td><code>status_distribution</code></td><td>Lead status breakdown.</td></tr>
        <tr><td><code>calls_over_time</code></td><td>Call count grouped by time granularity.</td></tr>
        <tr><td><code>avg_duration_over_time</code></td><td>Average duration grouped by time granularity.</td></tr>
        <tr><td><code>top_outcomes</code></td><td>Most frequent outcomes ranked by count.</td></tr>
        <tr><td><code>retry_analysis</code></td><td>Retry attempt distribution and success rates.</td></tr>
        <tr><td><code>provider_breakdown</code></td><td>Call volume by telephony provider.</td></tr>
        <tr><td><code>hourly_heatmap</code></td><td>Call distribution by hour of day.</td></tr>
        <tr><td><code>conversion_funnel</code></td><td>Lead progression through statuses.</td></tr>
      </tbody>
    </table>
  </div>

  <h3 id="filter-options">Filter Options</h3>

  <div class="overflow-x-auto rounded-xl border border-border my-4">
    <table>
      <thead>
        <tr>
          <th>Filter</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><code>template_id</code></td><td><code>string</code></td><td>Filter by template.</td></tr>
        <tr><td><code>merchant_id</code></td><td><code>string</code></td><td>Filter by merchant.</td></tr>
        <tr><td><code>reseller_id</code></td><td><code>string</code></td><td>Filter by reseller.</td></tr>
        <tr><td><code>date_from</code></td><td><code>string (ISO 8601)</code></td><td>Start of date range.</td></tr>
        <tr><td><code>date_to</code></td><td><code>string (ISO 8601)</code></td><td>End of date range.</td></tr>
        <tr><td><code>min_duration</code></td><td><code>int</code></td><td>Minimum call duration in seconds.</td></tr>
        <tr><td><code>max_duration</code></td><td><code>int</code></td><td>Maximum call duration in seconds.</td></tr>
        <tr><td><code>sentiment_min</code></td><td><code>float</code></td><td>Minimum sentiment score (0.0–1.0).</td></tr>
        <tr><td><code>sentiment_max</code></td><td><code>float</code></td><td>Maximum sentiment score (0.0–1.0).</td></tr>
        <tr><td><code>payload_filters</code></td><td><code>object</code></td><td>Filter on arbitrary payload fields (e.g. <code>{`{"city": "Mumbai"}`}</code>).</td></tr>
      </tbody>
    </table>
  </div>

  <h3 id="example-query">Example Query</h3>

  <CodeBlock lang="json" code={`{
  "query_type": "calls_over_time",
  "filters": {
    "template_id": "tpl_xyz789",
    "merchant_id": "mer_abc",
    "date_from": "2025-01-01T00:00:00Z",
    "date_to": "2025-01-31T23:59:59Z",
    "min_duration": 10
  },
  "granularity": "day",
  "page": 1,
  "page_size": 31
}`} />

  <h3 id="example-response">Example Response</h3>

  <CodeBlock lang="json" code={`{
  "query_type": "calls_over_time",
  "data": [
    { "date": "2025-01-01", "count": 42 },
    { "date": "2025-01-02", "count": 58 },
    { "date": "2025-01-03", "count": 37 }
  ],
  "total": 31,
  "page": 1,
  "page_size": 31
}`} />

  <Callout type="info" title="Payload Filters">
    <p>Use <code>payload_filters</code> to query on custom fields from your lead payloads. For example, filter by city, plan type, or any key-value pair you include when pushing leads.</p>
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
        <tr><td><code>400</code></td><td>Bad Request</td><td>Invalid query type or malformed filters.</td></tr>
        <tr><td><code>422</code></td><td>Unprocessable Entity</td><td>Invalid date range or filter values.</td></tr>
      </tbody>
    </table>
  </div>
</div>
