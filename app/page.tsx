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
    <div className="py-6 space-y-6">
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
  );
}
