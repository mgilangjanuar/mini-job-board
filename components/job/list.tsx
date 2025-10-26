"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { useJobList } from "@/hooks/job/use-list";
import { CalendarIcon } from "@radix-ui/react-icons";
import {
  BriefcaseBusinessIcon,
  Building2Icon,
  ChevronLeftIcon,
  MapPinIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function JobList() {
  const r = useRouter();
  const { jobs, page, nextPage, canNext, prevPage, canPrev } = useJobList();

  if (jobs === undefined) {
    return <div className="text-muted-foreground text-sm">Please wait...</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        {!jobs.length ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <BriefcaseBusinessIcon />
              </EmptyMedia>
              <EmptyTitle>No Jobs Found</EmptyTitle>
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
    </>
  );
}
