import React, { useEffect, useState } from 'react';
import { GRADE_6_LESSONS, Grade6Lesson } from '../data/grade6Curriculum';
import { GRADE_5_LESSONS } from '../data/grade5Curriculum';
import { BookOpen, ExternalLink, FileText, Play } from 'lucide-react';

interface CurriculumAndPdfViewProps {
  selectedGrade: 5 | 6;
  onSelectGrade: (grade: 5 | 6) => void;
  onSelectLessonDeck: (grade: 5 | 6, lessonId: number) => void;
}

export const CurriculumAndPdfView: React.FC<CurriculumAndPdfViewProps> = ({
  selectedGrade,
  onSelectGrade,
  onSelectLessonDeck,
}) => {
  const lessonsList = selectedGrade === 5 ? GRADE_5_LESSONS : GRADE_6_LESSONS;
  const [selectedPdfLesson, setSelectedPdfLesson] = useState<Grade6Lesson>(lessonsList[0]);
  const [showPdfViewer, setShowPdfViewer] = useState(true);

  useEffect(() => {
    const list = selectedGrade === 5 ? GRADE_5_LESSONS : GRADE_6_LESSONS;
    setSelectedPdfLesson(list[0]);
  }, [selectedGrade]);

  const basePdfPath =
    selectedGrade === 5
      ? '/assets/aistudio/Math_Grade_5_48c56869.pdf'
      : '/assets/aistudio/Mathe_Grade_6_fbc35c15.pdf';

  const pdfUrl = `${basePdfPath}#page=${selectedPdfLesson.pdfPage}`;

  return (
    <div className="space-y-8">
      {/* Header & Grade 5 / Grade 6 Textbook Switcher */}
      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-200">
          <div>
            <div className="text-xs text-slate-500">
              ក្រសួងអប់រំ យុវជន និងកីឡា · គ្រឹះស្ថានបោះពុម្ពនិងចែកផ្សាយ · សៀវភៅគណិតវិទ្យាថ្នាក់ទី៥ និងថ្នាក់ទី៦
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              សៀវភៅពុម្ពគណិតវិទ្យាថ្នាក់ទី{selectedGrade === 5 ? '៥ (១៨ មេរៀន)' : '៦ (២០ មេរៀន)'}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Segmented Grade Switcher */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => onSelectGrade(5)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedGrade === 5
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                សៀវភៅថ្នាក់ទី ៥ (១៨ មេរៀន)
              </button>
              <button
                type="button"
                onClick={() => onSelectGrade(6)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedGrade === 6
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                សៀវភៅថ្នាក់ទី ៦ (២០ មេរៀន)
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowPdfViewer((prev) => !prev)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-sky-700" />
              <span>{showPdfViewer ? 'លាក់ផ្ទាំងសៀវភៅ PDF' : 'បើកមើលសៀវភៅពុម្ព PDF'}</span>
            </button>

            <a
              href={basePdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <span>បើកសៀវភៅថ្នាក់ទី{selectedGrade === 5 ? '៥' : '៦'}ពេញ</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Embedded PDF Viewer */}
        {showPdfViewer && (
          <div className="mb-8 bg-slate-900 rounded-xl overflow-hidden border border-slate-300">
            <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 bg-slate-800 text-white text-xs">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-400" />
                <span className="font-semibold">
                  ថ្នាក់ទី {selectedGrade} · {selectedPdfLesson.title}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-slate-300">
                  ទំព័រសៀវភៅពុម្ពទី {selectedPdfLesson.bookPage} (PDF ទំព័រ {selectedPdfLesson.pdfPage})
                </span>
              </div>
              <button
                type="button"
                onClick={() => onSelectLessonDeck(selectedGrade, selectedPdfLesson.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>អនុវត្ត ១០ ស្លាយនៃមេរៀននេះ</span>
              </button>
            </div>
            <iframe
              key={pdfUrl}
              src={pdfUrl}
              title={`សៀវភៅគណិតវិទ្យាថ្នាក់ទី${selectedGrade}`}
              className="w-full h-[520px] bg-slate-100"
            />
          </div>
        )}

        {/* All Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lessonsList.map((lesson) => {
            const isSelected = selectedPdfLesson.id === lesson.id;
            return (
              <div
                key={`${selectedGrade}-${lesson.id}`}
                className={`p-5 rounded-xl border transition-colors flex flex-col justify-between ${
                  isSelected
                    ? 'bg-sky-50/40 border-sky-300'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1.5">
                    <span className="font-mono">
                      គណិតវិទ្យាថ្នាក់ទី {selectedGrade} · មេរៀនទី {lesson.id}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">ទំព័រទី {lesson.bookPage}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{lesson.title}</h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{lesson.summary}</p>

                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                    {lesson.keyFormulas.map((f, idx) => (
                      <div key={idx} className="text-xs font-mono text-slate-700">
                        • {f}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPdfLesson(lesson);
                      setShowPdfViewer(true);
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    បើកសៀវភៅទំព័រទី {lesson.bookPage}
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectLessonDeck(selectedGrade, lesson.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>ធ្វើលំហាត់ ១០ ស្លាយ</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
