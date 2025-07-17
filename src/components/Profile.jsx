import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../App";
import { useNavigate } from "react-router-dom";
import "../components/css/Profile.css";

export default function Profile() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const { user, setUser } = useContext(AppContext);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const url = `${API_URL}/api/users/${user.id}/profile`;
      const result = await axios.get(url);
      setProfile(result.data);
    } catch (err) {
      console.log(err);
      setError("Something went wrong while fetching profile.");
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    } else {
      navigate("/login");
    }
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const url = `${API_URL}/api/users/${user.id}`;
      const result = await axios.patch(url, profile);
      setMessage("Profile updated successfully.");
    } catch (err) {
      console.log(err);
      setError("Something went wrong while updating.");
    }
  };

  const logout = () => {
    setProfile({});
    setUser({});
    localStorage.clear(); // optional if using token storage
    navigate("/login");
  };

  return (
    <div className="profile-container">
      <h3>My Profile</h3>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>

      <p>
        <input
          type="text"
          name="firstName"
          value={profile.firstName}
          onChange={handleChange}
          placeholder="First Name"
        />
      </p>
      <p>
        <input
          type="text"
          name="lastName"
          value={profile.lastName}
          onChange={handleChange}
          placeholder="Last Name"
        />
      </p>
      <p>
        <input
          type="text"
          name="email"
          value={profile.email}
          onChange={handleChange}
          placeholder="Email"
        />
      </p>
      <p>
        <input
          type="password"
          name="password"
          value={profile.password}
          onChange={handleChange}
          placeholder="Password"
        />
      </p>

      <button onClick={handleUpdate}>Update Profile</button>
    </div>
  );
}
