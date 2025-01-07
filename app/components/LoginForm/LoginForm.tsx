import React from "react";

const LoginForm = () => {
  //const [username, setUsername] = useState
  return (
    <form className="login__form">
      <input type="text" name="username" id="username" required />
      <input type="email" name="email" id="email" required />
      <input type="password" name="password" id="password" required />

      <button type="submit">Log in</button>
    </form>
  );
};

export default LoginForm;
