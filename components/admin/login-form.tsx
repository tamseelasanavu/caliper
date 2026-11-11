"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, type ActionState } from "@/app/admin/actions";
import { EyeIcon, EyeOffIcon } from "./icons";
import { buttonPrimary, cn, inputClass, labelClass } from "./ui";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={cn(buttonPrimary, "mt-2 w-full py-2.5")}
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export function LoginForm({
  showDefaultHint,
  configured = true,
}: {
  showDefaultHint: boolean;
  configured?: boolean;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    loginAction,
    null
  );
  const [visible, setVisible] = useState(false);

  return (
    <form action={formAction} className="space-y-5">
      {!configured && (
        <p
          role="alert"
          className="rounded-lg border border-alert/30 bg-alert/10 px-3.5 py-2.5 text-sm text-alert"
        >
          Admin access is not configured. Set{" "}
          <code className="text-ink">ADMIN_PASSWORD</code> in the server
          environment and restart.
        </p>
      )}

      {state?.error && (
        <p
          role="alert"
          className="rounded-lg border border-alert/30 bg-alert/10 px-3.5 py-2.5 text-sm text-alert"
        >
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={visible ? "text" : "password"}
            autoComplete="current-password"
            autoFocus={configured}
            required
            disabled={!configured}
            className={cn(inputClass, "pr-12")}
            placeholder="Enter your admin password"
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
      </div>

      <SubmitButton disabled={!configured} />

      {showDefaultHint && (
        <div className="rounded-lg border border-muted/25 bg-ground/60 px-3.5 py-3 text-xs leading-relaxed text-muted">
          No <code className="text-ink">ADMIN_PASSWORD</code> is set, so the
          temporary password is{" "}
          <code className="rounded bg-ink/10 px-1 py-0.5 text-ink">
            calliper-admin
          </code>
          . Set <code className="text-ink">ADMIN_PASSWORD</code> before going
          live.
        </div>
      )}
    </form>
  );
}
