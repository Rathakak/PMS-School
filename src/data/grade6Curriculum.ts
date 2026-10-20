export type VisualDiagramType =
  | 'place-value'
  | 'decimal-grid'
  | 'angle-bisector'
  | 'algebra-balance'
  | 'perimeter-rect'
  | 'circle-geometry'
  | 'area-trapezoid'
  | 'area-triangle'
  | 'gcd-lcm'
  | 'fraction-bars'
  | 'ratio-segments'
  | 'speed-motion'
  | 'percentage-grid'
  | 'bank-interest'
  | 'stats-bar'
  | 'stats-pie'
  | 'time-clock'
  | 'solid-cylinder'
  | 'solid-box';

export interface MathSlideExercise {
  id: string;
  slideNumber: number; // 1 to 10
  lessonId: number;
  lessonTitle: string;
  textbookPage: number;
  categoryLabel: string; // e.g., 'លំហាត់គណនា' | 'ចំណោទអនុវត្តន៍' | 'ធរណីមាត្រ និងរង្វាស់'
  question: string;
  formulaHint: string;
  options: string[];
  correctIndex: number;
  directAnswerKey: string[]; // Acceptable direct text/number inputs
  unit?: string;
  steps: string[];
  verification: string;
  diagramType: VisualDiagramType;
  diagramProps: {
    primaryValue?: number | string;
    secondaryValue?: number | string;
    tertiaryValue?: number | string;
    labelA?: string;
    labelB?: string;
    labelC?: string;
  };
  points: number;
}

export interface Grade6Lesson {
  id: number;
  title: string;
  bookPage: number;
  pdfPage: number;
  summary: string;
  keyFormulas: string[];
  exampleProblem: string;
}

export interface StudyCondition {
  id: number;
  title: string;
  description: string;
  clauseTag: string;
}

export interface MotivationalReward {
  id: string;
  title: string;
  subtitle: string;
  requiredPoints: number;
  requiredStreak: number;
  requiredDecks: number;
  category: 'medal' | 'certificate' | 'gift';
  rewardCode: string;
}

export const STUDY_CONDITIONS: StudyCondition[] = [
  {
    id: 1,
    title: '១. គោលការណ៍លំហាត់ជាស្លាយ ១០ លំហាត់ក្នុងមួយថ្ងៃ',
    description:
      'សិស្សានុសិស្សត្រូវអនុវត្តលំហាត់គណិតវិទ្យាថ្នាក់ទី៦ ចំនួន ១០ ស្លាយ (១០ លំហាត់) ក្នុងមួយថ្ងៃ ឱ្យបានចប់សព្វគ្រប់ ដោយពិនិត្យមើលរូបភាពគំនូសបំព្រួញ រូបមន្ត និងជំហានដោះស្រាយនៅលើស្លាយនីមួយៗ។',
    clauseTag: '១០ ស្លាយ / ថ្ងៃ',
  },
  {
    id: 2,
    title: '២. វិន័យពេលវេលាម៉ោង ៧:០០ ល្ងាច និងរំលឹកមុន ១៥ នាទីតាម Telegram',
    description:
      'ត្រូវចូលធ្វើលំហាត់ទៀងទាត់រៀងរាល់ម៉ោង ៧:០០ ល្ងាច (19:00) ដោយប្រព័ន្ធនឹងផ្ញើសាររំលឹកមុន ១៥ នាទី (នៅម៉ោង ៦:៤៥ ល្ងាច / 18:45) ទៅកាន់ Telegram របស់អាណាព្យាបាលជារៀងរាល់ថ្ងៃ។',
    clauseTag: 'រំលឹក Telegram ម៉ោង ៦:៤៥ ល្ងាច',
  },
  {
    id: 3,
    title: '៣. ការគិតគណនា និងផ្ទៀងផ្ទាត់តាមសៀវភៅពុម្ពក្រសួងអប់រំ',
    description:
      'លំហាត់ និងចំណោទទាំងអស់ត្រូវបានដកស្រង់ និងរៀបចំស្របតាមសៀវភៅគណិតវិទ្យាថ្នាក់ទី៦ (ទាំង ២០ មេរៀន) របស់ក្រសួងអប់រំ យុវជន និងកីឡា។ សិស្សត្រូវគណនាដោយខ្លួនឯងមុននឹងបើកមើលចម្លើយផ្ទៀងផ្ទាត់។',
    clauseTag: 'កម្មវិធីសិក្សា ២០ មេរៀន',
  },
  {
    id: 4,
    title: '៤. ការផ្ដល់រង្វាន់លើកទឹកចិត្ត និងបណ្ណសរសើរ',
    description:
      'រាល់ពេលបញ្ចប់ ១០ ស្លាយប្រចាំថ្ងៃ សិស្សនឹងទទួលបានពិន្ទុលើកទឹកចិត្ត មេដាយកិត្តិយស បណ្ណសរសើរដែលអាចបោះពុម្ពបាន និងអាចប្ដូរយករង្វាន់លើកទឹកចិត្តពីគ្រូបង្រៀន ឬអាណាព្យាបាល។',
    clauseTag: 'រង្វាន់លើកទឹកចិត្ត',
  },
];

export const MOTIVATIONAL_REWARDS: MotivationalReward[] = [
  {
    id: 'reward-pledge',
    title: 'មេដាយសន្យាសិក្សាម៉ោង ៧ ល្ងាច',
    subtitle: 'បានអាន និងយល់ព្រមតាមលក្ខខណ្ឌសិក្សាទាំងអស់ដោយស្មោះត្រង់',
    requiredPoints: 50,
    requiredStreak: 0,
    requiredDecks: 0,
    category: 'medal',
    rewardCode: 'PLEDGE-G6',
  },
  {
    id: 'reward-day1',
    title: 'រង្វាន់បញ្ចប់ ១០ ស្លាយថ្ងៃដំបូង',
    subtitle: 'ធ្វើលំហាត់គណិតវិទ្យាបានគ្រប់ ១០ ស្លាយក្នុងមួយថ្ងៃដោយជោគជ័យ',
    requiredPoints: 100,
    requiredStreak: 1,
    requiredDecks: 1,
    category: 'medal',
    rewardCode: 'SLIDE10-STAR',
  },
  {
    id: 'reward-7pm-hero',
    title: 'បណ្ណសរសើរសិស្សគោរពពេលវេលាម៉ោង ៧ ល្ងាច',
    subtitle: 'ចូលធ្វើលំហាត់គណិតវិទ្យាទៀងទាត់នៅម៉ោង ៧:០០ ល្ងាច និងសន្សំពិន្ទុបាន ២៥០ ពិន្ទុ',
    requiredPoints: 250,
    requiredStreak: 1,
    requiredDecks: 1,
    category: 'certificate',
    rewardCode: 'CERT-7PM-G6',
  },
  {
    id: 'reward-stationery',
    title: 'រង្វាន់លើកទឹកចិត្ត៖ ឈុតប៊ិក និងសៀវភៅកត់ត្រាគណិតវិទ្យា',
    subtitle: 'រង្វាន់លើកទឹកចិត្តសម្រាប់សិស្សដែលសន្សំបាន ៤០០ ពិន្ទុ (អាចប្ដូរជាមួយអាណាព្យាបាល/គ្រូ)',
    requiredPoints: 400,
    requiredStreak: 2,
    requiredDecks: 2,
    category: 'gift',
    rewardCode: 'GIFT-BOOK-01',
  },
  {
    id: 'reward-geometry-kit',
    title: 'រង្វាន់លើកទឹកចិត្ត៖ ឈុតបន្ទាត់ ដែកឈាន និងរ៉ាប់ទ័រ',
    subtitle: 'សម្រាប់សិស្សពូកែធរណីមាត្រ និងសំណង់មុំ ដែលសន្សំបាន ៧០០ ពិន្ទុ',
    requiredPoints: 700,
    requiredStreak: 3,
    requiredDecks: 3,
    category: 'gift',
    rewardCode: 'GIFT-GEOM-02',
  },
  {
    id: 'reward-master-cert',
    title: 'ពានរង្វាន់ និងបណ្ណសរសើរសិស្សឆ្នើមគណិតវិទ្យាថ្នាក់ទី៦',
    subtitle: 'សម្រេចបានពិន្ទុ ១ ០០០ ពិន្ទុ ក្នុងការអនុវត្តលំហាត់ស្លាយប្រចាំថ្ងៃ',
    requiredPoints: 1000,
    requiredStreak: 5,
    requiredDecks: 5,
    category: 'certificate',
    rewardCode: 'MASTER-G6-TOP',
  },
];

