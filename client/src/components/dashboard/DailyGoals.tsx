import React, { useState } from 'react';
import { Zap, Check } from 'lucide-react';
import { Card } from '../ui/Card';
import { useAuth } from '../../context/AuthContext';
import { usersService } from '../../services/users.service';

interface Goal {
  title: string;
  completed: boolean;
}

export const DailyGoals: React.FC = () => {
  const { user, setUser } = useAuth();
  const defaultGoals: Goal[] = [
    { title: 'Study 1 hour in a focus room', completed: false },
    { title: 'Ask or answer 1 academic doubt', completed: false },
    { title: 'Complete a Pomodoro study session', completed: false },
  ];

  const [goals, setGoals] = useState<Goal[]>(
    user?.dailyGoals && user.dailyGoals.length > 0 ? user.dailyGoals : defaultGoals
  );

  React.useEffect(() => {
    if (user?.dailyGoals && user.dailyGoals.length > 0) {
      setGoals(user.dailyGoals);
    }
  }, [user?.dailyGoals]);

  const toggleGoal = async (idx: number) => {
    const updated = goals.map((g, i) => (i === idx ? { ...g, completed: !g.completed } : g));
    setGoals(updated);
    if (user && setUser) {
      setUser({ ...user, dailyGoals: updated });
    }
    try {
      await usersService.toggleDailyGoal(idx);
    } catch (e) {
      // Local state is preserved
    }
  };

  const completedCount = goals.filter((g) => g.completed).length;

  return (
    <Card className="p-6 bg-[#FAF9FF] border border-[#EDE9FE] flex flex-col justify-between h-64">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-[#8B5CF6]/15 text-[#8B5CF6] flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 fill-current" />
          </div>
          <h3 className="text-base font-bold text-[#151C2F]">Daily Goals</h3>
        </div>

        <div className="space-y-3">
          {goals.map((goal, idx) => (
            <div
              key={idx}
              onClick={() => toggleGoal(idx)}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <button
                type="button"
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  goal.completed
                    ? 'bg-[#8B5CF6] text-white'
                    : 'border-2 border-[#D1D5DB] group-hover:border-[#8B5CF6] bg-white'
                }`}
              >
                {goal.completed && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
              <span
                className={`text-sm font-medium transition-all ${
                  goal.completed
                    ? 'line-through text-[#98A2B3]'
                    : 'text-[#151C2F] group-hover:text-[#8B5CF6]'
                }`}
              >
                {goal.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-[12px] text-[#8B5CF6] font-semibold bg-[#F5F3FF] py-1.5 px-3 rounded-lg flex items-center justify-between">
        <span>{completedCount} of {goals.length} completed</span>
        <span>+{completedCount * 25} XP reward</span>
      </div>
    </Card>
  );
};
