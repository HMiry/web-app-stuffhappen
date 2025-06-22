import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Target, Timer, AlertTriangle, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import API from '../services/api.mjs';

// Game Completion Popup Component
const GameCompletionPopup = ({ message, onComplete }) => {
  const [countdown, setCountdown] = useState(3);
  const { isDark } = useTheme();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 2100}}>
      <div className="card border-0 shadow-lg text-center" style={{width: '320px', height: '320px', borderRadius: '20px', display: 'flex', alignItems: 'center'}}>
        <div className="card-body p-4 d-flex flex-column justify-content-center h-100">
          <div className="mb-3">
            <div style={{fontSize: '3rem'}}>
              {message.icon}
            </div>
          </div>
          <h5 className={`mb-2 ${message.type === 'won' ? 'text-success' : 'text-danger'}`} style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', fontSize: '18px'}}>
            {message.title}
          </h5>
          <p className="text-muted mb-3" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', fontSize: '13px', lineHeight: '1.3'}}>
            {message.message}
          </p>
          <div className="mb-3">
            <div className="text-muted" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '500', fontSize: '12px'}}>
              Redirecting in
            </div>
            <div className="fw-bold text-primary" style={{fontFamily: 'Poppins, sans-serif', fontSize: '28px'}}>
              {countdown}
            </div>
          </div>
          <button 
            className="btn btn-primary btn-sm"
            onClick={onComplete}
            style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', fontSize: '12px', padding: '6px 16px'}}
          >
            Go Now
          </button>
        </div>
      </div>
    </div>
  );
};

