// API Service Layer
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  detail?: string;
}

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("access_token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    try {
      const errorData = await response.json();
      const detail = errorData?.detail;
      const errorMsg = typeof detail === 'string' 
        ? detail 
        : typeof detail === 'object' 
        ? JSON.stringify(detail)
        : `API Error: ${response.statusText}`;
      throw new Error(errorMsg);
    } catch (parseError: any) {
      // If parsing error data fails, throw generic error
      throw new Error(`API Error: ${response.statusText}`);
    }
  }

  return response.json();
}

// ============= AUTH ENDPOINTS =============
export const authAPI = {
  register: async (data: {
    full_name: string;
    email: string;
    password: string;
    phone?: string;
  }, role: string = "patient") => {
    return apiCall("/api/v1/auth/register?role=" + role, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  login: async (email: string, password: string) => {
    const response = await apiCall<{
      access_token: string;
      token_type: string;
      user: any;
    }>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    
    // Store token
    if (response.access_token) {
      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("token_type", response.token_type);
    }
    
    return response;
  },

  getCurrentUser: async () => {
    return apiCall("/api/v1/auth/me", {
      method: "GET",
    });
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
  },
};

// ============= DOCTORS ENDPOINTS =============
export const doctorsAPI = {
  getDoctors: async (filters?: {
    specialization?: string;
    city?: string;
    is_online?: boolean;
    skip?: number;
    limit?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters?.specialization)
      params.append("specialization", filters.specialization);
    if (filters?.city) params.append("city", filters.city);
    if (filters?.is_online !== undefined)
      params.append("is_online", String(filters.is_online));
    params.append("skip", String(filters?.skip || 0));
    params.append("limit", String(filters?.limit || 20));

    return apiCall(`/api/v1/doctors/?${params.toString()}`, {
      method: "GET",
    });
  },

  getDoctorById: async (doctorId: string) => {
    return apiCall(`/api/v1/doctors/${doctorId}`, {
      method: "GET",
    });
  },

  searchDoctors: async (query: string) => {
    return apiCall(`/api/v1/doctors/search?q=${encodeURIComponent(query)}`, {
      method: "GET",
    });
  },

  getDoctorSlots: async (doctorId: string) => {
    return apiCall(`/api/v1/doctors/${doctorId}/slots`, {
      method: "GET",
    });
  },
};

// ============= APPOINTMENTS ENDPOINTS =============
export const appointmentsAPI = {
  createAppointment: async (data: {
    doctor_id: string;
    appointment_date: string;
    appointment_time: string;
    appointment_type: "Online" | "Physical";
    notes?: string;
  }) => {
    return apiCall("/api/v1/appointments/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getAppointments: async () => {
    return apiCall("/api/v1/appointments/", {
      method: "GET",
    });
  },

  getAppointmentById: async (appointmentId: string) => {
    return apiCall(`/api/v1/appointments/${appointmentId}`, {
      method: "GET",
    });
  },

  updateAppointment: async (
    appointmentId: string,
    data: { status?: string; notes?: string }
  ) => {
    return apiCall(`/api/v1/appointments/${appointmentId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  cancelAppointment: async (appointmentId: string) => {
    return apiCall(`/api/v1/appointments/${appointmentId}/cancel`, {
      method: "POST",
    });
  },
};

// ============= CHAT ENDPOINTS =============
export const chatAPI = {
  sendMessage: async (data: {
    doctor_id: string;
    content: string;
  }) => {
    return apiCall("/api/v1/chat/send", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getChatHistory: async (doctorId: string) => {
    return apiCall(`/api/v1/chat/history/${doctorId}`, {
      method: "GET",
    });
  },

  getChats: async () => {
    return apiCall("/api/v1/chat/", {
      method: "GET",
    });
  },
};

// ============= ADMIN ENDPOINTS =============
export const adminAPI = {
  getStats: async () => {
    return apiCall("/api/v1/admin/stats", {
      method: "GET",
    });
  },

  verifyDoctor: async (doctorId: string) => {
    return apiCall(`/api/v1/admin/doctors/${doctorId}/verify`, {
      method: "POST",
    });
  },

  getDoctorVerificationRequests: async () => {
    return apiCall("/api/v1/admin/doctors/pending-verification", {
      method: "GET",
    });
  },
};

// ============= NOTIFICATIONS ENDPOINTS =============
export const notificationsAPI = {
  getNotifications: async () => {
    return apiCall("/api/v1/notifications/", {
      method: "GET",
    });
  },

  markAsRead: async (notificationId: string) => {
    return apiCall(`/api/v1/notifications/${notificationId}/read`, {
      method: "POST",
    });
  },

  deleteNotification: async (notificationId: string) => {
    return apiCall(`/api/v1/notifications/${notificationId}`, {
      method: "DELETE",
    });
  },
};

export default {
  authAPI,
  doctorsAPI,
  appointmentsAPI,
  chatAPI,
  adminAPI,
  notificationsAPI,
};
