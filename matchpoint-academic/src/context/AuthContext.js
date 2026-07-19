import React, { createContext, useContext, useState } from 'react';
import { FACULTY_REQUESTS } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { name, role: 'admin'|'faculty', id }
  const [requests, setRequests] = useState(FACULTY_REQUESTS);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  // Add a new faculty request
  const addRequest = (newRequest) => {
    setRequests((prev) => [newRequest, ...prev]);
  };

  // Update a request's status ('approved' | 'rejected')
  const updateRequestStatus = (requestId, status, adminNote = '') => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status, adminNote, reviewedAt: new Date().toISOString().split('T')[0] }
          : r
      )
    );
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, requests, addRequest, updateRequestStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
