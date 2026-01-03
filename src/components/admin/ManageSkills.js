import { Layers, Plus, Edit2, Trash2 } from 'lucide-react';

const ManageSkills = () => {
    const skills = [
        { id: 1, name: 'React.js', category: 'Frontend', level: 'Expert' },
        { id: 2, name: 'Flutter', category: 'Mobile', level: 'Expert' },
        { id: 3, name: 'GPT-4 Integration', category: 'AI', level: 'Expert' },
        { id: 4, name: 'Odoo Development', category: 'Enterprise', level: 'Professional' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Layers className="text-primary-500" />
                    المصفوفة التقنية
                </h2>
                <button className="bg-primary-500 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-600 transition-all">
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
                                <button className="p-1.5 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
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
        </div>
    );
};

export default ManageSkills;
