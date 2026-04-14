// /for/<segment> — single dynamic route that delegates to the
// matching ported audience page mock. Adding a segment = add its
// mock to app/mocks/for-<slug>/ and a registry entry here.

import { notFound } from "next/navigation";
import ForLandlords from "../../../mocks/for-landlords/page";
import ForColiving from "../../../mocks/for-coliving/page";
import ForStudents from "../../../mocks/for-students/page";
import ForSfrInvestors from "../../../mocks/for-sfr-investors/page";

const registry = {
  landlords: ForLandlords,
  coliving: ForColiving,
  students: ForStudents,
  "sfr-investors": ForSfrInvestors,
};

export function generateStaticParams() {
  return Object.keys(registry).map((segment) => ({ segment }));
}

export const dynamicParams = false;

export default function Page({ params }) {
  const Mock = registry[params.segment];
  if (!Mock) notFound();
  return <Mock />;
}
