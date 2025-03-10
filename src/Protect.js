import { Navigate } from "react-router-dom";

export const Protect = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to='/'></Navigate>
  }
  return children;
}

export const UnProtect = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to='/home'></Navigate>
  }
  return children;
}