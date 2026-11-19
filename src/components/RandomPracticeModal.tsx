import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Eye, RotateCcw, Shuffle, X, XCircle } from 'lucide-react';
import { MODULES_DATA, SignItem } from '../data/lsvData';

interface CatalogSignEntry {
  sign: SignItem;
  moduleNumber: string;
  moduleTitle: string;
}

interface RandomPracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignCompleted?: (sign: SignItem) => void;
}

function buildCatalog(): CatalogSignEntry[] {
  const seenIds = new Set<string>();
  const entries: CatalogSignEntry[] = [];

  for (const mod of MODULES_DATA) {
    for (const sign of mod.signs) {
      if (!sign.img || seenIds.has(sign.id)) continue;
      seenIds.add(sign.id);
      entries.push({
        sign,
        moduleNumber: mod.number,
        moduleTitle: mod.title,
      });
    }
  }

  return entries;
}

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickRandomChallenge(
  catalog: CatalogSignEntry[],
  excludeId?: string
): { target: CatalogSignEntry; options: SignItem[] } {
  const pool =
    excludeId && catalog.length > 1
      ? catalog.filter((entry) => entry.sign.id !== excludeId)
      : catalog;

  const target = pool[Math.floor(Math.random() * pool.length)];

  const usedLetters = new Set<string>([target.sign.letter.trim().toUpperCase()]);
  const distractors: SignItem[] = [];

  // Mix candidates so choices feel natural and diverse across the catalog
  const shuffledPool = shuffleArray(catalog);
  for (const candidate of shuffledPool) {
    if (distractors.length >= 3) break;
    const norm = candidate.sign.letter.trim().toUpperCase();
    if (!usedLetters.has(norm)) {
      usedLetters.add(norm);
      distractors.push(candidate.sign);
    }
  }

  return {
    target,
    options: shuffleArray([target.sign, ...distractors]),
  };
}

