import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronLeft, ChevronRight, Send, AlertCircle, CheckCircle2, Loader2, XCircle, Award } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const ExamPlayer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const response = await API.get(`/exams/${id}/`);
                setExam(response.data);
                setTimeLeft(response.data.duration_minutes * 60);
            } catch (error) {
                console.error('Error fetching exam:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchExam();
    }, [id]);

    useEffect(() => {
        if (!exam || result || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [exam, result, timeLeft]);

    const handleAnswer = (choiceId) => {
        setAnswers({ ...answers, [exam.questions[currentQuestion].id]: choiceId });
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const timeTaken = (exam.duration_minutes * 60) - timeLeft;
            const response = await API.post(`/exams/${id}/submit/`, {
                answers,
                time_taken: timeTaken
            });
            setResult(response.data);
        } catch (error) {
            console.error('Error submitting exam:', error);
            alert('Failed to submit exam. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-indigo-500" size={48} />
            </div>
        );
    }

    if (!exam) {
        return (
            <div className="text-center py-20">
                <p className="text-rose-500 text-lg">Imtihon topilmadi yoki mavjud emas.</p>
                <button onClick={() => navigate('/courses')} className="mt-4 text-indigo-400 font-bold">Kurslarga qaytish</button>
            </div>
        );
    }

    if (result) {
        return (
            <div className="flex flex-col items-center justify-center min-vh-[60vh] space-y-8 py-12">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`p-8 rounded-full ${result.is_passed ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}`}
                >
                    {result.is_passed ? <CheckCircle2 size={80} /> : <XCircle size={80} />}
                </motion.div>
                <div className="text-center space-y-4">
                    <h2 className="text-4xl font-bold">{result.is_passed ? "Tabriklaymiz!" : "Mashq qilishda davom eting!"}</h2>
                    <p className="text-slate-400 text-xl">Sizning natijangiz: <span className={`font-bold ${result.is_passed ? 'text-emerald-500' : 'text-rose-500'}`}>{result.score}%</span></p>
                    <p className="text-slate-500 italic max-w-md">
                        {result.is_passed
                            ? "Siz ushbu modulni muvaffaqiyatli o'zlashtirdingiz. Ballar profilingizga qo'shildi."
                            : "Ushbu safar o'tish ballini to'play olmadingiz. Darslarni qayta ko'rib chiqing va yana urinib ko'ring!"}
                    </p>
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={() => navigate('/courses')}
                        className="px-8 py-4 bg-slate-800 rounded-2xl font-bold hover:bg-slate-700 transition-all"
                    >
                        Kurslarga qaytish
                    </button>
                    {result.is_passed ? (
                        <button
                            onClick={() => navigate(`/certificate/${result.id}`)}
                            className="px-8 py-4 bg-amber-500 text-slate-900 rounded-2xl font-bold hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2"
                        >
                            <Award size={20} />
                            <span>Sertifikatni Olish</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => window.location.reload()}
                            className="px-8 py-4 bg-indigo-600 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30"
                        >
                            Qayta Topshirish
                        </button>
                    )}
                </div>
            </div>
        );
    }

    const currentQ = exam.questions[currentQuestion];

    return (
        <div className="max-w-5xl mx-auto py-4">
            <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 space-y-6 md:space-y-0">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-slate-100">{exam.title}</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-slate-400 text-sm">{currentQuestion + 1} / {exam.questions.length} Savol</span>
                        <div className="h-2 w-48 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                            <motion.div
                                className="h-full bg-gradient-to-r from-indigo-600 to-purple-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentQuestion + 1) / exam.questions.length) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <div className={`flex items-center space-x-2 px-6 py-3 border rounded-2xl transition-all
                        ${timeLeft < 60 ? 'bg-rose-500/20 border-rose-500/40 text-rose-500 animate-pulse' : 'bg-slate-900 border-slate-800 text-slate-300'}`}
                    >
                        <Clock size={20} />
                        <span className="font-mono font-bold text-xl">{formatTime(timeLeft)}</span>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center space-x-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (
                            <>
                                <span>Yuborish</span>
                                <Send size={18} />
                            </>
                        )}
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestion}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-card p-10 rounded-[2.5rem]"
                        >
                            <h2 className="text-2xl leading-relaxed mb-10 font-medium">
                                {currentQ.text}
                            </h2>

                            {currentQ.code && (
                                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-8 mb-10 font-mono text-sm overflow-x-auto text-indigo-300 shadow-2xl">
                                    <pre><code>{currentQ.code}</code></pre>
                                </div>
                            )}

                            <div className="space-y-4">
                                {currentQ.choices.map((choice) => (
                                    <button
                                        key={choice.id}
                                        onClick={() => handleAnswer(choice.id)}
                                        className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 flex items-center justify-between group
                                            ${answers[currentQ.id] === choice.id
                                                ? 'bg-indigo-600/20 border-indigo-500 ring-4 ring-indigo-500/10 text-indigo-100'
                                                : 'bg-slate-900/40 border-slate-800/50 text-slate-400 hover:border-slate-700 hover:bg-slate-800/40'}`}
                                    >
                                        <span className="text-base font-medium">{choice.text}</span>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                                            ${answers[currentQ.id] === choice.id
                                                ? 'border-indigo-500 bg-indigo-500 shadow-lg shadow-indigo-500/40'
                                                : 'border-slate-700 bg-transparent group-hover:border-slate-500'}`}
                                        >
                                            {answers[currentQ.id] === choice.id && (
                                                <div className="w-2 h-2 bg-white rounded-full" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex items-center justify-between pt-4">
                        <button
                            disabled={currentQuestion === 0}
                            onClick={() => setCurrentQuestion(q => q - 1)}
                            className="flex items-center space-x-2 px-8 py-4 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-semibold"
                        >
                            <ChevronLeft size={22} />
                            <span>Oldingi</span>
                        </button>
                        <button
                            disabled={currentQuestion === exam.questions.length - 1}
                            onClick={() => setCurrentQuestion(q => q + 1)}
                            className="flex items-center space-x-2 px-10 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold shadow-lg shadow-indigo-600/20"
                        >
                            <span>Keyingi Savol</span>
                            <ChevronRight size={22} />
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-card p-8 rounded-[2rem]">
                        <h4 className="text-xs font-bold text-slate-500 mb-6 uppercase tracking-[0.2em]">Navigator</h4>
                        <div className="grid grid-cols-4 gap-4">
                            {exam.questions.map((q, idx) => (
                                <button
                                    key={q.id}
                                    onClick={() => setCurrentQuestion(idx)}
                                    className={`h-11 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300
                                        ${currentQuestion === idx ? 'bg-indigo-500 text-white ring-4 ring-indigo-500/20' :
                                            answers[q.id] ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-900 text-slate-600 border border-slate-800 hover:border-slate-700'}`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>
                        <div className="mt-10 pt-8 border-t border-slate-800 space-y-5">
                            <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center text-slate-400 font-medium"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-3" /> Javob berildi</span>
                                <span className="text-slate-100 font-bold">{Object.keys(answers).length}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center text-slate-400 font-medium"><div className="w-2 h-2 rounded-full bg-slate-800 border border-slate-700 mr-3" /> Qoldi</span>
                                <span className="text-slate-100 font-bold">{exam.questions.length - Object.keys(answers).length}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-[2rem] flex items-start space-x-4">
                        <AlertCircle className="text-indigo-400 mt-1 shrink-0" size={20} />
                        <p className="text-[11px] text-slate-400 leading-relaxed italic">
                            Taymer oynani yopsangiz ham davom etadi. Yuborishdan oldin internet aloqasini tekshiring.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamPlayer;
