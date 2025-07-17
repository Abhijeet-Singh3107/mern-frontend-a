import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../components/css/Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState();
  const frmRef = useRef();
  const [form, setForm] = useState({
    productName: "",
    description: "",
    price: "",
    imgUrl: "",
  });
  const [page, setPage] = useState(1);
  const [searchVal, setSearchVal] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);
  const [editId, setEditId] = useState();
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchProducts = async () => {
    try {
      setError("Loading...");
      const url = `${API_URL}/api/products/?page=${page}&limit=${limit}&search=${searchVal}`;
      const result = await axios.get(url);
      setProducts(result.data.products);
      setTotalPages(result.data.total);
      setError("");
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleDelete = async (id) => {
    try {
      const url = `${API_URL}/api/products/${id}`;
      await axios.delete(url);
      setError("Product deleted successfully");
      fetchProducts();
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
      const url = `${API_URL}/api/products`;
      await axios.post(url, form);
      setError("Product added successfully");
      fetchProducts();
      resetForm();
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setForm({
      productName: product.productName,
      description: product.description,
      price: product.price,
      imgUrl: product.imgUrl,
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
      const url = `${API_URL}/api/products/${editId}`;
      await axios.patch(url, form);
      fetchProducts();
      setEditId();
      resetForm();
      setError("Product updated successfully");
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
      productName: "",
      description: "",
      price: "",
      imgUrl: "",
    });
  };

  return (
    <div className="products-management-container">
      <h2>Product Management</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="form-wrapper">
        <form ref={frmRef}>
          <input
            name="productName"
            value={form.productName}
            type="text"
            placeholder="Product Name"
            onChange={handleChange}
            required
          />
          <input
            name="description"
            value={form.description}
            type="text"
            placeholder="Description"
            onChange={handleChange}
            required
          />
          <input
            name="price"
            value={form.price}
            type="text"
            placeholder="Price"
            onChange={handleChange}
            required
          />
          <input
            name="imgUrl"
            value={form.imgUrl}
            type="text"
            placeholder="Image URL"
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
          placeholder="Search products"
          onChange={(e) => setSearchVal(e.target.value)}
        />
        <button onClick={fetchProducts}>Search</button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.productName}</td>
                <td>{product.description}</td>
                <td>${product.price}</td>
                <td>
                  <img src={product.imgUrl} alt={product.productName} style={{ width: "60px" }} />
                </td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => handleEdit(product)}>Edit</button>
                    <button onClick={() => handleDelete(product._id)} className="delete-btn">Delete</button>
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
