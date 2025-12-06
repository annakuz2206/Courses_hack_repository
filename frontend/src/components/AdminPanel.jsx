import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

const AdminPanel = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('stats');

    return (
        <div className="admin-page">
            <div className="admin-container">
                <div className="admin-header">
                    <h1>Админ-панель</h1>
                    <button onClick={() => navigate('/')} className="back-btn">
                        Выход
                    </button>
                </div>

                <div className="admin-tabs">
                    <button
                        className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
                        onClick={() => setActiveTab('stats')}
                    >
                        Статистика
                    </button>
                    <button
                        className={`tab ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Участники
                    </button>
                    <button
                        className={`tab ${activeTab === 'teams' ? 'active' : ''}`}
                        onClick={() => setActiveTab('teams')}
                    >
                        Команды
                    </button>
                </div>

                <div className="admin-content">
                    {activeTab === 'stats' && (
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-number">42</div>
                                <div className="stat-label">Участников</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-number">12</div>
                                <div className="stat-label">Команд</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-number">8</div>
                                <div className="stat-label">Мэтчей</div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="data-table">
                            <h3>Список участников</h3>
                            <p>Здесь будет таблица участников</p>
                        </div>
                    )}

                    {activeTab === 'teams' && (
                        <div className="data-table">
                            <h3>Список команд</h3>
                            <p>Здесь будет таблица команд</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
