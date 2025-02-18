import React, { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Placeholder for real authentication
    if (username === "admin" && password === "password123") {
      alert("Login Successful");
      setError("");
    } else {
      setError("Invalid credentials, please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-600"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
                href="/user/signUp"
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

export default App;
