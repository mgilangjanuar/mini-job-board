import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token_hash?: string; type?: string }>;
}) {
  const q = await searchParams;
  if (!q.token_hash || !q.type) {
    return <div className="text-center">Invalid confirmation link.</div>;
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    type: q.type as EmailOtpType,
    token_hash: q.token_hash,
  });

  if (error) {
    return <div className="text-center">{error.message}</div>;
  }

  return redirect("/auth?email_verified=1");
}
