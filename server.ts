import 'dotenv/config';
import { GoogleGenAI, Type } from '@google/genai';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export interface AiCompletionConfirmationRecord {
  id: string;
  timestamp: string;
  studentName: string;
  studentClass: string;
  grade: 5 | 6;
  lessonTitle: string;
  studentDeclaration: string;
  solvedCount: number;
  totalSlides: number;
  bonusPointsAwarded: number;
  verificationBadge: string;
  agentFeedback: string;
  quickCheckQuestion: string;
  parentSummaryMessage: string;
  telegramShareUrl: string;
  studentReplyToCheck?: string;
  agentFollowUpResponse?: string;
}

export interface TelegramReminderLog {
  id: string;
  timestamp: string;
  type: 'pre-15min' | 'completion-report' | 'class-broadcast';
  recipient: string;
  messageText: string;
  status: 'sent-via-bot' | 'ready-telegram-link' | 'bot-error';
  detail: string;
  telegramShareUrl: string;
}

export interface PrimaryStudentRecord {
  id: string;
  studentCode: string;
  name: string;
  gender: 'ប្រុស' | 'ស្រី';
  grade: 5 | 6;
  className: string;
  parentName: string;
  parentTelegram: string;
  agreedToTerms: boolean;
  todaySlidesCompleted: number; // 0 to 10
  assignedLessonTitle: string;
  streakDays: number;
  totalPoints: number;
  lastActiveTime: string;
  attended7PmToday: boolean;
  rewardsCount: number;
}

interface ParentTelegramConfig {
  parentName: string;
  recipientChatOrUsername: string;
  studentName: string;
  studentClass: string;
  leadMinutes: number;
  reminderTime: string;
  studyTime: string;
  autoRemindEnabled: boolean;
  sendCompletionSummary: boolean;
  customNote: string;
}

