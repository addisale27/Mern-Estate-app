import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
function Signin() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        throw new Error(data.message);
      }

      setError(null);
      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-3">
      <h1 className="font-semibold text-center my-7 text-3xl"> Sign in </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="email"
          id="email"
          className="p-3 border rounded-xl "
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="p-3 border rounded-xl "
          onChange={handleChange}
        />
        <button className="bg-slate-700 p-3 uppercase hover: opacity-95 rounded-xl text-white disabled:opacity-80">
          {loading ? `loading` : `sign in`}
        </button>
      </form>
      <p className="mt-5">
        Don`t have an account?{" "}
        <span className="text-blue-700">
          <Link to="/sign-up">Sign Up</Link>
        </span>
      </p>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}

export default Signin;
