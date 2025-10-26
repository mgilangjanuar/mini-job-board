"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useJobForm } from "@/hooks/job/use-form";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Controller } from "react-hook-form";
import { toast } from "sonner";

export default function JobForm({
  onFinish,
  className,
}: Readonly<{
  onFinish?: () => void;
  className?: string;
}>) {
  const supabase = createClient();
  const { user } = useUser();
  const { form } = useJobForm();

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
          toast("Success", { description: "Job updated successfully" });
        } else {
          const { error } = await supabase.from("jobs").insert({
            ...data,
            user_id: user?.id,
          });
          if (error) {
            toast("Error", { description: error.message });
            throw error;
          }
          toast("Success", { description: "Job posted successfully" });
        }

        form.reset({
          id: "",
          title: "",
          company_name: "",
          company_website: "",
          location: "",
          description: "",
        });
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="company_website"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="company_website">Company Website</FieldLabel>
              <Input
                {...field}
                id="company_website"
                placeholder="https://..."
                aria-invalid={fieldState.invalid}
                disabled={form.formState.isSubmitting}
                required
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
}
