import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { MODULES_DATA, SignItem } from '../data/lsvData';

interface ModulePracticeProps {
  moduleId: string;
  onSelectSign: (sign: SignItem) => void;
}

function normalizeChar(char: string): string {
  const upper = char.toUpperCase();
  if (upper === 'Ñ') return 'Ñ';
  return upper
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function SignThumb({
  sign,
  onErrorFallback,
}: {
  sign: SignItem;
  onErrorFallback?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (sign.img && !failed && !onErrorFallback) {
    return (
      <img
        src={sign.img}
        alt={`Seña ${sign.letter}`}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={`h-full w-full ${
          sign.imgCropTop ? 'object-cover object-top' : 'object-contain bg-white'
        }`}
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#FAF9F6] font-serif text-lg font-black text-[#0A1628] dark:bg-slate-800 dark:text-white">
      {sign.letter}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 01 · ABECEDARIO: Deletrea tu Nombre y Apellido                             */
/* -------------------------------------------------------------------------- */
const AbecedarioPractice: React.FC<{ onSelectSign: (s: SignItem) => void }> = ({
  onSelectSign,
}) => {
  const [fullName, setFullName] = useState('Ana Sofía Rodríguez');
  const [stepIndex, setStepIndex] = useState<number>(0);

  const alphabetMap = useMemo(() => {
    const abecedario = MODULES_DATA.find((m) => m.id === 'abecedario');
    const map = new Map<string, SignItem>();
    abecedario?.signs.forEach((s) => map.set(s.letter.toUpperCase(), s));
    return map;
  }, []);

  const wordGroups = useMemo(() => {
    const words = fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 5);

    let flatIdx = 0;
    return words.map((word, wIdx) => {
      const chars = Array.from(word).slice(0, 16);
      const tokens: Array<{ key: string; sign: SignItem; flatIndex: number }> = [];

      for (let i = 0; i < chars.length; i++) {
        const norm = normalizeChar(chars[i]);
        const nextNorm = i + 1 < chars.length ? normalizeChar(chars[i + 1]) : '';

        if (norm === 'L' && nextNorm === 'L' && alphabetMap.has('LL')) {
          tokens.push({
            key: `w${wIdx}-ll-${i}`,
            sign: alphabetMap.get('LL')!,
            flatIndex: flatIdx++,
          });
          i++;
          continue;
        }
        if (norm === 'R' && nextNorm === 'R' && alphabetMap.has('RR')) {
          tokens.push({
            key: `w${wIdx}-rr-${i}`,
            sign: alphabetMap.get('RR')!,
            flatIndex: flatIdx++,
          });
          i++;
          continue;
        }
        const sign = alphabetMap.get(norm);
        if (sign) {
          tokens.push({
            key: `w${wIdx}-${sign.id}-${i}`,
            sign,
            flatIndex: flatIdx++,
          });
        }
      }

      return { word, tokens };
    });
  }, [fullName, alphabetMap]);

  const flatTokens = useMemo(() => wordGroups.flatMap((g) => g.tokens), [wordGroups]);

  const safeStepIndex =
    flatTokens.length > 0 ? Math.min(stepIndex, flatTokens.length - 1) : 0;
  const activeToken = flatTokens[safeStepIndex];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B7791F] dark:text-[#F6E05E]">
            Práctica del Módulo 01
          </p>
          <h3 className="mt-1 font-serif text-2xl font-bold text-[#0A1628] dark:text-white">
            Deletrea tu Nombre y Apellido en LSV
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Escribe tu nombre completo (incluye apellidos, Ñ, LL o RR) para practicar cada letra en
            orden.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {['Ana Sofía Rodríguez', 'Carlos Méndez', 'Valeria Llamas'].map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => {
                setFullName(example);
                setStepIndex(0);
              }}
              className={`min-h-[36px] whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                fullName === example
                  ? 'bg-[#0A1628] text-white dark:bg-[#D69E2E] dark:text-[#0A1628]'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-[#16243B] dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="name-practice-input" className="sr-only">
          Escribe tu nombre y apellido
        </label>
        <input
          id="name-practice-input"
          type="text"
          maxLength={45}
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            setStepIndex(0);
          }}
          placeholder="Escribe tu nombre y apellido..."
          className="flex-1 rounded-lg border border-slate-300 bg-[#FAF9F6] px-4 py-3 text-base font-medium text-[#0A1628] placeholder:text-slate-400 focus:border-[#0A1628] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-[#16243B] dark:text-white dark:placeholder:text-slate-400 dark:focus:border-[#F6E05E] dark:focus:bg-[#16243B]"
        />
        {fullName && (
          <button
            type="button"
            onClick={() => {
              setFullName('');
              setStepIndex(0);
            }}
            className="inline-flex min-h-[46px] items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#16243B] dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RotateCcw className="h-4 w-4" />
            Limpiar
          </button>
        )}
      </div>

      {flatTokens.length > 0 ? (
        <>
          <div className="space-y-5">
            {wordGroups.map((group, idx) =>
              group.tokens.length > 0 ? (
                <div
                  key={`${group.word}-${idx}`}
                  className="border-t border-slate-100 pt-4 first:border-t-0 first:pt-0 dark:border-slate-800"
                >
                  <div className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                    <span>{idx === 0 ? 'Nombre' : `Palabra ${idx + 1}`}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#0A1628] dark:text-white">{group.word}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {group.tokens.map((token) => {
                      const isCurrent = token.flatIndex === safeStepIndex;
                      return (
                        <button
                          key={token.key}
                          type="button"
                          onClick={() => {
                            setStepIndex(token.flatIndex);
                            onSelectSign(token.sign);
                          }}
                          className={`group flex w-[88px] flex-col items-center rounded-lg border p-2 text-center transition-all duration-150 hover:-translate-y-0.5 ${
                            isCurrent
                              ? 'border-[#D69E2E] bg-[#FAF9F6] ring-2 ring-[#D69E2E]/40 dark:bg-[#16243B]'
                              : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-[#0A1424] dark:hover:border-slate-600'
                          }`}
                        >
                          <div className="aspect-square w-full overflow-hidden rounded-md bg-white">
                            <SignThumb sign={token.sign} />
                          </div>
                          <span className="mt-1.5 font-serif text-lg font-bold text-[#0A1628] dark:text-white">
                            {token.sign.letter}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null
            )}
          </div>

          {activeToken && (
            <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-[#FAF9F6] p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-[#0A1424]">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700">
                  <SignThumb sign={activeToken.sign} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 tabular-nums dark:text-slate-400">
                    Letra {safeStepIndex + 1} de {flatTokens.length} ·{' '}
                    <span className="text-[#0A1628] dark:text-white">{activeToken.sign.letter}</span>
                  </div>
                  <p className="mt-0.5 text-sm font-medium text-[#0A1628] dark:text-white">
                    {activeToken.sign.desc}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">{activeToken.sign.tip}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  disabled={safeStepIndex === 0}
                  onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))}
                  className="inline-flex min-h-[38px] items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-[#0A1628] hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:bg-[#16243B] dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </button>
                <button
                  type="button"
                  disabled={safeStepIndex >= flatTokens.length - 1}
                  onClick={() =>
                    setStepIndex((prev) => Math.min(flatTokens.length - 1, prev + 1))
                  }
                  className="inline-flex min-h-[38px] items-center gap-1 rounded-lg bg-[#0A1628] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#142849] disabled:opacity-40 dark:bg-[#D69E2E] dark:text-[#0A1628] dark:hover:bg-[#E2AD3B]"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Escribe tu nombre y apellido arriba para generar la guía letra por letra.
        </p>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 02 · NÚMEROS: Escribe tu edad o una cifra                                  */
/* -------------------------------------------------------------------------- */
const NumerosPractice: React.FC<{ onSelectSign: (s: SignItem) => void }> = ({
  onSelectSign,
}) => {
  const [digits, setDigits] = useState('2026');
  const numMap = useMemo(() => {
    const mod = MODULES_DATA.find((m) => m.id === 'numeros');
    const map = new Map<string, SignItem>();
    mod?.signs.forEach((s) => map.set(s.letter, s));
    return map;
  }, []);

  const tokens = useMemo(() => {
    return Array.from(digits.replace(/[^0-9]/g, '').slice(0, 10))
      .map((d, idx) => ({
        key: `num-${d}-${idx}`,
        sign: numMap.get(d),
      }))
      .filter((t): t is { key: string; sign: SignItem } => Boolean(t.sign));
  }, [digits, numMap]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B7791F] dark:text-[#F6E05E]">
            Práctica del Módulo 02
          </p>
          <h3 className="mt-1 font-serif text-2xl font-bold text-[#0A1628] dark:text-white">
            Practica tu Edad, Año o Teléfono
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Ingresa cualquier cifra numérica para ver dígito por dígito cómo representarla en LSV.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {['2026', '18', '1998', '0414'].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setDigits(preset)}
              className={`min-h-[36px] rounded-md px-3 py-1.5 text-xs font-semibold tabular-nums transition-colors ${
                digits === preset
                  ? 'bg-[#0A1628] text-white dark:bg-[#D69E2E] dark:text-[#0A1628]'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-[#16243B] dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      <input
        type="text"
        inputMode="numeric"
        maxLength={10}
        value={digits}
        onChange={(e) => setDigits(e.target.value.replace(/[^0-9]/g, ''))}
        placeholder="Escribe números (0-9)..."
        aria-label="Escribe una cifra para practicar"
        className="w-full max-w-sm rounded-lg border border-slate-300 bg-[#FAF9F6] px-4 py-3 font-mono text-lg font-semibold text-[#0A1628] tabular-nums focus:border-[#0A1628] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-[#16243B] dark:text-white dark:placeholder:text-slate-400 dark:focus:border-[#F6E05E] dark:focus:bg-[#16243B]"
      />

      <div className="flex flex-wrap gap-3">
        {tokens.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => onSelectSign(t.sign)}
            className="flex w-[88px] flex-col items-center rounded-lg border border-slate-200 bg-white p-2 text-center transition-transform hover:-translate-y-0.5 hover:border-[#D69E2E] dark:border-slate-800 dark:bg-[#0A1424] dark:hover:border-[#F6E05E]"
          >
            <div className="aspect-square w-full overflow-hidden rounded-md bg-white">
              <SignThumb sign={t.sign} />
            </div>
            <span className="mt-1.5 font-serif text-lg font-bold text-[#0A1628] tabular-nums dark:text-white">
              {t.sign.letter}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 03 · SALUDOS Y DESPEDIDAS: Secuencias según momento del día                */
/* -------------------------------------------------------------------------- */
const GREETING_SCENARIOS = [
  {
    id: 'morning',
    label: 'Saludo de mañana',
    ids: ['sal-hola', 'sal-buenos-dias', 'sal-como-estas'],
  },
  {
    id: 'welcome',
    label: 'Recibimiento en la tarde',
    ids: ['sal-bienvenido', 'sal-buenas-tardes', 'sal-como-estas'],
  },
  {
    id: 'farewell',
    label: 'Despedida nocturna',
    ids: ['sal-buenas-noches', 'sal-hasta-luego', 'sal-adios'],
  },
];

const SaludosPractice: React.FC<{ onSelectSign: (s: SignItem) => void }> = ({
  onSelectSign,
}) => {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const signs = MODULES_DATA.find((m) => m.id === 'saludos')?.signs || [];
  const scenario = GREETING_SCENARIOS[scenarioIdx];
  const sequence = scenario.ids
    .map((id) => signs.find((s) => s.id === id))
    .filter((s): s is SignItem => Boolean(s));

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B7791F] dark:text-[#F6E05E]">
            Práctica del Módulo 03
          </p>
          <h3 className="mt-1 font-serif text-2xl font-bold text-[#0A1628] dark:text-white">
            Practica Saludos según el Momento del Día
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Elige un momento del día y repasa la secuencia completa manteniendo el contacto visual.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {GREETING_SCENARIOS.map((sc, idx) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => setScenarioIdx(idx)}
              className={`min-h-[38px] rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                scenarioIdx === idx
                  ? 'bg-[#0A1628] text-white dark:bg-[#D69E2E] dark:text-[#0A1628]'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-[#16243B] dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {sc.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {sequence.map((sign, idx) => (
          <button
            key={sign.id}
            type="button"
            onClick={() => onSelectSign(sign)}
            className="flex items-center gap-4 rounded-xl border border-slate-200 bg-[#FAF9F6] p-4 text-left transition-colors hover:border-[#D69E2E] hover:bg-white dark:border-slate-800 dark:bg-[#0A1424] dark:hover:border-[#F6E05E] dark:hover:bg-[#16243B]"
          >
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700">
              <SignThumb sign={sign} />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#B7791F] tabular-nums dark:text-[#F6E05E]">
                Paso 0{idx + 1}
              </span>
              <div className="font-serif text-lg font-bold text-[#0A1628] dark:text-white">{sign.letter}</div>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">{sign.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 04 · CORTESÍA Y EXPRESIONES: Respuestas y situaciones cotidianas           */
/* -------------------------------------------------------------------------- */
const CORTESIA_CASES = [
  {
    id: 'favor',
    label: 'Pedir y agradecer',
    ids: ['sal-por-favor', 'sal-gracias', 'sal-de-nada'],
  },
  {
    id: 'paso',
    label: 'Pedir permiso o disculpa',
    ids: ['sal-permiso', 'sal-lo-siento', 'sal-silencio'],
  },
  {
    id: 'estado',
    label: 'Responder cómo te sientes',
    ids: ['sal-bien', 'sal-mejor', 'sal-bueno'],
  },
];

const CortesiaPractice: React.FC<{ onSelectSign: (s: SignItem) => void }> = ({
  onSelectSign,
}) => {
  const [caseIdx, setCaseIdx] = useState(0);
  const signs = MODULES_DATA.find((m) => m.id === 'cortesia')?.signs || [];
  const activeCase = CORTESIA_CASES[caseIdx];
  const sequence = activeCase.ids
    .map((id) => signs.find((s) => s.id === id))
    .filter((s): s is SignItem => Boolean(s));

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B7791F] dark:text-[#F6E05E]">
            Práctica del Módulo 04
          </p>
          <h3 className="mt-1 font-serif text-2xl font-bold text-[#0A1628] dark:text-white">
            Diálogos de Cortesía y Estados
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Selecciona una situación cotidiana para practicar las fórmulas de cortesía y respuesta.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {CORTESIA_CASES.map((c, idx) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCaseIdx(idx)}
              className={`min-h-[38px] rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                caseIdx === idx
                  ? 'bg-[#0A1628] text-white dark:bg-[#D69E2E] dark:text-[#0A1628]'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-[#16243B] dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {sequence.map((sign, idx) => (
          <button
            key={sign.id}
            type="button"
            onClick={() => onSelectSign(sign)}
            className="flex items-center gap-4 rounded-xl border border-slate-200 bg-[#FAF9F6] p-4 text-left transition-colors hover:border-[#D69E2E] hover:bg-white dark:border-slate-800 dark:bg-[#0A1424] dark:hover:border-[#F6E05E] dark:hover:bg-[#16243B]"
          >
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700">
              <SignThumb sign={sign} />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#B7791F] tabular-nums dark:text-[#F6E05E]">
                Expresión 0{idx + 1}
              </span>
              <div className="font-serif text-lg font-bold text-[#0A1628] dark:text-white">{sign.letter}</div>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">{sign.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 05 · FAMILIA: Arma tu núcleo familiar                                      */
/* -------------------------------------------------------------------------- */
const FamiliaPractice: React.FC<{ onSelectSign: (s: SignItem) => void }> = ({
  onSelectSign,
}) => {
  const signs = MODULES_DATA.find((m) => m.id === 'familia')?.signs || [];
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'fam-familia',
    'fam-mama',
    'fam-papa',
    'fam-hermano',
  ]);

  const toggleMember = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedSigns = signs.filter((s) => selectedIds.includes(s.id));

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B7791F] dark:text-[#F6E05E]">
          Práctica del Módulo 05
        </p>
        <h3 className="mt-1 font-serif text-2xl font-bold text-[#0A1628] dark:text-white">
          Presenta a tu Núcleo Familiar
        </h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Marca los integrantes de tu familia para practicar su secuencia en LSV.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {signs.map((s) => {
          const active = selectedIds.includes(s.id);
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => toggleMember(s.id)}
              className={`min-h-[38px] rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                active
                  ? 'border-[#0A1628] bg-[#0A1628] text-white dark:border-[#D69E2E] dark:bg-[#D69E2E] dark:text-[#0A1628]'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#16243B] dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {s.letter}
            </button>
          );
        })}
      </div>

      {selectedSigns.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {selectedSigns.map((sign) => (
            <button
              key={sign.id}
              type="button"
              onClick={() => onSelectSign(sign)}
              className="flex w-[112px] flex-col items-center rounded-lg border border-slate-200 bg-[#FAF9F6] p-2.5 text-center hover:border-[#D69E2E] dark:border-slate-800 dark:bg-[#0A1424] dark:hover:border-[#F6E05E]"
            >
              <div className="aspect-square w-full overflow-hidden rounded-md bg-white">
                <SignThumb sign={sign} />
              </div>
              <span className="mt-1.5 font-serif text-base font-bold text-[#0A1628] dark:text-white">
                {sign.letter}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Selecciona al menos un miembro arriba para practicar.
        </p>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 06 · COLORES: Empareja el color con su seña                                */
/* -------------------------------------------------------------------------- */
const ColoresPractice: React.FC<{ onSelectSign: (s: SignItem) => void }> = ({
  onSelectSign,
}) => {
  const signs = MODULES_DATA.find((m) => m.id === 'colores')?.signs || [];
  const [targetIdx, setTargetIdx] = useState(0);
  const [pickedId, setPickedId] = useState<string | null>(null);

  const target = signs[targetIdx % signs.length];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B7791F] dark:text-[#F6E05E]">
            Práctica del Módulo 06
          </p>
          <h3 className="mt-1 font-serif text-2xl font-bold text-[#0A1628] dark:text-white">
            Reconoce el Color por su Articulación
          </h3>
        </div>
        <button
          type="button"
          onClick={() => {
            setTargetIdx((prev) => (prev + 1) % signs.length);
            setPickedId(null);
          }}
          className="inline-flex min-h-[38px] items-center gap-1.5 self-start rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0A1628] hover:bg-slate-50 dark:border-slate-700 dark:bg-[#16243B] dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Otro color
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {target && (
        <div className="grid gap-6 rounded-xl border border-slate-200 bg-[#FAF9F6] p-5 md:grid-cols-12 md:items-center dark:border-slate-800 dark:bg-[#0A1424]">
          <div className="md:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
              Pista de movimiento
            </p>
            <p className="mt-1.5 font-serif text-xl font-bold text-[#0A1628] dark:text-white">{target.desc}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{target.tip}</p>
          </div>

          <div className="md:col-span-7">
            <p className="mb-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
              ¿A qué color corresponde esta seña?
            </p>
            <div className="flex flex-wrap gap-2.5">
              {signs.map((c) => {
                const isPicked = pickedId === c.id;
                const isCorrect = c.id === target.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setPickedId(c.id);
                      if (isCorrect) onSelectSign(c);
                    }}
                    className={`inline-flex min-h-[40px] items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors ${
                      pickedId
                        ? isCorrect
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-200'
                          : isPicked
                            ? 'border-red-400 bg-red-50 text-red-900 dark:border-red-400 dark:bg-red-950/50 dark:text-red-200'
                            : 'border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-[#16243B] dark:text-slate-400'
                        : 'border-slate-300 bg-white text-[#0A1628] hover:border-[#0A1628] dark:border-slate-700 dark:bg-[#16243B] dark:text-slate-200 dark:hover:border-[#F6E05E]'
                    }`}
                  >
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-black/15 dark:border-white/25"
                      style={{ backgroundColor: c.color }}
                      aria-hidden="true"
                    />
                    <span>{c.letter}</span>
                  </button>
                );
              })}
            </div>

            {pickedId && (
              <p className="mt-3 text-xs font-medium text-slate-700 dark:text-slate-300">
                {pickedId === target.id
                  ? `Correcto: "${target.letter}" se articula con ${target.desc.toLowerCase()}.`
                  : 'Intenta de nuevo: revisa la pista sobre la posición de la mano.'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 07 · DÍAS DE LA SEMANA: Planifica tu semana                                */
/* -------------------------------------------------------------------------- */
const DiasPractice: React.FC<{ onSelectSign: (s: SignItem) => void }> = ({
  onSelectSign,
}) => {
  const signs = MODULES_DATA.find((m) => m.id === 'dias')?.signs || [];
  const [selectedDays, setSelectedDays] = useState<string[]>([
    'dia-lunes',
    'dia-miercoles',
    'dia-viernes',
  ]);

  const toggleDay = (id: string) => {
    setSelectedDays((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const activeSigns = signs.filter((s) => selectedDays.includes(s.id));

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B7791F] dark:text-[#F6E05E]">
          Práctica del Módulo 07
        </p>
        <h3 className="mt-1 font-serif text-2xl font-bold text-[#0A1628] dark:text-white">
          Practica tu Agenda Semanal en LSV
        </h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Selecciona los días de tu rutina semanal para repasar en secuencia sus movimientos.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {signs.map((s) => {
          const active = selectedDays.includes(s.id);
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => toggleDay(s.id)}
              className={`min-h-[38px] rounded-md border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                active
                  ? 'border-[#0A1628] bg-[#0A1628] text-white dark:border-[#D69E2E] dark:bg-[#D69E2E] dark:text-[#0A1628]'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#16243B] dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {s.letter}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        {activeSigns.map((sign) => (
          <button
            key={sign.id}
            type="button"
            onClick={() => onSelectSign(sign)}
            className="flex w-[112px] flex-col items-center rounded-lg border border-slate-200 bg-[#FAF9F6] p-2.5 text-center hover:border-[#D69E2E] dark:border-slate-800 dark:bg-[#0A1424] dark:hover:border-[#F6E05E]"
          >
            <div className="aspect-square w-full overflow-hidden rounded-md bg-white">
              <SignThumb sign={sign} />
            </div>
            <span className="mt-1.5 font-serif text-base font-bold text-[#0A1628] dark:text-white">
              {sign.letter}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 08 · VOCABULARIO Y VERBOS: Combina verbos en secuencias                    */
/* -------------------------------------------------------------------------- */
const VERB_PHRASES = [
  { label: 'Rutina diaria', ids: ['voc-comer', 'voc-beber', 'voc-dormir'] },
  { label: 'Acción y estado', ids: ['voc-hacer', 'voc-estar', 'voc-doler'] },
  { label: 'Aprendizaje activo', ids: ['voc-aprender', 'voc-compartir', 'voc-difundir'] },
  { label: 'Comunidad solidaria', ids: ['voc-ayudar', 'voc-compartir', 'voc-aprender'] },
];

const VocabularioPractice: React.FC<{ onSelectSign: (s: SignItem) => void }> = ({
  onSelectSign,
}) => {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const signs = MODULES_DATA.find((m) => m.id === 'vocabulario')?.signs || [];
  const phrase = VERB_PHRASES[phraseIdx];
  const sequence = phrase.ids
    .map((id) => signs.find((s) => s.id === id))
    .filter((s): s is SignItem => Boolean(s));

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B7791F] dark:text-[#F6E05E]">
            Práctica del Módulo 08
          </p>
          <h3 className="mt-1 font-serif text-2xl font-bold text-[#0A1628] dark:text-white">
            Secuencias de Verbos en Acción
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Elige una combinación de acciones para practicar la transición fluida entre señas.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {VERB_PHRASES.map((p, idx) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setPhraseIdx(idx)}
              className={`min-h-[38px] rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                phraseIdx === idx
                  ? 'bg-[#0A1628] text-white dark:bg-[#D69E2E] dark:text-[#0A1628]'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-[#16243B] dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {sequence.map((sign, idx) => (
          <button
            key={sign.id}
            type="button"
            onClick={() => onSelectSign(sign)}
            className="flex items-center gap-4 rounded-xl border border-slate-200 bg-[#FAF9F6] p-4 text-left hover:border-[#D69E2E] hover:bg-white dark:border-slate-800 dark:bg-[#0A1424] dark:hover:border-[#F6E05E] dark:hover:bg-[#16243B]"
          >
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700">
              <SignThumb sign={sign} />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#B7791F] tabular-nums dark:text-[#F6E05E]">
                Acción 0{idx + 1}
              </span>
              <div className="font-serif text-lg font-bold text-[#0A1628] dark:text-white">{sign.letter}</div>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">{sign.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 09 · PRONOMBRES: Constructor de oraciones                                  */
/* -------------------------------------------------------------------------- */
const PRONOUN_ACTIONS = [
  'voc-aprender',
  'voc-comer',
  'voc-beber',
  'voc-dormir',
  'voc-ayudar',
  'voc-estar',
];

const PronombresPractice: React.FC<{ onSelectSign: (s: SignItem) => void }> = ({
  onSelectSign,
}) => {
  const pronounSigns = MODULES_DATA.find((m) => m.id === 'pronombres')?.signs || [];
  const verbSigns = MODULES_DATA.find((m) => m.id === 'vocabulario')?.signs || [];
  const actionOptions = PRONOUN_ACTIONS.map((id) => verbSigns.find((v) => v.id === id)).filter(
    (s): s is SignItem => Boolean(s)
  );

  const [selectedPronounId, setSelectedPronounId] = useState('pro-yo');
  const [selectedActionId, setSelectedActionId] = useState('voc-aprender');

  const pronounSign = pronounSigns.find((p) => p.id === selectedPronounId) || pronounSigns[0];
  const actionSign = actionOptions.find((a) => a.id === selectedActionId) || actionOptions[0];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B7791F] dark:text-[#F6E05E]">
          Práctica del Módulo 09
        </p>
        <h3 className="mt-1 font-serif text-2xl font-bold text-[#0A1628] dark:text-white">
          Construye Oraciones con Pronombres y Acciones
        </h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Combina quién realiza la acción con un verbo básico para practicar la estructura sujeto +
          acción en LSV.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
            1. Elige un pronombre
          </p>
          <div className="flex flex-wrap gap-2">
            {pronounSigns.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPronounId(p.id)}
                className={`min-h-[38px] rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  selectedPronounId === p.id
                    ? 'border-[#0A1628] bg-[#0A1628] text-white dark:border-[#D69E2E] dark:bg-[#D69E2E] dark:text-[#0A1628]'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#16243B] dark:text-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {p.letter}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
            2. Elige una acción
          </p>
          <div className="flex flex-wrap gap-2">
            {actionOptions.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setSelectedActionId(a.id)}
                className={`min-h-[38px] rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  selectedActionId === a.id
                    ? 'border-[#B7791F] bg-[#D69E2E] text-[#0A1628] dark:border-[#F6E05E] dark:bg-[#F6E05E] dark:text-[#0A1628]'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#16243B] dark:text-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {a.letter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {pronounSign && actionSign && (
        <div className="grid gap-4 rounded-xl border border-slate-200 bg-[#FAF9F6] p-5 sm:grid-cols-2 dark:border-slate-800 dark:bg-[#0A1424]">
          {[
            { label: 'Sujeto (Pronombre)', sign: pronounSign },
            { label: 'Acción (Verbo)', sign: actionSign },
          ].map((item) => (
            <button
              key={item.sign.id}
              type="button"
              onClick={() => onSelectSign(item.sign)}
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-[#D69E2E] dark:border-slate-800 dark:bg-[#16243B] dark:hover:border-[#F6E05E]"
            >
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700">
                <SignThumb sign={item.sign} />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#B7791F] dark:text-[#F6E05E]">{item.label}</span>
                <div className="font-serif text-lg font-bold text-[#0A1628] dark:text-white">
                  {item.sign.letter}
                </div>
                <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">{item.sign.desc}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 10 · RELACIONES Y VÍNCULOS: Identifica el vínculo por su seña              */
/* -------------------------------------------------------------------------- */
const RelacionesPractice: React.FC<{ onSelectSign: (s: SignItem) => void }> = ({
  onSelectSign,
}) => {
  const signs = MODULES_DATA.find((m) => m.id === 'relaciones')?.signs || [];
  const [targetIdx, setTargetIdx] = useState(0);
  const [pickedId, setPickedId] = useState<string | null>(null);

  const target = signs[targetIdx % signs.length];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B7791F] dark:text-[#F6E05E]">
            Práctica del Módulo 10
          </p>
          <h3 className="mt-1 font-serif text-2xl font-bold text-[#0A1628] dark:text-white">
            Identifica el Vínculo según la Seña
          </h3>
        </div>
        <button
          type="button"
          onClick={() => {
            setTargetIdx((prev) => (prev + 1) % signs.length);
            setPickedId(null);
          }}
          className="inline-flex min-h-[38px] items-center gap-1.5 self-start rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0A1628] hover:bg-slate-50 dark:border-slate-700 dark:bg-[#16243B] dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Siguiente vínculo
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {target && (
        <div className="grid gap-6 rounded-xl border border-slate-200 bg-[#FAF9F6] p-5 md:grid-cols-12 md:items-center dark:border-slate-800 dark:bg-[#0A1424]">
          <div className="md:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
              Pista de configuración
            </p>
            <p className="mt-1.5 font-serif text-xl font-bold text-[#0A1628] dark:text-white">{target.desc}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{target.tip}</p>
          </div>

          <div className="md:col-span-7">
            <p className="mb-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
              ¿A qué vínculo corresponde esta descripción?
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {signs.map((s) => {
                const isPicked = pickedId === s.id;
                const isCorrect = s.id === target.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setPickedId(s.id);
                      if (isCorrect) onSelectSign(s);
                    }}
                    className={`flex flex-col items-center rounded-xl border p-2.5 text-center transition-colors ${
                      pickedId
                        ? isCorrect
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-200'
                          : isPicked
                            ? 'border-red-400 bg-red-50 text-red-900 dark:border-red-400 dark:bg-red-950/50 dark:text-red-200'
                            : 'border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-[#16243B] dark:text-slate-400'
                        : 'border-slate-300 bg-white text-[#0A1628] hover:border-[#0A1628] dark:border-slate-700 dark:bg-[#16243B] dark:text-slate-200 dark:hover:border-[#F6E05E]'
                    }`}
                  >
                    <div className="aspect-square w-full overflow-hidden rounded-lg bg-white">
                      <SignThumb sign={s} />
                    </div>
                    <span className="mt-1.5 text-xs font-bold">{s.letter}</span>
                  </button>
                );
              })}
            </div>

            {pickedId && (
              <p className="mt-3 text-xs font-medium text-slate-700 dark:text-slate-300">
                {pickedId === target.id
                  ? `Correcto: "${target.letter}" se representa con ${target.desc.toLowerCase()}.`
                  : 'Revisa la posición de los dedos en la pista e inténtalo de nuevo.'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 11 · EXPRESIONES Y VOCABULARIO LSV: Desafío visual por categoría           */
/* -------------------------------------------------------------------------- */
const DICT_CATEGORIES = [
  'Preguntas',
  'Expresiones',
  'Conectores y Adverbios',
  'Verbos',
  'Lugares y Sustantivos',
] as const;

const VocabularioGeneralPractice: React.FC<{ onSelectSign: (s: SignItem) => void }> = ({
  onSelectSign,
}) => {
  const signs = useMemo(
    () => MODULES_DATA.find((m) => m.id === 'vocabulario-general')?.signs || [],
    []
  );
  const [catIdx, setCatIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [pickedId, setPickedId] = useState<string | null>(null);

  const activeCategory = DICT_CATEGORIES[catIdx];
  const categorySigns = useMemo(
    () => signs.filter((s) => s.category === activeCategory),
    [signs, activeCategory]
  );

  const target = categorySigns.length > 0 ? categorySigns[questionIdx % categorySigns.length] : undefined;

  const choices = useMemo(() => {
    if (!target || categorySigns.length === 0) return [];
    const pool = categorySigns.filter((s) => s.id !== target.id);
    const picked: SignItem[] = [target];
    for (let i = 0; i < Math.min(3, pool.length); i++) {
      const idx = (questionIdx * 3 + i * 2) % pool.length;
      const cand = pool[idx];
      if (!picked.some((p) => p.id === cand.id)) {
        picked.push(cand);
      } else {
        const fallback = pool.find((x) => !picked.some((p) => p.id === x.id));
        if (fallback) picked.push(fallback);
      }
    }
    // Deterministic rotation so target is not always first
    const shift = (questionIdx + catIdx) % picked.length;
    return [...picked.slice(shift), ...picked.slice(0, shift)];
  }, [target, categorySigns, questionIdx, catIdx]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B7791F] dark:text-[#F6E05E]">
            Práctica del Módulo 11
          </p>
          <h3 className="mt-1 font-serif text-2xl font-bold text-[#0A1628] dark:text-white">
            Reconoce Señas del Diccionario LSV
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Elige una categoría e identifica la ilustración que corresponde a la palabra o expresión
            solicitada.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setQuestionIdx((prev) => prev + 1);
            setPickedId(null);
          }}
          className="inline-flex min-h-[38px] items-center gap-1.5 self-start rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0A1628] hover:bg-slate-50 dark:border-slate-700 dark:bg-[#16243B] dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Otra seña
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {DICT_CATEGORIES.map((cat, idx) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setCatIdx(idx);
              setQuestionIdx(0);
              setPickedId(null);
            }}
            className={`min-h-[36px] rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
              catIdx === idx
                ? 'border-[#0A1628] bg-[#0A1628] text-white dark:border-[#D69E2E] dark:bg-[#D69E2E] dark:text-[#0A1628]'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#16243B] dark:text-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {target && (
        <div className="grid gap-6 rounded-xl border border-slate-200 bg-[#FAF9F6] p-5 md:grid-cols-12 md:items-center dark:border-slate-800 dark:bg-[#0A1424]">
          <div className="md:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#B7791F] dark:text-[#F6E05E]">
              {activeCategory}
            </p>
            <div className="mt-1.5 font-serif text-3xl font-black text-[#0A1628] dark:text-white">
              {target.letter}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              Pista: {target.desc}. {target.tip}
            </p>
          </div>

          <div className="md:col-span-8">
            <p className="mb-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
              Selecciona la ilustración correcta:
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {choices.map((c) => {
                const isPicked = pickedId === c.id;
                const isCorrect = c.id === target.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setPickedId(c.id);
                      if (isCorrect) onSelectSign(c);
                    }}
                    className={`flex flex-col items-center rounded-xl border p-2.5 text-center transition-colors ${
                      pickedId
                        ? isCorrect
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-200'
                          : isPicked
                            ? 'border-red-400 bg-red-50 text-red-900 dark:border-red-400 dark:bg-red-950/50 dark:text-red-200'
                            : 'border-slate-200 bg-white text-slate-500 dark:border-slate-800 dark:bg-[#16243B] dark:text-slate-400'
                        : 'border-slate-300 bg-white text-[#0A1628] hover:border-[#0A1628] dark:border-slate-700 dark:bg-[#16243B] dark:text-slate-200 dark:hover:border-[#F6E05E]'
                    }`}
                  >
                    <div className="aspect-square w-full overflow-hidden rounded-lg bg-white">
                      <SignThumb sign={c} />
                    </div>
                    {pickedId && (
                      <span className="mt-1.5 text-xs font-bold leading-tight">{c.letter}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {pickedId && (
              <p className="mt-3 text-xs font-medium text-slate-700 dark:text-slate-300">
                {pickedId === target.id
                  ? `Correcto: esa es la seña de "${target.letter}".`
                  : 'Observa bien la posición de las manos e inténtalo con otra tarjeta.'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 12 · PRACTICAR FRASES: Frases guiadas, constructor libre y completar frase */
/* -------------------------------------------------------------------------- */
interface GuidedPhrase {
  id: string;
  title: string;
  context: string;
  signIds: string[];
}

const GUIDED_PHRASES: GuidedPhrase[] = [
  {
    id: 'g-saludo',
    title: 'Hola, ¿cómo estás? — Bien, ¡gracias!',
    context: 'Saludo cotidiano completo',
    signIds: ['sal-hola', 'sal-como-estas', 'sal-bien', 'dic-gracias'],
  },
  {
    id: 'g-bano',
    title: '¡Permiso!, ¿dónde está el baño, por favor?',
    context: 'Pedir ubicación con cortesía',
    signIds: ['dic-permiso', 'dic-bano', 'dic-donde-q', 'dic-por-favor'],
  },
  {
    id: 'g-aprender',
    title: 'Yo quiero preguntar, ¡enséñame despacio!',
    context: 'En clase o practicando con alguien',
    signIds: ['pro-yo', 'dic-quiero-preguntar', 'dic-ensename', 'dic-despacio'],
  },
  {
    id: 'g-casa',
    title: 'Nosotros vamos a la casa',
    context: 'Indicar dirección o regreso',
    signIds: ['pro-nosotros', 'dic-yo-voy', 'dic-casa'],
  },
  {
    id: 'g-fiesta',
    title: '¡Vámonos a la fiesta con amigos!',
    context: 'Invitación entre amigos',
    signIds: ['dic-vamonos', 'dic-fiesta', 'dic-amigo'],
  },
  {
    id: 'g-plata',
    title: '¡Perdón!, no tengo plata ahora',
    context: 'Expresar falta de dinero con respeto',
    signIds: ['dic-perdon', 'dic-no-tengo-plata'],
  },
  {
    id: 'g-gustar',
    title: 'A mí me gusta caminar y bailar',
    context: 'Hablar de gustos y pasatiempos',
    signIds: ['pro-yo', 'dic-gustar', 'dic-caminar', 'dic-y', 'dic-bailar'],
  },
  {
    id: 'g-bienvenido',
    title: '¡Bienvenido amigo!, a la orden siempre',
    context: 'Recibir con hospitalidad',
    signIds: ['dic-bienvenido', 'dic-amigo', 'dic-a-la-orden', 'dic-siempre'],
  },
  {
    id: 'g-duda',
    title: '¿Por qué? Yo no sé nada, ¡paciencia!',
    context: 'Preguntar y pedir calma',
    signIds: ['dic-por-que', 'pro-yo', 'dic-no-se-nada', 'dic-paciencia'],
  },
  {
    id: 'g-familia',
    title: 'Todos juntos: familia, comer y compartir',
    context: 'Convivencia familiar',
    signIds: ['dic-todos', 'fam-familia', 'dic-comer', 'dic-y', 'voc-compartir'],
  },
];

const BUILDER_SUBJECTS = ['pro-yo', 'pro-tu', 'pro-nosotros', 'sal-hola', 'dic-donde-q', 'dic-por-que'];
const BUILDER_VERBS = [
  'dic-aprender',
  'dic-caminar',
  'dic-comer',
  'dic-bailar',
  'dic-quiero-preguntar',
  'dic-gustar',
  'voc-ayudar',
  'dic-yo-voy',
];
const BUILDER_EXTRAS = [
  'dic-casa',
  'dic-bano',
  'dic-farmacia',
  'dic-fiesta',
  'dic-despacio',
  'dic-por-favor',
  'dic-gracias',
  'dic-amigo',
  'dic-siempre',
];

const PHRASE_QUIZ = [
  {
    prompt: 'Si quieres pedirle a alguien que señe más lento, agregas:',
    sentence: '¡Enséñame ________!',
    answerId: 'dic-despacio',
    optionIds: ['dic-despacio', 'dic-nunca', 'dic-directo', 'dic-sinverguenza'],
  },
  {
    prompt: 'Cuando necesitas preguntar la ubicación de un lugar en LSV usas:',
    sentence: 'El baño, ________?',
    answerId: 'dic-donde-q',
    optionIds: ['dic-donde-q', 'dic-antes', 'dic-siempre', 'dic-todos'],
  },
  {
    prompt: 'Al solicitar ayuda o un favor con educación terminas con:',
    sentence: 'Quiero preguntar, ________',
    answerId: 'dic-por-favor',
    optionIds: ['dic-por-favor', 'dic-se-fue', 'dic-no-sirve', 'dic-apagar'],
  },
  {
    prompt: 'Para decir que algo te agrada mucho al hacer una actividad usas:',
    sentence: 'Yo ________ caminar y bailar',
    answerId: 'dic-gustar',
    optionIds: ['dic-gustar', 'dic-deuda', 'dic-error', 'dic-gritar'],
  },
  {
    prompt: 'Cuando invitas a un grupo de amigos a salir de un lugar dices:',
    sentence: '¡________ a la fiesta!',
    answerId: 'dic-vamonos',
    optionIds: ['dic-vamonos', 'dic-antes', 'dic-dentro', 'dic-tampoco'],
  },
];

const PracticarFrasesPractice: React.FC<{ onSelectSign: (s: SignItem) => void }> = ({
  onSelectSign,
}) => {
  const allSignsMap = useMemo(() => {
    const map = new Map<string, SignItem>();
    MODULES_DATA.forEach((m) => {
      m.signs.forEach((s) => {
        if (!map.has(s.id)) map.set(s.id, s);
      });
    });
    return map;
  }, []);

  const [tab, setTab] = useState<'guiadas' | 'constructor' | 'quiz'>('guiadas');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);

  const [subjId, setSubjId] = useState('pro-yo');
  const [verbId, setVerbId] = useState('dic-aprender');
  const [extraId, setExtraId] = useState('dic-despacio');

  const [quizIdx, setQuizIdx] = useState(0);
  const [quizPicked, setQuizPicked] = useState<string | null>(null);

  const activePhrase = GUIDED_PHRASES[phraseIdx];
  const activeSequence = useMemo(
    () =>
      activePhrase.signIds
        .map((id) => allSignsMap.get(id))
        .filter((s): s is SignItem => Boolean(s)),
    [activePhrase, allSignsMap]
  );
  const safeStep = activeSequence.length > 0 ? Math.min(stepIdx, activeSequence.length - 1) : 0;
  const activeStepSign = activeSequence[safeStep];

  const builtSigns = [subjId, verbId, extraId]
    .map((id) => allSignsMap.get(id))
    .filter((s): s is SignItem => Boolean(s));

  const activeQuiz = PHRASE_QUIZ[quizIdx % PHRASE_QUIZ.length];
  const quizOptions = activeQuiz.optionIds
    .map((id) => allSignsMap.get(id))
    .filter((s): s is SignItem => Boolean(s));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C53030] dark:text-red-400">
            Práctica Final · Módulo 12
          </p>
          <h3 className="mt-1 font-serif text-2xl font-bold text-[#0A1628] dark:text-white">
            Taller Interactivo para Practicar Frases
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Repasa frases cotidianas paso a paso, arma tus propias oraciones o completa el desafío
            visual.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: 'guiadas', label: 'Frases guiadas' },
              { id: 'constructor', label: 'Armar tu frase' },
              { id: 'quiz', label: 'Completa la frase' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`min-h-[38px] rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                tab === item.id
                  ? 'border-[#0A1628] bg-[#0A1628] text-white dark:border-[#D69E2E] dark:bg-[#D69E2E] dark:text-[#0A1628]'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#16243B] dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'guiadas' && (
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {GUIDED_PHRASES.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setPhraseIdx(idx);
                  setStepIdx(0);
                }}
                className={`min-h-[36px] rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  phraseIdx === idx
                    ? 'border-[#D69E2E] bg-[#D69E2E] text-[#0A1628]'
                    : 'border-slate-200 bg-[#FAF9F6] text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-[#16243B] dark:text-slate-200 dark:hover:border-slate-600'
                }`}
              >
                {idx + 1}. {p.title}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#FAF9F6] p-5 dark:border-slate-800 dark:bg-[#0A1424]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#B7791F] dark:text-[#F6E05E]">
                  {activePhrase.context}
                </span>
                <h4 className="font-serif text-xl font-bold text-[#0A1628] dark:text-white">
                  {activePhrase.title}
                </h4>
              </div>
              <span className="text-xs font-medium text-slate-500 tabular-nums dark:text-slate-400">
                {activeSequence.length} señas en secuencia
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {activeSequence.map((sign, idx) => {
                const isCurrent = idx === safeStep;
                return (
                  <button
                    key={`${activePhrase.id}-${sign.id}-${idx}`}
                    type="button"
                    onClick={() => {
                      setStepIdx(idx);
                      onSelectSign(sign);
                    }}
                    className={`flex w-[118px] flex-col items-center rounded-xl border p-2.5 text-center transition-all ${
                      isCurrent
                        ? 'border-[#D69E2E] bg-white ring-2 ring-[#D69E2E]/40 dark:bg-[#16243B]'
                        : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-[#16243B]/60 dark:hover:border-slate-600'
                    }`}
                  >
                    <span className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 tabular-nums dark:text-slate-400">
                      Paso 0{idx + 1}
                    </span>
                    <div className="aspect-square w-full overflow-hidden rounded-lg bg-white">
                      <SignThumb sign={sign} />
                    </div>
                    <span className="mt-2 font-serif text-sm font-bold text-[#0A1628] dark:text-white">
                      {sign.letter}
                    </span>
                  </button>
                );
              })}
            </div>

            {activeStepSign && (
              <div className="mt-5 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-[#0F1B2E]">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700">
                    <SignThumb sign={activeStepSign} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#B7791F] tabular-nums dark:text-[#F6E05E]">
                      Paso {safeStep + 1} de {activeSequence.length} · {activeStepSign.letter}
                    </div>
                    <p className="mt-0.5 text-sm font-medium text-[#0A1628] dark:text-white">
                      {activeStepSign.desc}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">{activeStepSign.tip}</p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    disabled={safeStep === 0}
                    onClick={() => setStepIdx((prev) => Math.max(0, prev - 1))}
                    className="inline-flex min-h-[38px] items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-[#0A1628] hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-[#16243B] dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </button>
                  <button
                    type="button"
                    disabled={safeStep >= activeSequence.length - 1}
                    onClick={() =>
                      setStepIdx((prev) => Math.min(activeSequence.length - 1, prev + 1))
                    }
                    className="inline-flex min-h-[38px] items-center gap-1 rounded-lg bg-[#0A1628] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#142849] disabled:opacity-40 dark:bg-[#D69E2E] dark:text-[#0A1628] dark:hover:bg-[#E2AD3B]"
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'constructor' && (
        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                1. Inicio o persona
              </p>
              <div className="flex flex-wrap gap-2">
                {BUILDER_SUBJECTS.map((id) => {
                  const s = allSignsMap.get(id);
                  if (!s) return null;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSubjId(id)}
                      className={`min-h-[36px] rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        subjId === id
                          ? 'border-[#0A1628] bg-[#0A1628] text-white dark:border-[#D69E2E] dark:bg-[#D69E2E] dark:text-[#0A1628]'
                          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#16243B] dark:text-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      {s.letter}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                2. Acción o intención
              </p>
              <div className="flex flex-wrap gap-2">
                {BUILDER_VERBS.map((id) => {
                  const s = allSignsMap.get(id);
                  if (!s) return null;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setVerbId(id)}
                      className={`min-h-[36px] rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        verbId === id
                          ? 'border-[#D69E2E] bg-[#D69E2E] text-[#0A1628]'
                          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#16243B] dark:text-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      {s.letter}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                3. Lugar, modo o cortesía
              </p>
              <div className="flex flex-wrap gap-2">
                {BUILDER_EXTRAS.map((id) => {
                  const s = allSignsMap.get(id);
                  if (!s) return null;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setExtraId(id)}
                      className={`min-h-[36px] rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        extraId === id
                          ? 'border-[#2F855A] bg-[#2F855A] text-white'
                          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#16243B] dark:text-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      {s.letter}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#FAF9F6] p-5 dark:border-slate-800 dark:bg-[#0A1424]">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#B7791F] dark:text-[#F6E05E]">
              Tu frase armada en LSV
            </p>
            <div className="mt-1 font-serif text-2xl font-bold text-[#0A1628] dark:text-white">
              {builtSigns.map((s) => s.letter).join(' + ')}
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {builtSigns.map((sign, idx) => (
                <button
                  key={`${sign.id}-${idx}`}
                  type="button"
                  onClick={() => onSelectSign(sign)}
                  className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-[#D69E2E] dark:border-slate-800 dark:bg-[#16243B] dark:hover:border-[#F6E05E]"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700">
                    <SignThumb sign={sign} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#B7791F] dark:text-[#F6E05E]">Seña 0{idx + 1}</span>
                    <div className="font-serif text-lg font-bold text-[#0A1628] dark:text-white">
                      {sign.letter}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">{sign.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'quiz' && (
        <div className="space-y-5 rounded-xl border border-slate-200 bg-[#FAF9F6] p-5 dark:border-slate-800 dark:bg-[#0A1424]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#B7791F] dark:text-[#F6E05E]">
                Desafío {(quizIdx % PHRASE_QUIZ.length) + 1} de {PHRASE_QUIZ.length}
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{activeQuiz.prompt}</p>
              <h4 className="mt-1 font-serif text-2xl font-bold text-[#0A1628] dark:text-white">
                {activeQuiz.sentence}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => {
                setQuizIdx((prev) => prev + 1);
                setQuizPicked(null);
              }}
              className="inline-flex min-h-[38px] items-center gap-1.5 self-start rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0A1628] hover:bg-slate-50 dark:border-slate-700 dark:bg-[#16243B] dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Siguiente frase
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {quizOptions.map((opt) => {
              const isPicked = quizPicked === opt.id;
              const isCorrect = opt.id === activeQuiz.answerId;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setQuizPicked(opt.id);
                    if (isCorrect) onSelectSign(opt);
                  }}
                  className={`flex flex-col items-center rounded-xl border p-3 text-center transition-colors ${
                    quizPicked
                      ? isCorrect
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-200'
                        : isPicked
                          ? 'border-red-400 bg-red-50 text-red-900 dark:border-red-400 dark:bg-red-950/50 dark:text-red-200'
                          : 'border-slate-200 bg-white text-slate-500 dark:border-slate-800 dark:bg-[#16243B] dark:text-slate-400'
                      : 'border-slate-300 bg-white text-[#0A1628] hover:border-[#0A1628] dark:border-slate-700 dark:bg-[#16243B] dark:text-slate-200 dark:hover:border-[#F6E05E]'
                  }`}
                >
                  <div className="aspect-square w-full overflow-hidden rounded-lg bg-white">
                    <SignThumb sign={opt} />
                  </div>
                  <span className="mt-2 font-serif text-sm font-bold">{opt.letter}</span>
                </button>
              );
            })}
          </div>

          {quizPicked && (
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {quizPicked === activeQuiz.answerId
                ? `¡Excelente! "${allSignsMap.get(activeQuiz.answerId)?.letter}" completa correctamente la frase.`
                : 'Prueba otra tarjeta observando la acción o expresión correcta para ese contexto.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export const ModulePractice: React.FC<ModulePracticeProps> = ({
  moduleId,
  onSelectSign,
}) => {
  return (
    <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 md:p-8 dark:border-slate-800 dark:bg-[#0F1B2E]">
      {moduleId === 'abecedario' && <AbecedarioPractice onSelectSign={onSelectSign} />}
      {moduleId === 'numeros' && <NumerosPractice onSelectSign={onSelectSign} />}
      {moduleId === 'saludos' && <SaludosPractice onSelectSign={onSelectSign} />}
      {moduleId === 'cortesia' && <CortesiaPractice onSelectSign={onSelectSign} />}
      {moduleId === 'familia' && <FamiliaPractice onSelectSign={onSelectSign} />}
      {moduleId === 'colores' && <ColoresPractice onSelectSign={onSelectSign} />}
      {moduleId === 'dias' && <DiasPractice onSelectSign={onSelectSign} />}
      {moduleId === 'vocabulario' && <VocabularioPractice onSelectSign={onSelectSign} />}
      {moduleId === 'pronombres' && <PronombresPractice onSelectSign={onSelectSign} />}
      {moduleId === 'relaciones' && <RelacionesPractice onSelectSign={onSelectSign} />}
      {moduleId === 'vocabulario-general' && (
        <VocabularioGeneralPractice onSelectSign={onSelectSign} />
      )}
      {moduleId === 'frases' && <PracticarFrasesPractice onSelectSign={onSelectSign} />}
    </section>
  );
};
