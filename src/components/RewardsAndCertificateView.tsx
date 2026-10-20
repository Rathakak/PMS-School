import React, { useState } from 'react';
import { MOTIVATIONAL_REWARDS, MotivationalReward } from '../data/grade6Curriculum';
import { Award, CheckCircle2, Gift, Printer, Trophy, Plus } from 'lucide-react';

interface CustomReward {
  id: string;
  title: string;
  requiredPoints: number;
  claimed: boolean;
}

interface RewardsAndCertificateViewProps {
  studentName: string;
  studentClass: string;
  totalPoints: number;
  streakDays: number;
  completedDecksCount: number;
  claimedRewardIds: string[];
  onClaimReward: (reward: MotivationalReward) => void;
  agreedToTerms: boolean;
}

export const RewardsAndCertificateView: React.FC<RewardsAndCertificateViewProps> = ({
  studentName,
  studentClass,
  totalPoints,
  streakDays,
  completedDecksCount,
  claimedRewardIds,
  onClaimReward,
  agreedToTerms,
}) => {
  const [customRewards, setCustomRewards] = useState<CustomReward[]>([
    { id: 'cust-1', title: 'សៀវភៅរឿងអប់រំ ១ ក្បាល (ពីអាណាព្យាបាល)', requiredPoints: 200, claimed: false },
    { id: 'cust-2', title: 'ដំណើរកម្សាន្ត ឬអាហារសម្រន់ពិសេសថ្ងៃចុងសប្ដាហ៍', requiredPoints: 500, claimed: false },
  ]);
  const [newRewardTitle, setNewRewardTitle] = useState('');
  const [newRewardPoints, setNewRewardPoints] = useState(300);

  const handleAddCustomReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRewardTitle.trim()) return;
    setCustomRewards((prev) => [
      ...prev,
      {
        id: `cust-${Date.now()}`,
        title: newRewardTitle.trim(),
        requiredPoints: Math.max(20, Number(newRewardPoints) || 100),
        claimed: false,
      },
    ]);
    setNewRewardTitle('');
  };

  const toggleCustomClaim = (id: string) => {
    setCustomRewards((prev) =>
      prev.map((item) => (item.id === id ? { ...item, claimed: !item.claimed } : item))
    );
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Summary KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs text-slate-500">ពិន្ទុលើកទឹកចិត្តសរុប</div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-slate-900">
            {totalPoints} ពិន្ទុ
          </div>
          <div className="mt-1 text-xs text-slate-600">
            សន្សំពីការធ្វើលំហាត់ស្លាយប្រចាំថ្ងៃ
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs text-slate-500">វិន័យម៉ោង ៧:០០ ល្ងាច (Streak)</div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-amber-700">
            {streakDays} ថ្ងៃជាប់គ្នា
          </div>
          <div className="mt-1 text-xs text-slate-600">
            ចូលធ្វើលំហាត់ទៀងទាត់រៀងរាល់ថ្ងៃ
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs text-slate-500">ស្លាយទាំង ១០ ដែលបានបញ្ចប់</div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-sky-700">
            {completedDecksCount} ឈុតស្លាយ
          </div>
          <div className="mt-1 text-xs text-slate-600">
            ១ ឈុត = ១០ លំហាត់គណិតវិទ្យាថ្នាក់ទី៦
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="text-xs text-slate-500">រង្វាន់ដែលបានទទួល</div>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-emerald-700">
            {claimedRewardIds.length} / {MOTIVATIONAL_REWARDS.length}
          </div>
          <div className="mt-1 text-xs text-slate-600">
            {agreedToTerms ? '✓ បានយល់ព្រមតាមលក្ខខណ្ឌសិក្សា' : 'មិនទាន់ចុចយល់ព្រមលក្ខខណ្ឌ'}
          </div>
        </div>
      </div>

      {/* Official Motivational Rewards Grid */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 no-print">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              ប្រព័ន្ធរង្វាន់លើកទឹកចិត្ត និងមេដាយកិត្តិយស
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              ធ្វើលំហាត់គណិតវិទ្យាឱ្យគ្រប់ ១០ ស្លាយ រៀងរាល់ម៉ោង ៧:០០ ល្ងាច ដើម្បីបើកយករង្វាន់លើកទឹកចិត្ត
            </p>
          </div>
          <div className="text-xs font-mono text-slate-500">
            ពិន្ទុបច្ចុប្បន្ន៖ {totalPoints} pts
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MOTIVATIONAL_REWARDS.map((reward) => {
            const isClaimed = claimedRewardIds.includes(reward.id);
            const canClaim =
              totalPoints >= reward.requiredPoints &&
              completedDecksCount >= reward.requiredDecks;

            return (
              <div
                key={reward.id}
                className={`border rounded-xl p-5 flex flex-col justify-between transition-colors ${
                  isClaimed
                    ? 'bg-emerald-50/40 border-emerald-300'
                    : canClaim
                    ? 'bg-sky-50/40 border-sky-300'
                    : 'bg-slate-50/60 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                    <span className="font-mono">{reward.rewardCode}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">ត្រូវការ {reward.requiredPoints} ពិន្ទុ</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2.5 rounded-lg shrink-0 ${
                        isClaimed
                          ? 'bg-emerald-100 text-emerald-800'
                          : canClaim
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {reward.category === 'medal' ? (
                        <Award className="w-5 h-5" />
                      ) : reward.category === 'certificate' ? (
                        <Trophy className="w-5 h-5" />
                      ) : (
                        <Gift className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {reward.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {reward.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-600 font-mono tabular-nums">
                    {Math.min(totalPoints, reward.requiredPoints)} / {reward.requiredPoints} pts
                  </span>

                  {isClaimed ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>បានទទួលរង្វាន់រួចហើយ</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={!canClaim}
                      onClick={() => onClaimReward(reward)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                        canClaim
                          ? 'bg-sky-700 text-white hover:bg-sky-800 cursor-pointer'
                          : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {canClaim ? 'ទទួលយករង្វាន់ឥឡូវនេះ' : `ខ្វះ ${reward.requiredPoints - totalPoints} ពិន្ទុ`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Parent / Teacher Custom Real-World Encouragement Rewards */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 no-print">
        <div className="pb-4 mb-5 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">
            រង្វាន់លើកទឹកចិត្តផ្ទាល់ខ្លួនពីអាណាព្យាបាល ឬគ្រូបង្រៀន
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            អាណាព្យាបាល ឬគ្រូបង្រៀនអាចកំណត់រង្វាន់លើកទឹកចិត្តបន្ថែម សម្រាប់សិស្សដែលខិតខំធ្វើលំហាត់រៀងរាល់ម៉ោង ៧:០០ ល្ងាច
          </p>
        </div>

        <form onSubmit={handleAddCustomReward} className="flex flex-col sm:flex-row gap-3 mb-5">
          <input
            type="text"
            value={newRewardTitle}
            onChange={(e) => setNewRewardTitle(e.target.value)}
            placeholder="ឈ្មោះរង្វាន់លើកទឹកចិត្ត (ឧ. ទិញសៀវភៅគណិតវិទ្យាថ្មី ឬញ៉ាំការ៉េម)..."
            className="flex-1 px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-sky-600"
          />
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-600 whitespace-nowrap">ពិន្ទុត្រូវការ៖</label>
            <input
              type="number"
              min={20}
              step={20}
              value={newRewardPoints}
              onChange={(e) => setNewRewardPoints(Number(e.target.value))}
              className="w-24 px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-sky-600"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>បន្ថែមរង្វាន់លើកទឹកចិត្ត</span>
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customRewards.map((item) => {
            const unlocked = totalPoints >= item.requiredPoints;
            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 p-4 border border-slate-200 rounded-lg bg-slate-50/50"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    គោលដៅ៖ {item.requiredPoints} ពិន្ទុ · ស្ថានភាព៖{' '}
                    {item.claimed ? 'បានប្រគល់រួច' : unlocked ? 'គ្រប់ពិន្ទុប្ដូររង្វាន់' : 'កំពុងសន្សំពិន្ទុ'}
                  </div>
                </div>
                <button
                  type="button"
                  disabled={!unlocked && !item.claimed}
                  onClick={() => toggleCustomClaim(item.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    item.claimed
                      ? 'bg-emerald-100 text-emerald-800'
                      : unlocked
                      ? 'bg-amber-600 text-white hover:bg-amber-700 cursor-pointer'
                      : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {item.claimed ? '✓ បានទទួលរង្វាន់' : 'ប្ដូរយករង្វាន់'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Printable Official Khmer Achievement Certificate */}
      <section className="bg-white border-2 border-slate-800 rounded-xl p-8 relative">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200 no-print">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              បណ្ណសរសើរ និងរង្វាន់លើកទឹកចិត្ត (អាចបោះពុម្ពបាន)
            </h3>
            <p className="text-xs text-slate-600">
              បណ្ណសរសើរផ្លូវការសម្រាប់សិស្សដែលបានអនុវត្តលំហាត់គណិតវិទ្យាថ្នាក់ទី៦ ជាស្លាយ ១០ លំហាត់ក្នុងមួយថ្ងៃ រៀងរាល់ម៉ោង ៧:០០ ល្ងាច
            </p>
          </div>
          <button
            type="button"
            onClick={handlePrintCertificate}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>បោះពុម្ពបណ្ណសរសើរ (Print)</span>
          </button>
        </div>

        <div className="border-4 border-double border-amber-600/80 rounded-lg p-8 bg-[#FFFDF9] text-center space-y-4">
          <div className="text-xs font-semibold text-slate-700 tracking-wide">
            ព្រះរាជាណាចក្រកម្ពុជា · ជាតិ សាសនា ព្រះមហាក្សត្រ
          </div>
          <div className="text-sm font-semibold text-sky-900">
            កម្មវិធីអនុវត្តន៍លំហាត់គណិតវិទ្យាថ្នាក់ទី៦ (១០ ស្លាយប្រចាំថ្ងៃ · ម៉ោង ៧:០០ ល្ងាច)
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-amber-800 pt-2">
            បណ្ណសរសើរ និងរង្វាន់លើកទឹកចិត្ត
          </h2>

          <p className="text-sm text-slate-700 max-w-xl mx-auto">
            សូមសរសើរ និងផ្ដល់រង្វាន់លើកទឹកចិត្តជូនចំពោះសិស្សឈ្មោះ៖
          </p>

          <div className="py-2">
            <span className="text-2xl font-bold text-slate-900 border-b-2 border-slate-800 px-6 pb-1">
              {studentName || 'សិស្សឆ្នើមគណិតវិទ្យាថ្នាក់ទី៦'}
            </span>
            <span className="ml-3 text-sm text-slate-600">
              ({studentClass || 'ថ្នាក់ទី ៦'})
            </span>
          </div>

          <p className="text-sm text-slate-700 max-w-2xl mx-auto leading-relaxed">
            ដែលបានអាន និងយល់ព្រមតាមលក្ខខណ្ឌសិក្សា ព្រមទាំងខិតខំប្រឹងប្រែងចូលធ្វើលំហាត់គណិតវិទ្យាថ្នាក់ទី៦
            ជាស្លាយចំនួន <strong>១០ លំហាត់ក្នុងមួយថ្ងៃ</strong> រៀងរាល់ <strong>ម៉ោង ៧:០០ ល្ងាច</strong> ដោយទទួលបានពិន្ទុសរុប{' '}
            <strong className="font-mono">{totalPoints} ពិន្ទុ</strong> និងរក្សាវិន័យសិក្សាបាន{' '}
            <strong className="font-mono">{streakDays} ថ្ងៃជាប់គ្នា</strong>។
          </p>

          <div className="pt-6 grid grid-cols-2 gap-8 max-w-lg mx-auto text-xs text-slate-700">
            <div>
              <div className="font-semibold">ការប្ដេជ្ញាចិត្តរបស់សិស្ស</div>
              <div className="mt-6 border-t border-slate-400 pt-1">
                {studentName || 'សិស្សានុសិស្សថ្នាក់ទី៦'}
              </div>
            </div>
            <div>
              <div className="font-semibold">គ្រូបង្រៀន / អាណាព្យាបាល</div>
              <div className="mt-6 border-t border-slate-400 pt-1">
                ហត្ថលេខា និងការលើកទឹកចិត្ត
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
