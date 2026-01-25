// 🎬 Dark Theme Configuration
export const theme = {
  // 1️⃣ Background Colors
  colors: {
    background: {
      main: '#121212',
      surface: '#1A1A1A',
      hover: '#222222'
    },
    
    // 2️⃣ Gold Colors (Highlight - فقط اطلاعاتی)
    gold: {
      primary: '#C9A24D',
      soft: '#D6B66A'
    },
    
    // 3️⃣ Text Colors (یکدست)
    text: {
      primary: '#E0E0E0',
      secondary: '#B5B5B5',
      muted: '#8A8A8A'
    },
    
    // 4️⃣ CTA Colors (مهم)
    cta: {
      primary: '#B84A2B',
      hover: '#D05A3A',
      text: '#FFFFFF'
    },
    
    // 5️⃣ Border & Divider Colors
    border: {
      default: '#2A2A2A',
      focus: '#C9A24D'
    },
    
    // Additional utility colors
    shadow: {
      light: 'rgba(0, 0, 0, 0.2)',
      medium: 'rgba(0, 0, 0, 0.4)',
      heavy: 'rgba(0, 0, 0, 0.6)'
    },
    
    overlay: {
      light: 'rgba(18, 18, 18, 0.8)',
      heavy: 'rgba(18, 18, 18, 0.95)'
    }
  },
  
  // Spacing scale
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px'
  },
  
  // Border radius scale
  borderRadius: {
    none: '0',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    full: '50%'
  },
  
  // Font weights
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900
  },
  
  // Font sizes
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem'
  },
  
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  
  // Z-index scale
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060
  }
};

// Helper functions for theme usage
export const getColor = (path) => {
  return path.split('.').reduce((obj, key) => obj?.[key], theme.colors);
};

export const getSpacing = (size) => {
  return theme.spacing[size] || size;
};

export const getFontSize = (size) => {
  return theme.fontSize[size] || size;
};

// CSS-in-JS style helpers
export const createStyles = {
  // Movie card styles
  movieCard: {
    backgroundColor: theme.colors.background.surface,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: theme.borderRadius.xl,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.colors.background.hover,
      borderColor: theme.colors.border.focus,
      transform: 'translateY(-4px)',
      boxShadow: `0 12px 32px ${theme.colors.shadow.medium}`
    }
  },
  
  // CTA button styles
  ctaButton: {
    backgroundColor: theme.colors.cta.primary,
    color: theme.colors.cta.text,
    border: 'none',
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    borderRadius: theme.borderRadius.md,
    fontWeight: theme.fontWeight.medium,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: theme.colors.cta.hover,
      transform: 'translateY(-1px)',
      boxShadow: `0 4px 12px ${theme.colors.shadow.medium}`
    }
  },
  
  // Input styles
  input: {
    backgroundColor: theme.colors.background.surface,
    border: `1px solid ${theme.colors.border.default}`,
    color: theme.colors.text.primary,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.md,
    transition: 'all 0.3s ease',
    '&:focus': {
      outline: 'none',
      borderColor: theme.colors.border.focus,
      boxShadow: `0 0 0 2px rgba(201, 162, 77, 0.2)`
    },
    '&::placeholder': {
      color: theme.colors.text.muted
    }
  }
};

export default theme;