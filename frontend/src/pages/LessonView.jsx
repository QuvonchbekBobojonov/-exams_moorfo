import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, BookOpen, Clock, Loader2, Code, ArrowLeft } from 'lucide-react';
import API from '../api/axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const LessonView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const response = await API.get(`/courses/lessons/${id}/`);
                setLesson(response.data);
            } catch (error) {
                console.error('Error fetching lesson:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLesson();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-indigo-500" size={48} />
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="text-center py-20">
                <p className="text-rose-500 text-lg">Dars topilmadi.</p>
                <button onClick={() => navigate(-1)} className="mt-4 text-indigo-400 font-bold">Ortga qaytish</button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-4">
            <header className="mb-10 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold text-xs uppercase tracking-widest">Kursga qaytish</span>
                </button>
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-slate-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400">Dars {lesson.order}</span>
                </div>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
            >
                <div className="space-y-4">
                    <h1 className="text-5xl font-black tracking-tight">{lesson.title}</h1>
                    <div className="flex items-center gap-6 text-slate-500 font-bold text-xs uppercase tracking-widest">
                        <span className="flex items-center gap-2"><Clock size={14} className="text-indigo-500" /> 15m O'qish</span>
                        <span className="flex items-center gap-2"><BookOpen size={14} className="text-indigo-500" /> Nazariya + Amaliyot</span>
                    </div>
                </div>

                <div className="glass-card p-12 rounded-[3.5rem] border-slate-800/40">
                    <div className="prose prose-invert prose-indigo max-w-none">
                        <ReactMarkdown
                            components={{
                                code({ node, inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <div className="rounded-2xl overflow-hidden my-8 shadow-2xl">
                                            <SyntaxHighlighter
                                                style={atomDark}
                                                language={match[1]}
                                                PreTag="div"
                                                {...props}
                                            >
                                                {String(children).replace(/\n$/, '')}
                                            </SyntaxHighlighter>
                                        </div>
                                    ) : (
                                        <code className={`${className} bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300`} {...props}>
                                            {children}
                                        </code>
                                    );
                                }
                            }}
                        >
                            {lesson.content}
                        </ReactMarkdown>
                    </div>

                    {lesson.code_snippet && (
                        <div className="mt-12 space-y-4">
                            <div className="flex items-center gap-2 text-indigo-400 font-black text-xs uppercase tracking-[0.2em] mb-4">
                                <Code size={18} /> Interactive Code Sample
                            </div>
                            <div className="rounded-[2rem] overflow-hidden border border-slate-800 shadow-2xl shadow-indigo-600/5">
                                <div className="bg-slate-900 px-6 py-3 border-b border-slate-800 flex items-center justify-between">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">main.py</span>
                                </div>
                                <SyntaxHighlighter
                                    style={atomDark}
                                    language="python"
                                    customStyle={{ margin: 0, padding: '2rem', fontSize: '14px' }}
                                >
                                    {lesson.code_snippet}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between pt-10">
                    <button
                        onClick={() => lesson.previous_lesson_id && navigate(`/lessons/${lesson.previous_lesson_id}`)}
                        disabled={!lesson.previous_lesson_id}
                        className={`flex items-center gap-3 px-8 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 font-bold transition-all ${!lesson.previous_lesson_id ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-800 hover:text-white'}`}
                    >
                        <ChevronLeft size={20} /> Oldingi
                    </button>
                    <button
                        onClick={() => lesson.next_lesson_id && navigate(`/lessons/${lesson.next_lesson_id}`)}
                        disabled={!lesson.next_lesson_id}
                        className={`flex items-center gap-3 px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all group ${!lesson.next_lesson_id ? 'bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-2xl shadow-indigo-600/40'}`}
                    >
                        {lesson.next_lesson_id ? (
                            <>
                                Keyingi <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        ) : (
                            'Kurs Tugatildi'
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default LessonView;
