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
            <h2 className="display-5 fw-bold mb-3" style={{color: isDark ? 'white' : '#1a1a1a', fontFamily: 'Poppins, sans-serif', fontWeight: '700'}}>How to Play "Stuff Happens"</h2>
            <h4 className="mb-3" style={{color: '#4A90E2', fontFamily: 'Poppins, sans-serif', fontWeight: '600'}}>Easy as 1-2-3</h4>
            <p className="lead" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(26,26,26,0.8)'}}>
              A single-player card game where you rank horrible situations by their "bad luck index"
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
                <h4 className="card-title mb-3" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: isDark ? 'white' : '#1a1a1a'}}>Get Your Starting Hand</h4>
                <p className="card-text" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(26,26,26,0.7)'}}>
                  Start with 3 random disaster cards. You can see their names, images, and bad luck indexes (1-100). 
                  These are ordered from least to most terrible.
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
                <h4 className="card-title mb-3" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: isDark ? 'white' : '#1a1a1a'}}>Rank the New Disaster</h4>
                <p className="card-text" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(26,26,26,0.7)'}}>
                  Each round, you get a new disaster card (name and image only - no bad luck index shown). 
                  Click where you think it belongs among your cards based on severity.
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
                <h4 className="card-title mb-3" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: isDark ? 'white' : '#1a1a1a'}}>Win or Lose the Round</h4>
                <p className="card-text" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(26,26,26,0.7)'}}>
                  You have 30 seconds to decide. Guess correctly and you keep the card (and see its bad luck index). 
                  Guess wrong or run out of time and the card is discarded.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Detailed Game Rules */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card border-0 shadow-lg" style={{borderRadius: '20px', backgroundColor: isDark ? '#2a2a2a' : '#ffffff'}}>
              <div className="card-body p-5">
                <h4 className="text-center mb-4" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: isDark ? 'white' : '#1a1a1a'}}>
                  Complete Game Rules
                </h4>
                <div className="row g-4">
                  <div className="col-md-6">
                    <h6 style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: '#4A90E2'}}>🎯 Game Objective</h6>
                    <ul style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(26,26,26,0.8)', fontSize: '14px'}}>
                      <li><strong>Win:</strong> Collect 6 total disaster cards (3 starting + 3 won)</li>
                      <li><strong>Lose:</strong> Make 3 wrong guesses in any game</li>
                      <li>Each card has a unique "bad luck index" from 1-100</li>
                    </ul>
                    
                    <h6 style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: '#4A90E2'}}>⏱️ Round Rules</h6>
                    <ul style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(26,26,26,0.8)', fontSize: '14px'}}>
                      <li>30 seconds per round to make your choice</li>
                      <li>No time limit extension - decide quickly!</li>
                      <li>Running out of time counts as a wrong guess</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6 style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: '#4A90E2'}}>🎮 User Types</h6>
                    <ul style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(26,26,26,0.8)', fontSize: '14px'}}>
                      <li><strong>Anonymous:</strong> Play 1-round demo games only</li>
                      <li><strong>Registered:</strong> Play full games + view game history</li>
                      <li>All completed games are saved to your profile</li>
                    </ul>
                    
                    <h6 style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: '#4A90E2'}}>📊 What You See</h6>
                    <ul style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(26,26,26,0.8)', fontSize: '14px'}}>
                      <li><strong>Your cards:</strong> Name, image, and bad luck index</li>
                      <li><strong>New cards:</strong> Only name and image (index hidden)</li>
                      <li>Cards are always sorted by bad luck index</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12">
            <div className="card border-0" style={{borderRadius: '20px', background: 'linear-gradient(135deg, #4A90E2 0%, #3A7BD5 100%)'}}>
              <div className="card-body p-4 text-center">
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <Trophy style={{color: '#fbbf24'}} className="me-2" size={24} />
                  <h5 className="mb-0" style={{color: 'white', fontFamily: 'Poppins, sans-serif', fontWeight: '600'}}>Ready to Test Your Disaster Ranking Skills?</h5>
                </div>
                <p className="mb-0" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: 'rgba(255,255,255,0.9)'}}>
                  Think you can judge how terrible a situation is? <strong>Start playing now</strong> and prove your chaos expertise!
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