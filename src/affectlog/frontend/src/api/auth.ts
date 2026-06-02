import { api } from "./client";

export interface UserOut {
  id: string;
  email: string;
  full_name: string;
  organization: string | null;
  is_active: boolean;
  is_superadmin: boolean;
  must_change_password: boolean;
  mfa_enabled: boolean;
  roles: string[];
  permissions: string[];
}

export interface MeResponse {
  user: UserOut;
  workspaces: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
  mfa_code?: string;
}

export const authApi = {
  login: (body: LoginRequest) => api.post<{ status: string; must_change_password: boolean; roles: string[] }>("/api/auth/login", body),
  logout: () => api.post<{ status: string }>("/api/auth/logout"),
  me: () => api.get<MeResponse>("/api/auth/me"),
  changePassword: (body: { current_password: string; new_password: string; confirm_password: string }) =>
    api.post<{ status: string }>("/api/auth/change-password", body),
};

export const publicApi = {
  register: (body: Record<string, unknown>) =>
    api.post<{ status: string; message: string }>("/api/public/register", body),
  activate: (body: { token: string; new_password: string; confirm_password: string }) =>
    api.post<{ status: string; message: string }>("/api/public/activate", body),
  requestPasswordReset: (email: string) =>
    api.post<{ status: string }>("/api/public/password-reset/request", { email }),
  confirmPasswordReset: (body: { token: string; new_password: string; confirm_password: string }) =>
    api.post<{ status: string }>("/api/public/password-reset/confirm", body),
  config: () => api.get<{ public_registration_enabled: boolean }>("/api/public/config"),
};
