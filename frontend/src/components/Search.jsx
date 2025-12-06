import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Search.css';

const Search = () => {
    const navigate = useNavigate();
    const [telegram, setTelegram] = useState('');
    const [result, setResult] = useState(null);
    const [notFound, setNotFound] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        fetch('http://localhost:8000/api/participants', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => res.json())
            .then(data => {
                const found = data.participants.find(p =>
                    p.telegram && p.telegram.toLowerCase() === telegram.toLowerCase()
                );

                if (found) {
                    setResult(found);
                    setNotFound(false);
                } else {
                    setResult(null);
                    setNotFound(true);
                }
            })
            .catch(error => {
            });
    };

    return (
        <div className="search-page">
            <div className="search-container">
                <div className="search-header">
                    <button onClick={() => navigate('/feed')} className="back-btn">
                        ← Назад
                    </button>
                    <h1>Поиск</h1>
                </div>

                <form onSubmit={handleSearch} className="search-form">
                    <label>Введите Telegram человека</label>
                    <input
                        type="text"
                        value={telegram}
                        onChange={(e) => setTelegram(e.target.value)}
                        placeholder="@username"
                        required
                    />
                    <button type="submit" className="search-btn">
                        Найти
                    </button>
                </form>

                {notFound && (
                    <div className="search-result not-found">
                        <p>Пользователь не найден</p>
                    </div>
                )}

                {result && (
                    <div className="search-result">
                        <div className="result-card">
                            <h3>{result.name}</h3>
                            <div className="result-role">{result.role}</div>
                            <p className="result-telegram">@{result.telegram}</p>
                            <p className="result-bio">{result.bio}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
