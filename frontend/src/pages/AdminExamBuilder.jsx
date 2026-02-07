import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Plus, Trash2, CheckCircle2, Save, X, BookOpen, Clock, Target } from 'lucide-react';
import API from '../api/axios';

const AdminExamBuilder = () => {
    const [exams, setExams] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBuilder, setShowBuilder] = useState(false);
    const [editingExam, setEditingExam] = useState(null);

    // Builder State
    const [formData, setFormData] = useState({
        title: '',
        course: '',
        description: '',
        duration_minutes: 30,
        passing_score: 60,
        questions: [{ text: '', code: '', points: 10, choices: [{ text: '', is_correct: false }] }]
    });

    useEffect(() => {
        fetchExams();
        fetchCourses();
    }, []);

    const fetchExams = async () => {
        try {
            const response = await API.get('/exams/admin/');
            setExams(response.data);
        } catch (error) {
            console.error('Imtihonlarni yuklashda xatolik:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await API.get('/courses/admin/manage/');
            setCourses(response.data);
        } catch (error) {
            console.error('Kurslarni yuklashda xatolik:', error);
        }
    };

    const handleAddQuestion = () => {
        setFormData({
            ...formData,
            questions: [...formData.questions, { text: '', code: '', points: 10, choices: [{ text: '', is_correct: false }] }]
        });
    };

    const handleRemoveQuestion = (qIdx) => {
        setFormData({
            ...formData,
            questions: formData.questions.filter((_, i) => i !== qIdx)
        });
    };

    const handleAddChoice = (qIdx) => {
        const newQuestions = [...formData.questions];
        newQuestions[qIdx].choices.push({ text: '', is_correct: false });
        setFormData({ ...formData, questions: newQuestions });
    };

    const handleRemoveChoice = (qIdx, cIdx) => {
        const newQuestions = [...formData.questions];
        newQuestions[qIdx].choices = newQuestions[qIdx].choices.filter((_, i) => i !== cIdx);
        setFormData({ ...formData, questions: newQuestions });
    };

    const handleChoiceChange = (qIdx, cIdx, field, value) => {
        const newQuestions = [...formData.questions];
        if (field === 'is_correct') {
            // Uncheck others
            newQuestions[qIdx].choices = newQuestions[qIdx].choices.map((c, i) => ({
                ...c,
                is_correct: i === cIdx ? value : false
            }));
        } else {
            newQuestions[qIdx].choices[cIdx][field] = value;
        }
        setFormData({ ...formData, questions: newQuestions });
    };

    const handleSave = async () => {
        try {
            if (editingExam?.id) {
                await API.put(`/exams/admin/${editingExam.id}/`, formData);
            } else {
                await API.post('/exams/admin/', formData);
            }
            setShowBuilder(false);
            fetchExams();
        } catch (error) {
            alert('Saqlashda xatolik: ' + JSON.stringify(error.response?.data));
        }
    };

    const deleteExam = async (id) => {
        if (!window.confirm('Imtihonni o\'chirmoqchimisiz?')) return;
        try {
            await API.delete(`/exams/admin/${id}/`);
            fetchExams();
        } catch (error) {
            alert('O\'chirishda xatolik');
        }
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Imtihon Yaratuvchisi</h1>
                    <p className="text-slate-400 mt-1">Kurslar uchun dinamik testlar va savollar bazasini shakllantirish</p>
                </div>
                {!showBuilder && (
                    <button
                        onClick={() => {
                            setEditingExam(null);
                            setFormData({
                                title: '', course: '', description: '', duration_minutes: 30, passing_score: 60,
                                questions: [{ text: '', code: '', points: 10, choices: [{ text: '', is_correct: false }] }]
                            });
                            setShowBuilder(true);
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-semibold transition-all"
                    >
                        <Plus size={20} />
                        <span>Imtihon yaratish</span>
                    </button>
                )}
            </header>

            {!showBuilder ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exams.map((exam, idx) => (
                        <motion.div
                            key={exam.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="glass-card p-6 rounded-[2rem] border-white/5 space-y-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/10 rounded-xl">
                                    <Zap className="text-indigo-500" size={20} />
                                </div>
                                <h3 className="font-bold text-lg line-clamp-1">{exam.title}</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                                <div className="flex items-center gap-1.5 bg-white/5 p-2 rounded-lg">
                                    <Clock size={14} /> {exam.duration_minutes} daqiqa
                                </div>
                                <div className="flex items-center gap-1.5 bg-white/5 p-2 rounded-lg">
                                    <Target size={14} /> {exam.passing_score}% o'tish
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                <button
                                    onClick={() => {
                                        setEditingExam(exam);
                                        setFormData(exam);
                                        setShowBuilder(true);
                                    }}
                                    className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-semibold transition-colors"
                                >
                                    Tahrirlash
                                </button>
                                <button
                                    onClick={() => deleteExam(exam.id)}
                                    className="p-3 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-xl transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-10"
                >
                    <div className="glass-card p-10 rounded-[2.5rem] border-white/10 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <Zap className="text-indigo-500" />
                                {editingExam ? 'Imtihonni tahrirlash' : 'Yangi imtihon'}
                            </h2>
                            <button onClick={() => setShowBuilder(false)} className="text-slate-500 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Imtihon Nomi</label>
                                <input
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Tegishli Kurs</label>
                                <select
                                    value={formData.course}
                                    onChange={e => setFormData({ ...formData, course: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    <option value="">Kursni tanlang</option>
                                    {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Questions Editor */}
                        <div className="space-y-6 pt-10 border-t border-white/5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold">Savollar ({formData.questions.length})</h3>
                                <button
                                    onClick={handleAddQuestion}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600/10 text-indigo-400 rounded-xl text-sm font-bold hover:bg-indigo-600/20 transition-colors"
                                >
                                    <Plus size={16} /> Savol qo'shish
                                </button>
                            </div>

                            <div className="space-y-6">
                                {formData.questions.map((q, qIdx) => (
                                    <div key={qIdx} className="bg-white/5 p-8 rounded-3xl border border-white/5 space-y-6 relative">
                                        <button
                                            onClick={() => handleRemoveQuestion(qIdx)}
                                            className="absolute top-6 right-6 p-2 text-slate-500 hover:text-rose-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Savol Matni</label>
                                            <textarea
                                                value={q.text}
                                                onChange={e => {
                                                    const newQ = [...formData.questions];
                                                    newQ[qIdx].text = e.target.value;
                                                    setFormData({ ...formData, questions: newQ });
                                                }}
                                                rows="2"
                                                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                                            />
                                        </div>

                                        {/* Choices */}
                                        <div className="space-y-4">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 block">Variantlar</label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {q.choices.map((c, cIdx) => (
                                                    <div key={cIdx} className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => handleChoiceChange(qIdx, cIdx, 'is_correct', !c.is_correct)}
                                                            className={`p-2 rounded-lg transition-colors ${c.is_correct ? 'bg-green-500 text-white' : 'bg-white/5 text-slate-600'}`}
                                                        >
                                                            <CheckCircle2 size={18} />
                                                        </button>
                                                        <input
                                                            value={c.text}
                                                            onChange={e => handleChoiceChange(qIdx, cIdx, 'text', e.target.value)}
                                                            // Corrected below in actual code
                                                            className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                                        />
                                                        <button
                                                            onClick={() => handleRemoveChoice(qIdx, cIdx)}
                                                            className="text-slate-600 hover:text-rose-500 transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => handleAddChoice(qIdx)}
                                                    className="flex items-center justify-center gap-2 p-2 border-2 border-dashed border-white/5 rounded-xl text-slate-500 hover:border-indigo-500/50 hover:text-indigo-400 transition-all text-sm"
                                                >
                                                    <Plus size={16} /> Variant
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-10 flex gap-4">
                            <button
                                onClick={() => setShowBuilder(false)}
                                className="flex-1 py-4 rounded-2xl border border-white/5 font-bold hover:bg-white/5 transition-colors"
                            >
                                Bekor qilish
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
                            >
                                <Save size={20} />
                                Saqlash
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default AdminExamBuilder;
