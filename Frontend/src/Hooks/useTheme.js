import { theme } from '../theme/theme';

/**
 * Custom hook for accessing theme values
 * @returns {Object} Theme object with colors, spacing, etc.
 */
export const useTheme = () => {
  return theme;
};

/**
 * Get a color value from the theme
 * @param {string} path - Dot notation path to color (e.g., 'background.main')
 * @returns {string} Color value
 */
export const useColor = (path) => {
  return path.split('.').reduce((obj, key) => obj?.[key], theme.colors);
};

/**
 * Get spacing value from theme
 * @param {string} size - Size key (xs, sm, md, lg, xl, etc.)
 * @returns {string} Spacing value
 */
export const useSpacing = (size) => {
  return theme.spacing[size] || size;
};

/**
 * Generate CSS-in-JS styles for movie cards
 * @returns {Object} Style object
 */
export const useMovieCardStyles = () => ({
  backgroundColor: theme.colors.background.surface,
  border: `1px solid ${theme.colors.border.default}`,
  borderRadius: theme.borderRadius.xl,
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: theme.colors.background.hover,
    borderColor: theme.colors.border.focus,
    transform: 'translateY(-4px)',
    boxShadow: `0 12px 32px ${theme.colors.shadow.medium}`
  }
});

/**
 * Generate CSS-in-JS styles for CTA buttons
 * @returns {Object} Style object
 */
export const useCTAButtonStyles = () => ({
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
  },
  '&:active': {
    transform: 'translateY(0)'
  }
});

/**
 * Generate CSS-in-JS styles for form inputs
 * @returns {Object} Style object
 */
export const useInputStyles = () => ({
  backgroundColor: theme.colors.background.surface,
  border: `1px solid ${theme.colors.border.default}`,
  color: theme.colors.text.primary,
  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
  borderRadius: theme.borderRadius.md,
  fontSize: theme.fontSize.base,
  transition: 'all 0.3s ease',
  '&:focus': {
    outline: 'none',
    borderColor: theme.colors.border.focus,
    boxShadow: `0 0 0 2px rgba(201, 162, 77, 0.2)`
  },
  '&::placeholder': {
    color: theme.colors.text.muted
  }
});

/**
 * Get responsive breakpoint styles
 * @param {Object} styles - Object with breakpoint keys and style values
 * @returns {Object} Media query styles
 */
export const useResponsiveStyles = (styles) => {
  const mediaQueries = {};
  
  Object.entries(styles).forEach(([breakpoint, style]) => {
    if (theme.breakpoints[breakpoint]) {
      mediaQueries[`@media (min-width: ${theme.breakpoints[breakpoint]})`] = style;
    }
  });
  
  return mediaQueries;
};

export default useTheme;