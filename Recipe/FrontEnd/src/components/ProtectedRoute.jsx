import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {  // Use 'children' instead of 'element'
  const { user } = useAuth(); // Access the user from context
  
  return user ? children : <Navigate to="/signup" replace />;
};

export default ProtectedRoute;