let primaryStudents: PrimaryStudentRecord[] = [
  {
    id: 'stu-1',
    studentCode: 'PS-501',
    name: 'សុខ សុវណ្ណារ៉ា',
    gender: 'ប្រុស',
    grade: 5,
    className: 'ថ្នាក់ទី ៥ ក',
    parentName: 'លោកពូ សុខ ចាន់ថន',
    parentTelegram: process.env.TELEGRAM_CHAT_ID || '@sok_chanthon_kh',
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
];

let parentConfig: ParentTelegramConfig = {
  parentName: 'លោកពូ សុខ ចាន់ថន',
  recipientChatOrUsername: process.env.TELEGRAM_CHAT_ID || '@sok_chanthon_kh',
  studentName: 'សុខ សុវណ្ណារ៉ា',
  studentClass: 'ថ្នាក់ទី ៥ ក',
  leadMinutes: 15,
  reminderTime: '18:45',
  studyTime: '19:00',
  autoRemindEnabled: true,
  sendCompletionSummary: true,
  customNote:
    'សូមជួយរំលឹក និងលើកទឹកចិត្តកូនឱ្យចូលធ្វើលំហាត់គណិតវិទ្យាទាំង ១០ ស្លាយឱ្យទាន់ម៉ោង ៧:០០ ល្ងាច។',
};

const reminderLogs: TelegramReminderLog[] = [
  {
    id: 'log-init-1',
    timestamp: 'ថ្ងៃនេះ · 18:45',
    type: 'pre-15min',
    recipient: parentConfig.recipientChatOrUsername,
    messageText:
      '🔔 [រំលឹកមុន ១៥ នាទី - ម៉ោង ៦:៤៥ ល្ងាច] សូមគោរពជូនអាណាព្យាបាលសិស្សបឋមសិក្សា៖ នៅសល់ ១៥ នាទីទៀតដល់ម៉ោង ៧:០០ ល្ងាច សម្រាប់ធ្វើលំហាត់គណិតវិទ្យា (ថ្នាក់ទី៥-៦) ចំនួន ១០ ស្លាយប្រចាំថ្ងៃ។',
    status: process.env.TELEGRAM_BOT_TOKEN ? 'sent-via-bot' : 'ready-telegram-link',
    detail: 'រំលឹកស្វ័យប្រវត្តិមុន ១៥ នាទី (18:45 → 19:00)',
    telegramShareUrl:
      'https://t.me/share/url?url=https://t.me&text=%F0%9F%94%94%20%E1%9E%9A%E1%9F%86%E1%9E%9B%E1%9E%B9%E1%9E%80%E1%9E%98%E1%9E%BB%E1%9E%93%20%E1%9F%A1%E1%9F%A5%E1%9E%93%E1%9E%B6%E1%9E%91%E1%9E%B8',
  },
];

let lastAutoSentDate = '';

function buildKhmerReminderMessage(
  type: 'pre-15min' | 'completion-report' | 'class-broadcast',
  cfg: ParentTelegramConfig,
  extra?: {
    solvedCount?: number;
    totalPoints?: number;
    streakDays?: number;
    lessonTitle?: string;
    pendingStudentsCount?: number;
  }
): string {
  if (type === 'class-broadcast') {
    return [
      `📢 [សេចក្ដីជូនដំណឹងរួមមុន ១៥ នាទី - ម៉ោង ៦:៤៥ ល្ងាច]`,
      `ប្រព័ន្ធគ្រប់គ្រងអនុវត្តន៍សិស្សបឋមសិក្សា (ថ្នាក់ទី៥ និងថ្នាក់ទី៦)`,
      `⏰ នៅសល់ ១៥ នាទីទៀត ដល់ម៉ោង ៧:០០ ល្ងាច (19:00) សម្រាប់ការធ្វើលំហាត់គណិតវិទ្យាជាស្លាយ ១០ លំហាត់ប្រចាំថ្ងៃ។`,
      `👨‍👩‍👧‍👦 សូមមាតាបិតា និងអាណាព្យាបាលជួយរំលឹកកូនៗឱ្យចូលធ្វើលំហាត់ឱ្យបានទាន់ពេល ដើម្បីទទួលបានពិន្ទុគុណនឹង ២ (×2) និងរង្វាន់លើកទឹកចិត្ត!`,
    ].join('\n');
  }

  if (type === 'completion-report') {
    return [
      `🏆 [របាយការណ៍បញ្ចប់លំហាត់ ១០ ស្លាយប្រចាំថ្ងៃ - បឋមសិក្សា]`,
      `ជូនចំពោះ៖ ${cfg.parentName}`,
      `សិស្សឈ្មោះ៖ ${cfg.studentName} (${cfg.studentClass})`,
      `មេរៀនថ្ងៃនេះ៖ ${extra?.lessonTitle || 'គណិតវិទ្យាបឋមសិក្សា (១០ ស្លាយ)'}`,
      `លទ្ធផល៖ ធ្វើបានសម្រេច ${extra?.solvedCount ?? 10}/10 ស្លាយ`,
      `ពិន្ទុសរុប៖ ${extra?.totalPoints ?? 200} ពិន្ទុ · វិន័យសិក្សា៖ ${extra?.streakDays ?? 3} ថ្ងៃជាប់គ្នា`,
      `សូមអាណាព្យាបាលជួយផ្ដល់រង្វាន់លើកទឹកចិត្តដល់កូន!`,
    ].join('\n');
  }

  return [
    `🔔 [សាររំលឹកមុន ១៥ នាទី - ម៉ោង ៦:៤៥ ល្ងាច]`,
    `ជូនចំពោះ៖ ${cfg.parentName}`,
    `សិស្សឈ្មោះ៖ ${cfg.studentName} (${cfg.studentClass})`,
    `⏰ នៅសល់ ១៥ នាទីទៀត ដល់ម៉ោង ៧:០០ ល្ងាច (19:00) ដែលជាម៉ោងចូលធ្វើលំហាត់គណិតវិទ្យាបឋមសិក្សា ចំនួន ១០ ស្លាយប្រចាំថ្ងៃ។`,
    `📚 គោលដៅថ្ងៃនេះ៖ ${extra?.lessonTitle || 'លំហាត់គណិតវិទ្យាជាស្លាយ ១០ លំហាត់'}`,
    `🎁 ចូលធ្វើលំហាត់ទាន់ម៉ោង ៧:០០ ល្ងាច នឹងទទួលបានពិន្ទុរង្វាន់លើកទឹកចិត្តគុណនឹង ២ (×2)!`,
    cfg.customNote ? `💬 ចំណាំ៖ ${cfg.customNote}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

async function dispatchTelegramMessage(
  type: 'pre-15min' | 'completion-report' | 'class-broadcast',
  customCfg?: Partial<ParentTelegramConfig>,
  extra?: {
    solvedCount?: number;
    totalPoints?: number;
    streakDays?: number;
    lessonTitle?: string;
    pendingStudentsCount?: number;
  }
): Promise<TelegramReminderLog> {
  const effectiveCfg = { ...parentConfig, ...customCfg };
  const messageText = buildKhmerReminderMessage(type, effectiveCfg, extra);
  const appUrl = process.env.APP_URL || 'https://aistudio.google.com';
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(
    appUrl
  )}&text=${encodeURIComponent(messageText)}`;

  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = (
    effectiveCfg.recipientChatOrUsername ||
    process.env.TELEGRAM_CHAT_ID ||
    ''
  ).trim();

  const nowStr = new Date().toLocaleTimeString('km-KH', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  if (botToken && chatId) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText,
        }),
      });
      const data = (await response.json()) as { ok?: boolean; description?: string };
      if (response.ok && data.ok) {
        const logItem: TelegramReminderLog = {
          id: `tg-${Date.now()}`,
          timestamp: `ថ្ងៃនេះ · ${nowStr}`,
          type,
          recipient: chatId,
          messageText,
          status: 'sent-via-bot',
          detail: 'បានបញ្ជូនទៅ Telegram របស់អាណាព្យាបាលដោយជោគជ័យតាមរយៈ Telegram Bot API',
          telegramShareUrl,
        };
        reminderLogs.unshift(logItem);
        return logItem;
      }
    } catch {
      // Fall through to share link
    }
  }

  const logItem: TelegramReminderLog = {
    id: `tg-${Date.now()}`,
    timestamp: `ថ្ងៃនេះ · ${nowStr}`,
    type,
    recipient: chatId || '@parent_guardian',
    messageText,
    status: 'ready-telegram-link',
    detail: 'បានបង្កើតសាររំលឹកមុន ១៥ នាទី និងតំណភ្ជាប់ Telegram សម្រាប់អាណាព្យាបាលរួចរាល់',
    telegramShareUrl,
  };
  reminderLogs.unshift(logItem);
  return logItem;
}

