import React from 'react';
import { Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Header = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-lg">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo and Menu Button */}
          <div className="flex items-center gap-4">
            <IconButton
              onClick={onMenuClick}
              className="lg:hidden text-white hover:bg-white/10"
              sx={{ color: 'white' }}
            >
              <MenuIcon />
            </IconButton>
            
            <div className="flex items-center gap-3">
              <div className="text-3xl">🚀</div>
              <div>
                <Typography 
                  variant="h6" 
                  className="font-bold text-white hidden sm:block"
                  sx={{ 
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #fff 0%, #c7d2fe 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Website Analyzer
                </Typography>
                <Typography 
                  variant="caption" 
                  className="text-white/60 hidden md:block"
                  sx={{ fontSize: '0.7rem' }}
                >
                  Performance & Security Dashboard
                </Typography>
              </div>
            </div>
          </div>

          {/* Center: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6">
            <button className="text-white/80 hover:text-white transition-colors font-medium text-sm">
              Dashboard
            </button>
            <button className="text-white/60 hover:text-white transition-colors font-medium text-sm">
              History
            </button>
            <button className="text-white/60 hover:text-white transition-colors font-medium text-sm">
              Reports
            </button>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <IconButton 
              className="text-white hover:bg-white/10"
              sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
            >
              <NotificationsIcon />
            </IconButton>
            <IconButton 
              className="text-white hover:bg-white/10"
              sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
            >
              <SettingsIcon />
            </IconButton>
            
            {/* User Avatar */}
            <div className="ml-2 hidden sm:block">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-lg cursor-pointer hover:scale-110 transition-transform">
                <span className="text-sm">U</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

