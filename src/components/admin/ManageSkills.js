import { Layers, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dataService } from '../../utils/dataService';

const ManageSkills = () => {
    const [skills, setSkills] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newSkill, setNewSkill] = useState({
        name: '',
        category: 'Frontend',
        level: 'Expert'
    });

    useEffect(() => {
        setSkills(dataService.getSkills());
    }, []);

    const handleAddSkill = (e) => {
        e.preventDefault();
        dataService.addSkill(newSkill);
        setSkills(dataService.getSkills());
        setIsModalOpen(false);
        setNewSkill({ name: '', category: 'Frontend', level: 'Expert' });
    };

    const handleDelete = (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذه المهارة؟')) {
            dataService.deleteSkill(id);
            setSkills(dataService.getSkills());
        }
    };

    return (
        <div className="space-y-6 font-cairo" dir="rtl">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                    <Layers className="text-primary-500" />
                    المصفوفة التقنية
                </h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary-500 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-600 transition-all font-cairo"
                >
                    <Plus size={18} />
                    إضافة مهارة
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.map(skill => (
                    <div key={skill.id} className="bg-dark-900 border border-gray-800 p-6 rounded-2xl hover:border-primary-500/50 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <span className="bg-primary-500/10 text-primary-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                                {skill.category}
                            </span>
                            <div className="flex gap-2">
                                <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-all"><Edit2 size={14} /></button>
                                <button
                                    onClick={() => handleDelete(skill.id)}
                                    className="p-1.5 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-500 transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">{skill.name}</h3>
                        <div className="w-full bg-dark-800 h-1.5 rounded-full overflow-hidden mt-4">
                            <div className="bg-primary-500 h-full w-[90%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                        </div>
                        <p className="text-right text-[10px] text-gray-500 mt-2 font-mono">{skill.level}</p>
                    </div>
                ))}
            </div>

            {/* Add Skill Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-dark-900 border border-gray-800 rounded-3xl w-full max-w-md p-8 relative z-10 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">إضافة مهارة جديدة</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X /></button>
                            </div>

                            <form onSubmit={handleAddSkill} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="skill-name" className="text-sm text-gray-400">اسم المهارة</label>
                                    <input
                                        id="skill-name"
                                        required
                                        className="w-full bg-dark-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                                        value={newSkill.name}
                                        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="skill-cat" className="text-sm text-gray-400">التصنيف</label>
                                    <input
                                        id="skill-cat"
                                        required
                                        className="w-full bg-dark-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                                        value={newSkill.category}
                                        onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                                        placeholder="مثلاً: Frontend, AI, Database"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="skill-level" className="text-sm text-gray-400">المستوى</label>
                                    <select
                                        id="skill-level"
                                        className="w-full bg-dark-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none"
                                        value={newSkill.level}
                                        onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                                    >
                                        <option value="Expert">Expert</option>
                                        <option value="Professional">Professional</option>
                                        <option value="Advanced">Advanced</option>
                                        <option value="Intermediate">Intermediate</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all mt-4"
                                >
                                    حفظ المهارة
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageSkills;
