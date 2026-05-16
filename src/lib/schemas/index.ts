import { PackSchema } from "./types";
import STAFF_ONBOARDING_UK_CARE from "./staff-onboarding-uk-care";
import MUTUAL_NDA from "./mutual-nda";
import TENANT_REFERENCING from "./tenant-referencing";
import GDPR_DSAR from "./gdpr-dsar";
import AFFIDAVIT_GENERAL from "./affidavit-general";
import PHOTOGRAPHY_CONSENT from "./photography-consent";
// ── Applications · batch 1 ───────────────────────────────────────────
import JOB_APPLICATION_STANDARD from "./job-application-standard";
import VOLUNTEER_APPLICATION from "./volunteer-application";
import GRANT_APPLICATION_ORGANISATION from "./grant-application-organisation";
import MEMBERSHIP_APPLICATION_CLUB from "./membership-application-club";
// ── Appointments · batch 1 ───────────────────────────────────────────
import GP_APPOINTMENT_REQUEST from "./gp-appointment-request";
import DENTAL_CHECK_UP_BOOKING from "./dental-check-up-booking";
import EYE_TEST_BOOKING_ADULT from "./eye-test-booking-adult";
import THERAPY_INTAKE_FORM from "./therapy-intake-form";
// ── Bookings · batch 1 ───────────────────────────────────────────────
import VENUE_HIRE_ENQUIRY from "./venue-hire-enquiry";
import CLASS_WORKSHOP_SIGN_UP from "./class-workshop-sign-up";
import WEDDING_ENQUIRY from "./wedding-enquiry";
import TRADESPERSON_SITE_VISIT from "./tradesperson-site-visit";
import PARTY_FUNCTION_ENQUIRY from "./party-function-enquiry";
import CLEANING_SERVICE from "./cleaning-service-booking";
// ── Legal · batch 2 ──────────────────────────────────────────────────
import ONE_WAY_NDA from "./one-way-nda";
import STATUTORY_DECLARATION from "./statutory-declaration";
import SIMPLE_WILL from "./simple-will";
import LPA_FINANCE from "./lpa-finance";
// ── Applications · batch 2 ───────────────────────────────────────────
import BURSARY_SCHOLARSHIP from "./bursary-scholarship-application";
import APPRENTICESHIP_APPLICATION from "./apprenticeship-application";
import SPONSORSHIP_APPLICATION from "./sponsorship-application";
// ── Appointments · batch 2 ───────────────────────────────────────────
import COUNSELLING_APPOINTMENT from "./counselling-appointment-request";
import HAIR_SALON_BOOKING from "./hair-salon-booking";
import MASSAGE_APPOINTMENT from "./massage-appointment";
// ── HR · batch 3 ─────────────────────────────────────────────────────
import HR_ONBOARDING_UK_EMPLOYER from "./hr-onboarding-uk-employer";
import PERFORMANCE_REVIEW from "./performance-review";
import HOLIDAY_REQUEST from "./holiday-request";
import EXIT_INTERVIEW from "./exit-interview";
// ── Finance · batch 3 ────────────────────────────────────────────────
import AML_KYC_ONBOARDING from "./aml-kyc-onboarding";
import CREDIT_APPLICATION_PERSONAL from "./credit-application-personal";
import DIRECT_DEBIT_MANDATE from "./direct-debit-mandate";
// ── Hospitality · batch 3 ────────────────────────────────────────────
import RESTAURANT_BOOKING_TCS from "./restaurant-booking-tcs";
import ALLERGEN_DISCLOSURE from "./allergen-disclosure";
import HOTEL_BOOKING_TCS from "./hotel-booking-tcs";
// ── Construction · batch 3 ───────────────────────────────────────────
import RAMS_RISK_METHOD from "./rams-risk-method";
import SITE_INDUCTION from "./site-induction";
// ── Real estate · batch 4 ────────────────────────────────────────────
import AST from "./ast-assured-shorthold-tenancy";
import INVENTORY_CHECK_IN from "./inventory-check-in";
import NOTICE_S21 from "./notice-to-quit-section-21";
// ── Public sector · batch 4 ──────────────────────────────────────────
import COUNCIL_TAX_SPD from "./council-tax-single-person-discount";
import BLUE_BADGE from "./blue-badge-application";
import FOI_REQUEST from "./foi-request";
// ── Logistics · batch 4 ──────────────────────────────────────────────
import VEHICLE_DEFECT_VOR from "./vehicle-defect-report-vor";
import WALK_AROUND_DAILY from "./walk-around-check-daily";
import DRIVER_ONBOARDING_HGV from "./driver-onboarding-hgv";
// ── Education · batch 4 ──────────────────────────────────────────────
import PARENTAL_CONSENT_SCHOOL from "./parental-consent-school";
import SEND_SUPPORT_PLAN from "./send-support-plan";
import EDUCATIONAL_VISIT_CONSENT from "./educational-visit-consent";
// ── Healthcare deepening · batch 5 ───────────────────────────────────
import RESIDENT_ADMISSION from "./resident-admission";
import CARE_PLAN_PERSON_CENTRED from "./care-plan-person-centred";
import FALLS_RISK_ASSESSMENT from "./falls-risk-assessment";
import NEW_PATIENT_REGISTRATION from "./new-patient-registration";
import MCA_DOLS from "./consent-capacity-mca-dols";
import IAPT_SELF_REFERRAL from "./iapt-self-referral";
// ── Applications · batch 5 (remaining) ───────────────────────────────
import PRIMARY_SCHOOL_APPLICATION from "./primary-school-application";
import UNIVERSITY_COURSE_APPLICATION from "./university-course-application";
import GYM_FITNESS_MEMBERSHIP from "./gym-fitness-membership";
import DONOR_PLEDGE_GIFT_FORM from "./donor-pledge-gift-form";
import INTERNSHIP_PLACEMENT from "./internship-placement-application";
import SOCIETY_ASSOCIATION_SIGNUP from "./society-association-signup";

