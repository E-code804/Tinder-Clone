import SignUpForm from "../components/SignUpForm/SignUpForm";
import "./styles.css";

const page = () => {
  return (
    <div className="signup__page">
      <h1>Create an account</h1>
      <p>Enter your information to get started</p>

      <SignUpForm />
    </div>
  );
};

export default page;
