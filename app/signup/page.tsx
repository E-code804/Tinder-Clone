import SignUpForm from "@/app/components/Forms/SignUpForm/SignUpForm";
import "@/app/components/Forms/styles.css";

const page = () => {
  return (
    <div className="forms__page">
      <h1>Create an account</h1>
      <p>Enter your information to get started</p>

      <SignUpForm />
    </div>
  );
};

export default page;
