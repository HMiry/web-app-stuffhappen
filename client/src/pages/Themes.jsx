import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, GraduationCap, Heart, MapPin, Dumbbell, Briefcase, Home, Unlock, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Themes = () => {
  const navigate = useNavigate();
  const { isLoggedIn, selectedTheme, selectTheme } = useAuth();

  const themes = [
    {
      id: 'university',
      name: 'University Life',
      icon: GraduationCap,
      color: '#4A90E2',
      description: 'Academic disasters, dorm room catastrophes, and campus embarrassments',
      isActive: true,
      badge: null,
      backgroundImage: '/images/freepik__the-style-is-candid-image-photography-with-natural__62682.jpeg',
      limitation: isLoggedIn ? null : 'Demo: 1 round only'
    },
    {
      id: 'love',
      name: 'Love & Dating',
      icon: Heart,
      color: '#9ca3af',
      description: 'Romantic disasters and relationship catastrophes',
      isActive: isLoggedIn,
      loginRequired: !isLoggedIn,
      lockMessage: 'Login Required',
      backgroundImage: '/images/freepik__the-style-is-candid-image-photography-with-natural__62689.jpeg'
    },
    {
      id: 'travel',
      name: 'Travel & Tourism',
      icon: MapPin,
      color: '#9ca3af',
      description: 'Vacation nightmares and travel mishaps',
      isActive: false,
      loginRequired: !isLoggedIn,
      lockMessage: 'Coming Soon',
      backgroundImage: '/images/freepik__the-style-is-candid-image-photography-with-natural__62690.jpeg'
    },
    {
      id: 'sports',
      name: 'Sports & Fitness',
      icon: Dumbbell,
      color: '#9ca3af',
      description: 'Gym embarrassments and athletic accidents',
      isActive: false,
      loginRequired: !isLoggedIn,
      lockMessage: 'Coming Soon',
      backgroundImage: '/images/freepik__the-style-is-candid-image-photography-with-natural__62691.jpeg'
    },
    {
      id: 'work',
      name: 'Work Life',
      icon: Briefcase,
      color: '#9ca3af',
      description: 'Office disasters and career catastrophes',
      isActive: false,
      loginRequired: !isLoggedIn,
      lockMessage: 'Coming Soon',
      backgroundImage: '/images/freepik__the-style-is-candid-image-photography-with-natural__62687.jpeg'
    },
    {
      id: 'family',
      name: 'Family Life',
      icon: Home,
      color: '#9ca3af',
      description: 'Household disasters and family embarrassments',
      isActive: false,
      loginRequired: !isLoggedIn,
      lockMessage: 'Coming Soon',
      backgroundImage: '/images/freepik__the-style-is-candid-image-photography-with-natural__62688.jpeg'
    }
  ];

  const handleThemeSelect = (themeId) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme && (theme.isActive || isLoggedIn)) {
      selectTheme(themeId);
      console.log('Theme selected:', themeId); // Debug log
    }
  };

  return (
    <div className="min-vh-100" style={{backgroundColor: '#1a1a1a'}}>
      <div className="container py-3">
        {/* Back to Home */}
        <div className="row mb-3">
          <div className="col-12">
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
              <ArrowLeft className="me-2" size={20} />
              Back to Home
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-12 text-center mb-3">
            <h1 className="display-5 fw-bold mb-2" style={{color: 'white', fontFamily: 'Poppins, sans-serif', fontWeight: '700', fontSize: '2.5rem'}}>Choose Your Disaster Domain</h1>
            <p className="mb-3" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: 'rgba(255,255,255,0.8)', fontSize: '16px'}}>
              Each theme brings its own unique collection of horrible situations.
            </p>
            {!isLoggedIn && (
              <button 
                className="btn px-4 py-2 shadow-sm"
                style={{
                  backgroundColor: '#4A90E2',
                  color: 'white',
                  border: '2px solid #4A90E2',
                  borderRadius: '25px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => navigate('/login')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '#4A90E2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#4A90E2';
                  e.currentTarget.style.color = 'white';
                }}
              >
                Login to unlock some more themes!
            </button>
            )}
          </div>
        </div>

        {/* Action Buttons - Show when theme is selected */}
        {selectedTheme && (
          <div className="row mb-3">
            <div className="col-12">
              <div className="card border-0 shadow-lg" style={{backgroundColor: '#1a1a1a', borderRadius: '20px'}}>
                <div className="card-body p-3 text-center">
                  <h3 className="mb-2" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: 'white', fontSize: '1.5rem'}}>
                    Ready to Face the {themes.find(t => t.id === selectedTheme)?.name} Disasters?
                  </h3>
                  <p className="mb-3" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: 'rgba(255,255,255,0.8)', fontSize: '14px'}}>
                    {themes.find(t => t.id === selectedTheme)?.description}
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <button 
                      className="btn btn-lg px-5 py-3" 
                      style={{
                        backgroundColor: '#4A90E2',
                        color: 'white',
                        border: '2px solid #4A90E2',
                        borderRadius: '50px',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: '600',
                        fontSize: '16px',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => navigate('/game')}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.color = '#4A90E2';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(74, 144, 226, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#4A90E2';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.transform = 'translateY(0px)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      Start Playing
                    </button>

                    {!isLoggedIn && (
                      <button 
                        className="btn btn-lg px-5 py-3" 
                        style={{
                          backgroundColor: 'transparent',
                          color: 'white',
                          border: '2px solid white',
                          borderRadius: '50px',
                          fontFamily: 'Poppins, sans-serif',
                          fontWeight: '600',
                          fontSize: '16px',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => navigate('/demo')}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'white';
                          e.currentTarget.style.color = 'black';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 255, 255, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.transform = 'translateY(0px)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        Try Demo First
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="row g-3 mb-4">
          {themes.map((theme) => {
            const IconComponent = theme.icon;
            const isLocked = theme.loginRequired && !isLoggedIn;
            
            return (
              <div key={theme.id} className="col-lg-4 col-md-6">
                <div 
                  className={`card h-100 position-relative overflow-hidden ${
                    selectedTheme === theme.id && theme.isActive 
                      ? 'border-3' 
                      : 'border-1'
                  }`}
                  style={{
                    cursor: (isLocked || !theme.isActive) && !isLoggedIn ? 'not-allowed' : 'pointer',
                    borderColor: selectedTheme === theme.id && (theme.isActive || isLoggedIn) ? '#4A90E2' : '#e5e7eb',
                    opacity: (isLocked || !theme.isActive) && !isLoggedIn ? 0.7 : 1,
                    backgroundImage: `url(${theme.backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '24px',
                    boxShadow: selectedTheme === theme.id && (theme.isActive || isLoggedIn) ? '0 8px 25px rgba(37, 99, 235, 0.25)' : '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                  onClick={() => {
                    if ((theme.isActive || isLoggedIn) && !(isLocked && !isLoggedIn)) {
                      handleThemeSelect(theme.id);
                    }
                  }}
                >
                  {/* Background overlay */}
                  <div 
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                      backgroundColor: theme.isActive ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.7)',
                      backdropFilter: 'blur(1px)'
                    }}
                  ></div>

                  {/* Lock icon for locked themes */}
                  {isLocked && (
                    <div className="position-absolute top-0 end-0 p-3" style={{ zIndex: 2 }}>
                      <Lock size={20} className="text-white" />
                    </div>
                  )}
                  
                  <div className="card-body p-3 text-center position-relative" style={{ zIndex: 1 }}>
                    <div className="mb-2">
                      <div 
                        className="rounded-circle d-inline-flex align-items-center justify-content-center"
                        style={{
                          width: '60px',
                          height: '60px',
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(10px)',
                          border: '2px solid rgba(255, 255, 255, 0.3)'
                        }}
                      >
                        <IconComponent 
                          size={24} 
                          color="white"
                        />
                      </div>
                    </div>
                    
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <h5 className="card-title mb-0 me-2 text-white" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600'}}>{theme.name}</h5>
                      {theme.badge && (
                        <span className={`badge ${theme.isActive ? 'bg-success' : 'bg-warning'}`} style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600'}}>
                          {theme.badge}
                        </span>
                      )}
                    </div>
                    
                    {/* Show limitation for University theme when not logged in */}
                    {theme.limitation && (
                      <div className="badge bg-success mb-3" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', fontSize: '12px' }}>
                        {theme.limitation}
                      </div>
                    )}
                    
                    <p className="card-text text-white small mb-2" style={{ opacity: 0.9, fontFamily: 'Poppins, sans-serif', fontWeight: '400', fontSize: '12px' }}>
                      {theme.description}
                    </p>
                    
                    {isLocked && (
                      <p className="small text-white fst-italic" style={{ opacity: 0.8, fontFamily: 'Poppins, sans-serif', fontWeight: '400' }}>
                        {theme.lockMessage}
                      </p>
                    )}

                    {/* Show "Coming Soon" for inactive themes when logged in */}
                    {!theme.isActive && isLoggedIn && !isLocked && (
                      <p className="small text-white fst-italic" style={{ opacity: 0.8, fontFamily: 'Poppins, sans-serif', fontWeight: '400' }}>
                        Coming Soon
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* More Themes Coming Soon Section */}
        <div className="row">
          <div className="col-12">
            <div className="card text-white border-0 shadow-lg" style={{background: 'linear-gradient(135deg, #4A90E2 0%, #3A7BD5 100%)', borderRadius: '24px'}}>
              <div className="card-body p-5 text-center">
                <h3 className="card-title mb-3" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600'}}>
                  More Themes Coming Soon!
                </h3>
                <p className="card-text mb-4" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', opacity: '0.9'}}>
                  We're working on exciting new themes. Stay tuned for more disaster-ranking fun!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Themes; 