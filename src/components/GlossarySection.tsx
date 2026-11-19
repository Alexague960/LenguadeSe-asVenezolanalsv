import React, { useMemo, useState } from 'react';
import { BookMarked, Search } from 'lucide-react';
import { MODULES_DATA, SignItem } from '../data/lsvData';

interface GlossarySectionProps {
  onSelectSign: (sign: SignItem) => void;
}

interface LsvTermItem {
  term: string;
  definition: string;
}

const LSV_CONCEPTS: LsvTermItem[] = [
  {
    term: 'Configuración manual (CM)',
    definition:
      'Forma exacta que adoptan los dedos y la mano al articular una seña (mano abierta, puño, V, L, entre otras).',
  },
  {
    term: 'Dactilología',
    definition:
      'Deletreo manual de letras y dígrafos del alfabeto venezolano, usado para nombres propios, lugares o siglas.',
  },
  {
    term: 'Punto de articulación',
    definition:
      'Zona del cuerpo o del espacio neutro frente al rostro y pecho donde se ejecuta la seña.',
  },
  {
    term: 'Componentes no manuales',
    definition:
      'Expresiones faciales, movimiento de cejas, postura de la cabeza y mirada que aportan gramática y tono (pregunta, negación o énfasis).',
  },
  {
    term: 'Orientación y movimiento',
    definition:
      'Dirección hacia donde apunta la palma y desplazamiento recto, circular u oscilatorio indicado con flechas en cada lámina.',
  },
  {
    term: 'Seña personal (Apodo en LSV)',
    definition:
      'Seña única con la que la comunidad sorda identifica a cada persona según un rasgo físico, costumbre o inicial.',
  },
];

function getInitialBucket(word: string): string {
  const clean = word
    .replace(/^[¡¿\s]+/, '')
    .trim()
    .toUpperCase();
  if (!clean) return '#';
  if (/^[0-9]/.test(clean)) return '0–9';
  const ch = clean.charAt(0);
  if (ch === 'Ñ') return 'Ñ';
  const base = ch.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return /^[A-Z]$/.test(base) ? base : '#';
}

