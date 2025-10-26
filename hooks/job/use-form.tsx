"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const schema = z.object({
  id: z.string().or(z.literal("")).nullable().optional(),
  title: z.string().min(5, "Title must be at least 5 characters"),
  company_name: z.string().min(2, "Company name must be at least 2 characters"),
  company_website: z.url("Invalid URL").optional(),
  location: z.string().optional(),
  description: z.string().min(20, "Description must be at least 20 characters"),
});

export default function useJobForm() {
  const supabase = createClient();
  const { user } = useUser();

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

  return {
    form: form,
    Component: ({
      onFinish,
      className,
    }: Readonly<{
      onFinish?: () => void;
      className?: string;
    }>) => {
      return (
        <form
          id="form-job"
          className={cn(className)}
          onSubmit={form.handleSubmit(async (data) => {
            if (data.id) {
              const { error } = await supabase
                .from("jobs")
                .update({
                  title: data.title,
                  company_name: data.company_name,
                  company_website: data.company_website,
                  location: data.location,
                  description: data.description,
                })
                .eq("id", data.id);
              if (error) {
                toast("Error", { description: error.message });
                throw error;
              }
            }

            const { error } = await supabase.from("jobs").insert({
              ...data,
              user_id: user?.id,
            });
            if (error) {
              toast("Error", { description: error.message });
              throw error;
            }

            toast("Success", { description: "Job posted successfully" });
            form.reset();
            onFinish?.();
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
                  <FieldLabel htmlFor="company_name">Company Name</FieldLabel>
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
                  <FieldLabel htmlFor="description">Description</FieldLabel>
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
      );
    },
  };
}
