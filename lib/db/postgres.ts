import { randomUUID } from "node:crypto";
import type { Pool as PgPool } from "pg";
import type { SubmissionInput, SubmissionRecord, SubmissionStore } from "./types";

const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS interest_submissions (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  x_handle TEXT NOT NULL,
  role TEXT NOT NULL,
  interest_type JSONB NOT NULL DEFAULT '[]',
  reason TEXT NOT NULL,
  organization_or_project TEXT,
  location TEXT,
  website TEXT,
  github TEXT,
  telegram TEXT,
  has_attended_mtndao_or_similar BOOLEAN,
  referral_source TEXT,
  notes TEXT,
  attribution JSONB,
  user_agent TEXT,
  ip_hash TEXT,
  source_page TEXT,
  consent_analytics BOOLEAN
)`;

function rowToRecord(row: Record<string, unknown>): SubmissionRecord {
  return {
    id: String(row.id),
    created_at:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : String(row.created_at),
    name: String(row.name),
    email: String(row.email),
    x_handle: String(row.x_handle),
    role: String(row.role),
    interest_type: (row.interest_type as string[]) ?? [],
    reason: String(row.reason),
    organization_or_project: (row.organization_or_project as string) ?? undefined,
    location: (row.location as string) ?? undefined,
    website: (row.website as string) ?? undefined,
    github: (row.github as string) ?? undefined,
    telegram: (row.telegram as string) ?? undefined,
    has_attended_mtndao_or_similar:
      (row.has_attended_mtndao_or_similar as boolean | null) ?? undefined,
    referral_source: (row.referral_source as string) ?? undefined,
    notes: (row.notes as string) ?? undefined,
    attribution: (row.attribution as SubmissionRecord["attribution"]) ?? null,
    user_agent: (row.user_agent as string) ?? undefined,
    ip_hash: (row.ip_hash as string) ?? undefined,
    source_page: (row.source_page as string) ?? undefined,
    consent_analytics: (row.consent_analytics as boolean | null) ?? undefined,
  };
}

export function createPostgresStore(databaseUrl: string): SubmissionStore {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Pool } = require("pg") as { Pool: typeof PgPool };
  const pool = new Pool({ connectionString: databaseUrl, max: 5 });
  const ready = pool.query(CREATE_TABLE);

  return {
    async insert(input: SubmissionInput): Promise<SubmissionRecord> {
      await ready;
      const record: SubmissionRecord = {
        ...input,
        id: randomUUID(),
        created_at: new Date().toISOString(),
      };
      await pool.query(
        `INSERT INTO interest_submissions (
          id, created_at, name, email, x_handle, role, interest_type, reason,
          organization_or_project, location, website, github, telegram,
          has_attended_mtndao_or_similar, referral_source, notes,
          attribution, user_agent, ip_hash, source_page, consent_analytics
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)`,
        [
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
          record.has_attended_mtndao_or_similar ?? null,
          record.referral_source ?? null,
          record.notes ?? null,
          record.attribution ? JSON.stringify(record.attribution) : null,
          record.user_agent ?? null,
          record.ip_hash ?? null,
          record.source_page ?? null,
          record.consent_analytics ?? null,
        ],
      );
      return record;
    },

    async list(limit = 500): Promise<SubmissionRecord[]> {
      await ready;
      const result = await pool.query(
        `SELECT * FROM interest_submissions ORDER BY created_at DESC LIMIT $1`,
        [limit],
      );
      return result.rows.map(rowToRecord);
    },
  };
}
