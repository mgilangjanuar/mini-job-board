"use client";

import JobList from "@/components/job/list";
import { Input } from "@/components/ui/input";
import { JobListProvider, useJobList } from "@/hooks/job/use-list";
import { SearchIcon } from "lucide-react";

export default function Home() {
  return (
    <JobListProvider>
      <HomePage />
    </JobListProvider>
  );
}

function HomePage() {
  const { search, setSearch } = useJobList();

  return (
    <div className="pb-6 space-y-6">
      <div className="relative w-full min-h-[50svh] bg-linear-to-br from-muted/0 to-muted text-primary overflow-hidden flex items-center justify-center">
        <div className="relative z-10 text-center container space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">
            Supercharge Your Career
          </h1>
          <p className="text-xl text-muted-foreground text-balance">
            Find your next opportunity or post a job today!
          </p>
        </div>

        <svg
          className="absolute bottom-0 left-0 w-full h-auto"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z"
            fill="var(--background)"
          />
        </svg>
      </div>
      <div className="space-y-6 container mx-auto">
        <div className="relative flex-1">
          <SearchIcon className="size-4 absolute top-2.5 left-2.5 text-muted-foreground" />
          <Input
            placeholder="Search job..."
            value={search || ""}
            onChange={(e) => setSearch?.(e.target.value)}
            className="pl-9"
          />
        </div>
        <JobList />
      </div>
    </div>
  );
}
