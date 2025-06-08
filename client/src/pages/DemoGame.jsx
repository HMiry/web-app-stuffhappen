import React, { useState, useEffect } from 'react';

const DemoGame = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameItems] = useState([
    { id: 1, emoji: '🎮', name: 'Controller' },
    { id: 2, emoji: '🏆', name: 'Trophy' },
    { id: 3, emoji: '⭐', name: 'Star' },
    { id: 4, emoji: '🎯', name: 'Target' },
    { id: 5, emoji: '🔥', name: 'Fire' },
    { id: 6, emoji: '💎', name: 'Diamond' }
  ]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    let timer;
    if (gameStarted && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setGameStarted(false);
    }
    return () => clearTimeout(timer);
  }, [gameStarted, timeLeft]);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(60);
    setSelectedItems([]);
  };

  const handleItemClick = (item) => {
    if (!gameStarted) return;
    
    if (!selectedItems.includes(item.id)) {
      setSelectedItems([...selectedItems, item.id]);
      setScore(score + 10);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setScore(0);
    setTimeLeft(60);
    setSelectedItems([]);
  };

  return (
    <div className="min-vh-100 bg-primary text-white">
      <div className="container py-5">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h1 className="display-4 fw-bold mb-3">Demo Game</h1>
            <p className="lead">
              Click on all the items before time runs out!
            </p>
          </div>
        </div>

        {/* Game Stats */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card bg-light text-dark">
              <div className="card-body text-center">
                <h5 className="card-title">Score</h5>
                <div className="display-6 fw-bold text-primary">{score}</div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-light text-dark">
              <div className="card-body text-center">
                <h5 className="card-title">Time Left</h5>
                <div className="display-6 fw-bold text-warning">{timeLeft}s</div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-light text-dark">
              <div className="card-body text-center">
                <h5 className="card-title">Items Found</h5>
                <div className="display-6 fw-bold text-success">
                  {selectedItems.length}/{gameItems.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Controls */}
        <div className="row mb-4">
          <div className="col-12 text-center">
            {!gameStarted ? (
              <div>
                <button className="btn btn-success btn-lg me-3" onClick={startGame}>
                  {timeLeft === 0 ? 'Play Again' : 'Start Game'}
                </button>
                <button className="btn btn-outline-light btn-lg" onClick={resetGame}>
                  Reset
                </button>
              </div>
            ) : (
              <div className="alert alert-info">
                <strong>Game in Progress!</strong> Click on all the items to score points.
              </div>
            )}
          </div>
        </div>

        {/* Game Area */}
        <div className="row">
          <div className="col-12">
            <div className="card bg-light text-dark">
              <div className="card-body p-4">
                <h5 className="card-title text-center mb-4">Game Area</h5>
                
                {timeLeft === 0 && !gameStarted ? (
                  <div className="text-center py-5">
                    <h3 className="mb-3">Game Over!</h3>
                    <p className="lead">Final Score: {score} points</p>
                    <p>Items Found: {selectedItems.length}/{gameItems.length}</p>
                    {selectedItems.length === gameItems.length && (
                      <div className="alert alert-success">
                        🎉 Perfect Score! You found all items!
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="row g-3">
                    {gameItems.map((item) => (
                      <div key={item.id} className="col-lg-2 col-md-3 col-4">
                        <div 
                          className={`card text-center cursor-pointer ${
                            selectedItems.includes(item.id) 
                              ? 'bg-success text-white' 
                              : 'bg-white border-primary'
                          }`}
                          onClick={() => handleItemClick(item)}
                          style={{
                            cursor: gameStarted ? 'pointer' : 'not-allowed',
                            opacity: gameStarted ? 1 : 0.6,
                            transform: selectedItems.includes(item.id) ? 'scale(0.95)' : 'scale(1)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div className="card-body p-3">
                            <div style={{fontSize: '3rem'}} className="mb-2">
                              {item.emoji}
                            </div>
                            <div className="small fw-bold">{item.name}</div>
                            {selectedItems.includes(item.id) && (
                              <div className="mt-2">
                                <span className="badge bg-light text-success">✓ Found</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card bg-light text-dark">
              <div className="card-body">
                <h5 className="card-title">How to Play</h5>
                <ul className="list-unstyled">
                  <li>• Click "Start Game" to begin</li>
                  <li>• Click on all the items in the game area</li>
                  <li>• Each item gives you 10 points</li>
                  <li>• Try to find all items before time runs out</li>
                  <li>• Get a perfect score by finding all {gameItems.length} items!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoGame; 