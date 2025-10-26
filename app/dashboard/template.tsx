"use client";

import Header from "@/components/header";

export default function Template({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto">{children}</main>
    </div>
  );
}
