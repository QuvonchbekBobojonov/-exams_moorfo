import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Bell, Moon, Globe, Shield, Save, Loader2, Camera } from 'lucide-react';
import API from '../api/axios';

const Settings = () => {
    const { user, refreshUser } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileSettings user={user} refreshUser={refreshUser} />;
            case 'account':
                return <AccountSettings />;
            case 'notifications':
                return <NotificationSettings />;
            case 'security':
                return <SecuritySettings />;
            default:
                return <ProfileSettings user={user} refreshUser={refreshUser} />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 space-y-12">
            <div>
                <h1 className="text-4xl font-black uppercase tracking-tight mb-4">Sozlamalar</h1>
                <p className="text-slate-500 font-medium italic">"O'qish tajribangizni sozlang va hisobingizni boshqaring."</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Sidebar Navigation */}
                <div className="md:col-span-1 space-y-2">
                    {[
                        { id: 'profile', icon: User, label: 'Profil' },
                        { id: 'account', icon: Mail, label: 'Hisob' },
                        { id: 'notifications', icon: Bell, label: 'Bildirishnomalar' },
                        { id: 'security', icon: Shield, label: 'Xavfsizlik' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'
                                }`}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="md:col-span-3 space-y-8">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderContent()}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

const ProfileSettings = ({ user, refreshUser }) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: user?.username || '',
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        birth_date: user?.birth_date || '',
        phone_number: user?.phone_number || '',
        bio: user?.bio || '',
        email: user?.email || '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await API.patch('/auth/me/', formData);
            await refreshUser();
            setSuccess('Profil muvaffaqiyatli yangilandi!');
        } catch (err) {
            setError('Profilni yangilashda xatolik yuz berdi. Iltimos qayta urinib ko\'ring.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card p-10 rounded-[3rem] border-slate-800/40">
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex items-center gap-8 mb-10 pb-10 border-b border-slate-800/50">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-3xl bg-slate-800 p-1 border-2 border-slate-700 overflow-hidden">
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                                className="w-full h-full object-cover rounded-2xl"
                                alt=""
                            />
                        </div>
                        <button type="button" className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 rounded-xl text-white shadow-xl hover:scale-110 transition-transform">
                            <Camera size={16} />
                        </button>
                    </div>
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-widest">Profil Rasmi</h3>
                        <p className="text-xs text-slate-500 font-bold mt-1">Sizning foydalanuvchi nomingiz asosida yaratilgan.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] ml-2">Ism</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] ml-2">Familiya</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] ml-2">Foydalanuvchi nomi</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] ml-2">Email Manzil</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] ml-2">Tug'ilgan sana</label>
                        <input
                            type="date"
                            name="birth_date"
                            value={formData.birth_date}
                            onChange={handleChange}
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] ml-2">Telefon</label>
                        <input
                            type="tel"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] ml-2">Biografiya / Kasbiy Sarlavha</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="4"
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold resize-none"
                        placeholder="Jamiyatga o'zingiz haqingizda gapirib bering..."
                    />
                </div>

                {success && (
                    <p className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl text-xs font-bold text-center">
                        {success}
                    </p>
                )}

                {error && (
                    <p className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-xs font-bold text-center">
                        {error}
                    </p>
                )}

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-3"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        O'zgarishlarni Saqlash
                    </button>
                </div>
            </form>
        </div>
    );
};

const AccountSettings = () => {
    return (
        <div className="glass-card p-10 rounded-[3rem] border-slate-800/40 space-y-8">
            <h3 className="text-xl font-black uppercase tracking-widest border-b border-slate-800/50 pb-6">Parolni O'zgartirish</h3>
            <div className="space-y-6">
                <div className="space-y-3">
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] ml-2">Joriy Parol</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold" />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] ml-2">Yangi Parol</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold" />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] ml-2">Yangi Parolni Tasdiqlash</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold" />
                </div>
                <div className="flex justify-end pt-4">
                    <button className="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3">
                        <Lock size={18} />
                        Parolni Yangilash
                    </button>
                </div>
            </div>
        </div>
    );
};

const NotificationSettings = () => {
    return (
        <div className="glass-card p-10 rounded-[3rem] border-slate-800/40">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3 uppercase tracking-widest">
                <Moon className="text-indigo-400" /> Afzalliklar
            </h3>
            <div className="space-y-6">
                {[
                    { icon: Globe, label: "Ochiq Profil Ko'rinishi", desc: "Boshqalarga reyting va natijalaringizni ko'rishga ruxsat bering.", active: true },
                    { icon: Bell, label: 'Email Bildirishnomalar', desc: 'Yangi kurslar va imtihonlar haqida yangiliklar oling.', active: false },
                ].map((pref, i) => (
                    <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
                        <div className="flex items-center gap-6">
                            <div className="p-3 bg-slate-800 rounded-xl text-slate-400">
                                <pref.icon size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-200 uppercase tracking-tight">{pref.label}</p>
                                <p className="text-[10px] text-slate-500 font-bold mt-1">{pref.desc}</p>
                            </div>
                        </div>
                        <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${pref.active ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${pref.active ? 'right-1' : 'left-1'}`} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SecuritySettings = () => {
    return (
        <div className="glass-card p-10 rounded-[3rem] border-slate-800/40 space-y-8">
            <h3 className="text-xl font-black uppercase tracking-widest border-b border-slate-800/50 pb-6">Xavfsizlik</h3>
            <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
                <div className="flex items-center gap-6">
                    <div className="p-3 bg-slate-800 rounded-xl text-slate-400">
                        <Shield size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-black text-slate-200 uppercase tracking-tight">Ikki Bosqichli Tasdiqlash</p>
                        <p className="text-[10px] text-slate-500 font-bold mt-1">Hisobingizni qo'shimcha xavfsizlik bilan ta'minlang.</p>
                    </div>
                </div>
                <div className="w-12 h-6 rounded-full relative cursor-pointer transition-colors bg-slate-700">
                    <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all" />
                </div>
            </div>
            <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                <h4 className="text-rose-500 font-bold mb-2">Xavfli Hudud</h4>
                <p className="text-xs text-slate-400 mb-4">Hisobingizni o'chirib tashlasangiz, barcha ma'lumotlaringiz tiklanib bo'lmaydigan darajada yo'qoladi.</p>
                <button className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase tracking-widest">Hisobni O'chirish</button>
            </div>
        </div>
    );
};

export default Settings;
