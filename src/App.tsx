import React, { useEffect, useMemo, useState } from 'react';
import {
  GRADE_6_LESSONS,
  MotivationalReward,
  SIGNATURE_DAILY_10_SLIDES,
  getTenSlideDeckForLesson,
} from './data/grade6Curriculum';
import { GRADE_5_LESSONS, getGrade5TenSlideDeck } from './data/grade5Curriculum';
import { buildLesson10Slides } from './data/lessonExerciseBank';
import { MathSlideDiagram } from './components/MathSlideDiagram';
import { TermsAndScheduleView } from './components/TermsAndScheduleView';
import { RewardsAndCertificateView } from './components/RewardsAndCertificateView';
import { CurriculumAndPdfView } from './components/CurriculumAndPdfView';
import { TelegramParentReminderCard } from './components/TelegramParentReminderCard';
import { StudentCompletionAiAgentCard } from './components/StudentCompletionAiAgentCard';
import {
  PrimaryStudentManagementView,
  PrimaryStudent,
} from './components/PrimaryStudentManagementView';
import {
  Award,
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Gift,
  HelpCircle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  Users,
} from 'lucide-react';

type ActiveTab = 'management' | 'slides' | 'terms' | 'rewards' | 'curriculum';

interface SlideAnswerState {
  selectedOptionIndex: number | null;
  directInputText: string;
  isSubmitted: boolean;
  isCorrect: boolean;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('management');
  const [selectedGrade, setSelectedGrade] = useState<5 | 6>(5);
  const [selectedLessonPack, setSelectedLessonPack] = useState<number>(0);
  const [dailyDayNumber, setDailyDayNumber] = useState<number>(1);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  // Primary School Student Roster State
  const [studentsRoster, setStudentsRoster] = useState<PrimaryStudent[]>([
    {
      id: 'stu-1',
      studentCode: 'PS-501',
      name: 'សុខ សុវណ្ណារ៉ា',
      gender: 'ប្រុស',
      grade: 5,
      className: 'ថ្នាក់ទី ៥ ក',
      parentName: 'លោកពូ សុខ ចាន់ថន',
      parentTelegram: '@sok_chanthon_kh',
      agreedToTerms: true,
      todaySlidesCompleted: 10,
      assignedLessonTitle: 'មេរៀនទី ១ : ចំនួន និងមធ្យមនព្វន្ត (ថ្នាក់ទី៥)',
      streakDays: 7,
      totalPoints: 420,
      lastActiveTime: 'ថ្ងៃនេះ · 19:05',
      attended7PmToday: true,
      rewardsCount: 3,
    },
    {
      id: 'stu-2',
      studentCode: 'PS-502',
      name: 'ចាន់ ដានី',
      gender: 'ស្រី',
      grade: 5,
      className: 'ថ្នាក់ទី ៥ ក',
      parentName: 'អ្នកមីង ចាន់ សុភា',
      parentTelegram: '@chan_sophea_parent',
      agreedToTerms: true,
      todaySlidesCompleted: 8,
      assignedLessonTitle: 'មេរៀនទី ៥ : ផលធៀប និងភាគរយ (ថ្នាក់ទី៥)',
      streakDays: 5,
      totalPoints: 310,
      lastActiveTime: 'ថ្ងៃនេះ · 19:12',
      attended7PmToday: true,
      rewardsCount: 2,
    },
    {
      id: 'stu-3',
      studentCode: 'PS-503',
      name: 'លី បូណា',
      gender: 'ប្រុស',
      grade: 5,
      className: 'ថ្នាក់ទី ៥ ខ',
      parentName: 'លោកពូ លី វណ្ណៈ',
      parentTelegram: '@ly_vannak_kh',
      agreedToTerms: true,
      todaySlidesCompleted: 4,
      assignedLessonTitle: 'មេរៀនទី ១២ : រូបិយវត្ថុ និងអត្រាប្ដូរប្រាក់ (ថ្នាក់ទី៥)',
      streakDays: 2,
      totalPoints: 160,
      lastActiveTime: 'ថ្ងៃនេះ · 18:50',
      attended7PmToday: false,
      rewardsCount: 1,
    },
    {
      id: 'stu-4',
      studentCode: 'PS-601',
      name: 'ជា សុជាតា',
      gender: 'ស្រី',
      grade: 6,
      className: 'ថ្នាក់ទី ៦ ក',
      parentName: 'អ្នកមីង ជា ម៉ារី',
      parentTelegram: '@chea_mary_parent',
      agreedToTerms: true,
      todaySlidesCompleted: 10,
      assignedLessonTitle: 'មេរៀនទី ៧ : ផ្ទៃក្រឡាចតុកោណព្នាយ (ថ្នាក់ទី៦)',
      streakDays: 9,
      totalPoints: 580,
      lastActiveTime: 'ថ្ងៃនេះ · 19:02',
      attended7PmToday: true,
      rewardsCount: 4,
    },
    {
      id: 'stu-5',
      studentCode: 'PS-602',
      name: 'ហេង វិបុល',
      gender: 'ប្រុស',
      grade: 6,
      className: 'ថ្នាក់ទី ៦ ក',
      parentName: 'លោកពូ ហេង សម្បត្តិ',
      parentTelegram: '@heng_sambath_kh',
      agreedToTerms: true,
      todaySlidesCompleted: 6,
      assignedLessonTitle: 'មេរៀនទី ១៤ : ល្បឿន និងចលនា (ថ្នាក់ទី៦)',
      streakDays: 4,
      totalPoints: 270,
      lastActiveTime: 'ថ្ងៃនេះ · 19:18',
      attended7PmToday: true,
      rewardsCount: 2,
    },
    {
      id: 'stu-6',
      studentCode: 'PS-603',
      name: 'កែវ រស្មី',
      gender: 'ស្រី',
      grade: 6,
      className: 'ថ្នាក់ទី ៦ ខ',
      parentName: 'អ្នកមីង កែវ សុខុម',
      parentTelegram: '@keo_sokhom_parent',
      agreedToTerms: false,
      todaySlidesCompleted: 0,
      assignedLessonTitle: 'មេរៀនទី ២០ : មាឌ និងផ្ទៃក្រឡាសូលីត (ថ្នាក់ទី៦)',
      streakDays: 1,
      totalPoints: 90,
      lastActiveTime: 'ម្សិលមិញ · 19:30',
      attended7PmToday: false,
      rewardsCount: 1,
    },
  ]);
  const [activeStudentId, setActiveStudentId] = useState<string>('stu-1');

