import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Timer, AlertTriangle, Clock, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Game = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const [gameState, setGameState] = useState({
    cardsWon: 0,
    wrongGuesses: 0,
    round: 1,
    timeLeft: 30,
    gameStarted: true
  });

  const [currentCard] = useState({
    title: "Missed your graduation ceremony",
    image: "/images/freepik__the-style-is-candid-image-photography-with-natural__62682.jpeg",
    id: 'current'
  });

  const [disasterCards] = useState([
    {
      id: 1,
      title: "Got food poisoning during finals week",
      image: "/images/freepik__the-style-is-candid-image-photography-with-natural__62683.jpeg",
      severity: 40.5
    },
    {
      id: 2,
      title: "Lost your student ID on graduation day", 
      image: "/images/freepik__the-style-is-candid-image-photography-with-natural__62684.jpeg",
      severity: 45.5
    },
    {
      id: 3,
      title: "Got locked out of your dorm room naked",
      image: "/images/freepik__the-style-is-candid-image-photography-with-natural__62685.jpeg", 
      severity: 60.5
    }
  ]);

  const [selectedSlot, setSelectedSlot] = useState(null);

  // Timer countdown
  useEffect(() => {
    let timer;
    if (gameState.gameStarted && gameState.timeLeft > 0) {
      timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (gameState.timeLeft === 0) {
      // Time's up logic
      setGameState(prev => ({ ...prev, wrongGuesses: prev.wrongGuesses + 1 }));
    }
    return () => clearTimeout(timer);
  }, [gameState.gameStarted, gameState.timeLeft]);

  const handleSlotClick = (slotIndex) => {
    setSelectedSlot(slotIndex);
  };

  const handlePlaceCard = () => {
    if (selectedSlot !== null) {
      // Place the card logic here
      setGameState(prev => ({ 
        ...prev, 
        cardsWon: prev.cardsWon + 1,
        round: prev.round + 1,
        timeLeft: 30 
      }));
      setSelectedSlot(null);
    }
  };

  return (
    <div className="min-vh-100" style={{backgroundColor: '#1a1a1a'}}>
      {/* Header */}
      <div className="border-bottom" style={{backgroundColor: '#2a2a2a', borderColor: 'rgba(255,255,255,0.1)'}}>
        <div className="container-fluid py-3">
          <div className="row align-items-center">
            <div className="col-md-3">
              <button 
                className="d-flex align-items-center px-4 py-2 shadow-sm"
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '2px solid white',
                  borderRadius: '25px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}
                onClick={() => navigate('/')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = 'black';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'white';
                }}
              >
                <ArrowLeft className="me-2" size={24} />
                Exit Game
              </button>
            </div>
            
            <div className="col-md-6 text-center">
              <div className="row">
                <div className="col-4">
                  <div style={{color: '#4A90E2', fontFamily: 'Poppins, sans-serif', fontWeight: '700'}} className="fw-bold">{gameState.cardsWon}/6</div>
                  <div className="small" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: 'rgba(255,255,255,0.7)'}}>Cards Won</div>
                </div>
                <div className="col-4">
                  <div className="text-danger fw-bold" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '700'}}>{gameState.wrongGuesses}/3</div>
                  <div className="small" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: 'rgba(255,255,255,0.7)'}}>Wrong Guesses</div>
                </div>
                <div className="col-4">
                  <div style={{color: 'white', fontFamily: 'Poppins, sans-serif', fontWeight: '700'}} className="fw-bold">Round {gameState.round}</div>
                  <div className="small" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: 'rgba(255,255,255,0.7)'}}>Current Round</div>
                </div>
              </div>
            </div>
            
            <div className="col-md-3 text-end">
              {isLoggedIn && (
                <button 
                  className="btn d-flex align-items-center justify-content-end p-0 border-0 bg-transparent"
                  onClick={() => navigate('/profile')}
                  style={{color: 'white', fontWeight: '500', fontFamily: 'Poppins, sans-serif'}}
                >
                  <User size={20} className="me-2" style={{color: 'white'}} />
                  Student Player
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        {/* Current Question */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-lg" style={{backgroundColor: '#2a2a2a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px'}}>
              <div className="card-body p-5">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div className="d-flex align-items-center">
                    <Target className="me-3" style={{color: '#4A90E2'}} size={36} />
                    <h4 className="mb-0" style={{color: 'white', fontFamily: 'Poppins, sans-serif', fontWeight: '600'}}>Where does this disaster belong?</h4>
                  </div>
                  <div className="d-flex align-items-center">
                    <Timer className="me-2" style={{color: '#4A90E2'}} size={24} />
                    <span className="fw-bold" style={{color: 'white', fontFamily: 'Poppins, sans-serif', fontWeight: '700'}}>{gameState.timeLeft}s</span>
                    <div className="progress ms-3" style={{width: '100px', height: '8px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.2)'}}>
                      <div 
                        className="progress-bar" 
                        style={{backgroundColor: '#4A90E2', width: `${(gameState.timeLeft / 30) * 100}%`, borderRadius: '4px'}}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="card d-inline-block shadow-sm" style={{maxWidth: '300px', borderRadius: '20px', overflow: 'hidden', backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)'}}>
                    <img 
                      src={currentCard.image} 
                      className="card-img-top"
                      alt="Current disaster"
                      style={{height: '150px', objectFit: 'cover'}}
                    />
                    <div className="card-body p-3">
                      <h6 className="card-title mb-0" style={{color: 'white', fontFamily: 'Poppins, sans-serif', fontWeight: '600'}}>{currentCard.title}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Your Disaster Cards */}
        <div className="row">
          <div className="col-12">
            <h5 className="mb-4" style={{color: 'white', fontFamily: 'Poppins, sans-serif', fontWeight: '600'}}>Your Disaster Cards</h5>
            
            <div className="d-flex align-items-center justify-content-center gap-3 overflow-auto pb-3">
              {/* First placement slot */}
              <div 
                className={`border-3 p-4 text-center ${
                  selectedSlot === 0 ? 'bg-opacity-10' : ''
                }`}
                style={{
                  minWidth: '140px', 
                  minHeight: '200px', 
                  cursor: 'pointer',
                  borderStyle: 'dashed',
                  borderColor: selectedSlot === 0 ? '#4A90E2' : 'rgba(255,255,255,0.3)',
                  backgroundColor: selectedSlot === 0 ? 'rgba(74, 144, 226, 0.1)' : 'transparent',
                  borderRadius: '16px'
                }}
                onClick={() => handleSlotClick(0)}
              >
                <div className="d-flex align-items-center justify-content-center h-100">
                  <div>
                    <div style={{color: selectedSlot === 0 ? '#4A90E2' : 'rgba(255,255,255,0.6)', fontSize: '32px', fontWeight: '300', lineHeight: '1'}}>+</div>
                    <div style={{color: selectedSlot === 0 ? '#4A90E2' : 'rgba(255,255,255,0.6)', fontSize: '16px', fontWeight: '600', marginTop: '8px', fontFamily: 'Poppins, sans-serif'}}>Place Here</div>
                  </div>
                </div>
              </div>

              {/* Disaster cards with placement slots between them */}
              {disasterCards.map((card, index) => (
                <React.Fragment key={card.id}>
                  <div className="card shadow-sm" style={{minWidth: '200px', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#2a2a2a', border: '1px solid rgba(255,255,255,0.1)'}}>
                    <img 
                      src={card.image} 
                      className="card-img-top"
                      alt={card.title}
                      style={{height: '120px', objectFit: 'cover'}}
                    />
                    <div className="card-body p-3">
                      <h6 className="card-title small mb-2" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: 'white'}}>{card.title}</h6>
                      <div className="d-flex align-items-center justify-content-center">
                        <AlertTriangle className="text-danger me-1" size={16} />
                        <span className="fw-bold text-danger" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '700'}}>{card.severity}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Placement slot after each card */}
                  <div 
                    className={`border-3 p-4 text-center ${
                      selectedSlot === index + 1 ? 'bg-opacity-10' : ''
                    }`}
                    style={{
                      minWidth: '140px', 
                      minHeight: '200px', 
                      cursor: 'pointer',
                      borderStyle: 'dashed',
                      borderColor: selectedSlot === index + 1 ? '#4A90E2' : 'rgba(255,255,255,0.3)',
                      backgroundColor: selectedSlot === index + 1 ? 'rgba(74, 144, 226, 0.1)' : 'transparent',
                      borderRadius: '16px'
                    }}
                    onClick={() => handleSlotClick(index + 1)}
                  >
                    <div className="d-flex align-items-center justify-content-center h-100">
                      <div>
                        <div style={{color: selectedSlot === index + 1 ? '#4A90E2' : 'rgba(255,255,255,0.6)', fontSize: '32px', fontWeight: '300', lineHeight: '1'}}>+</div>
                        <div style={{color: selectedSlot === index + 1 ? '#4A90E2' : 'rgba(255,255,255,0.6)', fontSize: '16px', fontWeight: '600', marginTop: '8px', fontFamily: 'Poppins, sans-serif'}}>Place Here</div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* Place Card Button */}
            {selectedSlot !== null && (
              <div className="text-center mt-4">
                <button 
                  className="btn btn-lg px-5 py-3 shadow-sm"
                  style={{
                    backgroundColor: 'white',
                    color: 'black',
                    fontSize: '18px',
                    fontWeight: '600',
                    fontFamily: 'Poppins, sans-serif',
                    borderRadius: '25px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(255, 255, 255, 0.3)',
                    padding: '12px 30px',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={handlePlaceCard}
                >
                  Place Card Here
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Game Instructions */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{backgroundColor: '#2a2a2a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)'}}>
              <div className="card-body p-4">
                <div className="text-center" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: 'rgba(255,255,255,0.8)'}}>
                  <strong style={{fontWeight: '600'}}>How to play:</strong> Click on a "Place Here" slot where you think this disaster belongs based on severity. 
                  Lower numbers = less severe, Higher numbers = more severe.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game; 