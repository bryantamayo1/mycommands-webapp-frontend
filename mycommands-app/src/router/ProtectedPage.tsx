import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { Navigate } from "react-router-dom";
import { LoginPage } from "../components/LoginPage/LoginPage";

export const ProtectedPage = () => {
  ////////
  // Hooks
  ////////
  // const {logged} = useContext(AuthContext);

  if(true){
    return <Navigate to="/dashboard"/>;
  }else{
    return <LoginPage/>
  }
}
