/**
 * Admin allowlist.
 *
 * One email, all power. Read-only allowlist — add/remove by editing this
 * file. Server-side checks (in /admin route guards + service-role queries)
 * gate every privileged action. No client should trust this list — only
 * the server can verify the signed-in user's email matches.
 */

const ADMIN_EMAILS = ["rodmanyepa@gmail.com"];

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

export function listAdmins(): readonly string[] {
  return ADMIN_EMAILS;
}
