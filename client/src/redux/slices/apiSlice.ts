import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_URL as string;

const baseQuery = fetchBaseQuery({ baseUrl, credentials: "include" });

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
    "Alert",
    "Activities",
  ],
  endpoints: () => ({}),
});