export const RandomPracticeModal: React.FC<RandomPracticeModalProps> = ({
  isOpen,
  onClose,
  onSignCompleted,
}) => {
  const catalog = useMemo(() => buildCatalog(), []);

  const [challenge, setChallenge] = useState<{
    target: CatalogSignEntry;
    options: SignItem[];
  } | null>(null);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [stats, setStats] = useState({ correct: 0, attempts: 0 });

  const loadNextSign = useCallback(
    (excludeId?: string) => {
      if (catalog.length === 0) return;
      setChallenge(pickRandomChallenge(catalog, excludeId));
      setWrongIds([]);
      setSolved(false);
      setRevealed(false);
      setImgError(false);
    },
    [catalog]
  );

  useEffect(() => {
    if (isOpen) {
      loadNextSign();
      setStats({ correct: 0, attempts: 0 });
    } else {
      setChallenge(null);
    }
  }, [isOpen, loadNextSign]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen || !challenge) return null;

  const { target, options } = challenge;
  const isFinished = solved || revealed;

  const handlePickOption = (opt: SignItem) => {
    if (isFinished || wrongIds.includes(opt.id)) return;

    if (opt.id === target.sign.id) {
      const firstTry = wrongIds.length === 0;
      setSolved(true);
      onSignCompleted?.(target.sign);
      setStats((prev) => ({
        correct: prev.correct + (firstTry ? 1 : 0),
        attempts: prev.attempts + 1,
      }));
    } else {
      setWrongIds((prev) => [...prev, opt.id]);
    }
  };

  const handleReveal = () => {
    if (isFinished) return;
    setRevealed(true);
    setStats((prev) => ({
      correct: prev.correct,
      attempts: prev.attempts + 1,
    }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1628]/65 p-3 backdrop-blur-xs sm:p-4 dark:bg-black/80"
      role="dialog"
      aria-modal="true"
      aria-labelledby="random-practice-title"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#0F1B2E]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-5 py-3.5 sm:px-6 sm:py-4 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#D69E2E]/15 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#B7791F] dark:bg-[#F6E05E]/15 dark:text-[#F6E05E]">
              <Shuffle className="h-3.5 w-3.5" />
              Práctica Aleatoria
            </span>
            <span className="text-xs font-semibold text-slate-500 tabular-nums dark:text-slate-400">
              Aciertos: {stats.correct} / {stats.attempts}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar práctica aleatoria"
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#0A1628] focus-visible:outline-2 focus-visible:outline-[#0A1628] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <span>Cerrar</span>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          <div className="grid gap-6 md:grid-cols-12 md:items-center">
            {/* Illustration Frame (always crisp white background) */}
            <div className="md:col-span-5">
              <div className="mx-auto aspect-square w-full max-w-[240px] overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xs md:max-w-none dark:border-slate-700">
                {target.sign.img && !imgError ? (
                  <img
                    src={target.sign.img}
                    alt="Ilustración de seña aleatoria para identificar"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className={`h-full w-full ${
                      target.sign.imgCropTop ? 'object-cover object-top' : 'object-contain'
                    }`}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#FAF9F6] font-serif text-3xl font-black text-[#0A1628]">
                    ?
                  </div>
                )}
              </div>
              <div className="mt-2.5 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
                Módulo {target.moduleNumber} · {target.moduleTitle}
              </div>
            </div>

            {/* Question & Options */}
            <div className="space-y-4 md:col-span-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B7791F] dark:text-[#F6E05E]">
                  Catálogo completo ({catalog.length} señas)
                </p>
                <h2
                  id="random-practice-title"
                  className="mt-1 font-serif text-2xl font-black tracking-tight text-[#0A1628] dark:text-white"
                >
                  ¿Qué seña muestra esta ilustración?
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {options.map((opt) => {
                  const isCorrectOpt = opt.id === target.sign.id;
                  const isWrongPicked = wrongIds.includes(opt.id);
                  const showAsCorrect = isFinished && isCorrectOpt;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isFinished || isWrongPicked}
                      onClick={() => handlePickOption(opt)}
                      className={`flex min-h-[48px] items-center justify-between gap-2 rounded-xl border px-4 py-2.5 text-left text-sm font-bold transition-colors ${
                        showAsCorrect
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-200'
                          : isWrongPicked
                            ? 'border-red-400 bg-red-50 text-red-800 line-through opacity-75 dark:border-red-500/70 dark:bg-red-950/40 dark:text-red-300'
                            : 'border-slate-300 bg-[#FAF9F6] text-[#0A1628] hover:border-[#D69E2E] hover:bg-white disabled:opacity-60 dark:border-slate-700 dark:bg-[#16243B] dark:text-white dark:hover:border-[#F6E05E] dark:hover:bg-[#1E2F4C]'
                      }`}
                    >
                      <span className="truncate">{opt.letter}</span>
                      {showAsCorrect && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />}
                      {isWrongPicked && <XCircle className="h-4 w-4 shrink-0 text-red-500 dark:text-red-400" />}
                    </button>
                  );
                })}
              </div>

              {!isFinished && wrongIds.length > 0 && (
                <p className="text-xs font-medium text-red-600 dark:text-red-400">
                  No coincide con la ilustración. Prueba otra opción o revela la respuesta.
                </p>
              )}

              {isFinished && (
                <div className="rounded-xl border border-slate-200 bg-[#FAF9F6] p-4 dark:border-slate-800 dark:bg-[#0A1424]">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#B7791F] dark:text-[#F6E05E]">
                    <span>
                      {solved
                        ? wrongIds.length === 0
                          ? '¡Correcto a la primera!'
                          : '¡Correcto!'
                        : 'Respuesta revelada'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#0A1628] dark:text-white">{target.sign.letter}</span>
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-[#0A1628] dark:text-white">
                    {target.sign.desc}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {target.sign.tip}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-[#FAF9F6] px-5 py-3.5 sm:px-6 sm:py-4 dark:border-slate-800 dark:bg-[#0A1424]">
          <div className="flex items-center gap-2">
            {!isFinished ? (
              <button
                type="button"
                onClick={handleReveal}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-[#0A1628] transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-[#0F1B2E] dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Eye className="h-4 w-4" />
                <span>Ver respuesta</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStats({ correct: 0, attempts: 0 })}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-[#0F1B2E] dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reiniciar marcador</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => loadNextSign(target.sign.id)}
            className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-[#0A1628] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#142849] dark:bg-[#D69E2E] dark:text-[#0A1628] dark:hover:bg-[#E2AD3B]"
          >
            <Shuffle className="h-4 w-4" />
            <span>Otra seña al azar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
