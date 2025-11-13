import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import DataObjectIcon from '@mui/icons-material/DataObject';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const Sidebar = ({ isOpen, onClose, activeSection, onSectionChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { id: 'overview', icon: <DashboardIcon />, label: 'Overview', emoji: '📈' },
    { id: 'security', icon: <SecurityIcon />, label: 'Security', emoji: '🔒' },
    { id: 'performance', icon: <SpeedIcon />, label: 'Performance', emoji: '⚡' },
    { id: 'network', icon: <NetworkCheckIcon />, label: 'Network', emoji: '🌐' },
    { id: 'rawdata', icon: <DataObjectIcon />, label: 'Raw Data', emoji: '📄' },
  ];

  const handleItemClick = (id) => {
    onSectionChange(id);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen z-50
          backdrop-blur-xl bg-white/10 border-r border-white/20
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isExpanded ? 'w-64' : 'w-20'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            {isExpanded && (
              <span className="text-white font-semibold text-sm animate-fade-in">
                Navigation
              </span>
            )}
            
            {/* Close button (mobile) */}
            <IconButton
              onClick={onClose}
              className="lg:hidden text-white"
              sx={{ color: 'white', ml: 'auto' }}
            >
              <CloseIcon />
            </IconButton>

            {/* Expand/Collapse button (desktop) */}
            <IconButton
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden lg:block text-white ml-auto"
              sx={{ color: 'white' }}
            >
              {isExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 py-6 px-2 space-y-2">
            {menuItems.map((item) => (
              <Tooltip 
                key={item.id} 
                title={!isExpanded ? item.label : ''} 
                placement="right"
              >
                <button
                  onClick={() => handleItemClick(item.id)}
                  className={`
                    w-full flex items-center gap-4 px-4 py-3 rounded-xl
                    transition-all duration-300
                    ${activeSection === item.id
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  {isExpanded && (
                    <span className="font-medium text-sm animate-fade-in whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                  {activeSection === item.id && !isExpanded && (
                    <span className="absolute left-0 w-1 h-8 bg-white rounded-r-full" />
                  )}
                </button>
              </Tooltip>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/10">
            <div className={`
              flex items-center gap-3 p-3 rounded-xl
              bg-gradient-to-br from-primary/20 to-secondary/20
              border border-white/10
            `}>
              <div className="text-2xl">💡</div>
              {isExpanded && (
                <div className="animate-fade-in">
                  <p className="text-white text-xs font-semibold">Pro Tip</p>
                  <p className="text-white/60 text-xs">
                    Analyze multiple sites
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

