import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';

const AuthForm = () => {
    const [code, setCode] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (code.trim()) {
            fetch('http://localhost:8000/api/auth/dev-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ participantId: code })
            })
                .then(res => res.json())
                .then(data => {
                    localStorage.setItem('token', data.access_token);
                    localStorage.setItem('authCode', code);

                    fetch('http://localhost:8000/api/participants/me', {
                        headers: {
                            'Authorization': 'Bearer ' + data.access_token
                        }
                    })
                        .then(res => res.json())
                        .then(profile => {
                            if (profile.role && profile.skills && profile.skills.length > 0) {
                                navigate('/hackathon-selection');
                            } else {
                                navigate('/questionnaire');
                            }
                        })
                        .catch(error => {
                            navigate('/questionnaire');
                        });
                })
                .catch(error => {
                });
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h1>Вход</h1>

                <p className="auth-label">Код от бота</p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Введите код"
                        className="auth-input"
                        required
                    />

                    <button type="submit" className="btn-login">
                        Войти
                    </button>
                </form>

                <a href="https://t.me/very_cool_hack_bot" className="bot-link" target="_blank" rel="noopener noreferrer">
                    Получить код в Telegram боте
                </a>
            </div>
        </div>
    );
};

export default AuthForm;
