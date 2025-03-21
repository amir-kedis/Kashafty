import React from "react";
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
} from "react-router-dom";

import RequireAuth from "@auth-kit/react-router/RequireAuth";

// Import layouts under this line
import PublicLayout from "./components/layout/PublicLayout";

// Import modules/pages under this line
import LandingPage from "./components/landingpage/LandingPage";
import SignUp from "./components/signup/signUp";
import LogIn from "./components/login/logIn";
import Dashboard from "./components/dashboard/Dashboard";
import CaptainProfile from "./components/captain-profile/CaptainProfile";
import InsertTermPage from "./components/insert-term/InsertTermPage";
import UpdateTermPage from "./components/update-term-page/UpdateTermPage";
import InsertSector from "./components/insert-sector/InsertSector";
import AssignCaptainPage from "./components/assign-captain-page/AssignCaptainPage";
import InsertScoutPage from "./components/insert-scout/InsertScoutPage";
import UpdateScoutPage from "./components/update-scout/UpdateScoutPage";
import SendNotificationPage from "./components/send-notification/sendNotificationPage";
import NotificationsPage from "./components/notifications/notificationPage";
import ScoutsAttendance from "./components/scouts-attendance/ScoutsAttendance";
import MoneyPage from "./components/moneypage/MoneyPage";
import CaptainsAttendance from "./components/captains-attendance/CaptainAttendance";
import EditPassword from "./components/edit-password/EditPassword";
import CancelWeek from "./components/cancel-week/CancelWeek";
import ActivityPage from "./components/activitypage/ActivityPage";
import AddActivityPage from "./components/addactivitypage/AddActivityPage";
import StatsPage from "./components/stats-page/StatsPage";
import ErrorBoundary from "./components/atoms/ErrorBoundary";
import CaptainAttendancePage from "./pages/CaptainAttendancePage";
import DeleteScoutPage from "./pages/DeleteScoutPage";

const Routes: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <Switch>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/logIn" element={<LogIn />} />

            <Route
              path="/dashboard"
              element={
                <RequireAuth fallbackPath="/logIn">
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/profile"
              element={
                <RequireAuth fallbackPath="/logIn">
                  <CaptainProfile />
                </RequireAuth>
              }
            />

            <Route
              path="/delete-scout"
              element={
                <RequireAuth fallbackPath="/logIn">
                  <DeleteScoutPage />
                </RequireAuth>
              }
            />

            <Route
              path="/start-new-term"
              element={
                <RequireAuth fallbackPath="/logIn">
                  <InsertTermPage />
                </RequireAuth>
              }
            />

            <Route
              path="/edit-term"
              element={
                <RequireAuth fallbackPath="/logIn">
                  <UpdateTermPage />
                </RequireAuth>
              }
            />

            <Route
              path="/add-sector"
              element={
                <RequireAuth fallbackPath="/logIn">
                  <InsertSector />
                </RequireAuth>
              }
            />
            <Route
              path="/assign-captain"
              element={
                <RequireAuth fallbackPath="/logIn">
                  <AssignCaptainPage />
                </RequireAuth>
              }
            />

            <Route
              path="/add-scout"
              element={
                <RequireAuth fallbackPath="/logIn">
                  <InsertScoutPage />
                </RequireAuth>
              }
            />
            <Route
              path="/update-scout"
              element={
                <RequireAuth fallbackPath="/logIn">
                  <UpdateScoutPage />
                </RequireAuth>
              }
            />

            <Route
              path="/cancel-week"
              element={
                <RequireAuth fallbackPath="/logIn">
                  <CancelWeek />
                </RequireAuth>
              }
            />

            <Route
              path="/send-notification"
              element={
                <RequireAuth fallbackPath="/logIn">
                  <SendNotificationPage />
                </RequireAuth>
              }
            />

            <Route
              path="/notifications"
              element={
                <RequireAuth fallbackPath="/logIn">
                  <NotificationsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/record-scouts-absence"
              element={
                <RequireAuth fallbackPath="/logIn">
                  <ScoutsAttendance />
                </RequireAuth>
              }
            />
            <Route
              path="/record-captains-absence"
              element={
                <RequireAuth fallbackPath="/logIn">
                  <CaptainAttendancePage />
                </RequireAuth>
              }
            />
            <Route
              path="/finance"
              element={
                <RequireAuth fallbackPath="/logIn">
                  <MoneyPage />
                </RequireAuth>
              }
            />

            <Route
              path="/edit-password"
              element={
                <RequireAuth fallbackPath="/logIn">
                  <EditPassword />
                </RequireAuth>
              }
            />
            <Route
              path="/activities"
              element={
                <RequireAuth fallbackPath="/logIn">
                  <ActivityPage />
                </RequireAuth>
              }
            />

            <Route
              path="/add-activity"
              element={
                <RequireAuth fallbackPath="/logIn">
                  <AddActivityPage />
                </RequireAuth>
              }
            />
            <Route
              path="/stats"
              element={
                <RequireAuth fallbackPath="/logIn">
                  <StatsPage />
                </RequireAuth>
              }
            />
          </Route>

          {/* Not Found */}
          <Route path="*" element={<h1>Not Found</h1>} />
        </Switch>
      </Router>
    </ErrorBoundary>
  );
};

export default Routes;
