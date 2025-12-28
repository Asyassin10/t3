import { getStateData } from "@/axios/AbstractionsApi/Abstraction";
import { Navigate } from "react-router-dom";

const AuthProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = getStateData();


  return token ? children : <Navigate to="/auth/signing" replace />;
};

export default AuthProtectedRoute;
