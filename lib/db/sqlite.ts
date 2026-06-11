import path from "node:path";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import type Database from "better-sqlite3";
import type { SubmissionInput, SubmissionRecord, SubmissionStore } from "./types";

const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS interest_submissions (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  x_handle TEXT NOT NULL,
  role TEXT NOT NULL,
  interest_type TEXT NOT NULL,
  reason TEXT NOT NULL,
  organization_or_project TEXT,
  location TEXT,
  website TEXT,
  github TEXT,
  telegram TEXT,
  has_attended_mtndao_or_similar INTEGER,
  referral_source TEXT,
  notes TEXT,
  attribution TEXT,
  user_agent TEXT,
  ip_hash TEXT,
  source_page TEXT,
  consent_analytics INTEGER
)`;

function rowToRecord(row: Record<string, unknown>): SubmissionRecord {
  return {
    id: String(row.id),
    created_at: String(row.created_at),
    name: String(row.name),
    email: String(row.email),
    x_handle: String(row.x_handle),
    role: String(row.role),
    interest_type: JSON.parse(String(row.interest_type ?? "[]")),
    reason: String(row.reason),
    organization_or_project: (row.organization_or_project as string) ?? undefined,
    location: (row.location as string) ?? undefined,
    website: (row.website as string) ?? undefined,
    github: (row.github as string) ?? undefined,
    telegram: (row.telegram as string) ?? undefined,
    has_attended_mtndao_or_similar:
      row.has_attended_mtndao_or_similar == null
        ? undefined
        : Boolean(row.has_attended_mtndao_or_similar),
    referral_source: (row.referral_source as string) ?? undefined,
    notes: (row.notes as string) ?? undefined,
    attribution: row.attribution ? JSON.parse(String(row.attribution)) : null,
    user_agent: (row.user_agent as string) ?? undefined,
    ip_hash: (row.ip_hash as string) ?? undefined,
    source_page: (row.source_page as string) ?? undefined,
    consent_analytics:
      row.consent_analytics == null ? undefined : Boolean(row.consent_analytics),
  };
}

export function createSqliteStore(databaseUrl: string | undefined): SubmissionStore {
  const file = (databaseUrl ?? "file:./data/dev.db").replace(/^file:/, "");
  const resolved = path.resolve(process.cwd(), file);
  fs.mkdirSync(path.dirname(resolved), { recursive: true });

  // Lazy require keeps better-sqlite3 out of bundles that never use it.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const BetterSqlite3 = require("better-sqlite3") as typeof Database;
  const db = new BetterSqlite3(resolved);
  db.pragma("journal_mode = WAL");
  db.exec(CREATE_TABLE);

  return {
    async insert(input: SubmissionInput): Promise<SubmissionRecord> {
      const record: SubmissionRecord = {
        ...input,
        id: randomUUID(),
        created_at: new Date().toISOString(),
      };
      db.prepare(
        `INSERT INTO interest_submissions (
          id, created_at, name, email, x_handle, role, interest_type, reason,
          organization_or_project, location, website, github, telegram,
          has_attended_mtndao_or_similar, referral_source, notes,
          attribution, user_agent, ip_hash, source_page, consent_analytics
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        record.id,
        record.created_at,
        record.name,
        record.email,
        record.x_handle,
        record.role,
        JSON.stringify(record.interest_type),
        record.reason,
        record.organization_or_project ?? null,
        record.location ?? null,
        record.website ?? null,
        record.github ?? null,
        record.telegram ?? null,
        record.has_attended_mtndao_or_similar == null
          ? null
          : Number(record.has_attended_mtndao_or_similar),
        record.referral_source ?? null,
        record.notes ?? null,
        record.attribution ? JSON.stringify(record.attribution) : null,
        record.user_agent ?? null,
        record.ip_hash ?? null,
        record.source_page ?? null,
        record.consent_analytics == null ? null : Number(record.consent_analytics),
      );
      return record;
    },

    async list(limit = 500): Promise<SubmissionRecord[]> {
      const rows = db
        .prepare(
          `SELECT * FROM interest_submissions ORDER BY created_at DESC LIMIT ?`,
        )
        .all(limit) as Record<string, unknown>[];
      return rows.map(rowToRecord);
    },
  };
}
