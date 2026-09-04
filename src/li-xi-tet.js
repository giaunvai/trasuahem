import './lucky-wheel.css'
import './fonts.js'
import menuLogo from './assets/branding/logo.png'
import hemLogo from './assets/branding/hem-logo.png'
import { initAnalytics, track } from './analytics.js'

const baseUrl = import.meta.env.BASE_URL
const fallback = { active: false, title: 'Lì xì Tết', description: 'Hẻm đang cập nhật chương trình.', prizes: [] }
const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
const text = (value = '') => escapeHtml(value)
const formatDate = (date) => new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date)
const formatRemainingTime = (milliseconds) => {
  const seconds = Math.ceil(milliseconds / 1000)
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
}
const randomUnit = () => {
  const array = new Uint32Array(1)
  window.crypto.getRandomValues(array)
  return array[0] / 4294967296
}
const pickPrize = (prizes) => {
  const total = prizes.reduce((sum, prize) => sum + Number(prize.weight || 0), 0)
  let cursor = randomUnit() * total
  for (const prize of prizes) {
    cursor -= Number(prize.weight || 0)
    if (cursor <= 0) return prize
  }
  return prizes.at(-1)
}
const normalizedAngle = (angle) => (angle % 360 + 360) % 360
const HISTORY_KEY = 'hem-li-xi-tet-records'
const NEXT_SPIN_KEY = 'hem-li-xi-tet-next-spin'
const RECORD_LIFETIME = 7 * 24 * 60 * 60 * 1000
const readRecords = () => {
  try {
    const records = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
    const activeRecords = Array.isArray(records) ? records.filter((record) => Date.now() - Number(record.wonAt) < RECORD_LIFETIME) : []
    if (activeRecords.length !== records.length) localStorage.setItem(HISTORY_KEY, JSON.stringify(activeRecords))
    return activeRecords
  } catch {
    return []
  }
}
const saveRecord = (record) => localStorage.setItem(HISTORY_KEY, JSON.stringify([...readRecords(), record]))

const [config, site] = await Promise.all([
  fetch(`${baseUrl}content/li-xi-tet.json`).then((response) => response.ok ? response.json() : fallback).catch(() => fallback),
  fetch(`${baseUrl}content/site.json`).then((response) => response.ok ? response.json() : {}).catch(() => ({})),
])

initAnalytics(site.analytics)
const app = document.querySelector('#li-xi-tet-app')
const prizes = (config.prizes || []).filter((prize) => Number(prize.weight) > 0)

