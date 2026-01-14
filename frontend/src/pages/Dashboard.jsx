import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, BookOpen, Clock, Activity, Loader2, ChevronRight, User as UserIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const data = [
    { name: 'Mon', score: 400 },
    { name: 'Tue', score: 600 },
    { name: 'Wed', score: 500 },
    { name: 'Thu', score: 900 },
    { name: 'Fri', score: 850 },
    { name: 'Sat', score: 1100 },
    { name: 'Sun', score: 1200 },
];

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay }}
        whileHover={{ y: -5, shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
        className="glass-card p-8 rounded-[2.5rem] flex items-center space-x-6 border-slate-800/50"
    >
        <div className={`p-4 rounded-2xl bg-${color}-500/10 text-${color}-500 shadow-inner`}>
            <Icon size={28} />
        </div>
        <div>
            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mb-1">{label}</p>
            <p className="text-3xl font-black tracking-tight">{value}</p>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [lbResponse, statsResponse] = await Promise.all([
                    API.get('/auth/leaderboard/'),
                    API.get('/auth/stats/')
                ]);
                setLeaderboard(lbResponse.data.slice(0, 5));
                setStats(statsResponse.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-indigo-500" size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">Xush kelibsiz, <span className="text-indigo-500">{user.username}!</span></h1>
                    <p className="text-slate-500 italic max-w-lg">"Yangi dasturlash tilini o'rganishning yagona yo'li - bu unda dasturlar yozishdir."</p>
                </div>
                <Link to="/courses" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-indigo-600/30 flex items-center gap-3">
                    O'qishni davom ettirish <ChevronRight size={18} />
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard icon={Trophy} label="Jami XP" value={(stats?.total_xp || 0).toLocaleString()} color="amber" delay={0.1} />
                <StatCard icon={Activity} label="Global Reyting" value={`#${stats?.rank || 0}`} color="rose" delay={0.2} />
                <StatCard icon={BookOpen} label="Imtihonlar" value={stats?.exams_taken || 0} color="indigo" delay={0.3} />
                <StatCard icon={Clock} label="O'qish Vaqti" value={`${stats?.study_time || 0}m`} color="emerald" delay={0.4} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 glass-card p-10 rounded-[3rem] h-[450px] border-slate-800/30"
                >
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-black uppercase tracking-widest text-slate-300">XP O'sishi</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">So'nggi 7 kun</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.progression || []}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#475569" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} />
                                <YAxis stroke="#475569" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="score" stroke="#6366f1" fillOpacity={1} fill="url(#colorScore)" strokeWidth={4} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-10 rounded-[3rem] border-slate-800/30"
                >
                    <h3 className="text-xl font-black uppercase tracking-widest text-slate-300 mb-10">Top Ustalar</h3>
                    <div className="space-y-6">
                        {leaderboard.map((u, i) => (
                            <div key={u.id} className="flex items-center justify-between p-4 rounded-3xl hover:bg-slate-900/50 transition-all group cursor-pointer border border-transparent hover:border-slate-800">
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-800 p-0.5 border border-slate-700 group-hover:border-indigo-500/50 transition-colors">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} className="w-full h-full rounded-[14px]" alt="" />
                                        </div>
                                        <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-slate-950 shadow-lg 
                                            ${i === 0 ? 'bg-amber-500 text-slate-950' : i === 1 ? 'bg-slate-400 text-slate-950' : i === 2 ? 'bg-amber-800 text-white' : 'bg-slate-800 text-slate-400'}`}>
                                            {i + 1}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-black text-sm tracking-tight uppercase group-hover:text-indigo-200 transition-colors">{u.username}</p>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{u.level || 1}-Daraja</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-indigo-400">{u.total_score.toLocaleString()}</p>
                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">XP</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => navigate('/leaderboard')}
                        className="w-full mt-10 py-4 rounded-2xl bg-slate-800 hover:bg-indigo-600 hover:text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all"
                    >
                        To'liq Reyting
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
