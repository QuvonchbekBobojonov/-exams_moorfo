import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Edit2, Trash2, Video, Search, ChevronRight, X, Save } from 'lucide-react';
import API from '../api/axios';

const AdminCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await API.get('/courses/admin/manage/');
            setCourses(response.data);
        } catch (error) {
            console.error('Kurslarni yuklashda xatolik:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveCourse = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            if (editingCourse?.id) {
                await API.patch(`/courses/admin/manage/${editingCourse.id}/`, data);
            } else {
                await API.post('/courses/admin/manage/', data);
            }
            setShowModal(false);
            fetchCourses();
        } catch (error) {
            alert('Saqlashda xatolik yuz berdi');
        }
    };

    const deleteCourse = async (id) => {
        if (!window.confirm('Haqiqatdan ham ushbu kursni o\'chirmoqchimisiz?')) return;
        try {
            await API.delete(`/courses/admin/manage/${id}/`);
            fetchCourses();
        } catch (error) {
            alert('O\'chirishda xatolik');
        }
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Kurslarni Boshqarish</h1>
                    <p className="text-slate-400 mt-1">O'quv kurslarini yaratish, tahrirlash va o'chirish</p>
                </div>
                <button
                    onClick={() => { setEditingCourse({}); setShowModal(true); }}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-semibold transition-all"
                >
                    <Plus size={20} />
                    <span>Yangi Kurs</span>
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, idx) => (
                    <motion.div
                        key={course.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="glass-card group rounded-[2rem] border-white/5 overflow-hidden flex flex-col"
                    >
                        <div className="relative aspect-video">
                            {course.thumbnail ? (
                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-700">
                                    <BookOpen size={48} />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <button
                                    onClick={() => { setEditingCourse(course); setShowModal(true); }}
                                    className="p-3 bg-white text-slate-950 rounded-full hover:scale-110 transition-transform"
                                >
                                    <Edit2 size={20} />
                                </button>
                                <button
                                    onClick={() => deleteCourse(course.id)}
                                    className="p-3 bg-rose-500 text-white rounded-full hover:scale-110 transition-transform"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-400/10 px-2 py-1 rounded-md">
                                        {course.difficulty}
                                    </span>
                                    <span className="text-xs text-slate-500">{course.category}</span>
                                </div>
                                <h3 className="text-lg font-bold line-clamp-1">{course.title}</h3>
                            </div>
                            <div className="mt-6 flex items-center justify-between py-4 border-t border-white/5">
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <Video size={16} />
                                    <span>{course.video_url ? 'Video bor' : 'Video yo\'q'}</span>
                                </div>
                                <button className="text-indigo-400 hover:text-indigo-300 text-sm font-bold flex items-center gap-1 group/btn">
                                    Darslar
                                    <ChevronRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl glass-card rounded-[2.5rem] border-white/10 p-10 overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold">{editingCourse?.id ? 'Kursni Tahrirlash' : 'Yangi Kurs Qo\'shish'}</h2>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSaveCourse} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Kurs Nomi</label>
                                        <input
                                            name="title"
                                            required
                                            defaultValue={editingCourse?.title}
                                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Kategoriya</label>
                                        <input
                                            name="category"
                                            defaultValue={editingCourse?.category || 'Technology'}
                                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Tavsif (Description)</label>
                                    <textarea
                                        name="description"
                                        rows="3"
                                        defaultValue={editingCourse?.description}
                                        className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Murakkablik</label>
                                        <select
                                            name="difficulty"
                                            defaultValue={editingCourse?.difficulty || 'beginner'}
                                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                                        >
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Davomiyligi</label>
                                        <input
                                            name="estimated_duration"
                                            defaultValue={editingCourse?.estimated_duration || '10 soat'}
                                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Video Havola (YouTube)</label>
                                    <div className="relative">
                                        <Video className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                        <input
                                            name="video_url"
                                            defaultValue={editingCourse?.video_url}
                                            placeholder="https://youtube.com/..."
                                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2">
                                        <Save size={20} />
                                        Saqlash
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminCourses;
