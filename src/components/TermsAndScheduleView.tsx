import React, { useState } from 'react';
import { STUDY_CONDITIONS } from '../data/grade6Curriculum';
import { TelegramParentReminderCard } from './TelegramParentReminderCard';
import { Bell, CalendarCheck, CheckCircle2, Clock, ShieldCheck, Sparkles } from 'lucide-react';

interface TermsAndScheduleViewProps {
  studentName: string;
  setStudentName: (val: string) => void;
  studentClass: string;
  setStudentClass: (val: string) => void;
  agreedToTerms: boolean;
  agreedTimestamp: string | null;
  onAcceptAllConditions: () => void;
  reminderEnabled: boolean;
  setReminderEnabled: (val: boolean) => void;
  simulate7PmMode: boolean;
  setSimulate7PmMode: (val: boolean) => void;
  onStartDailySlides: () => void;
  solvedCount: number;
  totalPoints: number;
  streakDays: number;
  currentLessonTitle: string;
}

export const TermsAndScheduleView: React.FC<TermsAndScheduleViewProps> = ({
  studentName,
  setStudentName,
  studentClass,
  setStudentClass,
  agreedToTerms,
  agreedTimestamp,
  onAcceptAllConditions,
  reminderEnabled,
  setReminderEnabled,
  simulate7PmMode,
  setSimulate7PmMode,
  onStartDailySlides,
  solvedCount,
  totalPoints,
  streakDays,
  currentLessonTitle,
}) => {
  const [checkedItems, setCheckedItems] = useState<number[]>([1, 2, 3, 4]);

  const toggleCondition = (id: number) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const allChecked = checkedItems.length === STUDY_CONDITIONS.length;

  const daysOfWeek = [
    { day: 'ចន្ទ', time: '18:45 → 19:00', target: '១០ ស្លាយ · ចំនួន និងទសភាគ', status: 'រួចរាល់' },
    { day: 'អង្គារ', time: '18:45 → 19:00', target: '១០ ស្លាយ · សំណង់មុំ និងពិជគណិត', status: 'រួចរាល់' },
    { day: 'ពុធ', time: '18:45 → 19:00', target: '១០ ស្លាយ · បរិមាត្រ និងផ្ទៃក្រឡា', status: 'ថ្ងៃនេះ (រំលឹក 18:45)' },
    { day: 'ព្រហស្បតិ៍', time: '18:45 → 19:00', target: '១០ ស្លាយ · តួចែករួម និងប្រភាគ', status: 'ត្រៀមបន្ទាប់' },
    { day: 'សុក្រ', time: '18:45 → 19:00', target: '១០ ស្លាយ · ផលធៀប សមាមាត្រ និងល្បឿន', status: 'ត្រៀមបន្ទាប់' },
    { day: 'សៅរ៍', time: '18:45 → 19:00', target: '១០ ស្លាយ · ភាគរយ និងការប្រាក់', status: 'ត្រៀមបន្ទាប់' },
    { day: 'អាទិត្យ', time: '18:45 → 19:00', target: '១០ ស្លាយ · ស្ថិតិ រង្វាស់ពេល និងមាឌសូលីត', status: 'រង្វាន់ប្រចាំសប្ដាហ៍' },
  ];

  return (
    <div className="space-y-8">
      {/* Main Terms & Conditions Agreement Card */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
          <div>
            <div className="text-xs text-sky-800 font-semibold">
              កិច្ចព្រមព្រៀងសិក្សា · ក្រសួងអប់រំ យុវជន និងកីឡា · គណិតវិទ្យាថ្នាក់ទី៦
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              សូមអាន និងយល់ព្រមតាមលក្ខខណ្ឌទាំងអស់នៃកម្មវិធីអនុវត្តលំហាត់
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              កម្មវិធីអនុវត្តន៍លំហាត់គណិតវិទ្យាថ្នាក់ទី៦ ជាស្លាយក្នុងមួយថ្ងៃ ១០ លំហាត់ ចូលធ្វើលំហាត់រៀងរាល់ម៉ោង ៧:០០ ល្ងាច
              រៀងរាល់ថ្ងៃ ដោយមានជូននូវរង្វាន់លើកទឹកចិត្ត និងបណ្ណសរសើរ។
            </p>
          </div>

          <div className="text-xs font-mono text-slate-600">
            {agreedToTerms ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-800 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>បានយល់ព្រមរួចរាល់ ({agreedTimestamp})</span>
              </span>
            ) : (
              <span>ស្ថានភាព៖ រង់ចាំការចុចយល់ព្រម</span>
            )}
          </div>
        </div>

        {/* 4 Detailed Study Conditions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {STUDY_CONDITIONS.map((cond) => {
            const isChecked = checkedItems.includes(cond.id);
            return (
              <div
                key={cond.id}
                onClick={() => toggleCondition(cond.id)}
                className={`p-5 rounded-xl border transition-colors cursor-pointer ${
                  isChecked
                    ? 'bg-sky-50/40 border-sky-300'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="mt-1 w-4 h-4 accent-sky-700 rounded cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1">
                      <span>លក្ខខណ្ឌទី {cond.id}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-sky-800">{cond.clauseTag}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{cond.title}</h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {cond.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Student Information & Pledge Submission */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                ឈ្មោះសិស្សានុសិស្ស (សម្រាប់ដាក់លើបណ្ណសរសើរ និងរង្វាន់)
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="បញ្ចូលឈ្មោះសិស្ស..."
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-sky-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                ថ្នាក់ និងសាលារៀន
              </label>
              <input
                type="text"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                placeholder="ឧ. ថ្នាក់ទី ៦ ក · សាលាបឋមសិក្សា..."
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-sky-600"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <ShieldCheck className="w-4 h-4 text-sky-700 shrink-0" />
              <span>
                ខ្ញុំបានអាន និងយល់ព្រមតាមលក្ខខណ្ឌទាំង ៤ ខាងលើ ហើយប្ដេជ្ញាចូលធ្វើលំហាត់ ១០ ស្លាយ រៀងរាល់ម៉ោង ៧:០០ ល្ងាច។
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={!allChecked}
                onClick={() => {
                  onAcceptAllConditions();
                  onStartDailySlides();
                }}
                className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  allChecked
                    ? 'bg-sky-700 text-white hover:bg-sky-800 cursor-pointer'
                    : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {agreedToTerms
                    ? 'បានយល់ព្រមរួចរាល់ · ចូលធ្វើលំហាត់ទាំង ១០ ស្លាយ'
                    : 'ខ្ញុំអាន និងយល់ព្រមតាមលក្ខខណ្ឌទាំងអស់ (+៥០ ពិន្ទុរង្វាន់)'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Telegram 15-Minute Prior Parent Reminder Configuration & Logs */}
      <TelegramParentReminderCard
        studentName={studentName}
        studentClass={studentClass}
        solvedCount={solvedCount}
        totalPoints={totalPoints}
        streakDays={streakDays}
        currentLessonTitle={currentLessonTitle}
      />

      {/* 7:00 PM Daily Schedule & Live Reminder Control */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              កាលវិភាគចូលធ្វើលំហាត់រៀងរាល់ម៉ោង ៧:០០ ល្ងាច (19:00) · រំលឹកមុន ១៥ នាទី (18:45)
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              ការកំណត់ម៉ោងរំលឹកស្វ័យប្រវត្តិមុន ១៥ នាទីទៅអាណាព្យាបាលតាម Telegram និងម៉ោងសិក្សាពិសេស ៧:០០ ល្ងាច (ពិន្ទុគុណនឹង ២)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setReminderEnabled(!reminderEnabled)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                reminderEnabled
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-slate-100 border-slate-300 text-slate-700'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>{reminderEnabled ? 'ម៉ោងរំលឹក ១៨:៤៥ និង ១៩:០០៖ កំពុងបើក' : 'បើកម៉ោងរំលឹក ១៨:៤៥ និង ១៩:០០'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSimulate7PmMode(!simulate7PmMode)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                simulate7PmMode
                  ? 'bg-amber-100 border-amber-400 text-amber-950'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>
                {simulate7PmMode
                  ? 'កំពុងបើកម៉ោងសិក្សា ៧:០០ ល្ងាច (ពិន្ទុ ×2)'
                  : 'សាកល្បងម៉ោង ៧:០០ ល្ងាចឥឡូវនេះ'}
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {daysOfWeek.map((d, index) => (
            <div
              key={d.day}
              className={`p-4 rounded-xl border flex flex-col justify-between ${
                index === 2
                  ? 'bg-sky-50/70 border-sky-300'
                  : index < 2
                  ? 'bg-emerald-50/30 border-emerald-200'
                  : 'bg-slate-50/60 border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold text-slate-900">ថ្ងៃ{d.day}</span>
                  <span className="font-mono">{d.time}</span>
                </div>
                <p className="text-xs text-slate-700 mt-2 font-medium leading-snug">
                  {d.target}
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-200/70 flex items-center gap-1 text-xs font-semibold text-slate-700">
                {index < 2 ? (
                  <CalendarCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                )}
                <span className="truncate">{d.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
