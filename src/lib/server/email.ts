/**
 * Console-log stub for sending transactional emails.
 *
 * This is a single seam for the whole app's outgoing email — swap the body
 * of this function out for a real provider (Resend, Postmark, SMTP, etc.)
 * later without touching any of the call sites.
 */
export function sendEmail({ to, subject, text }: { to: string; subject: string; text: string }) {
	console.log(`[email] to: ${to}\nsubject: ${subject}\n\n${text}`);
}
