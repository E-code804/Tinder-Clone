"use client";
import { signup } from "@/app/auth/actions";
import { useActionState, useEffect } from "react";

const SignUpForm = () => {
  const [state, action, pending] = useActionState(signup, undefined);

  useEffect(() => {
    if (state?.redirectTo) {
      window.location.href = state.redirectTo;
    }
  }, [state]);

  return (
    <form className="signup__form" action={action}>
      <label htmlFor="name">Name</label>
      <input
        type="text"
        name="name"
        placeholder="Enter your name"
        value={"TestSignup"}
      />
      {state?.errors?.name && <p>{state.errors.name}</p>}

      <label htmlFor="email">Email</label>
      <input
        type="email"
        name="email"
        placeholder="Enter your email address"
        value={"signup@signup.com"}
      />
      {state?.errors?.email && <p>{state.errors.email}</p>}

      <label htmlFor="password">Password</label>
      <input
        type="password"
        name="password"
        placeholder="Create a password"
        value={"Signup2020@"}
      />
      {state?.errors?.password && <p>{state.errors.password}</p>}

      <label htmlFor="image">Profile Picture</label>
      <input type="file" name="image" accept="image/png, image/jpeg" />
      {state?.errors?.image && <p>{state.errors.image}</p>}

      <button type="submit" disabled={pending}>
        {pending ? "Submitting..." : "Sign Up"}
      </button>
      {state?.errors?.message && <p>{state.errors.message}</p>}
    </form>
  );
};

export default SignUpForm;
