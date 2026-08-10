import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import {
  IconClock, IconFire, IconPan, IconStar, IconPlus, IconBookmark, IconArrowRight,
  Reveal,
} from '../components'
import {
  type Country, type Meal, type MealKey, type CountryData,
  COUNTRIES,
} from '../data'

// ─── Session-level tracking for entrance animation ───────────
const playedPeriods = new Set<string>()

// Reset on module load to ensure animations play on first visit
playedPeriods.clear()

// ─── China timezone (UTC+8) helpers ────────────────────────
function getChinaHour(): number {
  const now = new Date()
  const utcHour = now.getUTCHours()
  return (utcHour + 8) % 24
}

// ─── Types & constants ─────────────────────────────────────
type Period = 'morning' | 'afternoon' | 'evening' | 'night'

const MEAL_META = [
  { label: 'Breakfast', cn: '早餐', time: '07:00', key: 'breakfast' as const, bg: 'var(--c-morning-1)', accent: 'var(--c-morning-3)', ink: '#5C3E14' },
  { label: 'Lunch',     cn: '午餐', time: '12:30', key: 'lunch' as const,     bg: 'var(--c-afternoon-1)', accent: 'var(--c-afternoon-3)', ink: '#6B2A0A' },
  { label: 'Dinner',    cn: '晚餐', time: '19:30', key: 'dinner' as const,    bg: 'var(--c-dusk-1)',      accent: 'var(--c-dusk-3)',      ink: '#4A3A2A' },
  { label: 'Dessert',   cn: '甜点', time: '21:30', key: 'dessert' as const,   bg: 'var(--c-night-1)',     accent: 'var(--c-night-3)',     ink: '#EBD9C4' },
]

function periodFromHour(hour: number): Period {
  if (hour >= 5 && hour < 11) return 'morning'
  if (hour >= 11 && hour < 18) return 'afternoon'
  if (hour >= 18 && hour < 19) return 'evening'
  return 'night'
}

const PERIOD_LABELS: Record<Period, { en: string; cn: string }> = {
  morning: { en: 'Morning', cn: '早晨' },
  afternoon: { en: 'Afternoon', cn: '下午' },
  evening: { en: 'Evening', cn: '黄昏' },
  night: { en: 'Night', cn: '夜晚' },
}

const PERIOD_MEAL_INDEX: Record<Period, number> = {
  morning: 0,
  afternoon: 1,
  evening: 2,
  night: 3,
}

// ─── Web Audio: 程序化环境音效生成 ──────────────────────────
let _audioCtx: AudioContext | null = null
const _activeAudioNodes: Set<AudioNode> = new Set()
const _activeBufferSources: Set<AudioBufferSourceNode> = new Set()

function stopAllPeriodSounds(): void {
  try {
    _activeBufferSources.forEach((src) => {
      try { src.stop() } catch { /* already stopped */ }
      src.disconnect()
    })
    _activeBufferSources.clear()
    _activeAudioNodes.forEach((n) => n.disconnect())
    _activeAudioNodes.clear()
  } catch { /* noop */ }
}

function _getAudioCtx(): AudioContext | null {
  try {
    if (!_audioCtx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      _audioCtx = new AC()
    }
    if (_audioCtx.state === 'suspended') _audioCtx.resume()
    return _audioCtx
  } catch { return null }
}

function _makePinkNoiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * seconds)
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const data = buf.getChannelData(0)
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1
    b0 = 0.99886 * b0 + white * 0.0555179
    b1 = 0.99332 * b1 + white * 0.0750759
    b2 = 0.96900 * b2 + white * 0.1538520
    b3 = 0.86650 * b3 + white * 0.3104856
    b4 = 0.55000 * b4 + white * 0.5329522
    b5 = -0.7616 * b5 - white * 0.0168980
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
    b6 = white * 0.115926
  }
  return buf
}

function _makeWhiteNoiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * seconds)
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  return buf
}