const app = express();
app.use(express.json());

// API: Get all primary school students
app.get('/api/students', (_req, res) => {
    res.json({
      students: primaryStudents,
    });
  });

  // API: Add a new primary school student
  app.post('/api/students', (req, res) => {
    const body = req.body || {};
    const grade: 5 | 6 = Number(body.grade) === 6 ? 6 : 5;
    const nextNum = primaryStudents.length + 1;
    const newStudent: PrimaryStudentRecord = {
      id: `stu-${Date.now()}`,
      studentCode: `PS-${grade}0${nextNum}`,
      name: (body.name || 'សិស្សថ្មី').trim(),
      gender: body.gender === 'ស្រី' ? 'ស្រី' : 'ប្រុស',
      grade,
      className: (body.className || `ថ្នាក់ទី ${grade === 5 ? '៥' : '៦'} ក`).trim(),
      parentName: (body.parentName || 'អាណាព្យាបាលសិស្ស').trim(),
      parentTelegram: (body.parentTelegram || '@parent_telegram').trim(),
      agreedToTerms: Boolean(body.agreedToTerms),
      todaySlidesCompleted: 0,
      assignedLessonTitle:
        body.assignedLessonTitle ||
        (grade === 5
          ? 'មេរៀនទី ១ : ចំនួន និងមធ្យមនព្វន្ត (ថ្នាក់ទី៥)'
          : 'មេរៀនទី ១ : ចំនួន (ថ្នាក់ទី៦)'),
      streakDays: 1,
      totalPoints: body.agreedToTerms ? 50 : 0,
      lastActiveTime: 'ទើបចុះឈ្មោះ',
      attended7PmToday: false,
      rewardsCount: body.agreedToTerms ? 1 : 0,
    };
    primaryStudents.unshift(newStudent);
    res.json({ ok: true, student: newStudent, students: primaryStudents });
  });

  // API: Update student progress (slides completed, points, terms agreement, lesson assignment)
  app.post('/api/students/update-progress', (req, res) => {
    const {
      studentId,
      studentName,
      todaySlidesCompleted,
      totalPoints,
      streakDays,
      agreedToTerms,
      assignedLessonTitle,
      attended7PmToday,
      rewardsCount,
    } = req.body || {};

    primaryStudents = primaryStudents.map((stu) => {
      if (stu.id === studentId || stu.name === studentName) {
        return {
          ...stu,
          todaySlidesCompleted:
            typeof todaySlidesCompleted === 'number'
              ? Math.max(stu.todaySlidesCompleted, todaySlidesCompleted)
              : stu.todaySlidesCompleted,
          totalPoints: typeof totalPoints === 'number' ? totalPoints : stu.totalPoints,
          streakDays: typeof streakDays === 'number' ? streakDays : stu.streakDays,
          agreedToTerms:
            typeof agreedToTerms === 'boolean' ? agreedToTerms : stu.agreedToTerms,
          assignedLessonTitle: assignedLessonTitle || stu.assignedLessonTitle,
          attended7PmToday:
            typeof attended7PmToday === 'boolean'
              ? attended7PmToday
              : stu.attended7PmToday,
          rewardsCount:
            typeof rewardsCount === 'number' ? rewardsCount : stu.rewardsCount,
          lastActiveTime: 'ថ្ងៃនេះ · ទើបអនុវត្ត',
        };
      }
      return stu;
    });

    res.json({ ok: true, students: primaryStudents });
  });

  // API: Assign a daily 10-slide lesson to an entire grade (Grade 5 or Grade 6)
  app.post('/api/students/assign-class-lesson', (req, res) => {
    const { grade, lessonTitle } = req.body || {};
    if (lessonTitle) {
      primaryStudents = primaryStudents.map((stu) =>
        Number(grade) === stu.grade
          ? { ...stu, assignedLessonTitle: lessonTitle }
          : stu
      );
    }
    res.json({ ok: true, students: primaryStudents });
  });

  // API: Get Telegram reminder status & logs
  app.get('/api/telegram/status', (_req, res) => {
    res.json({
      botConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN?.trim()),
      config: parentConfig,
      logs: reminderLogs.slice(0, 15),
    });
  });

  // API: Update Parent Telegram Reminder Settings
  app.post('/api/telegram/settings', (req, res) => {
    const body = req.body || {};
    parentConfig = {
      ...parentConfig,
      parentName: typeof body.parentName === 'string' ? body.parentName : parentConfig.parentName,
      recipientChatOrUsername:
        typeof body.recipientChatOrUsername === 'string'
          ? body.recipientChatOrUsername
          : parentConfig.recipientChatOrUsername,
      studentName:
        typeof body.studentName === 'string' ? body.studentName : parentConfig.studentName,
      studentClass:
        typeof body.studentClass === 'string' ? body.studentClass : parentConfig.studentClass,
      autoRemindEnabled:
        typeof body.autoRemindEnabled === 'boolean'
          ? body.autoRemindEnabled
          : parentConfig.autoRemindEnabled,
      sendCompletionSummary:
        typeof body.sendCompletionSummary === 'boolean'
          ? body.sendCompletionSummary
          : parentConfig.sendCompletionSummary,
      customNote: typeof body.customNote === 'string' ? body.customNote : parentConfig.customNote,
    };

    res.json({
      ok: true,
      config: parentConfig,
    });
  });

  // API: Trigger 15-minute prior reminder or daily completion report to parent via Telegram
  app.post('/api/telegram/send-reminder', async (req, res) => {
    const {
      type = 'pre-15min',
      parentName,
      recipientChatOrUsername,
      studentName,
      studentClass,
      solvedCount,
      totalPoints,
      streakDays,
      lessonTitle,
    } = req.body || {};

    const validType =
      type === 'completion-report'
        ? 'completion-report'
        : type === 'class-broadcast'
        ? 'class-broadcast'
        : 'pre-15min';

    const logItem = await dispatchTelegramMessage(
      validType,
      {
        ...(parentName ? { parentName } : {}),
        ...(recipientChatOrUsername ? { recipientChatOrUsername } : {}),
        ...(studentName ? { studentName } : {}),
        ...(studentClass ? { studentClass } : {}),
      },
      { solvedCount, totalPoints, streakDays, lessonTitle }
    );
    res.json({
      ok: true,
      log: logItem,
      logs: reminderLogs.slice(0, 15),
    });
  });

