"use client";

import { useEffect, useState } from "react";
import { useBrique } from "./BriqueContext";
import { createClient } from "@/lib/supabase/client";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export default function DevProToggle() {
  const { isPro, setIsPro } = useBrique();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
        setIsAdmin(true);
      }
    })();
  }, []);

  if (!isAdmin) return null;

  const toggle = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("toggle_test_plan");
    if (error) {
      console.error("toggle_test_plan failed:", error.message);
      return;
    }
    setIsPro(!!data);
  };

  return (
    <button
      onClick={toggle}
      className="fixed right-4 bottom-20 z-[70] cursor-pointer rounded-full px-4 py-2 text-xs font-bold text-white shadow-lg lg:bottom-4"
      style={{ background: isPro ? "#1B7A4A" : "#334155" }}
      title="Alternar modo de teste Free/PRO"
    >
      Modo teste: {isPro ? "PRO" : "Free"}
    </button>
  );
}
