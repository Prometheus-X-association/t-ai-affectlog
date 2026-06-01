const BASE = import.meta.env.VITE_API_BASE_URL || "";

async function get<T>(path: string): Promise<T> {
  const r = await fetch(`${BASE}${path}`);
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return r.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const r = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return r.json();
}

// ── Health ────────────────────────────────────────────────────────────
export const checkHealth = () => get<{ status: string; version: string }>("/healthz");

// ── Datasets ─────────────────────────────────────────────────────────
export interface DataFile {
  path: string;
  name: string;
  size_bytes: number;
  location: "samples" | "raw" | "processed";
  format: "csv" | "jsonl" | "json";
}
export const listDatasets = () => get<{ files: DataFile[] }>("/v1/datasets/available");
export const validateDataset = (file_path: string, schema_name = "maskott_csv_v1") =>
  post<{ valid: boolean; schema_name: string; missing_columns: string[]; extra_columns: string[]; error?: string }>(
    "/v1/datasets/validate",
    { file_path, schema_name },
  );
export const ingestDataset = (file_path: string, schema_name: string, recipe: string) =>
  post<{ dataset_id: string; file_path: string; status: string }>("/v1/datasets/ingest", { file_path, schema_name, recipe });
export const transformDataset = (dataset_id: string, recipe: string, output_path?: string) =>
  post<{ dataset_id: string; output_path: string; total_rows_in: number; total_rows_out: number; error_count: number }>(
    `/v1/datasets/${dataset_id}/transform`,
    { recipe, output_path },
  );

// ── Recipes ───────────────────────────────────────────────────────────
export interface Recipe { name: string; path: string; filename: string; }
export const listRecipes = () => get<{ recipes: Recipe[] }>("/v1/recipes");

// ── Audits ────────────────────────────────────────────────────────────
export interface RunEntry {
  run_id: string;
  recipe: string;
  status: string;
  artifacts?: string[];
}
export const listRuns = () => get<{ runs: RunEntry[] }>("/v1/audits");
export const startAudit = (input_path: string, recipe: string, output_dir?: string, chunk_size = 100_000) =>
  post<{ run_id: string; status: string; recipe: string }>("/v1/audits/run", { input_path, recipe, output_dir, chunk_size });
export const getAuditStatus = (run_id: string) =>
  get<{ run_id: string; status: string; recipe: string; artifacts: Record<string, string> }>(`/v1/audits/${run_id}`);
export const getAuditMetrics = (run_id: string) =>
  get<{ run_id: string; metrics: Record<string, unknown> }>(`/v1/audits/${run_id}/metrics`);
export const getAuditDashboard = (run_id: string) =>
  get<DashboardPayload>(`/v1/audits/${run_id}/dashboard`);
export const getAuditSop = (run_id: string) =>
  fetch(`${BASE}/v1/audits/${run_id}/sop`).then((r) => r.text());
export const getComplianceGraph = (run_id: string) =>
  get<Record<string, unknown>>(`/v1/audits/${run_id}/compliance-graph`);

// ── Dashboard payload type ────────────────────────────────────────────
export interface DashboardPayload {
  run_id: string;
  recipe: string;
  total_events: number | null;
  unique_actors: number | null;
  unique_resources: number | null;
  actor_gini: number | null;
  resource_gini: number | null;
  sparsity_ratio: number | null;
  overall_completeness: number | null;
  top_10_resources: [string, number][];
  resource_type_distribution: Record<string, number>;
  verb_distribution: Record<string, number>;
  view_context_distribution: Record<string, number>;
  coverage_at_k: Record<string, number>;
  risk_level: "low" | "medium" | "high" | "unknown";
  temporal: {
    min_timestamp: string | null;
    max_timestamp: string | null;
    span_days: number | null;
    unique_days: number | null;
  };
  artifacts: Record<string, string>;
}
