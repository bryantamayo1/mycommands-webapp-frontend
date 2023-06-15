import { createContext } from 'react';
import { GeneralProps } from '../interfaces/General';
import { loginInputs } from '../interfaces/Login';
import { useState } from 'react';
import { ServicesLogin } from '../services/ServicesLogin';
import { SessionStorage } from '../utils/SessionStorage';

type AuthState = {
  status: "checking" | "not-authenticated" | "authenticated" | "error",
  logged: boolean,
  errorMessage?: string
}

type AuthContextProps = AuthState & {
  login: (values: loginInputs) => void,
  logout: () => void,
}

const AuthStateInitial:AuthState = {
  status: "not-authenticated",
  logged: false
};

export const AuthContext = createContext({} as AuthContextProps);

/**
 * Context to authentication
 */
export const AuthProvider = ( {children}: GeneralProps ) => {
  ////////
  // Hooks
  ////////
  const [authState, setAuthState] = useState(AuthStateInitial);

  const login = async(values: loginInputs) => {
    // Active spinner
    setAuthState(({ status: "checking", logged: false}));
    try{
      delete values.rememberMe;
      const data = await ServicesLogin(values);
      SessionStorage.setItem("user", data.data);
      setAuthState(({ status: "authenticated", logged: true}));
    }catch(error){
      // @ts-ignore
      if(error.status === "fail" || error.status === "error"){
        // @ts-ignore
        setAuthState(({ status: "error", logged: false, errorMessage: error.message}));
      }else{
        setAuthState(({ status: "error", logged: false, errorMessage: "Ha habido un error, vuelvalo a intentar más tarde"}));
      }
    }
  }

  const logout = () => {

  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout
      }}
    >
        {children}
    </AuthContext.Provider>
  )
}
