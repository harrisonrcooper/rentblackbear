"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function PMRedirect() { const r = useRouter(); useEffect(() => { r.replace("/admin"); }, []); return null; }
