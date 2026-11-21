import { redirect } from "next/navigation";

/** Legacy deck path → identity flash deck */
export default function LegacyAcronymsDrillRedirect() {
  redirect("/drills/identity");
}
