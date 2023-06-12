import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'

export const ProtectedAnyRoute = () => {
    ////////
    // Hooks
    ////////
    // const {logged} = useContext(AuthContext);

    if(true) {
        return <Navigate to ="/login"/>
    }else{
        return <Navigate to ="/dashboard"/>
    }
}
