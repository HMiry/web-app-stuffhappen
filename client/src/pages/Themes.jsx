import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, GraduationCap, Heart, MapPin, Dumbbell, Briefcase, Home, Unlock, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import API from '../services/api.mjs';

const Themes = () => {
  const navigate = useNavigate();
  const { isLoggedIn, selectedTheme, selectTheme } = useAuth();
  const { isDark } = useTheme();
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Icon mapping for themes
  const iconMap = {
    'university': GraduationCap,
    'love': Heart,
    'travel': MapPin,
    'sports': Dumbbell,
    'work': Briefcase,
    'family': Home
  };

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        setLoading(true);
        const result = await API.theme.getAllThemes();
        
        if (result.success) {
          // Transform server data to match component expectations
          const transformedThemes = result.data.map(theme => ({
              id: theme.theme_key,
              name: theme.name,
              icon: iconMap[theme.theme_key] || GraduationCap,
              color: theme.is_active ? '#4A90E2' : '#9ca3af',
              description: theme.description,
              isActive: theme.is_active,
              requires_login: theme.requires_login,
              loginRequired: theme.requires_login && !isLoggedIn,
              lockMessage: theme.requires_login && !isLoggedIn ? 'Login Required' : (!theme.is_active ? 'Coming Soon' : null),
              backgroundImage: theme.background_image || `/images/freepik__the-style-is-candid-image-photography-with-natural__62687.jpeg`
            }));
          
          setThemes(transformedThemes);
          

          
        } else {
          setError(result.error || 'Failed to load themes');
        }
      } catch (error) {
        console.error('Error fetching themes:', error);
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, [isLoggedIn]);

  const handleThemeSelect = (themeId) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme && (theme.isActive || isLoggedIn)) {
      selectTheme(themeId);
    }
  };

  const handleStartGame = async () => {
    if (!selectedTheme) return;
    
    try {
      const result = await API.game.startGame(selectedTheme);
      if (result.success) {
        navigate('/game', { state: { gameSession: result.data } });
      } else {
        setError(result.error || 'Failed to start game');
      }
    } catch (error) {
      console.error('Error starting game:', error);
      setError('Failed to start game. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{backgroundColor: isDark ? '#1a1a1a' : '#ffffff'}}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-muted">Loading themes...</h5>
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
                  color: isDark ? 'white' : '#1a1a1a',
                  border: isDark ? '1px solid white' : '1px solid #1a1a1a',
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
                  e.currentTarget.style.backgroundColor = isDark ? 'white' : '#1a1a1a';
                  e.currentTarget.style.color = isDark ? 'black' : 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = isDark ? 'white' : '#1a1a1a';
                }}
              >
                <ArrowLeft className="me-1" size={16} />
                Back to Home
              </button>
            </div>
            
            <div className="col-md-8 text-center">
              <h4 className="mb-0" style={{color: isDark ? 'white' : '#1a1a1a', fontFamily: 'Poppins, sans-serif', fontWeight: '600', fontSize: '18px'}}>Choose Your Theme</h4>
            </div>
            
            <div className="col-md-2"></div>
          </div>
        </div>
      </div>
      
      {/* Content with top padding to account for fixed header */}
      <div style={{paddingTop: '80px'}}>
        <div className="container py-3">

        <div className="row">
          <div className="col-12 text-center mb-3">
            <h1 className="display-5 fw-bold mb-2" style={{color: isDark ? 'white' : '#1a1a1a', fontFamily: 'Poppins, sans-serif', fontWeight: '700', fontSize: '2.5rem'}}>Choose Your Disaster Domain</h1>
            <p className="mb-3" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(26,26,26,0.8)', fontSize: '16px'}}>
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
              >
                Login to unlock some more themes!
            </button>
            )}
          </div>
        </div>

        {/* Action Buttons - Show when theme is selected */}
        {selectedTheme && themes.length > 0 && themes.find(t => t.id === selectedTheme) && (
          <div className="row mb-3">
            <div className="col-12">
              <div className="card border-0 shadow-lg" style={{backgroundColor: isDark ? '#2a2a2a' : '#f8f9fa', borderRadius: '20px'}}>
                {error && (
                  <div className="alert alert-danger mb-3" role="alert">
                    {error}
                  </div>
                )}
                <div className="card-body p-3 text-center">
                  <h3 className="mb-2" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: isDark ? 'white' : '#1a1a1a', fontSize: '1.5rem'}}>
                    Ready to Face the {themes.find(t => t.id === selectedTheme)?.name} Disasters?
                  </h3>
                  <p className="mb-3" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(26,26,26,0.8)', fontSize: '14px'}}>
                    {themes.find(t => t.id === selectedTheme)?.description}
                  </p>
                  <div className="d-flex justify-content-center">
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
                      onClick={handleStartGame}
                    >
                      Start Playing
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="row g-3 mb-4">
          {themes.map((theme, index) => {
            const IconComponent = theme.icon;
            const isLocked = !theme.isActive || (theme.requires_login && !isLoggedIn);
            const isClickable = theme.isActive && (!theme.requires_login || isLoggedIn);
            
            return (
              <div key={`theme-${theme.id}-${index}`} className="col-lg-4 col-md-6">
                <div 
                  className={`card h-100 position-relative overflow-hidden ${
                    selectedTheme === theme.id && isClickable 
                      ? 'border-3' 
                      : 'border-1'
                  }`}
                  style={{
                    cursor: isClickable ? 'pointer' : 'not-allowed',
                    borderColor: selectedTheme === theme.id && isClickable ? '#4A90E2' : '#e5e7eb',
                    opacity: isLocked ? 0.6 : 1,
                    borderRadius: '24px',
                    boxShadow: selectedTheme === theme.id && isClickable ? '0 8px 25px rgba(37, 99, 235, 0.25)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
                    minHeight: '280px'
                  }}
                  onClick={() => {
                    if (isClickable) {
                      handleThemeSelect(theme.id);
                    }
                  }}
                >
                  {/* High-quality background image */}
                  <img 
                    src={theme.backgroundImage}
                    alt={theme.name}
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                      objectFit: 'cover',
                      imageRendering: 'crisp-edges',
                      WebkitImageRendering: 'crisp-edges',
                      MozImageRendering: 'crisp-edges',
                      msImageRendering: 'crisp-edges',
                      zIndex: 0
                    }}
                  />

                  {/* Background overlay */}
                  <div 
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                      backgroundColor: theme.isActive ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.5)',
                      backdropFilter: 'blur(0px)',
                      zIndex: 1
                    }}
                  ></div>

                  {/* Lock icon for locked themes */}
                  {isLocked && (
                    <div className="position-absolute top-0 end-0 p-3" style={{ zIndex: 2 }}>
                      <div 
                        className="rounded-circle d-inline-flex align-items-center justify-content-center"
                        style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: 'rgba(107, 114, 128, 0.9)',
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <Lock size={16} className="text-white" />
                      </div>
                    </div>
                  )}
                  
                  <div className="card-body p-3 text-center position-relative" style={{ zIndex: 2 }}>
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
                    
                    <h5 className="card-title mb-2 text-white" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600'}}>{theme.name}</h5>
                    
                    <p className="card-text text-white small mb-2" style={{ opacity: 0.9, fontFamily: 'Poppins, sans-serif', fontWeight: '400', fontSize: '12px' }}>
                      {theme.description}
                    </p>
                    
                    {/* Show lock message or coming soon for inactive themes */}
                    {!theme.isActive && (
                      <p className="small text-white fst-italic mb-0" style={{ opacity: 0.9, fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
                        Coming Soon
                      </p>
                    )}

                    {/* Show login required message if theme needs login */}
                    {theme.isActive && theme.requires_login && !isLoggedIn && (
                      <p className="small text-white fst-italic mb-0" style={{ opacity: 0.9, fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
                        Login Required
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
    </div>
  );
};

export default Themes; 