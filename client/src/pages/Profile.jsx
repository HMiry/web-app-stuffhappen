import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Trophy, X, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import API from '../services/api.mjs';

const Profile = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState(null);
  const [gameHistory, setGameHistory] = React.useState([]);
  const [userStats, setUserStats] = React.useState({
    gamesPlayed: 0,
    gamesWon: 0,
    totalCardsCollected: 0
  });
  const [loading, setLoading] = React.useState(true);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!user?.id || !userInfo) return;
    
    try {
      // Prepare the data to update - only send required fields
      const updateData = {
        username: userInfo.username || user.username,
        email: userInfo.email || user.email,
        name: userInfo.name || user.name
      };
      
      console.log('Updating profile with data:', updateData);
      const result = await API.user.updateProfile(user.id, updateData);
      console.log('Update result:', result);
      
      if (result.success) {
        // Update successful - close modal
        setIsEditing(false);
        
        // Update user data in AuthContext
        updateUser(updateData);
        
        // Update local state with new data
        const updatedUser = { ...user, ...updateData };
        setUserInfo(updatedUser);
        
        console.log('Profile updated successfully. New user data:', updatedUser);
      } else {
        // Show error message
        console.error('Failed to update profile:', result.error);
        alert('Failed to update profile: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form to original values
    setUserInfo(user);
  };

  const handleClearHistory = async () => {
    if (!user?.id) return;
    
    // Confirm before clearing
    const confirmed = window.confirm(
      'Are you sure you want to clear your entire game history? This action cannot be undone.'
    );
    
    if (!confirmed) return;
    
    try {
      const result = await API.user.clearHistory(user.id);
      
      if (result.success) {
        // Clear the local state
        setGameHistory([]);
        setUserStats({
          gamesPlayed: 0,
          gamesWon: 0,
          totalCardsCollected: 0
        });
        
        // Show success message
        alert('Game history cleared successfully!');
      } else {
        // Show error message
        console.error('Failed to clear history:', result.error);
        alert('Failed to clear history: ' + result.error);
      }
    } catch (error) {
      console.error('Error clearing history:', error);
      alert('Error clearing history. Please try again.');
    }
  };

  // Fetch user profile and game history
  React.useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        // Use existing user data (no separate profile needed)
        setUserInfo(user);

        // Fetch game history
        const historyResult = await API.user.getHistory(user.id);
        if (historyResult.success) {
          const history = historyResult.data;
          setGameHistory(history);

          // Calculate statistics
          const gamesPlayed = history.length;
          const gamesWon = history.filter(game => game.game_result === 'won').length;
          const totalCardsCollected = history.reduce((total, game) => total + (game.cards_won || 0), 0);

          setUserStats({
            gamesPlayed,
            gamesWon,
            totalCardsCollected
          });

          // Fetch detailed history for each game (to get round results)
          const detailedGames = await Promise.all(
            history.slice(0, 5).map(async (game) => {  // Limit to recent 5 games
              try {
                const detailedResult = await API.user.getDetailedHistory(user.id, game.id);
                if (detailedResult.success) {
                  const detailedGame = detailedResult.data;
                  
                  // Separate starting cards (round 0) from gameplay rounds (round > 0)
                  const startingCards = (detailedGame.rounds || []).filter(round => round.round === 0);
                  const gameplayRounds = (detailedGame.rounds || []).filter(round => round.round > 0);
                  
                  // Calculate total cards collected (starting 3 + won cards)
                  const totalCardsCollected = 3 + (game.cards_won || 0);
                  
                  return {
                    id: game.id,
                    result: game.game_result,
                    date: new Date(game.time_started).toISOString().split('T')[0],
                    theme: game.theme_name || 'Unknown Theme',
                    cardsWon: game.cards_won || 0,
                    totalCardsCollected: totalCardsCollected,
                    targetCards: 6, // Total cards needed to win (3 starting + 3 won)
                    rounds: gameplayRounds.length, // Count only actual gameplay rounds (excluding round 0)
                    startingCards: startingCards, // Starting hand cards
                    gameplayRounds: gameplayRounds, // Cards presented during gameplay
                    allRounds: detailedGame.rounds || [] // All rounds for reference
                  };
                }
                return null;
              } catch (error) {
                console.error('Error fetching detailed game:', error);
                return null;
              }
            })
          );

          // Filter out failed requests and update gameHistory
          setGameHistory(detailedGames.filter(game => game !== null));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{backgroundColor: isDark ? '#1a1a1a' : '#ffffff'}}>
        <div className="text-center">
          <h4 style={{color: isDark ? 'white' : '#1a1a1a', fontFamily: 'Poppins, sans-serif', fontWeight: '600'}}>Please log in to view your profile</h4>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => navigate('/login')}
            style={{
              backgroundColor: '#4A90E2',
              borderColor: '#4A90E2',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: '500',
              borderRadius: '10px'
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{backgroundColor: isDark ? '#1a1a1a' : '#ffffff'}}>
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
                Back to Home
              </button>
            </div>
            
            <div className="col-md-8 text-center">
              <h4 className="mb-0" style={{color: isDark ? 'white' : '#1a1a1a', fontFamily: 'Poppins, sans-serif', fontWeight: '600', fontSize: '18px'}}>Profile</h4>
            </div>
            
            <div className="col-md-2"></div>
          </div>
        </div>
      </div>
      
      {/* Content with top padding to account for fixed header */}
      <div style={{paddingTop: '80px'}}>
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {/* Profile Header */}
              <div className="card border-0 shadow-lg mb-4" style={{backgroundColor: isDark ? '#2a2a2a' : '#ffffff', borderRadius: '24px', border: isDark ? '1px solid #333333' : '1px solid rgba(0,0,0,0.1)'}}>
                <div className="card-body p-5" style={{color: isDark ? 'white' : '#1a1a1a'}}>
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle p-3 me-3" style={{backgroundColor: '#4A90E2', backdropFilter: 'blur(10px)'}}>
                        <User size={32} style={{color: 'white'}} />
                      </div>
                      <div>
                        <h3 className="mb-1" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: isDark ? 'white' : '#1a1a1a'}}>{userInfo?.name || user?.name || 'Loading...'}</h3>
                        <p className="mb-0" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? '#cccccc' : 'rgba(26,26,26,0.8)'}}>{userInfo?.email || user?.email || 'Loading...'}</p>
                      </div>
                    </div>
                    <button 
                      className="btn d-flex align-items-center px-3 py-2"
                      style={{
                        backgroundColor: '#4A90E2',
                        borderColor: '#4A90E2',
                        border: '1px solid #4A90E2',
                        color: 'white',
                        borderRadius: '10px',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={handleEditProfile}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#3A7BD5';
                        e.currentTarget.style.borderColor = '#3A7BD5';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#4A90E2';
                        e.currentTarget.style.borderColor = '#4A90E2';
                      }}
                    >
                      <User size={16} className="me-2" />
                      Edit Profile
                    </button>
                  </div>
                  
                  <div className="row text-center">
                    <div className="col-4">
                      <div className="h2 fw-bold mb-0" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '700', color: '#4A90E2'}}>
                        {loading ? '...' : userStats.gamesPlayed}
                      </div>
                      <div className="small" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? '#cccccc' : 'rgba(26,26,26,0.8)'}}>Games Played</div>
                    </div>
                    <div className="col-4">
                      <div className="h2 fw-bold mb-0" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '700', color: '#4A90E2'}}>
                        {loading ? '...' : userStats.gamesWon}
                      </div>
                      <div className="small" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? '#cccccc' : 'rgba(26,26,26,0.8)'}}>Games Won</div>
                    </div>
                    <div className="col-4">
                      <div className="h2 fw-bold mb-0" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '700', color: '#4A90E2'}}>
                        {loading ? '...' : userStats.totalCardsCollected}
                      </div>
                      <div className="small" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? '#cccccc' : 'rgba(26,26,26,0.8)'}}>Total Cards Collected</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Game History */}
              <div className="mb-4">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div className="d-flex align-items-center">
                  <img 
                    src="/images/logo1.png" 
                    alt="Logo" 
                    className="img-fluid me-3"
                    style={{ 
                      maxHeight: '60px',
                      borderRadius: '16px',
                      backgroundColor: 'rgba(74, 144, 226, 0.1)',
                      padding: '12px',
                      border: '2px solid rgba(74, 144, 226, 0.3)',
                      boxShadow: '0 4px 12px rgba(74, 144, 226, 0.15)'
                    }}
                  />
                  <h4 className="mb-0" style={{color: '#4A90E2', fontFamily: 'Poppins, sans-serif', fontWeight: '600'}}>Game History</h4>
                  </div>
                  {gameHistory.length > 0 && (
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={handleClearHistory}
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: '500',
                        fontSize: '12px',
                        borderRadius: '20px',
                        padding: '6px 16px'
                      }}
                    >
                      Clear History
                    </button>
                  )}
                </div>
                
                {loading ? (
                  <div className="text-center p-4">
                    <div style={{color: isDark ? '#cccccc' : 'rgba(26,26,26,0.8)', fontFamily: 'Poppins, sans-serif'}}>Loading game history...</div>
                  </div>
                ) : gameHistory.length === 0 ? (
                  <div className="text-center p-4">
                    <div style={{color: isDark ? '#cccccc' : 'rgba(26,26,26,0.8)', fontFamily: 'Poppins, sans-serif'}}>No games played yet. Start your first game!</div>
                  </div>
                ) : gameHistory.map((game) => (
                  <div key={game.id} className="card border-0 shadow-sm mb-3" style={{borderRadius: '20px', backgroundColor: isDark ? '#2a2a2a' : '#f8f9fa', border: isDark ? '1px solid #333333' : '1px solid rgba(0,0,0,0.1)'}}>
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center">
                          <div className={`rounded-circle p-3 me-3 shadow-sm ${game.result === 'won' ? 'bg-success' : 'bg-danger'}`}>
                            <Trophy size={20} className="text-white" />
                          </div>
                          <div>
                            <h6 className="mb-1 fw-bold" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: isDark ? 'white' : '#1a1a1a'}}>
                              Game {game.result === 'won' ? 'Won' : 'Lost'}
                            </h6>
                            <div className="small" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? '#cccccc' : 'rgba(26,26,26,0.8)'}}>
                              {game.date} • {game.theme}
                            </div>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: '#4A90E2'}}>
                            {game.totalCardsCollected}/{game.targetCards} Total Cards
                          </div>
                          <div className="small" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? '#cccccc' : 'rgba(26,26,26,0.8)'}}>
                            {game.rounds} Rounds Played • {game.cardsWon} Cards Won
                          </div>
                        </div>
                      </div>
                      
                      {/* Complete Card History */}
                      <div className="mt-3">
                        <div className="small fw-semibold mb-3" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: isDark ? 'white' : '#1a1a1a'}}>
                          All Cards Involved in Game:
                        </div>
                        
                        {/* Starting Cards Section */}
                        <div className="mb-3">
                          <div className="small fw-semibold mb-2" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '500', color: '#4A90E2'}}>
                            Starting Hand (3 cards):
                          </div>
                          {game.startingCards && game.startingCards.length > 0 ? (
                            game.startingCards.map((card, index) => (
                              <div key={`start-${index}`} className="d-flex align-items-center mb-1 ms-3">
                                <div className="me-2" style={{width: '20px'}}>
                                  <div className="rounded-circle bg-secondary" style={{width: '8px', height: '8px'}}></div>
                                </div>
                                <div className="small" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? '#cccccc' : 'rgba(26,26,26,0.8)'}}>
                                  <span className="fw-semibold" style={{color: isDark ? 'white' : '#1a1a1a'}}>{card.disaster}</span>{' '}
                                  <span className="text-muted">(Initial Card)</span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="small text-muted ms-3">No starting cards data available</div>
                          )}
                        </div>

                        {/* Gameplay Rounds Section */}
                        <div className="mb-2">
                          <div className="small fw-semibold mb-2" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '500', color: '#4A90E2'}}>
                            Cards Presented During Game:
                          </div>
                          {game.gameplayRounds && game.gameplayRounds.length > 0 ? (
                            game.gameplayRounds.map((round, index) => (
                              <div key={`round-${index}`} className="d-flex align-items-center mb-1 ms-3">
                            <div className="me-2" style={{width: '20px'}}>
                              {round.result === 'correct' ? (
                                <Check size={16} className="text-success" />
                              ) : (
                                <X size={16} className="text-danger" />
                              )}
                            </div>
                            <div className="small" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? '#cccccc' : 'rgba(26,26,26,0.8)'}}>
                                  <span className="fw-semibold" style={{color: isDark ? 'white' : '#1a1a1a'}}>{round.disaster}</span>{' '}
                              <span className={round.result === 'correct' ? 'text-success' : 'text-danger'}>
                                    ({round.result === 'correct' ? 'Won' : 'Not Won'} in Round {round.round})
                              </span>
                            </div>
                          </div>
                            ))
                          ) : (
                            <div className="small text-muted ms-3">No gameplay rounds completed</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ready for Another Challenge */}
              <div className="card border-0 shadow-lg" style={{borderRadius: '24px', background: 'linear-gradient(135deg, #4A90E2 0%, #3A7BD5 100%)'}}>
                <div className="card-body p-5 text-center text-white">
                  <h5 className="mb-3" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600'}}>Ready for Another Challenge?</h5>
                  <p className="mb-4" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', opacity: '0.9'}}>
                    Test your disaster management skills once more!
                  </p>
                  <button 
                    className="btn btn-lg px-5"
                    style={{
                      backgroundColor: 'white',
                      borderColor: 'white',
                      color: '#4A90E2',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: '600',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => navigate('/themes')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f0f0f0';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    Start New Game
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditing && (
          <div 
            className="modal fade show d-block" 
            style={{backgroundColor: 'rgba(0,0,0,0.8)'}}
            onClick={handleCancelEdit}
          >
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content" style={{borderRadius: '20px', border: 'none', backgroundColor: isDark ? '#2a2a2a' : '#ffffff'}}>
                <div className="modal-header border-0 pb-0" style={{borderBottom: isDark ? '1px solid #333333' : '1px solid rgba(0,0,0,0.1)'}}>
                  <h5 className="modal-title" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: '#4A90E2'}}>
                    Edit Profile
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={handleCancelEdit}
                    style={{filter: isDark ? 'invert(1)' : 'none'}}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <form>
                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{fontFamily: 'Poppins, sans-serif', color: isDark ? 'white' : '#1a1a1a'}}>
                        Username
                      </label>
                      <input
                        type="text"
                        className="form-control py-2"
                        value={userInfo?.username || ''}
                        onChange={(e) => setUserInfo({...userInfo, username: e.target.value})}
                        style={{
                          borderColor: '#4A90E2',
                          borderRadius: '8px',
                          fontFamily: 'Poppins, sans-serif',
                          backgroundColor: isDark ? '#333333' : '#ffffff',
                          color: isDark ? 'white' : '#1a1a1a',
                          border: '1px solid #4A90E2'
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{fontFamily: 'Poppins, sans-serif', color: isDark ? 'white' : '#1a1a1a'}}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control py-2"
                        value={userInfo?.name || ''}
                        onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                        style={{
                          borderColor: '#4A90E2',
                          borderRadius: '8px',
                          fontFamily: 'Poppins, sans-serif',
                          backgroundColor: isDark ? '#333333' : '#ffffff',
                          color: isDark ? 'white' : '#1a1a1a',
                          border: '1px solid #4A90E2'
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{fontFamily: 'Poppins, sans-serif', color: isDark ? 'white' : '#1a1a1a'}}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control py-2"
                        value={userInfo?.email || ''}
                        onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                        style={{
                          borderColor: '#4A90E2',
                          borderRadius: '8px',
                          fontFamily: 'Poppins, sans-serif',
                          backgroundColor: isDark ? '#333333' : '#ffffff',
                          color: isDark ? 'white' : '#1a1a1a',
                          border: '1px solid #4A90E2'
                        }}
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer border-0 pt-0" style={{borderTop: isDark ? '1px solid #333333' : '1px solid rgba(0,0,0,0.1)'}}>
                  <button 
                    type="button" 
                    className="btn me-2 px-4 py-2"
                    onClick={handleCancelEdit}
                    style={{
                      backgroundColor: isDark ? '#333333' : '#f8f9fa',
                      borderColor: isDark ? '#555555' : 'rgba(0,0,0,0.1)',
                      color: isDark ? '#cccccc' : '#6c757d',
                      borderRadius: '8px',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: '500',
                      border: isDark ? '1px solid #555555' : '1px solid rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isDark ? '#444444' : '#e9ecef';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isDark ? '#333333' : '#f8f9fa';
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn px-4 py-2"
                    onClick={handleSaveProfile}
                    style={{
                      backgroundColor: '#4A90E2',
                      borderColor: '#4A90E2',
                      color: 'white',
                      borderRadius: '8px',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#3A7BD5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#4A90E2';
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 