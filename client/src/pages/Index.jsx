import React from 'react';
import Homepage from '../components/Homepage';
import InstructionsSection from '../components/InstructionsSection';
import GameFeaturesSection from '../components/GameFeaturesSection';
import { useTheme } from '../contexts/ThemeContext';

const Index = () => {
  const { isDark } = useTheme();
  
  return (
    <div className={`min-vh-100 ${isDark ? 'theme-bg-primary' : 'bg-light'}`}>
      <Homepage />
      <InstructionsSection />
      <GameFeaturesSection />
    </div>
  );
};

export default Index; 