import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Award, CheckCircle2, Download, Share2, ArrowLeft, Heart, MessageCircle, Send, User } from 'lucide-react';
import API from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const Certificate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [liking, setLiking] = useState(false);

    // Check if printing
    const certificateRef = useRef(null);

    const fetchCertificate = async () => {
        try {
            // New endpoint for specific attempt detail
            const response = await API.get(`/results/attempts/${id}/`);
            setData(response.data);

            // Fetch comments
            const commentsResponse = await API.get(`/results/attempts/${id}/comments/`);
            setComments(commentsResponse.data);
        } catch (error) {
            console.error("Error loading certificate", error);
            // Fallback to history filtering if endpoint fails? No, endpoint should work.
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCertificate();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    const handleLike = async () => {
        if (!data) return;
        setLiking(true);
        try {
            const response = await API.post(`/results/attempts/${id}/like/`);
            setData(prev => ({
                ...prev,
                is_liked: response.data.liked,
                likes_count: response.data.likes_count
            }));
        } catch (error) {
            console.error("Error toggling like", error);
        } finally {
            setLiking(false);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const response = await API.post(`/results/attempts/${id}/comments/`, { text: newComment });
            setComments([response.data, ...comments]);
            setNewComment('');
        } catch (error) {
            console.error("Error posting comment", error);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div></div>;

    if (!data) return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white space-y-4">
            <p className="text-xl text-rose-500 font-bold">Sertifikat topilmadi.</p>
            <button onClick={() => navigate('/courses')} className="text-indigo-400 hover:text-indigo-300 underline">Kurslarga qaytish</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 py-10 px-4 flex flex-col items-center pb-32">

            {/* Toolbar */}
            <div className="w-full max-w-5xl flex items-center justify-between mb-8 print:hidden">
                <button onClick={() => navigate(-1)} className="flex items-center text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} className="mr-2" /> Ortga
                </button>
                <div className="flex gap-4">
                    <button onClick={handlePrint} className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-indigo-600/20">
                        <Download size={18} className="mr-2" /> Yuklab Olish (PDF)
                    </button>
                </div>
            </div>

            {/* Certificate Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                ref={certificateRef}
                className="print-content relative w-full max-w-5xl bg-[#fff] text-slate-900 shadow-2xl overflow-hidden mx-auto"
                style={{ aspectRatio: '1.414 / 1' }}
            >
                {/* Border Frame */}
                <div className="h-full w-full border-[12px] border-double border-[#1e293b] p-8 relative flex flex-col items-center text-center justify-between bg-amber-50/50">

                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none flex justify-center items-center">
                        <Award size={400} />
                    </div>

                    {/* Corner Ornaments */}
                    <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-[#1e293b]" />
                    <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-[#1e293b]" />
                    <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-[#1e293b]" />
                    <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-[#1e293b]" />

                    {/* Header */}
                    <div className="mt-8 z-10 w-full">
                        <div className="flex justify-center mb-6 text-[#1e293b]">
                            <Award size={64} strokeWidth={1} />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-wider text-[#1e293b] uppercase mb-4">
                            Sertifikat
                        </h1>
                        <div className="w-1/3 h-px bg-[#1e293b] mx-auto mb-4 opacity-50"></div>
                        <p className="text-xl text-slate-600 uppercase tracking-[0.3em] font-light text-center">
                            Muvaffaqiyatli Tamomlaganlik Haqida
                        </p>
                    </div>

                    {/* Body */}
                    <div className="flex-1 flex flex-col justify-center w-full max-w-4xl mx-auto space-y-4 z-10">
                        <p className="text-lg text-slate-500 italic font-serif">Ushbu sertifikat tasdiqlaydi:</p>

                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#0f172a] py-4 capitalize font-script">
                            {data.candidate_name}
                        </h2>

                        <p className="text-lg text-slate-500 mt-6 px-12">
                            Moorfo platformasida quyidagi kursni a'lo baholarga o'zlashtirib, barcha amaliy va nazariy sinovlardan muvaffaqiyatli o'tdi:
                        </p>

                        <h3 className="text-2xl md:text-3xl font-bold text-indigo-900 tracking-tight my-6 px-4">
                            {data.course_title || data.exam_title}
                        </h3>

                        <div className="flex justify-center items-center gap-12 my-8 text-slate-600">
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] uppercase tracking-widest text-[#94a3b8] mb-1">To'plangan Natija</span>
                                <span className="text-3xl font-bold text-[#1e293b]">{data.score}%</span>
                            </div>
                            <div className="w-px h-12 bg-slate-300"></div>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] uppercase tracking-widest text-[#94a3b8] mb-1">Berilgan Sana</span>
                                <span className="text-xl font-bold text-[#1e293b] font-serif">
                                    {new Date(data.completed_at).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Signatures */}
                    <div className="w-full flex justify-between items-end px-12 md:px-24 mb-12 z-10">
                        <div className="text-center w-32 md:w-48">
                            <div className="h-16 flex items-end justify-center pb-2">
                                <span className="font-serif text-2xl md:text-3xl italic text-[#1e293b] signature-font">Moorfo</span>
                            </div>
                            <div className="w-full h-px bg-[#1e293b] mt-1 mb-2"></div>
                            <p className="text-[8px] md:text-[10px] uppercase tracking-widest text-slate-500 font-bold">Platforma</p>
                        </div>

                        <div className="flex flex-col items-center justify-center -mb-4">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#1e293b] border-double flex items-center justify-center relative bg-white shadow-lg">
                                <div className="absolute inset-2 border border-dashed border-slate-300 rounded-full"></div>
                                <Award size={48} className="text-[#1e293b]" />
                                <div className="absolute bottom-4 text-[6px] md:text-[8px] font-bold uppercase tracking-widest text-slate-400">Authenticated</div>
                            </div>
                        </div>

                        <div className="text-center w-32 md:w-48">
                            <div className="h-16 flex items-end justify-center pb-2">
                                <span className="font-serif text-2xl md:text-2xl italic text-[#1e293b] signature-font">Bobojonov</span>
                            </div>
                            <div className="w-full h-px bg-[#1e293b] mt-1 mb-2"></div>
                            <p className="text-[8px] md:text-[10px] uppercase tracking-widest text-slate-500 font-bold">O'qituvchi Imzosi</p>
                        </div>
                    </div>

                    <div className="absolute bottom-3 text-[9px] text-slate-400 uppercase tracking-widest font-mono">
                        ID: {data.id.toString().padStart(8, '0')} • VERIFIED CERTIFICATE • MOORFO.UZ
                    </div>
                </div>
            </motion.div>

            {/* Social Section */}
            <div className="w-full max-w-5xl mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 print:hidden">
                <div className="md:col-span-2 space-y-8">
                    {/* Actions Bar */}
                    <div className="glass-card p-6 rounded-2xl flex items-center justify-between border-slate-800/40">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={handleLike}
                                disabled={liking}
                                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all ${data.is_liked
                                        ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20'
                                        : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                                    }`}
                            >
                                <Heart size={24} fill={data.is_liked ? "currentColor" : "none"} className={liking ? "animate-pulse" : ""} />
                                <span>{data.likes_count} Like</span>
                            </button>
                            <div className="flex items-center gap-3 text-slate-400 px-6 py-3">
                                <MessageCircle size={24} />
                                <span className="font-bold">{comments.length} Fikrlar</span>
                            </div>
                        </div>
                        <button className="p-3 bg-slate-800 text-slate-400 rounded-xl hover:bg-slate-700 hover:text-white transition-all">
                            <Share2 size={20} />
                        </button>
                    </div>

                    {/* Comments */}
                    <div className="glass-card p-8 rounded-3xl border-slate-800/40">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">Fikrlar <span className="text-slate-500 text-sm font-normal">({comments.length})</span></h3>

                        <form onSubmit={handleComment} className="mb-8 relative">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Tabriklaysizmi? Fikr qoldiring..."
                                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-6 pr-16 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!newComment.trim()}
                                className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 rounded-xl flex items-center justify-center text-white hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all"
                            >
                                <Send size={18} />
                            </button>
                        </form>

                        <div className="space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                            {comments.map((comment) => (
                                <div key={comment.id} className="flex gap-4 group">
                                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {comment.user.avatar ? (
                                            <img src={comment.user.avatar} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={18} className="text-indigo-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-slate-900/50 p-4 rounded-2xl rounded-tl-none border border-slate-800/50 group-hover:border-slate-700 transition-colors">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-bold text-sm text-slate-200">{comment.user.username}</span>
                                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                                    {new Date(comment.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-slate-400 text-sm leading-relaxed">{comment.text}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {comments.length === 0 && (
                                <div className="text-center py-8 text-slate-600 italic">
                                    Hali fikrlar yo'q. Birinchi bo'lib yozing!
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Candidate Info / Sidebar */}
                <div className="space-y-6">
                    <div className="glass-card p-6 rounded-[2rem] border-slate-800/40 text-center">
                        <div className="w-24 h-24 mx-auto rounded-full p-1 border-2 border-indigo-500/30 mb-4">
                            <img
                                src={data.candidate_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.candidate_name}`}
                                className="w-full h-full rounded-full object-cover bg-slate-900"
                                alt=""
                            />
                        </div>
                        <h3 className="font-bold text-lg mb-1">{data.candidate_name}</h3>
                        <p className="text-sm text-slate-500 mb-6">Moorfo certified student</p>

                        <button className="w-full py-3 bg-slate-800 rounded-xl font-bold text-sm hover:bg-slate-700 transition-colors">
                            Profilni Ko'rish
                        </button>
                    </div>

                    <div className="p-6 rounded-[2rem] bg-gradient-to-br from-indigo-600 to-purple-600 text-white relative overflow-hidden">
                        <Award className="absolute -bottom-4 -right-4 w-32 h-32 opacity-20 rotate-12" />
                        <h4 className="font-bold text-lg mb-2 relative z-10">Siz ham oling!</h4>
                        <p className="text-sm opacity-90 mb-4 relative z-10">Ushbu kursni o'qib tugating va o'z sertifikatingizga ega bo'ling.</p>
                        <button onClick={() => navigate('/courses')} className="px-6 py-2 bg-white text-indigo-600 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors relative z-10 shadow-lg">
                            Kursga O'tish
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    @page { size: landscape; margin: 0; }
                    body { 
                        visibility: hidden; 
                        background: white;
                    }
                    body > * { display: none !important; }
                    #root { 
                        display: block !important; 
                        visibility: visible !important;
                    }
                    #root > * { display: none !important; }
                    nav, aside, header, footer, .print\\:hidden {
                        display: none !important;
                    }
                    .print-content {
                        visibility: visible !important;
                        display: block !important;
                        position: fixed !important;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        width: 100% !important;
                        height: 100% !important;
                        max-width: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        z-index: 99999;
                        border: none !important;
                        box-shadow: none !important;
                        border-radius: 0 !important;
                        transform: scale(1) !important;
                        background: white !important;
                        color: black !important;
                    }
                    .print-content * {
                        visibility: visible !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Certificate;
