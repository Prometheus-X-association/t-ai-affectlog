import { api } from "./client";

export interface PendingRegistration {
  id: string;
  full_name: string;
  email: string;
  organization: string | null;
  role_description: string | null;
  requested_access_profile: string | null;
  reason_for_access: string | null;
  status: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  organization: string | null;
  is_active: boolean;
  is_superadmin: boolean;
  must_change_password: boolean;
  mfa_enabled: boolean;
  failed_login_count: number;
  last_login_at: string | null;
  created_at: string;
  roles: string[];
}

export interface AuditLogEntry {
  id: number;
  actor_email: string | null;
  action: string;
  resource_type: string | null;
  detail: string | null;
  ip_address: string | null;
  success: boolean;
  logged_at: string;
}

export const adminApi = {
  getPendingRegistrations: (status = "pending") =>
    api.get<PendingRegistration[]>(`/api/admin/pending-registrations?status_filter=${status}`),
  approveRegistration: (id: string, body: { role_name: string; workspace_slug: string; admin_notes?: string }) =>
    api.post<{ status: string; user_id: string; dev_activation_token?: string }>(`/api/admin/pending-registrations/${id}/approve`, body),
  rejectRegistration: (id: string, body: { admin_notes?: string }) =>
    api.post<{ status: string }>(`/api/admin/pending-registrations/${id}/reject`, body),
  getUsers: () => api.get<AdminUser[]>("/api/admin/users"),
  disableUser: (id: string) => api.post<{ status: string }>(`/api/admin/users/${id}/disable`),
  resendActivation: (id: string) => api.post<{ status: string }>(`/api/admin/users/${id}/resend-activation`),
  assignRoles: (id: string, role_names: string[]) =>
    api.patch<{ status: string }>(`/api/admin/users/${id}/roles`, { role_names }),
  getAuditLog: (limit = 100) => api.get<AuditLogEntry[]>(`/api/admin/audit-log?limit=${limit}`),
  getSystemHealth: () => api.get<{ status: string; version: string; users: number; pending_registrations: number }>("/api/admin/system/health"),
};
