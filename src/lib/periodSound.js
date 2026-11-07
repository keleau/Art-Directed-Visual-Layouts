let audioCtx = null
const activeNodes = new Set()
const activeSources = new Set()

export function stopAllPeriodSounds() {
  try {
    activeSources.forEach((src) => {
      try { src.stop() } catch { /* already stopped */ }
      src.disconnect()
    })
    activeSources.clear()
    activeNodes.forEach((node) => node.disconnect())
    activeNodes.clear()
  } catch { /* noop */ }
}

function getAudioCtx() {
  try {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext
      audioCtx = new AC()
    }
    if (audioCtx.state === 'suspended') audioCtx.resume()
    return audioCtx
  } catch { return null }
}

export function ensureAudioReady() {
  const ctx = getAudioCtx()
  return Boolean(ctx)
}

function makePinkNoiseBuffer(ctx, seconds) {
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

function makeWhiteNoiseBuffer(ctx, seconds) {
  const len = Math.floor(ctx.sampleRate * seconds)
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  return buf
}

export function playPeriodSound(period) {
  stopAllPeriodSounds()
  const ctx = getAudioCtx()
  if (!ctx) return
  const now = ctx.currentTime
  const MAX_DURATION = 2.4

  const master = ctx.createGain()
  master.gain.setValueAtTime(0.5, now)
  master.gain.exponentialRampToValueAtTime(0.0001, now + MAX_DURATION)
  master.connect(ctx.destination)
  activeNodes.add(master)

  const trackNode = (node) => { activeNodes.add(node); return node }
  const trackSource = (src) => { activeSources.add(src); return src }

  if (period === 'morning') {
    const chirpPairs = [
      { start: 0.2, f1: 2100, f2: 2800, dur: 0.16 },
      { start: 0.65, f1: 2500, f2: 2000, dur: 0.12 },
      { start: 1.25, f1: 1800, f2: 2600, dur: 0.18 },
      { start: 1.85, f1: 2800, f2: 2300, dur: 0.14 },
    ]
    chirpPairs.forEach(({ start, f1, f2, dur }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(f1, now + start)
      osc.frequency.exponentialRampToValueAtTime(f2, now + start + dur)
      gain.gain.setValueAtTime(0.0001, now + start)
      gain.gain.exponentialRampToValueAtTime(0.55, now + start + 0.008)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur)
      trackNode(osc); trackNode(gain)
      osc.connect(gain); gain.connect(master)
      osc.start(now + start); osc.stop(now + Math.min(start + dur + 0.05, MAX_DURATION))
    })

    const amb = ctx.createBufferSource()
    amb.buffer = makePinkNoiseBuffer(ctx, MAX_DURATION); trackSource(amb)
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'; filter.frequency.value = 350
    const gain = ctx.createGain(); gain.gain.value = 0.18
    trackNode(filter); trackNode(gain)
    amb.connect(filter); filter.connect(gain); gain.connect(master)
    amb.start(now); amb.stop(now + MAX_DURATION)
  } else if (period === 'afternoon') {
    const amb = ctx.createBufferSource()
    amb.buffer = makePinkNoiseBuffer(ctx, MAX_DURATION); trackSource(amb)
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'; filter.frequency.value = 420; filter.Q.value = 0.5
    const gain = ctx.createGain(); gain.gain.value = 0.22
    trackNode(filter); trackNode(gain)
    amb.connect(filter); filter.connect(gain); gain.connect(master)
    amb.start(now); amb.stop(now + MAX_DURATION)

    const hum = ctx.createOscillator(); trackNode(hum)
    hum.type = 'sine'; hum.frequency.value = 140
    const humGain = ctx.createGain(); humGain.gain.value = 0.12; trackNode(humGain)
    hum.connect(humGain); humGain.connect(master)
    hum.start(now); hum.stop(now + MAX_DURATION)

    ;[0.5, 1.5, 2.2].forEach((t) => {
      const osc = ctx.createOscillator(); trackNode(osc)
      const gainNode = ctx.createGain(); trackNode(gainNode)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(1400 + Math.random() * 300, now + t)
      osc.frequency.exponentialRampToValueAtTime(700, now + t + 0.06)
      gainNode.gain.setValueAtTime(0.0001, now + t)
      gainNode.gain.exponentialRampToValueAtTime(0.3, now + t + 0.003)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.12)
      osc.connect(gainNode); gainNode.connect(master)
      osc.start(now + t); osc.stop(now + Math.min(t + 0.15, MAX_DURATION))
    })
  } else if (period === 'evening') {
    const chimeNotes = [523, 659, 784, 659, 523, 440]
    chimeNotes.forEach((freq, i) => {
      const startAt = now + 0.15 + i * 0.35 + Math.random() * 0.1
      const osc = ctx.createOscillator(); trackNode(osc)
      const gain = ctx.createGain(); trackNode(gain)
      osc.type = 'sine'; osc.frequency.value = freq
      gain.gain.setValueAtTime(0.0001, startAt)
      gain.gain.linearRampToValueAtTime(0.4, startAt + 0.015)
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 2.0)
      osc.connect(gain); gain.connect(master)
      osc.start(startAt); osc.stop(Math.min(startAt + 2.2, now + MAX_DURATION))

      const osc2 = ctx.createOscillator(); trackNode(osc2)
      const gain2 = ctx.createGain(); trackNode(gain2)
      osc2.type = 'triangle'; osc2.frequency.value = freq * 2
      gain2.gain.setValueAtTime(0.0001, startAt)
      gain2.gain.linearRampToValueAtTime(0.12, startAt + 0.01)
      gain2.gain.exponentialRampToValueAtTime(0.0001, startAt + 1.2)
      osc2.connect(gain2); gain2.connect(master)
      osc2.start(startAt); osc2.stop(Math.min(startAt + 1.4, now + MAX_DURATION))
    })

    const wind = ctx.createBufferSource()
    wind.buffer = makeWhiteNoiseBuffer(ctx, MAX_DURATION); trackSource(wind)
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'; filter.frequency.value = 250
    const gain = ctx.createGain(); gain.gain.value = 0.1
    trackNode(filter); trackNode(gain)
    wind.connect(filter); filter.connect(gain); gain.connect(master)
    wind.start(now); wind.stop(now + MAX_DURATION)
  } else {
    const padFreqs = [523.25, 659.25, 783.99]
    const padGain = ctx.createGain(); trackNode(padGain)
    padGain.gain.setValueAtTime(0.0001, now)
    padGain.gain.exponentialRampToValueAtTime(0.16, now + 0.5)
    padGain.gain.setValueAtTime(0.16, now + 1.8)
    padGain.gain.exponentialRampToValueAtTime(0.0001, now + MAX_DURATION)
    padGain.connect(master)
    padFreqs.forEach((freq) => {
      const osc = ctx.createOscillator(); trackNode(osc)
      osc.type = 'sine'; osc.frequency.value = freq
      osc.connect(padGain)
      osc.start(now); osc.stop(now + MAX_DURATION)
    })

    ;[1047, 1319, 1568, 1319, 1047].forEach((freq, i) => {
      const startAt = now + 0.3 + i * 0.45 + Math.random() * 0.1
      const osc = ctx.createOscillator(); trackNode(osc)
      const gain = ctx.createGain(); trackNode(gain)
      osc.type = 'sine'; osc.frequency.value = freq
      gain.gain.setValueAtTime(0.0001, startAt)
      gain.gain.exponentialRampToValueAtTime(0.35, startAt + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 1.5)
      osc.connect(gain); gain.connect(master)
      osc.start(startAt); osc.stop(Math.min(startAt + 1.8, now + MAX_DURATION))
    })

    const wind = ctx.createBufferSource()
    wind.buffer = makeWhiteNoiseBuffer(ctx, MAX_DURATION); trackSource(wind)
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'; filter.frequency.value = 280
    const gain = ctx.createGain(); gain.gain.value = 0.08
    trackNode(filter); trackNode(gain)
    wind.connect(filter); filter.connect(gain); gain.connect(master)
    wind.start(now); wind.stop(now + MAX_DURATION)

    ;[{ start: 0.5, count: 2, interval: 0.06 }, { start: 1.4, count: 2, interval: 0.055 }].forEach(({ start, count, interval }) => {
      for (let j = 0; j < count; j++) {
        const chirpStart = now + start + j * interval
        const osc = ctx.createOscillator(); trackNode(osc)
        const gainNode = ctx.createGain(); trackNode(gainNode)
        osc.type = 'sine'
        osc.frequency.setValueAtTime(4800 + Math.random() * 150, chirpStart)
        gainNode.gain.setValueAtTime(0.0001, chirpStart)
        gainNode.gain.exponentialRampToValueAtTime(0.35, chirpStart + 0.002)
        gainNode.gain.exponentialRampToValueAtTime(0.0001, chirpStart + 0.03)
        osc.connect(gainNode); gainNode.connect(master)
        osc.start(chirpStart); osc.stop(chirpStart + 0.05)
      }
    })
  }
}