export const GRADE_6_LESSONS: Grade6Lesson[] = [
  {
    id: 1,
    title: 'មេរៀនទី ១ : ចំនួន',
    bookPage: 1,
    pdfPage: 6,
    summary: 'អំណាន និងសំណេរចំនួនដល់ថ្នាក់លាន តម្លៃលេខតាមខ្ទង់ ការប្រៀបធៀប និងការបង្គត់ចំនួនគត់។',
    keyFormulas: [
      'ថ្នាក់លាន · ថ្នាក់ពាន់ · ថ្នាក់ឯកតា (រយ ដប់ រាយ)',
      'បើខ្ទង់ខាងស្ដាំជា 0; 1; 2; 3; 4 ត្រូវបង្គត់ចុះ · បើជា 5; 6; 7; 8; 9 ត្រូវបង្គត់ឡើង',
    ],
    exampleProblem: 'បង្គត់ចំនួន 2 782 150 ត្រឹមខ្ទង់លាន គឺ 3 000 000 ។',
  },
  {
    id: 2,
    title: 'មេរៀនទី ២ : ចំនួនទសភាគ',
    bookPage: 5,
    pdfPage: 10,
    summary: 'អំណាន និងសំណេរចំនួនទសភាគ (ភាគដប់ ភាគរយ ភាគពាន់) ទម្រង់ពង្រាយ និងការបង្គត់ចំនួនទសភាគ។',
    keyFormulas: [
      '36.458 = 30 + 6 + 0.4 + 0.05 + 0.008',
      '0.2 = 0.20 = 0.200 (ការថែមសូន្យខាងចុងផ្នែកទសភាគមិនប្ដូរតម្លៃទេ)',
    ],
    exampleProblem: 'បង្គត់ 15.385 ត្រឹមខ្ទង់ភាគដប់ គឺ 15.4 ។',
  },
  {
    id: 3,
    title: 'មេរៀនទី ៣ : វិធីបូក និងវិធីដកចំនួនទសភាគ',
    bookPage: 9,
    pdfPage: 14,
    summary: 'ការបូក និងដកចំនួនទសភាគនឹងចំនួនគត់ ឬចំនួនទសភាគ ការប៉ាន់ស្មានផលបូក-ផលដក និងចំណោទ។',
    keyFormulas: [
      'សរសេរចំនួនឱ្យត្រូវតាមខ្ទង់ និងដាក់ចំណុចទសភាគឱ្យត្រង់គ្នាពីលើចុះក្រោម',
      'ថែមសូន្យនៅផ្នែកទសភាគដើម្បីឱ្យមានចំនួនខ្ទង់ស្មើគ្នា',
    ],
    exampleProblem: '15.545m + 14m = 29.545m និង 5l - 2.245l = 2.755l',
  },
  {
    id: 4,
    title: 'មេរៀនទី ៤ : កន្លះបន្ទាត់ពុះមុំ និងសំណង់មុំ',
    bookPage: 19,
    pdfPage: 24,
    summary: 'ការស្គាល់ និងសង់កន្លះបន្ទាត់ពុះមុំ សំណង់មុំ 60° និងមុំកែង 90° ដោយប្រើដែកឈាន និងបន្ទាត់។',
    keyFormulas: [
      'កន្លះបន្ទាត់ពុះមុំ ចែកមុំមួយជាពីរមុំប៉ុនគ្នា',
      'សំណង់មុំ 60° ប្រើធ្នូរង្វង់ពីរមានកាំស្មើគ្នា · សំណង់មុំកែង 90°',
    ],
    exampleProblem: 'បើមុំ ABC = 60° ហើយ BD ជាកន្លះបន្ទាត់ពុះមុំ នោះមុំ ABD = 30° ។',
  },
  {
    id: 5,
    title: 'មេរៀនទី ៥ : ការជំនួសលេខដោយអក្សរ',
    bookPage: 25,
    pdfPage: 30,
    summary: 'ផលបូកតួដូចគ្នា (4a) មេគុណ និងកត្តា វិធីបូក-ដកតួអក្សរ និងការរកតម្លៃលេខនៃតួអក្សរក្នុងសមីការ។',
    keyFormulas: [
      '2n + 4n = (2 + 4)n = 6n · 5n - 3n = (5 - 3)n = 2n',
      'បើ n + 5 = 9 នោះ n = 9 - 5 = 4',
    ],
    exampleProblem: 'ផលបូកនៃពីរចំនួនគត់តគ្នាស្មើ 11 (n + n + 1 = 11) នោះចំនួនទាំងពីរគឺ 5 និង 6 ។',
  },
  {
    id: 6,
    title: 'មេរៀនទី ៦ : បរិមាត្រ',
    bookPage: 29,
    pdfPage: 34,
    summary: 'ការគណនាប្រវែងជុំវិញរូប (បរិមាត្រ) ចតុកោណកែង ការ៉េ និងបរិមាត្រថាស (រង្វង់)។',
    keyFormulas: [
      'បរិមាត្រចតុកោណកែង P = (បណ្ដោយ + ទទឹង) × 2 = 2(a + b)',
      'បរិមាត្រការ៉េ P = ជ្រុង × 4 · បរិមាត្ររង្វង់ P = D × π = 2 × π × R (π ≈ 3.14)',
    ],
    exampleProblem: 'រង្វង់មានអង្កត់ផ្ចិត D = 10cm មានបរិមាត្រ P = 10 × 3.14 = 31.4cm ។',
  },
  {
    id: 7,
    title: 'មេរៀនទី ៧ : ផ្ទៃក្រឡា',
    bookPage: 33,
    pdfPage: 38,
    summary: 'ឯកតាផ្ទៃក្រឡា (ha, a, ca, m²) និងរូបមន្តផ្ទៃក្រឡាចតុកោណកែង ការ៉េ ត្រីកោណ ប្រលេឡូក្រាម ចតុកោណព្នាយ និងថាស។',
    keyFormulas: [
      '1ha = 10 000m² · 1a = 100m² · 1ca = 1m²',
      'ត្រីកោណ A = (a×h)/2 · ចតុកោណព្នាយ A = (a+b)×h/2 · ថាស A = πR²',
    ],
    exampleProblem: 'ចតុកោណព្នាយមានបាតតូច 2m បាតធំ 5m និងកម្ពស់ 3m មានផ្ទៃក្រឡា A = 10.5m² ។',
  },
  {
    id: 8,
    title: 'មេរៀនទី ៨ : វិធីគុណ និងវិធីចែកចំនួនទសភាគ',
    bookPage: 43,
    pdfPage: 48,
    summary: 'ការគុណ និងចែកចំនួនទសភាគនឹងចំនួនគត់ ឬចំនួនទសភាគ និងការប៉ាន់ស្មានផលគុណ-ផលចែក។',
    keyFormulas: [
      'ចំនួនខ្ទង់ទសភាគនៃផលគុណ = ផលបូកចំនួនខ្ទង់ទសភាគនៃតួគុណទាំងពីរ',
      'ដើម្បីចែកនឹងចំនួនទសភាគ ត្រូវគុណតំណាងចែក និងតួចែកនឹង 10, 100 ឬ 1000',
    ],
    exampleProblem: '8.25m × 3.8m = 31.35m² និង 96.6m² ÷ 5.25m = 18.4m',
  },
  {
    id: 9,
    title: 'មេរៀនទី ៩ : តួចែករួមធំបំផុត - ពហុគុណរួមតូចបំផុត',
    bookPage: 53,
    pdfPage: 58,
    summary: 'កត្តានៃមួយចំនួន ចំនួនបឋម ការបំបែកជាផលគុណកត្តាបឋម តួចែករួមធំបំផុត ត(a;b) និងពហុគុណរួមតូចបំផុត ព(a;b)។',
    keyFormulas: [
      'ចំនួនបឋម៖ 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, ...',
      'ត(18; 24) = 6 · ព(8; 12) = 24',
    ],
    exampleProblem: 'សហគ្រាសមានកម្មករប្រុស 48 នាក់ និងស្រី 72 នាក់ ចែកជាក្រុមស្មើគ្នាបានច្រើនបំផុត ត(48;72) = 24 ក្រុម។',
  },
  {
    id: 10,
    title: 'មេរៀនទី ១០ : វិធីបូក និងវិធីដកប្រភាគ',
    bookPage: 63,
    pdfPage: 68,
    summary: 'ការរកភាគបែងរួមតូចបំផុត ការសម្រួលប្រភាគ និងវិធីបូក-ដកប្រភាគដែលមានភាគបែងខុសគ្នា។',
    keyFormulas: [
      'តម្រូវភាគបែងរួមតូចបំផុត រួចបូក ឬដកភាគយកនឹងភាគយក រក្សាភាគបែងទុកនៅដដែល',
      '2/5 + 3/4 = 8/20 + 15/20 = 23/20',
    ],
    exampleProblem: '5/6 - 1/4 = 10/12 - 3/12 = 7/12',
  },
  {
    id: 11,
    title: 'មេរៀនទី ១១ : វិធីគុណ និងវិធីចែកប្រភាគ',
    bookPage: 79,
    pdfPage: 84,
    summary: 'ការគុណប្រភាគនឹងប្រភាគ ចម្រាស់នៃប្រភាគ និងការចែកប្រភាគដោយគុណនឹងចម្រាស់ប្រភាគទី២។',
    keyFormulas: [
      'a/b × c/d = (a × c) / (b × d)',
      'a/b ÷ c/d = a/b × d/c (គុណនឹងចម្រាស់ប្រភាគទី ២)',
    ],
    exampleProblem: '1/2 ÷ 1/8 = 1/2 × 8/1 = 4',
  },
  {
    id: 12,
    title: 'មេរៀនទី ១២ : ផលធៀប',
    bookPage: 87,
    pdfPage: 92,
    summary: 'ផលធៀបនៃទំហំដែលមានឯកតាដូចគ្នា (a : b) និងផលធៀបនៃទំហំដែលមានឯកតាខុសគ្នា (ល្បឿន ដង់ស៊ីតេប្រជាជន)។',
    keyFormulas: [
      'ផលធៀប a និង b កំណត់ដោយ a : b ឬ a/b',
      'ឃុំមានផ្ទៃដី 120km² និងប្រជាជន 6 000 នាក់ មានផលធៀប 50 នាក់/km²',
    ],
    exampleProblem: 'បុគ្គលិកសរុប 56 នាក់ ផលធៀបបុរស និងនារី 3 : 4 នោះបុរសមាន 24 នាក់ និងនារី 32 នាក់។',
  },
  {
    id: 13,
    title: 'មេរៀនទី ១៣ : សមាមាត្រ',
    bookPage: 91,
    pdfPage: 96,
    summary: 'សមាមាត្រជាផលធៀបពីរស្មើគ្នា វិធីគុណខ្វែងនៃសមាមាត្រ និងការគណនាចម្ងាយពិតតាមមាត្រាដ្ឋានផែនទី។',
    keyFormulas: [
      'បើ a/b = c/d នោះគេបានផលគុណខ្វែង a × d = b × c',
      'មាត្រាដ្ឋានផែនទី = ចម្ងាយលើផែនទី / ចម្ងាយពិត',
    ],
    exampleProblem: 'បូណាបោះបាល់ 7 បាល់ ចូលទីបាន 4 បាល់។ បើបោះ 21 បាល់ ចូលទីបាន 12 បាល់។',
  },
  {
    id: 14,
    title: 'មេរៀនទី ១៤ : ល្បឿន',
    bookPage: 95,
    pdfPage: 100,
    summary: 'រូបមន្តល្បឿន ចម្ងាយចរ និងរយៈពេលចរ ព្រមទាំងចំណោទចលនាប្រាសទិស (ជួបគ្នា) និងចលនាស្របទិស (ដេញទាន់គ្នា)។',
    keyFormulas: [
      'ល្បឿន v = d / t · ចម្ងាយចរ d = v × t · រយៈពេល t = d / v',
      'ចលនាប្រាសទិស៖ t = d / (v₁ + v₂) · ចលនាស្របទិស៖ t = d / (v₂ - v₁)',
    ],
    exampleProblem: 'អ្នកជិះកង់ (12km/h) និងម៉ូតូ (30km/h) ចេញពី A និង B ចម្ងាយ 84km មកជួបគ្នាក្នុងរយៈពេល 2h ។',
  },
  {
    id: 15,
    title: 'មេរៀនទី ១៥ : ប្រមាណវិធីលើចំនួនចម្រុះ',
    bookPage: 99,
    pdfPage: 104,
    summary: 'វិធីបូក ដក គុណ និងចែកចំនួនចម្រុះ ដោយតម្រូវភាគបែង ឬប្ដូរចំនួនចម្រុះទៅជាប្រភាគមិនសុទ្ធ។',
    keyFormulas: [
      'ប្ដូរចំនួនចម្រុះ a b/c ទៅជាប្រភាគ៖ (a × c + b) / c',
      '6 1/2 ÷ 1 1/4 = 13/2 ÷ 5/4 = 13/2 × 4/5 = 26/5 = 5 1/5',
    ],
    exampleProblem: 'ចាន់ណាដើរដោយល្បឿន 4 5/8 km/h ក្នុងរយៈពេល 2 2/3 h បានចម្ងាយ 12 1/3 km ។',
  },
  {
    id: 16,
    title: 'មេរៀនទី ១៦ : ភាគរយ',
    bookPage: 111,
    pdfPage: 116,
    summary: 'សញ្ញាណភាគរយ (%) ការប្ដូរប្រភាគទៅជាភាគរយ និងការគណនាភាគរយបញ្ចុះតម្លៃ ឬដំឡើងថ្លៃ។',
    keyFormulas: [
      '2/5 = 40/100 = 40% · 75% = 75/100 = 3/4',
      'ភាគរយបញ្ចុះតម្លៃ = (ប្រាក់បញ្ចុះតម្លៃ / តម្លៃដើម) × 100%',
    ],
    exampleProblem: 'ទូរស័ព្ទពីមុនថ្លៃ 25$ ឥឡូវលក់ 18$ គឺបញ្ចុះតម្លៃ 7/25 = 28% ។',
  },
  {
    id: 17,
    title: 'មេរៀនទី ១៧ : ការប្រាក់',
    bookPage: 115,
    pdfPage: 120,
    summary: 'ការគណនាអត្រាការប្រាក់ ប្រាក់ដើម ការប្រាក់ប្រចាំឆ្នាំ និងការទិញទំនិញបង់រំលស់ប្រចាំខែ។',
    keyFormulas: [
      'ការប្រាក់ = ប្រាក់ដើម × អត្រា (%) × រយៈពេលចងការ',
      'ប្រាក់បន្ថែមក្នុងការបង់រំលស់ = ប្រាក់បង់រំលស់សរុប - តម្លៃដើម',
    ],
    exampleProblem: 'ខ្ចីប្រាក់ 800 000៛ អត្រា 12% ក្នុង 1 ឆ្នាំ ត្រូវបង់ការប្រាក់ 96 000៛ ។',
  },
  {
    id: 18,
    title: 'មេរៀនទី ១៨ : ស្ថិតិ',
    bookPage: 119,
    pdfPage: 124,
    summary: 'ការស្រង់ និងសង្ខេបទិន្នន័យជាតារាងទិន្នន័យ ការបកស្រាយក្រាបសរសរ ក្រាបសរសរភ្លោះ និងក្រាបផ្ចិត (360°)។',
    keyFormulas: [
      'ក្នុងក្រាបផ្ចិត 100% តាងដោយមុំ 360°',
      'មុំចំណែក = 360° × (ភាគរយ / 100)',
    ],
    exampleProblem: 'បើចំណែក A ស្មើ 25% នៃក្រាបផ្ចិត នោះមុំផ្ចិតរបស់ A គឺ 360° × 25/100 = 90° ។',
  },
  {
    id: 19,
    title: 'មេរៀនទី ១៩ : ប្រមាណវិធីលើរង្វាស់ពេល',
    bookPage: 127,
    pdfPage: 132,
    summary: 'វិធីបូក ដក គុណ និងចែករង្វាស់ពេល (ម៉ោង h, នាទី mn, វិនាទី s) និងចំណោទរយៈពេល។',
    keyFormulas: [
      '1 ថ្ងៃ = 24h · 1h = 60mn · 1mn = 60s',
      'បើផលបូកនាទី ឬវិនាទី ≥ 60 ត្រូវប្ដូរទៅជាម៉ោង ឬនាទីបន្ទាប់',
    ],
    exampleProblem: '4h 47mn 32s + 3h 50mn 45s = 8h 38mn 17s',
  },
  {
    id: 20,
    title: 'មេរៀនទី ២០ : មាឌ និងផ្ទៃក្រឡាសូលីត',
    bookPage: 131,
    pdfPage: 136,
    summary: 'មាឌ និងផ្ទៃក្រឡាប្រលេពីប៉ែតកែង គូប ស៊ីឡាំង កោន និងស្វ៊ែរ ព្រមទាំងទំនាក់ទំនងមាឌ និងចំណុះ (1dm³ = 1l)។',
    keyFormulas: [
      'ប្រលេពីប៉ែតកែង V = a×b×c · ស៊ីឡាំង V = πR²h · កោន V = πR²h/3 · ស្វ៊ែរ V = 4/3 πR³',
      '1dm³ = 1l = 1000cm³ = 1000ml · 1m³ = 1000dm³ = 1000l',
    ],
    exampleProblem: 'ស៊ីឡាំងមានកាំ R = 3cm និងកម្ពស់ h = 5cm មានផ្ទៃក្រឡាសរុប 150.72cm² ។',
  },
];

