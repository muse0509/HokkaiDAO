import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSubmissionStore, type SubmissionRecord } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function secretsMatch(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

const CSV_COLUMNS: (keyof SubmissionRecord)[] = [
  "id",
  "created_at",
  "name",
  "email",
  "x_handle",
  "role",
  "interest_type",
  "reason",
  "organization_or_project",
  "location",
  "website",
  "github",
  "telegram",
  "has_attended_mtndao_or_similar",
  "referral_source",
  "notes",
  "attribution",
  "user_agent",
  "ip_hash",
  "source_page",
  "consent_analytics",
];

function csvEscape(value: unknown): string {
  if (value == null) return "";
  const raw =
    typeof value === "object" ? JSON.stringify(value) : String(value);
  // Guard against spreadsheet formula injection, then quote.
  const guarded = /^[=+\-@\t]/.test(raw) ? `'${raw}` : raw;
  return `"${guarded.replace(/"/g, '""')}"`;
}

function toCsv(records: SubmissionRecord[]): string {
  const header = CSV_COLUMNS.join(",");
  const rows = records.map((record) =>
    CSV_COLUMNS.map((col) => csvEscape(record[col])).join(","),
  );
  return [header, ...rows].join("\n");
}

/**
 * GET /api/admin/submissions?secret=...            -> JSON (newest first)
 * GET /api/admin/submissions?secret=...&format=csv -> CSV download
 * The secret may also be sent as an `Authorization: Bearer` header.
 */
export async function GET(request: NextRequest) {
  const expected = process.env.ADMIN_VIEW_SECRET;
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "ADMIN_VIEW_SECRET is not configured." },
      { status: 503 },
    );
  }

  const provided =
    request.nextUrl.searchParams.get("secret") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    "";
  if (!provided || !secretsMatch(provided, expected)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const limit = Math.min(
    Number(request.nextUrl.searchParams.get("limit")) || 500,
    2000,
  );

  const store = await getSubmissionStore();
  const submissions = await store.list(limit);

  if (request.nextUrl.searchParams.get("format") === "csv") {
    return new NextResponse(toCsv(submissions), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="hokkaidao-submissions.csv"`,
        "Cache-Control": "no-store",
      },
    });
  }

  return NextResponse.json(
    { ok: true, count: submissions.length, submissions },
    { headers: { "Cache-Control": "no-store" } },
  );
}
