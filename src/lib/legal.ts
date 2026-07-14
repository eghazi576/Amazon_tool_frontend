/**
 * Facts the legal pages are built from.
 *
 * Everything here is stated as fact on a public page, so it has to be true.
 * The technical claims were verified against the code, not assumed:
 *
 *   - Accounts store an email and a bcrypt hash. (prisma/schema.prisma: User)
 *   - Every ASIN lookup and brand evaluation is saved to the account.
 *     (prisma/schema.prisma: AsinSearch, BrandSearch)
 *   - Exactly two cookies exist, both httpOnly, both for authentication:
 *     access_token (15 min) and refresh_token (7 days, path /api/auth).
 *     (controllers/auth/authController.js: setAuthCookies)
 *   - The marketing pages set no cookies at all -- verified with curl against
 *     production: no Set-Cookie header until you sign in.
 *   - There is no analytics, no tag manager, no advertising pixel anywhere in
 *     the bundle. Do not add one without updating these pages.
 *
 * If any of that changes, these pages must change with it.
 */

/** The legal entity behind WholesaleOS. */
export const COMPANY = "Mentify LLC";

/** Registered business address. Also published in the Organization schema. */
export const ADDRESS = {
  street: "1209 Mountain Road Pl NE, Ste 5054",
  city: "Albuquerque",
  region: "NM",
  postalCode: "87110",
  country: "USA",
} as const;

export const ADDRESS_LINE = `${ADDRESS.street}, ${ADDRESS.city}, ${ADDRESS.region} ${ADDRESS.postalCode}, ${ADDRESS.country}`;

export const PHONE = "+1 (505) 378-4031";

/** Contact for privacy, data and legal requests. */
export const LEGAL_EMAIL = "mentifyllc@gmail.com";

/** Contact for product support (the address the app and FAQ already use). */
export const SUPPORT_EMAIL = "support@wholesaleos.com";

/** Governing law and the forum for disputes. */
export const JURISDICTION = "the State of New Mexico, United States";

/** Bump whenever the substance of a policy changes, not for typo fixes. */
export const EFFECTIVE_DATE = "14 July 2026";

export const LEGAL_PAGES = [
  { path: "/privacy", label: "Privacy Policy" },
  { path: "/terms", label: "Terms of Service" },
  { path: "/cookies", label: "Cookie Policy" },
] as const;
