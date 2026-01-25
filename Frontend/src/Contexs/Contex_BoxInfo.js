import { createContext, useContext } from "react";

// Create context with default value
export const Box_Info = createContext({
  movieData: null,
  setMovieData: () => {},
  isLoading: false,
  setIsLoading: () => {}
});

// Custom hook for using Box_Info context
export const useBoxInfo = () => {
  const context = useContext(Box_Info);
  if (!context) {
    throw new Error('useBoxInfo must be used within a Box_Info.Provider');
  }
  return context;
};