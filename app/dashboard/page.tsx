"use client";

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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { BriefcaseBusinessIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

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

const schema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  company_name: z.string().min(2, "Company name must be at least 2 characters"),
  company_website: z.url("Invalid URL").optional(),
  location: z.string().optional(),
  description: z.string().min(20, "Description must be at least 20 characters"),
});

export default function Dashboard() {
  const supabase = createClient();
  const { user } = useUser();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      company_name: "",
      company_website: "",
      location: "",
      description: "",
    },
  });

  return (
    <div className="w-full py-6 space-y-6">
      <div className="flex items-center justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon />
              Post a Job
            </Button>
          </DialogTrigger>
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
              <form
                id="form-job"
                className="max-h-[calc(100svh-240px)] px-6"
                onSubmit={form.handleSubmit(async (data) => {
                  const { error } = await supabase.from("jobs").insert({
                    ...data,
                    user_id: user?.id,
                  });
                  if (error) {
                    toast("Error", { description: error.message });
                    throw error;
                  }
                  toast("Success", { description: "Job posted successfully" });
                  setIsDialogOpen(false);
                  form.reset();
                })}
              >
                <FieldGroup>
                  <Controller
                    name="title"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="title">Title</FieldLabel>
                        <Input
                          {...field}
                          autoFocus
                          id="title"
                          aria-invalid={fieldState.invalid}
                          disabled={form.formState.isSubmitting}
                          required
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="company_name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="company_name">
                          Company Name
                        </FieldLabel>
                        <Input
                          {...field}
                          id="company_name"
                          aria-invalid={fieldState.invalid}
                          disabled={form.formState.isSubmitting}
                          required
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="company_website"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="company_website">
                          Company Website
                        </FieldLabel>
                        <Input
                          {...field}
                          id="company_website"
                          aria-invalid={fieldState.invalid}
                          disabled={form.formState.isSubmitting}
                          required
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="location"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="location">Location</FieldLabel>
                        <Input
                          {...field}
                          id="location"
                          aria-invalid={fieldState.invalid}
                          disabled={form.formState.isSubmitting}
                          required
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="description"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="description">
                          Description
                        </FieldLabel>
                        <Textarea
                          {...field}
                          id="description"
                          aria-invalid={fieldState.invalid}
                          disabled={form.formState.isSubmitting}
                          required
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </form>
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
    </div>
  );
}
