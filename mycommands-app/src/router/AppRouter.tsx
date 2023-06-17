import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedPage } from "./ProtectedPage";
import { DashboardPage } from "../components/DashboardPage";
import { ProtectedAnyRoute } from "./ProtectedAnyRoute";
import { ProtectedRoute } from "./ProtectedRoute";
import { ContentPage } from "../components/ContentPage";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Not logged */}
        <Route path="/login" element={<ProtectedPage/>}/>
        <Route path="/" element={<ProtectedAnyRoute/>}/>

        {/* Logged */}
        <Route element={<ContentPage/>}>
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage/></ProtectedRoute>}/>
        </Route>

        {/* Any route */}
        <Route path="*" element={<ProtectedAnyRoute/>}/>
        
      </Routes>
    </BrowserRouter>
  );
}