import type { Attribution } from "@/lib/attribution";

export interface SubmissionInput {
  name: string;
  email: string;
  x_handle: string;
  role: string;
  interest_type: string[];
  reason: string;
  organization_or_project?: string;
  location?: string;
  website?: string;
  github?: string;
  telegram?: string;
  has_attended_mtndao_or_similar?: boolean;
  referral_source?: string;
  notes?: string;
  attribution: Attribution | null;
  user_agent?: string;
  ip_hash?: string;
  source_page?: string;
  consent_analytics?: boolean;
}

export interface SubmissionRecord extends SubmissionInput {
  id: string;
  created_at: string;
}

export interface SubmissionStore {
  insert(input: SubmissionInput): Promise<SubmissionRecord>;
  /** Newest first. */
  list(limit?: number): Promise<SubmissionRecord[]>;
}
