"use client";

import Header from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/hooks/use-user";
import { useTheme } from "next-themes";

export default function Template({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { resolvedTheme } = useTheme();
  return (
    <UserProvider>
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto">{children}</main>
      </div>
      <Toaster theme={resolvedTheme as "dark" | "light"} richColors />
    </UserProvider>
  );
}
