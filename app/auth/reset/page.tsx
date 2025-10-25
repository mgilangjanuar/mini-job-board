"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { InputPassword } from "@/components/ui/input-password";
import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { EmailOtpType } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    password_confirm: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Passwords do not match",
    path: ["password_confirm"],
  });

export default function ResetPasswordPage() {
  const r = useRouter();
  const q = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      password_confirm: "",
    },
  });

  useEffect(() => {
    if (!q.get("token_hash") || !q.get("type")) {
      toast.error("Error", {
        description: "Invalid or missing token",
      });
    }
  }, [q]);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
          <CardDescription>
            Enter your new password below to reset your account password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(async (data) => {
              const supabase = createClient();
              const { error } = await supabase.auth.verifyOtp({
                token_hash: q.get("token_hash") || "",
                type: q.get("type") as EmailOtpType,
              });
              if (error) {
                toast("Error", {
                  description: error.message,
                });
              } else {
                const { error } = await supabase.auth.updateUser({
                  password: data.password,
                });
                if (error) {
                  toast("Error", {
                    description: error.message,
                  });
                } else {
                  toast("Success", {
                    description: "Your password has been reset successfully.",
                  });
                  r.push("/dashboard");
                }
              }
            })}
          >
            <FieldGroup>
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <InputPassword
                      {...field}
                      id="password"
                      aria-invalid={fieldState.invalid}
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password_confirm"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password_confirm">
                      Password Confirmation
                    </FieldLabel>
                    <InputPassword
                      {...field}
                      id="password_confirm"
                      aria-invalid={fieldState.invalid}
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <ReloadIcon className="animate-spin" />
                  ) : (
                    <></>
                  )}
                  Reset Password
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
