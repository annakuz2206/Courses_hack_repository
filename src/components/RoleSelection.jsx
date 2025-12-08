import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RoleSelection.css';

const RoleSelection = () => {
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        localStorage.setItem('userRole', role);
        navigate('/hackathon-selection');
    };

    return (
        <div className="role-page">
            <div className="role-container">
                <h1>Выбери свою роль</h1>
                <p className="role-subtitle">Как ты хочешь участвовать?</p>

                <div className="role-cards">
                    <div className="role-card" onClick={() => handleRoleSelect('captain')}>
                        <div className="role-icon">👥</div>
                        <h2>Я капитан</h2>
                        <p>Ищу людей в свою команду</p>
                    </div>

                    <div className="role-card" onClick={() => handleRoleSelect('participant')}>
                        <div className="role-icon">🚀</div>
                        <h2>Я участник</h2>
                        <p>Ищу команду для участия</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
