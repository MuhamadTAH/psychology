// 🧠 FILE PURPOSE
// Custom hook to provide user email from localStorage to Convex queries
// This replaces Clerk authentication with simple localStorage-based session

"use client";

import { useState, useEffect } from "react";

// Step 1: Get current user email from localStorage
// Returns the email stored during signin/signup
export function useCurrentUser() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get email from localStorage on client side only
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('userEmail');
      const id = localStorage.getItem('userId');
      setUserEmail(email);
      setUserId(id);
    }
  }, []);

  return { userEmail, userId };
}

// Step 2: Logout function
// Clears localStorage and redirects to signin
export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    window.location.href = '/signin';
  }
}

// ✅ In this section we achieved:
// Simple session management using localStorage instead of Clerk
