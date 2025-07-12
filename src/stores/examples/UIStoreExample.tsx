// Example component showing how to use the new Zustand UI Store
// This demonstrates modal, navigation, layout, and popover management

import React from 'react';
import { 
  useActiveModal, 
  usePopover, 
  useLayoutMode, 
  useSidebarCollapsed,
  useModalActions, 
  usePopoverActions, 
  useLayoutActions,
  useNavigationActions
} from '../index';

const UIStoreExample: React.FC = () => {
  // UI state hooks
  const activeModal = useActiveModal();
  const popover = usePopover();
  const layoutMode = useLayoutMode();
  const sidebarCollapsed = useSidebarCollapsed();
  
  // Action hooks
  const { openModal, closeModal } = useModalActions();
  const { setPopover, closePopover } = usePopoverActions();
  const { setLayoutMode, toggleSidebar } = useLayoutActions();
  const { setCurrentPage, navigateBack } = useNavigationActions();

  // Example popover handler
  const handleShowPopover = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPopover({
      isOpen: true,
      position: { x: rect.left, y: rect.bottom + 5 },
      content: { text: 'This is a popover example!', type: 'info' }
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Zustand UI Store Example</h2>
      
      {/* Current State Display */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
        <h3>Current UI State:</h3>
        <ul>
          <li><strong>Active Modal:</strong> {activeModal || 'None'}</li>
          <li><strong>Popover Open:</strong> {popover.isOpen ? 'Yes' : 'No'}</li>
          <li><strong>Layout Mode:</strong> {layoutMode}</li>
          <li><strong>Sidebar Collapsed:</strong> {sidebarCollapsed ? 'Yes' : 'No'}</li>
        </ul>
      </div>

      {/* Modal Controls */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Modal Management</h3>
        <button 
          onClick={() => openModal('example-modal')}
          style={{ marginRight: '10px', padding: '8px 16px' }}
        >
          Open Modal
        </button>
        <button 
          onClick={() => closeModal()}
          disabled={!activeModal}
          style={{ padding: '8px 16px' }}
        >
          Close Modal
        </button>
        
        {activeModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              minWidth: '300px',
              textAlign: 'center'
            }}>
              <h4>Example Modal</h4>
              <p>This modal is managed by Zustand UI Store!</p>
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        )}
      </div>

      {/* Popover Controls */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Popover Management</h3>
        <button 
          onClick={handleShowPopover}
          style={{ marginRight: '10px', padding: '8px 16px' }}
        >
          Show Popover
        </button>
        <button 
          onClick={() => closePopover()}
          disabled={!popover.isOpen}
          style={{ padding: '8px 16px' }}
        >
          Close Popover
        </button>

        {popover.isOpen && (
          <div style={{
            position: 'fixed',
            top: popover.position.y,
            left: popover.position.x,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            zIndex: 1000
          }}>
            <p>{popover.content?.text}</p>
            <button onClick={closePopover} style={{ fontSize: '12px' }}>×</button>
          </div>
        )}
      </div>

      {/* Layout Controls */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Layout Management</h3>
        <div style={{ marginBottom: '10px' }}>
          <strong>Layout Mode:</strong>
          {(['list', 'grid', 'cards'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setLayoutMode(mode)}
              disabled={layoutMode === mode}
              style={{ 
                marginLeft: '10px', 
                padding: '5px 10px',
                backgroundColor: layoutMode === mode ? '#007bff' : '#e9ecef',
                color: layoutMode === mode ? 'white' : 'black',
                border: 'none',
                borderRadius: '3px'
              }}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
        
        <button 
          onClick={toggleSidebar}
          style={{ padding: '8px 16px' }}
        >
          {sidebarCollapsed ? 'Expand' : 'Collapse'} Sidebar
        </button>
      </div>

      {/* Navigation Controls */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Navigation Management</h3>
        <button 
          onClick={() => setCurrentPage('/example-page')}
          style={{ marginRight: '10px', padding: '8px 16px' }}
        >
          Navigate to Example Page
        </button>
        <button 
          onClick={() => navigateBack()}
          style={{ padding: '8px 16px' }}
        >
          Go Back
        </button>
      </div>

      {/* Benefits Summary */}
      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        backgroundColor: '#e8f5e8', 
        borderRadius: '5px' 
      }}>
        <h4>UI Store Benefits:</h4>
        <ul>
          <li>✅ Centralized UI state management</li>
          <li>✅ No prop drilling for modal/popover state</li>
          <li>✅ Persistent layout preferences</li>
          <li>✅ Navigation history tracking</li>
          <li>✅ Type-safe UI interactions</li>
          <li>✅ Easy testing and debugging</li>
        </ul>
      </div>
    </div>
  );
};

export default UIStoreExample;