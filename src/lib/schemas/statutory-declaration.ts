/**
 * Statutory declaration.
 *
 * Sworn statement made under the Statutory Declarations Act 1835. Used
 * when an oath is not appropriate (overseas use, change of name, lost
 * documents). Must be witnessed by a solicitor or commissioner.
 */

import type { PackSchema } from "./types";
import { toPackSchema, field } from "@lib/primitives/to-pack-schema";

const STATUTORY_DECLARATION: PackSchema = toPackSchema({
  productId: "statutory-declaration",
  title: "Statutory declaration",
  pathways: [
    { id: "change-of-name", name: "Change of name" },
    { id: "lost-document", name: "Lost document" },
    { id: "general", name: "General purpose" },
  ],
  sections: [
    {
      id: "declarant",
      name: "Declarant details",
      fields: [
        field("declarant_name", "name-full", "Full legal name of declarant", { required: true }),
        field("declarant_dob", "dob", "Date of birth", { required: true }),
        field("declarant_occupation", "text-short", "Occupation"),
        field("declarant_address", "address-uk", "Current address", { required: true }),
        field("declarant_id_type", "select-single", "Photo ID presented", {
          required: true,
          options: ["UK passport", "UK driving licence", "EEA passport", "BRP", "Other"],
        }),
        field("declarant_id_number", "text-short", "ID document number", { required: true }),
      ],
    },
    {
      id: "declaration",
      name: "Declaration",
      intro: "State the facts to be declared. Use numbered paragraphs if multiple.",
      fields: [
        field("subject", "text-short", "Matter / purpose of declaration", {
          required: true,
          placeholder: "e.g. Change of name, declaration of lost passport",
        }),
        field("body", "text-long", "Declaration text", {
          required: true,
          placeholder:
            "1. I, [name], solemnly and sincerely declare that …\n2. …\n3. …",
          validation: { maxLength: 6000 },
        }),
        field("exhibits", "file-multi", "Exhibits / supporting documents"),
        field("solemn_declaration", "consent-gdpr", "I solemnly and sincerely declare that the contents of this declaration are true, and I make this solemn declaration conscientiously believing it to be true and by virtue of the Statutory Declarations Act 1835.", {
          validation: { required: true },
        }),
      ],
    },
    {
      id: "witness",
      name: "Witnessed before",
      intro: "Completed in person by a solicitor / commissioner of oaths / notary public.",
      fields: [
        field("declarant_signature", "signature", "Declarant signature", { required: true }),
        field("declared_date", "date", "Date declared", { required: true }),
        field("declared_place", "text-short", "Place of declaration", { required: true }),
        field("witness_name", "name-full", "Witness · full name", { required: true }),
        field("witness_role", "select-single", "Witness role", {
          required: true,
          options: ["Solicitor", "Commissioner for oaths", "Notary public", "Justice of the peace"],
        }),
        field("witness_address", "address-uk", "Witness · business address", { required: true }),
        field("witness_signature", "signature", "Witness signature", { required: true }),
      ],
    },
  ],
});

export default STATUTORY_DECLARATION;
