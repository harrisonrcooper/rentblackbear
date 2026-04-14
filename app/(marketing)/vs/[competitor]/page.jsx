// /vs/<competitor> — single dynamic route that delegates to the
// matching ported competitor comparison mock. Adding a competitor
// = add its mock to app/mocks/vs-<slug>/ and a registry entry here.

import { notFound } from "next/navigation";
import VsAppfolio from "../../../mocks/vs-appfolio/page";
import VsBuildium from "../../../mocks/vs-buildium/page";
import VsDoorloop from "../../../mocks/vs-doorloop/page";

const registry = {
  appfolio: VsAppfolio,
  buildium: VsBuildium,
  doorloop: VsDoorloop,
};

export function generateStaticParams() {
  return Object.keys(registry).map((competitor) => ({ competitor }));
}

export const dynamicParams = false;

export default function Page({ params }) {
  const Mock = registry[params.competitor];
  if (!Mock) notFound();
  return <Mock />;
}
