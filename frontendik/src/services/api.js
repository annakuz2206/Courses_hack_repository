const API_BASE_URL = 'http://localhost:8000';

const getToken = () => localStorage.getItem('access_token');

const fetchAPI = async (endpoint, options = {}) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Network error' }));
        throw new Error(error.detail || 'API Error');
    }

    return response.json();
};

export const authAPI = {
    devLogin: async (participantId) => {
        const data = await fetchAPI('/api/auth/dev-login', {
            method: 'POST',
            body: JSON.stringify({ participantId }),
        });
        localStorage.setItem('access_token', data.access_token);
        return data;
    },

    telegramAuth: async (telegramData) => {
        const data = await fetchAPI('/api/auth/telegram', {
            method: 'POST',
            body: JSON.stringify(telegramData),
        });
        localStorage.setItem('access_token', data.access_token);
        return data;
    },

    logout: () => {
        localStorage.removeItem('access_token');
    },
};

export const participantsAPI = {
    getAll: (filters = {}) => {
        const params = new URLSearchParams(filters);
        return fetchAPI(`/api/participants?${params}`);
    },

    getById: (id) => fetchAPI(`/api/participants/${id}`),

    getMe: () => fetchAPI('/api/participants/me'),

    updateMe: (data) =>
        fetchAPI('/api/participants/me', {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
};

export const teamsAPI = {
    getAll: (filters = {}) => {
        const params = new URLSearchParams(filters);
        return fetchAPI(`/api/teams?${params}`);
    },

    getById: (id) => fetchAPI(`/api/teams/${id}`),

    create: (data) =>
        fetchAPI('/api/teams', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
};

export const swipeAPI = {
    swipe: (sourceType, sourceId, targetType, targetId, direction) =>
        fetchAPI('/api/swipe', {
            method: 'POST',
            body: JSON.stringify({
                sourceType,
                sourceId,
                targetType,
                targetId,
                direction,
            }),
        }),

    getMatches: (filters = {}) => {
        const params = new URLSearchParams(filters);
        return fetchAPI(`/api/matches?${params}`);
    },
};

export const adminAPI = {
    getHackathons: () => fetchAPI('/api/admin/hackathons'),

    createHackathon: (data) =>
        fetchAPI('/api/admin/hackathons', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    updateHackathon: (id, data) =>
        fetchAPI(`/api/admin/hackathons/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    deleteHackathon: (id) =>
        fetchAPI(`/api/admin/hackathons/${id}`, {
            method: 'DELETE',
        }),

    getParticipantStats: (hackathonId) => {
        const params = hackathonId ? `?hackathonId=${hackathonId}` : '';
        return fetchAPI(`/api/admin/participants/stats${params}`);
    },

    setOrganizer: (participantId) =>
        fetchAPI('/api/admin/set-organizer', {
            method: 'POST',
            body: JSON.stringify({ participantId }),
        }),

    addToTeam: (participantId, teamId) =>
        fetchAPI('/api/admin/add-to-team', {
            method: 'POST',
            body: JSON.stringify({ participantId, teamId }),
        }),

    getAnalytics: (hackathonId) => {
        const params = hackathonId ? `?hackathonId=${hackathonId}` : '';
        return fetchAPI(`/api/admin/analytics${params}`);
    },

    exportParticipants: (hackathonId) => {
        const params = hackathonId ? `?hackathonId=${hackathonId}` : '';
        return fetchAPI(`/api/admin/export/participants${params}`);
    },

    exportTeams: (hackathonId) => {
        const params = hackathonId ? `?hackathonId=${hackathonId}` : '';
        return fetchAPI(`/api/admin/export/teams${params}`);
    },
};

export default {
    authAPI,
    participantsAPI,
    teamsAPI,
    swipeAPI,
    adminAPI,
};
