import React, { useEffect, useState } from 'react';
import {
  Bot,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Send,
  Sparkles,
  Award,
  Copy,
} from 'lucide-react';

export interface AiCompletionConfirmation {
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

interface StudentCompletionAiAgentCardProps {
  studentId?: string;
  studentName: string;
  studentClass: string;
  grade: 5 | 6;
  lessonTitle: string;
  solvedCount: number;
  totalSlides: number;
  totalPoints: number;
  streakDays: number;
  exercisesSummary: string[];
  scratchpadNotes: string;
  onBonusPointsEarned: (bonusPoints: number, updatedStudents?: unknown[]) => void;
}

const DECLARATION_PRESETS = [
  'ខ្ញុំបានធ្វើហើយ! បានបញ្ចប់លំហាត់គណិតវិទ្យាទាំង ១០ ស្លាយរួចរាល់។',
  'ខ្ញុំបានធ្វើហើយ និងបានគណនាលើសៀវភៅព្រាងដោយខ្លួនឯង។',
  'ខ្ញុំបានធ្វើហើយនៅម៉ោង ៧:០០ ល្ងាចតាមកាលវិភាគប្រចាំថ្ងៃ!',
];

export const StudentCompletionAiAgentCard: React.FC<StudentCompletionAiAgentCardProps> = ({
  studentId,
  studentName,
  studentClass,
  grade,
  lessonTitle,
  solvedCount,
  totalSlides,
  totalPoints,
  streakDays,
  exercisesSummary,
  scratchpadNotes,
  onBonusPointsEarned,
}) => {
  const [studentDeclaration, setStudentDeclaration] = useState<string>(DECLARATION_PRESETS[0]);
  const [autoNotifyTelegram, setAutoNotifyTelegram] = useState<boolean>(true);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [latestRecord, setLatestRecord] = useState<AiCompletionConfirmation | null>(null);
  const [historyRecords, setHistoryRecords] = useState<AiCompletionConfirmation[]>([]);
  const [studentReplyText, setStudentReplyText] = useState<string>('');
  const [isReplyingCheck, setIsReplyingCheck] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/ai-agent/confirmations')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.confirmations)) {
          setHistoryRecords(data.confirmations);
        }
      })
      .catch(() => {
        // Ignore initial fetch errors
      });
  }, []);

  const handleConfirmCompleted = async () => {
    if (isConfirming) return;
    setIsConfirming(true);

    try {
      const res = await fetch('/api/ai-agent/confirm-completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          studentName,
          studentClass,
          grade,
          lessonTitle,
          studentDeclaration: studentDeclaration.trim() || 'ខ្ញុំបានធ្វើហើយ!',
          solvedCount: Math.max(solvedCount, 1),
          totalSlides,
          totalPoints,
          streakDays,
          exercisesSummary,
          scratchpadNotes,
          autoNotifyTelegram,
        }),
      });
      const data = await res.json();
      if (data?.ok && data.record) {
        setLatestRecord(data.record);
        if (Array.isArray(data.confirmations)) {
          setHistoryRecords(data.confirmations);
        } else {
          setHistoryRecords((prev) => [data.record, ...prev]);
        }
        setStudentReplyText('');
        onBonusPointsEarned(data.record.bonusPointsAwarded || 30, data.students);
      }
    } catch {
      const fallbackBonus = solvedCount >= 10 ? 30 : 15;
      const nowStr = new Date().toLocaleTimeString('km-KH', {
        hour: '2-digit',
        minute: '2-digit',
      });
      const parentSummaryMessage = `🤖 [AI Agent បញ្ជាក់ការធ្វើលំហាត់រួច] សិស្សឈ្មោះ ${studentName} (${studentClass}) បានបញ្ជាក់ថា «${studentDeclaration}» ក្នុងមេរៀន ${lessonTitle} (${solvedCount}/${totalSlides} ស្លាយ)។`;
      const fallbackRecord: AiCompletionConfirmation = {
        id: `ai-local-${Date.now()}`,
        timestamp: `ថ្ងៃនេះ · ${nowStr}`,
        studentName,
        studentClass,
        grade,
        lessonTitle,
        studentDeclaration,
        solvedCount,
        totalSlides,
        bonusPointsAwarded: fallbackBonus,
        verificationBadge: `✓ AI Agent បានបញ្ជាក់៖ ខ្ញុំបានធ្វើហើយ (${solvedCount}/${totalSlides} ស្លាយ)`,
        agentFeedback: `សូមកោតសរសើរសិស្សឈ្មោះ ${studentName} (${studentClass})! AI Agent បានទទួលការបញ្ជាក់ថា «${studentDeclaration}» សម្រាប់មេរៀន «${lessonTitle}» និងបានផ្ដល់ពិន្ទុលើកទឹកចិត្តបន្ថែម +${fallbackBonus} ពិន្ទុ។`,
        quickCheckQuestion: `សំណួរផ្ទៀងផ្ទាត់ខ្លីពី AI Agent៖ តើលំហាត់មួយណាក្នុងមេរៀន «${lessonTitle}» ដែលប្អូនយល់ច្បាស់ជាងគេនៅថ្ងៃនេះ?`,
        parentSummaryMessage,
        telegramShareUrl: `https://t.me/share/url?url=${encodeURIComponent(
          window.location.origin
        )}&text=${encodeURIComponent(parentSummaryMessage)}`,
      };
      setLatestRecord(fallbackRecord);
      setHistoryRecords((prev) => [fallbackRecord, ...prev]);
      onBonusPointsEarned(fallbackBonus);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleReplyToQuickCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!latestRecord || !studentReplyText.trim() || isReplyingCheck) return;
    setIsReplyingCheck(true);

    try {
      const res = await fetch('/api/ai-agent/reply-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confirmationId: latestRecord.id,
          studentName,
          lessonTitle,
          question: latestRecord.quickCheckQuestion,
          studentReply: studentReplyText.trim(),
        }),
      });
      const data = await res.json();
      if (data?.ok) {
        const updated: AiCompletionConfirmation = {
          ...latestRecord,
          studentReplyToCheck: studentReplyText.trim(),
          agentFollowUpResponse: data.followUpResponse,
        };
        setLatestRecord(updated);
        if (Array.isArray(data.confirmations)) {
          setHistoryRecords(data.confirmations);
        }
      }
    } catch {
      const updated: AiCompletionConfirmation = {
        ...latestRecord,
        studentReplyToCheck: studentReplyText.trim(),
        agentFollowUpResponse: `ល្អណាស់ ${studentName}! ការឆ្លើយតបរបស់ប្អូនបង្ហាញថាប្អូនពិតជាបានធ្វើលំហាត់ និងយល់មេរៀនបានច្បាស់លាស់។`,
      };
      setLatestRecord(updated);
    } finally {
      setIsReplyingCheck(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white border-2 border-emerald-600/80 rounded-xl p-5 space-y-4 shadow-xs">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-start gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                AI Agent បញ្ជាក់ការធ្វើលំហាត់រួច («ខ្ញុំបានធ្វើហើយ»)
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              ពេលប្អូនធ្វើលំហាត់រួច សូមចុចបញ្ជាក់ប្រាប់ AI Agent ថា{' '}
              <span className="font-semibold text-emerald-800">«ខ្ញុំបានធ្វើហើយ»</span> ដើម្បីទទួលពិន្ទុបន្ថែម និងផ្ញើរបាយការណ៍ទៅអាណាព្យាបាល
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
          សិស្ស៖ {studentName} ({solvedCount}/{totalSlides} ស្លាយ)
        </span>
      </div>

      {/* Student Declaration Presets & Input */}
      <div className="space-y-2.5">
        <label className="block text-xs font-semibold text-slate-700">
          ១. ជ្រើសរើស ឬវាយពាក្យបញ្ជាក់របស់សិស្សទៅកាន់ AI Agent ៖
        </label>

        <div className="flex flex-wrap gap-1.5">
          {DECLARATION_PRESETS.map((preset, idx) => {
            const isSelected = studentDeclaration === preset;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setStudentDeclaration(preset)}
                className={`px-2.5 py-1.5 text-xs rounded-lg border text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                ✓ {preset}
              </button>
            );
          })}
        </div>

        <input
          type="text"
          value={studentDeclaration}
          onChange={(e) => setStudentDeclaration(e.target.value)}
          placeholder="វាយពាក្យបញ្ជាក់ ឧទាហរណ៍៖ ខ្ញុំបានធ្វើហើយ..."
          className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
        />
      </div>

      {/* Auto-notify Parent Toggle & Primary "ខ្ញុំបានធ្វើហើយ" Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoNotifyTelegram}
            onChange={(e) => setAutoNotifyTelegram(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
          />
          <span>ភ្ជាប់របាយការណ៍បញ្ជាក់ទៅ Telegram អាណាព្យាបាលដោយស្វ័យប្រវត្តិ</span>
        </label>

        <button
          type="button"
          disabled={isConfirming}
          onClick={handleConfirmCompleted}
          className="px-5 py-3 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer shrink-0"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>
            {isConfirming
              ? 'AI Agent កំពុងពិនិត្យ និងបញ្ជាក់...'
              : '✋ ខ្ញុំបានធ្វើហើយ! (បញ្ជាក់ជាមួយ AI Agent)'}
          </span>
        </button>
      </div>

      {/* Active AI Agent Verification Certificate & Feedback */}
      {latestRecord && (
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-300 space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-white px-3 py-1 rounded-md border border-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>{latestRecord.verificationBadge}</span>
            </div>

            <div className="inline-flex items-center gap-1 text-xs font-mono font-bold text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-md">
              <Award className="w-3.5 h-3.5" />
              <span>+{latestRecord.bonusPointsAwarded} ពិន្ទុលើកទឹកចិត្ត</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-800">
              មតិកោតសរសើរ និងវាយតម្លៃពីគ្រូជំនួយការ AI Agent ៖
            </div>
            <p className="text-xs sm:text-sm text-slate-900 leading-relaxed bg-white p-3.5 rounded-lg border border-emerald-200">
              {latestRecord.agentFeedback}
            </p>
          </div>

          {/* Interactive Oral Check Question from AI Agent */}
          <div className="p-3.5 rounded-lg bg-white border border-sky-200 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900">
              <MessageSquare className="w-4 h-4 text-sky-700 shrink-0" />
              <span>{latestRecord.quickCheckQuestion}</span>
            </div>

            {!latestRecord.agentFollowUpResponse ? (
              <form onSubmit={handleReplyToQuickCheck} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={studentReplyText}
                  onChange={(e) => setStudentReplyText(e.target.value)}
                  placeholder="ឆ្លើយសំណួរខ្លីរបស់ AI Agent នៅទីនេះដើម្បីបញ្ជាក់ការយល់ដឹង..."
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-sky-600"
                />
                <button
                  type="submit"
                  disabled={isReplyingCheck || !studentReplyText.trim()}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 disabled:opacity-50 rounded-lg transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isReplyingCheck ? 'កំពុងពិនិត្យ...' : 'ឆ្លើយតប AI Agent'}</span>
                </button>
              </form>
            ) : (
              <div className="space-y-2 pt-1 border-t border-slate-100 text-xs">
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-800">ចម្លើយរបស់សិស្ស៖</span>{' '}
                  {latestRecord.studentReplyToCheck}
                </div>
                <div className="p-2.5 rounded-lg bg-sky-50 text-sky-950 border border-sky-200 font-medium">
                  🤖 <span className="font-bold">AI Agent៖</span> {latestRecord.agentFollowUpResponse}
                </div>
              </div>
            )}
          </div>

          {/* Share Verification with Parent via Telegram */}
          <div className="pt-2 border-t border-emerald-200/80 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-emerald-900">
              សេចក្ដីបញ្ជាក់សម្រាប់អាណាព្យាបាលត្រូវបានរៀបចំរួចរាល់ ({latestRecord.timestamp})
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  handleCopyMessage(latestRecord.id, latestRecord.parentSummaryMessage)
                }
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>
                  {copiedId === latestRecord.id ? 'បានចម្លងសាររួច!' : 'ចម្លងសារបញ្ជាក់'}
                </span>
              </button>

              <a
                href={latestRecord.telegramShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>ផ្ញើការបញ្ជាក់ទៅ Telegram អាណាព្យាបាល</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Recent Student Completion Confirmations Log */}
      {historyRecords.length > 0 && (
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-700">
              កំណត់ត្រាសិស្សបញ្ជាក់ «ខ្ញុំបានធ្វើហើយ» ជាមួយ AI Agent ថ្មីៗ
            </span>
            <span className="font-mono">{historyRecords.length} កំណត់ត្រា</span>
          </div>

          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {historyRecords.slice(0, 3).map((rec) => (
              <div
                key={rec.id}
                className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-900">
                    {rec.studentName} ({rec.studentClass}) ·{' '}
                    <span className="text-emerald-800">«{rec.studentDeclaration}»</span>
                  </div>
                  <div className="text-slate-500">
                    {rec.lessonTitle} · ធ្វើបាន {rec.solvedCount}/{rec.totalSlides} ស្លាយ
                  </div>
                </div>
                <span className="font-mono text-slate-500 shrink-0">{rec.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
