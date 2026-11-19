import React, { useState } from 'react';
import {
  BookMarked,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  FileText,
  Home,
  Lightbulb,
  Mail,
  Shuffle,
  X,
} from 'lucide-react';
import { MODULES_DATA } from '../data/lsvData';

interface SideDrawerProps {
  isOpen: boolean;
  activeModuleIndex: number;
  completedSigns?: Record<string, boolean>;
  onClose: () => void;
  onGoHome: () => void;
  onSelectModule: (index: number) => void;
  onScrollToSection: (id: string) => void;
  onOpenRandomPractice: () => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  activeModuleIndex,
  completedSigns = {},
  onClose,
  onGoHome,
  onSelectModule,
  onScrollToSection,
  onOpenRandomPractice,
}) => {
  const [submenuOpen, setSubmenuOpen] = useState(true);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-[#0A1628]/50 transition-opacity duration-200 dark:bg-black/70 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-[380px] overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ease-out dark:border-l dark:border-slate-800 dark:bg-[#0F1B2E] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Índice de Contenidos"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <h3 className="font-serif text-xl font-bold text-[#0A1628] dark:text-white">
            Índice de Contenidos
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#0A1628] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="py-3">
          <button
            type="button"
            onClick={() => {
              onGoHome();
              onClose();
            }}
            className="flex w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-[#FAF9F6] dark:hover:bg-[#16243B]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FAF9F6] text-[#0A1628] dark:bg-[#16243B] dark:text-[#F6E05E]">
              <Home className="h-4 w-4" />
            </span>
            <div>
              <div className="text-sm font-semibold text-[#0A1628] dark:text-white">Inicio</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Página principal</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenRandomPractice();
            }}
            className="flex w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-[#FAF9F6] dark:hover:bg-[#16243B]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#D69E2E]/15 text-[#B7791F] dark:bg-[#F6E05E]/15 dark:text-[#F6E05E]">
              <Shuffle className="h-4 w-4" />
            </span>
            <div>
              <div className="text-sm font-semibold text-[#0A1628] dark:text-white">
                Práctica Aleatoria
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Desafío rápido al azar
              </div>
            </div>
          </button>

          <div className="mx-6 my-1 h-px bg-slate-200 dark:bg-slate-800" />

          <button
            type="button"
            onClick={() => setSubmenuOpen((prev) => !prev)}
            className="flex w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-[#FAF9F6] dark:hover:bg-[#16243B]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FAF9F6] text-[#0A1628] dark:bg-[#16243B] dark:text-[#F6E05E]">
              <BookOpen className="h-4 w-4" />
            </span>
            <div className="flex-1">
              <div className="text-sm font-semibold text-[#0A1628] dark:text-white">Módulos</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {MODULES_DATA.length} módulos de aprendizaje
              </div>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-slate-500 transition-transform duration-200 dark:text-slate-400 ${
                submenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {submenuOpen && (
            <div className="bg-[#FAF9F6] py-1 dark:bg-[#0A1424]">
              {MODULES_DATA.map((mod, idx) => {
                const doneCount = mod.signs.filter((s) => completedSigns[s.id]).length;
                const allDone = mod.signs.length > 0 && doneCount === mod.signs.length;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => {
                      onSelectModule(idx);
                      onClose();
                    }}
                    className={`flex w-full items-center gap-3 px-6 py-3 pl-16 text-left text-sm transition-colors hover:bg-[#D69E2E]/10 ${
                      activeModuleIndex === idx
                        ? 'font-semibold text-[#0A1628] dark:text-[#F6E05E]'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span className="font-serif text-xs font-bold text-slate-400 tabular-nums dark:text-slate-500">
                      {mod.number}
                    </span>
                    <span className="flex-1 truncate">{mod.title}</span>
                    {doneCount > 0 && (
                      <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                        {allDone ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <span>
                            {doneCount}/{mod.signs.length}
                          </span>
                        )}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <div className="mx-6 my-1 h-px bg-slate-200 dark:bg-slate-800" />

          <button
            type="button"
            onClick={() => {
              onScrollToSection('sabias-que');
              onClose();
            }}
            className="flex w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-[#FAF9F6] dark:hover:bg-[#16243B]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FAF9F6] text-[#0A1628] dark:bg-[#16243B] dark:text-[#F6E05E]">
              <Lightbulb className="h-4 w-4" />
            </span>
            <div>
              <div className="text-sm font-semibold text-[#0A1628] dark:text-white">
                ¿Sabías que...?
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Datos interesantes</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              onScrollToSection('glosario');
              onClose();
            }}
            className="flex w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-[#FAF9F6] dark:hover:bg-[#16243B]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FAF9F6] text-[#0A1628] dark:bg-[#16243B] dark:text-[#F6E05E]">
              <BookMarked className="h-4 w-4" />
            </span>
            <div>
              <div className="text-sm font-semibold text-[#0A1628] dark:text-white">
                Glosario LSV
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Diccionario alfabético A–Z
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              onScrollToSection('informacion');
              onClose();
            }}
            className="flex w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-[#FAF9F6] dark:hover:bg-[#16243B]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FAF9F6] text-[#0A1628] dark:bg-[#16243B] dark:text-[#F6E05E]">
              <FileText className="h-4 w-4" />
            </span>
            <div>
              <div className="text-sm font-semibold text-[#0A1628] dark:text-white">Información</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Contexto sobre la LSV
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              onScrollToSection('contacto');
              onClose();
            }}
            className="flex w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-[#FAF9F6] dark:hover:bg-[#16243B]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FAF9F6] text-[#0A1628] dark:bg-[#16243B] dark:text-[#F6E05E]">
              <Mail className="h-4 w-4" />
            </span>
            <div>
              <div className="text-sm font-semibold text-[#0A1628] dark:text-white">Créditos</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Autoría y pie de página</div>
            </div>
          </button>
        </nav>
      </aside>
    </>
  );
};
