import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Play, Clock, Award, CheckCircle2, ChevronRight, Lock, Code, Loader2 } from 'lucide-react';
import API from '../api/axios';

const CourseDetail = () => {
    const { slug } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [completers, setCompleters] = useState([]);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await API.get(`/courses/${slug}/`);
                setCourse(response.data);

                // Fetch completers
                const compResponse = await API.get(`/courses/${slug}/completers/`);
                setCompleters(compResponse.data);
            } catch (error) {
                console.error('Error fetching course:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-indigo-500" size={48} />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="text-center py-20">
                <p className="text-rose-500 text-lg">Kurs topilmadi.</p>
                <Link to="/courses" className="mt-4 text-indigo-400 font-bold block">Kurslarga qaytish</Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-4 space-y-16 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Left: Course Overview */}
                <div className="lg:col-span-2 space-y-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden group h-64 sm:h-80 md:h-[400px] shadow-2xl"
                    >
                        <img
                            src={course.thumbnail || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60"}
                            className="w-full h-full object-cover"
                            alt=""
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                <span className="px-3 py-1 bg-indigo-600 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest">Tavsiya</span>
                                <span className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-300">{course.category}</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4 line-clamp-2">{course.title}</h1>
                            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[10px] sm:text-xs md:text-sm">
                                <span className="flex items-center gap-2"><Clock size={14} className="text-indigo-400" /> {course.estimated_duration}</span>
                                <span className="flex items-center gap-2"><BookOpen size={14} className="text-indigo-400" /> {course.lessons.length} Darslar</span>
                                <span className="flex items-center gap-2 hidden xs:flex"><Award size={14} className="text-amber-500" /> {course.total_xp.toLocaleString()} XP</span>
                            </div>
                        </div>
                    </motion.div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold tracking-tight">Dars Rejasi</h2>
                        <div className="grid gap-4">
                            {course.lessons.map((lesson, idx) => (
                                <motion.div
                                    key={lesson.id}
                                    whileHover={{ x: 5 }}
                                    className="p-6 rounded-[1.5rem] bg-slate-900/40 border border-slate-800 flex items-center justify-between group transition-all"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center font-bold">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-200 group-hover:text-white transition-colors">{lesson.title}</h4>
                                            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Dars Mazmuni</p>
                                        </div>
                                    </div>
                                    <Link
                                        to={`/lessons/${lesson.id}`}
                                        className="p-3 bg-slate-800 rounded-xl text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-6"
                                    >
                                        <Play size={18} fill="currentColor" />
                                    </Link>
                                </motion.div>
                            ))}

                            {course.exam_id && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={`p-8 rounded-[2rem] border-2 flex flex-col md:flex-row items-center justify-between gap-6 mt-6 
                                        ${course.user_status?.is_passed
                                            ? 'bg-emerald-500/10 border-emerald-500/30'
                                            : 'bg-indigo-600/10 border-indigo-600/30'}`}
                                >
                                    <div>
                                        <h3 className={`text-2xl font-black ${course.user_status?.is_passed ? 'text-emerald-400' : 'text-indigo-100'}`}>
                                            {course.user_status?.is_passed ? "Kurs Muvaffaqiyatli Tamomlandi!" : "Sertifikatga tayyormisiz?"}
                                        </h3>
                                        <p className={`${course.user_status?.is_passed ? 'text-emerald-500/80' : 'text-indigo-300/80'} text-sm mt-1 italic`}>
                                            {course.user_status?.is_passed
                                                ? "Tabriklaymiz! Siz imtihondan o'tdingiz. Sertifikatingizni yuklab olishingiz mumkin."
                                                : "Ko'nikmalaringizni tekshirish va XP ishlash uchun yakuniy imtihonni topshiring."}
                                        </p>
                                    </div>

                                    {course.user_status?.is_passed ? (
                                        <Link
                                            to={`/certificate/${course.user_status.attempt_id}`}
                                            className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-10 py-4 rounded-2xl font-black text-sm transition-all shadow-2xl shadow-emerald-500/20 flex items-center gap-3 uppercase tracking-widest whitespace-nowrap"
                                        >
                                            <Award size={18} /> Sertifikatni Ko'rish
                                        </Link>
                                    ) : (
                                        <Link
                                            to={`/exam/${course.exam_id}`}
                                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-2xl font-black text-sm transition-all shadow-2xl shadow-indigo-600/40 flex items-center gap-3 uppercase tracking-widest whitespace-nowrap"
                                        >
                                            Yakuniy Imtihonni Boshlash <ChevronRight size={18} />
                                        </Link>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Sidebar Info */}
                <div className="space-y-8">
                    <div className="glass-card p-10 rounded-[2.5rem] border-indigo-500/10">
                        <h3 className="text-xl font-black mb-8 flex items-center gap-3 uppercase tracking-widest">
                            <Code className="text-indigo-500" /> Haqida
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8 italic">
                            {course.description}
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-5 bg-slate-900 border border-slate-800 rounded-2xl">
                                <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Daraja</span>
                                <span className="text-sm font-bold text-indigo-400 uppercase">{course.difficulty}</span>
                            </div>
                            <div className="flex items-center justify-between p-5 bg-slate-900 border border-slate-800 rounded-2xl">
                                <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">XP Mukofoti</span>
                                <span className="text-sm font-bold text-emerald-500">+{course.total_xp.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-10 rounded-[2.5rem] text-center border-slate-800/50">
                        <div className="w-24 h-24 rounded-3xl bg-slate-800 mx-auto mb-6 p-1 border-2 border-slate-700/50 rotate-3 overflow-hidden shadow-2xl">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor_name}`} className="w-full h-full object-cover" alt="" />
                        </div>
                        <h4 className="font-black text-xl tracking-tight">{course.instructor_name}</h4>
                        <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mt-2 mb-6">Mutaxassis O'qituvchi</p>
                        <p className="text-slate-500 text-xs leading-relaxed italic line-clamp-3">{course.instructor_bio}</p>
                    </div>
                </div>

            </div>

            {/* Recent Completers Section */}
            {completers.length > 0 && (
                <div className="mt-20">
                    <h3 className="text-2xl font-black mb-8 flex items-center gap-3 uppercase tracking-tight">
                        <CheckCircle2 className="text-emerald-500" /> So'nggi Bitiruvchilar
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {completers.map((c) => (
                            <Link
                                to={`/users/${c.user_id}`}
                                key={c.id}
                                className="glass-card p-6 rounded-[1.5rem] flex flex-col items-center text-center border-slate-800/40 hover:border-indigo-500/30 hover:bg-slate-800/40 transition-all group"
                            >
                                <div className="w-16 h-16 rounded-full p-1 border-2 border-slate-700 group-hover:border-emerald-500 transition-colors mb-4 relative">
                                    <img
                                        src={c.candidate_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.candidate_name}`}
                                        className="w-full h-full rounded-full object-cover bg-slate-900"
                                        alt=""
                                    />
                                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full border border-slate-900">
                                        {c.score}%
                                    </div>
                                </div>
                                <h4 className="font-bold text-sm text-slate-300 group-hover:text-white mb-1 line-clamp-1">{c.candidate_name}</h4>
                                <p className="text-[10px] text-slate-500 uppercase font-black">{new Date(c.completed_at).toLocaleDateString()}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseDetail;
