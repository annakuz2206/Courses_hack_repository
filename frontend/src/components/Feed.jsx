import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Feed.css';

const Feed = () => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cards, setCards] = useState([]);
    const userRole = localStorage.getItem('userRole') || 'participant';
    const token = localStorage.getItem('token');
    const myId = localStorage.getItem('authCode');

    useEffect(() => {
        if (userRole === 'captain') {
            fetch('http://localhost:8000/api/participants?hackathonId=h1')
                .then(res => res.json())
                .then(data => {
                    setCards(data.participants);
                })
                .catch(error => {
                });
        } else {
            fetch('http://localhost:8000/api/teams?hackathonId=h1')
                .then(res => res.json())
                .then(data => {
                    setCards(data.teams);
                })
                .catch(error => {
                });
        }
    }, [userRole]);

    const currentCard = cards[currentIndex];

    const handleSwipe = (direction) => {
        const token = localStorage.getItem('token');
        const myId = localStorage.getItem('authCode');

        if (direction === 'right') {
            const swipeData = {
                sourceType: userRole === 'captain' ? 'team' : 'participant',
                sourceId: myId,
                targetType: userRole === 'captain' ? 'participant' : 'team',
                targetId: currentCard.id,
                direction: 'right'
            };

            fetch('http://localhost:8000/api/swipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(swipeData)
            })
                .then(res => res.json())
                .then(data => {
                })
                .catch(error => {
                });
        }

        if (currentIndex < cards.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setCurrentIndex(0);
        }
    };

    if (!currentCard) return <div className="feed-page">Нет карточек</div>;

    return (
        <div className="feed-page">
            <div className="feed-header">
                <h2>{userRole === 'captain' ? 'Участники' : 'Команды'}</h2>
            </div>

            <div className="card-container">
                <div className="swipe-card" onClick={() => navigate(`/card/${currentCard.id}`)}>
                    <div className="card-content">
                        <h3>{currentCard.name}</h3>

                        {userRole === 'captain' ? (
                            <>
                                <div className="card-role">{currentCard.role}</div>
                                {currentCard.telegram && (
                                    <p className="card-telegram">@{currentCard.telegram}</p>
                                )}
                                <p className="card-bio">{currentCard.bio}</p>
                            </>
                        ) : (
                            <>
                                <div className="card-looking">
                                    Ищут: {currentCard.lookingForRoles?.join(', ')}
                                </div>
                                <p className="card-description">{currentCard.description}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="swipe-buttons">
                <button className="swipe-btn dislike" onClick={() => handleSwipe('left')}>
                    ✕
                </button>
                <button className="swipe-btn like" onClick={() => handleSwipe('right')}>
                    ♥
                </button>
            </div>

            <div className="bottom-menu">
                <button className="menu-btn" onClick={() => navigate('/settings')}>
                    <span className="menu-label">Настройки</span>
                </button>
                <button className="menu-btn" onClick={() => navigate('/search')}>
                    <span className="menu-label">Поиск</span>
                </button>
                <button className="menu-btn" onClick={() => navigate('/matches')}>
                    <span className="menu-label">Мэтчи</span>
                </button>
                <button className="menu-btn" onClick={() => navigate('/my-teams')}>
                    <span className="menu-label">Мои команды</span>
                </button>
            </div>
        </div>
    );
};

export default Feed;
