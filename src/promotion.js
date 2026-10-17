import './birthday.css'
import './fonts.js'
import { ArrowRight } from 'lucide'
import menuLogo from './assets/branding/logo.png'
import { getCampaignSchedule, getCampaignState, mountCountdown } from './countdown.js'
import { initAnalytics, track, trackLinkClicks } from './analytics.js'

// Chỉ nhận ảnh WebP đã nén; URL chỉ là chuỗi nên trình duyệt chỉ tải ảnh thực sự hiển thị
const campaignImages = import.meta.glob('./assets/*.webp', { eager: true, query: '?url', import: 'default' })

const baseUrl = import.meta.env.BASE_URL
const dealBanner = `${baseUrl}images/promotion/GOM_DON_SIEU_TIEC.webp`
const assetUrl = (path) => path.startsWith('/') ? `${baseUrl}${path.slice(1)}` : path
const campaignImageUrl = (name) => campaignImages[`./assets/${name}`] || ''
const updateSocialImage = () => document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').forEach((meta) => { meta.content = new URL(dealBanner, window.location.href).href })
const icon = (item, size = 20) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${item.map(([tag, attributes]) => `<${tag} ${Object.entries(attributes).map(([key, value]) => `${key}="${value}"`).join(' ')} />`).join('')}</svg>`
const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
const text = (value = '') => escapeHtml(value)
const withBreaks = (value = '') => text(value).replaceAll('\n', '<br>')
const app = document.querySelector('#birthday-app')
const safeUrl = (value, fallback = '#') => {
  try {
    const url = new URL(String(value || ''), window.location.origin)
    if (url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'tel:' || url.protocol === 'mailto:') return escapeHtml(url.href)
  } catch {}
  return fallback
}

const siteContent = await fetch(`${baseUrl}content/site.json`).then((response) => response.ok ? response.json() : {}).catch(() => ({}))
initAnalytics(siteContent.analytics)
trackLinkClicks('promotion_cta_click')

const promotionFiles = ['birthday', 'tet', 'khai-truong', 'deal']
const formatDate = (date) => date ? new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date) : 'Đang cập nhật'
const campaignTarget = (item, now = new Date()) => {
  const schedule = getCampaignSchedule(item, now)
  const state = getCampaignState(item, now)
  const target = item.displayMode === 'on' && state.state === 'upcoming' ? schedule?.eventStart : state.target
  return { schedule, state, date: target || schedule?.eventStart || new Date(8640000000000000) }
}

const campaignCard = (item, file, featured = false) => {
  const recurring = item.promotionKind === 'recurring'
  const { state, date, schedule } = recurring ? { state: { state: 'live' }, date: null, schedule: null } : campaignTarget(item)
  const stateLabel = recurring ? 'Đang áp dụng' : state.state === 'live' ? 'Đang diễn ra' : state.state === 'notice' ? 'Sắp bắt đầu' : state.state === 'ended' ? 'Đã kết thúc' : 'Sắp diễn ra'
  const image = item.posterImage ? (item.posterImage.startsWith('/') ? assetUrl(item.posterImage) : campaignImageUrl(item.posterImage)) : item.heroImage?.startsWith('/images/') ? assetUrl(item.heroImage) : campaignImageUrl(item.productImages?.[0]?.file)
  const summaryPoints = item.summaryPoints || []
  const summaryGroups = item.summaryGroups || []
  const countdown = recurring ? '' : `<div class="promotion-card-countdown"><span>${state.state === 'live' ? 'Kết thúc sau' : state.state === 'notice' ? 'Bắt đầu sau' : state.state === 'ended' ? 'Chương trình đã kết thúc' : 'Chương trình diễn ra sau'}</span><strong data-promotion-countdown>-- ngày</strong></div>`
  const dateLabel = state.state === 'live' ? 'Đang diễn ra' : state.state === 'notice' ? `${item.campaignType === 'tet' ? 'Kết thúc trước ngày' : 'Bắt đầu'} ${formatDate(schedule?.eventStart)}` : state.state === 'ended' ? 'Đã kết thúc' : `Mở thông tin ${formatDate(date)}`
  return `<article class="promotion-card${featured ? ' promotion-card-featured' : ''}${recurring ? ' promotion-card-poster' : ''} campaign-theme-${text(item.theme || 'thuong-hieu')}" data-promotion-campaign="${text(file)}"><div class="promotion-card-image"><img src="${escapeHtml(image)}" alt="${text(item.heroImageAlt || item.campaignName)}" loading="${recurring ? 'eager' : 'lazy'}" decoding="async">${recurring ? '' : `<span class="promotion-card-state">${stateLabel}</span>`}</div><div class="promotion-card-body"><p class="section-label">${text(item.badge || item.campaignName)}</p><h3>${withBreaks(item.title || item.campaignName)}</h3><p>${text(item.description || item.offerDescription)}</p>${summaryGroups.length ? summaryGroups.map((group) => `<section class="promotion-card-group"><h4>${text(group.title)}</h4><ul>${(group.items || []).map((point) => `<li>${text(point)}</li>`).join('')}</ul></section>`).join('') : summaryPoints.length ? `<ul class="promotion-card-points">${summaryPoints.map((point) => `<li>${text(point)}</li>`).join('')}</ul>` : ''}${countdown}<div class="promotion-card-meta"><span>${text(item.offerValue || 'Ưu đãi đặc biệt')}</span>${recurring ? '' : `<time${date ? ` datetime="${date.toISOString()}"` : ''}>${dateLabel}</time>`}</div><a class="birthday-cta birthday-cta-primary" href="${safeUrl(item.orderUrl)}" target="_blank" rel="noopener noreferrer">Đặt đơn ngay ${icon(ArrowRight, 18)}</a></div></article>`
}

const renderPromotionDirectory = async () => {
  const loaded = await Promise.all(promotionFiles.map(async (file) => {
    const item = await fetch(`${baseUrl}content/${file}.json`).then((response) => response.ok ? response.json() : null).catch(() => null)
    return item ? { item, file } : null
  }))
  const campaigns = loaded.filter(Boolean)
  const now = new Date()
  const available = campaigns.filter(({ item, file }) => {
    if (item.active === false || item.displayMode === 'off' || item.promotionKind === 'recurring') return false
    if (item.displayMode === 'on') return true
    if (file === 'khai-truong' && !item.eventDate) return false
    const schedule = getCampaignSchedule(item, now)
    return schedule && now >= schedule.noticeStart && now < new Date(schedule.eventEnd.getTime() + 7 * 86400000)
  })
  const recurring = campaigns.filter(({ item }) => item.active !== false && item.displayMode !== 'off' && item.promotionKind === 'recurring')
  const timed = available.sort((a, b) => campaignTarget(a.item).date - campaignTarget(b.item).date)
  document.body.classList.add('promotion-directory-page')
  updateSocialImage()
  app.innerHTML = `<header class="birthday-header"><a class="birthday-brand" href="${escapeHtml(baseUrl)}" aria-label="Về trang chủ Hẻm dessert"><img src="${menuLogo}" alt="Hẻm dessert"></a><a class="birthday-home" href="${escapeHtml(baseUrl)}">Trang chủ</a></header><main class="promotion-directory"><section class="promotion-directory-visual"><img src="${dealBanner}" alt="Gom đơn siêu tiệc, đầy đủ vị và đủ niềm vui cùng Hẻm dessert" fetchpriority="high"></section><section class="promotion-directory-intro"><div><p class="campaign-kicker">HẺM DESSERT / ƯU ĐÃI</p><h1>Chọn niềm vui gần nhất với bạn.</h1></div><p>Những chương trình đang và sắp diễn ra tại Hẻm. Ưu đãi gần nhất luôn được đặt ở vị trí đầu tiên.</p></section><section class="promotion-featured" aria-labelledby="promotion-featured-title"><div class="directory-heading"><span class="section-label">Đáng chú ý</span><h2 id="promotion-featured-title">Ưu đãi sắp đến</h2></div><div class="promotion-card-grid">${timed.map(({ item, file }, index) => campaignCard(item, file, index === 0)).join('')}</div></section>${recurring.length ? `<section class="promotion-recurring" aria-labelledby="promotion-recurring-title"><div class="directory-heading"><span class="section-label">Dành cho nhóm bạn</span><h2 id="promotion-recurring-title">Gom đơn, nhận quà</h2></div><div class="promotion-card-grid">${recurring.map(({ item, file }) => campaignCard(item, file)).join('')}</div></section>` : ''}</main><footer class="birthday-footer"><span>Hẻm dessert</span><a class="birthday-cta" href="${escapeHtml(baseUrl)}">Về trang chủ ${icon(ArrowRight, 18)}</a></footer>`
  const campaignByFile = new Map(campaigns.map(({ item, file }) => [file, item]))
  const stopCountdowns = [...app.querySelectorAll('[data-promotion-countdown]')].map((element) => mountCountdown(element, campaignByFile.get(element.closest('[data-promotion-campaign]')?.dataset.promotionCampaign))).filter(Boolean)
  window.addEventListener('pagehide', () => stopCountdowns.forEach((stop) => stop?.()))
}

await renderPromotionDirectory()
track('promotion_directory_view', { page_location: window.location.href })
