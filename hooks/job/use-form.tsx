"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createContext, use } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const JobFormSchema = z.object({
  id: z.string().or(z.literal("")).nullable().optional(),
  title: z.string().min(5, "Title must be at least 5 characters"),
  company_name: z.string().min(2, "Company name must be at least 2 characters"),
  company_website: z.url("Invalid URL").optional(),
  location: z.string().optional(),
  description: z.string().min(20, "Description must be at least 20 characters"),
});

type JobFormType = ReturnType<typeof useForm<z.infer<typeof JobFormSchema>>>;

export const JobFormContext = createContext<{
  form: JobFormType;
}>({
  form: {} as JobFormType,
});

export function JobFormProvider({ children }: { children: React.ReactNode }) {
  const form = useForm<z.infer<typeof JobFormSchema>>({
    resolver: zodResolver(JobFormSchema),
    defaultValues: {
      title: "",
      company_name: "",
      company_website: "",
      location: "",
      description: "",
    },
  });

  return (
    <JobFormContext.Provider value={{ form }}>
      {children}
    </JobFormContext.Provider>
  );
}

export const useJobForm = () => use(JobFormContext);