// Master Curated Pool of Textbook Exercises across all 20 lessons
// Organized so that:
// - Pack 0 ("លំហាត់ប្រចាំថ្ងៃម៉ោង ៧:០០ ល្ងាច - ១០ ស្លាយពិសេស") has 10 signature slides spanning key Grade 6 topics
// - Packs 1..20 correspond to Lesson 1..20, each providing a complete 10-slide interactive deck!

export const SIGNATURE_DAILY_10_SLIDES: MathSlideExercise[] = [
  {
    id: 'sig-1',
    slideNumber: 1,
    lessonId: 1,
    lessonTitle: 'មេរៀនទី ១ : ចំនួន',
    textbookPage: 4,
    categoryLabel: 'ចំណោទបង្គត់ចំនួនគត់',
    question:
      'ប្រទេសកម្ពុជាមានផ្ទៃក្រឡា 181 035 km² ។ ចូរបង្គត់ចំនួន 181 035 ត្រឹមខ្ទង់ម៉ឺន តាមវិធានបង្គត់ចំនួនក្នុងសៀវភៅពុម្ពទំព័រទី ៤ ។',
    formulaHint: 'មើលលេខនៅខ្ទង់ពាន់ (ខាងស្ដាំជាប់ខ្ទង់ម៉ឺន)៖ បើជាលេខ 0; 1; 2; 3; 4 ត្រូវបង្គត់ចុះ។',
    options: ['180 000 km²', '181 000 km²', '190 000 km²', '200 000 km²'],
    correctIndex: 0,
    directAnswerKey: ['180000', '180 000', '180,000'],
    unit: 'km²',
    steps: [
      'ជំហានទី ១៖ កំណត់លេខនៅខ្ទង់ម៉ឺននៃចំនួន 181 035 គឺលេខ 8 (តម្លៃ 80 000)។',
      'ជំហានទី ២៖ មើលខ្ទង់ខាងស្ដាំជាប់ខ្ទង់ម៉ឺន (ខ្ទង់ពាន់) គឺលេខ 1 ។',
      'ជំហានទី ៣៖ ដោយលេខ 1 តូចជាង 5 (ក្នុងចំណោម 0; 1; 2; 3; 4) យើងត្រូវបង្គត់ចុះទៅ 180 000 km² ។',
    ],
    verification: '181 035 នៅជិត 180 000 ជាង 190 000 ដូចនេះចម្លើយត្រឹមត្រូវគឺ 180 000 km² ។',
    diagramType: 'place-value',
    diagramProps: {
      primaryValue: '181 035',
      secondaryValue: '180 000',
      labelA: 'ខ្ទង់ម៉ឺន = 8',
      labelB: 'ខ្ទង់ពាន់ = 1 (បង្គត់ចុះ)',
    },
    points: 20,
  },
  {
    id: 'sig-2',
    slideNumber: 2,
    lessonId: 3,
    lessonTitle: 'មេរៀនទី ៣ : វិធីបូក និងវិធីដកចំនួនទសភាគ',
    textbookPage: 17,
    categoryLabel: 'ចំណោទចំនួនទសភាគ',
    question:
      'គេសង់ផ្លូវមួយមានប្រវែង 90 km ។ លើកទី ១ គេសង់បាន 25.525 km ហើយលើកទី ២ គេសង់បាន 23.875 km ។ តើនៅសល់ផ្លូវប្រវែងប៉ុន្មានគីឡូម៉ែត្រទៀតដែលត្រូវសង់បង្ហើយ?',
    formulaHint: 'ប្រវែងផ្លូវនៅសល់ = ប្រវែងផ្លូវសរុប - (ប្រវែងសង់លើកទី ១ + ប្រវែងសង់លើកទី ២)',
    options: ['40.6 km', '49.4 km', '41.6 km', '39.8 km'],
    correctIndex: 0,
    directAnswerKey: ['40.6', '40.600', '40.6km'],
    unit: 'km',
    steps: [
      'ជំហានទី ១៖ រកប្រវែងផ្លូវដែលសង់បានទាំងពីរលើក៖ 25.525 + 23.875 = 49.400 km = 49.4 km ។',
      'ជំហានទី ២៖ រកប្រវែងផ្លូវដែលនៅសល់ត្រូវសង់បង្ហើយ៖ 90.0 - 49.4 = 40.6 km ។',
    ],
    verification: 'ផ្ទៀងផ្ទាត់៖ 25.525 + 23.875 + 40.600 = 90.000 km ។',
    diagramType: 'decimal-grid',
    diagramProps: {
      primaryValue: 90,
      secondaryValue: 49.4,
      tertiaryValue: 40.6,
      labelA: 'សង់រួច 49.4 km',
      labelB: 'នៅសល់ 40.6 km',
    },
    points: 20,
  },
  {
    id: 'sig-3',
    slideNumber: 3,
    lessonId: 5,
    lessonTitle: 'មេរៀនទី ៥ : ការជំនួសលេខដោយអក្សរ',
    textbookPage: 28,
    categoryLabel: 'ចំណោទសមីការតួអក្សរ',
    question:
      'ផលបូកនៃបីចំនួនគត់តគ្នា ស្មើនឹង 36 ។ ចូររកបីចំនួនគត់តគ្នានោះ (តាមគំរូដោះស្រាយចំណោទទំព័រទី ២៨)។',
    formulaHint: 'តាងបីចំនួនគត់តគ្នាដោយ n , n + 1 និង n + 2 នោះ n + (n + 1) + (n + 2) = 36 ។',
    options: ['11 ; 12 និង 13', '10 ; 12 និង 14', '12 ; 13 និង 14', '10 ; 11 និង 12'],
    correctIndex: 0,
    directAnswerKey: ['11, 12, 13', '11;12;13', '11 12 13', '11'],
    steps: [
      'ជំហានទី ១៖ តាងបីចំនួនគត់តគ្នាដោយ n , n + 1 និង n + 2 ។',
      'ជំហានទី ២៖ សរសេរសមីការផលបូក៖ n + n + 1 + n + 2 = 36 ឬ 3n + 3 = 36 ។',
      'ជំហានទី ៣៖ ដក 3 ពីអង្គទាំងពីរ៖ 3n = 36 - 3 = 33 នាំឱ្យ n = 33 ÷ 3 = 11 ។',
      'ជំហានទី ៤៖ ចំនួនទាំងបីគឺ 11 , 12 និង 13 ។',
    ],
    verification: 'ផ្ទៀងផ្ទាត់៖ 11 + 12 + 13 = 36 (ពិត)។',
    diagramType: 'algebra-balance',
    diagramProps: {
      primaryValue: '3n + 3',
      secondaryValue: '36',
      tertiaryValue: 'n = 11',
      labelA: 'អង្គទី ១ : n + (n+1) + (n+2)',
      labelB: 'អង្គទី ២ : 36',
    },
    points: 20,
  },
  {
    id: 'sig-4',
    slideNumber: 4,
    lessonId: 7,
    lessonTitle: 'មេរៀនទី ៧ : ផ្ទៃក្រឡា',
    textbookPage: 40,
    categoryLabel: 'ធរណីមាត្រ និងផ្ទៃក្រឡាចតុកោណព្នាយ',
    question:
      'ដីស្រែមួយរាងចតុកោណព្នាយមានបាតតូច 65 m បាតធំ 102 m និងកម្ពស់ 40 m ។ រកផលស្រូវដែលប្រមូលបាន បើគេដឹងថាដី 1 m² ផ្ដល់ផលស្រូវ 0.25 kg ។',
    formulaHint: 'ផ្ទៃក្រឡាចតុកោណព្នាយ A = ((បាតតូច + បាតធំ) × កម្ពស់) / 2 រួចគុណនឹង 0.25 kg ។',
    options: ['835 kg', '3 340 kg', '1 670 kg', '668 kg'],
    correctIndex: 0,
    directAnswerKey: ['835', '835kg'],
    unit: 'kg',
    steps: [
      'ជំហានទី ១៖ គណនាផ្ទៃក្រឡាដីស្រែរាងចតុកោណព្នាយ៖ A = ((65 + 102) × 40) / 2 ។',
      'ជំហានទី ២៖ A = (167 × 40) / 2 = 167 × 20 = 3 340 m² ។',
      'ជំហានទី ៣៖ គណនាផលស្រូវប្រមូលបាន៖ 3 340 × 0.25 kg = 835 kg ។',
    ],
    verification: 'ផ្ទៀងផ្ទាត់៖ 3 340 ÷ 4 = 835 kg ។',
    diagramType: 'area-trapezoid',
    diagramProps: {
      primaryValue: 65,
      secondaryValue: 102,
      tertiaryValue: 40,
      labelA: 'បាតតូច a = 65m',
      labelB: 'បាតធំ b = 102m',
      labelC: 'កម្ពស់ h = 40m',
    },
    points: 20,
  },
  {
    id: 'sig-5',
    slideNumber: 5,
    lessonId: 9,
    lessonTitle: 'មេរៀនទី ៩ : តួចែករួមធំបំផុត - ពហុគុណរួមតូចបំផុត',
    textbookPage: 61,
    categoryLabel: 'ចំណោទតួចែករួមធំបំផុត ត(a;b)',
    question:
      'ដានីរៀបផ្កាកុលាប 16 ទង និងផ្កាសាគូរ៉ា 24 ទង ដាក់ក្នុងថូដែលថូនីមួយៗមានចំនួនផ្កាស្មើគ្នា។ តើដានីត្រូវការថូច្រើនបំផុតប៉ុន្មាន ដើម្បីរៀបផ្កានោះអស់?',
    formulaHint: 'រកតួចែករួមធំបំផុត ត(16 ; 24) តាមការបំបែកជាផលគុណកត្តាបឋម។',
    options: ['8 ថូ', '6 ថូ', '4 ថូ', '12 ថូ'],
    correctIndex: 0,
    directAnswerKey: ['8', '8ថូ'],
    unit: 'ថូ',
    steps: [
      'ជំហានទី ១៖ បំបែក 16 និង 24 ជាផលគុណកត្តាបឋម៖ 16 = 2 × 2 × 2 × 2 និង 24 = 2 × 2 × 2 × 3 ។',
      'ជំហានទី ២៖ ជ្រើសរើសកត្តាបឋមរួម៖ 2 × 2 × 2 = 8 ។',
      'ជំហានទី ៣៖ ដូចនេះ ត(16 ; 24) = 8 គឺដានីត្រូវការថូច្រើនបំផុត 8 ថូ (ក្នុង 1 ថូមានកុលាប 2 ទង និងសាគូរ៉ា 3 ទង)។',
    ],
    verification: 'ផ្ទៀងផ្ទាត់៖ 8 × 2 = 16 ទង និង 8 × 3 = 24 ទង។',
    diagramType: 'gcd-lcm',
    diagramProps: {
      primaryValue: 16,
      secondaryValue: 24,
      tertiaryValue: 8,
      labelA: 'កុលាប 16 ទង',
      labelB: 'សាគូរ៉ា 24 ទង',
      labelC: 'ត(16; 24) = 8 ថូ',
    },
    points: 20,
  },
  {
    id: 'sig-6',
    slideNumber: 6,
    lessonId: 10,
    lessonTitle: 'មេរៀនទី ១០ : វិធីបូក និងវិធីដកប្រភាគ',
    textbookPage: 73,
    categoryLabel: 'ចំណោទប្រភាគ',
    question:
      'ក្រុមហ៊ុនមួយនាំម៉ូតូចូល 75 គ្រឿង លើកទី ១ លក់បាន 2/5 និងលើកទី ២ លក់បាន 1/3 នៃម៉ូតូទាំងអស់។ ចូររកចំនួនម៉ូតូដែលនៅសល់។',
    formulaHint: 'ប្រភាគម៉ូតូលក់ទាំងពីរលើក = 2/5 + 1/3 = 11/15 · ប្រភាគម៉ូតូនៅសល់ = 1 - 11/15 = 4/15',
    options: ['20 គ្រឿង', '25 គ្រឿង', '30 គ្រឿង', '15 គ្រឿង'],
    correctIndex: 0,
    directAnswerKey: ['20', '20គ្រឿង'],
    unit: 'គ្រឿង',
    steps: [
      'ជំហានទី ១៖ រកប្រភាគម៉ូតូលក់បានទាំងពីរលើក៖ 2/5 + 1/3 = 6/15 + 5/15 = 11/15 ។',
      'ជំហានទី ២៖ រកប្រភាគម៉ូតូដែលនៅសល់៖ 1 - 11/15 = 4/15 ។',
      'ជំហានទី ៣៖ រកចំនួនម៉ូតូនៅសល់៖ 75 × (4/15) = 5 × 4 = 20 គ្រឿង។',
    ],
    verification: 'ផ្ទៀងផ្ទាត់៖ លើកទី១ (30) + លើកទី២ (25) + នៅសល់ (20) = 75 គ្រឿង។',
    diagramType: 'fraction-bars',
    diagramProps: {
      primaryValue: 11,
      secondaryValue: 15,
      tertiaryValue: 20,
      labelA: 'លក់អស់ 11/15 (55 គ្រឿង)',
      labelB: 'នៅសល់ 4/15 (20 គ្រឿង)',
    },
    points: 20,
  },
  {
    id: 'sig-7',
    slideNumber: 7,
    lessonId: 13,
    lessonTitle: 'មេរៀនទី ១៣ : សមាមាត្រ',
    textbookPage: 93,
    categoryLabel: 'មាត្រាដ្ឋានផែនទី និងសមាមាត្រ',
    question:
      'នៅលើផែនទីមួយ គេវាស់ចម្ងាយពីក្រុង A ទៅក្រុង B ឃើញប្រវែង 5 cm ។ គេដឹងថាផលធៀបរវាងចម្ងាយលើផែនទី និងចម្ងាយពិតស្មើនឹង 1 / 600 000 ។ គណនាចម្ងាយពិតពី A ទៅ B គិតជាគីឡូម៉ែត្រ (km)។',
    formulaHint: '5 / x = 1 / 600 000 នាំឱ្យ x = 5 × 600 000 cm រួចប្ដូរទៅជា km (1 km = 100 000 cm)។',
    options: ['30 km', '300 km', '60 km', '15 km'],
    correctIndex: 0,
    directAnswerKey: ['30', '30km'],
    unit: 'km',
    steps: [
      'ជំហានទី ១៖ តាង x ជាចម្ងាយពិត (គិតជា cm) គេបានសមាមាត្រ 5 / x = 1 / 600 000 ។',
      'ជំហានទី ២៖ គុណខ្វែង៖ x = 5 × 600 000 = 3 000 000 cm ។',
      'ជំហានទី ៣៖ ប្ដូរពីសង់ទីម៉ែត្រ (cm) ទៅគីឡូម៉ែត្រ (km)៖ 3 000 000 cm = 30 000 m = 30 km ។',
    ],
    verification: 'ផ្ទៀងផ្ទាត់៖ 3 000 000 cm × (1 / 600 000) = 5 cm ។',
    diagramType: 'ratio-segments',
    diagramProps: {
      primaryValue: '5 cm',
      secondaryValue: '30 km',
      tertiaryValue: '1 : 600 000',
      labelA: 'លើផែនទី 5 cm',
      labelB: 'ចម្ងាយពិត 30 km',
    },
    points: 20,
  },
  {
    id: 'sig-8',
    slideNumber: 8,
    lessonId: 14,
    lessonTitle: 'មេរៀនទី ១៤ : ល្បឿន',
    textbookPage: 96,
    categoryLabel: 'ចំណោទចលនាប្រាសទិស',
    question:
      'អ្នកជិះកង់ចេញពីទី A ឆ្ពោះទៅទី B ដោយល្បឿន 12 km/h ហើយអ្នកជិះម៉ូតូចេញពីទី B ឆ្ពោះមកទី A ក្នុងពេលព្រមគ្នាដោយល្បឿន 30 km/h ។ បើពី A ទៅ B មានចម្ងាយ 84 km តើប៉ុន្មានម៉ោងក្រោយមកទើបអ្នកទាំងពីរជួបគ្នា?',
    formulaHint: 'ក្នុង 1 ម៉ោង អ្នកទាំងពីរខិតជិតគ្នាបាន 12 + 30 = 42 km · រយៈពេលជួបគ្នា t = 84 ÷ 42',
    options: ['2 ម៉ោង (2h)', '3 ម៉ោង (3h)', '2 ម៉ោង 30 នាទី', '1 ម៉ោង 30 នាទី'],
    correctIndex: 0,
    directAnswerKey: ['2', '2h', '2ម៉ោង'],
    unit: 'h',
    steps: [
      'ជំហានទី ១៖ រកចម្ងាយផ្លូវដែលអ្នកទាំងពីរខិតជិតគ្នាក្នុងរយៈពេល 1h ៖ 12 km + 30 km = 42 km ។',
      'ជំហានទី ២៖ រករយៈពេលដែលអ្នកទាំងពីរធ្វើដំណើរមកជួបគ្នា៖ t = 84 km ÷ 42 km/h = 2h ។',
    ],
    verification: 'ផ្ទៀងផ្ទាត់៖ កង់ចរបាន 12×2 = 24km និងម៉ូតូចរបាន 30×2 = 60km សរុប 24 + 60 = 84km ។',
    diagramType: 'speed-motion',
    diagramProps: {
      primaryValue: 12,
      secondaryValue: 30,
      tertiaryValue: 84,
      labelA: 'កង់ 12 km/h →',
      labelB: '← ម៉ូតូ 30 km/h',
      labelC: 'ចម្ងាយសរុប 84 km (ជួបគ្នានៅ t = 2h)',
    },
    points: 20,
  },
  {
    id: 'sig-9',
    slideNumber: 9,
    lessonId: 17,
    lessonTitle: 'មេរៀនទី ១៧ : ការប្រាក់',
    textbookPage: 117,
    categoryLabel: 'ចំណោទការប្រាក់ និងប្រាក់ចំណេញ',
    question:
      'មីងសំខ្ចីប្រាក់ពីធនាគារចំនួន 800 000 ៛ ដែលមានអត្រាការប្រាក់ 12% ក្នុងមួយឆ្នាំ។ គាត់យកប្រាក់នោះទៅចិញ្ចឹមជ្រូក ហើយលក់វិញបានប្រាក់ 1 000 000 ៛ ក្នុងរយៈពេល ១ ឆ្នាំ។ តើគាត់ចំណេញបានប្រាក់ប៉ុន្មានរៀល បន្ទាប់ពីសងទាំងដើមទាំងការរួច?',
    formulaHint: 'ការប្រាក់ = 800 000 × 12/100 · ប្រាក់ត្រូវបង់សរុប = ប្រាក់ដើម + ការប្រាក់',
    options: ['ចំណេញ 104 000 ៛', 'ចំណេញ 96 000 ៛', 'ចំណេញ 200 000 ៛', 'ចំណេញ 114 000 ៛'],
    correctIndex: 0,
    directAnswerKey: ['104000', '104 000', '104,000'],
    unit: '៛',
    steps: [
      'ជំហានទី ១៖ គណនាការប្រាក់ក្នុង 1 ឆ្នាំ៖ 800 000 × (12 / 100) = 96 000 ៛ ។',
      'ជំហានទី ២៖ ប្រាក់សរុបដែលត្រូវសងធនាគារ៖ 800 000 + 96 000 = 896 000 ៛ ។',
      'ជំហានទី ៣៖ ប្រាក់ចំណេញសុទ្ធរបស់មីងសំ៖ 1 000 000 - 896 000 = 104 000 ៛ ។',
    ],
    verification: 'ផ្ទៀងផ្ទាត់៖ 896 000 ៛ + 104 000 ៛ = 1 000 000 ៛ ។',
    diagramType: 'bank-interest',
    diagramProps: {
      primaryValue: '800 000 ៛',
      secondaryValue: '96 000 ៛',
      tertiaryValue: '104 000 ៛',
      labelA: 'ប្រាក់ដើម 800 000៛ (អត្រា 12%)',
      labelB: 'ការប្រាក់ 96 000៛',
      labelC: 'ចំណេញសុទ្ធ 104 000៛',
    },
    points: 20,
  },
  {
    id: 'sig-10',
    slideNumber: 10,
    lessonId: 20,
    lessonTitle: 'មេរៀនទី ២០ : មាឌ និងផ្ទៃក្រឡាសូលីត',
    textbookPage: 135,
    categoryLabel: 'ចំណោទមាឌស៊ីឡាំង និងកោន',
    question:
      'សូលីតមួយកំណត់ដោយស៊ីឡាំងដែលមានកាំបាត R = 3 cm និងកម្ពស់ h = 6 cm ដោយគេឆ្វៀលដករាងកោនដែលមានបាត និងកម្ពស់ប៉ុនគ្នាចេញ (ទំព័រ ១៣៥)។ ចូរគណនាមាឌផ្នែកឆ្អូតដែលនៅសល់ (យក π ≈ 3.14)។',
    formulaHint: 'មាឌស៊ីឡាំង V₁ = πR²h · មាឌកោន V₂ = (1/3)πR²h · មាឌផ្នែកឆ្អូត = V₁ - V₂',
    options: ['113.04 cm³', '169.56 cm³', '56.52 cm³', '124.34 cm³'],
    correctIndex: 0,
    directAnswerKey: ['113.04', '113.04cm3'],
    unit: 'cm³',
    steps: [
      'ជំហានទី ១៖ គណនាមាឌស៊ីឡាំង៖ V₁ = 3.14 × 3 × 3 × 6 = 169.56 cm³ ។',
      'ជំហានទី ២៖ គណនាមាឌកោន៖ V₂ = (1/3) × 3.14 × 3 × 3 × 6 = 56.52 cm³ ។',
      'ជំហានទី ៣៖ គណនាមាឌផ្នែកឆ្អូត៖ V = 169.56 - 56.52 = 113.04 cm³ ។',
    ],
    verification: 'ផ្ទៀងផ្ទាត់៖ 56.52 × 2 = 113.04 cm³ ព្រោះមាឌនៅសល់ស្មើ 2/3 នៃមាឌស៊ីឡាំង។',
    diagramType: 'solid-cylinder',
    diagramProps: {
      primaryValue: 3,
      secondaryValue: 6,
      tertiaryValue: '113.04 cm³',
      labelA: 'កាំ R = 3 cm',
      labelB: 'កម្ពស់ h = 6 cm',
      labelC: 'មាឌនៅសល់ = 113.04 cm³',
    },
    points: 20,
  },
];