const Game = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user } = useAuth();
  const { isDark } = useTheme();
  // Get game session from navigation state
  const gameSession = location.state?.gameSession;
  
  const [gameState, setGameState] = useState({
    sessionId: gameSession?.session_id,
    cardsWon: 0,
    wrongGuesses: 0,
    round: 1,
    timeLeft: 30,
    gameStarted: false,
    loading: true,
    isCompleted: false // Add this to track if game is completed
  });

  const [currentCard, setCurrentCard] = useState(null);
  const [playerCards, setPlayerCards] = useState([]); // Starting hand + won cards

  const [feedback, setFeedback] = useState(null); // Show correct/incorrect feedback
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameCompletionMessage, setGameCompletionMessage] = useState(null); // Final game completion message
  const [showGameCompletion, setShowGameCompletion] = useState(false);

  // Initialize game data this is added as optional so that users can resume a game from the themes page
  useEffect(() => {
    const initializeGame = async () => {
      // Check if we came from "Start Playing" button with a resumed session
      if (gameSession?.resumed) {
        // This is a resumed session from the themes page
        await resumeActiveGame({
          id: gameSession.session_id,
          theme_id: gameSession.theme.id,
          theme_name: gameSession.theme.name,
          theme_key: gameSession.theme.theme_key,
          theme_color: gameSession.theme.color,
          ...gameSession.game_state
        });
        return;
      }

      // Always check for active game first (for resume functionality when navigating directly)
      if (isLoggedIn) {
        try {
          const activeGameResult = await API.game.getActiveGame();
          
          if (activeGameResult.success && activeGameResult.data) {
            // Resume the active game (ignoring navigation state)
            await resumeActiveGame(activeGameResult.data);
            return;
          }
        } catch (error) {
        }
      }

      // If no active game to resume, check if we have gameSession from navigation
      if (!gameSession) {
        navigate('/themes');
        return;
      }
      // Initialize new game from navigation state
      try {
        // Get starting cards from the game session
        if (gameSession.cards) {
          // Ensure all starting cards have proper severity fields
          const normalizedCards = gameSession.cards.map(card => ({
            ...card,
            bad_luck_severity: card.bad_luck_severity || card.severity,
            severity: card.severity || card.bad_luck_severity
          }));
          setPlayerCards(normalizedCards);
        }

        // Get first card to place
        const nextCardResult = await API.game.getNextCard(gameSession.session_id);
        if (nextCardResult.success) {
          setCurrentCard(nextCardResult.data);
          
          // Use persistent timer from server
          const remainingTime = nextCardResult.data.remaining_time || 30;
          setGameState(prev => ({
            ...prev,
            timeLeft: remainingTime
          }));
        }

        setGameState(prev => ({
          ...prev,
          gameStarted: true,
          loading: false
        }));
      } catch (error) {

        navigate('/themes');
      }
    };

    const resumeActiveGame = async (activeSession) => {
      try {
        setGameState(prev => ({
          ...prev,
          sessionId: activeSession.id,
          loading: true
        }));

        // Get the game session details
        const sessionResult = await API.game.getGameSession(activeSession.id);
        
        if (!sessionResult.success) {
          throw new Error('Failed to get session details');
        }

        const session = sessionResult.data;
        
        // Get all completed rounds to reconstruct game state
        const roundsResult = await API.game.getGameRounds(activeSession.id);
        
        if (!roundsResult.success) {
          throw new Error('Failed to get game rounds');
        }

        const rounds = roundsResult.data;
        
        // Separate starting cards (round 0) from gameplay rounds
        const startingRounds = rounds.filter(r => r.round_number === 0);
        const gameplayRounds = rounds.filter(r => r.round_number > 0);
        
        // Calculate current game state
        const cardsWon = gameplayRounds.filter(r => r.is_correct).length;
        const wrongGuesses = gameplayRounds.filter(r => !r.is_correct).length;
        // Use the current_round from the database session, not calculated
        const currentRound = session.current_round;

        // Build player cards array (starting cards + won cards in order)
        const playerCardsArray = [];
        
        // Add starting cards first
        for (const round of startingRounds) {
          playerCardsArray.push({
            id: round.card_id,
            title: round.card_title,
            bad_luck_severity: round.bad_luck_severity,
            severity: round.bad_luck_severity,
            image_url: round.card_image_url
          });
        }

        // Add won cards in the order they were won
        for (const round of gameplayRounds.filter(r => r.is_correct)) {
          playerCardsArray.push({
            id: round.card_id,
            title: round.card_title,
            bad_luck_severity: round.bad_luck_severity,
            severity: round.bad_luck_severity,
            image_url: round.card_image_url
          });
        }

        setPlayerCards(playerCardsArray);

        // Get next card to place (if game isn't over)
        if (cardsWon < 3 && wrongGuesses < 3) {
          const nextCardResult = await API.game.getNextCard(activeSession.id);
          if (nextCardResult.success) {
            setCurrentCard(nextCardResult.data);
            
            // Use persistent timer from server
            const remainingTime = nextCardResult.data.remaining_time || 30;
            setGameState(prev => ({
              ...prev,
              timeLeft: remainingTime
            }));
          }
        }

        // Update game state (don't override timeLeft - it was set correctly above)
        setGameState(prev => ({
          ...prev,
          sessionId: activeSession.id,
          cardsWon,
          wrongGuesses,
          round: currentRound,
          gameStarted: true,
          loading: false,
          isCompleted: (cardsWon >= 3 || wrongGuesses >= 3)
        }));

        // If game is already completed, show completion message
        if (cardsWon >= 3) {
          setGameCompletionMessage({
            type: 'won',
            title: 'Game Complete! 🎉',
            message: `You won with ${cardsWon} cards!`,
            icon: '🏆'
          });
          setShowGameCompletion(true);
        } else if (wrongGuesses >= 3) {
          setGameCompletionMessage({
            type: 'lost',
            title: 'Game Over',
            message: `Too many wrong guesses. Better luck next time!`,
            icon: '💔'
          });
          setShowGameCompletion(true);
        }


        
      } catch (error) {

        navigate('/themes');
      }
    };

    initializeGame();
  }, [gameSession, navigate, isLoggedIn]);

  // Timer countdown
  useEffect(() => {
    let timer;
    if (gameState.gameStarted && gameState.timeLeft > 0 && !showFeedback && !gameState.isCompleted) {
      timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (gameState.timeLeft === 0 && !showFeedback && !gameState.isCompleted) {
      // Time's up - treat as wrong answer
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [gameState.gameStarted, gameState.timeLeft, showFeedback, gameState.isCompleted]);

  const handleSlotClick = async (slotIndex) => {
    if (!gameState.isCompleted && !showFeedback) {
      // Auto-submit the move immediately when slot is clicked
      await submitMove(slotIndex + 1, false); // Convert to 1-based position
    }
  };

  const handleTimeUp = async () => {
    if (!currentCard || !gameState.sessionId || gameState.isCompleted) return;

    // Submit as timeout (wrong answer)
    await submitMove(1, true); // Any position, but marked as timeout
  };

  const submitMove = async (position, isTimeout = false) => {
    if (gameState.isCompleted) {
      return;
    }

    try {
      const moveData = {
        round_number: gameState.round,
        card_id: currentCard.id,
        user_choice_position: position,
        time_taken: isTimeout ? 31 : (30 - gameState.timeLeft)
      };

      const result = await API.game.submitMove(gameState.sessionId, moveData);
      
      if (result.success) {
        const { is_correct, correct_position, card_severity } = result.data;
        
        // Show feedback
        setFeedback({
          isCorrect: is_correct,
          correctPosition: correct_position,
          userPosition: position,
          severity: card_severity,
          isTimeout
        });
        setShowFeedback(true);

        // Update game state
        const newCardsWon = is_correct ? gameState.cardsWon + 1 : gameState.cardsWon;
        const newWrongGuesses = is_correct ? gameState.wrongGuesses : gameState.wrongGuesses + 1;
        
        setGameState(prev => ({
          ...prev,
          cardsWon: newCardsWon,
          wrongGuesses: newWrongGuesses,
          round: prev.round + 1
        }));

        // If correct, add card to player's hand
        if (is_correct) {
          // Try to get severity from multiple possible sources
          let severityValue = null;
          
          // First try the API response card_severity
          if (card_severity !== undefined && card_severity !== null && !isNaN(card_severity)) {
            severityValue = card_severity;
          }
          // Then try currentCard's bad_luck_severity
          else if (currentCard.bad_luck_severity !== undefined && currentCard.bad_luck_severity !== null && !isNaN(currentCard.bad_luck_severity)) {
            severityValue = currentCard.bad_luck_severity;
          }
          // Then try currentCard's severity
          else if (currentCard.severity !== undefined && currentCard.severity !== null && !isNaN(currentCard.severity)) {
            severityValue = currentCard.severity;
          }
          // Final fallback - use a default based on correct_position
          else {
            severityValue = correct_position * 10; // Rough estimate based on position
          }
          
          const newCard = { 
            ...currentCard, 
            bad_luck_severity: severityValue,
            severity: severityValue // Ensure both field names are set
          };
          
          setPlayerCards(prev => {
            const updatedCards = [...prev, newCard].sort((a, b) => (a.bad_luck_severity || a.severity || 0) - (b.bad_luck_severity || b.severity || 0));
            return updatedCards;
          });
        }

        // Note: Removed setTimeout - users now click OK button to continue

      } else {

        if (result.error === 'Game session is already completed') {
          setGameState(prev => ({ ...prev, isCompleted: true }));
          navigate('/themes');
        }
      }
    } catch (error) {

      if (error.message && error.message.includes('already completed')) {
        setGameState(prev => ({ ...prev, isCompleted: true }));
        navigate('/themes');
      }
    }
  };

  // Show loading state
  if (gameState.loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{backgroundColor: isDark ? '#1a1a1a' : '#ffffff'}}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 style={{color: isDark ? 'white' : '#1a1a1a'}}>Loading game...</h5>
        </div>
      </div>
    );
  }

  // Show error state if no current card
  if (!currentCard) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{backgroundColor: isDark ? '#1a1a1a' : '#ffffff'}}>
        <div className="text-center">
          <h5 style={{color: isDark ? 'white' : '#1a1a1a'}}>Failed to load game</h5>
          <button className="btn btn-primary mt-3" onClick={() => navigate('/themes')}>
            Back to Themes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{backgroundColor: isDark ? '#1a1a1a' : '#ffffff'}}>
      {/* Feedback Overlay */}
      {showFeedback && feedback && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000}}>
          <div className="card border-0 shadow-lg text-center" style={{maxWidth: '400px', borderRadius: '20px'}}>
            <div className="card-body p-4">
              <div className={`mb-3 ${feedback.isCorrect ? 'text-success' : 'text-danger'}`}>
                <div style={{fontSize: '4rem'}}>
                  {feedback.isCorrect ? '✅' : '❌'}
                </div>
              </div>
              <h4 className={`mb-3 ${feedback.isCorrect ? 'text-success' : 'text-danger'}`}>
                {feedback.isTimeout ? 'Time\'s Up!' : 
                 feedback.isCorrect ? (isLoggedIn ? 'Correct!' : 'Demo Complete - Correct!') : 
                 (isLoggedIn ? 'Incorrect!' : 'Demo Complete - Incorrect!')}
              </h4>
              {!feedback.isTimeout && (
                <p className="text-muted mb-3">
                  {feedback.isCorrect 
                    ? `Great job! This disaster belongs in position ${feedback.correctPosition}.`
                    : `This disaster belongs in position ${feedback.correctPosition}, not position ${feedback.userPosition}.`
                  }
                  {!isLoggedIn && (
                    <><br/><strong>Login to play the full game with multiple rounds!</strong></>
                  )}
                </p>
              )}
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setShowFeedback(false);
                  setFeedback(null);
                  
                  // Handle game continuation logic (copied from setTimeout logic)
                  const handleGameContinuation = async () => {
                    // For anonymous users, end game after 1 round (demo game)
                    if (!isLoggedIn) {
                      setGameState(prev => ({ ...prev, isCompleted: true }));
                      navigate('/themes');
                      return;
                    }
                    
                    // For logged-in users, check normal game end conditions
                    // Use current gameState values since they were already updated in submitMove
                    const newCardsWon = gameState.cardsWon;
                    const newWrongGuesses = gameState.wrongGuesses;
                    
                    if (newWrongGuesses >= 3) {
                      // Game over - too many wrong guesses
                      // Server already marked game as completed in submitMove response
                      setGameState(prev => ({ ...prev, isCompleted: true }));
                      // Show game completion message
                      setGameCompletionMessage({
                        type: 'lost',
                        title: 'Game Over!',
                        message: 'Sorry, better luck next time! You made 3 wrong guesses.',
                        icon: '😔'
                      });
                      setShowGameCompletion(true);
                    } else if (newCardsWon >= 3) {
                      // Game won - got 6 total cards (3 starting + 3 won)
                      // Server already marked game as completed in submitMove response
                      setGameState(prev => ({ ...prev, isCompleted: true }));
                      // Show game completion message
                      setGameCompletionMessage({
                        type: 'won',
                        title: 'Congratulations!',
                        message: 'You won the game! You collected all 6 disaster cards.',
                        icon: '🎉'
                      });
                      setShowGameCompletion(true);
                    } else {
                      // Load next card
                      const nextCardResult = await API.game.getNextCard(gameState.sessionId);
                      if (nextCardResult.success) {
                        setCurrentCard(nextCardResult.data);
                        setGameState(prev => ({ ...prev, timeLeft: 30 }));
                      }
                    }
                  };
                  
                  handleGameContinuation();
                }}
                style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600'}}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Completion Overlay */}
      {showGameCompletion && gameCompletionMessage && (
        <GameCompletionPopup 
          message={gameCompletionMessage}
          onComplete={() => navigate('/profile')}
        />
      )}

      {/* Fixed Top Header */}
      <div className="position-fixed w-100" style={{top: 0, left: 0, zIndex: 1050, backgroundColor: isDark ? '#2a2a2a' : '#f8f9fa', borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)'}}>
        <div className="container-fluid py-2">
          <div className="row align-items-center">
            <div className="col-md-2">
              <button 
                className="d-flex align-items-center px-3 py-1 shadow-sm"
                style={{
                  backgroundColor: 'transparent',
                  color: '#4A90E2',
                  borderColor: '#4A90E2',
                  border: '1px solid #4A90E2',
                  borderRadius: '20px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}
                onClick={() => navigate('/')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#4A90E2';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#4A90E2';
                }}
              >
                <ArrowLeft className="me-1" size={16} />
                Exit Game
              </button>
            </div>
            
            <div className="col-md-8 text-center">
              <div className="row">
                <div className="col-4">
                  <div style={{color: '#4A90E2', fontFamily: 'Poppins, sans-serif', fontWeight: '700', fontSize: '16px'}} className="fw-bold">{3 + gameState.cardsWon}/6</div>
                  <div className="small" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(26,26,26,0.8)', fontSize: '12px'}}>Total Cards</div>
                </div>
                <div className="col-4">
                  <div className="text-danger fw-bold" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '700', fontSize: '16px'}}>{gameState.wrongGuesses}/3</div>
                  <div className="small" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(26,26,26,0.8)', fontSize: '12px'}}>Wrong Guesses</div>
                </div>
                <div className="col-4">
                  <div style={{color: isDark ? 'white' : '#1a1a1a', fontFamily: 'Poppins, sans-serif', fontWeight: '700', fontSize: '16px'}} className="fw-bold">
                    {isLoggedIn ? `Round ${gameState.round}` : 'Demo Round'}
                  </div>
                  <div className="small" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(26,26,26,0.8)', fontSize: '12px'}}>
                    {isLoggedIn ? 'Current Round' : 'Single Round Demo'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-2 text-end">
            </div>
          </div>
        </div>
      </div>
      
      {/* Content with top padding to account for fixed header */}
      <div style={{paddingTop: '80px'}}>
        <div className="container py-4">
        {/* Current Question */}
        <div className="row mb-3">
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{
              backgroundColor: isDark ? 'rgba(45, 45, 45, 0.95)' : 'rgba(248, 250, 252, 0.95)', 
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, 
              borderRadius: '16px',
              backdropFilter: 'blur(10px)'
            }}>
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center">
                    <Target className="me-2" style={{color: isDark ? '#4A90E2' : '#2563eb'}} size={24} />
                      <h5 className="mb-0" style={{color: isDark ? 'white' : '#1e293b', fontFamily: 'Poppins, sans-serif', fontWeight: '600', fontSize: '16px'}}>Where does this disaster belong?</h5>
                  </div>
                  <div className="d-flex align-items-center">
                    <Timer className="me-2" style={{color: isDark ? '#4A90E2' : '#2563eb'}} size={20} />
                      <span className="fw-bold" style={{color: isDark ? '#4A90E2' : '#2563eb', fontFamily: 'Poppins, sans-serif', fontWeight: '700'}}>{gameState.timeLeft}s</span>
                      <div className="progress ms-2" style={{width: '80px', height: '6px', borderRadius: '3px', backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}}>
                        <div 
                          className="progress-bar" 
                          style={{backgroundColor: isDark ? '#4A90E2' : '#2563eb', width: `${(gameState.timeLeft / 30) * 100}%`, borderRadius: '3px'}}
                        ></div>
                      </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="card d-inline-block shadow-sm" style={{
                    maxWidth: '300px', 
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    backgroundColor: isDark ? '#2563eb' : '#3b82f6', 
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`
                  }}>
                    <img 
                      src={currentCard.image_url || currentCard.image} 
                      className="card-img-top"
                      alt="Current disaster"
                      style={{height: '160px', objectFit: 'cover', cursor: 'pointer'}}
                      onClick={() => {
                        // Optional: Could add image zoom functionality here
                      }}
                    />
                    <div className="card-body p-3" style={{minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <h6 className="card-title mb-0 text-center" style={{color: 'white', fontFamily: 'Poppins, sans-serif', fontWeight: '600', fontSize: '14px', lineHeight: '1.3', wordWrap: 'break-word', hyphens: 'auto'}}>
                        {currentCard.title}
                      </h6>
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
            <h5 className="mb-3" style={{color: 'white', fontFamily: 'Poppins, sans-serif', fontWeight: '600'}}>Your Disaster Cards</h5>
            
            {/* Cards arranged by severity with placement slots between them */}
            <div className="d-flex justify-content-center align-items-end flex-wrap" style={{gap: (() => {
              const cardCount = playerCards.length;
              if (cardCount <= 3) return '15px';
              else if (cardCount <= 5) return '12px';
              else return '10px';
            })(), minHeight: '200px'}}>
              {(() => {
                // Sort player cards by severity to display in order
                const sortedCards = [...playerCards].sort((a, b) => (a.bad_luck_severity || a.severity) - (b.bad_luck_severity || b.severity));
                const elements = [];
                
                // Dynamic sizing based on number of cards
                const getCardDimensions = (cardCount) => {
                  if (cardCount <= 3) {
                    return {
                      cardWidth: '180px',
                      cardHeight: '120px',
                      slotWidth: '80px',
                      slotHeight: '160px',
                      fontSize: '16px',
                      titleSize: '14px',
                      severityIconSize: 16,
                      severityFontSize: '14px',
                      slotPlusSize: '28px',
                      slotTextSize: '12px',
                      gap: '15px'
                    };
                  } else if (cardCount <= 5) {
                    return {
                      cardWidth: '160px',
                      cardHeight: '100px',
                      slotWidth: '70px',
                      slotHeight: '140px',
                      fontSize: '14px',
                      titleSize: '13px',
                      severityIconSize: 14,
                      severityFontSize: '13px',
                      slotPlusSize: '24px',
                      slotTextSize: '11px',
                      gap: '12px'
                    };
                  } else {
                    return {
                      cardWidth: '140px',
                      cardHeight: '85px',
                      slotWidth: '60px',
                      slotHeight: '120px',
                      fontSize: '12px',
                      titleSize: '11px',
                      severityIconSize: 12,
                      severityFontSize: '12px',
                      slotPlusSize: '20px',
                      slotTextSize: '10px',
                      gap: '10px'
                    };
                  }
                };
                
                const dimensions = getCardDimensions(sortedCards.length);
                
                // Add placement slot before first card
                elements.push(
                  <div key="slot-0" className="d-flex flex-column align-items-center">
                    <div 
                      className="border-2 p-2 text-center"
                      style={{
                        width: dimensions.slotWidth,
                        height: dimensions.slotHeight, 
                        cursor: (showFeedback || gameState.isCompleted) ? 'not-allowed' : 'pointer',
                        borderStyle: 'dashed',
                        borderColor: 'rgba(74, 144, 226, 0.5)',
                        backgroundColor: 'rgba(74, 144, 226, 0.1)',
                        borderRadius: '12px',
                        opacity: (showFeedback || gameState.isCompleted) ? 0.5 : 1,
                        fontSize: '12px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!showFeedback && !gameState.isCompleted) {
                          e.target.style.backgroundColor = 'rgba(74, 144, 226, 0.2)';
                          e.target.style.borderColor = '#4A90E2';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!showFeedback && !gameState.isCompleted) {
                          e.target.style.backgroundColor = 'rgba(74, 144, 226, 0.1)';
                          e.target.style.borderColor = 'rgba(74, 144, 226, 0.5)';
                        }
                      }}
                      onClick={() => !showFeedback && !gameState.isCompleted && handleSlotClick(0)}
                    >
                      <div className="d-flex align-items-center justify-content-center h-100">
                        <div>
                          <div style={{color: 'rgba(74, 144, 226, 0.8)', fontSize: dimensions.slotPlusSize, fontWeight: '300', lineHeight: '1'}}>+</div>
                          <div style={{color: 'rgba(74, 144, 226, 0.8)', fontSize: dimensions.slotTextSize, fontWeight: '600', marginTop: '4px', fontFamily: 'Poppins, sans-serif'}}>Place<br/>Here</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
                
                // Add cards and placement slots between them
                sortedCards.forEach((card, index) => {
                  // Add the card
                  elements.push(
                    <div key={`card-${index}`} className="d-flex flex-column align-items-center">
                      <div className="card shadow-sm" style={{width: dimensions.cardWidth, borderRadius: '12px', overflow: 'hidden', backgroundColor: isDark ? '#2563eb' : '#3b82f6', border: '1px solid rgba(255,255,255,0.2)'}}>
                        <img 
                          src={card.image_url || card.image || "/images/freepik__the-style-is-candid-image-photography-with-natural__62687.jpeg"} 
                          className="card-img-top"
                          alt={card.title}
                          style={{height: dimensions.cardHeight, objectFit: 'cover'}}
                        />
                        <div className="card-body p-2">
                          <h6 className="card-title small mb-1" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: 'white', fontSize: dimensions.titleSize, lineHeight: '1.1'}}>{card.title}</h6>
                          <div className="d-flex align-items-center justify-content-center">
                            <AlertTriangle className="me-1" style={{color: '#fbbf24'}} size={dimensions.severityIconSize} />
                            <span className="fw-bold" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '700', fontSize: dimensions.severityFontSize, color: '#fbbf24', textShadow: '0 1px 2px rgba(0,0,0,0.3)'}}>
                              {Math.round(card.bad_luck_severity || card.severity || 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                  
                  // Add placement slot after each card (except the last one gets a final slot)
                  elements.push(
                    <div key={`slot-${index + 1}`} className="d-flex flex-column align-items-center">
                      <div 
                        className="border-2 p-2 text-center"
                        style={{
                          width: dimensions.slotWidth,
                          height: dimensions.slotHeight, 
                          cursor: (showFeedback || gameState.isCompleted) ? 'not-allowed' : 'pointer',
                          borderStyle: 'dashed',
                          borderColor: 'rgba(74, 144, 226, 0.5)',
                          backgroundColor: 'rgba(74, 144, 226, 0.1)',
                          borderRadius: '12px',
                          opacity: (showFeedback || gameState.isCompleted) ? 0.5 : 1,
                          fontSize: '12px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!showFeedback && !gameState.isCompleted) {
                            e.target.style.backgroundColor = 'rgba(74, 144, 226, 0.2)';
                            e.target.style.borderColor = '#4A90E2';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!showFeedback && !gameState.isCompleted) {
                            e.target.style.backgroundColor = 'rgba(74, 144, 226, 0.1)';
                            e.target.style.borderColor = 'rgba(74, 144, 226, 0.5)';
                          }
                        }}
                        onClick={() => !showFeedback && !gameState.isCompleted && handleSlotClick(index + 1)}
                      >
                        <div className="d-flex align-items-center justify-content-center h-100">
                          <div>
                            <div style={{color: 'rgba(74, 144, 226, 0.8)', fontSize: dimensions.slotPlusSize, fontWeight: '300', lineHeight: '1'}}>+</div>
                            <div style={{color: 'rgba(74, 144, 226, 0.8)', fontSize: dimensions.slotTextSize, fontWeight: '600', marginTop: '4px', fontFamily: 'Poppins, sans-serif'}}>Place<br/>Here</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                });
                
                return elements;
              })()}
            </div>


          </div>
        </div>

        {/* Game Instructions */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{backgroundColor: isDark ? '#2563eb' : '#3b82f6', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)'}}>
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
    </div>
  );
};

export default Game; 