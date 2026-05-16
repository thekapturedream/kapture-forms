import { PackSchema } from "./types";
import STAFF_ONBOARDING_UK_CARE from "./staff-onboarding-uk-care";
import MUTUAL_NDA from "./mutual-nda";
import TENANT_REFERENCING from "./tenant-referencing";
import GDPR_DSAR from "./gdpr-dsar";
import AFFIDAVIT_GENERAL from "./affidavit-general";
import PHOTOGRAPHY_CONSENT from "./photography-consent";
// ── Applications · cross-sector ──────────────────────────────────────
import JOB_APPLICATION_STANDARD from "./job-application-standard";
import VOLUNTEER_APPLICATION from "./volunteer-application";
import GRANT_APPLICATION_ORGANISATION from "./grant-application-organisation";
import MEMBERSHIP_APPLICATION_CLUB from "./membership-application-club";
// ── Appointments · clinical & wellness ───────────────────────────────
import GP_APPOINTMENT_REQUEST from "./gp-appointment-request";
import DENTAL_CHECK_UP_BOOKING from "./dental-check-up-booking";
import EYE_TEST_BOOKING_ADULT from "./eye-test-booking-adult";
import THERAPY_INTAKE_FORM from "./therapy-intake-form";
// ── Bookings · venues, classes, services ─────────────────────────────
import VENUE_HIRE_ENQUIRY from "./venue-hire-enquiry";
import CLASS_WORKSHOP_SIGN_UP from "./class-workshop-sign-up";
import WEDDING_ENQUIRY from "./wedding-enquiry";
import TRADESPERSON_SITE_VISIT from "./tradesperson-site-visit";
import PARTY_FUNCTION_ENQUIRY from "./party-function-enquiry";
import CLEANING_SERVICE from "./cleaning-service-booking";
// ── Legal · extra packs ──────────────────────────────────────────────
import ONE_WAY_NDA from "./one-way-nda";
import STATUTORY_DECLARATION from "./statutory-declaration";
import SIMPLE_WILL from "./simple-will";
import LPA_FINANCE from "./lpa-finance";
// ── Applications · extras ────────────────────────────────────────────
import BURSARY_SCHOLARSHIP from "./bursary-scholarship-application";
import APPRENTICESHIP_APPLICATION from "./apprenticeship-application";
import SPONSORSHIP_APPLICATION from "./sponsorship-application";
// ── Appointments · extras ────────────────────────────────────────────
import COUNSELLING_APPOINTMENT from "./counselling-appointment-request";
import HAIR_SALON_BOOKING from "./hair-salon-booking";
import MASSAGE_APPOINTMENT from "./massage-appointment";
// ── HR & people ─────────────────────────────────────────────────────
import HR_ONBOARDING_UK_EMPLOYER from "./hr-onboarding-uk-employer";
import PERFORMANCE_REVIEW from "./performance-review";
import HOLIDAY_REQUEST from "./holiday-request";
import EXIT_INTERVIEW from "./exit-interview";
// ── Finance ─────────────────────────────────────────────────────────
import AML_KYC_ONBOARDING from "./aml-kyc-onboarding";
import CREDIT_APPLICATION_PERSONAL from "./credit-application-personal";
import DIRECT_DEBIT_MANDATE from "./direct-debit-mandate";
// ── Hospitality ─────────────────────────────────────────────────────
import RESTAURANT_BOOKING_TCS from "./restaurant-booking-tcs";
import ALLERGEN_DISCLOSURE from "./allergen-disclosure";
import HOTEL_BOOKING_TCS from "./hotel-booking-tcs";
// ── Construction ────────────────────────────────────────────────────
import RAMS_RISK_METHOD from "./rams-risk-method";
import SITE_INDUCTION from "./site-induction";

/**
 * Schema registry — productId → PackSchema.
 *
 * Two authoring styles live here side-by-side:
 *   1. Hand-written PackSchema (e.g. staff-onboarding-uk-care) — flat fields,
 *      authored when the legacy schema was the only option.
 *   2. Primitive-authored schemas — authored as FieldInstance sequences and
 *      run through @lib/primitives/to-pack-schema at module load. Same
 *      PackSchema shape comes out the other side, so every exporter works.
 *
 * Add a new schema:
 *   - Drop a file in this folder
 *   - Import + register below
 *   - Make sure productId matches the product slug from getStoreProduct
 */
