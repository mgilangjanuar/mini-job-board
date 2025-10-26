"use client";

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
    <>
      <UserProvider>{children}</UserProvider>
      <Toaster theme={resolvedTheme as "dark" | "light"} richColors />
    </>
  );
}
