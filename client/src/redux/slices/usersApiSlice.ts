import { apiSlice } from "./apiSlice";

const USERS_API = "/api/auth";

interface LoginRequestBody {
  emailOrMobile: string;
  password: string;
}

interface LoginResponseBody {
  message: string;
  body: {
    captainId: number;
    firstName: string;
    middleName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    rSectorBaseName: string;
    rSectorSuffixName: string;
    gender: string;
    type: string;
  };
  token: string;
  expiresIn: string;
}

interface SignupRequestBody {
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  password: string;
  gender: "male" | "female";
}

interface SignupResponseBody {
  message: string;
  body: {
    captainId: number;
    firstName: string;
    middleName: string;
    lastName: string;
    phoneNumber: string;
    email: string | null;
    password: string;
    rSectorBaseName: string | null;
    rSectorSuffixName: string | null;
    gender: "male" | "female";
    type: string;
  };
  token: string;
  expiresIn: string;
}

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponseBody, LoginRequestBody>({
      query: (credentials) => ({
        url: `${USERS_API}/login`,
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
      invalidatesTags: ["Auth"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${USERS_API}/logout`,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["Auth"],
    }),

    signup: builder.mutation<SignupResponseBody, SignupRequestBody>({
      query: (data) => ({
        url: `${USERS_API}/signUp`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Captains", "Auth"],
    }),

    validToken: builder.query({
      query: () => ({
        url: `${USERS_API}/me`,
        method: "GET",
        credentials: "include",
      }),
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
  useValidTokenQuery,
  useChangePasswordMutation,
} = usersApi;
