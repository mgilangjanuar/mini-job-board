"use client";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Job, useJobList } from "@/hooks/job/use-list";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import {
  CalendarIcon,
  DotsVerticalIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import {
  BriefcaseBusinessIcon,
  Building2Icon,
  ChevronLeftIcon,
  Edit3Icon,
  MapPinIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function JobList({
  onUpdate,
  onDelete,
}: Readonly<{
  onUpdate?: (job: Job) => void;
  onDelete?: (job: Job) => void;
}>) {
  const r = useRouter();
  const supabase = createClient();
  const { user } = useUser();
  const { jobs, page, nextPage, canNext, prevPage, canPrev } = useJobList();
  const [loading, setLoading] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

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
              <Card key={job.id}>
                <div className="flex justify-between items-start gap-4 md:gap-0 flex-col-reverse md:flex-row w-full">
                  <CardHeader className="flex-1 w-full">
                    <Link href={`/job/${job.id}`}>
                      <CardTitle className=" hover:underline underline-offset-4">
                        {job.title}
                      </CardTitle>
                    </Link>
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
                  <CardDescription className="px-6 w-full md:w-auto">
                    <div className="flex items-center gap-4 flex-wrap justify-between md:justify-end">
                      <div className="flex items-center gap-2 flex-nowrap">
                        <CalendarIcon className="size-3.5" />
                        {new Date(job.created_at).toLocaleDateString()}
                      </div>
                      {job.user_id === user?.id && (onDelete || onUpdate) ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={(e) => e.stopPropagation()}
                              className="size-7"
                            >
                              <DotsVerticalIcon className="size-3.5!" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {onUpdate ? (
                              <DropdownMenuItem
                                onSelect={(e) => {
                                  e.stopPropagation();
                                  onUpdate?.(job);
                                }}
                              >
                                <Edit3Icon />
                                Update
                              </DropdownMenuItem>
                            ) : (
                              <></>
                            )}
                            {onUpdate && onDelete ? (
                              <DropdownMenuSeparator />
                            ) : (
                              <></>
                            )}
                            {onDelete ? (
                              <Dialog
                                modal
                                open={openDeleteDialog}
                                onOpenChange={setOpenDeleteDialog}
                              >
                                <DialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className="text-destructive! *:text-destructive!"
                                  >
                                    <Trash2Icon />
                                    Delete
                                  </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Confirm Deletion</DialogTitle>
                                    <DialogDescription>
                                      Are you sure you want to delete this job?
                                      This action cannot be undone.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button variant="ghost">Cancel</Button>
                                    </DialogClose>
                                    <Button
                                      variant="destructive"
                                      onClick={async () => {
                                        setLoading(true);
                                        const { error } = await supabase
                                          .from("jobs")
                                          .delete()
                                          .eq("id", job.id);
                                        setLoading(false);
                                        if (error) {
                                          toast("Error", {
                                            description: error.message,
                                          });
                                          return;
                                        }
                                        setOpenDeleteDialog(false);
                                        onDelete?.(job);
                                      }}
                                      disabled={loading}
                                    >
                                      {loading ? (
                                        <ReloadIcon className="size-4 animate-spin" />
                                      ) : (
                                        <></>
                                      )}
                                      Yes, Confirm
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            ) : (
                              <></>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <></>
                      )}
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
