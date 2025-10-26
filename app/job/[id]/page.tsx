import { Job } from "@/hooks/job/use-list";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Building2Icon, MapPinIcon } from "lucide-react";
import Link from "next/link";

export default async function JobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { data: job, error } = await supabase
    .from("jobs")
    .select()
    .eq("id", (await params).id)
    .single<Job>();

  if (job === null) {
    return (
      <div className="text-muted-foreground text-sm py-6">
        {error?.message || (
          <>
            Something went wrong. Please reload or{" "}
            <a
              href="mailto:hi@lang.ski"
              className="underline underline-offset-4"
            >
              contact us
            </a>{" "}
            for support.
          </>
        )}
      </div>
    );
  }
  return (
    <div className="py-6 space-y-6">
      <div className="space-y-2">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Job {job.title}
        </h3>
        <div className="flex items-center gap-2 md:gap-4 flex-wrap text-muted-foreground text-sm">
          <a
            href={job.company_website}
            target="_blank"
            rel="noreferrer"
            className="hover:underline underline-offset-4 flex items-center gap-2 flex-nowrap"
          >
            <Building2Icon className="size-3.5!" />
            {job.company_name}
          </a>
          <div className="flex items-center gap-2 flex-nowrap">
            <MapPinIcon className="size-3.5!" />
            {job.location || "N/A"}
          </div>
        </div>
      </div>
      <div>
        {job.description
          .split("\n")
          .filter(Boolean)
          .map((line, i) => (
            <p className="leading-7 not-first:mt-6" key={i}>
              {line}
            </p>
          ))}
      </div>
      <div>
        <Link
          href="/"
          className="hover:underline underline-offset-4 text-sm text-muted-foreground flex gap-2 items-center"
        >
          <ArrowLeftIcon className="size-4!" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
