import { Search, Bell, ChevronDown, User as UserIcon, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <nav className="h-20 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950/50 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="md:hidden p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400"
                >
                    <Menu size={20} />
                </button>
                <div className="relative w-64 lg:w-96 hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Kurslarni qidirish..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 focus:ring-1 focus:ring-indigo-500 outline-none text-sm transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 font-black text-[10px] uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                    <span className="hidden xs:inline">{user.total_score} Ball</span>
                    <span className="xs:hidden">{user.total_score} B</span>
                </div>

                <div className="flex items-center space-x-3 pl-4 border-l border-slate-800">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-black tracking-tight uppercase">{user.username}</p>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{user.level || 1}-Daraja</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[1.5px]">
                        <div className="w-full h-full rounded-[10px] bg-slate-900 overflow-hidden">
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
