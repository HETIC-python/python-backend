import { jwtDecode } from "jwt-decode";

export function isUserAdmin(){
    const token = localStorage.getItem("token")
    const decoded = jwtDecode(token || "");
    console.log(decoded)
    return decoded.role === "admin" && decoded?.is_admin === true
}