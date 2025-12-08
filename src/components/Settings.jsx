import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

const Settings = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const userRole = localStorage.getItem('userRole') || 'participant';
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        skills: '',
        bio: ''
    });

    useEffect(() => {
        const username = localStorage.getItem('username') || '';
        const profile = JSON.parse(localStorage.getItem('profile') || '{}');

        setFormData({
            name: username,
            role: profile.role || '',
            skills: profile.skills || '',
            bio: profile.bio || ''
        });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('username', formData.name);
        const profile = {
            role: formData.role,
            skills: formData.skills,
            bio: formData.bio
        };
        localStorage.setItem('profile', JSON.stringify(profile));
        alert('Профиль обновлен!');
        navigate('/feed');
    };

    return (
        <div className="settings-page">
            <div className="settings-container">
                <div className="settings-header">
                    <button onClick={() => navigate('/feed')} className="back-btn">
                        ← Назад
                    </button>
                    <h2>Настройки</h2>
                </div>

                <div className="settings-tabs">
                    <button
                        className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        О себе
                    </button>
                    {userRole === 'captain' && (
                        <button
                            className={`tab ${activeTab === 'teams' ? 'active' : ''}`}
                            onClick={() => setActiveTab('teams')}
                        >
                            Мои команды
                        </button>
                    )}
                </div>

                {activeTab === 'profile' && (
                    <form onSubmit={handleSubmit} className="settings-form">
                        <div className="form-field">
                            <label>Имя</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="form-field">
                            <label>Роль</label>
                            <input
                                type="text"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            />
                        </div>

                        <div className="form-field">
                            <label>Навыки</label>
                            <input
                                type="text"
                                value={formData.skills}
                                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                            />
                        </div>

                        <div className="form-field">
                            <label>О себе</label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                rows="4"
                            />
                        </div>

                        <button type="submit" className="save-btn">
                            Сохранить изменения
                        </button>
                    </form>
                )}

                {activeTab === 'teams' && userRole === 'captain' && (
                    <div className="teams-section">
                        <h3>Управление командой</h3>
                        <div className="team-card">
                            <h4>Code Warriors</h4>
                            <p>Ищем: Frontend, Designer</p>
                            <p>Участники: Иван (Backend), Петр (ML)</p>
                            <button className="edit-team-btn" onClick={() => navigate('/team-creation')}>
                                Редактировать команду
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;
