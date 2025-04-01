import React, { useEffect, useRef, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ hideHeader = false, hideSideBar = false, children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const sidebarRef = useRef(null);
    const isMobileOrTablet = windowWidth < 1024; // Mobile & Tablette

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fermer le sidebar si on clique en dehors (uniquement sur mobile)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isSidebarOpen && isMobileOrTablet && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsSidebarOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isSidebarOpen, isMobileOrTablet]);

    return (
        <div className="flex flex-col h-screen">
            {/* Header fixé en haut */}
            {!hideHeader &&
                <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />}

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                {!hideSideBar &&
                    <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} sidebarRef={sidebarRef} />}

                {/* Contenu principal */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 transition-all duration-300 p-4 sm:p-6 md:p-8 mt-16">
                    {children}
                </main>

                {/* Overlay pour masquer le Sidebar en mobile */}
                {isSidebarOpen && isMobileOrTablet && (
                    <div className="fixed bg-transparent inset-0 bg-opacity-50 z-10 transition-opacity" onClick={() => setIsSidebarOpen(false)}></div>
                )}
            </div>
        </div>
    );
};

export default Layout;