const aiCompletionConfirmations: AiCompletionConfirmationRecord[] = [
  {
    id: 'ai-conf-init-1',
    timestamp: 'ថ្ងៃនេះ · 19:15',
    studentName: 'សុខ សុវណ្ណារ៉ា',
    studentClass: 'ថ្នាក់ទី ៥ ក',
    grade: 5,
    lessonTitle: 'មេរៀនទី ១ : ចំនួន និងមធ្យមនព្វន្ត (ថ្នាក់ទី៥)',
    studentDeclaration: 'ខ្ញុំបានធ្វើហើយ! បានបញ្ចប់លំហាត់ទាំង ១០ ស្លាយនៅម៉ោង ៧:០០ ល្ងាច។',
    solvedCount: 10,
    totalSlides: 10,
    bonusPointsAwarded: 30,
    verificationBadge: '✓ បានបញ្ជាក់ដោយ AI Agent (១០/១០ ស្លាយ)',
    agentFeedback:
      'សូមកោតសរសើរ សិស្ស សុខ សុវណ្ណារ៉ា! អ្នកបានគោរពវិន័យម៉ោង ៧:០០ ល្ងាច និងធ្វើលំហាត់គណិតវិទ្យាទាំង ១០ ស្លាយបានយ៉ាងត្រឹមត្រូវ។ ការចេះគណនាមធ្យមនព្វន្ត និងតម្លៃលេខតាមខ្ទង់ គឺជាមូលដ្ឋានគ្រឹះដ៏រឹងមាំសម្រាប់ថ្នាក់បឋមសិក្សា។',
    quickCheckQuestion:
      'សំណួរផ្ទៀងផ្ទាត់ខ្លីពី AI Agent៖ ដើម្បីរកមធ្យមនព្វន្តនៃចំនួន ៣ ចំនួន តើយើងត្រូវធ្វើប្រមាណវិធីអ្វីមុនគេ រួចចែកនឹងប៉ុន្មាន?',
    parentSummaryMessage:
      '🤖 [AI Agent បញ្ជាក់ការធ្វើលំហាត់រួច] សិស្សឈ្មោះ សុខ សុវណ្ណារ៉ា (ថ្នាក់ទី ៥ ក) បានបញ្ជាក់ថា «ខ្ញុំបានធ្វើហើយ» និងបានបញ្ចប់លំហាត់គណិតវិទ្យាប្រចាំថ្ងៃ 10/10 ស្លាយ ទទួលបានពិន្ទុបន្ថែម +30 ពិន្ទុ។',
    telegramShareUrl:
      'https://t.me/share/url?url=https://aistudio.google.com&text=%F0%9F%A4%96%20AI%20Agent%20%E1%9E%94%E1%9E%89%E1%9F%92%E1%9E%87%E1%9E%B6%E1%9E%80%E1%9F%8B%E1%9E%90%E1%9E%B6%E1%9E%9F%E1%9E%B7%E1%9E%9F%E1%9F%92%E1%9E%9F%E1%9E%94%E1%9E%B6%E1%9E%93%E1%9E%92%E1%9F%92%E1%9E%9C%E1%9E%BE%E1%9E%9B%E1%9F%86%E1%9E%A0%E1%9E%B6%E1%9E%8F%E1%9F%8B%E1%9E%9A%E1%9E%BD%E1%9E%85%E1%9E%A0%E1%9E%BE%E1%9E%99',
  },
];

