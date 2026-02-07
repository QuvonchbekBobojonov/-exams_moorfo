import React from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    BookOpen,
    FileQuestion,
    Users,
    PlusCircle,
    Settings,
    TrendingUp,
    Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ManagementDashboard = () => {
    const navigate = useNavigate();

    const stats = [
        { label: "Barcha Kurslar", value: "12", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Barcha Imtihonlar", value: "45", icon: FileQuestion, color: "text-purple-500", bg: "bg-purple-500/10" },
        { label: "Foydalanuvchilar", value: "1,240", icon: Users, color: "text-green-500", bg: "bg-green-500/10" },
        { label: "Oylik Faollik", value: "+24%", icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-500/10" },
    ];

    const actions = [
        {
            title: "Yangi Kurs",
            desc: "Yangi o'quv kursi va darsliklarni qo'shish",
            icon: PlusCircle,
            path: "/admin/courses/new",
            color: "from-blue-600 to-indigo-600"
        },
        {
            title: "Imtihon Yaratish",
            desc: "Savollar va testlar bazasini shakllantirish",
            icon: Zap,
            path: "/admin/exams/new",
            color: "from-purple-600 to-pink-600"
        },
        {
            title: "Foydalanuvchilar",
            desc: "Tizim foydalanuvchilari va ularning huquqlari",
            icon: Users,
            path: "/admin/users",
            color: "from-emerald-600 to-teal-600"
        },
        {
            title: "Tizim Sozlamalari",
            desc: "Platforma parametrlari va boshqaruv",
            icon: Settings,
            path: "/admin/settings",
            color: "from-orange-600 to-red-600"
        },
    ];

    return (
        <div className="space-y-10">
            <header>
                <h1 className="text-4xl font-bold tracking-tight">Boshqaruv Paneli</h1>
                <p className="text-slate-400 mt-2">Platforma ma'lumotlarini boshqarish va nazorat qilish markazi</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card p-6 rounded-3xl border-white/5"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bg}`}>
                                <stat.icon className={stat.color} size={24} />
                            </div>
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium">{stat.label}</h3>
                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {actions.map((action, idx) => (
                    <motion.button
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(action.path)}
                        className="group relative overflow-hidden glass-card p-8 rounded-[2rem] border-white/5 text-left transition-all hover:border-white/10"
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${action.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />

                        <div className="flex items-start justify-between">
                            <div className="space-y-4">
                                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${action.color} shadow-lg shadow-indigo-600/10`}>
                                    <action.icon className="text-white" size={28} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">{action.title}</h3>
                                    <p className="text-slate-400 mt-1 max-w-[200px]">{action.desc}</p>
                                </div>
                            </div>
                            <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                                <PlusCircle className="text-slate-400 group-hover:text-white" size={20} />
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Recent Activity Placeholder */}
            <section className="glass-card p-8 rounded-[2.5rem] border-white/5">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold">Oxirgi harakatlar</h2>
                    <button className="text-sm text-indigo-400 font-semibold hover:text-indigo-300">Barchasini ko'rish</button>
                </div>
                <div className="space-y-6">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                <Zap className="text-indigo-500" size={18} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm"><strong>Admin</strong> "Python Asoslari" kursiga yangi dars qo'shdi</p>
                                <p className="text-xs text-slate-500 mt-1">2 soat avval</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ManagementDashboard;
