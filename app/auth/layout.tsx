import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    return redirect("/dashboard");
  }

  return (
    <div className="flex min-h-[calc(100svh-64px)] w-full items-center justify-center container mx-auto">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
