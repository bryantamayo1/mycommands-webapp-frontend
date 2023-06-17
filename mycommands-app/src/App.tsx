import { AppRouter } from "./router/AppRouter";
import './App.css';
import { AuthProvider } from "./auth/AuthContext";

function App() {
  return (
    <div className="app">
      <AuthProvider>
        <AppRouter/>
      </AuthProvider>
    </div>
  );
}

export default App;
