import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_URL as string;

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include",
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: [
    "Scouts",
    "Terms",
    "Weeks",
    "Captains",
    "Units",
    "Finance",
    "Absence",
    "Attendance",
    "Graph",
    "Events",
    "Reports",
    "Users",
    "Auth",
    "Sector",
    "Notifications",
    "Activities",
    "AttendanceRate",
    "Money",
  ],
  endpoints: () => ({}),
});
