import React from "react";
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
} from "react-router-dom";

// Import modules/pages under this line
import LandingPage from "./components/landingpage/LandingPage";
import SignUp from "./components/signup/signUp";
import LogIn from "./components/login/logIn";

// Import layouts under this line
import PublicLayout from "./components/layout/PublicLayout";

// Import Testing Routes here
import TestTypo from "./components/testing/testTypo";
import TestLayout from "./components/testing/testLayout";
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

const Routes: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/logIn" element={<LogIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<CaptainProfile />} />
          <Route path="/start-new-term" element={<InsertTermPage />} />
          <Route path="/edit-term" element={<UpdateTermPage />} />
          <Route path="/add-sector" element={<InsertSector />} />
          <Route path="/assign-captain" element={<AssignCaptainPage />} />
          <Route path="/add-scout" element={<InsertScoutPage />} />
          <Route path="/update-scout" element={<UpdateScoutPage />} />
          <Route path="/cancel-week" element={<CancelWeek />} />
          <Route path="/send-notification" element={<SendNotificationPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/record-scouts-absence" element={<ScoutsAttendance />} />
          <Route
            path="/record-captains-absence"
            element={<CaptainsAttendance />}
          />
          <Route path="/finance" element={<MoneyPage />} />
          <Route path="/edit-password" element={<EditPassword />} />
          <Route path="/activities" element={<ActivityPage />} />
          <Route path="/add-activity" element={<AddActivityPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Route>

        {/* Testing Routes */}
        {/* FIXME: Delete test routes Later */}
        <Route path="/test/typo" element={<TestTypo />} />
        <Route path="/test/layout" element={<TestLayout />} />

        {/* Not Found */}
        <Route path="*" element={<h1>Not Found</h1>} />
      </Switch>
    </Router>
  );
};

export default Routes;