const SCHEMAS: Record<string, PackSchema> = {
  "staff-onboarding-uk-care": STAFF_ONBOARDING_UK_CARE,
  "mutual-nda": MUTUAL_NDA,
  "tenant-referencing": TENANT_REFERENCING,
  "gdpr-dsar-subject-access": GDPR_DSAR,
  "affidavit-general-purpose": AFFIDAVIT_GENERAL,
  "photography-media-consent": PHOTOGRAPHY_CONSENT,
  // Applications
  "job-application-standard": JOB_APPLICATION_STANDARD,
  "volunteer-application": VOLUNTEER_APPLICATION,
  "grant-application-organisation": GRANT_APPLICATION_ORGANISATION,
  "membership-application-club": MEMBERSHIP_APPLICATION_CLUB,
  // Appointments
  "gp-appointment-request": GP_APPOINTMENT_REQUEST,
  "dental-check-up-booking": DENTAL_CHECK_UP_BOOKING,
  "eye-test-booking-adult": EYE_TEST_BOOKING_ADULT,
  "therapy-intake-form": THERAPY_INTAKE_FORM,
  // Bookings
  "venue-hire-enquiry": VENUE_HIRE_ENQUIRY,
  "class-workshop-sign-up": CLASS_WORKSHOP_SIGN_UP,
  "wedding-enquiry": WEDDING_ENQUIRY,
  "tradesperson-site-visit": TRADESPERSON_SITE_VISIT,
  "party-function-enquiry": PARTY_FUNCTION_ENQUIRY,
  "cleaning-service-booking": CLEANING_SERVICE,
  // Legal · batch 2
  "one-way-nda": ONE_WAY_NDA,
  "statutory-declaration": STATUTORY_DECLARATION,
  "simple-will": SIMPLE_WILL,
  "power-of-attorney-lpa-finance": LPA_FINANCE,
  // Applications · batch 2
  "bursary-scholarship-application": BURSARY_SCHOLARSHIP,
  "apprenticeship-application": APPRENTICESHIP_APPLICATION,
  "sponsorship-application": SPONSORSHIP_APPLICATION,
  // Appointments · batch 2
  "counselling-appointment-request": COUNSELLING_APPOINTMENT,
  "hair-salon-booking": HAIR_SALON_BOOKING,
  "massage-appointment": MASSAGE_APPOINTMENT,
  // HR
  "hr-onboarding-uk-employer": HR_ONBOARDING_UK_EMPLOYER,
  "performance-review": PERFORMANCE_REVIEW,
  "holiday-request": HOLIDAY_REQUEST,
  "exit-interview": EXIT_INTERVIEW,
  // Finance
  "aml-kyc-onboarding": AML_KYC_ONBOARDING,
  "credit-application-personal": CREDIT_APPLICATION_PERSONAL,
  "direct-debit-mandate": DIRECT_DEBIT_MANDATE,
  // Hospitality
  "restaurant-booking-t-cs": RESTAURANT_BOOKING_TCS,
  "allergen-disclosure-natasha-s-law": ALLERGEN_DISCLOSURE,
  "hotel-booking-t-cs": HOTEL_BOOKING_TCS,
  // Construction
  "rams-risk-method": RAMS_RISK_METHOD,
  "site-induction": SITE_INDUCTION,
};

/**
 * Lookup the field schema for a product. Returns undefined for products
 * whose schema hasn't been authored yet (Phase 2+ packs).
 */
export function getSchema(productId: string): PackSchema | undefined {
  return SCHEMAS[productId];
}

/** Schemas the dashboard / exporters know about. */
export function listSchemas(): Array<{ productId: string; title: string; fieldCount: number; sectionCount: number }> {
  return Object.values(SCHEMAS).map((s) => ({
    productId: s.productId,
    title: s.title,
    fieldCount: s.sections.reduce((n, sec) => n + sec.fields.length, 0),
    sectionCount: s.sections.length,
  }));
}

export type { PackSchema, Field, FieldType, Section } from "./types";
