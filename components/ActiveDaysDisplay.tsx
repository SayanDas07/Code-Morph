import React from 'react';
import { Flame } from 'lucide-react';

interface ActiveDaysDisplayProps {
    activeDays: number;
    activeDates: string[];
}

const ActiveDaysDisplay: React.FC<ActiveDaysDisplayProps> = ({ activeDays, activeDates }) => {
    const today = new Date();
    const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - i);
        return date.toISOString().split('T')[0];
    }).reverse();

    return (
        <div className="bg-gray-700/20 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
                <Flame className="h-5 w-5 text-orange-500" />
                <h3 className="text-sm font-medium text-gray-300">Active Days</h3>
            </div>
            <div className="space-y-4">
                <div>
                    <p className="text-2xl font-bold text-orange-400">{activeDays || 0}</p>
                    <p className="text-xs text-gray-400 mt-1">Total active days</p>
                </div>
                <div className="border-t border-gray-700 pt-4">
                    <p className="text-xs text-gray-400 mb-2">Activity History</p>
                    <div className="grid grid-cols-6 gap-1">
                        {last30Days.map((date) => {
                            const isActive = activeDates?.includes(date);
                            return (
                                <div
                                    key={date}
                                    className={`w-full pt-[100%] relative rounded-sm ${isActive ? 'bg-orange-500/60' : 'bg-gray-700/40'
                                        }`}
                                    title={`${date}${isActive ? ' - Active' : ' - Inactive'}`}
                                />
                            );
                        })}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Last 30 days</p>
                </div>

            </div>
        </div>
    );
};

export default ActiveDaysDisplay;