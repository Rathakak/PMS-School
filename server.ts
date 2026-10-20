import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
