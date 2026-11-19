import React, { useEffect, useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Circle, X } from 'lucide-react';
import { SignItem } from '../data/lsvData';

interface SignDetailModalProps {
  sign: SignItem | null;
  signs: SignItem[];
  isCompleted?: boolean;
  onToggleCompleted?: (sign: SignItem) => void;
  onClose: () => void;
  onSelectSign: (sign: SignItem) => void;
}

export const SignDetailModal: React.FC<SignDetailModalProps> = ({
  sign,
  signs,
  isCompleted = false,
  onToggleCompleted,
  onClose,
  onSelectSign,
}) => {
  const [imgError, setImgError] = useState(false);

  const currentIndex = sign ? signs.findIndex((s) => s.id === sign.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < signs.length - 1;

  useEffect(() => {
    setImgError(false);
  }, [sign?.id]);

  useEffect(() => {
    if (!sign) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onSelectSign(signs[currentIndex - 1]);
      if (e.key === 'ArrowRight' && hasNext) onSelectSign(signs[currentIndex + 1]);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [sign, currentIndex, hasPrev, hasNext, onClose, onSelectSign, signs]);

  if (!sign) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1628]/60 p-3 backdrop-blur-xs sm:p-4 dark:bg-black/75"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sign-modal-title"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#0F1B2E]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-5 py-3.5 sm:px-6 sm:py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500 tabular-nums dark:text-slate-400">
              Seña {currentIndex + 1} de {signs.length}
            </span>
            {onToggleCompleted && (
              <button
                type="button"
                onClick={() => onToggleCompleted(sign)}
                aria-pressed={isCompleted}
                className={`inline-flex min-h-[32px] items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors ${
                  isCompleted
                    ? 'border-emerald-500/50 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-500/40 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-950'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-[#16243B] dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Repasada</span>
                  </>
                ) : (
                  <>
                    <Circle className="h-3.5 w-3.5 text-slate-400" />
                    <span>Marcar repasada</span>
                  </>
                )}
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar detalle de seña"
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#0A1628] focus-visible:outline-2 focus-visible:outline-[#0A1628] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <span>Cerrar</span>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 md:p-8">
          <div className="grid gap-5 md:grid-cols-2 md:items-center md:gap-6">
            <div className="mx-auto aspect-square w-full max-w-[260px] overflow-hidden rounded-xl border border-slate-200 bg-white sm:max-w-none dark:border-slate-700">
              {sign.img && !imgError ? (
                <img
                  src={sign.img}
                  alt={`Ilustración de la seña ${sign.letter}`}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className={`h-full w-full ${
                    sign.imgCropTop ? 'object-cover object-top' : 'object-contain'
                  }`}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#FAF9F6] font-serif text-4xl font-black text-[#0A1628]">
                  {sign.letter}
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center space-y-3 sm:space-y-4">
              <div>
                <h2
                  id="sign-modal-title"
                  className="font-serif text-3xl font-black tracking-tight text-[#0A1628] sm:text-4xl dark:text-white"
                >
                  {sign.letter}
                </h2>
                <p className="mt-1.5 text-base font-medium text-slate-700 sm:mt-2 dark:text-slate-200">
                  {sign.desc}
                </p>
                <div className="mt-3 border-t border-slate-200 pt-3 sm:mt-4 sm:pt-4 dark:border-slate-800">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#B7791F] dark:text-[#F6E05E]">
                    Cómo articularla
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {sign.tip}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between border-t border-slate-200 bg-[#FAF9F6] px-5 py-3.5 sm:px-6 sm:py-4 dark:border-slate-800 dark:bg-[#0A1424]">
          <button
            type="button"
            disabled={!hasPrev}
            onClick={() => hasPrev && onSelectSign(signs[currentIndex - 1])}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#0A1628] transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-[#0F1B2E] dark:text-white dark:hover:bg-slate-800"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </button>

          <button
            type="button"
            disabled={!hasNext}
            onClick={() => hasNext && onSelectSign(signs[currentIndex + 1])}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#0A1628] transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-[#0F1B2E] dark:text-white dark:hover:bg-slate-800"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
