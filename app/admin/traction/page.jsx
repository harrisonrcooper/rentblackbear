"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function TractionRedirect() { const r = useRouter(); useEffect(() => { r.replace("/admin"); }, []); return null; }
