import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedPage } from "./ProtectedPage";
import { HomePage } from "../components/HomePage/HomePage";
import { ProtectedAnyRoute } from "./ProtectedAnyRoute";
import { ProtectedRoute } from "./ProtectedRoute";
import { AppPage } from "../components/AppPage";
import { CategoriesPage } from "../components/CategoriesPage/CategoriesPage";
import { UserPage } from "../components/UserPage/UserPage";
import { CommandsPage } from "../components/CommandsPage/CommandsPage";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Not logged */}
        <Route path="/login" element={<ProtectedPage/>}/>
        <Route path="/" element={<ProtectedAnyRoute/>}/>

        {/* Logged */}
        <Route element={<AppPage/>}>
          <Route path="/home" element={<ProtectedRoute><HomePage/></ProtectedRoute>}/>
          <Route path="/categories" element={<ProtectedRoute><CategoriesPage/></ProtectedRoute>}/>
          <Route path="/commands" element={<ProtectedRoute><CommandsPage/></ProtectedRoute>}/>
          <Route path="/user" element={<ProtectedRoute><UserPage/></ProtectedRoute>}/>
        </Route>
        
        {/* Any route */}
        <Route path="*" element={<ProtectedAnyRoute/>}/>
        
      </Routes>
    </BrowserRouter>
  );
}