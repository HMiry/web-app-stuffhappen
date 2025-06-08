import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, Trophy, BookOpen, Play, Users, Zap } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const GameFeaturesSection = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  
  const features = [
    {
      icon: Timer,
      title: '30-Second Challenge',
      description: 'Quick thinking under pressure - just like real university life'
    },
    {
      icon: Trophy,
      title: 'Progressive Difficulty',
      description: 'Cards get more challenging as you collect more disasters'
    },
    {
      icon: BookOpen,
      title: 'Game History',
      description: 'Track your progress and see your disaster collection grow'
    },
    {
      icon: Play,
      title: 'Demo Mode',
      description: 'Try before you commit - perfect for cautious students'
    },
    {
      icon: Users,
      title: 'User Profiles',
      description: 'Register to save your games and compete with friends'
    },
    {
      icon: Zap,
      title: 'Instant Feedback',
      description: 'Know immediately if your disaster ranking was correct'
    }
  ];

  return (
    <section className="py-5" style={{backgroundColor: isDark ? '#0f0f0f' : '#ffffff'}}>
      <div className="container">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h2 className="display-5 fw-bold mb-3" style={{color: isDark ? 'white' : '#1a1a1a', fontFamily: 'Poppins, sans-serif', fontWeight: '700'}}>Game Features</h2>
            <p className="lead" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(26,26,26,0.8)'}}>
              Everything you need to master the art of university disaster management
            </p>
          </div>
        </div>
        
        <div className="row g-4">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-lg" style={{borderRadius: '20px', backgroundColor: isDark ? '#2a2a2a' : '#f8f9fa'}}>
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <IconComponent style={{color: '#4A90E2'}} className="me-3" size={32} />
                      <h5 className="card-title mb-0" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: isDark ? 'white' : '#1a1a1a'}}>{feature.title}</h5>
                    </div>
                    <p className="card-text" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(26,26,26,0.7)'}}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="row mt-5">
          <div className="col-12">
            <div className="card border-0" style={{borderRadius: '20px', backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa', borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)'}}>
              <div className="card-body p-5 text-center">
                <h3 className="mb-4" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '600', color: isDark ? 'white' : '#1a1a1a'}}>Ready to Start Your Disaster Journey?</h3>
                <p className="lead mb-4" style={{fontFamily: 'Poppins, sans-serif', fontWeight: '400', color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(26,26,26,0.8)'}}>
                  Join thousands of students who've discovered just how chaotic university life can really get.
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
                      fontSize: '18px',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => navigate('/themes')}
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
                  <button 
                    className="btn btn-lg px-5 py-3" 
                    style={{
                      backgroundColor: 'transparent',
                      color: isDark ? 'white' : '#1a1a1a',
                      border: isDark ? '2px solid white' : '2px solid #1a1a1a',
                      borderRadius: '50px',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: '600',
                      fontSize: '18px',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => navigate('/themes')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isDark ? 'white' : '#1a1a1a';
                      e.currentTarget.style.color = isDark ? 'black' : 'white';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = isDark ? '0 8px 25px rgba(255, 255, 255, 0.2)' : '0 8px 25px rgba(26, 26, 26, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = isDark ? 'white' : '#1a1a1a';
                      e.currentTarget.style.transform = 'translateY(0px)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Try Demo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameFeaturesSection; 