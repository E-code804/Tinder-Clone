import LoginForm from "@/app/components/Forms/LoginForm/LoginForm";
import "@/app/components/Forms/styles.css";
import React from "react";

const page = () => {
  return (
    <div className="forms__page">
      <h1>Login</h1>
      <LoginForm />
    </div>
  );
};

export default page;