function playPeriodSound(period: Period): void {
  stopAllPeriodSounds()
  const ctx = _getAudioCtx()
  if (!ctx) return
  const now = ctx.currentTime
  const MAX_DURATION = 2.4

  const master = ctx.createGain()
  master.gain.setValueAtTime(0.5, now)
  master.gain.exponentialRampToValueAtTime(0.0001, now + MAX_DURATION)
  master.connect(ctx.destination)
  _activeAudioNodes.add(master)

  const trackNode = (node: AudioNode) => { _activeAudioNodes.add(node); return node }
  const trackSource = (src: AudioBufferSourceNode) => { _activeBufferSources.add(src); return src }

  if (period === 'morning') {
    // Gentle dawn bird chirps — soft, distant
    const chirpPairs = [
      { start: 0.2, f1: 2100, f2: 2800, dur: 0.16 },
      { start: 0.65, f1: 2500, f2: 2000, dur: 0.12 },
      { start: 1.25, f1: 1800, f2: 2600, dur: 0.18 },
      { start: 1.85, f1: 2800, f2: 2300, dur: 0.14 },
    ]
    chirpPairs.forEach(({ start, f1, f2, dur }) => {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(f1, now + start)
      osc.frequency.exponentialRampToValueAtTime(f2, now + start + dur)
      g.gain.setValueAtTime(0.0001, now + start)
      g.gain.exponentialRampToValueAtTime(0.55, now + start + 0.008)
      g.gain.exponentialRampToValueAtTime(0.0001, now + start + dur)
      trackNode(osc); trackNode(g)
      osc.connect(g); g.connect(master)
      osc.start(now + start); osc.stop(now + Math.min(start + dur + 0.05, MAX_DURATION))
    })
    // Very soft wind ambience
    const ambBuf = _makePinkNoiseBuffer(ctx, MAX_DURATION)
    const amb = ctx.createBufferSource()
    amb.buffer = ambBuf; trackSource(amb)
    const ambFilter = ctx.createBiquadFilter()
    ambFilter.type = 'lowpass'; ambFilter.frequency.value = 350
    const ambGain = ctx.createGain(); ambGain.gain.value = 0.18
    trackNode(ambFilter); trackNode(ambGain)
    amb.connect(ambFilter); ambFilter.connect(ambGain); ambGain.connect(master)
    amb.start(now); amb.stop(now + MAX_DURATION)

  } else if (period === 'afternoon') {
    // Light café ambience — distant murmur + occasional cup
    const ambBuf = _makePinkNoiseBuffer(ctx, MAX_DURATION)
    const amb = ctx.createBufferSource()
    amb.buffer = ambBuf; trackSource(amb)
    const ambFilter = ctx.createBiquadFilter()
    ambFilter.type = 'bandpass'; ambFilter.frequency.value = 420; ambFilter.Q.value = 0.5
    const ambGain = ctx.createGain(); ambGain.gain.value = 0.22
    trackNode(ambFilter); trackNode(ambGain)
    amb.connect(ambFilter); ambFilter.connect(ambGain); ambGain.connect(master)
    amb.start(now); amb.stop(now + MAX_DURATION)

    // Soft hum
    const hum = ctx.createOscillator(); trackNode(hum)
    hum.type = 'sine'; hum.frequency.value = 140
    const humGain = ctx.createGain(); humGain.gain.value = 0.12; trackNode(humGain)
    hum.connect(humGain); humGain.connect(master)
    hum.start(now); hum.stop(now + MAX_DURATION)

    // Delicate cup clinks
    const clinkTimes = [0.5, 1.5, 2.2]
    clinkTimes.forEach((t) => {
      const osc = ctx.createOscillator(); trackNode(osc)
      const g = ctx.createGain(); trackNode(g)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(1400 + Math.random() * 300, now + t)
      osc.frequency.exponentialRampToValueAtTime(700, now + t + 0.06)
      g.gain.setValueAtTime(0.0001, now + t)
      g.gain.exponentialRampToValueAtTime(0.3, now + t + 0.003)
      g.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.12)
      osc.connect(g); g.connect(master)
      osc.start(now + t); osc.stop(now + Math.min(t + 0.15, MAX_DURATION))
    })

  } else if (period === 'evening') {
    // Wind chimes — gentle, ethereal
    const chimeNotes = [523, 659, 784, 659, 523, 440]
    chimeNotes.forEach((freq, i) => {
      const startAt = now + 0.15 + i * 0.35 + Math.random() * 0.1
      const osc = ctx.createOscillator(); trackNode(osc)
      const g = ctx.createGain(); trackNode(g)
      osc.type = 'sine'; osc.frequency.value = freq
      g.gain.setValueAtTime(0.0001, startAt)
      g.gain.linearRampToValueAtTime(0.4, startAt + 0.015)
      g.gain.exponentialRampToValueAtTime(0.0001, startAt + 2.0)
      osc.connect(g); g.connect(master)
      osc.start(startAt); osc.stop(Math.min(startAt + 2.2, now + MAX_DURATION))

      const osc2 = ctx.createOscillator(); trackNode(osc2)
      const g2 = ctx.createGain(); trackNode(g2)
      osc2.type = 'triangle'; osc2.frequency.value = freq * 2
      g2.gain.setValueAtTime(0.0001, startAt)
      g2.gain.linearRampToValueAtTime(0.12, startAt + 0.01)
      g2.gain.exponentialRampToValueAtTime(0.0001, startAt + 1.2)
      osc2.connect(g2); g2.connect(master)
      osc2.start(startAt); osc2.stop(Math.min(startAt + 1.4, now + MAX_DURATION))
    })
    // Gentle wind
    const windBuf = _makeWhiteNoiseBuffer(ctx, MAX_DURATION)
    const wind = ctx.createBufferSource(); wind.buffer = windBuf; trackSource(wind)
    const windFilter = ctx.createBiquadFilter()
    windFilter.type = 'lowpass'; windFilter.frequency.value = 250
    const windGain = ctx.createGain(); windGain.gain.value = 0.1
    trackNode(windFilter); trackNode(windGain)
    wind.connect(windFilter); windFilter.connect(windGain); windGain.connect(master)
    wind.start(now); wind.stop(now + MAX_DURATION)

  } else {
    // Night — bright, ethereal, dreamy
    const now2 = now
    // Ethereal pad — bright ambient
    const padOsc = ctx.createOscillator(); trackNode(padOsc)
    padOsc.type = 'sine'; padOsc.frequency.value = 523.25
    const padOsc2 = ctx.createOscillator(); trackNode(padOsc2)
    padOsc2.type = 'sine'; padOsc2.frequency.value = 659.25
    const padOsc3 = ctx.createOscillator(); trackNode(padOsc3)
    padOsc3.type = 'sine'; padOsc3.frequency.value = 783.99
    const padGain = ctx.createGain(); trackNode(padGain)
    padGain.gain.setValueAtTime(0.0001, now2)
    padGain.gain.exponentialRampToValueAtTime(0.16, now2 + 0.5)
    padGain.gain.setValueAtTime(0.16, now2 + 1.8)
    padGain.gain.exponentialRampToValueAtTime(0.0001, now2 + MAX_DURATION)
    padOsc.connect(padGain); padOsc2.connect(padGain); padOsc3.connect(padGain)
    padGain.connect(master)
    padOsc.start(now2); padOsc2.start(now2); padOsc3.start(now2)
    padOsc.stop(now2 + MAX_DURATION); padOsc2.stop(now2 + MAX_DURATION); padOsc3.stop(now2 + MAX_DURATION)

    // Bright glass chimes
    const chimeNotes = [1047, 1319, 1568, 1319, 1047]
    chimeNotes.forEach((freq, i) => {
      const startAt = now2 + 0.3 + i * 0.45 + Math.random() * 0.1
      const osc = ctx.createOscillator(); trackNode(osc)
      const g = ctx.createGain(); trackNode(g)
      osc.type = 'sine'; osc.frequency.value = freq
      g.gain.setValueAtTime(0.0001, startAt)
      g.gain.exponentialRampToValueAtTime(0.35, startAt + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, startAt + 1.5)
      osc.connect(g); g.connect(master)
      osc.start(startAt); osc.stop(Math.min(startAt + 1.8, now2 + MAX_DURATION))
    })

    // Gentle wind
    const windBuf = _makeWhiteNoiseBuffer(ctx, MAX_DURATION)
    const wind = ctx.createBufferSource(); wind.buffer = windBuf; trackSource(wind)
    const windFilter = ctx.createBiquadFilter()
    windFilter.type = 'lowpass'; windFilter.frequency.value = 280
    const windGain = ctx.createGain(); windGain.gain.value = 0.08
    trackNode(windFilter); trackNode(windGain)
    wind.connect(windFilter); windFilter.connect(windGain); windGain.connect(master)
    wind.start(now2); wind.stop(now2 + MAX_DURATION)

    // Subtle cricket (very quiet, background only)
    const cricketGroups = [
      { start: 0.5, count: 2, interval: 0.06 },
      { start: 1.4, count: 2, interval: 0.055 },
    ]
    cricketGroups.forEach(({ start, count, interval }) => {
      for (let j = 0; j < count; j++) {
        const chirpStart = now2 + start + j * interval
        const osc = ctx.createOscillator(); trackNode(osc)
        const g = ctx.createGain(); trackNode(g)
        osc.type = 'sine'
        osc.frequency.setValueAtTime(4800 + Math.random() * 150, chirpStart)
        g.gain.setValueAtTime(0.0001, chirpStart)
        g.gain.exponentialRampToValueAtTime(0.35, chirpStart + 0.002)
        g.gain.exponentialRampToValueAtTime(0.0001, chirpStart + 0.03)
        osc.connect(g); g.connect(master)
        osc.start(chirpStart); osc.stop(chirpStart + 0.05)
      }
    })
  }
}

