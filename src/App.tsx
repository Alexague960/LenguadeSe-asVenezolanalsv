import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Menu,
  Moon,
  RotateCcw,
  Search,
  Shuffle,
  Sun,
} from 'lucide-react';
import {
  FACTS_DATA,
  MODULES_DATA,
  SignItem,
  TIMELINE_DATA,
} from './data/lsvData';
import { GlossarySection } from './components/GlossarySection';
import { LsvLogoBadge, VenezuelanFlagMark } from './components/LsvEmblem';
import { ModulePractice } from './components/ModulePractice';
import { RandomPracticeModal } from './components/RandomPracticeModal';
import { SignDetailModal } from './components/SignDetailModal';
import { SideDrawer } from './components/SideDrawer';

const COMMUNITY_IMAGE = '/src/assets/images/editorial_lsv_community_1795038575441.jpg';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    try {
      const saved = window.localStorage.getItem('lsv-theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // ignore storage errors
    }
    return 'light';
  });
  const [activeModuleIndex, setActiveModuleIndex] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSign, setSelectedSign] = useState<SignItem | null>(null);
  const [randomPracticeOpen, setRandomPracticeOpen] = useState(false);
  const [signFilter, setSignFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [communityImgFailed, setCommunityImgFailed] = useState(false);
  const [failedSignImages, setFailedSignImages] = useState<Record<string, boolean>>({});
  const [completedSigns, setCompletedSigns] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = window.localStorage.getItem('lsv-completed-signs');
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return parsed as Record<string, boolean>;
        }
      }
    } catch {
      // ignore storage errors
    }
    return {};
  });

  const moduleStageRef = useRef<HTMLDivElement>(null);
  const savedScrollRef = useRef<number>(0);

  const activeModule =
    activeModuleIndex !== null ? MODULES_DATA[activeModuleIndex] : null;

  const moduleCategories = useMemo(() => {
    if (!activeModule) return [];
    const cats = Array.from(
      new Set(activeModule.signs.map((s) => s.category).filter((c): c is string => Boolean(c)))
    );
    return cats;
  }, [activeModule]);

  const filteredSigns = useMemo(() => {
    if (!activeModule) return [];
    const q = signFilter.trim().toLowerCase();
    return activeModule.signs.filter((s) => {
      if (selectedCategory !== 'Todas' && s.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        s.letter.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q) ||
        s.tip.toLowerCase().includes(q) ||
        (s.category ? s.category.toLowerCase().includes(q) : false)
      );
    });
  }, [activeModule, signFilter, selectedCategory]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      window.localStorage.setItem('lsv-theme', theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  useEffect(() => {
    try {
      window.localStorage.setItem('lsv-completed-signs', JSON.stringify(completedSigns));
    } catch {
      // ignore storage errors
    }
  }, [completedSigns]);

  const markSignCompleted = (signId: string) => {
    setCompletedSigns((prev) => (prev[signId] ? prev : { ...prev, [signId]: true }));
  };

  const toggleSignCompleted = (signId: string) => {
    setCompletedSigns((prev) => {
      const next = { ...prev };
      if (next[signId]) {
        delete next[signId];
      } else {
        next[signId] = true;
      }
      return next;
    });
  };

  const resetModuleProgress = (signs: SignItem[]) => {
    setCompletedSigns((prev) => {
      const next = { ...prev };
      for (const s of signs) {
        delete next[s.id];
      }
      return next;
    });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const glossarySigns = useMemo(
    () =>
      MODULES_DATA.filter((m) => m.id !== 'frases')
        .flatMap((m) => m.signs)
        .sort((a, b) => a.letter.localeCompare(b.letter, 'es', { sensitivity: 'base' })),
    []
  );

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#modulo-')) {
      const clean = hash.replace('#modulo-', '');
      const [modId] = clean.split('/');
      const idx = MODULES_DATA.findIndex((m) => m.id === modId);
      if (idx >= 0) {
        if (!window.history.state || window.history.state.view !== 'module') {
          window.history.replaceState(
            { view: 'home' },
            '',
            window.location.pathname + window.location.search
          );
          window.history.pushState(
            { view: 'module', moduleIndex: idx },
            '',
            `#modulo-${MODULES_DATA[idx].id}`
          );
        }
        setActiveModuleIndex(idx);
      }
    } else if (!window.history.state || window.history.state.view !== 'home') {
      window.history.replaceState(
        { view: 'home' },
        '',
        window.location.pathname + window.location.search
      );
    }

    const handlePopState = (e: PopStateEvent) => {
      const st = e.state as
        | {
            view?: 'home' | 'module' | 'sign' | 'random';
            moduleIndex?: number | null;
            signId?: string;
          }
        | null;

      if (st?.view === 'random') {
        setSelectedSign(null);
        if (typeof st.moduleIndex === 'number') {
          setActiveModuleIndex(st.moduleIndex);
        } else {
          setActiveModuleIndex(null);
        }
        setRandomPracticeOpen(true);
        return;
      }

      setRandomPracticeOpen(false);

      if (st?.view === 'sign' && st.signId) {
        if (typeof st.moduleIndex === 'number') {
          const mod = MODULES_DATA[st.moduleIndex];
          const foundSign = mod?.signs.find((s) => s.id === st.signId) ?? null;
          setActiveModuleIndex(st.moduleIndex);
          setSelectedSign(foundSign);
        } else {
          const foundSign = glossarySigns.find((s) => s.id === st.signId) ?? null;
          setActiveModuleIndex(null);
          setSelectedSign(foundSign);
        }
        return;
      }

      if (st?.view === 'module' && typeof st.moduleIndex === 'number') {
        setSelectedSign(null);
        setActiveModuleIndex(st.moduleIndex);
        setSelectedCategory('Todas');
        return;
      }

      setSelectedSign(null);
      setActiveModuleIndex(null);
      setSignFilter('');
      setSelectedCategory('Todas');
      if (st?.view !== 'sign') {
        requestAnimationFrame(() => {
          window.scrollTo({ top: savedScrollRef.current, behavior: 'smooth' });
        });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [glossarySigns]);

  const openModule = (index: number) => {
    const mod = MODULES_DATA[index];
    if (!mod) return;

    if (selectedSign !== null) {
      setSelectedSign(null);
    }

    if (activeModuleIndex === null) {
      savedScrollRef.current = window.scrollY;
      window.history.pushState(
        { view: 'module', moduleIndex: index },
        '',
        `#modulo-${mod.id}`
      );
    } else {
      window.history.replaceState(
        { view: 'module', moduleIndex: index },
        '',
        `#modulo-${mod.id}`
      );
    }

    setActiveModuleIndex(index);
    setSignFilter('');
    setSelectedCategory('Todas');

    requestAnimationFrame(() => {
      if (moduleStageRef.current) {
        const top =
          moduleStageRef.current.getBoundingClientRect().top + window.scrollY - 84;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      }
    });
  };

  const openSignDetail = (sign: SignItem) => {
    markSignCompleted(sign.id);

    if (activeModuleIndex === null) {
      savedScrollRef.current = window.scrollY;
      const nextState = { view: 'sign' as const, moduleIndex: null, signId: sign.id };
      const nextUrl = `#glosario/${sign.id}`;
      if (selectedSign === null) {
        window.history.pushState(nextState, '', nextUrl);
      } else {
        window.history.replaceState(nextState, '', nextUrl);
      }
      setSelectedSign(sign);
      return;
    }

    const modIdx = activeModuleIndex;
    const mod = MODULES_DATA[modIdx];
    const nextState = { view: 'sign' as const, moduleIndex: modIdx, signId: sign.id };
    const nextUrl = `#modulo-${mod.id}/${sign.id}`;

    if (selectedSign === null) {
      window.history.pushState(nextState, '', nextUrl);
    } else {
      window.history.replaceState(nextState, '', nextUrl);
    }
    setSelectedSign(sign);
  };

  const closeSignDetail = () => {
    setSelectedSign(null);
    if (window.history.state?.view === 'sign') {
      window.history.back();
    }
  };

  const openRandomPractice = () => {
    setSelectedSign(null);
    setDrawerOpen(false);
    if (activeModuleIndex === null) {
      savedScrollRef.current = window.scrollY;
    }
    if (window.history.state?.view !== 'random') {
      window.history.pushState(
        { view: 'random', moduleIndex: activeModuleIndex },
        '',
        '#practica-aleatoria'
      );
    }
    setRandomPracticeOpen(true);
  };

  const closeRandomPractice = () => {
    setRandomPracticeOpen(false);
    if (window.history.state?.view === 'random') {
      window.history.back();
    }
  };

  const goHome = () => {
    setRandomPracticeOpen(false);
    setSelectedSign(null);
    setActiveModuleIndex(null);
    setSignFilter('');
    setSelectedCategory('Todas');
    if (
      window.history.state?.view === 'module' ||
      window.history.state?.view === 'sign' ||
      window.history.state?.view === 'random'
    ) {
      window.history.back();
    } else {
      requestAnimationFrame(() => {
        window.scrollTo({ top: savedScrollRef.current, behavior: 'smooth' });
      });
    }
  };

  const scrollToSection = (id: string) => {
    setSelectedSign(null);
    setActiveModuleIndex(null);
    if (window.history.state?.view !== 'home') {
      window.history.replaceState(
        { view: 'home' },
        '',
        window.location.pathname + window.location.search
      );
    }
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 76;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      }
    }, 60);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A202C] transition-colors duration-200 dark:bg-[#060D1A] dark:text-slate-100">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-30 bg-[#0A1628]/95 text-white backdrop-blur-md dark:bg-[#060D1A]/95">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-4 sm:gap-8 sm:px-6 lg:px-10">
          {/* Zone 1: Colorful LSV Logo badge + wordmark */}
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              savedScrollRef.current = 0;
              goHome();
            }}
            className="inline-flex items-center gap-3 font-serif text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F6E05E] sm:text-xl"
          >
            <LsvLogoBadge className="h-9 w-9 shrink-0" />
            <span>LSV Venezuela</span>
          </a>

          {/* Zone 2: concise single-line nav links */}
          <nav
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300"
            aria-label="Navegación principal"
          >
            <button
              type="button"
              onClick={() => {
                savedScrollRef.current = 0;
                goHome();
              }}
              className="whitespace-nowrap shrink-0 transition-colors hover:text-[#F6E05E] hover:underline underline-offset-4"
            >
              Inicio
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('modulos')}
              className="whitespace-nowrap shrink-0 transition-colors hover:text-[#F6E05E] hover:underline underline-offset-4"
            >
              Módulos
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('glosario')}
              className="whitespace-nowrap shrink-0 transition-colors hover:text-[#F6E05E] hover:underline underline-offset-4"
            >
              Glosario
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('sabias-que')}
              className="whitespace-nowrap shrink-0 transition-colors hover:text-[#F6E05E] hover:underline underline-offset-4"
            >
              ¿Sabías que...?
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('informacion')}
              className="whitespace-nowrap shrink-0 transition-colors hover:text-[#F6E05E] hover:underline underline-offset-4"
            >
              Información
            </button>
          </nav>

          {/* Zone 3: Práctica Aleatoria + Theme Toggle + Índice Drawer button */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={openRandomPractice}
              aria-label="Práctica Aleatoria"
              title="Práctica Aleatoria"
              className="inline-flex min-h-[40px] items-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg border border-[#F6E05E]/40 bg-[#D69E2E]/15 px-3 py-2 text-xs font-semibold text-[#F6E05E] transition-colors hover:bg-[#D69E2E] hover:text-[#0A1628] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F6E05E]"
            >
              <Shuffle className="h-4 w-4" />
              <span className="hidden lg:inline">Práctica Aleatoria</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
              }
              title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
              className="inline-flex min-h-[40px] items-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-[#F6E05E]/50 hover:bg-white/10 hover:text-[#F6E05E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F6E05E]"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="h-4 w-4 text-[#F6E05E]" />
                  <span className="hidden sm:inline">Claro</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 text-[#F6E05E]" />
                  <span className="hidden sm:inline">Oscuro</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex min-h-[40px] items-center gap-2 whitespace-nowrap shrink-0 rounded-lg border border-[#F6E05E]/35 bg-white/5 px-3.5 py-2 text-xs font-semibold text-[#F6E05E] transition-colors hover:bg-[#F6E05E]/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F6E05E] sm:px-4"
            >
              <Menu className="h-4 w-4" />
              <span>Índice</span>
            </button>
          </div>
        </div>
        <div
          className="h-[2px] w-full opacity-80"
          style={{
            background:
              'linear-gradient(to right, #FFCC00 0%, #1D63DC 50%, #CF142B 100%)',
          }}
          aria-hidden="true"
        />
      </header>

      <SideDrawer
        isOpen={drawerOpen}
        activeModuleIndex={activeModuleIndex ?? -1}
        completedSigns={completedSigns}
        onClose={() => setDrawerOpen(false)}
        onGoHome={() => {
          savedScrollRef.current = 0;
          goHome();
        }}
        onSelectModule={openModule}
        onScrollToSection={scrollToSection}
        onOpenRandomPractice={openRandomPractice}
      />

      {/* Hero Editorial Header without hand logo */}
      <section
        id="inicio"
        className="relative overflow-hidden bg-[#0A1628] text-white"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 15% 50%, rgba(214,158,46,0.09) 0%, transparent 50%), radial-gradient(circle at 85% 50%, rgba(197,48,48,0.09) 0%, transparent 50%)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-[1280px] px-6 py-14 lg:px-10 lg:py-20">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="overflow-hidden rounded-xs border border-white/20">
                <VenezuelanFlagMark className="h-4 w-6" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#F6E05E]">
                Plataforma Educativa · Venezuela
              </span>
            </div>

            <h1 className="font-serif text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.75rem]">
              Lengua de Señas{' '}
              <em className="font-bold italic text-[#F6E05E]">Venezolana</em>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300">
              Aprende el abecedario dactilológico, números, saludos y vocabulario esencial de la
              comunidad sorda de Venezuela mediante ilustraciones claras y prácticas interactivas
              al finalizar cada módulo.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => openModule(0)}
                className="inline-flex min-h-[46px] items-center gap-2 whitespace-nowrap rounded-lg bg-[#D69E2E] px-6 py-3 text-sm font-bold text-[#0A1628] transition-colors hover:bg-[#F6E05E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span>Explorar Abecedario</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('modulos')}
                className="inline-flex min-h-[46px] items-center gap-2 whitespace-nowrap rounded-lg border border-white/25 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F6E05E]"
              >
                <BookOpen className="h-4 w-4 text-[#F6E05E]" />
                <span>Ver los {MODULES_DATA.length} Módulos</span>
              </button>

              <button
                type="button"
                onClick={openRandomPractice}
                className="inline-flex min-h-[46px] items-center gap-2 whitespace-nowrap rounded-lg border border-[#F6E05E]/45 bg-white/5 px-5 py-3 text-sm font-semibold text-[#F6E05E] transition-colors hover:bg-[#F6E05E] hover:text-[#0A1628] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F6E05E]"
              >
                <Shuffle className="h-4 w-4" />
                <span>Práctica Aleatoria</span>
              </button>
            </div>
          </div>

          {/* Full-width 3-column metrics strip below hero title */}
          <div className="mt-12 grid grid-cols-1 gap-6 border-t border-white/15 pt-8 sm:grid-cols-3">
            <div>
              <div className="font-serif text-3xl font-black text-[#F6E05E] tabular-nums">29</div>
              <div className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
                Señas del abecedario (A–Z, Ñ, LL, RR)
              </div>
            </div>
            <div>
              <div className="font-serif text-3xl font-black text-[#F6E05E] tabular-nums">
                {MODULES_DATA.length}
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
                Módulos con práctica interactiva
              </div>
            </div>
            <div>
              <div className="font-serif text-3xl font-black text-[#F6E05E] tabular-nums">
                350.000+
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
                Personas sordas en Venezuela
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Stage: Modules Grid or Active Module View */}
      <main
        id="modulos"
        ref={moduleStageRef}
        className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10 lg:py-20"
      >
        {activeModule === null ? (
          <div>
            <div className="mb-12 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B7791F] dark:text-[#F6E05E]">
                Contenido del programa
              </p>
              <h2 className="mt-2 font-serif text-3xl font-black tracking-tight text-[#0A1628] sm:text-4xl dark:text-white">
                Módulos de Aprendizaje
              </h2>
              <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
                Selecciona un módulo para estudiar cada seña y realizar su práctica interactiva al
                final.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {MODULES_DATA.map((mod, index) => {
                const modCompletedCount = mod.signs.filter((s) => completedSigns[s.id]).length;
                const modTotal = mod.signs.length;
                const modPct = modTotal > 0 ? Math.round((modCompletedCount / modTotal) * 100) : 0;
                const modAllDone = modTotal > 0 && modCompletedCount === modTotal;

                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => openModule(index)}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-7 text-left transition-all duration-200 hover:-translate-y-1 hover:border-[#D69E2E] hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1628] dark:border-slate-800 dark:bg-[#0F1B2E] dark:hover:border-[#F6E05E]"
                  >
                    <div
                      className="absolute top-0 right-0 left-0 h-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      style={{
                        background:
                          'linear-gradient(to right, #FFCC00 33.3%, #00247D 33.3%, #00247D 66.6%, #CF142B 66.6%)',
                      }}
                      aria-hidden="true"
                    />

                    <div>
                      <div className="flex items-center justify-between text-xs font-medium text-slate-500 tabular-nums dark:text-slate-400">
                        <span className="font-serif text-2xl font-black text-slate-300 transition-colors group-hover:text-[#D69E2E] dark:text-slate-600 dark:group-hover:text-[#F6E05E]">
                          {mod.number}
                        </span>
                        {modAllDone ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Completado</span>
                          </span>
                        ) : (
                          <span>
                            {modCompletedCount > 0
                              ? `${modCompletedCount}/${modTotal} repasadas`
                              : `${modTotal} señas · Práctica`}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-4 font-serif text-2xl font-bold tracking-tight text-[#0A1628] dark:text-white">
                        {mod.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {mod.subtitle}
                      </p>
                    </div>

                    <div className="mt-6 space-y-3">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className={`h-full transition-all duration-300 ${
                            modAllDone
                              ? 'bg-emerald-500'
                              : 'bg-[#D69E2E] dark:bg-[#F6E05E]'
                          }`}
                          style={{ width: `${modPct}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.15em] text-[#0A1628] dark:text-[#F6E05E]">
                        <span className="inline-flex items-center gap-2">
                          <span>Explorar</span>
                          <ArrowRight className="h-4 w-4 text-[#B7791F] transition-transform duration-150 group-hover:translate-x-1 dark:text-[#F6E05E]" />
                        </span>
                        {modCompletedCount > 0 && (
                          <span className="text-[11px] font-semibold text-slate-500 tabular-nums dark:text-slate-400">
                            {modPct}%
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            {/* Module Header */}
            {(() => {
              const activeDone = activeModule.signs.filter((s) => completedSigns[s.id]).length;
              const activeTotal = activeModule.signs.length;
              const activePct = activeTotal > 0 ? Math.round((activeDone / activeTotal) * 100) : 0;
              const activeAllDone = activeTotal > 0 && activeDone === activeTotal;

              return (
                <div className="border-b border-slate-200 pb-8 dark:border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={goHome}
                      className="inline-flex min-h-[40px] items-center gap-2 whitespace-nowrap rounded-lg px-2 py-1 text-sm font-semibold text-slate-600 transition-colors hover:text-[#0A1628] dark:text-slate-300 dark:hover:text-white"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Volver al menú</span>
                    </button>

                    <div className="flex items-center gap-3 text-xs font-medium text-slate-500 tabular-nums dark:text-slate-400">
                      <span>Módulo {activeModule.number}</span>
                      <span aria-hidden="true">·</span>
                      <span>{activeModule.signs.length} señas</span>
                    </div>
                  </div>

                  <h1 className="mt-4 font-serif text-3xl font-black tracking-tight text-[#0A1628] sm:text-5xl dark:text-white">
                    {activeModule.title}
                  </h1>
                  <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
                    {activeModule.subtitle}
                  </p>

                  {/* Module Progress Bar */}
                  <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#0F1B2E]">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#0A1628] dark:text-white">
                        <CheckCircle2
                          className={`h-4 w-4 ${
                            activeAllDone
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-[#B7791F] dark:text-[#F6E05E]'
                          }`}
                        />
                        <span className="tabular-nums">
                          Progreso del módulo: {activeDone} de {activeTotal} señas repasadas ({activePct}%)
                        </span>
                      </div>
                      {activeDone > 0 && (
                        <button
                          type="button"
                          onClick={() => resetModuleProgress(activeModule.signs)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition-colors hover:text-[#C53030] dark:text-slate-400 dark:hover:text-red-400"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>Reiniciar módulo</span>
                        </button>
                      )}
                    </div>
                    <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className={`h-full transition-all duration-300 ${
                          activeAllDone ? 'bg-emerald-500' : 'bg-[#D69E2E] dark:bg-[#F6E05E]'
                        }`}
                        style={{ width: `${activePct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <p
                className="max-w-3xl text-base leading-relaxed text-slate-700 dark:text-slate-300"
                dangerouslySetInnerHTML={{ __html: activeModule.intro }}
              />

              {activeModule.signs.length > 6 && (
                <div className="relative shrink-0">
                  <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    value={signFilter}
                    onChange={(e) => setSignFilter(e.target.value)}
                    placeholder="Buscar seña..."
                    aria-label="Filtrar señas del módulo"
                    className="min-h-[42px] w-56 rounded-lg border border-slate-300 bg-white py-2 pr-3 pl-9 text-sm text-[#0A1628] placeholder:text-slate-400 focus:border-[#0A1628] focus:outline-none dark:border-slate-700 dark:bg-[#0F1B2E] dark:text-white dark:placeholder:text-slate-400 dark:focus:border-[#F6E05E]"
                  />
                </div>
              )}
            </div>

            {moduleCategories.length > 0 && (
              <div
                className="mt-6 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4 dark:border-slate-800"
                role="tablist"
                aria-label="Categorías del módulo"
              >
                {['Todas', ...moduleCategories].map((cat) => {
                  const isActive = selectedCategory === cat;
                  const count =
                    cat === 'Todas'
                      ? activeModule.signs.length
                      : activeModule.signs.filter((s) => s.category === cat).length;
                  return (
                    <button
                      key={cat}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setSelectedCategory(cat)}
                      className={`min-h-[38px] rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                        isActive
                          ? 'border-[#0A1628] bg-[#0A1628] text-white dark:border-[#D69E2E] dark:bg-[#D69E2E] dark:text-[#0A1628]'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#0F1B2E] dark:text-slate-300 dark:hover:border-slate-500'
                      }`}
                    >
                      {cat} <span className="opacity-70 tabular-nums">({count})</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Signs Grid */}
            {filteredSigns.length > 0 ? (
              <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {filteredSigns.map((sign) => {
                  const showImg = Boolean(sign.img) && !failedSignImages[sign.id];
                  const isDone = Boolean(completedSigns[sign.id]);
                  return (
                    <div
                      key={sign.id}
                      className={`group relative flex flex-col rounded-xl border bg-white transition-all duration-150 hover:-translate-y-1 hover:shadow-md dark:bg-[#0F1B2E] ${
                        isDone
                          ? 'border-emerald-400/80 hover:border-emerald-500 dark:border-emerald-600/70 dark:hover:border-emerald-400'
                          : 'border-slate-200 hover:border-[#D69E2E] dark:border-slate-800 dark:hover:border-[#F6E05E]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleSignCompleted(sign.id)}
                        aria-label={
                          isDone
                            ? `Desmarcar ${sign.letter} como repasada`
                            : `Marcar ${sign.letter} como repasada`
                        }
                        title={isDone ? 'Repasada (clic para desmarcar)' : 'Marcar como repasada'}
                        className={`absolute top-2.5 right-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full border shadow-xs transition-colors ${
                          isDone
                            ? 'border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600'
                            : 'border-slate-200 bg-white/95 text-slate-400 hover:border-emerald-400 hover:text-emerald-600 dark:border-slate-600 dark:bg-[#0F1B2E]/95 dark:text-slate-400 dark:hover:text-emerald-400'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Circle className="h-4 w-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => openSignDetail(sign)}
                        className="flex h-full w-full flex-col items-center rounded-xl p-3.5 text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A1628]"
                      >
                        <div className="aspect-square w-full overflow-hidden rounded-lg border border-slate-100 bg-white dark:border-slate-700">
                          {showImg ? (
                            <img
                              src={sign.img}
                              alt={`Seña ${sign.letter}`}
                              referrerPolicy="no-referrer"
                              onError={() =>
                                setFailedSignImages((prev) => ({ ...prev, [sign.id]: true }))
                              }
                              className={`h-full w-full transition-transform duration-300 group-hover:scale-[1.03] ${
                                sign.imgCropTop ? 'object-cover object-top' : 'object-contain'
                              }`}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-[#FAF9F6] font-serif text-2xl font-black text-[#0A1628]">
                              {sign.letter}
                            </div>
                          )}
                        </div>

                        <div className="mt-3 font-serif text-xl font-black text-[#0A1628] dark:text-white">
                          {sign.letter}
                        </div>
                        <p className="mt-1 text-xs leading-snug text-slate-600 dark:text-slate-300">
                          {sign.desc}
                        </p>
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-10 rounded-xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-[#0F1B2E]">
                <p className="text-base font-medium text-slate-700 dark:text-slate-200">
                  No se encontraron señas con los filtros seleccionados.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSignFilter('');
                    setSelectedCategory('Todas');
                  }}
                  className="mt-3 text-sm font-semibold text-[#C53030] underline underline-offset-4 dark:text-[#F6E05E]"
                >
                  Mostrar todas las señas
                </button>
              </div>
            )}

            {/* Práctica interactiva después de cada módulo */}
            <ModulePractice
              moduleId={activeModule.id}
              onSelectSign={openSignDetail}
            />

            {/* Module Bottom Navigation */}
            <div className="mt-14 flex items-center justify-between border-t border-slate-200 pt-8 dark:border-slate-800">
              <button
                type="button"
                disabled={activeModuleIndex === 0}
                onClick={() =>
                  activeModuleIndex !== null &&
                  activeModuleIndex > 0 &&
                  openModule(activeModuleIndex - 1)
                }
                className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#0A1628] transition-colors hover:bg-[#0A1628] hover:text-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-[#0A1628] dark:border-slate-700 dark:bg-[#0F1B2E] dark:text-white dark:hover:bg-[#D69E2E] dark:hover:text-[#0A1628] dark:disabled:hover:bg-[#0F1B2E] dark:disabled:hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Anterior</span>
              </button>

              <span className="text-sm font-medium text-slate-500 tabular-nums dark:text-slate-400">
                {activeModule.number} / {String(MODULES_DATA.length).padStart(2, '0')}
              </span>

              <button
                type="button"
                disabled={activeModuleIndex === MODULES_DATA.length - 1}
                onClick={() =>
                  activeModuleIndex !== null &&
                  activeModuleIndex < MODULES_DATA.length - 1 &&
                  openModule(activeModuleIndex + 1)
                }
                className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#0A1628] transition-colors hover:bg-[#0A1628] hover:text-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-[#0A1628] dark:border-slate-700 dark:bg-[#0F1B2E] dark:text-white dark:hover:bg-[#D69E2E] dark:hover:text-[#0A1628] dark:disabled:hover:bg-[#0F1B2E] dark:disabled:hover:text-white"
              >
                <span>Siguiente</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ¿Sabías que...? Editorial Band */}
      <section id="sabias-que" className="bg-[#0A1628] py-20 text-white">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F6E05E]">
              Datos clave
            </p>
            <h2 className="mt-2 font-serif text-3xl font-black tracking-tight text-white sm:text-4xl">
              ¿Sabías que...?
            </h2>
            <p className="mt-2 text-base text-slate-300">
              Aspectos fundamentales sobre la LSV y la cultura de la comunidad sorda venezolana.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {FACTS_DATA.map((fact) => (
              <article key={fact.number} className="border-t border-white/15 pt-6">
                <div className="font-serif text-3xl font-black text-[#F6E05E] tabular-nums">
                  {fact.number}
                </div>
                <h3 className="mt-3 font-serif text-xl font-bold text-white">{fact.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{fact.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Glosario LSV */}
      <GlossarySection onSelectSign={openSignDetail} />

      {/* Información Importante */}
      <section id="informacion" className="mx-auto max-w-[1280px] px-6 py-20 lg:px-10">
        <div className="grid items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B7791F] dark:text-[#F6E05E]">
              Contexto histórico y social
            </p>
            <h2 className="mt-2 font-serif text-3xl font-black tracking-tight text-[#0A1628] sm:text-4xl dark:text-white">
              Información Importante
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              La Lengua de Señas Venezolana es un patrimonio lingüístico vivo que fortalece la
              inclusión educativa, laboral y cultural en todo el país.
            </p>

            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0F1B2E]">
              {!communityImgFailed ? (
                <img
                  src={COMMUNITY_IMAGE}
                  alt="Taller educativo practicando lengua de señas en comunidad"
                  referrerPolicy="no-referrer"
                  onError={() => setCommunityImgFailed(true)}
                  className="aspect-[4/3] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[4/3] flex-col items-center justify-center bg-[#0A1628] p-6 text-center text-white">
                  <VenezuelanFlagMark className="h-7 w-11" />
                  <span className="mt-3 font-serif text-lg font-bold text-[#F6E05E]">
                    Comunidad LSV Venezuela
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              {TIMELINE_DATA.map((item) => (
                <div
                  key={item.label}
                  className="grid gap-3 py-6 sm:grid-cols-12 sm:items-start sm:gap-6"
                >
                  <div className="font-serif text-lg font-bold text-[#0A1628] sm:col-span-4 dark:text-white">
                    {item.label}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700 sm:col-span-8 dark:text-slate-300">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className="bg-[#0A1628] py-14 text-white dark:border-t dark:border-slate-800 dark:bg-[#050B16]">
        <div className="mx-auto max-w-[1280px] px-6 text-center lg:px-10">
          <div className="mx-auto mb-4 flex items-center justify-center gap-3">
            <LsvLogoBadge className="h-10 w-10" />
            <span className="overflow-hidden rounded-xs border border-white/20">
              <VenezuelanFlagMark className="h-6 w-10" />
            </span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-white">Plataforma Educativa LSV</h3>
          <p className="mt-2 text-sm text-slate-300">
            Lengua de Señas Venezolana · Recurso de aprendizaje accesible
          </p>
          <p className="mt-4 text-sm font-semibold text-[#F6E05E]">
            Hecho por Alexandra Guerrero Morillo y Centro Integral PSICOMERAK
          </p>
          <div className="mt-6 border-t border-white/10 pt-6 text-xs text-slate-400">
            © 2026 — Material educativo de libre acceso
          </div>
        </div>
      </footer>

      {/* Sign Study Modal */}
      <SignDetailModal
        sign={selectedSign}
        signs={activeModule ? activeModule.signs : glossarySigns}
        isCompleted={selectedSign ? Boolean(completedSigns[selectedSign.id]) : false}
        onToggleCompleted={(s) => toggleSignCompleted(s.id)}
        onClose={closeSignDetail}
        onSelectSign={openSignDetail}
      />

      {/* Random Practice Modal */}
      <RandomPracticeModal
        isOpen={randomPracticeOpen}
        onClose={closeRandomPractice}
        onSignCompleted={(s) => markSignCompleted(s.id)}
      />
    </div>
  );
}
