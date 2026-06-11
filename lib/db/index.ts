import type { SubmissionStore } from "./types";

let store: SubmissionStore | null = null;

/**
 * Returns the submission store for the configured DATABASE_URL.
 *  - postgres:// or postgresql:// -> PostgreSQL
 *  - file:... or empty            -> local SQLite (./data/dev.db)
 */
export async function getSubmissionStore(): Promise<SubmissionStore> {
  if (store) return store;

  const url = process.env.DATABASE_URL?.trim();
  if (url && /^postgres(ql)?:\/\//.test(url)) {
    const { createPostgresStore } = await import("./postgres");
    store = createPostgresStore(url);
  } else {
    const { createSqliteStore } = await import("./sqlite");
    store = createSqliteStore(url || undefined);
  }
  return store;
}

export type { SubmissionInput, SubmissionRecord, SubmissionStore } from "./types";
