"use client";

import { useDebounce } from "@/hooks/use-debounce";
import { createClient } from "@/lib/supabase/client";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";

export type Job = {
  id: string;
  title: string;
  company_name: string;
  company_website?: string;
  location?: string;
  description: string;
  user_id: string;
  created_at: string;
};

const PAGE_SIZE = 10;

export const JobListContext = createContext<{
  fetchJobs: () => void;
  jobs: Job[] | undefined;
  page: number;
  nextPage: () => void;
  prevPage: () => void;
  canNext: boolean;
  canPrev: boolean;
  search?: string;
  searchDebounce?: string;
  setSearch?: (value: string) => void;
}>({
  fetchJobs: () => {},
  jobs: undefined,
  page: 1,
  nextPage: () => {},
  prevPage: () => {},
  canNext: false,
  canPrev: false,
  search: undefined,
  searchDebounce: undefined,
  setSearch: () => {},
});

export function JobListProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  const [jobs, setJobs] = useState<Job[]>();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<string>();
  const searchDebounce = useDebounce(search, 500);

  const fetchJobs = useCallback(() => {
    const query = supabase
      .from("jobs")
      .select()
      .order("created_at", { ascending: false })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
    if (searchDebounce) {
      query.textSearch("title", searchDebounce.trim().split(" ").join(" & "));
    }
    query.then(({ data, error }) => {
      if (error) {
        toast("Error", { description: error.message });
        return;
      }
      setJobs(data || []);
    });
  }, [supabase, page, searchDebounce]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const canNext = useMemo(() => {
    return jobs?.length === PAGE_SIZE;
  }, [jobs]);

  const canPrev = useMemo(() => {
    return page > 1;
  }, [page]);

  const nextPage = useCallback(() => {
    if (canNext) {
      setPage((prev) => prev + 1);
    }
  }, [canNext]);

  const prevPage = useCallback(() => {
    if (canPrev) {
      setPage((prev) => prev - 1);
    }
  }, [canPrev]);

  return (
    <JobListContext.Provider
      value={{
        fetchJobs,
        jobs,
        page,
        nextPage,
        prevPage,
        canNext,
        canPrev,
        search,
        searchDebounce,
        setSearch,
      }}
    >
      {children}
    </JobListContext.Provider>
  );
}

export const useJobList = () => use(JobListContext);