// API: Get all AI Agent student completion confirmations
app.get('/api/ai-agent/confirmations', (_req, res) => {
  res.json({
    confirmations: aiCompletionConfirmations.slice(0, 20),
  });
});

// API: Student confirms "ខ្ញុំបានធ្វើហើយ" (I have completed the exercises) to the AI Agent
app.post('/api/ai-agent/confirm-completion', async (req, res) => {
  const {
    studentId,
    studentName = 'សុខ សុវណ្ណារ៉ា',
    studentClass = 'ថ្នាក់ទី ៥ ក',
    grade = 5,
    lessonTitle = 'លំហាត់គណិតវិទ្យាប្រចាំថ្ងៃ (១០ ស្លាយ)',
    studentDeclaration = 'ខ្ញុំបានធ្វើហើយ!',
    solvedCount = 10,
    totalSlides = 10,
    totalPoints = 200,
    streakDays = 3,
    exercisesSummary = [],
    scratchpadNotes = '',
    autoNotifyTelegram = true,
  } = req.body || {};

  const bonusPointsAwarded = solvedCount >= 10 ? 30 : 15;
  const nowStr = new Date().toLocaleTimeString('km-KH', {
    hour: '2-digit',
    minute: '2-digit',
  });

  let verificationBadge =
    solvedCount >= 10
      ? `✓ AI Agent បានបញ្ជាក់៖ ធ្វើលំហាត់រួចរាល់ពេញលេញ (${solvedCount}/${totalSlides} ស្លាយ)`
      : `✓ AI Agent បានកត់ត្រា៖ បានធ្វើលំហាត់ (${solvedCount}/${totalSlides} ស្លាយ)`;
  let agentFeedback = `សូមកោតសរសើរសិស្សឈ្មោះ ${studentName} (${studentClass}) ដែលបានរាយការណ៍បញ្ជាក់ថា «${studentDeclaration}»! អ្នកបានធ្វើលំហាត់បានចំនួន ${solvedCount}/${totalSlides} ស្លាយ ក្នុងមេរៀន «${lessonTitle}» និងទទួលបានពិន្ទុលើកទឹកចិត្តបន្ថែម +${bonusPointsAwarded} ពិន្ទុ។`;
  let quickCheckQuestion = `សំណួរផ្ទៀងផ្ទាត់ខ្លីពី AI Agent៖ ក្នុងចំណោមលំហាត់ដែលប្អូនទើបតែធ្វើរួចក្នុង «${lessonTitle}» តើប្អូនចាំរូបមន្ត ឬវិធីគណនាមួយណាច្បាស់ជាងគេ?`;
  let parentSummaryMessage = [
    `🤖 [AI Agent បញ្ជាក់ការធ្វើលំហាត់រួច - «ខ្ញុំបានធ្វើហើយ»]`,
    `សិស្សឈ្មោះ៖ ${studentName} (${studentClass} · ថ្នាក់ទី${grade === 5 ? '៥' : '៦'})`,
    `សេចក្ដីបញ្ជាក់របស់សិស្ស៖ «${studentDeclaration}»`,
    `មេរៀន៖ ${lessonTitle}`,
    `លទ្ធផល៖ ធ្វើបាន ${solvedCount}/${totalSlides} ស្លាយ · ទទួលបានរង្វាន់បន្ថែម +${bonusPointsAwarded} ពិន្ទុពី AI Agent`,
  ].join('\n');

  const ai = getGenAIClient();
  if (ai) {
    try {
      const promptText = [
        `សិស្សបឋមសិក្សាឈ្មោះ "${studentName}" រៀននៅ "${studentClass}" (ថ្នាក់ទី${grade}) បានចុចបញ្ជាក់ប្រាប់ AI Agent ថា៖ "${studentDeclaration}"។`,
        `មេរៀនថ្ងៃនេះ៖ "${lessonTitle}"។`,
        `ចំនួនលំហាត់ស្លាយដែលសិស្សបានធ្វើរួច៖ ${solvedCount} ក្នុងចំណោម ${totalSlides} ស្លាយ។`,
        Array.isArray(exercisesSummary) && exercisesSummary.length > 0
          ? `ប្រធានបទលំហាត់ដែលបានធ្វើ៖ ${exercisesSummary.slice(0, 5).join(' | ')}។`
          : '',
        scratchpadNotes ? `កំណត់ត្រាគណនារបស់សិស្សលើក្តារខៀនព្រាង៖ "${scratchpadNotes}"។` : '',
        `សូមដើរតួជា "គ្រូជំនួយការ AI គណិតវិទ្យាបឋមសិក្សា" ឆ្លើយតបជាភាសាខ្មែរឱ្យបានច្បាស់លាស់ កក់ក្ដៅ និងលើកទឹកចិត្តសិស្ស។`,
      ]
        .filter(Boolean)
        .join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          systemInstruction:
            'អ្នកគឺជា AI Agent ពិនិត្យ និងបញ្ជាក់ការធ្វើលំហាត់គណិតវិទ្យាសិស្សបឋមសិក្សា (ថ្នាក់ទី៥ និងថ្នាក់ទី៦) នៅម៉ោង ៧:០០ ល្ងាច។ ឆ្លើយតបជា JSON ជាភាសាខ្មែរ។',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              verificationBadge: {
                type: Type.STRING,
                description:
                  'Short official verification status badge in Khmer, e.g., ✓ AI Agent បានបញ្ជាក់៖ ធ្វើលំហាត់រួចរាល់ (១០/១០ ស្លាយ)',
              },
              agentFeedback: {
                type: Type.STRING,
                description:
                  '2-3 encouraging sentences in Khmer praising the student by name, confirming their "ខ្ញុំបានធ្វើហើយ" report, and highlighting the math concepts practiced.',
              },
              quickCheckQuestion: {
                type: Type.STRING,
                description:
                  'One short, friendly oral verification question in Khmer related to the lesson so the student can prove they understood what they completed.',
              },
              parentSummaryMessage: {
                type: Type.STRING,
                description:
                  'A clear Khmer Telegram notification message for the parent confirming that the student completed their exercises and verified with the AI Agent.',
              },
            },
            required: [
              'verificationBadge',
              'agentFeedback',
              'quickCheckQuestion',
              'parentSummaryMessage',
            ],
          },
        },
      });

      const rawText = response.text?.trim();
      if (rawText) {
        const parsed = JSON.parse(rawText);
        if (parsed.verificationBadge) verificationBadge = parsed.verificationBadge;
        if (parsed.agentFeedback) agentFeedback = parsed.agentFeedback;
        if (parsed.quickCheckQuestion) quickCheckQuestion = parsed.quickCheckQuestion;
        if (parsed.parentSummaryMessage) parentSummaryMessage = parsed.parentSummaryMessage;
      }
    } catch (err) {
      console.error('Gemini AI Agent confirmation error:', err);
    }
  }

  const appUrl = process.env.APP_URL || 'https://aistudio.google.com';
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(
    appUrl
  )}&text=${encodeURIComponent(parentSummaryMessage)}`;

  const newRecord: AiCompletionConfirmationRecord = {
    id: `ai-conf-${Date.now()}`,
    timestamp: `ថ្ងៃនេះ · ${nowStr}`,
    studentName,
    studentClass,
    grade: Number(grade) === 6 ? 6 : 5,
    lessonTitle,
    studentDeclaration,
    solvedCount,
    totalSlides,
    bonusPointsAwarded,
    verificationBadge,
    agentFeedback,
    quickCheckQuestion,
    parentSummaryMessage,
    telegramShareUrl,
  };

  aiCompletionConfirmations.unshift(newRecord);

  // Update primaryStudents roster
  primaryStudents = primaryStudents.map((stu) => {
    if (stu.id === studentId || stu.name === studentName) {
      return {
        ...stu,
        todaySlidesCompleted: Math.max(stu.todaySlidesCompleted, solvedCount),
        totalPoints: ( totalPoints || stu.totalPoints ) + bonusPointsAwarded,
        attended7PmToday: true,
        lastActiveTime: `ថ្ងៃនេះ · ${nowStr} (បញ្ជាក់រួចជាមួយ AI)`,
      };
    }
    return stu;
  });

  let telegramLog: TelegramReminderLog | null = null;
  if (autoNotifyTelegram) {
    telegramLog = await dispatchTelegramMessage(
      'completion-report',
      {
        studentName,
        studentClass,
      },
      {
        solvedCount,
        totalPoints: totalPoints + bonusPointsAwarded,
        streakDays,
        lessonTitle,
      }
    );
  }

  res.json({
    ok: true,
    record: newRecord,
    confirmations: aiCompletionConfirmations.slice(0, 20),
    students: primaryStudents,
    telegramLog,
  });
});

// API: Student replies to the AI Agent's quick verification question
app.post('/api/ai-agent/reply-check', async (req, res) => {
  const { confirmationId, studentName, lessonTitle, question, studentReply } = req.body || {};

  let followUpResponse = `ល្អណាស់ ${studentName || 'ប្អូនសិស្ស'}! ការពន្យល់របស់ប្អូនបង្ហាញថាប្អូនពិតជាបានធ្វើលំហាត់ និងយល់ខ្លឹមសារមេរៀន «${lessonTitle || 'គណិតវិទ្យា'}» ដោយខ្លួនឯងពិតប្រាកដមែន។`;

  const ai = getGenAIClient();
  if (ai && studentReply) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          `សិស្សឈ្មោះ៖ ${studentName || 'សិស្សបឋមសិក្សា'}`,
          `មេរៀន៖ ${lessonTitle || 'គណិតវិទ្យា'}`,
          `សំណួរផ្ទៀងផ្ទាត់របស់ AI Agent៖ ${question || ''}`,
          `ចម្លើយឆ្លើយតបរបស់សិស្ស៖ "${studentReply}"`,
          `សូមវាយតម្លៃចម្លើយរបស់សិស្សដោយខ្លី (២ ប្រយោគ) ជាភាសាខ្មែរ ដោយលើកទឹកចិត្ត និងកែតម្រូវដោយទន់ភ្លន់ប្រសិនបើមានចំណុចខ្វះខាត។`,
        ].join('\n'),
        config: {
          systemInstruction:
            'អ្នកគឺជាគ្រូជំនួយការ AI គណិតវិទ្យាបឋមសិក្សា។ ឆ្លើយតបជាភាសាខ្មែរខ្លីៗ ច្បាស់លាស់ និងលើកទឹកចិត្តសិស្ស។',
        },
      });
      if (response.text?.trim()) {
        followUpResponse = response.text.trim();
      }
    } catch (err) {
      console.error('Gemini AI Agent reply-check error:', err);
    }
  }

  const target = aiCompletionConfirmations.find((c) => c.id === confirmationId);
  if (target) {
    target.studentReplyToCheck = studentReply;
    target.agentFollowUpResponse = followUpResponse;
  }

  res.json({
    ok: true,
    followUpResponse,
    confirmations: aiCompletionConfirmations.slice(0, 20),
  });
});

async function startServer() {
  const PORT = Number(process.env.PORT) || 3000;

  // Background check every 30 seconds for 18:45 (6:45 PM - 15 minutes before 7:00 PM)
  setInterval(() => {
    if (!parentConfig.autoRemindEnabled) return;
    const now = new Date();
    const dateKey = now.toISOString().slice(0, 10);
    if (now.getHours() === 18 && now.getMinutes() === 45 && lastAutoSentDate !== dateKey) {
      lastAutoSentDate = dateKey;
      dispatchTelegramMessage('pre-15min').catch(() => {});
    }
  }, 30000);

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
