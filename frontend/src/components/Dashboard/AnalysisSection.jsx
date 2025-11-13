import React from 'react';
import { Typography, Box } from '@mui/material';

const AnalysisSection = ({ title, icon, children, id }) => {
  return (
    <section 
      id={id}
      className="mb-8 animate-fade-in scroll-mt-20"
    >
      {/* Section Header */}
      <Box className="mb-6">
        <Typography 
          variant="h5" 
          className="font-bold text-white flex items-center gap-3"
          sx={{ 
            fontWeight: 700,
            fontSize: { xs: '1.5rem', md: '1.75rem' },
          }}
        >
          <span className="text-3xl">{icon}</span>
          {title}
        </Typography>
        <div className="mt-2 h-1 w-20 bg-gradient-to-r from-primary via-secondary to-accent rounded-full" />
      </Box>

      {/* Section Content */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
        {children}
      </div>
    </section>
  );
};

export default AnalysisSection;

