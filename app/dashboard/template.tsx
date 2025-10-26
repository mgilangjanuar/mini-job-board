"use client";

import Header from "@/components/header";

export default function Template({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <main className="container mx-auto min-h-screen">{children}</main>
    </div>
  );
}
