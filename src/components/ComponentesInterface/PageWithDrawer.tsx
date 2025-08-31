'use client'

import { useState, useEffect } from 'react';
import DrawerNavigation from './DrawerNavigation';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { Menu } from 'react-feather';

interface PageWithDrawerProps {
    children: React.ReactNode;
    projectName?: string;
    sectionName?: string;
    currentPage?: string;
}

export default function PageWithDrawer({ children, projectName, sectionName, currentPage }: PageWithDrawerProps) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [showSwipeIndicator, setShowSwipeIndicator] = useState(true);

    // Swipe gesture hook
    useSwipeGesture({
        onSwipeRight: () => setIsDrawerOpen(true),
        onSwipeLeft: () => setIsDrawerOpen(false),
        minSwipeDistance: 50,
        edgeThreshold: 30
    });

    // Hide swipe indicator after first interaction or after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSwipeIndicator(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const handleDrawerOpen = () => {
        setIsDrawerOpen(true);
        setShowSwipeIndicator(false);
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
    };

    return (
        <div className="min-h-[100dvh] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative">
            {/* Background Pattern */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.1),transparent_70%)] pointer-events-none"></div>
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.1),transparent_70%)] pointer-events-none"></div>
            
            {/* Menu Button - Alinhado com Header */}
            <button
                onClick={handleDrawerOpen}
                className="fixed top-4 left-4 z-30 p-2 sm:p-3 bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg hover:bg-slate-800 transition-all duration-300 group lg:top-6 lg:left-6"
            >
                <Menu size={18} className="text-slate-400 group-hover:text-emerald-400" />
            </button>

            {/* Swipe Indicator */}
            {showSwipeIndicator && (
                <div className="fixed top-1/2 left-0 transform -translate-y-1/2 z-20 pointer-events-none">
                    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-r-xl p-3 animate-pulse">
                        <div className="flex items-center space-x-2 text-slate-400">
                            <div className="w-1 h-8 bg-emerald-500 rounded-full"></div>
                            <div className="text-xs">
                                <p>←</p>
                                <p className="text-[10px]">Deslize</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="relative z-10 min-h-[100dvh]">
                {children}
            </main>

            {/* Drawer Navigation */}
            <DrawerNavigation
                isOpen={isDrawerOpen}
                onClose={handleDrawerClose}
                projectName={projectName}
                sectionName={sectionName}
                currentPage={currentPage}
            />
        </div>
    );
}
