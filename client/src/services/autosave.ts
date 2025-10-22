import type { OnboardingState } from '../types';

const AUTOSAVE_KEY = 'senvo_onboarding_state';
const AUTOSAVE_INTERVAL = 20000; // 20 seconds

export const autosaveService = {
  // Save state to localStorage
  save: (state: OnboardingState) => {
    try {
      const stateToSave = {
        ...state,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(stateToSave));
      console.log('✓ Progress autosaved');
    } catch (error) {
      console.error('Failed to autosave:', error);
    }
  },

  // Load state from localStorage
  load: (): OnboardingState | null => {
    try {
      const saved = localStorage.getItem(AUTOSAVE_KEY);
      if (!saved) return null;

      const state = JSON.parse(saved) as OnboardingState;
      console.log('✓ Progress loaded from autosave');
      return state;
    } catch (error) {
      console.error('Failed to load autosaved data:', error);
      return null;
    }
  },

  // Clear saved state
  clear: () => {
    try {
      localStorage.removeItem(AUTOSAVE_KEY);
      console.log('✓ Autosaved progress cleared');
    } catch (error) {
      console.error('Failed to clear autosave:', error);
    }
  },

  // Check if there's saved progress
  hasSaved: (): boolean => {
    return localStorage.getItem(AUTOSAVE_KEY) !== null;
  },

  // Start autosave interval
  startAutosave: (getState: () => OnboardingState): NodeJS.Timeout => {
    return setInterval(() => {
      const state = getState();
      if (state.customerId) {
        autosaveService.save(state);
      }
    }, AUTOSAVE_INTERVAL);
  },

  // Stop autosave interval
  stopAutosave: (intervalId: NodeJS.Timeout) => {
    clearInterval(intervalId);
  }
};

export default autosaveService;
