import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, ShieldAlert, Search, RefreshCw, UserPlus } from 'lucide-react';
import API from '../api/axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await API.get('/auth/admin/users/');
            setUsers(response.data);
        } catch (error) {
            console.error('Foydalanuvchilarni yuklashda xatolik:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStaff = async (userId) => {
        try {
            await API.post(`/auth/admin/users/${userId}/toggle-staff/`);
            fetchUsers(); // Refresh list
        } catch (error) {
            alert(error.response?.data?.detail || 'Amalni bajarib bo\'lmadi');
        }
    };

    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Foydalanuvchilar</h1>
                    <p className="text-slate-400 mt-1">Tizim foydalanuvchilarini boshqarish va huquqlarini tahrirlash</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchUsers}
                        className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-semibold transition-all shadow-lg shadow-indigo-600/20">
                        <UserPlus size={20} />
                        <span>Yangi User</span>
                    </button>
                </div>
            </header>

            <div className="relative group max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                    type="text"
                    placeholder="Foydalanuvchi qidirish..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
            </div>

            <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="px-8 py-5 text-sm font-semibold text-slate-400">Foydalanuvchi</th>
                                <th className="px-8 py-5 text-sm font-semibold text-slate-400">Rol</th>
                                <th className="px-8 py-5 text-sm font-semibold text-slate-400">Ball</th>
                                <th className="px-8 py-5 text-sm font-semibold text-slate-400">Holat</th>
                                <th className="px-8 py-5 text-sm font-semibold text-slate-400 text-right">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map((user, idx) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="hover:bg-white/[0.02] transition-colors"
                                >
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center font-bold text-indigo-400">
                                                {user.username[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold">{user.username}</div>
                                                <div className="text-xs text-slate-500">{user.email || 'Email yo\'q'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        {user.is_superuser ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/10 text-rose-500 text-xs font-bold uppercase tracking-wider">
                                                <ShieldAlert size={14} /> Super
                                            </span>
                                        ) : user.is_staff ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 text-amber-500 text-xs font-bold uppercase tracking-wider">
                                                <Shield size={14} /> Staff
                                            </span>
                                        ) : (
                                            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Talaba</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="font-mono text-indigo-400">{user.total_score} XP</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                            <span className="text-xs">Active</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button
                                            onClick={() => toggleStaff(user.id)}
                                            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-colors"
                                        >
                                            {user.is_staff ? 'Staffni ochirish' : 'Staff tayinlash'}
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
