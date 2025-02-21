import { useState, useEffect } from "react";
import { API_URL } from "../api";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import { useUser } from "../context/user";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { updateUser, isAuthenticated } = useUser();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Envoie la requête de connexion au backend
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Invalid credentials");
        return;
      }

      // Stockage du token JWT dans localStorage
      localStorage.setItem("token", data.token);
      const decoded = jwtDecode(data.token);
      updateUser(decoded);
      setError("");
      navigate("/", { replace: true });
    } catch (err) {
      setError("An error occurred during login. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold p-2 rounded-md"
            >
              Login
            </button>
            <div className="mt-2 w-full py-2 font-semibold rounded-md transition flex items-center">
              <h2 className="px-4 py-2">Don't have an account?</h2>
              <a
                href="/user/signup"
                className="underline rounded-md hover:bg-gray-300"
              >
                Sign Up
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
