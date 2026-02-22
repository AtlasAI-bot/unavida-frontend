import React from 'react';
import { Award, Lock } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';

const StudentAchievements = () => {
  const { getAchievements, getAvailableAchievements } = useProgress();

  const earnedAchievements = getAchievements();
  const allAchievements = getAvailableAchievements();
  const lockedAchievements = allAchievements.filter(
    achievement => !earnedAchievements.some(earned => earned.id === achievement.id)
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Award size={32} className="text-yellow-500" />
          <h2 className="text-2xl font-bold">Achievements</h2>
        </div>
        <p className="text-gray-400">
          Earn badges by completing learning activities and mastering course content
        </p>
      </div>

      {/* Earned Achievements */}
      {earnedAchievements.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
            <span>✓</span> Badges Earned ({earnedAchievements.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {earnedAchievements.map(achievement => (
              <div
                key={achievement.id}
                className="p-6 bg-gradient-to-br from-yellow-900 to-yellow-800 border-2 border-yellow-500 rounded-lg hover:shadow-lg hover:shadow-yellow-500/50 transition-all transform hover:scale-105"
              >
                <div className="text-4xl mb-3">{achievement.icon}</div>
                <h4 className="font-bold text-lg text-white mb-1">
                  {achievement.name}
                </h4>
                <p className="text-sm text-yellow-100 mb-3">
                  {achievement.description}
                </p>
                <div className="inline-block px-3 py-1 bg-yellow-700 text-yellow-200 rounded-full text-xs font-semibold">
                  Unlocked ✓
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-400 mb-4 flex items-center gap-2">
            <Lock size={18} /> Achievements to Unlock ({lockedAchievements.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedAchievements.map(achievement => (
              <div
                key={achievement.id}
                className="p-6 bg-gray-800 border border-gray-700 rounded-lg opacity-60 hover:opacity-80 transition-opacity"
              >
                <div className="text-4xl mb-3 filter grayscale">
                  {achievement.icon}
                </div>
                <h4 className="font-bold text-lg text-gray-300 mb-1">
                  {achievement.name}
                </h4>
                <p className="text-sm text-gray-400 mb-3">
                  {achievement.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Lock size={14} />
                  <span>{achievement.requirement}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Achievements Yet */}
      {earnedAchievements.length === 0 && (
        <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
          <Award size={48} className="mx-auto mb-4 text-gray-500" />
          <p className="text-gray-400 mb-4">
            No achievements earned yet
          </p>
          <p className="text-sm text-gray-500">
            Start learning and completing activities to unlock badges!
          </p>
        </div>
      )}

      {/* Achievement Progress Tips */}
      <div className="mt-12 p-6 bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg">
        <h3 className="font-semibold text-blue-300 mb-4">Tips to Earn More Achievements</h3>
        <ul className="space-y-2 text-sm text-blue-100">
          <li>📚 <strong>Bookworm:</strong> Read all chapter sections completely</li>
          <li>🎯 <strong>Quiz Master:</strong> Score 100% on the chapter quiz</li>
          <li>🎴 <strong>Study Buddy:</strong> Master all flashcards in the chapter</li>
          <li>💼 <strong>Case Expert:</strong> Complete all clinical case studies</li>
          <li>⚡ <strong>Speed Reader:</strong> Finish the chapter in under 3 hours</li>
          <li>🔢 <strong>Problem Solver:</strong> Complete all practice problems</li>
          <li>📝 <strong>Note Taker:</strong> Create 10 or more detailed study notes</li>
          <li>👑 <strong>Learning Leader:</strong> Master all 9 learning outcomes</li>
        </ul>
      </div>
    </div>
  );
};

export default StudentAchievements;
