import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Award, Calendar, Camera, Edit3, Shield, Star, Loader2, Save, LayoutGrid, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const Profile = () => {
    const { user, refreshUser } = useAuth();
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'certificates'

    useEffect(() => {
        const fetchAttempts = async () => {
            try {
                const response = await API.get('/results/history/');
                setAttempts(response.data);
                refreshUser();
            } catch (error) {
                console.error('Error fetching attempts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAttempts();
    }, []);

    const passedAttempts = attempts.filter(a => a.is_passed);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('uz-UZ', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    if (loading && !user) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-indigo-500" size={48} />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-8 space-y-12 pb-20">
            {/* Header / Banner */}
            <div className="relative group px-4 md:px-0">
                <div className="h-64 rounded-[3rem] bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-size-200 animate-gradient shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-slate-950/20" />
                    <div className="absolute top-0 right-0 p-8">
                        <Star className="text-white/20" size={120} />
                    </div>
                </div>

                <div className="px-6 md:px-12 -mt-12 md:-mt-20 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10">
                    <div className="relative">
                        <div className="w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] md:rounded-[3rem] bg-slate-900 p-1.5 border-4 border-slate-950 shadow-2xl overflow-hidden rotate-3 md:group-hover:rotate-0 transition-transform duration-500">
                            <img
                                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                                className="w-full h-full object-cover rounded-[2rem] md:rounded-[2.5rem]"
                                alt=""
                            />
                        </div>
                        <button className="absolute bottom-2 right-2 md:bottom-4 md:right-4 p-2 md:p-3 bg-indigo-600 rounded-xl md:rounded-2xl text-white shadow-xl hover:bg-indigo-500 transition-all">
                            <Camera size={16} md:size={20} />
                        </button>
                    </div>

                    <div className="pb-0 md:pb-4 flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 mb-3 justify-center md:justify-start">
                            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">{user.username}</h1>
                            <span className="px-4 md:px-5 py-1.5 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">{user.rank || 1}-O'rin</span>
                        </div>
                        <p className="text-slate-400 italic font-medium flex items-center justify-center md:justify-start gap-2 text-sm md:text-base">
                            <Shield size={16} className="text-emerald-500" /> {user.bio || "Professional Dasturchi Yo'nalishi"}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 w-full md:w-auto mb-4">
                        <Link to={`/users/${user.id}`} className="px-8 py-3 bg-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white hover:bg-indigo-500 transition-all text-center">
                            Public Profilni Ko'rish
                        </Link>
                        <Link to="/settings" className="px-8 py-3 bg-slate-900 border border-slate-800 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                            <Edit3 size={16} /> Tahrirlash
                        </Link>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex justify-center px-4">
                <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-md">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:bg-slate-800'}`}
                    >
                        Umumiy
                    </button>
                    <button
                        onClick={() => setActiveTab('certificates')}
                        className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'certificates' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:bg-slate-800'}`}
                    >
                        Sertifikatlar ({passedAttempts.length})
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'overview' ? (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-12 px-4 md:px-0"
                    >
                        {/* Stats & Info */}
                        <div className="space-y-8">
                            <div className="glass-card p-10 rounded-[2.5rem] border-slate-800/40">
                                <h3 className="text-xl font-black mb-8 flex items-center gap-3 uppercase tracking-widest">
                                    <Star className="text-amber-500" /> O'yinchi Statistikasi
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Jami Toplangan XP</span>
                                        <span className="text-lg font-black text-amber-500">{user.total_score.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Daraja</span>
                                        <span className="text-lg font-black text-indigo-400">{user.level || 1}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Global O'rin</span>
                                        <span className="text-lg font-black text-rose-500">#{user.rank || 42}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card p-10 rounded-[2.5rem] border-slate-800/40">
                                <h3 className="text-xl font-black mb-8 flex items-center gap-3 uppercase tracking-widest">
                                    <Mail className="text-indigo-400" /> Ma'lumotlar
                                </h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Email Manzil</p>
                                        <p className="text-sm font-bold text-slate-200">{user.email}</p>
                                    </div>
                                    <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Qo'shilgan Sana</p>
                                        <p className="text-sm font-bold text-slate-200">{user.date_joined ? formatDate(user.date_joined) : "Noma'lum"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="lg:col-span-2 glass-card p-10 rounded-[2.5rem] border-slate-800/40">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-xl font-black uppercase tracking-widest text-slate-300">So'nggi Imtihon Urinishlari</h3>
                                <Link to="/courses" className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors">Yangi Kurs</Link>
                            </div>

                            <div className="space-y-6">
                                {attempts.length > 0 ? attempts.slice(0, 5).map((attempt) => (
                                    <div key={attempt.id} className="flex items-center justify-between p-6 rounded-[1.5rem] bg-slate-900/20 border border-slate-800/50 hover:border-slate-700 transition-all group">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-black text-xl">
                                                <Award size={28} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-200 group-hover:text-white transition-colors">{attempt.exam_title}</h4>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Tugatildi: {formatDate(attempt.completed_at)}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-xl font-black ${attempt.is_passed ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                {attempt.is_passed ? "O'TDI" : 'YIQILDI'}
                                            </p>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ball: {attempt.score}%</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-12 text-slate-500 italic">
                                        Hali imtihon topshirilmagan.
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="certificates"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="px-4 md:px-0"
                    >
                        <div className="glass-card p-12 rounded-[3rem] border-slate-800/40 min-h-[500px]">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Mening Sertifikatlarim</h2>
                                <p className="text-slate-400">Siz to'plagan barcha amaliy va nazariy yutuqlar.</p>
                            </div>

                            {passedAttempts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {passedAttempts.map(cert => (
                                        <Link to={`/certificate/${cert.id}`} key={cert.id} className="group block bg-slate-900/40 rounded-[2rem] p-8 border border-slate-800/50 hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all relative overflow-hidden aspect-[4/3] flex flex-col justify-between">
                                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                                <Award size={120} />
                                            </div>
                                            <div>
                                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
                                                    <Award size={24} />
                                                </div>
                                                <h4 className="font-bold text-xl text-slate-200 mb-2 line-clamp-2">{cert.exam_title}</h4>
                                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">{cert.course_title}</p>
                                            </div>

                                            <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Ball</span>
                                                    <span className="text-lg font-black text-white">{cert.score}%</span>
                                                </div>
                                                <div className="flex flex-col text-right">
                                                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Sana</span>
                                                    <span className="text-xs font-bold text-slate-300">{formatDate(cert.completed_at)}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-24 h-24 rounded-full bg-slate-800/50 flex items-center justify-center mb-6 text-slate-600">
                                        <Award size={40} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-400 mb-2">Sertifikatlar Mavjud Emas</h3>
                                    <p className="text-slate-500 max-w-sm mx-auto mb-8">Kurslarni muvaffaqiyatli tamomlab, imtihonlardan o'ting va sertifikatlarga ega bo'ling.</p>
                                    <Link to="/courses" className="px-8 py-3 bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-500 transition-colors">
                                        Kurslarni Ko'rish
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
