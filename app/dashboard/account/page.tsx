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
import { InputPassword } from "@/components/ui/input-password";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const nameSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

const passwordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const emailSchema = z.object({
  email: z.email("Invalid email address"),
});

export default function Account() {
  const r = useRouter();
  const supabase = createClient();
  const { user, setUser } = useUser();
  const [openEmailConfirmDialog, setOpenEmailConfirmDialog] = useState(false);
  const [openPasswordConfirmDialog, setOpenPasswordConfirmDialog] =
    useState(false);

  const formName = useForm<z.infer<typeof nameSchema>>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      name: user?.user_metadata.full_name || "",
    },
  });

  const formEmail = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: user?.email || "",
    },
  });

  const formPassword = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  useEffect(() => {
    formName.reset({ name: user?.user_metadata.full_name || "" });
    formEmail.reset({ email: user?.email || "" });
    formPassword.reset({ password: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="flex w-full min-h-[calc(100svh-64px)] items-center justify-center py-6">
      <div className="w-full max-w-lg space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Manage your account settings here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form
              id="form-name"
              onSubmit={formName.handleSubmit(async (data) => {
                const {
                  data: { user },
                  error,
                } = await supabase.auth.updateUser({
                  data: {
                    full_name: data.name,
                  },
                });
                if (error) {
                  formName.setError("name", { message: error.message });
                  throw error;
                }
                setUser(user);
                toast("Success", {
                  description: "Name updated successfully.",
                });
              })}
            >
              <FieldGroup>
                <Controller
                  name="name"
                  control={formName.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="name">Name</FieldLabel>
                      <div className="flex md:items-center gap-3 flex-col md:flex-row items-end">
                        <Input
                          {...field}
                          autoFocus
                          id="name"
                          aria-invalid={fieldState.invalid}
                          disabled={formName.formState.isSubmitting}
                          required
                        />
                        <Button
                          type="submit"
                          form="form-name"
                          variant={
                            formName.formState.isSubmitting ||
                            !formName.formState.isDirty
                              ? "outline"
                              : "default"
                          }
                          disabled={
                            formName.formState.isSubmitting ||
                            !formName.formState.isDirty
                          }
                        >
                          {formName.formState.isSubmitting ? (
                            <ReloadIcon className="animate-spin" />
                          ) : (
                            <></>
                          )}
                          Update Name
                        </Button>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
            <form
              id="form-email"
              onSubmit={formEmail.handleSubmit(async (data) => {
                if (!openEmailConfirmDialog) {
                  setOpenEmailConfirmDialog(true);
                  return;
                }
                const { error } = await supabase.auth.updateUser({
                  email: data.email,
                });
                setOpenEmailConfirmDialog(false);
                if (error) {
                  formEmail.setError("email", { message: error.message });
                  throw error;
                }
                toast("Success", {
                  description:
                    "Please check your new email to verify the change.",
                });
                await supabase.auth.signOut();
                r.replace("/auth");
              })}
            >
              <FieldGroup>
                <Controller
                  name="email"
                  control={formEmail.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <div className="flex md:items-center gap-3 flex-col md:flex-row items-end">
                        <Input
                          {...field}
                          id="email"
                          aria-invalid={fieldState.invalid}
                          type="email"
                          disabled={formEmail.formState.isSubmitting}
                          required
                        />
                        <Dialog
                          open={openEmailConfirmDialog}
                          onOpenChange={setOpenEmailConfirmDialog}
                        >
                          <DialogTrigger asChild>
                            <Button
                              type="button"
                              variant={
                                formEmail.formState.isSubmitting ||
                                !formEmail.formState.isDirty ||
                                !formEmail.formState.isValid
                                  ? "outline"
                                  : "default"
                              }
                              disabled={
                                formEmail.formState.isSubmitting ||
                                !formEmail.formState.isDirty ||
                                !formEmail.formState.isValid
                              }
                            >
                              Change Email
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Email Change</DialogTitle>
                              <DialogDescription>
                                You will be signed out and need to verify your
                                new email address. Are you sure you want to
                                proceed?
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="ghost">Cancel</Button>
                              </DialogClose>
                              <Button
                                type="submit"
                                form="form-email"
                                disabled={formEmail.formState.isSubmitting}
                              >
                                {formEmail.formState.isSubmitting ? (
                                  <ReloadIcon className="animate-spin" />
                                ) : (
                                  <></>
                                )}
                                Agree
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
            <form
              id="form-password"
              onSubmit={formPassword.handleSubmit(async (data) => {
                if (!openPasswordConfirmDialog) {
                  setOpenPasswordConfirmDialog(true);
                  return;
                }
                const { error } = await supabase.auth.updateUser({
                  password: data.password,
                });
                setOpenPasswordConfirmDialog(false);
                if (error) {
                  formPassword.setError("password", { message: error.message });
                  throw error;
                }
                toast("Success", {
                  description: "Please log in again with your new password.",
                });
                await supabase.auth.signOut();
                r.replace("/auth");
              })}
            >
              <FieldGroup>
                <Controller
                  name="password"
                  control={formPassword.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <div className="flex md:items-center gap-3 flex-col md:flex-row items-end">
                        <InputPassword
                          {...field}
                          aria-invalid={fieldState.invalid}
                          disabled={formPassword.formState.isSubmitting}
                          required
                        />
                        <Dialog
                          open={openPasswordConfirmDialog}
                          onOpenChange={setOpenPasswordConfirmDialog}
                        >
                          <DialogTrigger asChild>
                            <Button
                              type="button"
                              variant={
                                formPassword.formState.isSubmitting ||
                                !formPassword.formState.isDirty ||
                                !formPassword.formState.isValid
                                  ? "outline"
                                  : "default"
                              }
                              disabled={
                                formPassword.formState.isSubmitting ||
                                !formPassword.formState.isDirty ||
                                !formPassword.formState.isValid
                              }
                            >
                              Reset Password
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Password Reset</DialogTitle>
                              <DialogDescription>
                                You will be signed out and need to log in again
                                with your new password. Are you sure you want to
                                proceed?
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="ghost">Cancel</Button>
                              </DialogClose>
                              <Button
                                type="submit"
                                form="form-password"
                                disabled={formPassword.formState.isSubmitting}
                              >
                                {formPassword.formState.isSubmitting ? (
                                  <ReloadIcon className="animate-spin" />
                                ) : (
                                  <></>
                                )}
                                Agree
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
