"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { changePasswordAction, type ActionState } from "@/app/admin/actions";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth-constants";
import { EyeIcon, EyeOffIcon } from "./icons";
import { FormField } from "./form-field";
import { AdminSection } from "./section";
import { buttonPrimary, cn, inputClass } from "./ui";

function PasswordInput({
  id,
  name,
  autoComplete,
  placeholder,
}: {
  id: string;
  name: string;
  autoComplete: string;
  placeholder: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        required
        className={cn(inputClass, "pr-12")}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted transition-colors hover:text-ink"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(buttonPrimary, "px-5")}
    >
      {pending ? "Updating…" : "Update password"}
    </button>
  );
}

export function PasswordForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(
    changePasswordAction,
    null
  );
  const formRef = useRef<HTMLFormElement>(null);
  const errors = state?.fieldErrors ?? {};

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state?.success]);

  return (
    <AdminSection
      title="Admin password"
      description="Change the password used to sign in to this dashboard. Use at least eight characters; other signed-in sessions are signed out when it changes."
    >
      <form ref={formRef} action={formAction} className="space-y-4">
        {state?.error && (
          <p
            role="alert"
            className="rounded-lg border border-alert/30 bg-alert/10 px-4 py-3 text-sm text-alert"
          >
            {state.error}
          </p>
        )}
        {state?.success && (
          <p
            role="status"
            className="rounded-lg border border-jade/30 bg-jade/10 px-4 py-3 text-sm text-jade"
          >
            {state.success}
          </p>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            label="Current password"
            htmlFor="currentPassword"
            error={errors.currentPassword}
          >
            <PasswordInput
              id="currentPassword"
              name="currentPassword"
              autoComplete="current-password"
              placeholder="Current password"
            />
          </FormField>

          <FormField
            label="New password"
            htmlFor="newPassword"
            error={errors.newPassword}
            hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
          >
            <PasswordInput
              id="newPassword"
              name="newPassword"
              autoComplete="new-password"
              placeholder="New password"
            />
          </FormField>

          <FormField
            label="Confirm new password"
            htmlFor="confirmPassword"
            error={errors.confirmPassword}
          >
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Repeat new password"
            />
          </FormField>
        </div>

        <div className="flex justify-end">
          <SaveButton />
        </div>
      </form>
    </AdminSection>
  );
}
