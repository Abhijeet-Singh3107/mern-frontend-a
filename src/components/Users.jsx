import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../components/css/Users.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState();
  const frmRef = useRef();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });
  const [page, setPage] = useState(1);
  const [searchVal, setSearchVal] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);
  const [editId, setEditId] = useState();
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchUsers = async () => {
    try {
      setError("Loading...");
      const url = `${API_URL}/api/users/?page=${page}&limit=${limit}&search=${searchVal}`;
      const result = await axios.get(url);
      setUsers(result.data.users);
      setTotalPages(result.data.total);
      setError("");
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleDelete = async (id) => {
    try {
      const url = `${API_URL}/api/users/${id}`;
      await axios.delete(url);
      setError("User deleted successfully");
      fetchUsers();
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const frm = frmRef.current;
    if (!frm.checkValidity()) {
      frm.reportValidity();
      return;
    }
    try {
      const url = `${API_URL}/api/users`;
      await axios.post(url, form);
      setError("User added successfully");
      fetchUsers();
      resetForm();
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    }
  };

  const handleEdit = (user) => {
    setEditId(user._id);
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const frm = frmRef.current;
    if (!frm.checkValidity()) {
      frm.reportValidity();
      return;
    }
    try {
      const url = `${API_URL}/api/users/${editId}`;
      await axios.patch(url, form);
      fetchUsers();
      setEditId();
      resetForm();
      setError("User information updated successfully");
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    }
  };

  const handleCancel = () => {
    setEditId();
    resetForm();
  };

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      role: "",
    });
  };

  return (
    <div className="user-management-container">
      <h2>User Management</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="form-wrapper">
        <form ref={frmRef}>
          <input
            name="firstName"
            value={form.firstName}
            type="text"
            placeholder="First Name"
            onChange={handleChange}
            required
          />
          <input
            name="lastName"
            value={form.lastName}
            type="text"
            placeholder="Last Name"
            onChange={handleChange}
            required
          />
          <input
            name="email"
            value={form.email}
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            name="role"
            value={form.role}
            type="text"
            placeholder="Role"
            onChange={handleChange}
            required
          />
          {editId ? (
            <>
              <button onClick={handleUpdate}>Update</button>
              <button onClick={handleCancel} className="cancel-btn">Cancel</button>
            </>
          ) : (
            <button onClick={handleAdd}>Add</button>
          )}
        </form>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search users"
          onChange={(e) => setSearchVal(e.target.value)}
        />
        <button onClick={fetchUsers}>Search</button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => handleEdit(user)}>Edit</button>
                    <button onClick={() => handleDelete(user._id)} className="delete-btn">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}
