/** URL slug for a university name: "Chengde Medical University" → "chengde-medical-university" */
export function universitySlug(name: string): string {
  return String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
