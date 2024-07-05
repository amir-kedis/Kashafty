import { apiSlice } from "./apiSlice";

const USERS_API = "/api/auth";

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: `${USERS_API}/login`,
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
      invalidatesTags: ["auth"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_API}/logout`,
        method: "POST",
        credentials: "include",
      }),
    }),
    signup: builder.mutation({
      query: (data) => ({
        url: `${USERS_API}/signUp`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Captains", "auth"],
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_API}/newPassword`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useSignupMutation,
  useChangePasswordMutation,
} = usersApi;
