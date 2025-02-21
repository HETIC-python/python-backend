import { jwtDecode } from "jwt-decode";

export function isUserAdmin() {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = jwtDecode(token || "");
    console.log(decoded);
    return decoded.role === "admin";
  }
  return false;
}