if (!config.active || prizes.length < 2) {
  app.innerHTML = `<main class="wheel-inactive"><div><h1>${text(config.title)}</h1><p>${text(config.description)}</p><a class="redeem-button" href="${escapeHtml(baseUrl)}">Về trang chủ</a></div></main>`
} else {
  const slice = 360 / prizes.length
  const labels = prizes.map((prize, index) => {
    const angle = index * slice + slice / 2
    return `<span class="wheel-label" style="--angle:${angle}deg;--label-upright:${-angle}deg;--text:${text(prize.textColor || '#172324')}">${text(prize.label)}</span>`
  }).join('')
  const gradient = prizes.map((prize, index) => `${prize.color} ${index * slice}deg ${(index + 1) * slice}deg`).join(',')
  const confetti = Array.from({ length: 32 }, (_, index) => `<i style="--i:${index};--x:${(index % 8) - 3.5};--y:${Math.floor(index / 8) - 1.5}"></i>`).join('')

  app.innerHTML = `
    <main class="wheel-page li-xi-page">
      <header class="wheel-header"><a class="wheel-brand" href="${escapeHtml(baseUrl)}" aria-label="Về trang chủ Hẻm dessert"><img src="${menuLogo}" alt="Hẻm dessert"></a><a class="wheel-home" href="${escapeHtml(baseUrl)}">Trang chủ</a></header>
      <section class="wheel-stage">
        <div class="wheel-board" aria-live="polite"><div class="wheel-pointer" aria-hidden="true"></div><div class="wheel" style="--wheel-gradient:conic-gradient(${gradient})">${labels}</div><div class="wheel-center" aria-hidden="true"><img src="${hemLogo}" alt=""></div></div>
        <div class="wheel-copy">
          <p class="wheel-eyebrow">${text(config.eyebrow || 'Hẻm dessert')}</p><h1>${text(config.title)}</h1><p>${text(config.description)}</p>
          <div class="spin-verification li-xi-verification"><label>Tên người quay<input class="spinner-name" type="text" autocomplete="name" maxlength="60" aria-describedby="spin-verification-message"></label></div>
          <p id="spin-verification-message" class="spin-verification-message" aria-live="polite">Nhập tên để mở lượt quay.</p>
          <button class="spin-button" type="button" disabled>${text(config.buttonLabel || 'Quay lì xì')}</button>
          <p class="wheel-cooldown" aria-live="polite"></p>
          <button class="view-last-result" type="button" hidden>Danh sách lì xì đã trúng</button>
          ${config.terms?.length ? `<ul class="wheel-terms">${config.terms.map((term) => `<li>${text(term)}</li>`).join('')}</ul>` : ''}
        </div>
      </section>
      <footer class="wheel-footer"><span>Hẻm dessert</span><a href="${escapeHtml(baseUrl)}promotion.html">Xem ưu đãi</a></footer>
      <section class="result-modal" role="dialog" aria-modal="true" aria-labelledby="result-title" hidden><div class="confetti" aria-hidden="true">${confetti}</div><div class="result-card"><span>${text(config.resultTitle || 'Lộc Tết tặng bạn')}</span><h2 id="result-title"></h2><p class="result-detail"></p><p class="result-notice"></p>${config.captureInstruction ? `<p class="result-capture">${text(config.captureInstruction)}</p>` : ''}<button class="reset-button" type="button">Quay tiếp</button></div></section>
      <section class="history-modal" role="dialog" aria-modal="true" aria-labelledby="history-title" hidden><div class="history-card"><div class="history-heading"><h2 id="history-title">Lì xì đã trúng</h2><button class="history-close" type="button" aria-label="Đóng danh sách">×</button></div><div class="history-list"></div><button class="clear-history" type="button">Xóa lịch sử</button></div></section>
      <section class="pin-modal" role="dialog" aria-modal="true" aria-labelledby="pin-title" hidden><div class="pin-card"><h2 id="pin-title">Xóa lịch sử</h2><p>Nhập mã PIN để xác nhận.</p><input class="pin-input" type="password" inputmode="numeric" autocomplete="off" maxlength="6" aria-label="Mã PIN"><p class="pin-message" aria-live="polite"></p><div><button class="pin-cancel" type="button">Hủy</button><button class="pin-confirm" type="button">Xóa</button></div></div></section>
    </main>`

  const wheel = app.querySelector('.wheel')
  const nameInput = app.querySelector('.spinner-name')
  const spinButton = app.querySelector('.spin-button')
  const verificationMessage = app.querySelector('.spin-verification-message')
  const cooldownMessage = app.querySelector('.wheel-cooldown')
  const historyButton = app.querySelector('.view-last-result')
  const historyModal = app.querySelector('.history-modal')
  const historyList = app.querySelector('.history-list')
  const historyCloseButton = app.querySelector('.history-close')
  const clearHistoryButton = app.querySelector('.clear-history')
  const pinModal = app.querySelector('.pin-modal')
  const pinInput = app.querySelector('.pin-input')
  const pinMessage = app.querySelector('.pin-message')
  const pinCancelButton = app.querySelector('.pin-cancel')
  const pinConfirmButton = app.querySelector('.pin-confirm')
  const resultModal = app.querySelector('.result-modal')
  const resultTitle = app.querySelector('#result-title')
  const resultDetail = app.querySelector('.result-detail')
  const resultNotice = app.querySelector('.result-notice')
  const resetButton = app.querySelector('.reset-button')
  let rotation = 0

  const availablePrizes = () => {
    const records = readRecords()
    const wonByPool = records.reduce((counts, record) => ({ ...counts, [record.poolId]: (counts[record.poolId] || 0) + 1 }), {})
    return prizes.filter((prize) => records.length >= (prize.minSpin || 0) && (wonByPool[prize.poolId] || 0) < prize.quantity)
  }

  const updateAvailability = () => {
    if (wheel.classList.contains('is-spinning')) return
    const remaining = Number(localStorage.getItem(NEXT_SPIN_KEY) || 0) - Date.now()
    const valid = nameInput.value.trim().length >= 2 && availablePrizes().length > 0
    spinButton.disabled = !valid || remaining > 0
    spinButton.classList.toggle('is-ready', valid && remaining <= 0)
    verificationMessage.textContent = availablePrizes().length === 0 ? 'Lì xì đã được trao hết.' : valid ? 'Đủ điều kiện, bấm Quay lì xì để nhận lộc đầu năm.' : 'Nhập tên để mở lượt quay.'
    cooldownMessage.textContent = remaining > 0 ? `Lượt quay tiếp theo sau ${formatRemainingTime(remaining)}` : ''
  }
  const renderHistory = () => {
    historyList.innerHTML = readRecords().slice().reverse().map((record) => `<article class="history-item"><strong>${text(record.prizeLabel)}</strong><span>Tên: ${text(record.name)}</span><span>${text(formatDate(new Date(record.wonAt)))}</span></article>`).join('')
  }
  nameInput.addEventListener('input', updateAvailability)
  historyButton.addEventListener('click', () => { renderHistory(); historyModal.hidden = false; historyCloseButton.focus() })
  historyCloseButton.addEventListener('click', () => { historyModal.hidden = true; historyButton.focus() })
  clearHistoryButton.addEventListener('click', () => { pinInput.value = ''; pinMessage.textContent = ''; pinModal.hidden = false; pinInput.focus() })
  pinCancelButton.addEventListener('click', () => { pinModal.hidden = true; clearHistoryButton.focus() })
  pinConfirmButton.addEventListener('click', () => {
    if (pinInput.value !== '968976') { pinMessage.textContent = 'Mã PIN chưa đúng.'; pinInput.focus(); return }
    localStorage.removeItem(HISTORY_KEY)
    localStorage.removeItem(NEXT_SPIN_KEY)
    pinModal.hidden = true
    historyModal.hidden = true
    historyButton.hidden = true
    updateAvailability()
    historyButton.focus()
  })
  updateAvailability()
  historyButton.hidden = !readRecords().length
  window.setInterval(updateAvailability, 1000)

  spinButton.addEventListener('click', () => {
    const name = nameInput.value.trim()
    const eligiblePrizes = availablePrizes()
    if (name.length < 2 || !eligiblePrizes.length || Number(localStorage.getItem(NEXT_SPIN_KEY) || 0) > Date.now()) return
    const prize = pickPrize(eligiblePrizes)
    const targetAngle = prizes.findIndex((item) => item.id === prize.id) * slice + slice / 2
    const previousRotation = rotation
    rotation += (5 + Math.floor(randomUnit() * 3)) * 360 + normalizedAngle(-targetAngle - normalizedAngle(rotation))
    wheel.classList.add('is-spinning')
    wheel.style.setProperty('--wheel-from', `${previousRotation}deg`)
    wheel.style.setProperty('--wheel-rotation', `${rotation}deg`)
    const cooldownMilliseconds = Math.max(60, Number(config.cooldownSeconds) || 60) * 1000
    localStorage.setItem(NEXT_SPIN_KEY, String(Date.now() + cooldownMilliseconds))
    cooldownMessage.textContent = `Lượt quay tiếp theo sau ${formatRemainingTime(cooldownMilliseconds)}`
    spinButton.disabled = true
    nameInput.disabled = true
    spinButton.textContent = config.spinningLabel || 'Đang quay...'
    track('li_xi_tet_spin', { prize_id: prize.id, prize_label: prize.label })
    window.setTimeout(() => {
      wheel.classList.remove('is-spinning')
      wheel.style.setProperty('--wheel-counter', `${rotation}deg`)
      resultTitle.textContent = prize.label
      resultDetail.textContent = prize.detail
      resultNotice.textContent = prize.notice
      saveRecord({ name, prizeId: prize.id, prizeLabel: prize.label, poolId: prize.poolId, wonAt: Date.now() })
      historyButton.hidden = false
      resultModal.hidden = false
      resetButton.focus()
      nameInput.disabled = false
      nameInput.value = ''
      spinButton.textContent = config.buttonLabel || 'Quay lì xì'
      updateAvailability()
      track('li_xi_tet_result', { prize_id: prize.id, prize_label: prize.label })
    }, 5300)
  })
  resultModal.addEventListener('click', (event) => { if (event.target === resultModal) { resultModal.hidden = true; spinButton.focus() } })
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !resultModal.hidden) { resultModal.hidden = true; spinButton.focus() } })
  historyModal.addEventListener('click', (event) => { if (event.target === historyModal) { historyModal.hidden = true; historyButton.focus() } })
  pinModal.addEventListener('click', (event) => { if (event.target === pinModal) { pinModal.hidden = true; clearHistoryButton.focus() } })
  resetButton.addEventListener('click', () => { resultModal.hidden = true; spinButton.focus() })
  track('li_xi_tet_view', { page_location: window.location.href, total_prize_count: config.totalPrizeCount })
}