export const GlossarySection: React.FC<GlossarySectionProps> = ({ onSelectSign }) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'senas' | 'conceptos'>('senas');
  const [letterFilter, setLetterFilter] = useState<string>('Todas');

  const allEntries = useMemo(() => {
    const list: Array<{ sign: SignItem; moduleTitle: string; moduleNumber: string; initial: string }> =
      [];
    for (const mod of MODULES_DATA) {
      if (mod.id === 'frases') continue; // avoid repeating module-12 linked copies
      for (const s of mod.signs) {
        list.push({
          sign: s,
          moduleTitle: mod.title,
          moduleNumber: mod.number,
          initial: getInitialBucket(s.letter),
        });
      }
    }
    return list.sort((a, b) =>
      a.sign.letter.localeCompare(b.sign.letter, 'es', { sensitivity: 'base' })
    );
  }, []);

  const availableLetters = useMemo(() => {
    const set = new Set(allEntries.map((e) => e.initial));
    const ordered = Array.from(set).sort((a, b) => {
      if (a === '0–9') return -1;
      if (b === '0–9') return 1;
      return a.localeCompare(b, 'es');
    });
    return ['Todas', ...ordered];
  }, [allEntries]);

  const filteredEntries = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allEntries.filter((entry) => {
      if (letterFilter !== 'Todas' && entry.initial !== letterFilter) return false;
      if (!q) return true;
      return (
        entry.sign.letter.toLowerCase().includes(q) ||
        entry.sign.desc.toLowerCase().includes(q) ||
        entry.sign.tip.toLowerCase().includes(q) ||
        entry.moduleTitle.toLowerCase().includes(q)
      );
    });
  }, [allEntries, query, letterFilter]);

  const filteredConcepts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LSV_CONCEPTS;
    return LSV_CONCEPTS.filter(
      (c) => c.term.toLowerCase().includes(q) || c.definition.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <section
      id="glosario"
      className="border-t border-slate-200 bg-[#FAF9F6] py-20 transition-colors dark:border-slate-800 dark:bg-[#060D1A]"
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#B7791F] dark:text-[#F6E05E]">
              <BookMarked className="h-3.5 w-3.5" />
              <span>Referencia rápida</span>
            </p>
            <h2 className="mt-2 font-serif text-3xl font-black tracking-tight text-[#0A1628] sm:text-4xl dark:text-white">
              Glosario LSV
            </h2>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
              Consulta alfabéticamente todas las señas ilustradas del programa y los conceptos
              fundamentales de la Lengua de Señas Venezolana.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-[#0F1B2E]">
              <button
                type="button"
                onClick={() => setActiveTab('senas')}
                className={`min-h-[36px] rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  activeTab === 'senas'
                    ? 'bg-[#0A1628] text-white dark:bg-[#D69E2E] dark:text-[#0A1628]'
                    : 'text-slate-600 hover:text-[#0A1628] dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                Diccionario ({allEntries.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('conceptos')}
                className={`min-h-[36px] rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  activeTab === 'conceptos'
                    ? 'bg-[#0A1628] text-white dark:bg-[#D69E2E] dark:text-[#0A1628]'
                    : 'text-slate-600 hover:text-[#0A1628] dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                Conceptos clave ({LSV_CONCEPTS.length})
              </button>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar en el glosario..."
                aria-label="Buscar en el glosario LSV"
                className="min-h-[42px] w-full rounded-lg border border-slate-300 bg-white py-2 pr-3 pl-9 text-sm text-[#0A1628] placeholder:text-slate-400 focus:border-[#0A1628] focus:outline-none sm:w-64 dark:border-slate-700 dark:bg-[#0F1B2E] dark:text-white dark:placeholder:text-slate-400 dark:focus:border-[#F6E05E]"
              />
            </div>
          </div>
        </div>

        {activeTab === 'senas' ? (
          <div className="mt-8 space-y-6">
            <div
              className="flex flex-wrap gap-1.5"
              role="tablist"
              aria-label="Índice alfabético del glosario"
            >
              {availableLetters.map((ltr) => {
                const isActive = letterFilter === ltr;
                return (
                  <button
                    key={ltr}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setLetterFilter(ltr)}
                    className={`min-h-[34px] min-w-[34px] rounded-md border px-2.5 py-1 text-xs font-bold transition-colors ${
                      isActive
                        ? 'border-[#0A1628] bg-[#0A1628] text-white dark:border-[#D69E2E] dark:bg-[#D69E2E] dark:text-[#0A1628]'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-[#0F1B2E] dark:text-slate-300 dark:hover:border-slate-500'
                    }`}
                  >
                    {ltr}
                  </button>
                );
              })}
            </div>

            {filteredEntries.length > 0 ? (
              <div className="grid max-h-[540px] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredEntries.map((entry) => (
                  <button
                    key={`${entry.moduleNumber}-${entry.sign.id}`}
                    type="button"
                    onClick={() => onSelectSign(entry.sign)}
                    className="group flex items-center gap-3.5 rounded-xl border border-slate-200 bg-white p-3 text-left transition-all hover:border-[#D69E2E] hover:shadow-sm dark:border-slate-800 dark:bg-[#0F1B2E] dark:hover:border-[#D69E2E]"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700">
                      {entry.sign.img ? (
                        <img
                          src={entry.sign.img}
                          alt={`Seña ${entry.sign.letter}`}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className={`h-full w-full ${
                            entry.sign.imgCropTop
                              ? 'object-cover object-top'
                              : 'object-contain'
                          }`}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-serif text-lg font-black text-[#0A1628]">
                          {entry.sign.letter}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-serif text-base font-bold text-[#0A1628] group-hover:text-[#B7791F] dark:text-white dark:group-hover:text-[#F6E05E]">
                          {entry.sign.letter}
                        </span>
                        <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 tabular-nums dark:bg-slate-800 dark:text-slate-300">
                          M{entry.moduleNumber}
                        </span>
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                        {entry.sign.desc}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-400 dark:text-slate-400">
                        {entry.moduleTitle}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-[#0F1B2E]">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  No se encontraron señas en el glosario con ese criterio.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setLetterFilter('Todas');
                  }}
                  className="mt-2 text-xs font-semibold text-[#C53030] underline underline-offset-4 dark:text-[#F6E05E]"
                >
                  Restablecer glosario
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredConcepts.map((c) => (
              <article
                key={c.term}
                className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0F1B2E]"
              >
                <h3 className="font-serif text-lg font-bold text-[#0A1628] dark:text-[#F6E05E]">
                  {c.term}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {c.definition}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
