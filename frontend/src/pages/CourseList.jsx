import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Star, Users, Clock, Loader2 } from 'lucide-react';
import API from '../api/axios';

import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => (
    <Link to={`/courses/${course.slug}`}>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="glass-card rounded-2xl overflow-hidden group h-full cursor-pointer flex flex-col"
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60'}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                <div className="absolute top-4 left-4">
                    <span className="bg-indigo-600/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {course.category}
                    </span>
                </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
                    <div className="flex items-center space-x-1">
                        <Star size={14} className="text-amber-500 fill-amber-500" />
                        <span>4.8</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Users size={14} />
                        <span>{course.lessons_count} Lessons</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{course.estimated_duration}</span>
                    </div>
                </div>
                <h3 className="text-lg font-bold mb-4 group-hover:text-indigo-400 transition-colors">{course.title}</h3>
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-slate-800 text-slate-400">{course.difficulty}</span>
                    <button className="p-2 rounded-full bg-indigo-600 group-hover:bg-indigo-500 text-white transition-all transform group-hover:rotate-6">
                        <Play size={18} fill="currentColor" />
                    </button>
                </div>
            </div>
        </motion.div>
    </Link>
);

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [difficulty, setDifficulty] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                let url = '/courses/';
                const params = new URLSearchParams();
                if (difficulty) params.append('difficulty', difficulty);
                if (category) params.append('category', category);
                if (params.toString()) url += `?${params.toString()}`;

                const response = await API.get(url);
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [difficulty, category]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-indigo-500" size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tight">Kurslarni <span className="text-indigo-500">O'rganish</span></h1>
                    <p className="text-slate-500 font-medium italic">"O'rganishning go'zal tomoni shundaki, uni sizdan hech kim tortib ola olmaydi."</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-400 focus:ring-1 focus:ring-indigo-500 outline-none"
                    >
                        <option value="">Barcha Darajalar</option>
                        <option value="beginner">Boshlang'ich</option>
                        <option value="intermediate">O'rta</option>
                        <option value="advanced">Yuqori</option>
                    </select>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-400 focus:ring-1 focus:ring-indigo-500 outline-none"
                    >
                        <option value="">Barcha Kategoriyalar</option>
                        <option value="Technology">Texnologiya</option>
                        <option value="Programming">Dasturlash</option>
                        <option value="Design">Dizayn</option>
                    </select>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.length > 0 ? (
                    courses.map(course => <CourseCard key={course.id} course={course} />)
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <p className="text-slate-500 text-lg">Hech qanday kurs topilmadi.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseList;