  // Student Profile & Agreement State
  const [studentName, setStudentName] = useState<string>(() => {
    return localStorage.getItem('g6_student_name') || 'សុខ សុវណ្ណារ៉ា';
  });
  const [studentClass, setStudentClass] = useState<string>(() => {
    return localStorage.getItem('g6_student_class') || 'ថ្នាក់ទី ៥ ក';
  });
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(() => {
    return localStorage.getItem('g6_agreed_terms') !== 'false';
  });
  const [agreedTimestamp, setAgreedTimestamp] = useState<string | null>(() => {
    return localStorage.getItem('g6_agreed_time') || '18:45';
  });

  // Points, Streak & Rewards State
  const [totalPoints, setTotalPoints] = useState<number>(() => {
    const saved = localStorage.getItem('g6_total_points');
    return saved ? Number(saved) : 120;
  });
  const [streakDays, setStreakDays] = useState<number>(() => {
    const saved = localStorage.getItem('g6_streak_days');
    return saved ? Number(saved) : 3;
  });
  const [completedDecksCount, setCompletedDecksCount] = useState<number>(() => {
    const saved = localStorage.getItem('g6_completed_decks');
    return saved ? Number(saved) : 1;
  });
  const [claimedRewardIds, setClaimedRewardIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('g6_claimed_rewards');
    return saved ? JSON.parse(saved) : [];
  });
  const [dailyChestClaimedForPack, setDailyChestClaimedForPack] = useState<Record<number, boolean>>({});

  // 7:00 PM Daily Routine & Clock State
  const [now, setNow] = useState<Date>(() => new Date());
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(true);
  const [simulate7PmMode, setSimulate7PmMode] = useState<boolean>(false);

  // Slide Interaction State
  const [answerStates, setAnswerStates] = useState<Record<string, SlideAnswerState>>({});
  const [answerMode, setAnswerMode] = useState<'multiple-choice' | 'direct-input'>('multiple-choice');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [scratchpadText, setScratchpadText] = useState<string>('');
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('g6_student_name', studentName);
    localStorage.setItem('g6_student_class', studentClass);
    localStorage.setItem('g6_agreed_terms', String(agreedToTerms));
    if (agreedTimestamp) localStorage.setItem('g6_agreed_time', agreedTimestamp);
    localStorage.setItem('g6_total_points', String(totalPoints));
    localStorage.setItem('g6_streak_days', String(streakDays));
    localStorage.setItem('g6_completed_decks', String(completedDecksCount));
    localStorage.setItem('g6_claimed_rewards', JSON.stringify(claimedRewardIds));
  }, [
    studentName,
    studentClass,
    agreedToTerms,
    agreedTimestamp,
    totalPoints,
    streakDays,
    completedDecksCount,
    claimedRewardIds,
  ]);

  // Build the active 10-slide exercise deck for Grade 5 or Grade 6
  const currentSlides = useMemo(() => {
    if (selectedGrade === 5) {
      return getGrade5TenSlideDeck(selectedLessonPack, dailyDayNumber - 1);
    }
    if (selectedLessonPack === 0) {
      const rotated = [...SIGNATURE_DAILY_10_SLIDES];
      const offset = ((dailyDayNumber - 1) * 2) % rotated.length;
      return [...rotated.slice(offset), ...rotated.slice(0, offset)].map((s, i) => ({
        ...s,
        id: `g6-daily-${dailyDayNumber}-s${i + 1}`,
        slideNumber: i + 1,
      }));
    }
    if (selectedLessonPack === 1) {
      return getTenSlideDeckForLesson(1);
    }
    return buildLesson10Slides(selectedLessonPack, SIGNATURE_DAILY_10_SLIDES);
  }, [selectedGrade, selectedLessonPack, dailyDayNumber]);

  const activeLessonsList = selectedGrade === 5 ? GRADE_5_LESSONS : GRADE_6_LESSONS;

  const activeSlide = currentSlides[currentSlideIndex] || currentSlides[0];
  const currentAnswerState: SlideAnswerState = answerStates[activeSlide.id] || {
    selectedOptionIndex: null,
    directInputText: '',
    isSubmitted: false,
    isCorrect: false,
  };

  // Check if current hour is 7:00 PM (19:00–19:59) or simulated 7:00 PM mode
  const isEvening7PmWindow = now.getHours() === 19 || simulate7PmMode;

  // Compute time remaining until next 19:00 (7:00 PM)
  const countdownTo7Pm = useMemo(() => {
    if (isEvening7PmWindow) {
      return 'កំពុងស្ថិតក្នុងម៉ោងសិក្សា ៧:០០ ល្ងាច (ពិន្ទុគុណនឹង ២)';
    }
    const target = new Date(now);
    target.setHours(19, 0, 0, 0);
    if (now >= target) {
      target.setDate(target.getDate() + 1);
    }
    const diffSec = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
    const h = Math.floor(diffSec / 3600);
    const m = Math.floor((diffSec % 3600) / 60);
    const s = diffSec % 60;
    return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}mn ${String(s).padStart(2, '0')}s`;
  }, [now, isEvening7PmWindow]);

  const solvedCountInDeck = useMemo(() => {
    return currentSlides.filter((s) => answerStates[s.id]?.isCorrect).length;
  }, [currentSlides, answerStates]);

  // Load initial roster from backend
  useEffect(() => {
    fetch('/api/students')
      .then((r) => r.json())
      .then((data) => {
        if (data && Array.isArray(data.students) && data.students.length > 0) {
          setStudentsRoster(data.students);
        }
      })
      .catch(() => {});
  }, []);

  // Sync active student progress back to the management roster
  useEffect(() => {
    setStudentsRoster((prev) =>
      prev.map((stu) => {
        if (stu.id === activeStudentId || stu.name === studentName) {
          return {
            ...stu,
            name: studentName,
            className: studentClass,
            grade: selectedGrade,
            agreedToTerms,
            todaySlidesCompleted: Math.max(stu.todaySlidesCompleted, solvedCountInDeck),
            totalPoints,
            streakDays,
            rewardsCount: Math.max(stu.rewardsCount, claimedRewardIds.length),
          };
        }
        return stu;
      })
    );

    fetch('/api/students/update-progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: activeStudentId,
        studentName,
        todaySlidesCompleted: solvedCountInDeck,
        totalPoints,
        streakDays,
        agreedToTerms,
        rewardsCount: claimedRewardIds.length,
      }),
    }).catch(() => {});
  }, [
    activeStudentId,
    studentName,
    studentClass,
    selectedGrade,
    agreedToTerms,
    solvedCountInDeck,
    totalPoints,
    streakDays,
    claimedRewardIds.length,
  ]);

  const handleSelectActiveStudent = (stu: PrimaryStudent, targetTab: 'slides' | 'rewards') => {
    setActiveStudentId(stu.id);
    setStudentName(stu.name);
    setStudentClass(stu.className);
    setSelectedGrade(stu.grade);
    setAgreedToTerms(stu.agreedToTerms);
    setTotalPoints(stu.totalPoints);
    setStreakDays(stu.streakDays);
    setActiveTab(targetTab);
    setBannerMessage(
      `បានប្ដូរទៅគណនីសិស្ស៖ «${stu.name}» (${stu.className} · អត្តលេខ ${stu.studentCode})`
    );
  };

  const handleAddStudentToRoster = async (newStuData: {
    name: string;
    gender: 'ប្រុស' | 'ស្រី';
    grade: 5 | 6;
    className: string;
    parentName: string;
    parentTelegram: string;
    agreedToTerms: boolean;
    assignedLessonTitle: string;
  }) => {
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStuData),
      });
      const data = await res.json();
      if (data.ok && Array.isArray(data.students)) {
        setStudentsRoster(data.students);
        return;
      }
    } catch {
      // Fallback local addition
    }
    const created: PrimaryStudent = {
      id: `stu-${Date.now()}`,
      studentCode: `PS-${newStuData.grade}0${studentsRoster.length + 1}`,
      name: newStuData.name,
      gender: newStuData.gender,
      grade: newStuData.grade,
      className: newStuData.className,
      parentName: newStuData.parentName,
      parentTelegram: newStuData.parentTelegram,
      agreedToTerms: newStuData.agreedToTerms,
      todaySlidesCompleted: 0,
      assignedLessonTitle: newStuData.assignedLessonTitle,
      streakDays: 1,
      totalPoints: newStuData.agreedToTerms ? 50 : 0,
      lastActiveTime: 'ទើបចុះឈ្មោះ',
      attended7PmToday: false,
      rewardsCount: newStuData.agreedToTerms ? 1 : 0,
    };
    setStudentsRoster((prev) => [created, ...prev]);
  };

  const handleAssignClassLesson = async (grade: 5 | 6, lessonTitle: string) => {
    setStudentsRoster((prev) =>
      prev.map((s) => (s.grade === grade ? { ...s, assignedLessonTitle: lessonTitle } : s))
    );
    try {
      await fetch('/api/students/assign-class-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade, lessonTitle }),
      });
    } catch {
      // Handled locally
    }
  };

  const handleAcceptAllConditions = () => {
    if (!agreedToTerms) {
      const timeStr = new Date().toLocaleTimeString('km-KH', {
        hour: '2-digit',
        minute: '2-digit',
      });
      setAgreedToTerms(true);
      setAgreedTimestamp(timeStr);
      setTotalPoints((prev) => prev + 50);
      if (!claimedRewardIds.includes('reward-pledge')) {
        setClaimedRewardIds((prev) => [...prev, 'reward-pledge']);
      }
      setBannerMessage(
        'អបអរសាទរ! អ្នកបានអាន និងយល់ព្រមតាមលក្ខខណ្ឌទាំងអស់ ហើយទទួលបាន +50 ពិន្ទុលើកទឹកចិត្ត និងមេដាយសន្យាសិក្សាម៉ោង ៧ ល្ងាច!'
      );
    }
  };

  const handleSelectOption = (idx: number) => {
    if (currentAnswerState.isCorrect) return;
    setAnswerStates((prev) => ({
      ...prev,
      [activeSlide.id]: {
        ...currentAnswerState,
        selectedOptionIndex: idx,
        isSubmitted: false,
      },
    }));
  };

  const handleDirectInputChange = (val: string) => {
    if (currentAnswerState.isCorrect) return;
    setAnswerStates((prev) => ({
      ...prev,
      [activeSlide.id]: {
        ...currentAnswerState,
        directInputText: val,
        isSubmitted: false,
      },
    }));
  };

  const handleVerifyAnswer = () => {
    if (currentAnswerState.isCorrect) return;

    let isCorrect = false;
    if (answerMode === 'multiple-choice') {
      if (currentAnswerState.selectedOptionIndex === null) return;
      isCorrect = currentAnswerState.selectedOptionIndex === activeSlide.correctIndex;
    } else {
      const normalized = currentAnswerState.directInputText.trim().toLowerCase();
      if (!normalized) return;
      isCorrect = activeSlide.directAnswerKey.some(
        (k) => k.trim().toLowerCase() === normalized
      );
    }

    const earnedPoints = isCorrect
      ? isEvening7PmWindow
        ? activeSlide.points * 2
        : activeSlide.points
      : 0;

    if (isCorrect) {
      setTotalPoints((prev) => prev + earnedPoints);
    }

    setAnswerStates((prev) => ({
      ...prev,
      [activeSlide.id]: {
        ...currentAnswerState,
        isSubmitted: true,
        isCorrect,
      },
    }));
  };

  const handleResetCurrentSlide = () => {
    setAnswerStates((prev) => ({
      ...prev,
      [activeSlide.id]: {
        selectedOptionIndex: null,
        directInputText: '',
        isSubmitted: false,
        isCorrect: false,
      },
    }));
    setShowHint(false);
  };

  const handleClaimDaily10SlideChest = () => {
    if (dailyChestClaimedForPack[selectedLessonPack]) return;
    setDailyChestClaimedForPack((prev) => ({ ...prev, [selectedLessonPack]: true }));
    setTotalPoints((prev) => prev + 100);
    setStreakDays((prev) => prev + 1);
    setCompletedDecksCount((prev) => prev + 1);
    setBannerMessage(
      'អបអរសាទរ! អ្នកបានបញ្ចប់លំហាត់ទាំង ១០ ស្លាយប្រចាំថ្ងៃ ហើយទទួលបានរង្វាន់លើកទឹកចិត្ត +100 ពិន្ទុ និងបង្កើនថ្ងៃសិក្សាជាប់គ្នា!'
    );
  };

  const handleClaimReward = (reward: MotivationalReward) => {
    if (claimedRewardIds.includes(reward.id)) return;
    setClaimedRewardIds((prev) => [...prev, reward.id]);
    setBannerMessage(`បានបើកទទួលរង្វាន់លើកទឹកចិត្ត៖ «${reward.title}» ដោយជោគជ័យ!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      {/* Mandatory 3-Zone Top Bar Contract */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 no-print">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
          {/* Zone 1: Single text element Brand wordmark */}
          <a
            href="#management"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('management');
            }}
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            ប្រព័ន្ធអនុវត្តន៍បឋមសិក្សា
          </a>

          {/* Zone 2: 5 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a
              href="#management"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('management');
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'management'
                  ? 'text-slate-900 border-b-2 border-slate-900 font-semibold'
                  : ''
              }`}
            >
              គ្រប់គ្រងសិស្សបឋម
            </a>
            <a
              href="#slides"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('slides');
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'slides'
                  ? 'text-slate-900 border-b-2 border-slate-900 font-semibold'
                  : ''
              }`}
            >
              ស្លាយលំហាត់ ១០/ថ្ងៃ
            </a>
            <a
              href="#terms"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('terms');
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'terms'
                  ? 'text-slate-900 border-b-2 border-slate-900 font-semibold'
                  : ''
              }`}
            >
              លក្ខខណ្ឌ និងម៉ោង ៧យប់
            </a>
            <a
              href="#rewards"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('rewards');
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'rewards'
                  ? 'text-slate-900 border-b-2 border-slate-900 font-semibold'
                  : ''
              }`}
            >
              រង្វាន់លើកទឹកចិត្ត
            </a>
            <a
              href="#curriculum"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('curriculum');
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'curriculum'
                  ? 'text-slate-900 border-b-2 border-slate-900 font-semibold'
                  : ''
              }`}
            >
              សៀវភៅថ្នាក់ទី ៥-៦
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                setSimulate7PmMode(true);
                setActiveTab('slides');
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              ចូលធ្វើលំហាត់ម៉ោង ៧ ល្ងាច
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Tab Switcher (visible only on small screens) */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto no-print">
        <button
          type="button"
          onClick={() => setActiveTab('management')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'management' ? 'bg-slate-900 text-white' : 'text-slate-600'
          }`}
        >
          គ្រប់គ្រងសិស្សបឋម
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('slides')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'slides' ? 'bg-slate-900 text-white' : 'text-slate-600'
          }`}
        >
          ស្លាយលំហាត់ ១០/ថ្ងៃ
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('terms')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'terms' ? 'bg-slate-900 text-white' : 'text-slate-600'
          }`}
        >
          លក្ខខណ្ឌ និងម៉ោង ៧យប់
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('rewards')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'rewards' ? 'bg-slate-900 text-white' : 'text-slate-600'
          }`}
        >
          រង្វាន់លើកទឹកចិត្ត
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('curriculum')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'curriculum' ? 'bg-slate-900 text-white' : 'text-slate-600'
          }`}
        >
          សៀវភៅថ្នាក់ទី ៥-៦
        </button>
      </div>

      {/* Main Content Container (1440px max width) */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6">
        {/* Optional Feedback Notification Banner */}
        {bannerMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between gap-4 no-print">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-emerald-950">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>{bannerMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setBannerMessage(null)}
              className="px-2.5 py-1 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 rounded-md whitespace-nowrap shrink-0 cursor-pointer"
            >
              បិទ
            </button>
          </div>
        )}

        {/* TAB 0: PRIMARY SCHOOL STUDENT PRACTICE MANAGEMENT SYSTEM */}
        {activeTab === 'management' && (
          <div className="space-y-6">
            <PrimaryStudentManagementView
              students={studentsRoster}
              activeStudentId={activeStudentId}
              onSelectActiveStudent={handleSelectActiveStudent}
              onAddStudent={handleAddStudentToRoster}
              onAssignClassLesson={handleAssignClassLesson}
            />

            {/* AI Agent Completion Confirmation Card ("ខ្ញុំបានធ្វើហើយ") */}
            <StudentCompletionAiAgentCard
              studentId={activeStudentId}
              studentName={studentName}
              studentClass={studentClass}
              grade={selectedGrade}
              lessonTitle={activeSlide.lessonTitle}
              solvedCount={solvedCountInDeck}
              totalSlides={currentSlides.length}
              totalPoints={totalPoints}
              streakDays={streakDays}
              exercisesSummary={currentSlides.map((s) => `${s.categoryLabel}: ${s.question}`)}
              scratchpadNotes={scratchpadText}
              onBonusPointsEarned={(bonusPoints, updatedStudents) => {
                setTotalPoints((prev) => prev + bonusPoints);
                if (Array.isArray(updatedStudents)) {
                  setStudentsRoster(updatedStudents as PrimaryStudent[]);
                }
                setBannerMessage(
                  `🤖 AI Agent បានបញ្ជាក់ថា «ខ្ញុំបានធ្វើហើយ» សម្រាប់សិស្ស ${studentName} និងផ្ដល់ជូនរង្វាន់ +${bonusPoints} ពិន្ទុបន្ថែម!`
                );
              }}
            />
          </div>
        )}

        {/* TAB 1: DAILY 10-SLIDE EXERCISE WORKSPACE */}
        {activeTab === 'slides' && (
          <div className="space-y-6">
            {/* Compact Terms & Conditions Acceptance Bar (if not yet accepted) */}
            {!agreedToTerms ? (
              <div className="bg-white border border-sky-300 rounded-xl p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-sky-800 font-semibold">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>លក្ខខណ្ឌប្រព័ន្ធគ្រប់គ្រងអនុវត្តន៍សិស្សបឋមសិក្សា (ថ្នាក់ទី ៥-៦)</span>
                    <span aria-hidden="true">·</span>
                    <span>១០ ស្លាយក្នុងមួយថ្ងៃ</span>
                    <span aria-hidden="true">·</span>
                    <span>រៀងរាល់ម៉ោង ៧:០០ ល្ងាច</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700">
                    សូមអាន និងយល់ព្រមតាមលក្ខខណ្ឌ៖ ធ្វើលំហាត់ជាស្លាយឱ្យគ្រប់ ១០ លំហាត់ក្នុងមួយថ្ងៃ ចូលធ្វើលំហាត់ទៀងទាត់រៀងរាល់ម៉ោង ៧:០០ ល្ងាច
                    ដើម្បីទទួលបានពិន្ទុបន្ថែម និងរង្វាន់លើកទឹកចិត្ត។
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab('terms')}
                    className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    អានលក្ខខណ្ឌលម្អិត
                  </button>
                  <button
                    type="button"
                    onClick={handleAcceptAllConditions}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ខ្ញុំយល់ព្រមតាមលក្ខខណ្ឌទាំងអស់ (+៥០ ពិន្ទុ)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
                <div className="flex flex-wrap items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="font-semibold text-slate-900">
                    សិស្សកំពុងអនុវត្ត៖ {studentName} ({studentClass})
                  </span>
                  <span aria-hidden="true">·</span>
                  <select
                    value={activeStudentId}
                    onChange={(e) => {
                      const found = studentsRoster.find((s) => s.id === e.target.value);
                      if (found) {
                        handleSelectActiveStudent(found, 'slides');
                      }
                    }}
                    className="px-2.5 py-1 text-xs font-semibold bg-slate-100 border border-slate-300 rounded-md text-slate-800 cursor-pointer"
                  >
                    {studentsRoster.map((s) => (
                      <option key={s.id} value={s.id}>
                        ប្ដូរសិស្ស៖ {s.studentCode} - {s.name} ({s.className})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3 font-mono tabular-nums">
                  <span>ពិន្ទុសរុប៖ {totalPoints} pts</span>
                  <span aria-hidden="true">·</span>
                  <span>ស្លាយថ្ងៃនេះ៖ {solvedCountInDeck}/10</span>
                  <span aria-hidden="true">·</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('management')}
                    className="inline-flex items-center gap-1 font-sans font-semibold text-sky-700 hover:underline cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>បញ្ជីគ្រប់គ្រងសិស្ស</span>
                  </button>
                </div>
              </div>
            )}

            {/* Two-Zone Sandbox Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT ZONE (7 cols): INTERACTIVE 10-SLIDE STAGE */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-5">
                {/* Grade Switcher, Daily 10-Slide Generator & Pack Selector */}
                <div className="space-y-4 pb-4 border-b border-slate-200">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* Segmented Grade 5 / Grade 6 Switcher */}
                    <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedGrade(5);
                          setSelectedLessonPack(0);
                          setCurrentSlideIndex(0);
                          setShowHint(false);
                        }}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          selectedGrade === 5
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        សៀវភៅថ្នាក់ទី ៥ (១៨ មេរៀន)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedGrade(6);
                          setSelectedLessonPack(0);
                          setCurrentSlideIndex(0);
                          setShowHint(false);
                        }}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          selectedGrade === 6
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        សៀវភៅថ្នាក់ទី ៦ (២០ មេរៀន)
                      </button>
                    </div>

                    {/* Generate Next Daily 10-Slide Deck Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setDailyDayNumber((prev) => prev + 1);
                        setCurrentSlideIndex(0);
                        setShowHint(false);
                        setBannerMessage(
                          `បានបង្កើតស្លាយលំហាត់ថ្មីចំនួន ១០ លំហាត់ សម្រាប់ថ្ងៃទី ${
                            dailyDayNumber + 1
                          } (គណិតវិទ្យាថ្នាក់ទី ${selectedGrade}) រួចរាល់!`
                        );
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-sky-700" />
                      <span>បង្កើតស្លាយ ១០ លំហាត់ថ្ងៃបន្ទាប់ (ថ្ងៃទី {dailyDayNumber})</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-slate-500">
                        គណិតវិទ្យាថ្នាក់ទី {selectedGrade} · ថ្ងៃទី {dailyDayNumber} · ១ ថ្ងៃ ១០ លំហាត់ជាស្លាយ
                      </div>
                      <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                        ស្លាយទី {activeSlide.slideNumber} នៃ ១០ · {activeSlide.lessonTitle}
                      </h1>
                    </div>

                    <select
                      value={selectedLessonPack}
                      onChange={(e) => {
                        setSelectedLessonPack(Number(e.target.value));
                        setCurrentSlideIndex(0);
                        setShowHint(false);
                      }}
                      className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-sky-600 cursor-pointer"
                    >
                      <option value={0}>
                        ★ លំហាត់ស្លាយប្រចាំថ្ងៃថ្នាក់ទី {selectedGrade} (១០ លំហាត់/ថ្ងៃ)
                      </option>
                      {activeLessonsList.map((lesson) => (
                        <option key={lesson.id} value={lesson.id}>
                          ថ្នាក់ទី {selectedGrade} · {lesson.title} (១០ ស្លាយ)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 10 Slide Number Buttons */}
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                    {currentSlides.map((slide, idx) => {
                      const state = answerStates[slide.id];
                      const isCurrent = idx === currentSlideIndex;
                      const isDone = state?.isCorrect;
                      return (
                        <button
                          key={slide.id}
                          type="button"
                          onClick={() => {
                            setCurrentSlideIndex(idx);
                            setShowHint(false);
                          }}
                          className={`py-2 px-1 rounded-lg text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                            isCurrent
                              ? 'bg-slate-900 text-white shadow-xs'
                              : isDone
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <span>{idx + 1}</span>
                          {isDone && <span aria-hidden="true">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Unboxed Slide Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-sky-800">
                      {activeSlide.categoryLabel}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>សៀវភៅពុម្ពទំព័រទី {activeSlide.textbookPage}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">
                      រង្វាន់ +{isEvening7PmWindow ? activeSlide.points * 2 : activeSlide.points} ពិន្ទុ
                    </span>
                  </div>

                  {/* Interactive Answer Mode Switcher */}
                  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setAnswerMode('multiple-choice')}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        answerMode === 'multiple-choice'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      ជ្រើសរើសចម្លើយ
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnswerMode('direct-input')}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        answerMode === 'direct-input'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      វាយចម្លើយផ្ទាល់
                    </button>
                  </div>
                </div>

                {/* Interactive SVG Diagram Canvas */}
                <MathSlideDiagram
                  exercise={activeSlide}
                  isSolved={currentAnswerState.isCorrect}
                />

                {/* Slide Question */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <div className="text-xs font-semibold text-slate-500 mb-1.5">
                    ប្រធានលំហាត់ស្លាយទី {activeSlide.slideNumber} ៖
                  </div>
                  <p className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
                    {activeSlide.question}
                  </p>
                </div>

                {/* Formula Hint (Collapsible) */}
                {showHint && (
                  <div className="p-4 bg-amber-50/70 border border-amber-300 rounded-xl text-xs sm:text-sm text-amber-950">
                    <div className="font-bold mb-1">គន្លឹះ និងរូបមន្តសៀវភៅពុម្ព៖</div>
                    <div className="font-mono">{activeSlide.formulaHint}</div>
                  </div>
                )}

                {/* Answer Controls: Multiple Choice OR Direct Input */}
                {answerMode === 'multiple-choice' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeSlide.options.map((option, idx) => {
                      const isSelected = currentAnswerState.selectedOptionIndex === idx;
                      const showCorrectHighlight =
                        currentAnswerState.isSubmitted && idx === activeSlide.correctIndex;
                      const showWrongHighlight =
                        currentAnswerState.isSubmitted &&
                        isSelected &&
                        !currentAnswerState.isCorrect;

                      const optionLabels = ['ក', 'ខ', 'គ', 'ឃ'];

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectOption(idx)}
                          className={`p-4 rounded-xl border text-left transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                            showCorrectHighlight
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                              : showWrongHighlight
                              ? 'bg-rose-50 border-rose-400 text-rose-950'
                              : isSelected
                              ? 'bg-sky-50 border-sky-600 text-slate-900'
                              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                                showCorrectHighlight
                                  ? 'bg-emerald-600 text-white'
                                  : showWrongHighlight
                                  ? 'bg-rose-600 text-white'
                                  : isSelected
                                  ? 'bg-sky-700 text-white'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {optionLabels[idx]}
                            </span>
                            <span className="text-sm font-mono font-semibold">
                              {option}
                            </span>
                          </div>

                          {showCorrectHighlight && (
                            <span className="text-xs font-semibold text-emerald-800 shrink-0">
                              ✓ ត្រឹមត្រូវ
                            </span>
                          )}
                          {showWrongHighlight && (
                            <span className="text-xs font-semibold text-rose-800 shrink-0">
                              ▲ ខុស
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <input
                      type="text"
                      value={currentAnswerState.directInputText}
                      onChange={(e) => handleDirectInputChange(e.target.value)}
                      placeholder={`វាយបញ្ចូលចម្លើយគណនារបស់អ្នក${
                        activeSlide.unit ? ` (គិតជា ${activeSlide.unit})` : ''
                      }...`}
                      className="flex-1 px-4 py-3 text-sm font-mono bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-sky-600"
                    />
                    {activeSlide.unit && (
                      <span className="text-sm font-mono font-semibold text-slate-600 px-2">
                        ឯកតា៖ {activeSlide.unit}
                      </span>
                    )}
                  </div>
                )}

                {/* Primary Verification & Slide Navigation Action Bar */}
                <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={currentSlideIndex === 0}
                      onClick={() => {
                        setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
                        setShowHint(false);
                      }}
                      className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>ស្លាយមុន</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowHint((prev) => !prev)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-900 bg-amber-100/80 hover:bg-amber-200/80 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>{showHint ? 'លាក់គន្លឹះ' : 'មើលគន្លឹះរូបមន្ត'}</span>
                    </button>

                    {currentAnswerState.isSubmitted && (
                      <button
                        type="button"
                        onClick={handleResetCurrentSlide}
                        className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>ធ្វើម្ដងទៀត</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5">
                    {!currentAnswerState.isCorrect && (
                      <button
                        type="button"
                        onClick={handleVerifyAnswer}
                        className="px-5 py-2.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        ពិនិត្យផ្ទៀងផ្ទាត់ចម្លើយ
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={currentSlideIndex === currentSlides.length - 1}
                      onClick={() => {
                        setCurrentSlideIndex((prev) =>
                          Math.min(currentSlides.length - 1, prev + 1)
                        );
                        setShowHint(false);
                      }}
                      className="inline-flex items-center gap-1 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>ស្លាយបន្ទាប់</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Step-by-Step Textbook Solution & Verification Box */}
                {currentAnswerState.isSubmitted && (
                  <div
                    className={`p-5 rounded-xl border space-y-3 ${
                      currentAnswerState.isCorrect
                        ? 'bg-emerald-50/60 border-emerald-300'
                        : 'bg-rose-50/60 border-rose-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {currentAnswerState.isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0" />
                        )}
                        <span
                          className={`text-sm font-bold ${
                            currentAnswerState.isCorrect
                              ? 'text-emerald-950'
                              : 'text-rose-950'
                          }`}
                        >
                          {currentAnswerState.isCorrect
                            ? `✓ ចម្លើយត្រឹមត្រូវ! អ្នកទទួលបាន +${
                                isEvening7PmWindow
                                  ? activeSlide.points * 2
                                  : activeSlide.points
                              } ពិន្ទុលើកទឹកចិត្ត`
                            : '▲ ចម្លើយមិនទាន់ត្រឹមត្រូវទេ · សូមពិនិត្យជំហានដោះស្រាយខាងក្រោម'}
                        </span>
                      </div>

                      <span className="text-xs font-mono text-slate-600">
                        ចម្លើយត្រឹមត្រូវ៖ {activeSlide.options[activeSlide.correctIndex]}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-200/80">
                      <div className="text-xs font-bold text-slate-800">
                        ជំហានដោះស្រាយតាមសៀវភៅពុម្ពគណិតវិទ្យាថ្នាក់ទី៦៖
                      </div>
                      {activeSlide.steps.map((step, i) => (
                        <div key={i} className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                          {step}
                        </div>
                      ))}
                      <div className="text-xs font-mono font-semibold text-sky-900 pt-1">
                        {activeSlide.verification}
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Agent Student Completion Confirmation ("ខ្ញុំបានធ្វើហើយ") */}
                <StudentCompletionAiAgentCard
                  studentId={activeStudentId}
                  studentName={studentName}
                  studentClass={studentClass}
                  grade={selectedGrade}
                  lessonTitle={activeSlide.lessonTitle}
                  solvedCount={solvedCountInDeck}
                  totalSlides={currentSlides.length}
                  totalPoints={totalPoints}
                  streakDays={streakDays}
                  exercisesSummary={currentSlides.map((s) => `${s.categoryLabel}: ${s.question}`)}
                  scratchpadNotes={scratchpadText}
                  onBonusPointsEarned={(bonusPoints, updatedStudents) => {
                    setTotalPoints((prev) => prev + bonusPoints);
                    if (Array.isArray(updatedStudents)) {
                      setStudentsRoster(updatedStudents as PrimaryStudent[]);
                    }
                    setBannerMessage(
                      `🤖 AI Agent បានបញ្ជាក់ថា «ខ្ញុំបានធ្វើហើយ» សម្រាប់សិស្ស ${studentName} និងផ្ដល់ជូនរង្វាន់ +${bonusPoints} ពិន្ទុបន្ថែម!`
                    );
                  }}
                />
              </div>

              {/* RIGHT ZONE (5 cols): 7:00 PM DAILY ROUTINE, REWARD CHEST & SCRATCHPAD */}
              <div className="lg:col-span-5 space-y-5">
                {/* 7:00 PM Daily Schedule & Live Bonus Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-sky-700 shrink-0" />
                      <h2 className="text-sm font-bold text-slate-900">
                        វិន័យសិក្សាប្រចាំថ្ងៃ · រៀងរាល់ម៉ោង ៧:០០ ល្ងាច
                      </h2>
                    </div>
                    <span className="text-xs font-mono tabular-nums text-slate-600">
                      {now.toLocaleTimeString('km-KH', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </span>
                  </div>

                  <div
                    className={`p-4 rounded-xl border ${
                      isEvening7PmWindow
                        ? 'bg-amber-50/70 border-amber-300'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="text-xs text-slate-600">
                      {isEvening7PmWindow
                        ? '★ ស្ថានភាពបច្ចុប្បន្ន៖ ម៉ោងសិក្សាពិសេស ៧:០០ ល្ងាច'
                        : 'រយៈពេលនៅសល់ដល់ម៉ោងធ្វើលំហាត់ ៧:០០ ល្ងាច (19:00) ៖'}
                    </div>
                    <div className="mt-1 text-lg font-mono font-bold tabular-nums text-slate-900">
                      {countdownTo7Pm}
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      រាល់ការធ្វើលំហាត់ក្នុងម៉ោង ៧:០០ ល្ងាច នឹងទទួលបានពិន្ទុលើកទឹកចិត្តគុណនឹង ២ (×2) គ្រប់ស្លាយទាំង ១០!
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setSimulate7PmMode((prev) => !prev)}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        simulate7PmMode
                          ? 'bg-amber-600 text-white hover:bg-amber-700'
                          : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                      }`}
                    >
                      {simulate7PmMode
                        ? '✓ កំពុងបើកម៉ោង ៧:០០ ល្ងាច (ពិន្ទុ ×2)'
                        : 'បើកសាកល្បងម៉ោង ៧:០០ ល្ងាចឥឡូវនេះ'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('terms')}
                      className="text-xs font-semibold text-sky-700 hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      មើលកាលវិភាគ ៧ ថ្ងៃ →
                    </button>
                  </div>
                </div>

                {/* Daily 10-Slide Progress & Motivational Reward Chest */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-amber-600 shrink-0" />
                      <h2 className="text-sm font-bold text-slate-900">
                        ហិបរង្វាន់លើកទឹកចិត្តប្រចាំថ្ងៃ (១០ ស្លាយ)
                      </h2>
                    </div>
                    <span className="text-xs font-mono font-bold tabular-nums text-sky-800">
                      {solvedCountInDeck} / 10 ស្លាយ
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-600 transition-transform duration-200 origin-left"
                      style={{
                        transform: `scaleX(${solvedCountInDeck / 10})`,
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="text-xs text-slate-500">ពិន្ទុសរុប</div>
                      <div className="text-sm font-mono font-bold tabular-nums text-slate-900 mt-0.5">
                        {totalPoints} pts
                      </div>
                    </div>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="text-xs text-slate-500">ថ្ងៃជាប់គ្នា</div>
                      <div className="text-sm font-mono font-bold tabular-nums text-amber-700 mt-0.5">
                        {streakDays} ថ្ងៃ
                      </div>
                    </div>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="text-xs text-slate-500">ឈុតបញ្ចប់</div>
                      <div className="text-sm font-mono font-bold tabular-nums text-emerald-700 mt-0.5">
                        {completedDecksCount} ឈុត
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                    {dailyChestClaimedForPack[selectedLessonPack] ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                        <Award className="w-4 h-4" />
                        <span>បានបើកហិបរង្វាន់ +100 ពិន្ទុសម្រាប់ឈុតនេះរួចហើយ!</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={solvedCountInDeck < 10}
                        onClick={handleClaimDaily10SlideChest}
                        className={`w-full py-2.5 px-4 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
                          solvedCountInDeck >= 10
                            ? 'bg-amber-600 text-white hover:bg-amber-700 cursor-pointer'
                            : 'bg-slate-100 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>
                          {solvedCountInDeck >= 10
                            ? 'បើកហិបរង្វាន់លើកទឹកចិត្តប្រចាំថ្ងៃ (+100 ពិន្ទុ!)'
                            : `ធ្វើឱ្យគ្រប់ ១០ ស្លាយដើម្បីបើកហិបរង្វាន់ (នៅសល់ ${
                                10 - solvedCountInDeck
                              } ស្លាយ)`}
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 15-Minute Prior Telegram Reminder to Parents (6:45 PM) */}
                <TelegramParentReminderCard
                  studentName={studentName}
                  studentClass={studentClass}
                  solvedCount={solvedCountInDeck}
                  totalPoints={totalPoints}
                  streakDays={streakDays}
                  currentLessonTitle={activeSlide.lessonTitle}
                  compact
                />

                {/* Interactive Student Scratchpad / Calculation Notebook */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-slate-700 shrink-0" />
                      <h2 className="text-sm font-bold text-slate-900">
                        ក្តារខៀនព្រាងគណនាដោយខ្លួនឯង
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setScratchpadText('')}
                      className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      សម្អាតក្តារខៀន
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {['+', '-', '×', '÷', '=', 'π ≈ 3.14', 'm²', 'cm³', '1/2'].map((sym) => (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => setScratchpadText((prev) => `${prev} ${sym} `)}
                        className="px-2.5 py-1 text-xs font-mono bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md transition-colors cursor-pointer"
                      >
                        {sym}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={4}
                    value={scratchpadText}
                    onChange={(e) => setScratchpadText(e.target.value)}
                    placeholder="សរសេរប្រមាណវិធីបូក ដក គុណ ចែក ឬជំហានគណនារបស់អ្នកនៅទីនេះ..."
                    className="w-full p-3 text-xs sm:text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-600"
                  />

                  <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
                    <span>សៀវភៅពុម្ពគណិតវិទ្យាថ្នាក់ទី៦ · ទំព័រទី {activeSlide.textbookPage}</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('curriculum')}
                      className="inline-flex items-center gap-1 text-sky-700 font-semibold hover:underline cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>បើកមើលសៀវភៅពុម្ព</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TERMS & 7:00 PM DAILY SCHEDULE */}
        {activeTab === 'terms' && (
          <TermsAndScheduleView
            studentName={studentName}
            setStudentName={setStudentName}
            studentClass={studentClass}
            setStudentClass={setStudentClass}
            agreedToTerms={agreedToTerms}
            agreedTimestamp={agreedTimestamp}
            onAcceptAllConditions={handleAcceptAllConditions}
            reminderEnabled={reminderEnabled}
            setReminderEnabled={setReminderEnabled}
            simulate7PmMode={simulate7PmMode}
            setSimulate7PmMode={setSimulate7PmMode}
            onStartDailySlides={() => setActiveTab('slides')}
            solvedCount={solvedCountInDeck}
            totalPoints={totalPoints}
            streakDays={streakDays}
            currentLessonTitle={activeSlide.lessonTitle}
          />
        )}

        {/* TAB 3: MOTIVATIONAL REWARDS & PRINTABLE CERTIFICATE */}
        {activeTab === 'rewards' && (
          <RewardsAndCertificateView
            studentName={studentName}
            studentClass={studentClass}
            totalPoints={totalPoints}
            streakDays={streakDays}
            completedDecksCount={completedDecksCount}
            claimedRewardIds={claimedRewardIds}
            onClaimReward={handleClaimReward}
            agreedToTerms={agreedToTerms}
          />
        )}

        {/* TAB 4: ALL LESSONS & EMBEDDED TEXTBOOK PDF (GRADE 5 & GRADE 6) */}
        {activeTab === 'curriculum' && (
          <CurriculumAndPdfView
            selectedGrade={selectedGrade}
            onSelectGrade={(grade) => setSelectedGrade(grade)}
            onSelectLessonDeck={(grade, lessonId) => {
              setSelectedGrade(grade);
              setSelectedLessonPack(lessonId);
              setCurrentSlideIndex(0);
              setShowHint(false);
              setActiveTab('slides');
            }}
          />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-5 px-6 text-xs text-slate-500 no-print">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            កម្មវិធីអនុវត្តន៍លំហាត់គណិតវិទ្យាថ្នាក់ទី៦ · ជាស្លាយក្នុងមួយថ្ងៃ ១០ លំហាត់ · រៀងរាល់ម៉ោង ៧:០០ ល្ងាច
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('terms')}
              className="hover:text-slate-900 cursor-pointer"
            >
              លក្ខខណ្ឌនៃកម្មវិធី
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveTab('rewards')}
              className="hover:text-slate-900 cursor-pointer"
            >
              រង្វាន់លើកទឹកចិត្ត
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveTab('curriculum')}
              className="hover:text-slate-900 cursor-pointer"
            >
              សៀវភៅពុម្ពគណិតវិទ្យាថ្នាក់ទី៦ (PDF)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
