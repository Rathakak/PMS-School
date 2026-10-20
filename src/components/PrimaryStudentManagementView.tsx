import React, { useMemo, useState } from 'react';
import { GRADE_5_LESSONS } from '../data/grade5Curriculum';
import { GRADE_6_LESSONS } from '../data/grade6Curriculum';
import {
  Award,
  BellRing,
  CheckCircle2,
  Download,
  ExternalLink,
  Play,
  Plus,
  Search,
  Send,
  UserPlus,
  Users,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';

export interface PrimaryStudent {
  id: string;
  studentCode: string;
  name: string;
  gender: 'ប្រុស' | 'ស្រី';
  grade: 5 | 6;
  className: string;
  parentName: string;
  parentTelegram: string;
  agreedToTerms: boolean;
  todaySlidesCompleted: number;
  assignedLessonTitle: string;
  streakDays: number;
  totalPoints: number;
  lastActiveTime: string;
  attended7PmToday: boolean;
  rewardsCount: number;
}

interface PrimaryStudentManagementViewProps {
  students: PrimaryStudent[];
  activeStudentId: string;
  onSelectActiveStudent: (student: PrimaryStudent, openTab: 'slides' | 'rewards') => void;
  onAddStudent: (newStudent: {
    name: string;
    gender: 'ប្រុស' | 'ស្រី';
    grade: 5 | 6;
    className: string;
    parentName: string;
    parentTelegram: string;
    agreedToTerms: boolean;
    assignedLessonTitle: string;
  }) => Promise<void>;
  onAssignClassLesson: (grade: 5 | 6, lessonTitle: string) => Promise<void>;
}

type RosterFilter = 'all' | 'grade5' | 'grade6' | 'completed10' | 'pending';

export const PrimaryStudentManagementView: React.FC<PrimaryStudentManagementViewProps> = ({
  students,
  activeStudentId,
  onSelectActiveStudent,
  onAddStudent,
  onAssignClassLesson,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<RosterFilter>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAssignPanel, setShowAssignPanel] = useState(false);

  // Add Student Form State
  const [newName, setNewName] = useState('');
  const [newGender, setNewGender] = useState<'ប្រុស' | 'ស្រី'>('ប្រុស');
  const [newGrade, setNewGrade] = useState<5 | 6>(5);
  const [newClassName, setNewClassName] = useState('ថ្នាក់ទី ៥ ក');
  const [newParentName, setNewParentName] = useState('');
  const [newParentTelegram, setNewParentTelegram] = useState('');
  const [newAgreed, setNewAgreed] = useState(true);

  // Class Assignment State
  const [assignGrade, setAssignGrade] = useState<5 | 6>(5);
  const [assignLessonTitle, setAssignLessonTitle] = useState(
    `${GRADE_5_LESSONS[0].title} (ថ្នាក់ទី៥)`
  );

  // Telegram Dispatch Feedback State
  const [telegramFeedback, setTelegramFeedback] = useState<{
    message: string;
    shareUrl?: string;
  } | null>(null);
  const [sendingTelegramId, setSendingTelegramId] = useState<string | null>(null);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (filter === 'grade5' && s.grade !== 5) return false;
      if (filter === 'grade6' && s.grade !== 6) return false;
      if (filter === 'completed10' && s.todaySlidesCompleted < 10) return false;
      if (filter === 'pending' && s.todaySlidesCompleted >= 10) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchName = s.name.toLowerCase().includes(q);
        const matchCode = s.studentCode.toLowerCase().includes(q);
        const matchParent = s.parentName.toLowerCase().includes(q);
        const matchTg = s.parentTelegram.toLowerCase().includes(q);
        const matchClass = s.className.toLowerCase().includes(q);
        return matchName || matchCode || matchParent || matchTg || matchClass;
      }
      return true;
    });
  }, [students, filter, searchQuery]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = students.length;
    const grade5Count = students.filter((s) => s.grade === 5).length;
    const grade6Count = students.filter((s) => s.grade === 6).length;
    const completedToday = students.filter((s) => s.todaySlidesCompleted >= 10).length;
    const attended7Pm = students.filter((s) => s.attended7PmToday).length;
    const totalClassPoints = students.reduce((acc, s) => acc + s.totalPoints, 0);
    const completionRate = total > 0 ? Math.round((completedToday / total) * 100) : 0;

    return {
      total,
      grade5Count,
      grade6Count,
      completedToday,
      attended7Pm,
      totalClassPoints,
      completionRate,
    };
  }, [students]);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const defaultLesson =
      newGrade === 5
        ? `${GRADE_5_LESSONS[0].title} (ថ្នាក់ទី៥)`
        : `${GRADE_6_LESSONS[0].title} (ថ្នាក់ទី៦)`;

    await onAddStudent({
      name: newName.trim(),
      gender: newGender,
      grade: newGrade,
      className: newClassName.trim() || `ថ្នាក់ទី ${newGrade === 5 ? '៥' : '៦'} ក`,
      parentName: newParentName.trim() || 'អាណាព្យាបាលសិស្ស',
      parentTelegram: newParentTelegram.trim() || '@parent_guardian',
      agreedToTerms: newAgreed,
      assignedLessonTitle: defaultLesson,
    });

    setNewName('');
    setNewParentName('');
    setNewParentTelegram('');
    setShowAddForm(false);
    setTelegramFeedback({
      message: `បានចុះឈ្មោះសិស្សថ្មី «${newName.trim()}» ចូលក្នុងប្រព័ន្ធគ្រប់គ្រងអនុវត្តន៍សិស្សបឋមសិក្សារួចរាល់!`,
    });
  };

  const handleAssignLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAssignClassLesson(assignGrade, assignLessonTitle);
    setShowAssignPanel(false);
    setTelegramFeedback({
      message: `បានដាក់កិច្ចការស្លាយប្រចាំថ្ងៃ «${assignLessonTitle}» សម្រាប់សិស្សថ្នាក់ទី ${assignGrade} ទាំងអស់រួចរាល់!`,
    });
  };

  const handleSendStudentTelegram = async (
    student: PrimaryStudent,
    type: 'pre-15min' | 'completion-report'
  ) => {
    setSendingTelegramId(student.id);
    setTelegramFeedback(null);
    try {
      const res = await fetch('/api/telegram/send-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          parentName: student.parentName,
          recipientChatOrUsername: student.parentTelegram,
          studentName: student.name,
          studentClass: student.className,
          solvedCount: student.todaySlidesCompleted,
          totalPoints: student.totalPoints,
          streakDays: student.streakDays,
          lessonTitle: student.assignedLessonTitle,
        }),
      });
      const data = await res.json();
      if (data.ok && data.log) {
        setTelegramFeedback({
          message: `បានបញ្ជូនសារទៅអាណាព្យាបាលរបស់សិស្ស «${student.name}» (${student.parentTelegram}) រួចរាល់!`,
          shareUrl: data.log.telegramShareUrl,
        });
      }
    } catch {
      setTelegramFeedback({
        message: `បានរៀបចំសារ Telegram សម្រាប់អាណាព្យាបាលរបស់ «${student.name}»។`,
      });
    } finally {
      setSendingTelegramId(null);
    }
  };

  const handleBroadcast645Reminder = async () => {
    setSendingTelegramId('broadcast');
    setTelegramFeedback(null);
    try {
      const res = await fetch('/api/telegram/send-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'class-broadcast',
        }),
      });
      const data = await res.json();
      if (data.ok && data.log) {
        setTelegramFeedback({
          message:
            'បានបញ្ជូនសេចក្ដីជូនដំណឹងរំលឹកមុន ១៥ នាទី (ម៉ោង ៦:៤៥ ល្ងាច) រួមគ្នាទៅកាន់អាណាព្យាបាលសិស្សបឋមសិក្សាទាំងអស់!',
          shareUrl: data.log.telegramShareUrl,
        });
      }
    } catch {
      setTelegramFeedback({
        message: 'បានរៀបចំសារជូនដំណឹងរួមមុន ១៥ នាទីសម្រាប់អាណាព្យាបាលទាំងអស់។',
      });
    } finally {
      setSendingTelegramId(null);
    }
  };

  const handleDownloadCsv = () => {
    const headers = [
      'អត្តលេខសិស្ស',
      'ឈ្មោះសិស្ស',
      'ភេទ',
      'កម្រិតថ្នាក់',
      'ឈ្មោះថ្នាក់',
      'អាណាព្យាបាល',
      'Telegram អាណាព្យាបាល',
      'យល់ព្រមលក្ខខណ្ឌ',
      'ស្លាយសម្រេចថ្ងៃនេះ (/10)',
      'វត្តមានម៉ោង ៧ ល្ងាច',
      'ថ្ងៃសិក្សាជាប់គ្នា (Streak)',
      'ពិន្ទុសរុប',
      'មេរៀនប្រចាំថ្ងៃ',
    ];
    const rows = students.map((s) => [
      s.studentCode,
      `"${s.name}"`,
      s.gender,
      s.grade,
      `"${s.className}"`,
      `"${s.parentName}"`,
      s.parentTelegram,
      s.agreedToTerms ? 'យល់ព្រម' : 'រង់ចាំ',
      `${s.todaySlidesCompleted}/10`,
      s.attended7PmToday ? 'មានវត្តមាន' : 'អវត្តមាន',
      s.streakDays,
      s.totalPoints,
      `"${s.assignedLessonTitle}"`,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'primary_school_math_practice_report.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header & Primary Management Actions */}
      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div className="text-xs font-semibold text-sky-800">
              ប្រព័ន្ធគ្រប់គ្រងអនុវត្តន៍សិស្សបឋមសិក្សា · ថ្នាក់ទី ៥ និងថ្នាក់ទី ៦ · វិន័យម៉ោង ៧:០០ ល្ងាច
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              ប្រព័ន្ធគ្រប់គ្រងការអនុវត្តលំហាត់ស្លាយរបស់សិស្សបឋមសិក្សា
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              តាមដានវត្តមានសិស្សចូលធ្វើលំហាត់គណិតវិទ្យា ១០ ស្លាយក្នុងមួយថ្ងៃ រៀងរាល់ម៉ោង ៧:០០ ល្ងាច
              ការផ្ញើសាររំលឹកមុន ១៥ នាទី (ម៉ោង ៦:៤៥ ល្ងាច) ទៅអាណាព្យាបាលតាម Telegram និងការប្រគល់រង្វាន់លើកទឹកចិត្ត។
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setShowAddForm((prev) => !prev);
                setShowAssignPanel(false);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>ចុះឈ្មោះសិស្សថ្មី</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowAssignPanel((prev) => !prev);
                setShowAddForm(false);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-sky-700" />
              <span>ដាក់កិច្ចការ ១០ ស្លាយប្រចាំថ្នាក់</span>
            </button>

            <button
              type="button"
              disabled={sendingTelegramId === 'broadcast'}
              onClick={handleBroadcast645Reminder}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <BellRing className="w-4 h-4 text-amber-800" />
              <span>រំលឹក Telegram អាណាព្យាបាលទាំងអស់ (18:45)</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>ទាញយក CSV</span>
            </button>
          </div>
        </div>

        {/* 4-Column KPI Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-xs text-slate-500">សិស្សបឋមសិក្សាសរុបក្នុងប្រព័ន្ធ</div>
            <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-slate-900">
              {metrics.total} នាក់
            </div>
            <div className="mt-1 text-xs text-slate-600">
              ថ្នាក់ទី ៥ ចំនួន {metrics.grade5Count} នាក់ · ថ្នាក់ទី ៦ ចំនួន {metrics.grade6Count} នាក់
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-xs text-slate-500">បញ្ចប់គ្រប់ ១០ ស្លាយថ្ងៃនេះ</div>
            <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-emerald-700">
              {metrics.completedToday} / {metrics.total} នាក់ ({metrics.completionRate}%)
            </div>
            <div className="mt-1 text-xs text-slate-600">
              គោលដៅ៖ ១០ លំហាត់ជាស្លាយក្នុងមួយថ្ងៃ
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-xs text-slate-500">វត្តមានចូលរៀនម៉ោង ៧:០០ ល្ងាច</div>
            <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-sky-700">
              {metrics.attended7Pm} / {metrics.total} នាក់
            </div>
            <div className="mt-1 text-xs text-slate-600">
              រំលឹកអាណាព្យាបាលមុន ១៥ នាទី (ម៉ោង ៦:៤៥ ល្ងាច)
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-xs text-slate-500">ពិន្ទុលើកទឹកចិត្តសរុបរបស់សិស្ស</div>
            <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-amber-700">
              {metrics.totalClassPoints} ពិន្ទុ
            </div>
            <div className="mt-1 text-xs text-slate-600">
              សម្រាប់ប្ដូរមេដាយ បណ្ណសរសើរ និងរង្វាន់លើកទឹកចិត្ត
            </div>
          </div>
        </div>

        {/* Telegram / Action Feedback Banner */}
        {telegramFeedback && (
          <div className="mt-5 p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-emerald-950">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{telegramFeedback.message}</span>
            </div>
            <div className="flex items-center gap-2">
              {telegramFeedback.shareUrl && (
                <a
                  href={telegramFeedback.shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-md whitespace-nowrap shrink-0"
                >
                  <span>បើកផ្ញើក្នុង Telegram ផ្ទាល់</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              <button
                type="button"
                onClick={() => setTelegramFeedback(null)}
                className="px-2.5 py-1 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 rounded-md cursor-pointer"
              >
                បិទ
              </button>
            </div>
          </div>
        )}

        {/* Collapsible Add Student Form */}
        {showAddForm && (
          <form
            onSubmit={handleCreateStudent}
            className="mt-5 p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-sm font-bold text-slate-900">
                ចុះឈ្មោះសិស្សបឋមសិក្សាថ្មី ចូលក្នុងប្រព័ន្ធអនុវត្តលំហាត់ ១០ ស្លាយ/ថ្ងៃ
              </h2>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                បោះបង់
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ឈ្មោះសិស្សានុសិស្ស *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="ឧ. ម៉ៅ សុខលីន"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-sky-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ភេទ និងកម្រិតថ្នាក់បឋមសិក្សា
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as 'ប្រុស' | 'ស្រី')}
                    className="px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-sky-600"
                  >
                    <option value="ប្រុស">ប្រុស</option>
                    <option value="ស្រី">ស្រី</option>
                  </select>
                  <select
                    value={newGrade}
                    onChange={(e) => {
                      const g = Number(e.target.value) as 5 | 6;
                      setNewGrade(g);
                      setNewClassName(`ថ្នាក់ទី ${g === 5 ? '៥' : '៦'} ក`);
                    }}
                    className="flex-1 px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-sky-600"
                  >
                    <option value={5}>ថ្នាក់ទី ៥ (១៨ មេរៀន)</option>
                    <option value={6}>ថ្នាក់ទី ៦ (២០ មេរៀន)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ឈ្មោះបន្ទប់រៀន
                </label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="ឧ. ថ្នាក់ទី ៥ ក"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-sky-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ឈ្មោះអាណាព្យាបាល / មាតាបិតា
                </label>
                <input
                  type="text"
                  value={newParentName}
                  onChange={(e) => setNewParentName(e.target.value)}
                  placeholder="ឧ. លោកពូ ម៉ៅ សុផល"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-sky-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Telegram អាណាព្យាបាល (សម្រាប់រំលឹកមុន ១៥ នាទី)
                </label>
                <input
                  type="text"
                  value={newParentTelegram}
                  onChange={(e) => setNewParentTelegram(e.target.value)}
                  placeholder="ឧ. @mao_sophal_kh ឬ Chat ID"
                  className="w-full px-3.5 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-sky-600"
                />
              </div>

              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAgreed}
                    onChange={(e) => setNewAgreed(e.target.checked)}
                    className="w-4 h-4 accent-sky-700 rounded cursor-pointer"
                  />
                  <span className="font-medium">
                    បានអាន និងយល់ព្រមតាមលក្ខខណ្ឌសិក្សា (+50 ពិន្ទុដំបូង)
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>រក្សាទុក និងចុះឈ្មោះសិស្ស</span>
              </button>
            </div>
          </form>
        )}

        {/* Collapsible Assign Daily 10-Slide Lesson Panel */}
        {showAssignPanel && (
          <form
            onSubmit={handleAssignLessonSubmit}
            className="mt-5 p-5 bg-sky-50/50 border border-sky-200 rounded-xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-sky-200 pb-3">
              <h2 className="text-sm font-bold text-slate-900">
                កំណត់មេរៀនស្លាយ ១០ លំហាត់ប្រចាំថ្ងៃ សម្រាប់សិស្សទាំងអស់ក្នុងថ្នាក់
              </h2>
              <button
                type="button"
                onClick={() => setShowAssignPanel(false)}
                className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                បោះបង់
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ជ្រើសរើសកម្រិតថ្នាក់បឋមសិក្សា
                </label>
                <select
                  value={assignGrade}
                  onChange={(e) => {
                    const g = Number(e.target.value) as 5 | 6;
                    setAssignGrade(g);
                    const first =
                      g === 5
                        ? `${GRADE_5_LESSONS[0].title} (ថ្នាក់ទី៥)`
                        : `${GRADE_6_LESSONS[0].title} (ថ្នាក់ទី៦)`;
                    setAssignLessonTitle(first);
                  }}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-sky-600"
                >
                  <option value={5}>ថ្នាក់ទី ៥ ទាំងអស់</option>
                  <option value={6}>ថ្នាក់ទី ៦ ទាំងអស់</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ជ្រើសរើសមេរៀនពីសៀវភៅពុម្ព (១០ ស្លាយ/ថ្ងៃ)
                </label>
                <select
                  value={assignLessonTitle}
                  onChange={(e) => setAssignLessonTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-sky-600"
                >
                  {(assignGrade === 5 ? GRADE_5_LESSONS : GRADE_6_LESSONS).map((l) => {
                    const label = `${l.title} (ថ្នាក់ទី${assignGrade === 5 ? '៥' : '៦'})`;
                    return (
                      <option key={l.id} value={label}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  ដាក់កិច្ចការស្លាយសម្រាប់ថ្នាក់ទី {assignGrade}
                </button>
              </div>
            </div>
          </form>
        )}
      </section>

      {/* High-Density Student Roster & Daily Practice Table */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {[
              { id: 'all', label: `សិស្សទាំងអស់ (${students.length})` },
              { id: 'grade5', label: `ថ្នាក់ទី ៥ (${metrics.grade5Count})` },
              { id: 'grade6', label: `ថ្នាក់ទី ៦ (${metrics.grade6Count})` },
              { id: 'completed10', label: `គ្រប់ ១០ ស្លាយ (${metrics.completedToday})` },
              {
                id: 'pending',
                label: `មិនទាន់គ្រប់ ១០ ស្លាយ (${students.length - metrics.completedToday})`,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id as RosterFilter)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filter === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ស្វែងរកឈ្មោះសិស្ស អត្តលេខ ឬ Telegram..."
              className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:bg-white focus:border-sky-600"
            />
          </div>
        </div>

        {/* Data Table */}
        {filteredStudents.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <Users className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="text-sm font-semibold text-slate-800">
              មិនមានទិន្នន័យសិស្សត្រូវតាមការស្វែងរកនេះទេ
            </div>
            <p className="text-xs text-slate-500">
              សូមផ្លាស់ប្ដូរពាក្យស្វែងរក ឬចុចប៊ូតុង «ចុះឈ្មោះសិស្សថ្មី» ដើម្បីបន្ថែមសិស្សបឋមសិក្សា។
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                  <th className="py-3 px-3">អត្តលេខ · ឈ្មោះសិស្ស</th>
                  <th className="py-3 px-3">ថ្នាក់រៀន</th>
                  <th className="py-3 px-3">អាណាព្យាបាល · Telegram (18:45)</th>
                  <th className="py-3 px-3">មេរៀនស្លាយប្រចាំថ្ងៃ</th>
                  <th className="py-3 px-3 text-right">លទ្ធផលថ្ងៃនេះ</th>
                  <th className="py-3 px-3 text-right">វិន័យម៉ោង ៧យប់</th>
                  <th className="py-3 px-3 text-right">ពិន្ទុសរុប</th>
                  <th className="py-3 px-3 text-right">សកម្មភាពគ្រប់គ្រង</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {filteredStudents.map((stu) => {
                  const isCurrentActive = stu.id === activeStudentId;
                  const isDone10 = stu.todaySlidesCompleted >= 10;

                  return (
                    <tr
                      key={stu.id}
                      className={`transition-colors ${
                        isCurrentActive ? 'bg-sky-50/50' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-slate-500">
                            {stu.studentCode}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-bold text-slate-900 text-sm">
                            {stu.name}
                          </span>
                        </div>
                        <div className="text-slate-500 mt-0.5">
                          ភេទ៖ {stu.gender} ·{' '}
                          {stu.agreedToTerms ? (
                            <span className="text-emerald-800 font-medium">
                              ✓ យល់ព្រមលក្ខខណ្ឌ
                            </span>
                          ) : (
                            <span className="text-amber-800 font-medium">
                              ▲ រង់ចាំការយល់ព្រម
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">{stu.className}</div>
                        <div className="text-slate-500">បឋមសិក្សា ថ្នាក់ទី {stu.grade}</div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-medium text-slate-900">{stu.parentName}</div>
                        <div className="font-mono text-sky-800">{stu.parentTelegram}</div>
                      </td>

                      <td className="py-3.5 px-3 max-w-[230px]">
                        <div className="font-medium text-slate-800 truncate" title={stu.assignedLessonTitle}>
                          {stu.assignedLessonTitle}
                        </div>
                        <div className="text-slate-500 font-mono mt-0.5">
                          សកម្មចុងក្រោយ៖ {stu.lastActiveTime}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5 font-bold">
                          {isDone10 ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                          ) : stu.todaySlidesCompleted > 0 ? (
                            <span className="text-sky-700">●</span>
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          )}
                          <span
                            className={
                              isDone10
                                ? 'text-emerald-800'
                                : stu.todaySlidesCompleted > 0
                                ? 'text-sky-900'
                                : 'text-amber-800'
                            }
                          >
                            {stu.todaySlidesCompleted} / 10 ស្លាយ
                          </span>
                        </div>
                        <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden ml-auto mt-1">
                          <div
                            className={`h-full ${
                              isDone10 ? 'bg-emerald-600' : 'bg-sky-600'
                            }`}
                            style={{ width: `${(stu.todaySlidesCompleted / 10) * 100}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                        <div className="font-bold text-slate-900">{stu.streakDays} ថ្ងៃជាប់គ្នា</div>
                        <div className="text-slate-500">
                          {stu.attended7PmToday ? '✓ វត្តមានម៉ោង ៧យប់' : 'មិនទាន់ចូលម៉ោង ៧យប់'}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                        <div className="text-sm font-bold text-slate-900">
                          {stu.totalPoints} pts
                        </div>
                        <div className="text-amber-800">{stu.rewardsCount} រង្វាន់</div>
                      </td>

                      <td className="py-3.5 px-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onSelectActiveStudent(stu, 'slides')}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-md transition-colors cursor-pointer"
                            title="ចូលធ្វើលំហាត់ ១០ ស្លាយក្នុងនាមសិស្សនេះ"
                          >
                            <Play className="w-3 h-3" />
                            <span>ធ្វើលំហាត់</span>
                          </button>

                          <button
                            type="button"
                            disabled={sendingTelegramId === stu.id}
                            onClick={() =>
                              handleSendStudentTelegram(
                                stu,
                                isDone10 ? 'completion-report' : 'pre-15min'
                              )
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                            title="ផ្ញើសាររំលឹកមុន ១៥ នាទី ឬរបាយការណ៍លទ្ធផលទៅ Telegram អាណាព្យាបាល"
                          >
                            <Send className="w-3 h-3 text-sky-700" />
                            <span>Telegram</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onSelectActiveStudent(stu, 'rewards')}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-amber-900 bg-amber-100/80 hover:bg-amber-200/80 rounded-md transition-colors cursor-pointer"
                            title="បើកមើលរង្វាន់ និងបោះពុម្ពបណ្ណសរសើររបស់សិស្ស"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>បណ្ណសរសើរ</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
