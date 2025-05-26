import { VisitStats } from '@/types';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function PostVisits({ visitStats }: { visitStats: VisitStats[] }) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('pl-PL', {
            day: 'numeric',
            month: 'short',
        });
    };

    if (visitStats.length <= 0) return <div className="flex h-full items-center justify-center text-gray-500">No visit data available</div>;

    return (
        <>
            <h2 className="mb-4 text-xl font-semibold">Post Visits last 30 days</h2>
            <div className="h-[calc(100%-2rem)]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={visitStats} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" tickFormatter={formatDate} stroke="#6B7280" tick={{ fill: '#6B7280' }} />
                        <YAxis stroke="#6B7280" tick={{ fill: '#6B7280' }} />
                        <Tooltip
                            labelFormatter={formatDate}
                            formatter={(value) => [`${value} visits`, 'Visits']}
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                border: 'none',
                                borderRadius: '0.375rem',
                                color: '#F3F4F6',
                            }}
                        />
                        <Line type="monotone" dataKey="count" stroke="#8B5CF6" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: '#8B5CF6' }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </>
    );
}
