import { useState, useEffect } from 'react';
import ApiRequest from '../Services/Axios/config';
import Logger from '../utils/logger';
import { handleApiError } from '../utils/errorHandler';

/**
 * Custom hook برای API calls با error handling و loading state
 */
export const useApi = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { 
    immediate = true, 
    dependencies = [], 
    onSuccess = null, 
    onError = null 
  } = options;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiRequest.get(endpoint);
      setData(response.data);
      
      if (onSuccess) {
        onSuccess(response.data);
      }
      
      Logger.log(`API call successful: ${endpoint}`);
    } catch (err) {
      const handledError = handleApiError(err, `API Call: ${endpoint}`);
      setError(handledError.message);
      
      if (onError) {
        onError(handledError);
      }
      
      Logger.error(`API call failed: ${endpoint}`, handledError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, dependencies);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

/**
 * Custom hook برای POST requests
 */
export const useApiPost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (endpoint, data, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiRequest.post(endpoint, data);
      
      if (options.onSuccess) {
        options.onSuccess(response.data);
      }
      
      Logger.log(`POST successful: ${endpoint}`);
      return response.data;
    } catch (err) {
      const handledError = handleApiError(err, `POST: ${endpoint}`);
      setError(handledError.message);
      
      if (options.onError) {
        options.onError(handledError);
      }
      
      Logger.error(`POST failed: ${endpoint}`, handledError);
      throw handledError;
    } finally {
      setLoading(false);
    }
  };

  return { postData, loading, error };
};