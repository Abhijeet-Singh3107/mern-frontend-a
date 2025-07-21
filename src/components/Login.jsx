import "../components/CSS/Login.css";
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../App";

export default function Login() {
  const { user, setUser } = useContext(AppContext);
  const [error, setError] = useState();
  const Navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   let msg = "";
  //   try {
  //     const url = `${API_URL}/api/users/login`;
  //     const result = await axios.post(url, user);
  //     msg = result.data.message || "Login successful";
  //     // console.log(result.data.response.data.message);
  //     setUser(result.data);
  //     setError(msg);
  //     Navigate("/");
  //   } catch (err) {
  //     console.log(err);
  //     // setError("Invalid Credentials");
  //     setError(msg);

  //   }
  // };
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const url = `${API_URL}/api/users/login`;
    const result = await axios.post(url, user);
    const msg = result.data.message || "Login successful";
    setUser(result.data); 
    setError(""); 
    Navigate("/"); 
  } catch (err) {    
    const msg =
      err.response?.data?.message || "Login failed. Please try again.";      
    setError(msg); 
  }
};


  return (
    <div className="App-Login-Row">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p>{error}</p>}
        <input
          type="email"
          placeholder="Email Address"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          required
        />
        <button type="submit">Submit</button>
        <hr />
        <Link to="/register">Create Account</Link>
      </form>
    </div>
  );
}