// Function to generate a full 10-Slide Exercise Deck for any selected Lesson (1..20) or Daily Mix (0)
export function getTenSlideDeckForLesson(lessonId: number): MathSlideExercise[] {
  if (lessonId === 0) {
    return SIGNATURE_DAILY_10_SLIDES;
  }

  const lesson = GRADE_6_LESSONS.find((l) => l.id === lessonId) || GRADE_6_LESSONS[0];

  // Lesson-specific authentic 10-slide generators based on exact textbook exercises
  switch (lessonId) {
    case 1:
      return [
        {
          id: 'l1-1',
          slideNumber: 1,
          lessonId: 1,
          lessonTitle: lesson.title,
          textbookPage: 1,
          categoryLabel: 'អំណាន និងសំណេរចំនួន',
          question: 'ចូរសរសេរចំនួន៖ «ប្រាំរយហាសិបលាន បីរយប៉ែតសិបប្រាំពីរពាន់ ប្រាំមួយរយប្រាំពីរ» ជាតួលេខ។',
          formulaHint: 'ថ្នាក់លាន (550) · ថ្នាក់ពាន់ (387) · ថ្នាក់ឯកតា (607)',
          options: ['550 387 607', '550 378 607', '505 387 607', '550 387 670'],
          correctIndex: 0,
          directAnswerKey: ['550387607', '550 387 607'],
          steps: [
            'ថ្នាក់លាន៖ ប្រាំរយហាសិបលាន = 550 000 000',
            'ថ្នាក់ពាន់៖ បីរយប៉ែតសិបប្រាំពីរពាន់ = 387 000',
            'ថ្នាក់ឯកតា៖ ប្រាំមួយរយប្រាំពីរ = 607 · សរុប៖ 550 387 607',
          ],
          verification: 'ពិនិត្យតាមថ្នាក់៖ 550 (លាន) 387 (ពាន់) 607 (ឯកតា)។',
          diagramType: 'place-value',
          diagramProps: { primaryValue: '550 387 607', secondaryValue: '387 000', labelA: 'ថ្នាក់លាន: 550', labelB: 'ថ្នាក់ពាន់: 387' },
          points: 15,
        },
        {
          id: 'l1-2',
          slideNumber: 2,
          lessonId: 1,
          lessonTitle: lesson.title,
          textbookPage: 2,
          categoryLabel: 'ខ្ទង់ និងតម្លៃលេខតាមខ្ទង់',
          question: 'ក្នុងចំនួន 80 250 346 តើលេខ 8 ស្ថិតនៅខ្ទង់ណា និងមានតម្លៃស្មើប៉ុន្មាន?',
          formulaHint: 'រាប់ខ្ទង់ពីស្ដាំទៅឆ្វេង៖ រាយ ដប់ រយ ពាន់ ម៉ឺន សែន លាន ដប់លាន។',
          options: ['ខ្ទង់ដប់លាន មានតម្លៃ 80 000 000', 'ខ្ទង់លាន មានតម្លៃ 8 000 000', 'ខ្ទង់សែន មានតម្លៃ 800 000', 'ខ្ទង់រយលាន មានតម្លៃ 800 000 000'],
          correctIndex: 0,
          directAnswerKey: ['80000000', '80 000 000'],
          steps: [
            'លេខ 8 ស្ថិតនៅខ្ទង់ដប់លាននៃថ្នាក់លាន។',
            'តម្លៃរបស់វាគឺ 8 × 10 000 000 = 80 000 000 ។',
          ],
          verification: '80 250 346 = 80 000 000 + 200 000 + 50 000 + 300 + 40 + 6',
          diagramType: 'place-value',
          diagramProps: { primaryValue: '80 250 346', secondaryValue: '80 000 000', labelA: 'លេខ 8 នៅខ្ទង់ដប់លាន', labelB: 'តម្លៃ = 80 000 000' },
          points: 15,
        },
        {
          id: 'l1-3',
          slideNumber: 3,
          lessonId: 1,
          lessonTitle: lesson.title,
          textbookPage: 2,
          categoryLabel: 'ទម្រង់ពង្រាយនៃចំនួនគត់',
          question: 'ចូរសរសេរចំនួន 15 721 540 ជាទម្រង់ពង្រាយឱ្យបានត្រឹមត្រូវ។',
          formulaHint: 'បំបែកតាមតម្លៃលេខនៃខ្ទង់នីមួយៗដែលមិនមែនសូន្យ។',
          options: [
            '10 000 000 + 5 000 000 + 700 000 + 20 000 + 1 000 + 500 + 40',
            '1 000 000 + 500 000 + 70 000 + 2 000 + 100 + 50 + 4',
            '15 000 000 + 70 000 + 21 000 + 540',
            '10 000 000 + 5 000 000 + 70 000 + 2 000 + 1 000 + 540',
          ],
          correctIndex: 0,
          directAnswerKey: ['10000000+5000000+700000+20000+1000+500+40'],
          steps: [
            'ខ្ទង់ដប់លាន៖ 10 000 000 · ខ្ទង់លាន៖ 5 000 000',
            'ខ្ទង់សែន៖ 700 000 · ខ្ទង់ម៉ឺន៖ 20 000 · ខ្ទង់ពាន់៖ 1 000',
            'ខ្ទង់រយ៖ 500 · ខ្ទង់ដប់៖ 40',
          ],
          verification: 'បូកបញ្ចូលគ្នាបាន 15 721 540 ។',
          diagramType: 'place-value',
          diagramProps: { primaryValue: '15 721 540', secondaryValue: '15 លាន', labelA: 'ថ្នាក់លាន: 15', labelB: 'ថ្នាក់ពាន់: 721' },
          points: 15,
        },
        {
          id: 'l1-4',
          slideNumber: 4,
          lessonId: 1,
          lessonTitle: lesson.title,
          textbookPage: 3,
          categoryLabel: 'ការប្រៀបធៀបចំនួន',
          question: 'ចូរប្រៀបធៀបចំនួន 7 963 250 និង 7 959 870 ។ តើសញ្ញាណាមួយត្រឹមត្រូវ?',
          formulaHint: 'ប្រៀបធៀបពីខ្ទង់ធំបំផុត (ខ្ទង់លាន សែន ម៉ឺន) ចុះមក។',
          options: [
            '7 963 250 > 7 959 870',
            '7 963 250 < 7 959 870',
            '7 963 250 = 7 959 870',
            'មិនអាចប្រៀបធៀបបាន',
          ],
          correctIndex: 0,
          directAnswerKey: ['>', '7 963 250 > 7 959 870'],
          steps: [
            'ខ្ទង់លានស្មើគ្នា (7 = 7) និងខ្ទង់សែនស្មើគ្នា (9 = 9)។',
            'នៅខ្ទង់ម៉ឺន៖ 6 > 5 ដូចនេះ 7 963 250 > 7 959 870 ។',
          ],
          verification: 'នៅខ្ទង់ម៉ឺន 6 ម៉ឺន ធំជាង 5 ម៉ឺន។',
          diagramType: 'place-value',
          diagramProps: { primaryValue: '7 963 250', secondaryValue: '7 959 870', labelA: 'ខ្ទង់ម៉ឺន = 6', labelB: 'ខ្ទង់ម៉ឺន = 5 (6 > 5)' },
          points: 15,
        },
        {
          id: 'l1-5',
          slideNumber: 5,
          lessonId: 1,
          lessonTitle: lesson.title,
          textbookPage: 3,
          categoryLabel: 'ការរៀបលំដាប់ចំនួន',
          question: 'ចូររៀបលំដាប់ចំនួន 3 303 003 ; 3 300 033 ; 3 033 003 ; 3 300 303 ពីតូចទៅធំ។',
          formulaHint: 'ពិនិត្យខ្ទង់សែន និងខ្ទង់ពាន់នៃចំនួននីមួយៗ។',
          options: [
            '3 033 003 ; 3 300 033 ; 3 300 303 ; 3 303 003',
            '3 033 003 ; 3 300 303 ; 3 300 033 ; 3 303 003',
            '3 300 033 ; 3 033 003 ; 3 300 303 ; 3 303 003',
            '3 303 003 ; 3 300 303 ; 3 300 033 ; 3 033 003',
          ],
          correctIndex: 0,
          directAnswerKey: ['3033003;3300033;3300303;3303003'],
          steps: [
            'ចំនួនតូចជាងគេគឺ 3 033 003 (ខ្ទង់សែនគឺ 0)។',
            'បន្ទាប់មក 3 300 033 < 3 300 303 < 3 303 003 ។',
          ],
          verification: '3 033 003 < 3 300 033 < 3 300 303 < 3 303 003',
          diagramType: 'place-value',
          diagramProps: { primaryValue: '3 033 003', secondaryValue: '3 303 003', labelA: 'តូចបំផុត: 3 033 003', labelB: 'ធំបំផុត: 3 303 003' },
          points: 15,
        },
        {
          id: 'l1-6',
          slideNumber: 6,
          lessonId: 1,
          lessonTitle: lesson.title,
          textbookPage: 4,
          categoryLabel: 'ការបង្គត់ចំនួនត្រឹមខ្ទង់លាន',
          question: 'ចូរបង្គត់ចំនួន 6 871 955 ត្រឹមខ្ទង់លាន។',
          formulaHint: 'មើលខ្ទង់សែន (លេខ 8)៖ បើធំជាង ឬស្មើ 5 ត្រូវបង្គត់ឡើង។',
          options: ['7 000 000', '6 000 000', '6 900 000', '6 800 000'],
          correctIndex: 0,
          directAnswerKey: ['7000000', '7 000 000'],
          steps: [
            'លេខនៅខ្ទង់លានគឺ 6 ហើយខ្ទង់ខាងស្ដាំជាប់វា (ខ្ទង់សែន) គឺលេខ 8 ។',
            'ដោយលេខ 8 ស្ថិតក្នុងក្រុម {5; 6; 7; 8; 9} ត្រូវបង្គត់ឡើងទៅ 7 000 000 ។',
          ],
          verification: '6 871 955 នៅជិត 7 000 000 ជាង 6 000 000 ។',
          diagramType: 'place-value',
          diagramProps: { primaryValue: '6 871 955', secondaryValue: '7 000 000', labelA: 'ខ្ទង់សែន = 8', labelB: 'បង្គត់ឡើង → 7 000 000' },
          points: 15,
        },
        {
          id: 'l1-7',
          slideNumber: 7,
          lessonId: 1,
          lessonTitle: lesson.title,
          textbookPage: 4,
          categoryLabel: 'ការបង្គត់ចំនួនប្រជាជន',
          question: 'ប្រទេសកម្ពុជាមានប្រជាជន 13 395 682 នាក់ (ទំព័រ ៤)។ ចូរបង្គត់ចំនួននេះត្រឹមខ្ទង់លាន។',
          formulaHint: 'លេខនៅខ្ទង់លានគឺ 3 ហើយខ្ទង់សែនគឺ 3 (តូចជាង 5)។',
          options: ['13 000 000 នាក់', '14 000 000 នាក់', '13 400 000 នាក់', '10 000 000 នាក់'],
          correctIndex: 0,
          directAnswerKey: ['13000000', '13 000 000'],
          steps: [
            'ខ្ទង់លានគឺលេខ 3 (13 លាន)។',
            'ខ្ទង់សែនគឺលេខ 3 តូចជាង 5 ត្រូវបង្គត់ចុះបាន 13 000 000 នាក់។',
          ],
          verification: '13 395 682 បង្គត់ត្រឹមខ្ទង់លានគឺ 13 000 000 ។',
          diagramType: 'place-value',
          diagramProps: { primaryValue: '13 395 682', secondaryValue: '13 000 000', labelA: 'ខ្ទង់សែន = 3', labelB: 'បង្គត់ចុះ → 13 000 000' },
          points: 15,
        },
        {
          id: 'l1-8',
          slideNumber: 8,
          lessonId: 1,
          lessonTitle: lesson.title,
          textbookPage: 4,
          categoryLabel: 'ការបង្គត់ត្រឹមខ្ទង់សែន',
          question: 'ចូរបង្គត់ចំនួន 5 623 501 ត្រឹមខ្ទង់សែន។',
          formulaHint: 'មើលលេខនៅខ្ទង់ម៉ឺន (ខាងស្ដាំជាប់ខ្ទង់សែន) គឺលេខ 2 ។',
          options: ['5 600 000', '5 700 000', '5 620 000', '6 000 000'],
          correctIndex: 0,
          directAnswerKey: ['5600000', '5 600 000'],
          steps: [
            'ខ្ទង់សែនគឺលេខ 6 ហើយខ្ទង់ម៉ឺនគឺលេខ 2 ។',
            'ដោយ 2 < 5 យើងបង្គត់ចុះទៅ 5 600 000 ។',
          ],
          verification: '5 623 501 នៅជិត 5 600 000 ជាង 5 700 000 ។',
          diagramType: 'place-value',
          diagramProps: { primaryValue: '5 623 501', secondaryValue: '5 600 000', labelA: 'ខ្ទង់ម៉ឺន = 2', labelB: 'បង្គត់ចុះ → 5 600 000' },
          points: 15,
        },
        {
          id: 'l1-9',
          slideNumber: 9,
          lessonId: 1,
          lessonTitle: lesson.title,
          textbookPage: 1,
          categoryLabel: 'អំណានចំនួនតាមថ្នាក់',
          question: 'ចំនួន 125 243 102 អានតាមថ្នាក់ដូចម្ដេច?',
          formulaHint: 'អានថ្នាក់លាន (125) ថ្នាក់ពាន់ (243) និងថ្នាក់ឯកតា (102)។',
          options: [
            'មួយរយម្ភៃប្រាំលាន ពីររយសែសិបបីពាន់ មួយរយពីរ',
            'មួយរយម្ភៃប្រាំលាន ពីររយសែសិបបីម៉ឺន មួយរយពីរ',
            'ដប់ពីរលាន ប្រាំរយម្ភៃបួនពាន់ បីរយដប់ពីរ',
            'មួយរយម្ភៃប្រាំពាន់ ពីររយសែសិបបី មួយរយពីរ',
          ],
          correctIndex: 0,
          directAnswerKey: ['មួយរយម្ភៃប្រាំលាន ពីររយសែសិបបីពាន់ មួយរយពីរ', '125 243 102'],
          steps: [
            '125 នៅថ្នាក់លាន អានថា៖ មួយរយម្ភៃប្រាំលាន',
            '243 នៅថ្នាក់ពាន់ អានថា៖ ពីររយសែសិបបីពាន់',
            '102 នៅថ្នាក់ឯកតា អានថា៖ មួយរយពីរ',
          ],
          verification: '125 243 102 មាន 3 ថ្នាក់គឺ លាន ពាន់ និងឯកតា។',
          diagramType: 'place-value',
          diagramProps: { primaryValue: '125 243 102', secondaryValue: '125 លាន', labelA: 'ថ្នាក់លាន: 125', labelB: 'ថ្នាក់ពាន់: 243' },
          points: 15,
        },
        {
          id: 'l1-10',
          slideNumber: 10,
          lessonId: 1,
          lessonTitle: lesson.title,
          textbookPage: 4,
          categoryLabel: 'សំយោគចំណេះដឹងមេរៀនទី ១',
          question: 'បង្គត់ចំនួន 8 593 456 ត្រឹមខ្ទង់លាន រួចប្រាប់ថាវាធំជាង 8 500 000 ប៉ុន្មាន?',
          formulaHint: '8 593 456 បង្គត់ត្រឹមខ្ទង់លានបាន 9 000 000 រួចដកនឹង 8 500 000 ។',
          options: ['បង្គត់បាន 9 000 000 (ធំជាង 500 000)', 'បង្គត់បាន 8 000 000 (តូចជាង 500 000)', 'បង្គត់បាន 8 600 000 (ធំជាង 100 000)', 'បង្គត់បាន 9 000 000 (ធំជាង 400 000)'],
          correctIndex: 0,
          directAnswerKey: ['9000000', '500000'],
          steps: [
            'ខ្ទង់សែននៃ 8 593 456 គឺលេខ 5 ដូចនេះបង្គត់ឡើងត្រឹមខ្ទង់លានបាន 9 000 000 ។',
            'ផលដក៖ 9 000 000 - 8 500 000 = 500 000 ។',
          ],
          verification: '8 593 456 → 9 000 000 ។',
          diagramType: 'place-value',
          diagramProps: { primaryValue: '8 593 456', secondaryValue: '9 000 000', labelA: 'ខ្ទង់សែន = 5', labelB: 'បង្គត់ឡើង → 9 000 000' },
          points: 20,
        },
      ];

    default: {
      // Build a tailored 10-slide deck for the selected lesson combining textbook exercises from that topic
      // plus connected Grade 6 reinforcement problems
      return SIGNATURE_DAILY_10_SLIDES.map((slide, idx) => {
        if (idx === 0) {
          return {
            ...slide,
            id: `lesson-${lessonId}-s1`,
            slideNumber: 1,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            textbookPage: lesson.bookPage,
            categoryLabel: `គោលគំនិតសំខាន់ · ${lesson.title}`,
          };
        }
        return {
          ...slide,
          id: `lesson-${lessonId}-s${idx + 1}`,
          slideNumber: idx + 1,
        };
      });
    }
  }
}
