import { dataService } from './dataService';

export const systemAnalytics = {
    getDashboardStats: (pageVisits = []) => {
        const users = dataService.getUsers();
        const genProjects = dataService.getGeneratedProjects();
        const messages = dataService.getMessages();

        // تقرير حسب نوع المشروع
        const projectTypes = genProjects.reduce((acc, proj) => {
            acc[proj.projectType] = (acc[proj.projectType] || 0) + 1;
            return acc;
        }, {});

        // تقرير زمني (آخر 7 أيام)
        const last7Days = [...Array(7)].map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            return {
                date: dateStr,
                leads: users.filter(u => u.date === dateStr).length,
                projects: genProjects.filter(p => p.timestamp?.startsWith(dateStr)).length,
                messages: messages.filter(m => m.date?.startsWith(dateStr)).length,
                visits: pageVisits.filter(v => v.visited_at?.startsWith(dateStr)).length
            };
        }).reverse();

        // Top Pages
        const pageCounts = pageVisits.reduce((acc, visit) => {
            // Remove query string but keep path
            const cleanPath = visit.path ? visit.path.split('?')[0] : '/';
            acc[cleanPath] = (acc[cleanPath] || 0) + 1;
            return acc;
        }, {});

        const topPages = Object.entries(pageCounts)
            .map(([path, count]) => ({ path, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8); // Top 8 pages

        return {
            totalUsers: users.length,
            totalGenProjects: genProjects.length,
            totalMessages: messages.length,
            unreadMessages: messages.filter(m => !m.read).length,
            conversionRate: users.length > 0 ? ((genProjects.length / users.length) * 100).toFixed(1) : 0,
            totalVisits: pageVisits.length,
            uniqueVisitors: new Set(pageVisits.map(v => v.visitor_id)).size,
            topPages,
            projectTypes,
            last7Days
        };
    }
};
