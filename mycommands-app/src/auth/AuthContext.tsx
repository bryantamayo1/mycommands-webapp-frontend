import React from 'react'
import { createContext } from 'vm'

export const AuthContext = createContext({} as any);

export const AuthProvider:React.FC<any> = ( {children} ) => {
  return (
    <AuthContext.Provider
        value={{
            logged: false
        }}
    >
        {{children}}
    </AuthContext.Provider>
  )
}
