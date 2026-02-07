import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, GraduationCap, Github, Globe, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = ({ initialIsLogin = true }) => {
    const [isLogin, setIsLogin] = useState(initialIsLogin);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const [loadingAction, setLoadingAction] = useState(false);

    const { login, register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoadingAction(true);
        try {
            if (isLogin) {
                await login(email, password);
                navigate(from, { replace: true });
            } else {
                await register({
                    email: email || null, // Optional
                    username,
                    password,
                    first_name: firstName,
                    last_name: lastName,
                    birth_date: birthDate || null,
                    phone_number: phoneNumber
                });
                setIsLogin(true); // Switch to login after successful registration
                setError('Ro\'yxatdan o\'tish muvaffaqiyatli! Endi tizimga kiring.');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || err.response?.data?.message || 'Xatolik yuz berdi. Iltimos ma\'lumotlarni tekshiring.');
        } finally {
            setLoadingAction(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="glass-card p-10 rounded-[2.5rem] border-white/10 shadow-2xl">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl mb-6 shadow-xl shadow-indigo-600/20">
                            <GraduationCap className="text-white" size={32} />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            {isLogin ? 'Xush kelibsiz' : 'Hisob yaratish'}
                        </h2>
                        <p className="text-slate-400 mt-2 text-sm italic">
                            {isLogin ? "Davom etish uchun ma'lumotlaringizni kiriting" : "IT ustalari jamiyatiga qo'shiling"}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-xl text-sm mb-6 text-center italic">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">Ism</label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="Ali"
                                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">Familiya</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Valiyev"
                                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                                    />
                                </div>
                            </div>
                        )}

                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">Foydalanuvchi nomi</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="johndoe"
                                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                                    />
                                </div>
                            </div>
                        )}

                        {!isLogin && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">Tug'ilgan sana</label>
                                    <input
                                        type="date"
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-400"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">Telefon</label>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="+998 90..."
                                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">Email Manzil (Ixtiyoriy)</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <input
                                    type="email"
                                    required={isLogin}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="alex@example.com"
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Parol</label>
                                {isLogin && (
                                    <a href="#" className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-widest">Unutdingizmi?</a>
                                )}
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                                />
                            </div>
                        </div>

                        <button
                            disabled={loadingAction}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loadingAction ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                <>
                                    <span>{isLogin ? 'Kirish' : "Ro'yxatdan o'tish"}</span>
                                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>


                    <p className="text-center mt-10 text-slate-500 text-sm">
                        {isLogin ? "Hisobingiz yo'qmi?" : "Allaqachon hisobingiz bormi?"}{' '}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                            className="text-indigo-400 font-bold hover:text-indigo-300 ml-1"
                        >
                            {isLogin ? "Ro'yxatdan o'tish" : 'Kirish'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
