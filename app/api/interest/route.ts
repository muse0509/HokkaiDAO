import { NextRequest, NextResponse } from "next/server";
import { ATTRIBUTION_COOKIE, parseAttributionCookie } from "@/lib/attribution";
import { getSubmissionStore } from "@/lib/db";
import { hashIp } from "@/lib/hash";
import { rateLimit } from "@/lib/rate-limit";
import { interestFormSchema } from "@/lib/validation";

export const runtime = "nodejs";

function clientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip");
}

export async function POST(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_FORM_ENABLED === "false") {
    return NextResponse.json(
      { ok: false, error: "The interest form is currently closed." },
      { status: 503 },
    );
  }

  const ip = clientIp(request);
  const limited = rateLimit(`interest:${ip ?? "unknown"}`, {
    limit: 5,
    windowMs: 10 * 60 * 1000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSeconds) },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = interestFormSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form");
      if (!fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return NextResponse.json(
      { ok: false, error: "Please fix the highlighted fields.", fieldErrors },
      { status: 400 },
    );
  }

  // Honeypot filled -> pretend success so bots don't adapt, store nothing.
  if (parsed.data.company_website) {
    return NextResponse.json({ ok: true });
  }

  const attribution = parseAttributionCookie(
    request.cookies.get(ATTRIBUTION_COOKIE)?.value,
  );

  const { company_website: _honeypot, consent_analytics, ...fields } = parsed.data;
  void _honeypot;

  try {
    const store = await getSubmissionStore();
    await store.insert({
      ...fields,
      attribution,
      user_agent: request.headers.get("user-agent")?.slice(0, 500) ?? undefined,
      ip_hash: hashIp(ip),
      source_page: request.headers.get("referer")?.slice(0, 500) ?? undefined,
      consent_analytics,
    });
  } catch (error) {
    console.error("interest submission failed:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong saving your submission. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
