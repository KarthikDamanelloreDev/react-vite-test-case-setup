import { useState } from "react";
import styles from "./styles.module.css";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      // Extract name from email for demo purposes
      const name = email.split("@")[0];
      onLogin({ email, name });
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Login</h2>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={errors.email ? styles.errorInput : ""}
        />
        {errors.email && (
          <span className={styles.errorText}>{errors.email}</span>
        )}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={errors.password ? styles.errorInput : ""}
        />
        {errors.password && (
          <span className={styles.errorText}>{errors.password}</span>
        )}

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
