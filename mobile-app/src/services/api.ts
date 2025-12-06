import axios from 'axios';
import { User, Hackathon, Team, SwipeCard } from '../types';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auth
export const devLogin = async (participantId: string): Promise<string> => {
    const response = await api.post('/api/auth/dev-login', { participantId });
    return response.data.access_token;
};

export const setAuthToken = (token: string) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// User
export const getMe = async (): Promise<User> => {
    const response = await api.get('/api/participants/me');
    return response.data;
};

export const updateProfile = async (data: Partial<User>): Promise<User> => {
    const response = await api.put('/api/participants/me', data);
    return response.data;
};

// Hackathons
export const getHackathons = async (): Promise<Hackathon[]> => {
    const response = await api.get('/api/admin/hackathons');
    return response.data.hackathons;
};

export const getHackathonById = async (id: string): Promise<Hackathon> => {
    const response = await api.get(`/api/admin/hackathons/${id}`);
    return response.data;
};

// Teams
export const getTeams = async (hackathonId?: string): Promise<Team[]> => {
    const params = hackathonId ? `?hackathonId=${hackathonId}` : '';
    const response = await api.get(`/api/teams${params}`);
    return response.data.teams;
};

export const createTeam = async (data: {
    name: string;
    hackathonId: string;
    captainId: string;
    description: string;
}): Promise<Team> => {
    const response = await api.post('/api/teams', data);
    return response.data.team;
};

// Swipe
export const swipe = async (
    sourceType: string,
    sourceId: string,
    targetType: string,
    targetId: string,
    direction: 'left' | 'right'
): Promise<{ match: boolean }> => {
    const response = await api.post('/api/swipe', {
        sourceType,
        sourceId,
        targetType,
        targetId,
        direction,
    });
    return response.data;
};

export default api;
