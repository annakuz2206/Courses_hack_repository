import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateFakeToken } from '../data/mockData';

const AppContext = createContext();

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp должен использоваться внутри AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [selectedHackathon, setSelectedHackathon] = useState(null);
    const [myTeam, setMyTeam] = useState(null);
    const [role, setRole] = useState(null);

    // Хранилище лайков и дизлайков
    const [swipes, setSwipes] = useState([]);

    // Хранилище мэтчей
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const savedProfile = localStorage.getItem('profile');
        const savedHackathon = localStorage.getItem('selectedHackathon');
        const savedTeam = localStorage.getItem('myTeam');
        const savedRole = localStorage.getItem('role');
        const savedSwipes = localStorage.getItem('swipes');
        const savedMatches = localStorage.getItem('matches');

        if (savedUser) setUser(JSON.parse(savedUser));
        if (savedProfile) setProfile(JSON.parse(savedProfile));
        if (savedHackathon) setSelectedHackathon(JSON.parse(savedHackathon));
        if (savedTeam) setMyTeam(JSON.parse(savedTeam));
        if (savedRole) setRole(savedRole);
        if (savedSwipes) setSwipes(JSON.parse(savedSwipes));
        if (savedMatches) setMatches(JSON.parse(savedMatches));
    }, []);

    const login = (code) => {
        const userData = {
            id: code,
            code: code,
            nickname: `user_${code}`,
            token: generateFakeToken(code),
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
    };

    const saveProfile = (profileData) => {
        setProfile(profileData);
        localStorage.setItem('profile', JSON.stringify(profileData));
    };

    const selectHackathon = (hackathon) => {
        setSelectedHackathon(hackathon);
        localStorage.setItem('selectedHackathon', JSON.stringify(hackathon));
    };

    const selectRole = (newRole) => {
        setRole(newRole);
        localStorage.setItem('role', newRole);
    };

    const createTeam = (teamData) => {
        const team = {
            ...teamData,
            id: `team_${Date.now()}`,
            captain: user.id,
            members: [
                {
                    id: user.id,
                    name: profile?.name || 'Я',
                    role: profile?.role || 'Участник',
                    isCaptain: true,
                }
            ],
            createdAt: new Date().toISOString(),
        };
        setMyTeam(team);
        setRole('captain');
        localStorage.setItem('myTeam', JSON.stringify(team));
        localStorage.setItem('role', 'captain');
        return team;
    };

    const addSwipe = (participantId, direction) => {
        const newSwipe = {
            participantId,
            direction,
            timestamp: Date.now(),
        };
        const updatedSwipes = [...swipes, newSwipe];
        setSwipes(updatedSwipes);
        localStorage.setItem('swipes', JSON.stringify(updatedSwipes));

        // Имитация мэтча (каждый 3-й лайк становится мэтчем)
        if (direction === 'right' && Math.random() > 0.7) {
            addMatch(participantId);
        }
    };

    const addMatch = (participantId) => {
        // Проверяем, нет ли уже такого мэтча
        if (matches.find(m => m.id === participantId)) {
            return;
        }

        const newMatch = {
            id: participantId,
            timestamp: Date.now(),
        };
        const updatedMatches = [...matches, newMatch];
        setMatches(updatedMatches);
        localStorage.setItem('matches', JSON.stringify(updatedMatches));
    };

    const addMemberToTeam = (member) => {
        if (!myTeam) return;

        const updatedTeam = {
            ...myTeam,
            members: [...myTeam.members, member],
        };
        setMyTeam(updatedTeam);
        localStorage.setItem('myTeam', JSON.stringify(updatedTeam));
    };

    const removeMemberFromTeam = (memberId) => {
        if (!myTeam) return;

        const updatedTeam = {
            ...myTeam,
            members: myTeam.members.filter(m => m.id !== memberId),
        };
        setMyTeam(updatedTeam);
        localStorage.setItem('myTeam', JSON.stringify(updatedTeam));
    };

    const leaveTeam = () => {
        setMyTeam(null);
        setRole('searching');
        localStorage.removeItem('myTeam');
        localStorage.setItem('role', 'searching');
    };

    const logout = () => {
        setUser(null);
        setProfile(null);
        setSelectedHackathon(null);
        setMyTeam(null);
        setRole(null);
        setSwipes([]);
        setMatches([]);
        localStorage.clear();
    };

    const value = {
        user,
        profile,
        selectedHackathon,
        myTeam,
        role,
        swipes,
        matches,
        login,
        logout,
        saveProfile,
        selectHackathon,
        selectRole,
        createTeam,
        addSwipe,
        addMatch,
        addMemberToTeam,
        removeMemberFromTeam,
        leaveTeam,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
