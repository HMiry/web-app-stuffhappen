import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Clock, Trophy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

const Homepage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <div 
      className="position-relative"
      style={{
        backgroundImage: 'url(/images/freepik__the-style-is-candid-image-photography-with-natural__62687.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh'
      }}
    >
      {/* Background overlay */}
      <div 
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)'
        }}
      ></div>
      
      {/* Theme Toggle - Fixed to Top Left Corner */}
      <div className="position-fixed" style={{top: '20px', left: '20px', zIndex: 1000}}>
        <ThemeToggle />
      </div>

      {/* Login/User Section - Fixed to Top Right Corner */}
      <div className="position-fixed" style={{top: '20px', right: '20px', zIndex: 1000}}>
          {isLoggedIn ? (
            <div className="d-flex align-items-center gap-3">
              <button 
              className="d-flex align-items-center p-0 border-0 bg-transparent"
              style={{
                color: 'white', 
                fontWeight: '500',
                fontFamily: 'Poppins, sans-serif',
                cursor: 'pointer',
                textDecoration: 'none',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              }}
                onClick={() => navigate('/profile')}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#4A90E2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'white';
              }}
              >
                {user?.name || user?.username || 'Student Player'}
              </button>
              <button 
              className="px-3 py-2"
              style={{
                backgroundColor: '#4A90E2',
                color: 'white',
                border: '2px solid #4A90E2',
                borderRadius: '25px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
                onClick={() => logout()}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#4A90E2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#4A90E2';
                e.currentTarget.style.color = 'white';
              }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
            className="px-4 py-2"
            style={{
              backgroundColor: '#4A90E2',
              color: 'white',
              border: '2px solid #4A90E2',
              borderRadius: '25px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: '500',
              cursor: 'pointer',
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
            Login
            </button>
          )}
        </div>

      <div className="container position-relative py-5">
        {/* Main Title with Exclamation */}
        <div className="text-center mb-5">
          <div className="d-flex justify-content-center align-items-center">
            <h1 
              className="display-1 fw-bold mb-0 me-3"
              style={{
                color: 'white',
                fontFamily: 'Fredoka One, Arial, sans-serif',
                fontSize: '3rem',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              STUFF HAPPENS
            </h1>
            <div 
              className="rounded-4 d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: '#fbbf24',
                width: '60px',
                height: '70px',
                border: '3px solid #1e293b',
                transform: 'rotate(-8deg)'
              }}
            >
              <div style={{color: '#1e293b', fontSize: '40px', fontWeight: '900', lineHeight: '1', transform: 'rotate(180deg)'}}>
                !
              </div>
            </div>
          </div>
        </div>
        
        {/* Feature Cards */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="text-center text-white">
              <div className="mb-3">
                <Target size={48} style={{ color: '#4A90E2' }} />
              </div>
              <h3 
                className="h4 mb-3"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '600',
                  color: '#4A90E2'
                }}
              >
                Scale of Chaos
              </h3>
              <p 
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '16px',
                  opacity: 0.9
                }}
              >
                From "mildly annoying" to "life-ending catastrophe" - where does your disaster fit?
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="text-center text-white">
              <div className="mb-3">
                <Clock size={48} style={{ color: '#4A90E2' }} />
              </div>
              <h3 
                className="h4 mb-3"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '600',
                  color: '#4A90E2'
                }}
              >
                Pressure Cooker
              </h3>
              <p 
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '16px',
                  opacity: 0.9
                }}
              >
                Quick thinking under pressure - you've got 30 seconds to decide before chaos strikes!
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="text-center text-white">
              <div className="mb-3">
                <Trophy size={48} style={{ color: '#4A90E2' }} />
              </div>
              <h3 
                className="h4 mb-3"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '600',
                  color: '#4A90E2'
                }}
              >
                Survival Mode
              </h3>
              <p 
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '16px',
                  opacity: 0.9
                }}
              >
                Collect 6 disaster cards to prove you're a chaos expert - but 3 wrong moves and you're out!
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          <div className="d-flex gap-4 justify-content-center">
            {isLoggedIn ? (
              // Logged in users - only show Play button
              <button 
                className="btn btn-lg px-5 py-3"
                style={{
                  backgroundColor: '#4A90E2',
                  color: 'white',
                  border: '2px solid #4A90E2',
                  borderRadius: '50px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '600',
                  fontSize: '18px',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => navigate('/themes')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '#4A90E2';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#4A90E2';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(0px)';
                }}
              >
                Play
              </button>
            ) : (
              // Not logged in users - show both buttons
              <>
                <button 
                  className="btn btn-lg px-5 py-3"
                  style={{
                    backgroundColor: '#4A90E2',
                    color: 'white',
                    border: '2px solid #4A90E2',
                    borderRadius: '50px',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: '600',
                    fontSize: '18px',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => navigate('/themes')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = '#4A90E2';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#4A90E2';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'translateY(0px)';
                  }}
                >
                  Try 1 Round Free
                </button>

                <button 
                  className="btn btn-lg px-5 py-3"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    border: '2px solid white',
                    borderRadius: '50px',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: '600',
                    fontSize: '18px',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => navigate('/login')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = 'black';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'translateY(0px)';
                  }}
                >
                  Login for Full Game
                </button>
              </>
            )}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="text-center mt-5 pt-4"
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight,
              behavior: 'smooth'
            });
          }}
          style={{
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <div 
            style={{
              color: 'white',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '16px',
              fontWeight: '500',
              opacity: 0.8,
              animation: 'fadeInOut 2s ease-in-out infinite'
            }}
          >
            Scroll down for game rules & features
          </div>
          <div 
            className="mt-2"
            style={{
              animation: 'bounce 2s ease-in-out infinite'
            }}
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              style={{color: 'white', opacity: 0.8}}
            >
              <path 
                d="M7 10L12 15L17 10" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>


      </div>

      {/* CSS Animation Styles */}
      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes fadeInOut {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Homepage; 