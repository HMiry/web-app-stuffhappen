import React from 'react';
import { AlertTriangle, Target, Clock, Trophy } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const InstructionsSection = () => {
  const { isDark } = useTheme();
  
  return (
    <section className="py-5 theme-bg-primary" style={{backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa'}}>
      <div className="container">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h2 className="display-5 fw-bold mb-3" style={{color: isDark ? 'white' : '#1a1a1a', fontFamily: 'Poppins, sans-serif', fontWeight: '700'}}>Easy as 1-2-3</h2>
            <p className="lead" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(26,26,26,0.8)'}}>
              Master the art of disaster ranking in three simple steps
            </p>
          </div>
        </div>
        
        <div className="row g-4 justify-content-center">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-lg" style={{borderRadius: '20px', backgroundColor: isDark ? '#2a2a2a' : '#ffffff'}}>
              <div className="card-body text-center p-4">
                <div className="text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{width: '80px', height: '80px', fontSize: '2.5rem', backgroundColor: '#4A90E2', fontFamily: 'Poppins, sans-serif', fontWeight: '700'}}>
                  1
                </div>
                <div className="mb-3">
                  <AlertTriangle style={{color: '#fbbf24'}} size={32} />
                </div>
                <h4 className="card-title mb-3" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: isDark ? 'white' : '#1a1a1a'}}>Face the Situation</h4>
                <p className="card-text" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(26,26,26,0.7)'}}>
                  You'll see a horrible university situation (without its disaster level). Look at your 
                  cards to understand the scale.
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-lg" style={{borderRadius: '20px', backgroundColor: isDark ? '#2a2a2a' : '#ffffff'}}>
              <div className="card-body text-center p-4">
                <div className="text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{width: '80px', height: '80px', fontSize: '2.5rem', backgroundColor: '#4A90E2', fontFamily: 'Poppins, sans-serif', fontWeight: '700'}}>
                  2
                </div>
                <div className="mb-3">
                  <Target style={{color: '#4A90E2'}} size={32} />
                </div>
                <h4 className="card-title mb-3" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: isDark ? 'white' : '#1a1a1a'}}>Guess the Position</h4>
                <p className="card-text" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(26,26,26,0.7)'}}>
                  Decide where this new disaster fits among your existing cards based on how 
                  terrible you think it is.
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-lg" style={{borderRadius: '20px', backgroundColor: isDark ? '#2a2a2a' : '#ffffff'}}>
              <div className="card-body text-center p-4">
                <div className="text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{width: '80px', height: '80px', fontSize: '2.5rem', backgroundColor: '#4A90E2', fontFamily: 'Poppins, sans-serif', fontWeight: '700'}}>
                  3
                </div>
                <div className="mb-3">
                  <Clock style={{color: '#4A90E2'}} size={32} />
                </div>
                <h4 className="card-title mb-3" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: isDark ? 'white' : '#1a1a1a'}}>Beat the Clock</h4>
                <p className="card-text" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(26,26,26,0.7)'}}>
                  You have 30 seconds to make your choice. Guess correctly to add the card 
                  to your collection!
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="row mt-5">
          <div className="col-12">
            <div className="card border-0" style={{borderRadius: '20px', background: 'linear-gradient(135deg, #4A90E2 0%, #3A7BD5 100%)'}}>
              <div className="card-body p-4 text-center">
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <Trophy style={{color: '#fbbf24'}} className="me-2" size={24} />
                  <h5 className="mb-0" style={{color: 'white', fontFamily: 'Poppins, sans-serif', fontWeight: '600'}}>Win Condition</h5>
                </div>
                <p className="mb-0" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: 'rgba(255,255,255,0.9)'}}>
                  Collect <strong>6 cards</strong> to win the game! But be careful - three wrong guesses and it's game over.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstructionsSection; 