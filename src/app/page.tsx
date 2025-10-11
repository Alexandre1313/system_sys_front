"use client";

import Link from "next/link";
import { useEffect, useState } from 'react';
import { Clock, User, Wifi } from 'react-feather';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  const [userName, setUserName] = useState('');
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Update time every second
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.nome || user.username || 'Usuário');
      } catch {
        setUserName('Usuário');
      }
    }

    // Monitor online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return (
    <div className="min-h-[100dvh] bg-slate-950 relative flex flex-col w-full justify-between overflow-hidden">
      {/* Grid Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.03]"></div>
      
      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
      
      {/* Accent Glow Top Right */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"
           style={{ transform: `translateY(${scrollY * -0.1}px)` }}></div>
      
      {/* Accent Glow Bottom Left */}
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"
           style={{ transform: `translateY(${scrollY * 0.05}px)` }}></div>

      {/* 3D Perspective Container */}
      <div className="fixed inset-0 pointer-events-none" style={{ perspective: '600px' }}>
      </div>
      {/* Background Icons - Random scattered expedition/logistics icons */}
      <div className="fixed inset-0 opacity-[0.04] transform-gpu pointer-events-none" style={{ 
        transform: `translateZ(-200px) scale(0.8) translateY(${scrollY * 0.3}px)` 
      }}>
        {/* Truck 1 */}
        <div 
          className="absolute w-12 h-12 lg:w-16 lg:h-16 cursor-pointer hover:opacity-50 transition-opacity duration-300"
          style={{
            top: '5%',
            left: '2%',
            transform: 'rotate(15deg)'
          }}
          onClick={() => console.log('Truck clicked!')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <path d="M1 3h15v13H1z"/>
            <path d="M16 8h4l3 6v4h-7v-10z"/>
            <circle cx="5" cy="19" r="2"/>
            <circle cx="19" cy="19" r="2"/>
          </svg>
        </div>
        
        {/* Package 1 */}
        <div 
          className="absolute w-8 h-8 lg:w-12 lg:h-12 cursor-pointer hover:opacity-50 transition-opacity duration-300"
          style={{
            top: '15%',
            right: '3%',
            transform: 'rotate(-20deg)'
          }}
          onClick={() => console.log('Package clicked!')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <path d="M12 2l8 4.5v11L12 22l-8-4.5v-11L12 2z"/>
            <path d="M12 2v20"/>
            <path d="M20 6.5L12 11l-8-4.5"/>
          </svg>
        </div>
        
        {/* Pallet */}
        <div 
          className="absolute w-10 h-10 lg:w-14 lg:h-14"
          style={{
            top: '85%',
            left: '1%',
            transform: 'rotate(30deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <rect x="2" y="18" width="20" height="4"/>
            <rect x="2" y="14" width="20" height="2"/>
            <rect x="2" y="10" width="20" height="2"/>
            <rect x="2" y="6" width="20" height="2"/>
            <rect x="2" y="2" width="20" height="2"/>
            <path d="M8 2v16"/>
            <path d="M16 2v16"/>
          </svg>
        </div>
        
        {/* Label/Tag */}
        <div 
          className="absolute w-6 h-6 lg:w-10 lg:h-10"
          style={{
            top: '95%',
            right: '2%',
            transform: 'rotate(-15deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
            <path d="M7 7h.01"/>
          </svg>
        </div>
        
        {/* Container */}
        <div 
          className="absolute w-8 h-8 lg:w-12 lg:h-12"
          style={{
            top: '45%',
            left: '1%',
            transform: 'rotate(25deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <rect x="2" y="6" width="20" height="14" rx="2"/>
            <path d="M2 10h20"/>
            <path d="M8 6V2"/>
            <path d="M16 6V2"/>
            <path d="M12 14v4"/>
          </svg>
        </div>
        
        {/* Forklift */}
        <div 
          className="absolute w-6 h-6 lg:w-8 lg:h-8"
          style={{
            top: '25%',
            left: '97%',
            transform: 'rotate(-35deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <rect x="3" y="16" width="8" height="6"/>
            <path d="M11 16v-4h4l3-3v7"/>
            <circle cx="6" cy="19" r="1"/>
            <circle cx="18" cy="19" r="1"/>
            <path d="M15 9l-3-3h-4v3"/>
          </svg>
        </div>
        
        {/* Package 2 */}
        <div 
          className="absolute w-12 h-12 lg:w-16 lg:h-16"
          style={{
            top: '6%',
            left: '72%',
            transform: 'rotate(10deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <path d="M3.27 6.96L12 12.01l8.73-5.05"/>
            <path d="M12 22.08V12"/>
          </svg>
        </div>
        
        {/* Truck 2 */}
        <div 
          className="absolute w-8 h-8 lg:w-10 lg:h-10"
          style={{
            top: '82%',
            right: '18%',
            transform: 'rotate(-25deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <path d="M1 3h15v13H1z"/>
            <path d="M16 8h4l3 6v4h-7v-10z"/>
            <circle cx="5" cy="19" r="2"/>
            <circle cx="19" cy="19" r="2"/>
          </svg>
        </div>
        
        {/* Warehouse */}
        <div 
          className="absolute w-10 h-10 lg:w-12 lg:h-12"
          style={{
            top: '52%',
            left: '88%',
            transform: 'rotate(20deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <path d="M9 22V12h6v10"/>
            <path d="M9 12h6"/>
          </svg>
        </div>
        
        {/* Shipment Box */}
        <div 
          className="absolute w-12 h-12 lg:w-14 lg:h-14"
          style={{
            top: '68%',
            left: '42%',
            transform: 'rotate(-10deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <path d="M3.27 6.96L12 12.01l8.73-5.05"/>
            <path d="M12 22.08V12"/>
          </svg>
        </div>
        
        {/* Barcode Scanner */}
        <div 
          className="absolute w-6 h-6 lg:w-8 lg:h-8"
          style={{
            top: '18%',
            left: '35%',
            transform: 'rotate(45deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <path d="M8 21v-4"/>
            <path d="M16 21v-4"/>
            <path d="M12 21v-4"/>
            <path d="M4 8h16"/>
            <path d="M4 12h16"/>
          </svg>
        </div>
        
        {/* Conveyor Belt */}
        <div 
          className="absolute w-8 h-8 lg:w-10 lg:h-10"
          style={{
            top: '38%',
            right: '35%',
            transform: 'rotate(-30deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <rect x="2" y="8" width="20" height="8" rx="1"/>
            <path d="M6 8v8"/>
            <path d="M18 8v8"/>
            <circle cx="6" cy="12" r="2"/>
            <circle cx="18" cy="12" r="2"/>
          </svg>
        </div>
        
        {/* Clipboard */}
        <div 
          className="absolute w-6 h-6 lg:w-8 lg:h-8"
          style={{
            top: '62%',
            left: '28%',
            transform: 'rotate(35deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="2"/>
            <path d="M9 12h6"/>
            <path d="M9 16h6"/>
            <path d="M9 20h6"/>
          </svg>
        </div>
        
        {/* Scale */}
        <div 
          className="absolute w-10 h-10 lg:w-12 lg:h-12"
          style={{
            top: '28%',
            left: '55%',
            transform: 'rotate(-15deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <path d="M12 2v20"/>
            <path d="M6 6l6-4 6 4"/>
            <path d="M6 18l6 4 6-4"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </div>
        
        {/* Map Pin */}
        <div 
          className="absolute w-8 h-8 lg:w-10 lg:h-10"
          style={{
            top: '48%',
            right: '25%',
            transform: 'rotate(20deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        
        {/* Package 3 */}
        <div 
          className="absolute w-6 h-6 lg:w-8 lg:h-8"
          style={{
            top: '78%',
            left: '65%',
            transform: 'rotate(-40deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <path d="M12 2l8 4.5v11L12 22l-8-4.5v-11L12 2z"/>
            <path d="M12 2v20"/>
            <path d="M20 6.5L12 11l-8-4.5"/>
          </svg>
        </div>
        
        {/* Truck 3 */}
        <div 
          className="absolute w-8 h-8 lg:w-10 lg:h-10"
          style={{
            top: '15%',
            right: '45%',
            transform: 'rotate(25deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <path d="M1 3h15v13H1z"/>
            <path d="M16 8h4l3 6v4h-7v-10z"/>
            <circle cx="5" cy="19" r="2"/>
            <circle cx="19" cy="19" r="2"/>
          </svg>
        </div>
        
        {/* Box Stack */}
        <div 
          className="absolute w-6 h-6 lg:w-8 lg:h-8"
          style={{
            top: '45%',
            left: '75%',
            transform: 'rotate(-20deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <rect x="3" y="8" width="18" height="12" rx="1"/>
            <rect x="3" y="4" width="18" height="8" rx="1"/>
            <rect x="3" y="16" width="18" height="4" rx="1"/>
            <path d="M12 4v16"/>
          </svg>
        </div>
        
        {/* Delivery Van */}
        <div 
          className="absolute w-10 h-10 lg:w-12 lg:h-12"
          style={{
            top: '65%',
            right: '50%',
            transform: 'rotate(15deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <rect x="1" y="3" width="15" height="13"/>
            <path d="M16 8h4l3 6v4h-7v-10z"/>
            <circle cx="5.5" cy="18.5" r="2.5"/>
            <circle cx="18.5" cy="18.5" r="2.5"/>
            <path d="M9 8h6"/>
          </svg>
        </div>
        
        {/* Package 4 */}
        <div 
          className="absolute w-8 h-8 lg:w-10 lg:h-10"
          style={{
            top: '35%',
            left: '95%',
            transform: 'rotate(-25deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <path d="M3.27 6.96L12 12.01l8.73-5.05"/>
            <path d="M12 22.08V12"/>
          </svg>
        </div>
        
        {/* Cargo Ship */}
        <div 
          className="absolute w-12 h-12 lg:w-14 lg:h-14"
          style={{
            top: '8%',
            left: '25%',
            transform: 'rotate(-5deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <path d="M2 18h20"/>
            <path d="M4 14l2-8h12l2 8"/>
            <path d="M8 14v4"/>
            <path d="M16 14v4"/>
            <path d="M6 10h12"/>
          </svg>
        </div>
        
        {/* Pallet 2 */}
        <div 
          className="absolute w-8 h-8 lg:w-10 lg:h-10"
          style={{
            top: '25%',
            left: '45%',
            transform: 'rotate(50deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <rect x="2" y="18" width="20" height="4"/>
            <rect x="2" y="14" width="20" height="2"/>
            <rect x="2" y="10" width="20" height="2"/>
            <rect x="2" y="6" width="20" height="2"/>
            <rect x="2" y="2" width="20" height="2"/>
            <path d="M8 2v16"/>
            <path d="M16 2v16"/>
          </svg>
        </div>
        
        {/* Box 5 */}
        <div 
          className="absolute w-6 h-6 lg:w-8 lg:h-8"
          style={{
            top: '42%',
            left: '15%',
            transform: 'rotate(-60deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M9 9h6v6H9z"/>
          </svg>
        </div>
        
        {/* Truck 4 */}
        <div 
          className="absolute w-10 h-10 lg:w-12 lg:h-12"
          style={{
            top: '58%',
            left: '85%',
            transform: 'rotate(40deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <path d="M1 3h15v13H1z"/>
            <path d="M16 8h4l3 6v4h-7v-10z"/>
            <circle cx="5" cy="19" r="2"/>
            <circle cx="19" cy="19" r="2"/>
          </svg>
        </div>
        
        {/* Label 2 */}
        <div 
          className="absolute w-6 h-6 lg:w-8 lg:h-8"
          style={{
            top: '72%',
            left: '25%',
            transform: 'rotate(-10deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
            <path d="M7 7h.01"/>
          </svg>
        </div>
        
        {/* Package 5 */}
        <div 
          className="absolute w-8 h-8 lg:w-10 lg:h-10"
          style={{
            top: '85%',
            left: '55%',
            transform: 'rotate(30deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <path d="M12 2l8 4.5v11L12 22l-8-4.5v-11L12 2z"/>
            <path d="M12 2v20"/>
            <path d="M20 6.5L12 11l-8-4.5"/>
          </svg>
        </div>
        
        {/* Warehouse 2 */}
        <div 
          className="absolute w-10 h-10 lg:w-12 lg:h-12"
          style={{
            top: '12%',
            right: '30%',
            transform: 'rotate(-45deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <path d="M9 22V12h6v10"/>
            <path d="M9 12h6"/>
          </svg>
        </div>
        
        {/* Container 2 */}
        <div 
          className="absolute w-8 h-8 lg:w-10 lg:h-10"
          style={{
            top: '38%',
            left: '60%',
            transform: 'rotate(25deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <rect x="2" y="6" width="20" height="14" rx="2"/>
            <path d="M2 10h20"/>
            <path d="M8 6V2"/>
            <path d="M16 6V2"/>
            <path d="M12 14v4"/>
          </svg>
        </div>
        
        {/* Forklift 2 */}
        <div 
          className="absolute w-8 h-8 lg:w-10 lg:h-10"
          style={{
            top: '68%',
            right: '15%',
            transform: 'rotate(-35deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <rect x="3" y="16" width="8" height="6"/>
            <path d="M11 16v-4h4l3-3v7"/>
            <circle cx="6" cy="19" r="1"/>
            <circle cx="18" cy="19" r="1"/>
            <path d="M15 9l-3-3h-4v3"/>
          </svg>
        </div>
        
        {/* Box 6 */}
        <div 
          className="absolute w-6 h-6 lg:w-8 lg:h-8"
          style={{
            top: '22%',
            left: '90%',
            transform: 'rotate(15deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M9 9h6v6H9z"/>
          </svg>
        </div>
        
        {/* Package 6 */}
        <div 
          className="absolute w-10 h-10 lg:w-12 lg:h-12"
          style={{
            top: '48%',
            left: '35%',
            transform: 'rotate(-20deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <path d="M3.27 6.96L12 12.01l8.73-5.05"/>
            <path d="M12 22.08V12"/>
          </svg>
        </div>
        
        {/* Truck 5 */}
        <div 
          className="absolute w-8 h-8 lg:w-10 lg:h-10"
          style={{
            top: '75%',
            left: '8%',
            transform: 'rotate(60deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <path d="M1 3h15v13H1z"/>
            <path d="M16 8h4l3 6v4h-7v-10z"/>
            <circle cx="5" cy="19" r="2"/>
            <circle cx="19" cy="19" r="2"/>
          </svg>
        </div>
        
        {/* Pallet 3 */}
        <div 
          className="absolute w-6 h-6 lg:w-8 lg:h-8"
          style={{
            top: '35%',
            right: '8%',
            transform: 'rotate(-50deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <rect x="2" y="18" width="20" height="4"/>
            <rect x="2" y="14" width="20" height="2"/>
            <rect x="2" y="10" width="20" height="2"/>
            <rect x="2" y="6" width="20" height="2"/>
            <rect x="2" y="2" width="20" height="2"/>
            <path d="M8 2v16"/>
            <path d="M16 2v16"/>
          </svg>
        </div>
        
        {/* Box 7 */}
        <div 
          className="absolute w-8 h-8 lg:w-10 lg:h-10"
          style={{
            top: '62%',
            left: '50%',
            transform: 'rotate(45deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M9 9h6v6H9z"/>
          </svg>
        </div>
        
        {/* Package 7 */}
        <div 
          className="absolute w-6 h-6 lg:w-8 lg:h-8"
          style={{
            top: '18%',
            left: '65%',
            transform: 'rotate(-25deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <path d="M12 2l8 4.5v11L12 22l-8-4.5v-11L12 2z"/>
            <path d="M12 2v20"/>
            <path d="M20 6.5L12 11l-8-4.5"/>
          </svg>
        </div>
        
        {/* Container 3 */}
        <div 
          className="absolute w-10 h-10 lg:w-12 lg:h-12"
          style={{
            top: '52%',
            right: '40%',
            transform: 'rotate(20deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <rect x="2" y="6" width="20" height="14" rx="2"/>
            <path d="M2 10h20"/>
            <path d="M8 6V2"/>
            <path d="M16 6V2"/>
            <path d="M12 14v4"/>
          </svg>
        </div>
        
        {/* Truck 6 */}
        <div 
          className="absolute w-6 h-6 lg:w-8 lg:h-8"
          style={{
            top: '88%',
            left: '75%',
            transform: 'rotate(-15deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <path d="M1 3h15v13H1z"/>
            <path d="M16 8h4l3 6v4h-7v-10z"/>
            <circle cx="5" cy="19" r="2"/>
            <circle cx="19" cy="19" r="2"/>
          </svg>
        </div>
        
        {/* Label 3 */}
        <div 
          className="absolute w-8 h-8 lg:w-10 lg:h-10"
          style={{
            top: '32%',
            left: '80%',
            transform: 'rotate(35deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
            <path d="M7 7h.01"/>
          </svg>
        </div>
        
        {/* Box 8 */}
        <div 
          className="absolute w-10 h-10 lg:w-12 lg:h-12"
          style={{
            top: '78%',
            right: '30%',
            transform: 'rotate(-40deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M9 9h6v6H9z"/>
          </svg>
        </div>
        
        {/* Package 8 */}
        <div 
          className="absolute w-8 h-8 lg:w-10 lg:h-10"
          style={{
            top: '42%',
            left: '20%',
            transform: 'rotate(-60deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <path d="M3.27 6.96L12 12.01l8.73-5.05"/>
            <path d="M12 22.08V12"/>
          </svg>
        </div>
        
        {/* Warehouse 3 */}
        <div 
          className="absolute w-6 h-6 lg:w-8 lg:h-8"
          style={{
            top: '68%',
            left: '90%',
            transform: 'rotate(25deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <path d="M9 22V12h6v10"/>
            <path d="M9 12h6"/>
          </svg>
        </div>
        
        {/* Forklift 3 */}
        <div 
          className="absolute w-10 h-10 lg:w-12 lg:h-12"
          style={{
            top: '15%',
            left: '50%',
            transform: 'rotate(-30deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <rect x="3" y="16" width="8" height="6"/>
            <path d="M11 16v-4h4l3-3v7"/>
            <circle cx="6" cy="19" r="1"/>
            <circle cx="18" cy="19" r="1"/>
            <path d="M15 9l-3-3h-4v3"/>
          </svg>
        </div>
        
        {/* Container 4 */}
        <div 
          className="absolute w-8 h-8 lg:w-10 lg:h-10"
          style={{
            top: '55%',
            left: '70%',
            transform: 'rotate(50deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <rect x="2" y="6" width="20" height="14" rx="2"/>
            <path d="M2 10h20"/>
            <path d="M8 6V2"/>
            <path d="M16 6V2"/>
            <path d="M12 14v4"/>
          </svg>
        </div>
        
        {/* Box 9 */}
        <div 
          className="absolute w-6 h-6 lg:w-8 lg:h-8"
          style={{
            top: '82%',
            left: '35%',
            transform: 'rotate(-20deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M9 9h6v6H9z"/>
          </svg>
        </div>
        
        {/* Package 9 */}
        <div 
          className="absolute w-8 h-8 lg:w-10 lg:h-10"
          style={{
            top: '25%',
            right: '20%',
            transform: 'rotate(40deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <path d="M12 2l8 4.5v11L12 22l-8-4.5v-11L12 2z"/>
            <path d="M12 2v20"/>
            <path d="M20 6.5L12 11l-8-4.5"/>
          </svg>
        </div>
        
        {/* Truck 7 */}
        <div 
          className="absolute w-10 h-10 lg:w-12 lg:h-12"
          style={{
            top: '58%',
            left: '10%',
            transform: 'rotate(-45deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <path d="M1 3h15v13H1z"/>
            <path d="M16 8h4l3 6v4h-7v-10z"/>
            <circle cx="5" cy="19" r="2"/>
            <circle cx="19" cy="19" r="2"/>
          </svg>
        </div>
        
        {/* Pallet 4 */}
        <div 
          className="absolute w-8 h-8 lg:w-10 lg:h-10"
          style={{
            top: '38%',
            left: '40%',
            transform: 'rotate(60deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <rect x="2" y="18" width="20" height="4"/>
            <rect x="2" y="14" width="20" height="2"/>
            <rect x="2" y="10" width="20" height="2"/>
            <rect x="2" y="6" width="20" height="2"/>
            <rect x="2" y="2" width="20" height="2"/>
            <path d="M8 2v16"/>
            <path d="M16 2v16"/>
          </svg>
        </div>
        
        {/* Box 10 */}
        <div 
          className="absolute w-6 h-6 lg:w-8 lg:h-8"
          style={{
            top: '72%',
            right: '10%',
            transform: 'rotate(30deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M9 9h6v6H9z"/>
          </svg>
        </div>
        
        {/* Additional scattered icons */}
        <div 
          className="absolute w-4 h-4 lg:w-6 lg:h-6 cursor-pointer hover:opacity-50 transition-opacity duration-300"
          style={{
            top: '8%',
            left: '50%',
            transform: 'rotate(45deg)'
          }}
          onClick={() => console.log('Icon clicked!')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <path d="M12 2l8 4.5v11L12 22l-8-4.5v-11L12 2z"/>
            <path d="M12 2v20"/>
          </svg>
        </div>
        
        <div 
          className="absolute w-5 h-5 lg:w-7 lg:h-7 cursor-pointer hover:opacity-50 transition-opacity duration-300"
          style={{
            top: '35%',
            left: '95%',
            transform: 'rotate(-60deg)'
          }}
          onClick={() => console.log('Icon clicked!')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <path d="M1 3h15v13H1z"/>
            <path d="M16 8h4l3 6v4h-7v-10z"/>
            <circle cx="5" cy="19" r="2"/>
            <circle cx="19" cy="19" r="2"/>
          </svg>
        </div>
        
        <div 
          className="absolute w-3 h-3 lg:w-5 lg:h-5"
          style={{
            top: '60%',
            left: '98%',
            transform: 'rotate(75deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <rect x="2" y="18" width="20" height="4"/>
            <rect x="2" y="14" width="20" height="2"/>
            <rect x="2" y="10" width="20" height="2"/>
            <rect x="2" y="6" width="20" height="2"/>
            <rect x="2" y="2" width="20" height="2"/>
          </svg>
        </div>
        
        <div 
          className="absolute w-4 h-4 lg:w-6 lg:h-6"
          style={{
            top: '90%',
            left: '50%',
            transform: 'rotate(-45deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
        </div>
        
        <div 
          className="absolute w-3 h-3 lg:w-5 lg:h-5"
          style={{
            top: '10%',
            left: '75%',
            transform: 'rotate(90deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
          </svg>
        </div>
        
        <div 
          className="absolute w-4 h-4 lg:w-6 lg:h-6"
          style={{
            top: '75%',
            left: '25%',
            transform: 'rotate(-30deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <rect x="2" y="6" width="20" height="14" rx="2"/>
            <path d="M2 10h20"/>
            <path d="M8 6V2"/>
            <path d="M16 6V2"/>
          </svg>
        </div>
        
        <div 
          className="absolute w-3 h-3 lg:w-5 lg:h-5"
          style={{
            top: '50%',
            left: '5%',
            transform: 'rotate(120deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <path d="M9 22V12h6v10"/>
          </svg>
        </div>
        
        <div 
          className="absolute w-4 h-4 lg:w-6 lg:h-6"
          style={{
            top: '20%',
            left: '25%',
            transform: 'rotate(-75deg)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-slate-400">
            <rect x="3" y="16" width="8" height="6"/>
            <path d="M11 16v-4h4l3-3v7"/>
            <circle cx="6" cy="19" r="1"/>
            <circle cx="18" cy="19" r="1"/>
          </svg>
        </div>
      </div>
      
      {/* Header */}
      <header className="relative z-20 w-full px-4 py-4 sm:px-6 lg:px-8 bg-slate-900 sm:bg-slate-900/30 sm:backdrop-blur-sm border-b border-slate-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-white font-bold text-sm sm:text-base">S</span>
            </div>
            <div className="text-white">
              <h1 className="text-lg sm:text-xl font-semibold">SYS EXPED</h1>
              <p className="text-xs sm:text-sm text-slate-400">Sistema de Expedição</p>
            </div>
          </div>
          
          {/* Dynamic Info */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* User Info */}
            {userName && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-800 sm:bg-slate-800/60 sm:backdrop-blur-md rounded-lg border border-slate-700/40">
                <User size={14} className="text-emerald-400" />
                <span className="text-sm text-slate-300">{userName}</span>
              </div>
            )}
            
            {/* Time */}
            {currentTime && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800 sm:bg-slate-800/60 sm:backdrop-blur-md rounded-lg border border-slate-700/40">
                <Clock size={14} className="text-blue-400" />
                <span className="text-sm text-slate-300">{currentTime}</span>
              </div>
            )}
            
            {/* Status */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 sm:bg-slate-800/60 sm:backdrop-blur-md rounded-lg border border-slate-700/40">
              <Wifi size={14} className={isOnline ? 'text-green-400' : 'text-red-400'} />
              <span className="hidden sm:inline text-xs text-slate-300">{isOnline ? 'Online' : 'Offline'}</span>
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-30 flex-1 flex flex-col items-center justify-start px-4 py-8 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <div>
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center mb-4 transform-gpu">
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 transform hover:scale-105 hover:rotate-1 transition-all duration-500 cursor-default">
                SYS
              </h1>
              <span className="text-2xl sm:text-4xl lg:text-6xl font-bold text-blue-400 ml-2 transform hover:scale-110 hover:rotate-3 transition-all duration-500 cursor-default">E</span>
              <span className="text-xl sm:text-3xl lg:text-5xl font-medium text-slate-300 ml-0 transform hover:scale-105 hover:-rotate-1 transition-all duration-500 cursor-default">XPED</span>
            </div>
            <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto transform hover:scale-105 transition-all duration-300 cursor-default">
              Sistema para gestão de expedição e logística
            </p>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-purple-500/5 rounded-full blur-3xl transform scale-150 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          </div>

          {/* Navigation Grid */}
          <div className="w-full max-w-6xl">
            {/* Primary Actions */}
            <div className="mb-8">
              <h2 className="text-slate-300 text-sm font-medium mb-4 px-4">Operações Principais</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Link href="/projetos" className="group animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 sm:from-emerald-600/90 sm:to-emerald-700/90 sm:backdrop-blur-md hover:from-emerald-500 hover:to-emerald-600 sm:hover:from-emerald-500/90 sm:hover:to-emerald-600/90 rounded-xl p-4 sm:p-6 transition-all duration-300 border border-emerald-500/30 hover:border-emerald-400/50 relative z-50 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold text-sm sm:text-base">Expedição</h3>
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center transition-transform duration-300">
                        <span className="text-white text-xs">📦</span>
                      </div>
                    </div>
                    <p className="text-emerald-100 text-xs sm:text-sm opacity-90">Gestão de expedições</p>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </Link>

                <Link href="/entradas_embalagem" className="group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <div className="bg-slate-800 sm:bg-slate-800/70 sm:backdrop-blur-md hover:bg-slate-700 sm:hover:bg-slate-700/70 rounded-xl p-4 sm:p-6 transition-all duration-300 border border-slate-700/50 hover:border-blue-500/50 relative z-50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold text-sm sm:text-base">Embalagem</h3>
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center transition-transform duration-300">
                        <span className="text-blue-400 text-xs">📋</span>
                      </div>
                    </div>
                    <p className="text-slate-300 text-xs sm:text-sm">Controle de estoque</p>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </Link>

                <Link href="/graf" className="group animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <div className="bg-slate-800 sm:bg-slate-800/70 sm:backdrop-blur-md hover:bg-slate-700 sm:hover:bg-slate-700/70 rounded-xl p-4 sm:p-6 transition-all duration-300 border border-slate-700/50 hover:border-purple-500/50 relative z-50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold text-sm sm:text-base">Gráficos</h3>
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center transition-transform duration-300">
                        <span className="text-purple-400 text-xs">📊</span>
                      </div>
                    </div>
                    <p className="text-slate-300 text-xs sm:text-sm">Análises e métricas</p>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </Link>

                <Link href="/estoques" className="group animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <div className="bg-slate-800 sm:bg-slate-800/70 sm:backdrop-blur-md hover:bg-slate-700 sm:hover:bg-slate-700/70 rounded-xl p-4 sm:p-6 transition-all duration-300 border border-slate-700/50 hover:border-orange-500/50 relative z-50 hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold text-sm sm:text-base">Movimentações</h3>
                      <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center transition-transform duration-300">
                        <span className="text-orange-400 text-xs">📈</span>
                      </div>
                    </div>
                    <p className="text-slate-300 text-xs sm:text-sm">Análise de estoque</p>
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Secondary Actions */}
            <div className="mb-8">
              <h2 className="text-slate-300 text-sm font-medium mb-4 px-4">Relatórios e Análises</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Link href="/rankingusers" className="group animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                  <div className="bg-slate-800 sm:bg-slate-800/60 sm:backdrop-blur-md hover:bg-slate-700 sm:hover:bg-slate-700/60 rounded-xl p-4 transition-all duration-300 border border-slate-700/40 hover:border-slate-500/60 relative z-50 hover:shadow-[0_0_20px_rgba(148,163,184,0.15)]">
                    <h3 className="text-white font-medium text-sm mb-1">Ranking</h3>
                    <p className="text-slate-300 text-xs">Performance dos usuários</p>
                  </div>
                </Link>

                <Link href="/resume2" className="group animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                  <div className="bg-slate-800 sm:bg-slate-800/60 sm:backdrop-blur-md hover:bg-slate-700 sm:hover:bg-slate-700/60 rounded-xl p-4 transition-all duration-300 border border-slate-700/40 hover:border-slate-500/60 relative z-50 hover:shadow-[0_0_20px_rgba(148,163,184,0.15)]">
                    <h3 className="text-white font-medium text-sm mb-1">Relatórios PK</h3>
                    <p className="text-slate-300 text-xs">Relatórios por Kits ou peças avulsas</p>
                  </div>
                </Link>

                <Link href="/resumepp" className="group animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                  <div className="bg-slate-800 sm:bg-slate-800/60 sm:backdrop-blur-md hover:bg-slate-700 sm:hover:bg-slate-700/60 rounded-xl p-4 transition-all duration-300 border border-slate-700/40 hover:border-slate-500/60 relative z-50 hover:shadow-[0_0_20px_rgba(148,163,184,0.15)]">
                    <h3 className="text-white font-medium text-sm mb-1">Relatórios PP</h3>
                    <p className="text-slate-300 text-xs">Relatórios somente por peças avulsas</p>
                  </div>
                </Link>

                <Link href="/caixas_por_grade_m" className="group animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                  <div className="bg-slate-800 sm:bg-slate-800/60 sm:backdrop-blur-md hover:bg-slate-700 sm:hover:bg-slate-700/60 rounded-xl p-4 transition-all duration-300 border border-slate-700/40 hover:border-slate-500/60 relative z-50 hover:shadow-[0_0_20px_rgba(148,163,184,0.15)]">
                    <h3 className="text-white font-medium text-sm mb-1">Etiquetas/Grade</h3>
                    <p className="text-slate-300 text-xs">Impressão de etiquetas por grade</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Additional Tools */}
            <div>
              <h2 className="text-slate-300 text-sm font-medium mb-4 px-4">Ferramentas Adicionais</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Link href="/relatoriosaidapordata" className="group animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
                  <div className="bg-slate-800 sm:bg-slate-800/60 sm:backdrop-blur-md hover:bg-slate-700 sm:hover:bg-slate-700/60 rounded-xl p-4 transition-all duration-300 border border-slate-700/40 hover:border-slate-500/60 relative z-50 hover:shadow-[0_0_20px_rgba(148,163,184,0.15)]">
                    <h3 className="text-white font-medium text-sm mb-1">Relatório Saída</h3>
                    <p className="text-slate-300 text-xs">Saídas por data</p>
                  </div>
                </Link>

                <Link href="/relatoriosaidapordataescola" className="group animate-fade-in-up" style={{ animationDelay: '1s' }}>
                  <div className="bg-slate-800 sm:bg-slate-800/60 sm:backdrop-blur-md hover:bg-slate-700 sm:hover:bg-slate-700/60 rounded-xl p-4 transition-all duration-300 border border-slate-700/40 hover:border-slate-500/60 relative z-50 hover:shadow-[0_0_20px_rgba(148,163,184,0.15)]">
                    <h3 className="text-white font-medium text-sm mb-1">Relatório Saída P/ Escola</h3>
                    <p className="text-slate-300 text-xs">Saídas por data e escola</p>
                  </div>
                </Link>

                <Link href="/" className="group hidden">
                  <div className="bg-slate-800 hover:bg-slate-700 rounded-xl p-4 transition-all duration-300 transform hover:scale-105 border border-slate-700">
                    <h3 className="text-white font-medium text-sm mb-1"></h3>
                    <p className="text-slate-400 text-xs"></p>
                  </div>
                </Link>

                <Link href="/" className="group hidden">
                  <div className="bg-slate-800 hover:bg-slate-700 rounded-xl p-4 transition-all duration-300 transform hover:scale-105 border border-slate-700">
                    <h3 className="text-white font-medium text-sm mb-1"></h3>
                    <p className="text-slate-400 text-xs"></p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative w-full px-4 py-6 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-4 text-xs sm:text-sm">
            <Link href="/resume" className="text-slate-400 hover:text-white transition-colors">
              Resumos Legacy
            </Link>
            <Link href="/" className="text-slate-400 hover:text-white transition-colors">
              ----
            </Link>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500">Status: Online</span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm">
            © {new Date().getFullYear()} - SYS EXPED - All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