/**
 * Schema registry — productId → PackSchema.
 *
 * Authoring styles:
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
  // Foundation
  "staff-onboarding-uk-care": STAFF_ONBOARDING_UK_CARE,
  "mutual-nda": MUTUAL_NDA,
  "tenant-referencing": TENANT_REFERENCING,
  "gdpr-dsar-subject-access": GDPR_DSAR,
  "affidavit-general-purpose": AFFIDAVIT_GENERAL,
  "photography-media-consent": PHOTOGRAPHY_CONSENT,
  // Applications · batch 1
  "job-application-standard": JOB_APPLICATION_STANDARD,
  "volunteer-application": VOLUNTEER_APPLICATION,
  "grant-application-organisation": GRANT_APPLICATION_ORGANISATION,
  "membership-application-club": MEMBERSHIP_APPLICATION_CLUB,
  // Appointments · batch 1
  "gp-appointment-request": GP_APPOINTMENT_REQUEST,
  "dental-check-up-booking": DENTAL_CHECK_UP_BOOKING,
  "eye-test-booking-adult": EYE_TEST_BOOKING_ADULT,
  "therapy-intake-form": THERAPY_INTAKE_FORM,
  // Bookings · batch 1
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
  // HR · batch 3
  "hr-onboarding-uk-employer": HR_ONBOARDING_UK_EMPLOYER,
  "performance-review": PERFORMANCE_REVIEW,
  "holiday-request": HOLIDAY_REQUEST,
  "exit-interview": EXIT_INTERVIEW,
  // Finance · batch 3
  "aml-kyc-onboarding": AML_KYC_ONBOARDING,
  "credit-application-personal": CREDIT_APPLICATION_PERSONAL,
  "direct-debit-mandate": DIRECT_DEBIT_MANDATE,
  // Hospitality · batch 3
  "restaurant-booking-t-cs": RESTAURANT_BOOKING_TCS,
  "allergen-disclosure-natasha-s-law": ALLERGEN_DISCLOSURE,
  "hotel-booking-t-cs": HOTEL_BOOKING_TCS,
  // Construction · batch 3
  "rams-risk-method": RAMS_RISK_METHOD,
  "site-induction": SITE_INDUCTION,
  // Real estate · batch 4
  "ast-assured-shorthold-tenancy": AST,
  "inventory-check-in": INVENTORY_CHECK_IN,
  "notice-to-quit-section-21": NOTICE_S21,
  // Public sector · batch 4
  "council-tax-single-person-discount": COUNCIL_TAX_SPD,
  "blue-badge-application": BLUE_BADGE,
  "foi-request": FOI_REQUEST,
  // Logistics · batch 4
  "vehicle-defect-report-vor": VEHICLE_DEFECT_VOR,
  "walk-around-check-daily": WALK_AROUND_DAILY,
  "driver-onboarding-hgv": DRIVER_ONBOARDING_HGV,
  // Education · batch 4
  "parental-consent-school": PARENTAL_CONSENT_SCHOOL,
  "send-support-plan": SEND_SUPPORT_PLAN,
  "educational-visit-consent": EDUCATIONAL_VISIT_CONSENT,
  // Healthcare deepening · batch 5
  "resident-admission": RESIDENT_ADMISSION,
  "care-plan-person-centred": CARE_PLAN_PERSON_CENTRED,
  "falls-risk-assessment": FALLS_RISK_ASSESSMENT,
  "new-patient-registration": NEW_PATIENT_REGISTRATION,
  "consent-capacity-mca-dols": MCA_DOLS,
  "iapt-self-referral": IAPT_SELF_REFERRAL,
  // Applications · batch 5 (remaining)
  "primary-school-application": PRIMARY_SCHOOL_APPLICATION,
  "university-course-application": UNIVERSITY_COURSE_APPLICATION,
  "gym-fitness-membership": GYM_FITNESS_MEMBERSHIP,
  "donor-pledge-gift-form": DONOR_PLEDGE_GIFT_FORM,
  "internship-placement-application": INTERNSHIP_PLACEMENT,
  "society-association-signup": SOCIETY_ASSOCIATION_SIGNUP,
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
