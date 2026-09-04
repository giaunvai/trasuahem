import './lucky-wheel.css'
import './fonts.js'
import menuLogo from './assets/branding/logo.png'
import hemLogo from './assets/branding/hem-logo.png'
import { initAnalytics, track, trackLinkClicks } from './analytics.js'

const baseUrl = import.meta.env.BASE_URL
const fallback = { active: false, title: 'Vòng quay may mắn', description: 'Hẻm đang cập nhật chương trình.', prizes: [] }
const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
const text = (value = '') => escapeHtml(value)
const parseCurrency = (value) => Number(String(value || '').replace(/\D/g, ''))
const formatCurrency = (value) => value ? `${new Intl.NumberFormat('vi-VN').format(value)}đ` : ''
const formatDate = (date) => new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
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
const conicGradient = (prizes) => {
  const slice = 360 / prizes.length
  return prizes.map((prize, index) => `${prize.color || '#f5c84c'} ${index * slice}deg ${(index + 1) * slice}deg`).join(',')
}
const prizeAngle = (prizes, prize) => {
  const index = prizes.findIndex((item) => item.id === prize.id)
  return index < 0 ? 0 : index * (360 / prizes.length) + (360 / prizes.length) / 2
}
const normalizedAngle = (angle) => (angle % 360 + 360) % 360
const SPIN_RECORDS_KEY = 'hem-lucky-wheel-records'
const DAY_IN_MS = 24 * 60 * 60 * 1000
const RECORD_LIFETIME = 10 * DAY_IN_MS
const readSpinRecords = () => {
  try {
    const records = JSON.parse(localStorage.getItem(SPIN_RECORDS_KEY) || '[]')
    const activeRecords = Array.isArray(records) ? records.filter((record) => Date.now() - Number(record.wonAt) < RECORD_LIFETIME) : []
    if (activeRecords.length !== records.length) localStorage.setItem(SPIN_RECORDS_KEY, JSON.stringify(activeRecords))
    return activeRecords
  } catch {
    return []
  }
}
const saveSpinRecord = (record) => {
  const records = readSpinRecords()
  records.push(record)
  localStorage.setItem(SPIN_RECORDS_KEY, JSON.stringify(records))
}

const [config, site] = await Promise.all([
  fetch(`${baseUrl}content/lucky-wheel.json`).then((response) => response.ok ? response.json() : fallback).catch(() => fallback),
  fetch(`${baseUrl}content/site.json`).then((response) => response.ok ? response.json() : {}).catch(() => ({})),
])

initAnalytics(site.analytics)
trackLinkClicks('lucky_wheel_cta_click')

const app = document.querySelector('#lucky-wheel-app')
const prizes = (config.prizes || []).filter((prize) => Number(prize.weight) > 0)

