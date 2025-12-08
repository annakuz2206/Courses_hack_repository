import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MatchList.css';

const MatchList = () => {
    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);
    const myId = localStorage.getItem('authCode');

    useEffect(() => {
        fetch('http://localhost:8000/api/matches?participantId=' + myId)
            .then(res => res.json())
            .then(data => {
                const matchList = data.matches.map(m => ({
                    id: m.team.id,
                    name: m.team.name,
                    description: m.team.description
                }));
                setMatches(matchList);
            })
            .catch(error => {
            });
    }, [myId]);

    return (
        <div className="matches-page">
            <div className="matches-container">
                <div className="matches-header">
                    <button onClick={() => navigate('/feed')} className="back-btn">
                        ← Назад
                    </button>
                    <h1>Мэтчи</h1>
                </div>

                {matches.length === 0 ? (
                    <div className="no-matches">
                        <p>Пока нет мэтчей</p>
                        <span>Продолжай свайпать!</span>
                    </div>
                ) : (
                    <div className="matches-list">
                        {matches.map((match) => (
                            <div
                                key={match.id}
                                className="match-card"
                                onClick={() => navigate(`/chat/${match.id}`)}
                            >
                                <div className="match-info">
                                    <h3>{match.name}</h3>
                                    <p>{match.description}</p>
                                </div>
                                <div className="match-arrow">→</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MatchList;
