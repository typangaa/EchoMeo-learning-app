// DevTools middleware for Zustand stores
// Provides Redux DevTools integration for debugging

export interface DevToolsOptions {
  name?: string;
  enabled?: boolean;
  trace?: boolean;
  traceLimit?: number;
}

// Check if Redux DevTools Extension is available
const isDevToolsAvailable = () => {
  return typeof window !== 'undefined' && 
         (window as any).__REDUX_DEVTOOLS_EXTENSION__;
};

// Create DevTools middleware
export const createDevToolsMiddleware = (options: DevToolsOptions = {}) => {
  const {
    name = 'Vietnamese-Chinese Learning Store',
    enabled = process.env.NODE_ENV === 'development',
    trace = true,
    traceLimit = 25
  } = options;

  return (config: any) => (set: any, get: any, api: any) => {
    // Return original config if DevTools not available or disabled
    if (!enabled || !isDevToolsAvailable()) {
      return config(set, get, api);
    }

    const devtools = (window as any).__REDUX_DEVTOOLS_EXTENSION__.connect({
      name,
      trace,
      traceLimit,
      features: {
        jump: true,
        skip: true,
        reorder: true,
        dispatch: true,
        test: true
      }
    });

    // Track action history for better debugging
    let actionId = 0;
    const actionHistory: { id: number; type: string; payload?: any; timestamp: Date }[] = [];

    // Enhanced set function with DevTools integration
    const devToolsSet = (partial: any, replace?: boolean, actionType?: string) => {
      // Execute the state update
      set(partial, replace);
      
      const currentState = get();
      
      // Create action for DevTools
      const action = {
        type: actionType || 'UPDATE_STATE',
        payload: typeof partial === 'function' ? 'Function Update' : partial,
        id: ++actionId,
        timestamp: new Date()
      };

      // Add to action history
      actionHistory.push(action);
      if (actionHistory.length > traceLimit) {
        actionHistory.shift();
      }

      // Send to DevTools
      devtools.send(action, currentState);
    };

    // Initialize DevTools with initial state
    const initialState = config(devToolsSet, get, api);
    devtools.init(initialState);

    // Handle DevTools actions (time travel, etc.)
    devtools.subscribe((message: any) => {
      if (message.type === 'DISPATCH') {
        switch (message.payload.type) {
          case 'RESET':
            devtools.init(get());
            break;
          case 'JUMP_TO_STATE':
          case 'JUMP_TO_ACTION':
            set(JSON.parse(message.state), true);
            break;
          case 'COMMIT':
            devtools.init(get());
            break;
          case 'ROLLBACK':
            set(JSON.parse(message.state), true);
            devtools.init(get());
            break;
        }
      }
    });

    return initialState;
  };
};

// Utility function to create action types for better DevTools experience
export const createActionTypes = (sliceName: string) => {
  const upperCaseSlice = sliceName.toUpperCase();
  
  return {
    // Generic actions
    SET: `${upperCaseSlice}/SET`,
    UPDATE: `${upperCaseSlice}/UPDATE`,
    RESET: `${upperCaseSlice}/RESET`,
    
    // Loading actions
    LOADING_START: `${upperCaseSlice}/LOADING_START`,
    LOADING_SUCCESS: `${upperCaseSlice}/LOADING_SUCCESS`,
    LOADING_ERROR: `${upperCaseSlice}/LOADING_ERROR`,
    
    // CRUD actions
    CREATE: `${upperCaseSlice}/CREATE`,
    READ: `${upperCaseSlice}/READ`,
    UPDATE_ITEM: `${upperCaseSlice}/UPDATE_ITEM`,
    DELETE: `${upperCaseSlice}/DELETE`,
    
    // Custom action creator
    custom: (action: string) => `${upperCaseSlice}/${action.toUpperCase()}`
  };
};

// Enhanced set function that includes action types
export const createActionSet = (set: any, actionTypes: any) => {
  return (partial: any, replace?: boolean, actionType?: string) => {
    const finalActionType = actionType || actionTypes.UPDATE;
    return set(partial, replace, finalActionType);
  };
};

// Middleware combiner - combines multiple middleware functions
export const combineMiddleware = (...middlewares: any[]) => {
  return (config: any) => {
    return middlewares.reduceRight((acc, middleware) => {
      return middleware(acc);
    }, config);
  };
};

// Logger middleware for development
export const createLoggerMiddleware = (options: { enabled?: boolean; collapsed?: boolean } = {}) => {
  const { enabled = process.env.NODE_ENV === 'development', collapsed = true } = options;
  
  return (config: any) => (set: any, get: any, api: any) => {
    if (!enabled) {
      return config(set, get, api);
    }

    const loggerSet = (partial: any, replace?: boolean, actionType?: string) => {
      const previousState = get();
      set(partial, replace);
      const currentState = get();
      
      const groupTitle = `🔄 ${actionType || 'State Update'} @ ${new Date().toLocaleTimeString()}`;
      
      if (collapsed) {
        console.groupCollapsed(groupTitle);
      } else {
        console.group(groupTitle);
      }
      
      console.log('Previous State:', previousState);
      console.log('Action Payload:', typeof partial === 'function' ? 'Function Update' : partial);
      console.log('Current State:', currentState);
      console.groupEnd();
    };

    return config(loggerSet, get, api);
  };
};