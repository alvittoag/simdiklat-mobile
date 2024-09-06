import { axiosService } from "../axiosService";

export default {
  getCsrfToken: async () => {
    return await axiosService.get("/api/auth/csrf");
  },
  getSession: async () => {
    return await axiosService.get("/api/auth/session");
  },
  forget_password_token: async ({
    email,
    token,
  }: {
    email: string;
    token: string;
  }) => {
    return await axiosService.post("/api/auth-rest/forget-password-token", {
      email,
      token,
    });
  },
  forget_password_verify: async ({
    email,
    token,
  }: {
    email: string;
    token: string;
  }) => {
    return await axiosService.post(
      "/api/auth-rest/verify-foget-password-token",
      {
        email,
        token,
      }
    );
  },
  forget_password_reset: async ({
    email,
    token,
    password,
  }: {
    email: string;
    token: string;
    password: string;
  }) => {
    return await axiosService.post("/api/auth-rest/reset-password", {
      email,
      token,
      password,
    });
  },
};
