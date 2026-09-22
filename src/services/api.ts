import {
  Temple,
  PriestProfile,
  Vacancy,
  Application,
  Message,
  ContributorProposal,
  AppNotification,
  AuditLog,
} from '../types';

const TOKEN_KEY = 'templeconnect_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

// Base URL support: If deployed with a separate backend URL, use VITE_API_URL, else use relative path
const API_BASE_URL = (import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '');

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (err: any) {
    // Retry once after 350ms in case the server was temporarily rebooting or busy
    await new Promise((res) => setTimeout(res, 350));
    response = await fetch(url, {
      ...options,
      headers,
    });
  }

  let data: any;
  try {
    data = await response.json();
  } catch (parseErr) {
    if (!response.ok) {
      throw new Error(`Server connection error (${response.status})`);
    }
    return {} as T;
  }

  if (!response.ok) {
    const errorMsg = data?.error || `HTTP error ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // Auth
  getDemoUsers: () => request<any[]>('/api/auth/demo-users'),
  login: (credentials: { email: string; role?: string; password?: string }) =>
    request<{ user: any; token: string; message: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  register: (payload: any) =>
    request<{ user: any; token: string; message: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getMe: () => request<{ user: any }>('/api/auth/me'),

  // Temples (Public & Search)
  getTemples: (params: {
    city?: string;
    lat?: number;
    lng?: number;
    radiusKm?: number;
    search?: string;
    deity?: string;
    sort?: string;
  } = {}) => {
    const query = new URLSearchParams();
    if (params.city) query.append('city', params.city);
    if (params.lat !== undefined) query.append('lat', params.lat.toString());
    if (params.lng !== undefined) query.append('lng', params.lng.toString());
    if (params.radiusKm) query.append('radiusKm', params.radiusKm.toString());
    if (params.search) query.append('search', params.search);
    if (params.deity) query.append('deity', params.deity);
    if (params.sort) query.append('sort', params.sort);

    return request<{
      temples: Temple[];
      total: number;
      userLocation: any;
      locationFilter?: {
        isActive: boolean;
        explanation: string;
        radiusKm?: number;
        center?: { name: string; lat: number; lng: number };
      };
    }>(
      `/api/temples?${query.toString()}`
    );
  },

  getTempleById: (id: string) => request<Temple>(`/api/temples/${id}`),

  addTemple: (payload: any) =>
    request<{ temple: Temple; duplicateWarning: any; message: string }>('/api/temples', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  claimTemple: (id: string, payload: { officialRole: string; phone: string; email: string; verificationDocs: string }) =>
    request<{ claim: any; message: string }>(`/api/temples/${id}/claim`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Admin APIs
  getMyTemple: () => request<Temple>('/api/admin/my-temple'),
  updateTemple: (templeId: string, payload: Partial<Temple>) =>
    request<{ temple: Temple; message: string }>(`/api/admin/temples/${templeId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  addEvent: (templeId: string, event: any) =>
    request<{ event: any; message: string }>(`/api/admin/temples/${templeId}/events`, {
      method: 'POST',
      body: JSON.stringify(event),
    }),
  deleteEvent: (templeId: string, eventId: string) =>
    request<{ message: string }>(`/api/admin/temples/${templeId}/events/${eventId}`, {
      method: 'DELETE',
    }),
  getTempleVacancies: (templeId: string) =>
    request<Vacancy[]>(`/api/admin/temples/${templeId}/vacancies`),
  createVacancy: (templeId: string, payload: any) =>
    request<{ vacancy: Vacancy; message: string }>(`/api/admin/temples/${templeId}/vacancies`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getTempleApplications: (templeId: string) =>
    request<Application[]>(`/api/admin/temples/${templeId}/applications`),
  updateApplicationStatus: (applicationId: string, payload: { status: string; adminNotes?: string }) =>
    request<{ application: Application; message: string }>(
      `/api/admin/applications/${applicationId}/status`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      }
    ),
  getContributors: (templeId: string) =>
    request<{ contributors: any[]; availablePriests: any[] }>(
      `/api/admin/temples/${templeId}/contributors`
    ),
  grantContributor: (templeId: string, priestUserId: string) =>
    request<{ message: string; contributors: string[] }>(
      `/api/admin/temples/${templeId}/contributors/grant`,
      {
        method: 'POST',
        body: JSON.stringify({ priestUserId }),
      }
    ),
  revokeContributor: (templeId: string, priestUserId: string) =>
    request<{ message: string; contributors: string[] }>(
      `/api/admin/temples/${templeId}/contributors/revoke`,
      {
        method: 'POST',
        body: JSON.stringify({ priestUserId }),
      }
    ),
  getTempleProposals: (templeId: string) =>
    request<ContributorProposal[]>(`/api/admin/temples/${templeId}/proposals`),
  reviewProposal: (proposalId: string, payload: { action: 'approve' | 'reject'; feedback?: string }) =>
    request<{ proposal: ContributorProposal; temple: Temple; message: string }>(
      `/api/admin/proposals/${proposalId}/review`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    ),
  getAuditLogs: (templeId: string) =>
    request<AuditLog[]>(`/api/admin/temples/${templeId}/audit-logs`),

  // Priest APIs
  getPriestProfile: () => request<PriestProfile>('/api/priests/me/profile'),
  updatePriestProfile: (payload: Partial<PriestProfile>) =>
    request<{ profile: PriestProfile; message: string }>('/api/priests/me/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  searchVacancies: (params: { skill?: string; tradition?: string; accommodation?: boolean } = {}) => {
    const q = new URLSearchParams();
    if (params.skill) q.append('skill', params.skill);
    if (params.tradition) q.append('tradition', params.tradition);
    if (params.accommodation) q.append('accommodation', 'true');
    return request<Vacancy[]>(`/api/priests/vacancies?${q.toString()}`);
  },
  applyForVacancy: (vacancyId: string, payload: { coverNote: string; availableFrom: string }) =>
    request<{ application: Application; message: string }>(
      `/api/priests/vacancies/${vacancyId}/apply`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    ),
  getMyApplications: () => request<Application[]>('/api/priests/me/applications'),
  withdrawApplication: (applicationId: string) =>
    request<{ application: Application; message: string }>(
      `/api/priests/me/applications/${applicationId}/withdraw`,
      {
        method: 'PUT',
      }
    ),
  getContributorTemples: () => request<Temple[]>('/api/priests/me/contributor-temples'),
  proposeTempleUpdate: (templeId: string, payload: { updateType: string; proposedData: any; rationale: string }) =>
    request<{ proposal: ContributorProposal; message: string }>(
      `/api/priests/temples/${templeId}/propose-update`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    ),
  getMyProposals: () => request<ContributorProposal[]>('/api/priests/me/proposals'),

  // Messages
  getMessages: () => request<Message[]>('/api/messages'),
  sendMessage: (payload: { recipientId: string; content: string; templeId?: string; applicationId?: string }) =>
    request<Message>('/api/messages', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Notifications
  getNotifications: () => request<AppNotification[]>('/api/notifications'),
  markNotificationRead: (id: string) =>
    request<{ success: boolean }>(`/api/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () =>
    request<{ success: boolean }>('/api/notifications/read-all', { method: 'PUT' }),

  // AI Features
  aiTempleSearch: (query: string, userLat?: number, userLng?: number) =>
    request<{
      matchedTempleIds: string[];
      explanation: string;
      extractedCriteria: any;
      temples: Temple[];
    }>('/api/ai/temple-search', {
      method: 'POST',
      body: JSON.stringify({ query, lat: userLat, lng: userLng }),
    }),

  aiMatchPriest: (vacancyId: string, priestId: string) =>
    request<{
      matchScore: number;
      strengths: string[];
      gaps: string[];
      summary: string;
      recommendation: string;
    }>('/api/ai/match-priest', {
      method: 'POST',
      body: JSON.stringify({ vacancyId, priestId }),
    }),

  aiDetectDuplicate: (payload: { name: string; deity?: string; city: string; address?: string }) =>
    request<{
      isDuplicateLikely: boolean;
      confidence: number;
      existingTempleMatch?: any;
      warningMessage?: string;
    }>('/api/ai/detect-duplicate', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  aiAskTempleAssistant: (templeId: string, question: string) =>
    request<{ answer: string }>('/api/ai/temple-assistant', {
      method: 'POST',
      body: JSON.stringify({ templeId, question }),
    }),
};
