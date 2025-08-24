import React, { createContext, useContext, useState } from 'react';
import { tarotAPI } from '../services/tarot';

const TarotContext = createContext();

export const useTarot = () => {
  const context = useContext(TarotContext);
  if (!context) {
    throw new Error('useTarot must be used within a TarotProvider');
  }
  return context;
};

export const TarotProvider = ({ children }) => {
  const [currentReading, setCurrentReading] = useState(null);
  const [readingHistory, setReadingHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const getTarotReading = async (data) => {
    setLoading(true);
    try {
      const response = await tarotAPI.getTarotReading(data);
      const reading = response.data;
      setCurrentReading(reading);
      return reading;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getReadingHistory = async (page = 1) => {
    setLoading(true);
    try {
      const response = await tarotAPI.getTarotHistory(page);
      const history = response.data;
      setReadingHistory(history.sessions);
      return history;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (sessionId, rating, comment) => {
    try {
      const response = await tarotAPI.submitFeedback(sessionId, rating, comment);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const getDailyUsage = async () => {
    try {
      const response = await tarotAPI.getDailyUsage();
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const clearCurrentReading = () => {
    setCurrentReading(null);
  };

  const value = {
    currentReading,
    readingHistory,
    loading,
    getTarotReading,
    getReadingHistory,
    submitFeedback,
    getDailyUsage,
    clearCurrentReading
  };

  return (
    <TarotContext.Provider value={value}>
      {children}
    </TarotContext.Provider>
  );
};
