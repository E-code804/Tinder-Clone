"use client";
import { login } from "@/app/auth/actions";
import { useUser } from "@/app/hooks/useUserContext";
import { jwtDecode } from "jwt-decode";
import { Types } from "mongoose";
import { useActionState, useEffect } from "react";

const LoginForm = () => {
  const [state, action, pending] = useActionState(login, undefined);
  const { dispatch: userDispatch } = useUser();

  const getCookie = (name: string): string | undefined => {
    console.log(`Document.cookie: ${document.cookie}`);

    const cookies = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`));
    if (!cookies) return undefined;

    try {
      // Decode the JWT and extract the userId
      const token = cookies.split("=")[1];
      console.log(`Token: ${token}`);
      const decoded = jwtDecode<{ userId: string }>(token);
      return decoded.userId;
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      return undefined;
    }
  };

  useEffect(() => {
    const userId = getCookie("session");
    console.log("User ID from cookie:", userId);
    if (state?.redirectTo) {
      console.log(state.id);

      const userId = new Types.ObjectId(state.id);
      userDispatch({ type: "SET_USERID", payload: { userId } });
      //window.location.href = state.redirectTo;
    }
  }, [state]);

  return (
    <form className="forms__form" action={action}>
      <label htmlFor="email">Email</label>
      <input
        type="email"
        name="email"
        placeholder="Enter your email address"
        value={"signup@signup.com"}
      />
      {state?.errors?.email && (
        <p className="error__message">{state.errors.email}</p>
      )}

      <label htmlFor="password">Password</label>
      <input
        type="password"
        name="password"
        placeholder="Enter password"
        value={"Signup2020@"}
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
