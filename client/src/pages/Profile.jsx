import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Trophy, X, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Profile = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [isEditing, setIsEditing] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState({
    name: 'Student Player',
    email: 'student@university.edu',
    university: 'Sample University',
    major: 'Computer Science'
  });

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Here you would save to backend
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form if needed
  };

  const gameHistory = [
    {
      id: 1,
      result: 'won',
      date: '2024-06-01',
      theme: 'University Life',
      cardsWon: 6,
      totalCards: 6,
      rounds: 6,
      roundResults: [
        { round: 1, disaster: 'Failed your thesis defense', result: 'correct' },
        { round: 2, disaster: 'Emailed professor at 3 AM', result: 'correct' },
        { round: 3, disaster: 'Slept through final exam', result: 'incorrect' },
        { round: 4, disaster: 'Forgot to submit assignment', result: 'correct' },
        { round: 5, disaster: 'Spilled coffee on laptop', result: 'correct' },
        { round: 6, disaster: 'Lost student ID before graduation', result: 'correct' }
      ]
    },
    {
      id: 2,
      result: 'lost',
      date: '2024-05-30',
      theme: 'University Life',
      cardsWon: 3,
      totalCards: 6,
      rounds: 5,
      roundResults: [
        { round: 1, disaster: 'Missed graduation ceremony', result: 'correct' },
        { round: 2, disaster: 'Failed all courses in semester', result: 'incorrect' },
        { round: 3, disaster: 'Locked out of dorm room naked', result: 'correct' },
        { round: 4, disaster: 'Professor caught you cheating', result: 'incorrect' },
        { round: 5, disaster: 'Accidentally deleted final project', result: 'incorrect' }
      ]
    }
  ];

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
                      <h3 className="mb-1" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: isDark ? 'white' : '#1a1a1a'}}>{userInfo.name}</h3>
                      <p className="mb-0" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? '#cccccc' : 'rgba(26,26,26,0.8)'}}>{userInfo.email}</p>
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
                    <div className="h2 fw-bold mb-0" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '700', color: '#4A90E2'}}>15</div>
                    <div className="small" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? '#cccccc' : 'rgba(26,26,26,0.8)'}}>Games Played</div>
                  </div>
                  <div className="col-4">
                    <div className="h2 fw-bold mb-0" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '700', color: '#4A90E2'}}>8</div>
                    <div className="small" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? '#cccccc' : 'rgba(26,26,26,0.8)'}}>Games Won</div>
                  </div>
                  <div className="col-4">
                    <div className="h2 fw-bold mb-0" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '700', color: '#4A90E2'}}>47</div>
                    <div className="small" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? '#cccccc' : 'rgba(26,26,26,0.8)'}}>Total Cards Collected</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Game History */}
            <div className="mb-4">
              <div className="d-flex align-items-center mb-4">
                <img 
                  src="/images/logo.png" 
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
              
              {gameHistory.map((game) => (
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
                        <div className="fw-bold" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: '#4A90E2'}}>{game.cardsWon}/{game.totalCards} Cards</div>
                        <div className="small" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? '#cccccc' : 'rgba(26,26,26,0.8)'}}>{game.rounds} Rounds</div>
                      </div>
                    </div>
                    
                    <div className="mb-3 p-3 rounded-3" style={{backgroundColor: isDark ? '#333333' : '#e9ecef'}}>
                      <div className="small fw-semibold mb-2" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: isDark ? 'white' : '#1a1a1a'}}>Cards Played:</div>
                      {game.roundResults.map((round, index) => (
                        <div key={index} className="d-flex align-items-center mb-1">
                          <div className="me-2" style={{width: '20px'}}>
                            {round.result === 'correct' ? (
                              <Check size={16} className="text-success" />
                            ) : (
                              <X size={16} className="text-danger" />
                            )}
                          </div>
                          <div className="small" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? '#cccccc' : 'rgba(26,26,26,0.8)'}}>
                            <span className="fw-semibold" style={{color: isDark ? 'white' : '#1a1a1a'}}>Round {round.round}:</span>{' '}
                            <span className={round.result === 'correct' ? 'text-success' : 'text-danger'}>
                              {round.disaster} {round.result === 'correct' ? '✓' : '✗'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Card Collection Gallery */}
            <div className="mb-4">
              <h4 className="mb-4" style={{color: '#4A90E2', fontFamily: 'Poppins, sans-serif', fontWeight: '600'}}>Your Card Collection</h4>
              <div className="card border-0 shadow-lg" style={{borderRadius: '24px', backgroundColor: isDark ? '#2a2a2a' : '#f8f9fa', border: isDark ? '1px solid #333333' : '1px solid rgba(0,0,0,0.1)'}}>
                <div className="card-body p-5">
                  <p className="mb-4" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? '#cccccc' : 'rgba(26,26,26,0.8)'}}>Disaster environments you've encountered in your journey</p>
                  <div className="row g-4">
                    <div className="col-md-4 col-sm-6">
                                              <div className="card border-0 shadow-sm h-100" style={{borderRadius: '16px', overflow: 'hidden', backgroundColor: isDark ? '#333333' : '#ffffff', border: isDark ? '1px solid #555555' : '1px solid rgba(0,0,0,0.1)'}}>
                          <img 
                            src="/images/freepik__the-style-is-candid-image-photography-with-natural__62682.jpeg"
                            className="card-img-top"
                            style={{ height: '140px', objectFit: 'cover' }}
                            alt="Campus Environment"
                          />
                          <div className="card-body p-3 text-center">
                            <small className="fw-semibold" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: isDark ? 'white' : '#1a1a1a'}}>Campus Life</small>
                          </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6">
                                              <div className="card border-0 shadow-sm h-100" style={{borderRadius: '16px', overflow: 'hidden', backgroundColor: isDark ? '#333333' : '#ffffff', border: isDark ? '1px solid #555555' : '1px solid rgba(0,0,0,0.1)'}}>
                          <img 
                            src="/images/freepik__the-style-is-candid-image-photography-with-natural__62683.jpeg"
                            className="card-img-top"
                            style={{ height: '140px', objectFit: 'cover' }}
                            alt="Study Environment"
                          />
                          <div className="card-body p-3 text-center">
                            <small className="fw-semibold" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: isDark ? 'white' : '#1a1a1a'}}>Study Disasters</small>
                          </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6">
                                              <div className="card border-0 shadow-sm h-100" style={{borderRadius: '16px', overflow: 'hidden', backgroundColor: isDark ? '#333333' : '#ffffff', border: isDark ? '1px solid #555555' : '1px solid rgba(0,0,0,0.1)'}}>
                          <img 
                            src="/images/freepik__the-style-is-candid-image-photography-with-natural__62684.jpeg"
                            className="card-img-top"
                            style={{ height: '140px', objectFit: 'cover' }}
                            alt="Social Environment"
                          />
                          <div className="card-body p-3 text-center">
                            <small className="fw-semibold" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: isDark ? 'white' : '#1a1a1a'}}>Social Mishaps</small>
                          </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6">
                                              <div className="card border-0 shadow-sm h-100" style={{borderRadius: '16px', overflow: 'hidden', backgroundColor: isDark ? '#333333' : '#ffffff', border: isDark ? '1px solid #555555' : '1px solid rgba(0,0,0,0.1)'}}>
                          <img 
                            src="/images/freepik__the-style-is-candid-image-photography-with-natural__62685.jpeg"
                            className="card-img-top"
                            style={{ height: '140px', objectFit: 'cover' }}
                            alt="Academic Environment"
                          />
                          <div className="card-body p-3 text-center">
                            <small className="fw-semibold" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: isDark ? 'white' : '#1a1a1a'}}>Academic Chaos</small>
                          </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6">
                                              <div className="card border-0 shadow-sm h-100" style={{borderRadius: '16px', overflow: 'hidden', backgroundColor: isDark ? '#333333' : '#ffffff', border: isDark ? '1px solid #555555' : '1px solid rgba(0,0,0,0.1)'}}>
                          <img 
                            src="/images/freepik__the-style-is-candid-image-photography-with-natural__62687.jpeg"
                            className="card-img-top"
                            style={{ height: '140px', objectFit: 'cover' }}
                            alt="Dorm Environment"
                          />
                          <div className="card-body p-3 text-center">
                            <small className="fw-semibold" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: isDark ? 'white' : '#1a1a1a'}}>Dorm Life</small>
                          </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6">
                                              <div className="card border-0 shadow-sm h-100" style={{borderRadius: '16px', overflow: 'hidden', backgroundColor: isDark ? '#333333' : '#ffffff', border: isDark ? '1px solid #555555' : '1px solid rgba(0,0,0,0.1)'}}>
                          <img 
                            src="/images/freepik__the-style-is-candid-image-photography-with-natural__62688.jpeg"
                            className="card-img-top"
                            style={{ height: '140px', objectFit: 'cover' }}
                            alt="Campus Events"
                          />
                          <div className="card-body p-3 text-center">
                            <small className="fw-semibold" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: isDark ? 'white' : '#1a1a1a'}}>Campus Events</small>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
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
                  onClick={() => navigate('/game')}
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
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control py-2"
                      value={userInfo.name}
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
                      value={userInfo.email}
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
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{fontFamily: 'Poppins, sans-serif', color: isDark ? 'white' : '#1a1a1a'}}>
                      University
                    </label>
                    <input
                      type="text"
                      className="form-control py-2"
                      value={userInfo.university}
                      onChange={(e) => setUserInfo({...userInfo, university: e.target.value})}
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
                  <div className="mb-4">
                    <label className="form-label fw-semibold" style={{fontFamily: 'Poppins, sans-serif', color: isDark ? 'white' : '#1a1a1a'}}>
                      Major
                    </label>
                    <input
                      type="text"
                      className="form-control py-2"
                      value={userInfo.major}
                      onChange={(e) => setUserInfo({...userInfo, major: e.target.value})}
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