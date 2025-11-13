import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const StatsOverview = ({ results }) => {
  if (!results || results.length === 0) {
    return null;
  }

  // Calculate statistics
  const avg = (key) => {
    const values = results.map((r) => r[key] || 0).filter((v) => v > 0);
    return values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
  };

  const cdnCount = results.filter((r) => r.cdn_provider && r.cdn_provider !== "None").length;
  const avgTotal = avg("total");
  const avgSSL = avg("ssl_score");
  const avgSecurityHeaders = avg("security_headers_score");
  const cdnPercentage = Math.round((cdnCount / results.length) * 100);

  const stats = [
    {
      id: 'performance',
      label: 'Avg Load Time',
      value: avgTotal,
      unit: 'ms',
      icon: '⚡',
      gradient: 'from-indigo-500 to-purple-500',
      bgGradient: 'from-indigo-500/15 to-purple-500/15',
    },
    {
      id: 'ssl',
      label: 'Avg SSL Score',
      value: avgSSL,
      unit: '/100',
      icon: '🔒',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/15 to-emerald-500/15',
    },
    {
      id: 'security',
      label: 'Security Headers',
      value: avgSecurityHeaders,
      unit: '/100',
      icon: '🛡️',
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-500/15 to-orange-500/15',
    },
    {
      id: 'cdn',
      label: 'CDN Usage',
      value: cdnPercentage,
      unit: '%',
      icon: '🚀',
      gradient: 'from-pink-500 to-rose-500',
      bgGradient: 'from-pink-500/15 to-rose-500/15',
    },
  ];

  return (
    <div className="mb-8 animate-fade-in">
      <Typography 
        variant="h5" 
        className="mb-6 font-bold text-white"
        sx={{ fontWeight: 700 }}
      >
        📊 Quick Stats Overview
      </Typography>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.id}
            className="group animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Card
              className={`
                backdrop-blur-xl bg-gradient-to-br ${stat.bgGradient}
                border border-white/20 rounded-2xl
                transition-all duration-300
                hover:scale-105 hover:shadow-2xl hover:border-white/40
                cursor-pointer
              `}
              sx={{
                background: `linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)`,
                backdropFilter: 'blur(20px)',
              }}
            >
              <CardContent className="text-center p-6">
                {/* Icon Badge */}
                <Box
                  className={`
                    w-16 h-16 mx-auto mb-4 rounded-2xl
                    bg-gradient-to-br ${stat.gradient}
                    flex items-center justify-center
                    shadow-lg group-hover:scale-110 transition-transform duration-300
                  `}
                >
                  <span className="text-3xl">{stat.icon}</span>
                </Box>

                {/* Label */}
                <Typography
                  variant="body2"
                  className="text-white/70 mb-2 font-semibold"
                  sx={{ fontSize: '0.875rem' }}
                >
                  {stat.label}
                </Typography>

                {/* Value */}
                <div className="flex items-baseline justify-center gap-1">
                  <Typography
                    variant="h3"
                    className="font-extrabold text-white"
                    sx={{ 
                      fontWeight: 800,
                      fontSize: { xs: '2rem', md: '2.5rem' },
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body1"
                    className="text-white/60 font-medium"
                    sx={{ fontSize: '1rem' }}
                  >
                    {stat.unit}
                  </Typography>
                </div>

                {/* Progress Bar (optional visual) */}
                {stat.unit === '/100' && (
                  <div className="mt-3 w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${stat.gradient} transition-all duration-1000`}
                      style={{ 
                        width: `${stat.value}%`,
                        animationDelay: `${index * 100 + 300}ms`,
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Summary Text */}
      <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
        <Typography variant="body2" className="text-white/70 text-center">
          📈 Analyzing <strong className="text-white font-bold">{results.length}</strong> website{results.length !== 1 ? 's' : ''} 
          {' • '}
          <strong className="text-green-400">{cdnCount}</strong> using CDN
          {' • '}
          Average load time: <strong className="text-purple-400">{avgTotal}ms</strong>
        </Typography>
      </div>
    </div>
  );
};

export default StatsOverview;

