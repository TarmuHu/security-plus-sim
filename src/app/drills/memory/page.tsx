import { redirect } from "next/navigation";

/** Old path — memory list is now a standalone product at /memory */
export default function DrillsMemoryRedirectPage() {
  redirect("/memory");
}
