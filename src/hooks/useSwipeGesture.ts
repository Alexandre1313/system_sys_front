'use client'

import { useEffect, useState } from 'react';

interface SwipeGestureOptions {
    onSwipeRight?: () => void;
    onSwipeLeft?: () => void;
    minSwipeDistance?: number;
    edgeThreshold?: number; // Distance from edge to trigger swipe
}

export function useSwipeGesture({
    onSwipeRight,
    onSwipeLeft,
    minSwipeDistance = 50,
    edgeThreshold = 20
}: SwipeGestureOptions) {
    const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
    const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => {
            const touch = e.targetTouches[0];
            if (touch) {
                setTouchStart({ x: touch.clientX, y: touch.clientY });
                setTouchEnd(null);
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            const touch = e.targetTouches[0];
            if (touch) {
                setTouchEnd({ x: touch.clientX, y: touch.clientY });
            }
        };

        const handleTouchEnd = () => {
            if (!touchStart || !touchEnd) return;

            const distanceX = touchEnd.x - touchStart.x;
            const distanceY = Math.abs(touchEnd.y - touchStart.y);
            const isHorizontalSwipe = Math.abs(distanceX) > distanceY;

            // Only trigger if:
            // 1. It's a horizontal swipe
            // 2. Distance is greater than minimum
            // 3. Started near the edge (for swipe right) or anywhere (for swipe left)
            if (isHorizontalSwipe && Math.abs(distanceX) > minSwipeDistance) {
                if (distanceX > 0 && touchStart.x <= edgeThreshold && onSwipeRight) {
                    // Swipe right from left edge
                    onSwipeRight();
                } else if (distanceX < 0 && onSwipeLeft) {
                    // Swipe left from anywhere
                    onSwipeLeft();
                }
            }

            setTouchStart(null);
            setTouchEnd(null);
        };

        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [touchStart, touchEnd, onSwipeRight, onSwipeLeft, minSwipeDistance, edgeThreshold]);

    return {
        touchStart,
        touchEnd
    };
}
