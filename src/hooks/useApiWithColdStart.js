import { useState, useCallback } from 'react';

/**
 * Custom hook for handling API calls with cold start detection
 * Automatically manages loading states and detects when Render service is sleeping
 *
 * @returns {Object} - { isLoading, error, execute }
 *
 * Usage:
 * const { isLoading, error, execute } = useApiWithColdStart();
 *
 * const fetchData = async () => {
 *   const result = await execute(async () => {
 *     const response = await fetch(API_URL);
 *     return response.json();
 *   });
 *
 *   if (result) {
 *     // Handle successful response
 *   }
 * };
 */
export default function useApiWithColdStart() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [isColdStart, setIsColdStart] = useState(false);

  /**
   * Execute an API call with automatic loading state management
   * @param {Function} apiCall - Async function that performs the API call
   * @param {Object} options - Optional configuration
   * @returns {Promise<any>} - Returns the result of the API call or null on error
   */
  const execute = useCallback(async (apiCall, options = {}) => {
    const {
      onSuccess = null,
      onError = null,
      showError = true,
      timeout = 90000 // 90 seconds timeout (Render cold start can take up to 60s)
    } = options;

    setIsLoading(true);
    setError(null);
    setIsColdStart(false);
    const start = Date.now();
    setStartTime(start);

    try {
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout - service may be unavailable')), timeout)
      );

      // Race between API call and timeout
      const result = await Promise.race([apiCall(), timeoutPromise]);

      // Check if it was a cold start (took more than 10 seconds)
      const elapsed = Date.now() - start;
      if (elapsed > 10000) {
        setIsColdStart(true);
        console.log(`Cold start detected: ${Math.round(elapsed / 1000)}s`);
      }

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err) {
      console.error('API call failed:', err);
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);

      // Call error callback if provided
      if (onError) {
        onError(err);
      }

      // Show error to user if enabled
      if (showError) {
        // You can integrate with a toast notification system here
        console.error('Error:', errorMessage);
      }

      return null;
    } finally {
      setIsLoading(false);
      setStartTime(null);
    }
  }, []);

  /**
   * Reset the hook state
   */
  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setStartTime(null);
    setIsColdStart(false);
  }, []);

  return {
    isLoading,
    error,
    isColdStart,
    execute,
    reset
  };
}

/**
 * Alternative hook for simpler use cases
 * Wraps a single API function and returns loading/error states
 *
 * @param {Function} apiFunction - The API function to wrap
 * @returns {Object} - { data, isLoading, error, refetch }
 *
 * Usage:
 * const fetchUserData = async () => {
 *   const response = await fetch('/api/user');
 *   return response.json();
 * };
 *
 * const { data, isLoading, error, refetch } = useApi(fetchUserData);
 */
export function useApi(apiFunction) {
  const [data, setData] = useState(null);
  const { isLoading, error, execute, isColdStart } = useApiWithColdStart();

  const refetch = useCallback(async () => {
    const result = await execute(apiFunction);
    if (result) {
      setData(result);
    }
    return result;
  }, [apiFunction, execute]);

  return {
    data,
    isLoading,
    error,
    isColdStart,
    refetch
  };
}
