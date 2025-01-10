"use client";
import { login } from "@/app/auth/actions";
import { useActionState, useEffect } from "react";

const LoginForm = () => {
  const [state, action, pending] = useActionState(login, undefined);

  useEffect(() => {
    if (state?.redirectTo) {
      window.location.href = state.redirectTo;
    }
  }, [state]);

  return (
    <form className="forms__form" action={action}>
      <label htmlFor="email">Email</label>
      <input
        type="email"
        name="email"
        placeholder="Enter your email address"
        // value={"signup@signup.com"}
      />
      {state?.errors?.email && (
        <p className="error__message">{state.errors.email}</p>
      )}

      <label htmlFor="password">Password</label>
      <input
        type="password"
        name="password"
        placeholder="Enter password"
        // value={"Signup2020@"}
      />
      {state?.errors?.password && (
        <p className="error__message">{state.errors.password}</p>
      )}

      <button type="submit" disabled={pending}>
        {pending ? "Submitting..." : "Login"}
      </button>
      {state?.errors?.message && (
        <p className="error__message">{state.errors.message}</p>
      )}
    </form>
  );
};

export default LoginForm;
