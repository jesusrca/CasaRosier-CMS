import { projectId, publicAnonKey } from './supabase/info';
import { supabase } from './supabase/client';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-0ba58e95`;

// Helper function to get auth headers
const getAuthHeaders = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const access_token = session?.access_token || publicAnonKey;
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
    };
  } catch (error) {
    console.error('Error getting session:', error);
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`
    };
  }
};

// Landing Pages API
export const landingPagesAPI = {
  // Get all landing pages (admin only)
  getAllLandingPages: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/landing-pages`, {
        method: 'GET',
        headers: await getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error fetching landing pages:', error);
      throw error;
    }
  },

  // Get published landing pages (public - no auth required)
  getPublishedLandingPages: async () => {
    try {
      const url = `${API_BASE_URL}/public-landing-pages`;
      console.log('🔵 Fetching published landing pages from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}` // Supabase requires auth header even for public endpoints
        }
      });

      console.log('🔵 Response status:', response.status);
      console.log('🔵 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔴 Error response body:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('🔵 Received data:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching published landing pages:', error);
      throw error;
    }
  },

  // Get single landing page by slug (public)
  getLandingPage: async (slug: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/public-landing-pages/${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}` // Supabase requires auth header even for public endpoints
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error fetching landing page:', error);
      throw error;
    }
  },

  // Save landing page
  saveLandingPage: async (landingPage: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/landing-pages`, {
        method: 'POST',
        headers: await getAuthHeaders(),
        body: JSON.stringify({ landingPage })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error saving landing page:', error);
      throw error;
    }
  },

  // Delete landing page
  deleteLandingPage: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/landing-pages/${id}`, {
        method: 'DELETE',
        headers: await getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error deleting landing page:', error);
      throw error;
    }
  }
};