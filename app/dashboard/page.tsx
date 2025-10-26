"use client";

import JobForm from "@/components/job/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { JobFormProvider, useJobForm } from "@/hooks/job/use-form";
import { useDebounce } from "@/hooks/use-debounce";
import { createClient } from "@/lib/supabase/client";
import { CalendarIcon, ReloadIcon } from "@radix-ui/react-icons";
import {
  BriefcaseBusinessIcon,
  Building2Icon,
  ChevronLeftIcon,
  MapPinIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Job = {
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

export default function Dashboard() {
  const supabase = createClient();
  const r = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<string>();
  const searchDebounce = useDebounce(search, 500);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    return jobs.length === PAGE_SIZE;
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
    <div className="w-full py-6 space-y-6">
      <div className="flex items-center justify-between w-full gap-4">
        <div className="relative flex-1">
          <SearchIcon className="size-4 absolute top-2.5 left-2.5 text-muted-foreground" />
          <Input
            placeholder="Search job..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon />
              Post a Job
            </Button>
          </DialogTrigger>
          <JobFormProvider>
            <JobDialogContent
              onFinish={() => {
                setIsDialogOpen(false);
                fetchJobs();
              }}
            />
          </JobFormProvider>
        </Dialog>
      </div>
      <div className="flex flex-col gap-4 w-full">
        {!jobs.length ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <BriefcaseBusinessIcon />
              </EmptyMedia>
              <EmptyTitle>No Jobs Yet</EmptyTitle>
              <EmptyDescription>
                {page === 1
                  ? "There are no jobs available."
                  : "No more jobs available."}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
            {jobs.map((job) => (
              <Card
                className="cursor-pointer group"
                key={job.id}
                onClick={() => r.push(`/jobs/${job.id}`)}
              >
                <div className="flex justify-between items-start gap-2 md:gap-0 flex-col md:flex-row w-full">
                  <CardHeader className="flex-1 w-full gap-3">
                    <CardTitle className="group-hover:underline underline-offset-4">
                      {job.title}
                    </CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                        <a
                          href={job.company_website}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline underline-offset-4 flex items-center gap-2 flex-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Building2Icon className="size-3.5" />
                          {job.company_name}
                        </a>
                        <div className="flex items-center gap-2 flex-nowrap">
                          <MapPinIcon className="size-3.5" />
                          {job.location || "N/A"}
                        </div>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardDescription className="px-6">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2 flex-nowrap">
                        <CalendarIcon className="size-3.5" />
                        {new Date(job.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </CardDescription>
                </div>
              </Card>
            ))}
          </>
        )}
      </div>
      <div className="flex items-center justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="ghost"
                onClick={prevPage}
                disabled={!canPrev}
                className="gap-1"
              >
                <ChevronLeftIcon className="size-4" />
                Previous
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="ghost"
                onClick={nextPage}
                disabled={!canNext}
                className="gap-1"
              >
                Next
                <ChevronLeftIcon className="size-4 rotate-180" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

function JobDialogContent({
  onFinish,
}: Readonly<{
  onFinish?: () => void;
}>) {
  const { form } = useJobForm();

  return (
    <DialogContent className="px-0">
      <DialogHeader className="px-6">
        <DialogTitle className="flex items-center gap-2">
          <BriefcaseBusinessIcon className="size-4" />
          New Job
        </DialogTitle>
        <DialogDescription>
          Create a new job listing for your company.
        </DialogDescription>
      </DialogHeader>
      <ScrollArea>
        <JobForm
          className="max-h-[calc(100svh-240px)] px-6 pb-1"
          onFinish={onFinish}
        />
      </ScrollArea>
      <DialogFooter className="px-6">
        <DialogClose asChild>
          <Button variant="ghost">Close</Button>
        </DialogClose>
        <Button
          type="submit"
          form="form-job"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <ReloadIcon className="animate-spin" />
          ) : (
            <></>
          )}
          Submit
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
