import "../components/css/Register.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [user, setUser] = useState({});
  const [error, setError] = useState();
  const Navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${API_URL}/api/users/register`;
      const result = await axios.post(url, user);
      setError("Data saved successfully");
      Navigate("/login");
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="App-Register-Row">
      <form onSubmit={handleSubmit}>
        <h2>Registration Form</h2>
        {error && <p>{error}</p>}
        <input
          type="text"
          onChange={(e) => setUser({ ...user, firstName: e.target.value })}
          placeholder="Enter First Name"
          required
        />
        <input
          type="text"
          placeholder="Enter Last Name"
          onChange={(e) => setUser({ ...user, lastName: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Enter Email Address"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Enter Password"
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          required
        />
        <button type="submit">Submit</button>
        <hr />
        <Link to="/login">Already a member? Login Here...</Link>
      </form>
    </div>
  );
}
