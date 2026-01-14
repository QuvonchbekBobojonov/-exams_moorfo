import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Trophy, User, LogOut, Settings, GraduationCap, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SidebarLink = ({ to, icon: Icon, label, onClick }) => (
    <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
            `flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`
        }
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </NavLink>
);

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <aside className={`
                fixed md:static inset-y-0 left-0 z-50 w-64 border-r border-slate-800 flex flex-col p-4 bg-slate-950 transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="flex items-center justify-between py-6 mb-8 px-3">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-indigo-600 rounded-lg">
                            <GraduationCap className="text-white" size={24} />
                        </div>
                        <span className="text-xl font-bold tracking-tight uppercase">Dev<span className="text-indigo-500">Exams</span></span>
                    </div>
                    <button onClick={toggleSidebar} className="md:hidden text-slate-400">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 space-y-2">
                    <SidebarLink to="/" icon={LayoutDashboard} label="Boshqaruv Paneli" onClick={() => isOpen && toggleSidebar()} />
                    <SidebarLink to="/courses" icon={BookOpen} label="Kurslar" onClick={() => isOpen && toggleSidebar()} />
                    <SidebarLink to="/leaderboard" icon={Trophy} label="Reyting" onClick={() => isOpen && toggleSidebar()} />
                    <SidebarLink to="/profile" icon={User} label="Profil" onClick={() => isOpen && toggleSidebar()} />
                </nav>

                <div className="pt-4 mt-4 border-t border-slate-800 space-y-2">
                    <SidebarLink to="/settings" icon={Settings} label="Sozlamalar" onClick={() => isOpen && toggleSidebar()} />
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 p-3 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-all duration-200"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Chiqish</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
