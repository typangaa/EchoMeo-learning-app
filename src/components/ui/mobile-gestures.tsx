import React, { useRef, useState, TouchEvent } from 'react';

interface SwipeGestureProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  className?: string;
}

export const SwipeGesture: React.FC<SwipeGestureProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  className = '',
}) => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    setIsSwiping(true);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    
    // Determine if it's a horizontal or vertical swipe
    if (absDeltaX > absDeltaY) {
      // Horizontal swipe
      if (absDeltaX > threshold) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      }
    } else {
      // Vertical swipe
      if (absDeltaY > threshold) {
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp();
        }
      }
    }
    
    touchStartRef.current = null;
    setIsSwiping(false);
  };

  return (
    <div
      className={`${className} ${isSwiping ? 'select-none' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
};

interface TapGestureProps {
  children: React.ReactNode;
  onTap?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  longPressDelay?: number;
  className?: string;
}

export const TapGesture: React.FC<TapGestureProps> = ({
  children,
  onTap,
  onDoubleTap,
  onLongPress,
  longPressDelay = 500,
  className = '',
}) => {
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapRef = useRef<number>(0);
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = () => {
    setIsPressed(true);
    
    if (onLongPress) {
      touchTimeoutRef.current = setTimeout(() => {
        onLongPress();
        setIsPressed(false);
      }, longPressDelay);
    }
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
    
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }

    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;
    
    if (timeSinceLastTap < 300 && onDoubleTap) {
      // Double tap
      onDoubleTap();
      lastTapRef.current = 0; // Reset to prevent triple tap
    } else {
      // Single tap
      lastTapRef.current = now;
      setTimeout(() => {
        if (lastTapRef.current === now && onTap) {
          onTap();
        }
      }, 300);
    }
  };

  return (
    <div
      className={`${className} ${isPressed ? 'opacity-80 scale-95' : ''} transition-all duration-150`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
};