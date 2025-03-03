import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/charts/styles.css";

import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { useAuth } from "./context/AuthProvider";
import MainLayout from "./Layouts/MainLayout";
import { ForgotPasswordPage } from "./pages/Auth/ForgotPassword.page";
import { LoginPage } from "./pages/Auth/Login.page";
import { ProfilePage } from "./pages/Auth/ProfilePage";
import { RegisterPage } from "./pages/Auth/Register.page";
import { ResetPasswordPage } from "./pages/Auth/ResetPassword.page";
import { DashboardPage } from "./pages/Dashboard.page";
import { TodosPage } from "./pages/Todos.page";
import { theme } from "./theme";

export default function App() {
  const { isAuthenticated, loading } = useAuth();
  return (
    <MantineProvider theme={theme}>
      <Notifications />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginPage />
              )
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated && !loading ? (
                <Navigate to="/dashboard" />
              ) : (
                <RegisterPage />
              )
            }
          />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/__/auth/action" element={<ResetPasswordPage />} />
          <Route
            path=""
            element={
              <ProtectedRoutes>
                <MainLayout />
              </ProtectedRoutes>
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="todos" element={<TodosPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}
