import { useAuth } from "@clerk/clerk-react";
import { useCallback } from "react";

/**
 * Custom hook that provides authentication token functionality
 * Wraps Clerk's useAuth hook and provides a consistent interface
 * for getting authentication tokens across the application
 *
 * @returns {function} getToken - Function to get the authentication token
 */
export const useAuthToken = () => {
  const { getToken } = useAuth();

  const getAuthToken = useCallback(async (): Promise<string | null> => {
    try {
      return await getToken();
    } catch (error) {
      console.error("Error getting authentication token:", error);
      return null;
    }
  }, [getToken]);

  return {
    getToken: getAuthToken,
  };
};

export default useAuthToken;
