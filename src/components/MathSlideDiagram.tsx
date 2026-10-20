import React, { useState } from 'react';
import { MathSlideExercise } from '../data/grade6Curriculum';
import { Eye, Layers, Sliders } from 'lucide-react';

interface MathSlideDiagramProps {
  exercise: MathSlideExercise;
  isSolved: boolean;
}

export const MathSlideDiagram: React.FC<MathSlideDiagramProps> = ({ exercise, isSolved }) => {
  const [showOverlayLabels, setShowOverlayLabels] = useState(true);
  const [interactiveScale, setInteractiveScale] = useState(100);

  const { diagramType, diagramProps } = exercise;

  const renderVisualSvg = () => {
    switch (diagramType) {
      case 'place-value':
        return (
          <svg viewBox="0 0 560 190" className="w-full h-44 select-none">
            <rect x="10" y="12" width="540" height="166" rx="10" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            {/* 3 Classes Header: ថ្នាក់លាន | ថ្នាក់ពាន់ | ថ្នាក់ឯកតា */}
            <rect x="24" y="24" width="168" height="32" rx="4" fill="#E0F2FE" stroke="#7DD3FC" />
            <text x="108" y="45" textAnchor="middle" className="text-xs font-semibold fill-sky-900">
              ថ្នាក់លាន (លាន)
            </text>
            <rect x="196" y="24" width="168" height="32" rx="4" fill="#F1F5F9" stroke="#CBD5E1" />
            <text x="280" y="45" textAnchor="middle" className="text-xs font-semibold fill-slate-800">
              ថ្នាក់ពាន់ (សែន · ម៉ឺន · ពាន់)
            </text>
            <rect x="368" y="24" width="168" height="32" rx="4" fill="#ECFDF5" stroke="#6EE7B7" />
            <text x="452" y="45" textAnchor="middle" className="text-xs font-semibold fill-emerald-900">
              ថ្នាក់ឯកតា (រយ · ដប់ · រាយ)
            </text>

            {/* Primary Number Display */}
            <rect x="24" y="66" width="512" height="54" rx="6" fill="#FFFFFF" stroke="#E2E8F0" />
            <text x="280" y="101" textAnchor="middle" className="text-2xl font-mono font-bold fill-slate-900 tracking-widest">
              {diagramProps.primaryValue}
            </text>

            {showOverlayLabels && (
              <g>
                <rect x="24" y="130" width="248" height="34" rx="6" fill="#F0F9FF" stroke="#BAE6FD" />
                <text x="148" y="151" textAnchor="middle" className="text-xs font-medium fill-sky-800">
                  {diagramProps.labelA || 'ខ្ទង់គោល'}
                </text>
                <rect x="288" y="130" width="248" height="34" rx="6" fill={isSolved ? '#ECFDF5' : '#FFFBEB'} stroke={isSolved ? '#6EE7B7' : '#FDE68A'} />
                <text x="412" y="151" textAnchor="middle" className="text-xs font-medium fill-slate-800">
                  {isSolved ? `លទ្ធផល៖ ${diagramProps.secondaryValue}` : diagramProps.labelB || 'ពិនិត្យតម្លៃតាមខ្ទង់'}
                </text>
              </g>
            )}
          </svg>
        );

      case 'area-trapezoid':
        return (
          <svg viewBox="0 0 560 195" className="w-full h-44 select-none">
            <rect x="10" y="10" width="540" height="175" rx="10" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            {/* Trapezoid Polygon */}
            <polygon
              points="170,45 360,45 420,145 120,145"
              fill="#E0F2FE"
              fillOpacity={interactiveScale / 130}
              stroke="#0284C7"
              strokeWidth="2.5"
            />
            {/* Height dashed line */}
            <line x1="170" y1="45" x2="170" y2="145" stroke="#0F172A" strokeWidth="1.75" strokeDasharray="4 4" />
            <rect x="170" y="133" width="12" height="12" fill="none" stroke="#0F172A" strokeWidth="1.2" />

            {showOverlayLabels && (
              <g>
                <text x="265" y="36" textAnchor="middle" className="text-xs font-mono font-semibold fill-slate-900">
                  {diagramProps.labelA || 'បាតតូច a = 65m'}
                </text>
                <text x="270" y="168" textAnchor="middle" className="text-xs font-mono font-semibold fill-slate-900">
                  {diagramProps.labelB || 'បាតធំ b = 102m'}
                </text>
                <text x="225" y="98" textAnchor="middle" className="text-xs font-mono font-semibold fill-sky-900">
                  {diagramProps.labelC || 'h = 40m'}
                </text>
              </g>
            )}
            <text x="480" y="90" textAnchor="middle" className="text-xs font-mono fill-slate-600">
              A = (a+b)×h / 2
            </text>
          </svg>
        );

      case 'speed-motion':
        return (
          <svg viewBox="0 0 560 190" className="w-full h-44 select-none">
            <rect x="10" y="12" width="540" height="166" rx="10" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            {/* Main Road Line A to B */}
            <line x1="65" y1="110" x2="495" y2="110" stroke="#334155" strokeWidth="3" />
            <circle cx="65" cy="110" r="7" fill="#0284C7" />
            <circle cx="495" cy="110" r="7" fill="#D97706" />
            <text x="65" y="136" textAnchor="middle" className="text-sm font-bold fill-slate-900">
              ទី A
            </text>
            <text x="495" y="136" textAnchor="middle" className="text-sm font-bold fill-slate-900">
              ទី B
            </text>

            {/* Meeting Point Marker */}
            <line x1="210" y1="92" x2="210" y2="128" stroke="#059669" strokeWidth="2.5" strokeDasharray="3 3" />
            <circle cx="210" cy="110" r="5" fill="#059669" />

            {/* Velocity Vectors */}
            <g transform={`translate(${(interactiveScale - 50) * 0.35}, 0)`}>
              <rect x="75" y="54" width="115" height="28" rx="5" fill="#E0F2FE" stroke="#0284C7" />
              <text x="132" y="72" textAnchor="middle" className="text-xs font-mono font-semibold fill-sky-900">
                {diagramProps.labelA || 'v₁ = 12 km/h →'}
              </text>
            </g>
            <g transform={`translate(${-(interactiveScale - 50) * 0.55}, 0)`}>
              <rect x="355" y="54" width="125" height="28" rx="5" fill="#FEF3C7" stroke="#D97706" />
              <text x="417" y="72" textAnchor="middle" className="text-xs font-mono font-semibold fill-amber-900">
                {diagramProps.labelB || '← v₂ = 30 km/h'}
              </text>
            </g>

            {showOverlayLabels && (
              <text x="280" y="160" textAnchor="middle" className="text-xs font-mono font-semibold fill-slate-700">
                {diagramProps.labelC || 'ចម្ងាយសរុប AB = 84 km'}
              </text>
            )}
          </svg>
        );

      case 'solid-cylinder':
        return (
          <svg viewBox="0 0 560 195" className="w-full h-44 select-none">
            <rect x="10" y="10" width="540" height="175" rx="10" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            {/* Cylinder + Inner Cone */}
            <ellipse cx="220" cy="45" rx="65" ry="18" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
            <path d="M155,45 L155,145 A65,18 0 0,0 285,145 L285,45" fill="#BAE6FD" fillOpacity={interactiveScale / 140} stroke="#0284C7" strokeWidth="2" />
            <ellipse cx="220" cy="145" rx="65" ry="18" fill="none" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="4 4" />
            {/* Inner Cone (subtracted) */}
            <polygon points="220,45 155,145 285,145" fill="#FFFFFF" fillOpacity="0.82" stroke="#DC2626" strokeWidth="1.8" strokeDasharray="4 3" />
            {/* Radius and Height labels */}
            <line x1="220" y1="145" x2="285" y2="145" stroke="#0F172A" strokeWidth="2" />
            <line x1="305" y1="45" x2="305" y2="145" stroke="#0F172A" strokeWidth="1.5" />
            {showOverlayLabels && (
              <g>
                <text x="252" y="138" textAnchor="middle" className="text-xs font-mono font-bold fill-slate-900">
                  R = 3cm
                </text>
                <text x="342" y="98" textAnchor="middle" className="text-xs font-mono font-bold fill-slate-900">
                  h = 6cm
                </text>
                <text x="445" y="75" textAnchor="middle" className="text-xs font-mono fill-sky-900">
                  Vស៊ីឡាំង = πR²h
                </text>
                <text x="445" y="102" textAnchor="middle" className="text-xs font-mono fill-rose-800">
                  Vកោន = πR²h / 3
                </text>
                <text x="445" y="132" textAnchor="middle" className="text-xs font-mono font-semibold fill-emerald-800">
                  {isSolved ? diagramProps.labelC : 'Vឆ្អូត = Vស៊ីឡាំង - Vកោន'}
                </text>
              </g>
            )}
          </svg>
        );

      case 'angle-bisector':
        return (
          <svg viewBox="0 0 560 190" className="w-full h-44 select-none">
            <rect x="10" y="10" width="540" height="170" rx="10" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            {/* Straight Line A - B - D */}
            <line x1="90" y1="145" x2="470" y2="145" stroke="#0F172A" strokeWidth="2.5" />
            {/* Ray BC at 60 deg from BA */}
            <line x1="280" y1="145" x2="195" y2="38" stroke="#0284C7" strokeWidth="2.5" />
            {/* Bisector Ray BT at 60 deg from BD */}
            <line x1="280" y1="145" x2="365" y2="38" stroke="#059669" strokeWidth="2.2" strokeDasharray="5 3" />
            <circle cx="280" cy="145" r="4.5" fill="#0F172A" />
            <text x="100" y="165" className="text-xs font-mono font-bold fill-slate-900">A</text>
            <text x="280" y="165" textAnchor="middle" className="text-xs font-mono font-bold fill-slate-900">B</text>
            <text x="460" y="165" className="text-xs font-mono font-bold fill-slate-900">D</text>
            <text x="185" y="34" className="text-xs font-mono font-bold fill-sky-800">C</text>
            <text x="375" y="34" className="text-xs font-mono font-bold fill-emerald-800">T</text>
            {showOverlayLabels && (
              <g>
                <text x="218" y="122" className="text-xs font-mono font-semibold fill-sky-900">60°</text>
                <text x="280" y="95" textAnchor="middle" className="text-xs font-mono font-semibold fill-emerald-900">
                  {isSolved ? '60°' : 'CBT?'}
                </text>
                <text x="335" y="122" className="text-xs font-mono font-semibold fill-emerald-900">
                  {isSolved ? '60°' : 'TBD?'}
                </text>
              </g>
            )}
          </svg>
        );

      case 'circle-geometry':
        return (
          <svg viewBox="0 0 560 190" className="w-full h-44 select-none">
            <rect x="10" y="10" width="540" height="170" rx="10" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            <circle cx="190" cy="95" r="56" fill="#E0F2FE" fillOpacity={interactiveScale / 130} stroke="#0284C7" strokeWidth="2.5" />
            <line x1="134" y1="95" x2="246" y2="95" stroke="#0F172A" strokeWidth="2" />
            <circle cx="190" cy="95" r="3.5" fill="#0F172A" />
            {showOverlayLabels && (
              <g>
                <text x="190" y="86" textAnchor="middle" className="text-xs font-mono font-bold fill-slate-900">
                  {diagramProps.labelA || 'D = 10cm'}
                </text>
                <text x="395" y="78" textAnchor="middle" className="text-xs font-mono font-semibold fill-sky-900">
                  រូបមន្តបរិមាត្រ៖ P = D × π
                </text>
                <text x="395" y="106" textAnchor="middle" className="text-xs font-mono fill-slate-700">
                  π ≈ 3.14
                </text>
                <text x="395" y="132" textAnchor="middle" className="text-xs font-mono font-semibold fill-emerald-800">
                  {diagramProps.labelB}
                </text>
              </g>
            )}
          </svg>
        );

      case 'stats-pie':
        return (
          <svg viewBox="0 0 560 190" className="w-full h-44 select-none">
            <rect x="10" y="10" width="540" height="170" rx="10" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            <circle cx="185" cy="95" r="60" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
            {/* 25% slice A (90 deg) */}
            <path d="M185,95 L185,35 A60,60 0 0,1 245,95 Z" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.5" />
            {/* 35% slice B (126 deg) */}
            <path d="M185,95 L245,95 A60,60 0 0,1 150,143 Z" fill="#A7F3D0" stroke="#059669" strokeWidth="1.5" />
            {showOverlayLabels && (
              <g>
                <text x="208" y="75" className="text-xs font-mono font-bold fill-sky-900">A (25%)</text>
                <text x="195" y="122" className="text-xs font-mono font-bold fill-emerald-900">B (35%)</text>
                <text x="142" y="82" className="text-xs font-mono font-bold fill-slate-700">C (40%)</text>
                <text x="395" y="75" textAnchor="middle" className="text-xs font-mono font-semibold fill-slate-900">
                  ក្រាបផ្ចិត 100% = 360°
                </text>
                <text x="395" y="105" textAnchor="middle" className="text-xs font-mono fill-emerald-800">
                  {diagramProps.labelB}
                </text>
              </g>
            )}
          </svg>
        );

      default:
        // Universal Mathematical Bar / Balance / Proportion Model
        return (
          <svg viewBox="0 0 560 190" className="w-full h-44 select-none">
            <rect x="10" y="12" width="540" height="166" rx="10" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            <rect x="36" y="36" width="488" height="44" rx="6" fill="#FFFFFF" stroke="#CBD5E1" />
            <rect
              x="36"
              y="36"
              width={Math.min(488, Math.max(120, (488 * interactiveScale) / 130))}
              height="44"
              rx="6"
              fill="#E0F2FE"
              stroke="#0284C7"
              strokeWidth="1.5"
            />
            <text x="280" y="63" textAnchor="middle" className="text-sm font-mono font-bold fill-slate-900">
              {diagramProps.labelA || `តម្លៃទី ១ : ${diagramProps.primaryValue}`}
            </text>

            {showOverlayLabels && (
              <g>
                <rect x="36" y="96" width="236" height="56" rx="6" fill="#FFFFFF" stroke="#E2E8F0" />
                <text x="154" y="120" textAnchor="middle" className="text-xs text-slate-500">
                  ទិន្នន័យក្នុងលំហាត់
                </text>
                <text x="154" y="140" textAnchor="middle" className="text-sm font-mono font-semibold fill-slate-900">
                  {diagramProps.primaryValue} · {diagramProps.secondaryValue}
                </text>

                <rect x="288" y="96" width="236" height="56" rx="6" fill={isSolved ? '#ECFDF5' : '#F0F9FF'} stroke={isSolved ? '#6EE7B7' : '#BAE6FD'} />
                <text x="406" y="120" textAnchor="middle" className="text-xs fill-slate-600">
                  {diagramProps.labelB || 'គោលដៅគណនា'}
                </text>
                <text x="406" y="140" textAnchor="middle" className="text-sm font-mono font-bold fill-sky-900">
                  {isSolved && diagramProps.tertiaryValue ? diagramProps.tertiaryValue : 'គណនាតាមរូបមន្ត'}
                </text>
              </g>
            )}
          </svg>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Layers className="w-4 h-4 text-sky-700 shrink-0" />
          <span className="font-semibold text-slate-800">គំនូសបំព្រួញស្លាយអន្តរកម្ម</span>
          <span aria-hidden="true">·</span>
          <span>ទំព័រសៀវភៅពុម្ពទី {exercise.textbookPage}</span>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>កម្រិតបង្ហាញ ({interactiveScale}%)</span>
            <input
              type="range"
              min={60}
              max={120}
              value={interactiveScale}
              onChange={(e) => setInteractiveScale(Number(e.target.value))}
              className="w-20 accent-sky-700 cursor-pointer"
            />
          </label>

          <button
            type="button"
            onClick={() => setShowOverlayLabels((prev) => !prev)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showOverlayLabels ? 'លាក់ស្លាករូបភាព' : 'បង្ហាញស្លាករូបភាព'}</span>
          </button>
        </div>
      </div>

      {renderVisualSvg()}
    </div>
  );
};
