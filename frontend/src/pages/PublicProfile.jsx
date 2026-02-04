import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, Star, Award, Calendar, Loader2 } from 'lucide-react';
import API from '../api/axios';

const PublicProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Endpoint defined in backend/users/urls.py as 'profile/<int:pk>/'
                const response = await API.get(`/users/profile/${id}/`);
                setUser(response.data);
            } catch (error) {
                console.error("Error loading profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="animate-spin text-indigo-500" size={48} />
        </div>
    );

    if (!user) return (
        <div className="flex items-center justify-center min-h-screen text-white">
            Foydalanuvchi topilmadi.
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto py-8 space-y-12 px-4">
            {/* Header / Banner */}
            <div className="relative group">
                <div className="h-48 md:h-64 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-white/[0.02]" />
                    <div className="absolute top-0 right-0 p-8">
                        <Star className="text-white/5" size={120} />
                    </div>
                </div>

                <div className="px-6 md:px-12 -mt-12 md:-mt-20 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10">
                    <div className="relative">
                        <div className="w-32 h-32 md:w-44 md:h-44 rounded-[2rem] md:rounded-[2.5rem] bg-slate-950 p-1.5 border-4 border-slate-900 shadow-2xl overflow-hidden">
                            <img
                                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                                className="w-full h-full object-cover rounded-[1.8rem] md:rounded-[2.3rem]"
                                alt=""
                            />
                        </div>
                    </div>

                    <div className="pb-0 md:pb-4 flex-1 text-center md:text-left z-10">
                        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 mb-3">
                            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">{user.username}</h1>
                            <span className="px-4 md:px-5 py-1.5 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">Rank #{user.rank || 'N/A'}</span>
                        </div>
                        <p className="text-slate-400 italic font-medium flex items-center justify-center md:justify-start gap-2 text-sm md:text-base">
                            <Shield size={16} className="text-emerald-500" /> {user.bio || "Platforma Foydalanuvchisi"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                {/* Stats */}
                <div className="space-y-8">
                    <div className="glass-card p-8 rounded-[2.5rem] border-slate-800/40">
                        <h3 className="text-xl font-black mb-6 flex items-center gap-3 uppercase tracking-widest">
                            <Star className="text-amber-500" /> Statistika
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Jami XP</span>
                                <span className="text-lg font-black text-amber-500">{user.total_score}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Daraja</span>
                                <span className="text-lg font-black text-indigo-400">{user.level}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">A'zo bo'lgan</span>
                                <span className="text-sm font-bold text-slate-300">
                                    {new Date(user.date_joined).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Certificates */}
                <div className="lg:col-span-2 glass-card p-8 md:p-10 rounded-[2.5rem] border-slate-800/40">
                    <h3 className="text-xl font-black mb-8 flex items-center gap-3 uppercase tracking-widest">
                        <Award className="text-emerald-500" /> Sertifikatlar ({user.certificates?.length || 0})
                    </h3>

                    {user.certificates && user.certificates.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {user.certificates.map(cert => (
                                <Link to={`/certificate/${cert.id}`} key={cert.id} className="group block bg-slate-900/40 rounded-3xl p-6 border border-slate-800/50 hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Award size={64} />
                                    </div>
                                    <div className="relative z-10">
                                        <h4 className="font-bold text-slate-200 mb-2 line-clamp-2 md:h-12">{cert.exam_title}</h4>
                                        <p className="text-emerald-400 text-xs font-black uppercase tracking-widest mb-4">Muvaffaqiyatli</p>
                                        <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                                            <span>{cert.score}% Ball</span>
                                            <span>{new Date(cert.completed_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-500 italic">
                            Hali sertifikatlar mavjud emas.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicProfile;
