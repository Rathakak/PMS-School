import React, { useEffect, useState } from 'react';
import {
  BellRing,
  CheckCircle2,
  Copy,
  ExternalLink,
  MessageSquare,
  Send,
  Clock,
} from 'lucide-react';

export interface TelegramReminderLogItem {
  id: string;
  timestamp: string;
  type: 'pre-15min' | 'completion-report';
  recipient: string;
  messageText: string;
  status: 'sent-via-bot' | 'ready-telegram-link' | 'bot-error';
  detail: string;
  telegramShareUrl: string;
}

export interface ParentTelegramConfigData {
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

interface TelegramParentReminderCardProps {
  studentName: string;
  studentClass: string;
  solvedCount: number;
  totalPoints: number;
  streakDays: number;
  currentLessonTitle: string;
  compact?: boolean;
}

export const TelegramParentReminderCard: React.FC<TelegramParentReminderCardProps> = ({
  studentName,
  studentClass,
  solvedCount,
  totalPoints,
  streakDays,
  currentLessonTitle,
  compact = false,
}) => {
  const [botConfigured, setBotConfigured] = useState<boolean>(false);
  const [config, setConfig] = useState<ParentTelegramConfigData>({
    parentName: 'អាណាព្យាបាលសិស្ស',
    recipientChatOrUsername: '@parent_guardian_kh',
    studentName,
    studentClass,
    leadMinutes: 15,
    reminderTime: '18:45',
    studyTime: '19:00',
    autoRemindEnabled: true,
    sendCompletionSummary: true,
    customNote:
      'សូមជួយរំលឹក និងលើកទឹកចិត្តកូនឱ្យចូលធ្វើលំហាត់គណិតវិទ្យាទាំង ១០ ស្លាយឱ្យទាន់ម៉ោង ៧:០០ ល្ងាច។',
  });
  const [logs, setLogs] = useState<TelegramReminderLogItem[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load initial status from backend
  useEffect(() => {
    fetch('/api/telegram/status')
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setBotConfigured(Boolean(data.botConfigured));
          if (data.config) {
            setConfig((prev) => ({
              ...prev,
              ...data.config,
              studentName: studentName || data.config.studentName,
              studentClass: studentClass || data.config.studentClass,
            }));
          }
          if (Array.isArray(data.logs)) {
            setLogs(data.logs);
          }
        }
      })
      .catch(() => {});
  }, [studentName, studentClass]);

  // Calculate countdown to 18:45 (6:45 PM - 15 minutes before 7:00 PM)
  const countdownTo645Pm = (() => {
    const is645Window = now.getHours() === 18 && now.getMinutes() >= 45;
    if (is645Window) {
      return 'ដល់ម៉ោងរំលឹកអាណាព្យាបាល ៦:៤៥ ល្ងាចហើយ (មុន ១៥ នាទី)!';
    }
    const target = new Date(now);
    target.setHours(18, 45, 0, 0);
    if (now >= target) {
      target.setDate(target.getDate() + 1);
    }
    const diffSec = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
    const h = Math.floor(diffSec / 3600);
    const m = Math.floor((diffSec % 3600) / 60);
    const s = diffSec % 60;
    return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}mn ${String(s).padStart(2, '0')}s`;
  })();

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedbackBanner(null);
    try {
      const res = await fetch('/api/telegram/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...config,
          studentName,
          studentClass,
        }),
      });
      const data = await res.json();
      if (data.ok && data.config) {
        setConfig(data.config);
        setFeedbackBanner(
          'បានរក្សាទុកការកំណត់រំលឹកមុន ១៥ នាទី (ម៉ោង ៦:៤៥ ល្ងាច) ទៅអាណាព្យាបាលតាម Telegram រួចរាល់!'
        );
      }
    } catch {
      setFeedbackBanner('បានរក្សាទុកការកំណត់រំលឹក Telegram ក្នុងកម្មវិធី។');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTriggerTelegramReminder = async (type: 'pre-15min' | 'completion-report') => {
    setIsSending(true);
    setFeedbackBanner(null);
    try {
      // Save latest config first
      await fetch('/api/telegram/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...config,
          studentName,
          studentClass,
        }),
      });

      const res = await fetch('/api/telegram/send-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          solvedCount,
          totalPoints,
          streakDays,
          lessonTitle: currentLessonTitle,
        }),
      });
      const data = await res.json();
      if (data.ok && data.log) {
        if (Array.isArray(data.logs)) {
          setLogs(data.logs);
        } else {
          setLogs((prev) => [data.log, ...prev]);
        }
        setFeedbackBanner(
          type === 'pre-15min'
            ? 'បានបង្កើត និងបញ្ជូនសាររំលឹកមុន ១៥ នាទី (៦:៤៥ ល្ងាច) ទៅ Telegram អាណាព្យាបាលរួចរាល់!'
            : 'បានបញ្ជូនរបាយការណ៍លទ្ធផល ១០ ស្លាយទៅ Telegram អាណាព្យាបាលរួចរាល់!'
        );
      }
    } catch {
      setFeedbackBanner('មិនអាចភ្ជាប់ទៅម៉ាស៊ីនមេបានទេ សូមព្យាយាមម្ដងទៀត។');
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const latestLog = logs[0];

  if (compact) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BellRing className="w-4 h-4 text-sky-700 shrink-0" />
            <h2 className="text-sm font-bold text-slate-900">
              រំលឹកអាណាព្យាបាលមុន ១៥ នាទី (Telegram)
            </h2>
          </div>
          <span className="text-xs font-mono font-semibold text-sky-800">
            ម៉ោង 18:45 ល្ងាច
          </span>
        </div>

        <div className="p-3.5 bg-sky-50/60 border border-sky-200 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>រាប់ថយក្រោយដល់ម៉ោងរំលឹក ៦:៤៥ ល្ងាច៖</span>
            <span className="font-mono font-bold tabular-nums text-sky-900">
              {countdownTo645Pm}
            </span>
          </div>
          <div className="text-xs text-slate-700">
            អ្នកទទួល៖ <span className="font-semibold">{config.parentName}</span> (
            <span className="font-mono">{config.recipientChatOrUsername}</span>)
          </div>
        </div>

        {feedbackBanner && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-950 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{feedbackBanner}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            disabled={isSending}
            onClick={() => handleTriggerTelegramReminder('pre-15min')}
            className="py-2 px-3 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>ផ្ញើសាររំលឹកមុន ១៥ នាទីឥឡូវនេះ</span>
          </button>

          <button
            type="button"
            disabled={isSending}
            onClick={() => handleTriggerTelegramReminder('completion-report')}
            className="py-2 px-3 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-sky-700" />
            <span>ផ្ញើលទ្ធផល ({solvedCount}/10 ស្លាយ)</span>
          </button>
        </div>

        {latestLog && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>សារចុងក្រោយ៖ {latestLog.timestamp}</span>
              <a
                href={latestLog.telegramShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sky-700 font-semibold hover:underline"
              >
                <span>បើកផ្ញើក្នុង Telegram</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <pre className="text-xs font-sans text-slate-700 whitespace-pre-wrap leading-relaxed bg-white p-2.5 rounded border border-slate-200">
              {latestLog.messageText}
            </pre>
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold text-sky-800">
            ប្រព័ន្ធជូនដំណឹងអាណាព្យាបាល · រំលឹកមុន ១៥ នាទី (ម៉ោង ៦:៤៥ ល្ងាច → ម៉ោង ៧:០០ ល្ងាច)
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            ការរំលឹកមុន ១៥ នាទីទៅអាណាព្យាបាលតាម Telegram
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
            ប្រព័ន្ធនឹងផ្ញើសាររំលឹកទៅកាន់ Telegram របស់អាណាព្យាបាលនៅវេលាម៉ោង <strong>៦:៤៥ ល្ងាច (18:45)</strong>{' '}
            គឺមុនម៉ោងចូលធ្វើលំហាត់ ៧:០០ ល្ងាច ចំនួន <strong>១៥ នាទី</strong> ជារៀងរាល់ថ្ងៃ។
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
          <Clock className="w-4 h-4 text-sky-700 shrink-0" />
          <span>រាប់ថយក្រោយដល់ 18:45 ៖ {countdownTo645Pm}</span>
        </div>
      </div>

      {feedbackBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs sm:text-sm text-emerald-950 flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{feedbackBanner}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 6 cols: Parent Telegram Settings Form */}
        <form onSubmit={handleSaveSettings} className="lg:col-span-6 space-y-4 bg-slate-50 border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">
              ព័ត៌មាន Telegram របស់អាណាព្យាបាល និងម៉ោងរំលឹក
            </h3>
            <span className="text-xs text-slate-500">
              {botConfigured ? '✓ ភ្ជាប់ Telegram Bot រួចរាល់' : 'គាំទ្រតំណភ្ជាប់ Telegram ផ្ទាល់'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ឈ្មោះអាណាព្យាបាល / មាតាបិតា
              </label>
              <input
                type="text"
                value={config.parentName}
                onChange={(e) => setConfig({ ...config, parentName: e.target.value })}
                placeholder="ឧ. លោកពូ សុខា / អ្នកមីង ចាន់ណា"
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-sky-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                គណនី Telegram ឬ Chat ID អាណាព្យាបាល
              </label>
              <input
                type="text"
                value={config.recipientChatOrUsername}
                onChange={(e) =>
                  setConfig({ ...config, recipientChatOrUsername: e.target.value })
                }
                placeholder="ឧ. @parent_username ឬលេខ Chat ID"
                className="w-full px-3.5 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-sky-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-white border border-slate-200 rounded-lg text-xs">
            <div>
              <span className="text-slate-500 block">ម៉ោងរំលឹកអាណាព្យាបាល</span>
              <span className="font-mono font-bold text-sky-800 text-sm">
                18:45 (៦:៤៥ ល្ងាច)
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">រយៈពេលរំលឹកមុន</span>
              <span className="font-mono font-bold text-amber-800 text-sm">
                មុន ១៥ នាទី
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">ម៉ោងចូលធ្វើលំហាត់</span>
              <span className="font-mono font-bold text-emerald-800 text-sm">
                19:00 (៧:០០ ល្ងាច)
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              សារផ្ដាំផ្ញើបន្ថែមទៅកាន់អាណាព្យាបាល
            </label>
            <textarea
              rows={2}
              value={config.customNote}
              onChange={(e) => setConfig({ ...config, customNote: e.target.value })}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-sky-600"
            />
          </div>

          <div className="space-y-2 pt-1">
            <label className="flex items-center gap-2.5 text-xs text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={config.autoRemindEnabled}
                onChange={(e) =>
                  setConfig({ ...config, autoRemindEnabled: e.target.checked })
                }
                className="w-4 h-4 accent-sky-700 rounded cursor-pointer"
              />
              <span className="font-medium">
                បើកការរំលឹកស្វ័យប្រវត្តិមុន ១៥ នាទី (រៀងរាល់ម៉ោង ៦:៤៥ ល្ងាច)
              </span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={config.sendCompletionSummary}
                onChange={(e) =>
                  setConfig({ ...config, sendCompletionSummary: e.target.checked })
                }
                className="w-4 h-4 accent-sky-700 rounded cursor-pointer"
              />
              <span className="font-medium">
                ផ្ញើរបាយការណ៍ពិន្ទុ និងរង្វាន់ទៅអាណាព្យាបាលពេលកូនធ្វើចប់គ្រប់ ១០ ស្លាយ
              </span>
            </label>
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isSaving ? 'កំពុងរក្សាទុក...' : 'រក្សាទុកការកំណត់ Telegram'}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isSending}
                onClick={() => handleTriggerTelegramReminder('pre-15min')}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>សាកល្បងផ្ញើសាររំលឹកមុន ១៥ នាទី</span>
              </button>
            </div>
          </div>
        </form>

        {/* Right 6 cols: Live Preview & Telegram Notification Log */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              ទម្រង់សាររំលឹក Telegram និងកំណត់ត្រាបញ្ជូន ({logs.length})
            </h3>
            <button
              type="button"
              disabled={isSending}
              onClick={() => handleTriggerTelegramReminder('completion-report')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>ផ្ញើរបាយការណ៍លទ្ធផល ១០ ស្លាយ</span>
            </button>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {logs.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">
                      {item.type === 'pre-15min'
                        ? '🔔 រំលឹកមុន ១៥ នាទី (18:45)'
                        : '🏆 របាយការណ៍បញ្ចប់ ១០ ស្លាយ'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{item.recipient}</span>
                  </div>
                  <span className="font-mono">{item.timestamp}</span>
                </div>

                <pre className="text-xs font-sans text-slate-800 bg-white p-3 rounded-lg border border-slate-200 whitespace-pre-wrap leading-relaxed">
                  {item.messageText}
                </pre>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <span className="text-xs text-slate-600">{item.detail}</span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyMessage(item.id, item.messageText)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedId === item.id ? 'បានចម្លង!' : 'ចម្លងសារ'}</span>
                    </button>

                    <a
                      href={item.telegramShareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-md transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>បើកផ្ញើក្នុង Telegram</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
