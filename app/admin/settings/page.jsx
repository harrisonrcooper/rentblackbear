"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function SettingsRedirect() { const r = useRouter(); useEffect(() => { r.replace("/admin"); }, []); return null; }
