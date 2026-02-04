import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, Crown, ArrowUp, ArrowDown, Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('all'); // 'all', 'weekly', 'monthly'
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                const response = await API.get(`/auth/leaderboard/?period=${period}`);
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, [period]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-indigo-500" size={48} />
            </div>
        );
    }

    const topThree = users.slice(0, 3);
    const others = users.slice(3);

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Global <span className="text-indigo-500">Shon-sharaf Zali</span></h1>
                    <p className="text-slate-400 max-w-sm">Dunyodagi eng yaxshi dasturchilar bilan raqobatlashing. Har bir ball sizning reytingingizni belgilaydi.</p>
                </div>

                <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-md shadow-inner">
                    <button
                        onClick={() => setPeriod('all')}
                        className={`px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${period === 'all' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:bg-slate-800'}`}
                    >
                        Barchasi
                    </button>
                    <button
                        onClick={() => setPeriod('monthly')}
                        className={`px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${period === 'monthly' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:bg-slate-800'}`}
                    >
                        Oylik
                    </button>
                    <button
                        onClick={() => setPeriod('weekly')}
                        className={`px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${period === 'weekly' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:bg-slate-800'}`}
                    >
                        Haftalik
                    </button>
                </div>
            </header>

            {topThree.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 items-end pt-12">
                    {/* 1st Place */}
                    {topThree[0] && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => navigate(`/users/${topThree[0].id}`)}
                            className="glass-card p-8 md:p-10 rounded-[2.5rem] text-center relative pt-16 border-indigo-500/30 md:order-2 z-10 md:scale-110 shadow-[0_20px_50px_rgba(79,70,229,0.15)] bg-slate-900/40 cursor-pointer hover:bg-slate-800/60 transition-colors"
                        >
                            <div className="absolute top-[-50px] left-1/2 -translate-x-1/2">
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-amber-500/20 p-1.5 border-4 border-amber-500 relative">
                                    <img src={topThree[0].avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[0].username}`} className="w-full h-full rounded-full bg-slate-900" alt="" />
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-amber-500 animate-bounce">
                                        <Crown size={28} md:size={32} fill="currentColor" />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-950 font-black w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-4 border-slate-900 text-lg md:text-xl">1</div>
                                </div>
                            </div>
                            <h3 className="text-xl md:text-2xl font-black mt-4 uppercase tracking-tight">{topThree[0].username}</h3>
                            <p className="text-indigo-400 text-[10px] font-black mb-6 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                                <Star size={12} fill="currentColor" /> {topThree[0].rank || 1}-O'rin
                            </p>
                            <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-amber-300 via-amber-500 to-amber-600 bg-clip-text text-transparent">
                                {topThree[0].total_score.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black mt-2">Jami Ballar</div>
                        </motion.div>
                    )}

                    {/* 2nd Place */}
                    {topThree[1] && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            onClick={() => navigate(`/users/${topThree[1].id}`)}
                            className="glass-card p-6 md:p-8 rounded-[2rem] text-center relative pt-12 md:order-1 h-fit cursor-pointer hover:bg-slate-800/60 transition-colors"
                        >
                            <div className="absolute top-[-40px] left-1/2 -translate-x-1/2">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-400/20 p-1 border-2 border-slate-400 relative">
                                    <img src={topThree[1].avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[1].username}`} className="w-full h-full rounded-full bg-slate-900" alt="" />
                                    <div className="absolute -bottom-2 -right-2 bg-slate-400 text-slate-950 font-black w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center border-4 border-slate-900 text-[10px] md:text-xs">2</div>
                                </div>
                            </div>
                            <h3 className="text-lg md:text-xl font-bold mt-4">{topThree[1].username}</h3>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">{topThree[1].level}-Daraja</p>
                            <div className="text-2xl md:text-3xl font-black text-indigo-400">{topThree[1].total_score.toLocaleString()}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">Ballar</div>
                        </motion.div>
                    )}

                    {/* 3rd Place */}
                    {topThree[2] && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            onClick={() => navigate(`/users/${topThree[2].id}`)}
                            className="glass-card p-6 md:p-8 rounded-[2rem] text-center relative pt-12 md:order-3 h-fit cursor-pointer hover:bg-slate-800/60 transition-colors"
                        >
                            <div className="absolute top-[-40px] left-1/2 -translate-x-1/2">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-amber-700/20 p-1 border-2 border-amber-800 relative">
                                    <img src={topThree[2].avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[2].username}`} className="w-full h-full rounded-full bg-slate-900" alt="" />
                                    <div className="absolute -bottom-2 -right-2 bg-amber-800 text-white font-black w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center border-4 border-slate-900 text-[10px] md:text-xs">3</div>
                                </div>
                            </div>
                            <h3 className="text-lg md:text-xl font-bold mt-4">{topThree[2].username}</h3>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">{topThree[2].level}-Daraja</p>
                            <div className="text-2xl md:text-3xl font-black text-indigo-400">{topThree[2].total_score.toLocaleString()}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">Ballar</div>
                        </motion.div>
                    )}
                </div>
            )}

            {others.length > 0 && (
                <div className="glass-card rounded-[2.5rem] overflow-hidden">
                    <div className="px-10 py-8 border-b border-slate-800 flex items-center justify-between">
                        <h4 className="font-black text-xs uppercase tracking-widest text-slate-500">Yangi Yulduzlar</h4>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                            <input type="text" placeholder="Foydalanuvchilarni qidirish..." className="bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-[10px] font-bold focus:ring-1 focus:ring-indigo-500 outline-none w-48 shadow-inner" />
                        </div>
                    </div>
                    <div className="divide-y divide-slate-800/50">
                        {others.map((u, idx) => (
                            <motion.div
                                key={u.id}
                                whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.03)' }}
                                onClick={() => navigate(`/users/${u.id}`)}
                                className="px-10 py-6 flex items-center justify-between transition-colors cursor-pointer group"
                            >
                                <div className="flex items-center gap-10">
                                    <span className="font-black text-slate-700 w-10 text-xl">#{idx + 4}</span>
                                    <div className="flex items-center gap-5">
                                        <div className="relative">
                                            <img src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} className="w-14 h-14 bg-slate-800 rounded-2xl border-2 border-slate-700/50 group-hover:border-indigo-500/50 transition-all p-0.5" alt="" />
                                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 shadow-lg" />
                                        </div>
                                        <div>
                                            <p className="font-black text-lg tracking-tight uppercase">{u.username}</p>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{u.level}-Daraja</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-16">
                                    <div className="text-right">
                                        <p className="font-black text-2xl text-indigo-200">{u.total_score.toLocaleString()}</p>
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Jami Ballar</p>
                                    </div>
                                    <div className="w-10 flex justify-center">
                                        <div className="w-5 h-1.5 bg-slate-800 rounded-full group-hover:bg-indigo-500/30 transition-colors" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
