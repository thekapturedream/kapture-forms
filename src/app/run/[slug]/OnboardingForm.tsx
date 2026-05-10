"use client";

import { useState } from "react";

interface Pathway {
  id: string;
  name: string;
  description: string;
}

interface Props {
  slug: string;
  pathways: Pathway[];
}

/**
 * Hosted onboarding form. Submits to /api/submit/[slug] which writes
 * a submission row with a SHA-256 audit hash. The four pathways toggle
 * which conditional sections render.
 */
export function OnboardingForm({ slug, pathways }: Props) {
  const [pathway, setPathway] = useState(pathways[0]?.id ?? "permanent-clinical");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ id: string; hash: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload: Record<string, string | boolean> = { pathway };
    fd.forEach((v, k) => {
      if (v instanceof File) return;
      payload[k] = v.toString();
    });
    try {
      const res = await fetch(`/api/submit/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathway, payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submission failed");
      setSuccess({ id: data.id, hash: data.audit_hash });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="bg-white border border-kapture-fog rounded-2xl p-8">
        <span className="ed-kicker">SUBMISSION RECORDED</span>
        <h2 className="font-display font-semibold text-xl mb-3">
          Submitted. Audit hash captured.
        </h2>
        <p className="text-sm text-kapture-smoke leading-relaxed mb-4">
          The submission is signed, timestamped, and routed to the HR queue. The audit hash
          below is the same hash that will appear in the PDF footer and the inspector view.
        </p>
        <div className="bg-kapture-paper border border-kapture-fog rounded-xl p-4 mb-4">
          <div className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-mist mb-1">
            SUBMISSION ID
          </div>
          <div className="font-mono text-sm text-kapture-black break-all">{success.id}</div>
          <div className="font-mono text-[0.625rem] uppercase tracking-widest text-kapture-mist mt-3 mb-1">
            AUDIT HASH (SHA-256)
          </div>
          <div className="font-mono text-xs text-kapture-smoke break-all">{success.hash}</div>
        </div>
        <button
          type="button"
          onClick={() => {
            setSuccess(null);
          }}
          className="btn-secondary text-sm"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* PATHWAY SELECTOR */}
      <div className="bg-white border border-kapture-fog rounded-2xl p-5">
        <span className="ed-kicker">PATHWAY</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          {pathways.map((p) => {
            const active = pathway === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPathway(p.id)}
                className={`text-left rounded-xl border p-3 transition ${
                  active
                    ? "border-kapture-yellow bg-kapture-yellow/10"
                    : "border-kapture-fog bg-white hover:border-kapture-black"
                }`}
              >
                <div className="font-display font-semibold text-sm">{p.name}</div>
                <div className="text-xs text-kapture-smoke mt-0.5 leading-relaxed">
                  {p.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* PERSONAL DETAILS */}
      <div className="bg-white border border-kapture-fog rounded-2xl p-5">
        <span className="ed-kicker">PERSONAL DETAILS</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <Field label="Full legal name" name="full_name" required />
          <Field label="Preferred name" name="preferred_name" />
          <Field label="Date of birth" name="date_of_birth" type="date" required />
          <Field label="National Insurance number" name="ni_number" />
          <Field label="Email" name="email" type="email" required />
          <Field label="Mobile" name="mobile" type="tel" required />
        </div>
      </div>

      {/* RIGHT TO WORK */}
      <div className="bg-white border border-kapture-fog rounded-2xl p-5">
        <span className="ed-kicker">RIGHT TO WORK</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <Field label="Document type" name="rtw_doc_type" placeholder="UK passport / BRP / share code" required />
          <Field label="Document number" name="rtw_doc_number" required />
          <Field label="Issue date" name="rtw_issue_date" type="date" />
          <Field label="Expiry date" name="rtw_expiry_date" type="date" />
        </div>
      </div>

      {/* DBS / BARRED LISTS */}
      <div className="bg-white border border-kapture-fog rounded-2xl p-5">
        <span className="ed-kicker">DBS · BARRED LISTS</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <Field label="DBS certificate number" name="dbs_number" />
          <Field label="DBS issue date" name="dbs_issue_date" type="date" />
          <Field
            label="On the update service?"
            name="dbs_update_service"
            placeholder="Yes / No"
          />
          <Field label="Barred list checked" name="dbs_barred_checked" placeholder="Adult / Child / Both" />
        </div>
      </div>

      {/* PROFESSIONAL REGISTRATION — clinical only */}
      {pathway === "permanent-clinical" && (
        <div className="bg-white border border-kapture-fog rounded-2xl p-5">
          <span className="ed-kicker">PROFESSIONAL REGISTRATION</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <Field label="Body" name="prof_body" placeholder="NMC / HCPC / GMC" required />
            <Field label="PIN / number" name="prof_number" required />
            <Field label="Renewal date" name="prof_renewal" type="date" />
            <Field label="Restrictions" name="prof_restrictions" placeholder="None" />
          </div>
        </div>
      )}

      {/* MANDATORY TRAINING */}
      <div className="bg-white border border-kapture-fog rounded-2xl p-5">
        <span className="ed-kicker">MANDATORY TRAINING</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <Field label="Safeguarding adults — date" name="train_safeguarding" type="date" />
          <Field label="Moving & handling — date" name="train_moving" type="date" />
          <Field label="Infection control — date" name="train_infection" type="date" />
          <Field label="Fire safety — date" name="train_fire" type="date" />
          <Field label="Mental capacity — date" name="train_mca" type="date" />
          <Field label="First aid — date" name="train_first_aid" type="date" />
        </div>
      </div>

      {/* REFERENCES */}
      <div className="bg-white border border-kapture-fog rounded-2xl p-5">
        <span className="ed-kicker">REFERENCES</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <Field label="Reference 1 — name" name="ref1_name" required />
          <Field label="Reference 1 — email" name="ref1_email" type="email" required />
          <Field label="Reference 2 — name" name="ref2_name" required />
          <Field label="Reference 2 — email" name="ref2_email" type="email" required />
        </div>
      </div>

      {/* BANK + PENSION */}
      {pathway !== "volunteer-student" && (
        <div className="bg-white border border-kapture-fog rounded-2xl p-5">
          <span className="ed-kicker">BANK · PENSION</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <Field label="Account holder" name="bank_holder" required />
            <Field label="Sort code" name="bank_sort" placeholder="00-00-00" required />
            <Field label="Account number" name="bank_account" required />
            <Field
              label="Pension opt-out"
              name="pension_optout"
              placeholder="Auto-enrolled / Opt-out"
            />
          </div>
        </div>
      )}

      {/* CONSENTS */}
      <div className="bg-white border border-kapture-fog rounded-2xl p-5">
        <span className="ed-kicker">CONSENTS · ACKNOWLEDGEMENTS</span>
        <div className="space-y-3 mt-3 text-sm">
          <Checkbox name="consent_gdpr" required>
            I confirm the data above is accurate and consent to its processing under UK GDPR
            for the purposes of employment.
          </Checkbox>
          <Checkbox name="consent_codeofconduct" required>
            I have read and agree to comply with the Code of Conduct for healthcare support
            workers.
          </Checkbox>
          <Checkbox name="consent_safeguarding" required>
            I understand my safeguarding obligations and the routes for raising concerns.
          </Checkbox>
        </div>
      </div>

      {error && <p className="text-sm text-status-critical font-mono">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="btn-yellow"
        >
          {submitting ? "Signing submission…" : "Submit · sign · audit-hash"}
        </button>
        <button type="reset" className="btn-secondary">
          Clear form
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="field-label">
        {label}
        {required && <span className="text-status-critical ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="field-input"
      />
    </div>
  );
}

function Checkbox({
  name,
  children,
  required,
}: {
  name: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="flex items-start gap-3 text-sm leading-relaxed">
      <input
        type="checkbox"
        name={name}
        required={required}
        className="mt-0.5 h-4 w-4 rounded border-kapture-fog text-kapture-yellow"
      />
      <span>{children}</span>
    </label>
  );
}
