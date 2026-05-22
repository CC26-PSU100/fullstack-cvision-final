import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import DashboardPage from "@/pages/DashboardPage";
import HistoryPage from "@/pages/HistoryPage";
import ResultPage from "@/pages/ResultPage";
import SettingsPage from "@/pages/SettingsPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/context/SidebarContext";

function App() {
  return (
    <SidebarProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<AppShell />}>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/analysis/:id" element={<ResultPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
        <Toaster position="bottom-right" />
      </BrowserRouter>
    </SidebarProvider>
  );
}

export default App;