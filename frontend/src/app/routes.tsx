import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { HomePage } from "./pages/HomePage";
import { SearchResultsPage } from "./pages/SearchResultsPage";
import { DoctorProfilePage } from "./pages/DoctorProfilePage";
import { ChatPage } from "./pages/ChatPage";
import { AppointmentPage } from "./pages/AppointmentPage";
import { PatientDashboard } from "./pages/PatientDashboard";
import { DoctorDashboard } from "./pages/DoctorDashboard";
import { AdminPanel } from "./pages/AdminPanel";
import { AuthPage } from "./pages/AuthPage";
import { NotificationsPage } from "./pages/NotificationsPage";

export const router = createBrowserRouter([
  {
    path: "/auth",
    Component: AuthPage,
  },
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "search", Component: SearchResultsPage },
      { path: "doctor/:id", Component: DoctorProfilePage },
      { path: "chat/:doctorId", Component: ChatPage },
      { path: "appointment/:doctorId", Component: AppointmentPage },
      { path: "patient/dashboard", Component: PatientDashboard },
      { path: "doctor/dashboard", Component: DoctorDashboard },
      { path: "admin", Component: AdminPanel },
      { path: "notifications", Component: NotificationsPage },
    ],
  },
]);
