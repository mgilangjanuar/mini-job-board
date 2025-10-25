import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { error } = await supabase.auth.getUser();

  if (error) {
    return redirect("/auth");
  }

  return children;
}