// ─── Main TodayScreen ──────────────────────────────────────
export function TodayScreen(props: {
  country: Country
  setCountry: (c: Country) => void
  todayCountry?: Country
  featuredMealKey: MealKey
  onRecipe: (meal: Meal) => void
  onBack?: () => void
  active?: boolean
}) {
  const { country, setCountry, todayCountry, featuredMealKey, onRecipe, onBack, active } = props
  const [focusMode, setFocusMode] = useState(true)
  const [autoCountry, setAutoCountry] = useState(true)
  const [showIntro, setShowIntro] = useState(false)
  const [introPhase, setIntroPhase] = useState(0) // 0: hidden, 1: playing, 2: fading
  const hour = getChinaHour()
  const currentMealIdx = hour < 11 ? 0 : hour < 18 ? 1 : hour < 19 ? 2 : 3
  const period = periodFromHour(hour)
  const periodLabel = PERIOD_LABELS[period]
  const effectiveCountry = autoCountry && todayCountry ? todayCountry : country
  const c = COUNTRIES[effectiveCountry]

  // Play entrance animation once per time period per session
  useEffect(() => {
    const periodKey = `${period}-${effectiveCountry}`
    if (active && !playedPeriods.has(periodKey)) {
      playedPeriods.add(periodKey)
      setShowIntro(true)
      setIntroPhase(1)

      const ensureAudioReady = () => {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        if (AC) {
          try {
            if (!_audioCtx) {
              _audioCtx = new AC()
            }
            if (_audioCtx.state === 'suspended') {
              _audioCtx.resume()
            }
          } catch {}
        }
      }
      ensureAudioReady()
      playPeriodSound(period)

      const t1 = window.setTimeout(() => {
        setIntroPhase(2)
      }, 2300)

      const t2 = window.setTimeout(() => {
        setShowIntro(false)
        setIntroPhase(0)
      }, 3150)

      return () => {
        clearTimeout(t1); clearTimeout(t2)
        stopAllPeriodSounds()
      }
    }
  }, [active, period, effectiveCountry])

  const meals = MEAL_META
  const totalKcal = useMemo(
    () => meals.reduce((s, m) => s + c[m.key].kcal, 0),
    [c],
  )
  const parseG = (s: string) => parseInt(s.replace('g', ''), 10)
  const totalMacros = useMemo(
    () => meals.reduce(
      (s, m) => ({
        protein: s.protein + parseG(c[m.key].macros.protein),
        carbs: s.carbs + parseG(c[m.key].macros.carbs),
        fats: s.fats + parseG(c[m.key].macros.fats),
      }),
      { protein: 0, carbs: 0, fats: 0 },
    ),
    [c],
  )
  const iconsByMeal = [IconClock, IconFire, IconPan, IconStar]
  const currentMeal = meals[currentMealIdx]
  const currentMealData = c[currentMeal.key]
  const CurrentMealIcon = iconsByMeal[currentMealIdx]

  // Cycle to next country (only in manual mode)
  const cycleCountry = useCallback(() => {
    if (autoCountry) return
    const countryKeys = Object.keys(COUNTRIES) as Country[]
    const idx = countryKeys.indexOf(country)
    const next = countryKeys[(idx + 1) % countryKeys.length]
    setCountry(next)
  }, [autoCountry, country, setCountry])

  return (
    <div className="h-full overflow-y-auto pb-24 bg-[#F3ECE0]">
      {/* Focus Mode: Hero image with floating controls */}
      {focusMode ? (
      <section className="relative">
        <div
          className="relative h-[540px] rounded-b-3xl overflow-hidden cursor-pointer group transition-transform duration-300 active:scale-[0.99]"
          onClick={() => onRecipe(currentMealData)}
        >
          <img
            src={currentMealData.img}
            alt={currentMealData.en}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] hero-ken-burns"
          />
          {/* Light gradient for text readability only — with breathing */}
          <div className="absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-black/40 to-transparent hero-gradient-breathe" />

          {/* Top-left: Back button */}
          <div className="absolute top-9 left-5 z-20">
            <button
              onClick={(e) => { e.stopPropagation(); onBack?.(); }}
              className="flex items-center gap-1.5 text-white/90 bg-black/25 backdrop-blur px-3 py-1.5 rounded-full text-[11px] tracking-[0.2em] uppercase hover:bg-black/40 active:scale-95 transition-colors"
            >
              <IconArrowRight size={12} style={{ transform: 'rotate(180deg)' }} />
              Back
            </button>
          </div>

          {/* Top-right: controls */}
          <div className="absolute top-9 right-5 z-20 flex items-center gap-3">
            {/* Country indicator */}
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); setAutoCountry(!autoCountry); }}
                className={`px-2 py-0.5 rounded-full flex items-center justify-center text-[9px] tracking-wider transition-all ${autoCountry ? 'bg-white/20 text-white/80 border border-white/20' : 'bg-white/10 text-white/50 border border-white/10'}`}
                title={autoCountry ? 'Auto mode' : 'Manual mode'}
              >
                auto
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); if (!autoCountry) cycleCountry(); }}
                className={`flex items-center gap-1 transition-all ${autoCountry ? 'text-white/50' : 'text-white/80 hover:text-white'}`}
                title={autoCountry ? 'Auto country (locked)' : 'Click to change country'}
                disabled={autoCountry}
              >
                <span className="font-display text-[12px]">{c.name}</span>
              </button>
            </div>

            {/* Full Day toggle - more prominent */}
            <button
              onClick={(e) => { e.stopPropagation(); setFocusMode(false); }}
              className="flex items-center gap-1.5 text-white bg-white/20 backdrop-blur border border-white/30 px-3 py-1.5 rounded-full text-[11px] tracking-[0.15em] uppercase hover:bg-white/30 active:scale-95 transition-all"
            >
              <IconPlus size={12} />
              <span>全天</span>
            </button>
          </div>

          {/* Bottom content overlay with staggered entrance */}
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center hero-eyebrow-fade">
                <CurrentMealIcon size={14} stroke="#fff" />
              </div>
              <p className="text-[9px] tracking-[0.4em] uppercase text-white/75 hero-eyebrow-fade hero-delay-150">
                {MEAL_META[PERIOD_MEAL_INDEX[period]].time} · {MEAL_META[PERIOD_MEAL_INDEX[period]].label}
              </p>
              {meals[currentMealIdx].key === featuredMealKey && (
                <span className="ml-1 bg-[#E8650A] text-white text-[8px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full font-semibold hero-badge-fade hero-delay-300">Featured</span>
              )}
            </div>
            <h1 className="font-display text-[40px] font-black leading-[0.95] tracking-tight hero-text-fade hero-delay-300">{currentMealData.en}</h1>
            <p className="font-display italic text-white/85 text-[15px] mt-0.5 hero-subtitle-fade hero-delay-450">{currentMealData.cn}</p>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="bg-white/18 backdrop-blur-sm border border-white/25 text-white text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full hero-badge-fade hero-delay-600">{currentMealData.kcal} kcal</span>
              <span className="bg-white/18 backdrop-blur-sm border border-white/25 text-white text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full hero-badge-fade hero-delay-750">{currentMealData.taste}</span>
            </div>
          </div>
        </div>

        {/* Bottom fade for smooth transition */}
        <div
          className="absolute bottom-0 left-0 right-0 h-14 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #F3ECE0)' }}
        />
      </section>
      ) : (
      /* Full Day mode - no image, clean header */
      <section className="px-5 pt-9 pb-2">
        {/* Top bar - same button style as focus mode */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setFocusMode(true)}
            className="flex items-center gap-1.5 text-stone-700 bg-white border border-stone-300 px-3 py-1.5 rounded-full text-[11px] tracking-[0.2em] uppercase hover:bg-stone-50 active:scale-95 transition-colors"
          >
            <IconArrowRight size={12} style={{ transform: 'rotate(180deg)' }} />
            Back
          </button>
          <button
            onClick={() => setFocusMode(true)}
            className="flex items-center gap-1.5 text-stone-700 bg-white border border-stone-300 px-3 py-1.5 rounded-full text-[11px] tracking-[0.15em] uppercase hover:bg-stone-50 active:scale-95 transition-all"
          >
            <IconBookmark size={12} />
            <span>单餐</span>
          </button>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-display text-[32px] font-black leading-tight text-stone-900">泰餐 · {c.name}</h1>
            <p className="font-display italic text-stone-600 text-[14px] mt-0.5">{periodLabel.en}'s Journey</p>
          </div>
        </div>
        {/* Mode indicator */}
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => setAutoCountry(!autoCountry)}
            className={`px-2.5 py-1 rounded-full text-[10px] tracking-wider transition-all ${autoCountry ? 'bg-[#E8650A]/10 text-[#E8650A] border border-[#E8650A]/30' : 'bg-stone-100 text-stone-500 border border-stone-200'}`}
          >
            {autoCountry ? 'Auto' : 'Manual'}
          </button>
          {!autoCountry && (
            <button
              onClick={cycleCountry}
              className="px-2.5 py-1 rounded-full text-[10px] tracking-wider bg-stone-800 text-white hover:bg-stone-700 active:scale-95 transition-all"
            >
              Change Country
            </button>
          )}
        </div>
      </section>
      )}

      {/* Meal content */}
      <div className="px-5">
        {!focusMode && (
          <TimelineMeals
            meals={meals}
            c={c}
            icons={iconsByMeal}
            onRecipe={onRecipe}
            featuredMealKey={featuredMealKey}
          />
        )}
      </div>

      {/* Today's totals */}
      <section className="bg-[#F3ECE0] px-6 py-10 mt-2 border-t border-stone-300/60">
        <Reveal>
          <div className="flex items-center gap-2 mb-6">
            <span className="font-hand text-[20px] text-stone-600">Today's totals —</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="font-display text-[64px] font-black text-[#E8650A]">{totalKcal}</p>
              <p className="text-stone-500 text-[11px] tracking-widest uppercase mt-1">Calories · 总卡路里</p>
            </div>
            <div className="flex gap-4 text-right">
              {[{ k: `${totalMacros.protein}g`, v: 'Protein' }, { k: `${totalMacros.carbs}g`, v: 'Carbs' }, { k: `${totalMacros.fats}g`, v: 'Fats' }].map((n, i) => (
                <div key={i} className="border-l-2 border-stone-300 pl-3">
                  <p className="font-display text-[18px] font-bold text-stone-900">{n.k}</p>
                  <p className="text-stone-500 text-[9px] tracking-widest uppercase">{n.v}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <button
            onClick={() => onRecipe(currentMealData)}
            className="mt-8 w-full bg-[#1A1208] text-white py-4 rounded-2xl text-[11px] tracking-[0.3em] uppercase flex items-center justify-center gap-2 hover:bg-[#2A1F0F] active:scale-[0.98] transition-all"
          >
            <IconPan size={16} /> Cook Today's Menu
          </button>
        </Reveal>
      </section>

      {/* ─── 优化后入场动画：极简编辑风 ─── */}
      {showIntro && (
        <div
          className={`absolute inset-0 bottom-[56px] z-50 pointer-events-none transition-opacity duration-1000 ease-out ${
            introPhase === 2 ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {/* 背景层 */}
          <div className="absolute inset-0 intro-bg-fade">
            {period === 'morning' && (
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(160deg, #F8F4EB 0%, #EFE0C8 55%, #E0CCA8 100%)',
                }}
              />
            )}
            {period === 'afternoon' && (
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(160deg, #EEF1F5 0%, #E2E6EB 55%, #D3D0C8 100%)',
                }}
              />
            )}
            {period === 'evening' && (
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, #2A1B20 0%, #4A2F30 45%, #6B453E 80%, #8A6252 100%)',
                }}
              />
            )}
            {period === 'night' && (
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(170deg, #0D111B 0%, #182030 50%, #222C3F 100%)',
                }}
              />
            )}

            {/* 柔光晕 */}
            <div
              className="absolute inset-0 intro-glow-drift"
              style={{
                background:
                  period === 'morning'
                    ? 'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(255,225,170,0.35) 0%, transparent 70%)'
                    : period === 'afternoon'
                    ? 'radial-gradient(ellipse 50% 35% at 50% 25%, rgba(220,230,240,0.4) 0%, transparent 70%)'
                    : period === 'evening'
                    ? 'radial-gradient(ellipse 55% 30% at 50% 65%, rgba(255,150,90,0.25) 0%, transparent 70%)'
                    : 'radial-gradient(ellipse 45% 35% at 60% 25%, rgba(160,180,220,0.15) 0%, transparent 70%)',
              }}
            />

            {/* 极淡颗粒纹理 */}
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
              }}
            />
          </div>

          {/* 顶部时间标签 */}
          <div className="absolute top-16 left-0 right-0 flex justify-center intro-eyebrow-in">
            <p
              className="text-[10px] tracking-[0.6em] uppercase font-light"
              style={{
                color:
                  period === 'evening' || period === 'night'
                    ? 'rgba(245,240,232,0.3)'
                    : 'rgba(45,37,32,0.25)',
              }}
            >
              {MEAL_META[PERIOD_MEAL_INDEX[period]].time} ·{' '}
              {MEAL_META[PERIOD_MEAL_INDEX[period]].label}
            </p>
          </div>

          {/* 中心视觉 + 文字 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* 核心视觉符号 */}
            <div className="intro-visual-in mb-10">
              {period === 'morning' && (
                <div
                  className="w-20 h-20 rounded-full"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(255,235,180,1) 0%, rgba(245,205,130,0.8) 50%, rgba(230,180,100,0) 100%)',
                    filter: 'blur(2px)',
                  }}
                />
              )}
              {period === 'afternoon' && (
                <div
                  className="w-24 h-12 rounded-full"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(235,240,245,0.4) 100%)',
                    filter: 'blur(3px)',
                  }}
                />
              )}
              {period === 'evening' && (
                <div
                  className="w-16 h-16 rounded-full"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(255,180,110,1) 0%, rgba(230,120,70,0.7) 55%, rgba(200,80,50,0) 100%)',
                    filter: 'blur(2px)',
                  }}
                />
              )}
              {period === 'night' && (
                <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                  <defs>
                    <radialGradient id="moonGrad" cx="35%" cy="35%" r="55%">
                      <stop offset="0%" stopColor="#F8F5EE" />
                      <stop offset="100%" stopColor="#C8C2B4" />
                    </radialGradient>
                    <mask id="moonMask">
                      <circle cx="36" cy="36" r="18" fill="white" />
                      <circle cx="44" cy="32" r="16" fill="black" />
                    </mask>
                  </defs>
                  <circle cx="36" cy="36" r="22" fill="rgba(220,230,250,0.15)" />
                  <circle cx="36" cy="36" r="18" fill="url(#moonGrad)" mask="url(#moonMask)" />
                </svg>
              )}
            </div>

            {/* 主标题 */}
            <h2
              className="intro-title-in font-display font-black tracking-tight"
              style={{
                fontSize: '88px',
                lineHeight: 0.85,
                color:
                  period === 'night'
                    ? '#F5F0E8'
                    : period === 'evening'
                    ? '#FFE0C0'
                    : '#2D2520',
              }}
            >
              {periodLabel.en}
            </h2>

            {/* 副标题 */}
            <p
              className="intro-subtitle-in font-display mt-4"
              style={{
                fontSize: '18px',
                letterSpacing: '0.15em',
                color:
                  period === 'evening' || period === 'night'
                    ? 'rgba(235,225,205,0.5)'
                    : 'rgba(90,75,55,0.45)',
              }}
            >
              {periodLabel.cn}
            </p>

            {/* 进度条 */}
            <div className="intro-progress-in relative mt-10" style={{ width: 200, height: 2 }}>
              <div
                className="absolute inset-0 rounded-full opacity-20"
                style={{
                  backgroundColor:
                    period === 'evening' || period === 'night'
                      ? '#F5F0E8'
                      : '#2D2520',
                }}
              />
              <div
                className="intro-progress-bar absolute inset-y-0 left-0 rounded-full"
                style={{
                  backgroundColor:
                    period === 'evening'
                      ? '#FFB078'
                      : period === 'night'
                      ? '#D8DFED'
                      : period === 'morning'
                      ? '#D4B478'
                      : '#AABBCF',
                }}
              />
            </div>

            {/* 国家名 */}
            <p
              className="intro-country-in mt-6 text-[9px] tracking-[0.5em] uppercase font-light"
              style={{
                color:
                  period === 'evening' || period === 'night'
                    ? 'rgba(230,220,200,0.3)'
                    : 'rgba(90,75,55,0.3)',
              }}
            >
              {c.name} · {c.cn}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export function FocusMealDetail({ meal, data, idx, total }: {
  meal: { label: string; cn: string; time: string; bg: string; accent: string; ink: string; key: string }
  data: Meal
  idx: number
  total: number
}) {
  return (
    <section
      className="relative -mt-4"
      style={{ backgroundColor: meal.bg }}
    >
      <Reveal>
        <div className="px-6 py-8">
          <p className="font-display italic text-[18px]" style={{ color: meal.ink }}>A story<span className="text-stone-400"> · 一段故事</span></p>
          <p className="text-stone-700 text-[15px] leading-[1.85] mt-2">
            {data.story}
          </p>
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-stone-600">
              <span className="opacity-60">{data.en}</span>
            </div>
            <div className="text-right text-stone-500 text-[10px] tracking-widest">
              {String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

export function TimelineMeals({ meals, c, icons, onRecipe, featuredMealKey }: {
  meals: { label: string; cn: string; time: string; key: 'breakfast'|'lunch'|'dinner'|'dessert'; bg: string; accent: string; ink: string }[]
  c: CountryData
  icons: React.FC<{size?:number;stroke?:string}>[]
  onRecipe: (meal: Meal) => void
  featuredMealKey: MealKey
}) {
  return (
    <section className="bg-[#F3ECE0] py-6 px-6">
      <Reveal>
        <p className="font-display italic text-[18px] text-stone-600 mb-6">Today's Journey<span className="text-stone-400"> · 今日行程</span></p>
      </Reveal>
      <div className="relative">
        <svg className="absolute left-[22px] top-2 bottom-2 w-[2px]" preserveAspectRatio="none">
          <line x1="1" y1="0" x2="1" y2="100%" stroke="#8B7355" strokeWidth="1" strokeDasharray="3 5" />
        </svg>
        <div className="space-y-8">
          {meals.map((m, i) => {
            const data = c[m.key]
            const Ico = icons[i]
            return (
              <Reveal key={i} delay={i * 80}>
                <div
                  className="relative flex gap-5 cursor-pointer active:scale-[0.99] transition-transform duration-150"
                  onClick={() => onRecipe(data)}
                >
                  <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 flex-shrink-0"
                    style={{ backgroundColor: m.bg, borderColor: m.accent, color: m.accent }}>
                    <Ico size={20} />
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] tracking-[0.4em] uppercase text-stone-500">{m.time} · {m.label}</p>
                      {m.key === featuredMealKey && (
                        <span className="bg-[#E8650A]/15 text-[#E8650A] text-[8px] tracking-[0.3em] uppercase px-2 py-0.5 rounded-full font-semibold border border-[#E8650A]/30">Featured</span>
                      )}
                    </div>
                    <h3 className="font-display text-[26px] font-bold text-stone-900 leading-tight">{data.en}</h3>
                    <p className="text-stone-500 text-sm">{data.cn}</p>
                    <div className="mt-3 flex gap-2 flex-wrap">
                      <span className="text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full" style={{ backgroundColor: m.accent + '22', color: m.accent }}>{data.kcal} kcal</span>
                      <span className="text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full bg-stone-200 text-stone-700">{data.time}</span>
                      <span className="text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full bg-stone-200 text-stone-700">{data.taste}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}