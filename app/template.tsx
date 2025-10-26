"use client";

import { Toaster } from "@/components/ui/sonner";
import { useTheme } from "next-themes";

export default function Template({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { resolvedTheme } = useTheme();
  return (
    <>
      {children}
      <Toaster theme={resolvedTheme as "dark" | "light"} richColors />
    </>
  );
}
