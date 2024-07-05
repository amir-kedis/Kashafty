import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_URL;

const baseQuery = fetchBaseQuery({ baseUrl, credentials: "include" });

export const apiSlice = createApi({
  baseQuery,
  tagTypes: [
    "Scouts",
    "Terms",
    "Weeks",
    "Captains",
    "Units",
    "finance",
    "absence",
    "attendance",
    "events",
    "reports",
    "users",
    "auth",
    "sector",
    "alert",
    "activites",
  ],
  endpoints: () => ({}),
});
