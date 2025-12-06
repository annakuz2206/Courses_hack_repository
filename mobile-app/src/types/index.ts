// Navigation Types
export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
};

export type AuthStackParamList = {
    Login: undefined;
    ProfileForm: undefined;
};

export type MainTabParamList = {
    Hackathons: undefined;
    Matching: undefined;
    Team: undefined;
    Profile: undefined;
};

export type HackathonsStackParamList = {
    HackathonList: undefined;
    HackathonDetail: { hackathonId: string };
};

// Data Types
export interface User {
    id: string;
    name: string;
    role: string;
    skills: string[];
    bio: string;
    experienceHackathons: number;
    teamId?: string;
}

export interface Hackathon {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    maxTeamSize: number;
}

export interface Team {
    id: string;
    name: string;
    hackathonId: string;
    captainId: string;
    memberIds: string[];
    lookingForRoles: string[];
    description: string;
}

export interface SwipeCard {
    id: string;
    type: 'team' | 'participant';
    name: string;
    description: string;
    skills?: string[];
    lookingForRoles?: string[];
}
