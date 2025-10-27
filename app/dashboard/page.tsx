"use client";

import JobForm from "@/components/job/form";
import JobList from "@/components/job/list";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { JobFormProvider, useJobForm } from "@/hooks/job/use-form";
import { JobListProvider, useJobList } from "@/hooks/job/use-list";
import { useUser } from "@/hooks/use-user";
import { ReloadIcon } from "@radix-ui/react-icons";
import { BriefcaseBusinessIcon, PlusIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user } = useUser();

  if (!user) return;

  return (
    <JobListProvider filterByUserId={user.id}>
      <JobFormProvider>
        <DashboardPage />
      </JobFormProvider>
    </JobListProvider>
  );
}

function DashboardPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { fetchJobs, search, setSearch } = useJobList();
  const { form } = useJobForm();

  useEffect(() => {
    if (!isDialogOpen) {
      form.reset({
        id: "",
        title: "",
        company_name: "",
        company_website: "",
        location: "",
        description: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDialogOpen]);

  return (
    <div className="w-full py-6 space-y-6 container mx-auto">
      <div className="flex items-center justify-between w-full gap-2 md:gap-4">
        <div className="relative flex-1">
          <SearchIcon className="size-4 absolute top-2.5 left-2.5 text-muted-foreground" />
          <Input
            placeholder="Search job..."
            value={search || ""}
            onChange={(e) => setSearch?.(e.target.value)}
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
          <DialogContent className="px-0">
            <DialogHeader className="px-6">
              <DialogTitle className="flex items-center justify-center md:justify-start gap-2">
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
                onFinish={() => {
                  setIsDialogOpen(false);
                  fetchJobs();
                }}
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
        </Dialog>
      </div>
      <JobList
        onUpdate={(job) => {
          form.reset({
            id: job.id,
            title: job.title,
            company_name: job.company_name,
            company_website: job.company_website || "",
            location: job.location || "",
            description: job.description,
          });
          setIsDialogOpen(true);
        }}
        onDelete={fetchJobs}
      />
    </div>
  );
}
