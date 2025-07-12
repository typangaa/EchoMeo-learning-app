// UI store slice - handles UI state, modals, navigation, and layout
import { StateCreator } from 'zustand';
import { UIStore } from '../types';
import { createActionTypes, createActionSet } from '../middleware/devtools';

// Action types for DevTools
const actionTypes = createActionTypes('UI');

// UI store slice
export const createUISlice: StateCreator<UIStore> = (set, get) => {
  // Enhanced set with action types for better debugging
  const actionSet = createActionSet(set, actionTypes);

  return {
    // Initial state
    currentPage: window.location.pathname,
    navigationHistory: [window.location.pathname],
    activeModal: null,
    popover: {
      isOpen: false,
      position: { x: 0, y: 0 },
      content: null
    },
    layoutMode: 'list',
    sidebarCollapsed: false,

    // Navigation actions
    setCurrentPage: (page) => {
      const history = get().navigationHistory;
      const newHistory = [...history, page];
      
      // Keep only last 10 pages in history
      if (newHistory.length > 10) {
        newHistory.shift();
      }

      actionSet({
        currentPage: page,
        navigationHistory: newHistory
      }, false, actionTypes.custom('SET_CURRENT_PAGE'));
    },

    navigateBack: () => {
      const history = get().navigationHistory;
      if (history.length > 1) {
        const newHistory = [...history];
        newHistory.pop(); // Remove current page
        const previousPage = newHistory[newHistory.length - 1];

        actionSet({
          currentPage: previousPage,
          navigationHistory: newHistory
        }, false, actionTypes.custom('NAVIGATE_BACK'));
      }
    },

    // Modal actions
    openModal: (modalId) => {
      actionSet({
        activeModal: modalId
      }, false, actionTypes.custom('OPEN_MODAL'));
    },

    closeModal: () => {
      actionSet({
        activeModal: null
      }, false, actionTypes.custom('CLOSE_MODAL'));
    },

    // Popover actions
    setPopover: (popoverUpdate) => {
      const currentPopover = get().popover;
      const newPopover = { ...currentPopover, ...popoverUpdate };

      actionSet({
        popover: newPopover
      }, false, actionTypes.custom('SET_POPOVER'));
    },

    closePopover: () => {
      actionSet({
        popover: {
          isOpen: false,
          position: { x: 0, y: 0 },
          content: null
        }
      }, false, actionTypes.custom('CLOSE_POPOVER'));
    },

    // Layout actions
    setLayoutMode: (mode) => {
      actionSet({
        layoutMode: mode
      }, false, actionTypes.custom('SET_LAYOUT_MODE'));
    },

    toggleSidebar: () => {
      const currentCollapsed = get().sidebarCollapsed;
      actionSet({
        sidebarCollapsed: !currentCollapsed
      }, false, actionTypes.custom('TOGGLE_SIDEBAR'));
    }
  };
};