if (!config.active || prizes.length < 2) {
  app.innerHTML = `<main class="wheel-inactive"><div><h1>${text(config.title)}</h1><p>${text(config.description || 'Chương trình đang được cập nhật.')}</p><a class="redeem-button" href="${escapeHtml(baseUrl)}">Về trang chủ</a></div></main>`
} else {
  const labels = prizes.map((prize, index) => {
    const angle = index * (360 / prizes.length) + (360 / prizes.length) / 2
    return `<span class="wheel-label" style="--angle:${angle}deg;--label-upright:${-angle}deg;--text:${text(prize.textColor || '#172324')}">${text(prize.label)}</span>`
  }).join('')
  const confetti = Array.from({ length: 32 }, (_, index) => `<i style="--i:${index};--x:${(index % 8) - 3.5};--y:${Math.floor(index / 8) - 1.5}"></i>`).join('')

  app.innerHTML = `
    <main class="wheel-page">
      <header class="wheel-header"><a class="wheel-brand" href="${escapeHtml(baseUrl)}" aria-label="Về trang chủ Hẻm dessert"><img src="${menuLogo}" alt="Hẻm dessert"></a><a class="wheel-home" href="${escapeHtml(baseUrl)}">Trang chủ</a></header>
      <section class="wheel-stage">
        <div class="wheel-board" aria-live="polite"><div class="wheel-pointer" aria-hidden="true"></div><div class="wheel" style="--wheel-gradient:conic-gradient(${conicGradient(prizes)})">${labels}</div><div class="wheel-center" aria-hidden="true"><img src="${hemLogo}" alt=""></div></div>
        <div class="wheel-copy">
          <p class="wheel-eyebrow">${text(config.eyebrow || 'Hẻm dessert')}</p><h1>${text(config.title)}</h1><p>${text(config.description)}</p>
          <div class="spin-verification">
            <label>Mã hóa đơn<span class="invoice-input"><b aria-hidden="true">T</b><input class="invoice-code" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" maxlength="5" placeholder="12345" aria-label="5 số cuối mã hóa đơn" aria-describedby="spin-verification-message"></span></label>
            <label>Giá trị đơn<input class="invoice-amount" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" aria-describedby="spin-verification-message"></label>
          </div>
          <p id="spin-verification-message" class="spin-verification-message" aria-live="polite">Áp dụng cho đơn mang đi có giá trị từ 60.000đ.</p>
          <button class="spin-button" type="button" disabled>${text(config.buttonLabel || 'Quay ngay')}</button>
          <p class="wheel-cooldown" aria-live="polite">Sẵn sàng cho lượt quay tiếp theo.</p>
          <button class="view-last-result" type="button" hidden>Danh sách giải đã trúng</button>
          ${config.terms?.length ? `<ul class="wheel-terms">${config.terms.map((term) => `<li>${text(term)}</li>`).join('')}</ul>` : ''}
        </div>
      </section>
      <footer class="wheel-footer"><span>Hẻm dessert</span><a href="${escapeHtml(baseUrl)}promotion.html">Xem ưu đãi</a></footer>
      <section class="result-modal" role="dialog" aria-modal="true" aria-labelledby="result-title" hidden><div class="confetti" aria-hidden="true">${confetti}</div><div class="result-card"><span>${text(config.resultTitle || 'Ưu đãi tặng bạn')}</span><h2 id="result-title"></h2><p class="result-detail"></p><p class="result-notice"></p><div class="result-redemption"><div class="result-summary" hidden><p>Mã đơn <strong class="result-invoice"></strong></p><p>Trúng ngày <strong class="result-won-date"></strong></p><p>Hạn dùng <strong class="result-expiry-date"></strong></p></div><label class="result-phone-label">Số điện thoại khách<input class="result-phone" type="tel" inputmode="numeric" autocomplete="tel" maxlength="10" placeholder="0xxxxxxxxx" aria-describedby="result-phone-message"></label><p id="result-phone-message" class="result-phone-message" aria-live="polite"></p></div><p class="result-capture">${text(config.captureInstruction || 'Nhân viên Hẻm vui lòng chụp lại kết quả để xác nhận phần quà nhé.')}</p><button class="reset-button" type="button" hidden>${text(config.resetLabel || 'Đã chụp kết quả')}</button></div></section>
      <section class="history-modal" role="dialog" aria-modal="true" aria-labelledby="history-title" hidden><div class="history-card"><div class="history-heading"><h2 id="history-title">Giải đã trúng</h2><button class="history-close" type="button" aria-label="Đóng danh sách">×</button></div><div class="history-list"></div><button class="clear-history" type="button">Xóa lịch sử</button></div></section>
      <section class="pin-modal" role="dialog" aria-modal="true" aria-labelledby="pin-title" hidden><div class="pin-card"><h2 id="pin-title">Xóa lịch sử</h2><p>Nhập mã PIN để xác nhận.</p><input class="pin-input" type="password" inputmode="numeric" autocomplete="off" maxlength="6" aria-label="Mã PIN"><p class="pin-message" aria-live="polite"></p><div><button class="pin-cancel" type="button">Hủy</button><button class="pin-confirm" type="button">Xóa</button></div></div></section>
    </main>`

  const wheel = app.querySelector('.wheel')
  const spinButton = app.querySelector('.spin-button')
  const invoiceCode = app.querySelector('.invoice-code')
  const invoiceAmount = app.querySelector('.invoice-amount')
  const verificationMessage = app.querySelector('.spin-verification-message')
  const viewLastResultButton = app.querySelector('.view-last-result')
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
  const resultTitle = resultModal.querySelector('h2')
  const resultDetail = resultModal.querySelector('.result-detail')
  const resultNotice = resultModal.querySelector('.result-notice')
  const resultRedemption = resultModal.querySelector('.result-redemption')
  const resultSummary = resultModal.querySelector('.result-summary')
  const resultInvoice = resultModal.querySelector('.result-invoice')
  const resultWonDate = resultModal.querySelector('.result-won-date')
  const resultExpiryDate = resultModal.querySelector('.result-expiry-date')
  const resultPhone = resultModal.querySelector('.result-phone')
  const resultPhoneMessage = resultModal.querySelector('.result-phone-message')
  const resetButton = app.querySelector('.reset-button')
  let rotation = 0
  let pendingWin
  let showingSavedResult = false

  const updateLastResultButton = () => { viewLastResultButton.hidden = !readSpinRecords().length }
  const showSavedResult = (record) => {
    const prize = prizes.find((item) => item.id === record.prizeId)
    if (!prize) return
    showingSavedResult = true
    resultTitle.textContent = prize.label
    resultDetail.textContent = prize.detail
    resultNotice.textContent = prize.notice
    resultSummary.hidden = prize.redemption !== 'next-order'
    if (!resultSummary.hidden) {
      resultInvoice.textContent = record.invoice
      resultWonDate.textContent = formatDate(new Date(record.wonAt))
      resultExpiryDate.textContent = formatDate(new Date(record.expiresAt))
    }
    resultPhone.value = record.phone
    resultPhone.disabled = true
    resultPhoneMessage.textContent = 'Kết quả đã được lưu để đối chiếu.'
    resetButton.hidden = false
    resetButton.textContent = 'Đóng'
    resultModal.hidden = false
    resetButton.focus()
  }
  const renderHistory = () => {
    const records = readSpinRecords().slice().reverse()
    historyList.innerHTML = records.map((record) => `<button class="history-item" type="button" data-won-at="${record.wonAt}"><strong>${text(record.prizeLabel)}</strong><span>Mã đơn: ${text(record.invoice)}</span><span>SĐT: ${text(record.phone || 'Chưa có')}</span></button>`).join('')
    historyList.querySelectorAll('.history-item').forEach((button) => button.addEventListener('click', () => {
      const record = records.find((item) => String(item.wonAt) === button.dataset.wonAt)
      if (!record) return
      historyModal.hidden = true
      showSavedResult(record)
    }))
  }

  const getEligibleEntry = () => {
    const invoice = `T${invoiceCode.value}`
    const amount = parseCurrency(invoiceAmount.value)
    if (!/^T[0-9]{5}$/.test(invoice) || amount < 60000) return { valid: false }
    if (readSpinRecords().some((record) => record.invoice === invoice)) return { valid: false, message: 'Mã hóa đơn này đã sử dụng lượt quay hôm nay.' }
    return { valid: true, invoice, amount }
  }
  const updateSpinAvailability = () => {
    if (wheel.classList.contains('is-spinning')) return
    const entry = getEligibleEntry()
    spinButton.disabled = !entry.valid
    spinButton.classList.toggle('is-ready', entry.valid)
    spinButton.textContent = config.buttonLabel || 'Quay ngay'
    verificationMessage.textContent = entry.valid ? 'Đủ điều kiện, bấm Quay ngay để nhận quà may mắn.' : entry.message || 'Áp dụng cho đơn mang đi có giá trị từ 60.000đ.'
  }
  const updateInvoiceCode = () => { invoiceCode.value = invoiceCode.value.replace(/\D/g, '').slice(0, 5); updateSpinAvailability() }
  const updateInvoiceAmount = () => { invoiceAmount.value = formatCurrency(parseCurrency(invoiceAmount.value)); updateSpinAvailability() }
  const updateResultPhone = () => {
    resultPhone.value = resultPhone.value.replace(/\D/g, '').slice(0, 10)
    const valid = /^0\d{9}$/.test(resultPhone.value)
    resetButton.hidden = !valid
    resultPhoneMessage.textContent = valid ? 'Đã lưu số điện thoại khách. Nhân viên có thể chụp lại kết quả.' : 'Nhập đủ 10 số điện thoại để lưu kết quả.'
  }
  invoiceCode.addEventListener('input', updateInvoiceCode)
  invoiceAmount.addEventListener('input', updateInvoiceAmount)
  resultPhone.addEventListener('input', updateResultPhone)
  viewLastResultButton.addEventListener('click', () => { renderHistory(); historyModal.hidden = false; historyCloseButton.focus() })
  historyCloseButton.addEventListener('click', () => { historyModal.hidden = true; viewLastResultButton.focus() })
  clearHistoryButton.addEventListener('click', () => { pinInput.value = ''; pinMessage.textContent = ''; pinModal.hidden = false; pinInput.focus() })
  pinCancelButton.addEventListener('click', () => { pinModal.hidden = true; clearHistoryButton.focus() })
  pinConfirmButton.addEventListener('click', () => {
    if (pinInput.value !== '968976') { pinMessage.textContent = 'Mã PIN chưa đúng.'; pinInput.focus(); return }
    localStorage.removeItem(SPIN_RECORDS_KEY)
    pinModal.hidden = true
    historyModal.hidden = true
    updateLastResultButton()
    viewLastResultButton.focus()
  })
  updateSpinAvailability()
  updateLastResultButton()

  spinButton.addEventListener('click', () => {
    const entry = getEligibleEntry()
    if (!entry.valid) return
    const prize = pickPrize(prizes)
    const targetAngle = prizeAngle(prizes, prize)
    const extraTurns = 5 + Math.floor(randomUnit() * 3)
    const previousRotation = rotation
    rotation += extraTurns * 360 + normalizedAngle(-targetAngle - normalizedAngle(rotation))
    wheel.classList.add('is-spinning')
    wheel.style.setProperty('--wheel-from', `${previousRotation}deg`)
    wheel.style.setProperty('--wheel-rotation', `${rotation}deg`)
    spinButton.disabled = true
    invoiceCode.disabled = true
    invoiceAmount.disabled = true
    spinButton.textContent = config.spinningLabel || 'Đang quay...'
    resultModal.hidden = true
    track('lucky_wheel_spin', { prize_id: prize.id, prize_label: prize.label })
    window.setTimeout(() => {
      wheel.classList.remove('is-spinning')
      wheel.style.setProperty('--wheel-counter', `${rotation}deg`)
      resultTitle.textContent = prize.label
      resultDetail.textContent = prize.detail
      resultNotice.textContent = prize.notice
      showingSavedResult = false
      resultPhone.disabled = false
      resetButton.textContent = config.resetLabel || 'Đã chụp kết quả'
      const wonAt = new Date()
      const expiresAt = new Date(wonAt.getTime() + 7 * DAY_IN_MS)
      pendingWin = { invoice: entry.invoice, amount: entry.amount, prizeId: prize.id, prizeLabel: prize.label, wonAt: wonAt.getTime(), expiresAt: expiresAt.getTime() }
      resultSummary.hidden = prize.redemption !== 'next-order'
      if (!resultSummary.hidden) {
        resultInvoice.textContent = entry.invoice
        resultWonDate.textContent = formatDate(wonAt)
        resultExpiryDate.textContent = formatDate(expiresAt)
        resultPhone.value = ''
        updateResultPhone()
      }
      resultPhone.value = ''
      updateResultPhone()
      invoiceCode.disabled = false
      invoiceAmount.disabled = false
      invoiceCode.value = ''
      invoiceAmount.value = ''
      updateSpinAvailability()
      resultModal.hidden = false
      resultPhone.focus()
      track('lucky_wheel_result', { prize_id: prize.id, prize_label: prize.label })
    }, 5300)
  })
  resultModal.addEventListener('click', (event) => { event.stopPropagation() })
  historyModal.addEventListener('click', (event) => { if (event.target === historyModal) { historyModal.hidden = true; viewLastResultButton.focus() } })
  pinModal.addEventListener('click', (event) => { if (event.target === pinModal) { pinModal.hidden = true; clearHistoryButton.focus() } })
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !resultModal.hidden) event.preventDefault() })
  resetButton.addEventListener('click', () => {
    if (pendingWin && !showingSavedResult) saveSpinRecord({ ...pendingWin, phone: resultPhone.value })
    pendingWin = null
    showingSavedResult = false
    resultModal.hidden = true
    updateLastResultButton()
    spinButton.focus()
  })
  track('lucky_wheel_view', { page_location: window.location.href })
}
