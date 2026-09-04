import './birthday.css'
import { ArrowRight, CalendarDays, Gift, MapPin, Phone } from 'lucide'
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
const campaignAssetUrl = (path) => path?.startsWith('/') ? assetUrl(path) : campaignImageUrl(path)
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
const fallback = { campaignType: 'birthday', campaignName: 'Sinh nhật Hẻm dessert', campaignYear: '01/07 hằng năm', recurringDate: '07-01', orderUrl: 'https://trasuahem.sapofnb.vn/', heroImage: '/images/home/original-0.jpg', heroImageAlt: 'Ưu đãi sinh nhật Hẻm dessert', badge: 'BIRTHDAY TREAT', title: 'Sinh nhật này,\nHẻm mời bạn một niềm vui', description: 'Mua 2 ly, tặng 1 ly cùng nhóm bạn.', offerValue: 'MUA 2 TẶNG 1', offerTitle: 'Một tháng đặc biệt, một phần quà thật riêng', offerDescription: 'Liên hệ Hẻm để biết điều kiện chương trình.', offerNote: '', steps: [], terms: [], locations: [] }
const requestedCampaign = null
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
if (!requestedCampaign) {
  await renderPromotionDirectory()
  track('promotion_directory_view', { page_location: window.location.href })
} else {
const campaignFile = requestedCampaign === 'campaign' ? 'birthday' : /^[a-z0-9-]+$/i.test(requestedCampaign) ? requestedCampaign : 'birthday'
const campaign = await fetch(`${baseUrl}content/${campaignFile}.json`).then((response) => response.ok ? response.json() : Promise.reject()).catch(() => fallback)
const campaignState = getCampaignState(campaign)
const campaignInactive = campaign.active === false
document.body.classList.toggle('campaign-inactive', campaignInactive)
document.body.classList.add(`campaign-theme-${campaign.theme || 'thuong-hieu'}`)
const productImages = (campaign.productImages || []).slice(0, 5)
app.innerHTML = `
  <header class="birthday-header"><a class="birthday-brand" href="${escapeHtml(baseUrl)}" aria-label="Về trang chủ Hẻm dessert"><img src="${menuLogo}" alt="Hẻm dessert"></a><a class="birthday-home" href="${escapeHtml(baseUrl)}">Trang chủ</a></header>
  ${campaignInactive ? '<div class="campaign-status" role="status"><h1>Chương trình đang tạm dừng</h1><p>Hẻm dessert đang cập nhật thông tin ưu đãi. Mời bạn xem menu và đặt món tại trang chủ.</p><a class="birthday-cta birthday-cta-primary" href="' + escapeHtml(baseUrl) + '">Về trang chủ</a></div>' : ''}
  ${!campaignInactive && campaign.promotionKind !== 'recurring' && campaignState.state !== 'live' ? `<div class="campaign-status campaign-status-compact" role="status"><h1>${campaignState.state === 'notice' ? 'Sắp đến ngày ưu đãi' : campaignState.state === 'ended' ? 'Ưu đãi đã kết thúc' : 'Chương trình sắp diễn ra'}</h1><p>${campaignState.state === 'notice' ? 'Hẻm đang chuẩn bị quà. Ưu đãi sẽ bắt đầu đúng thời gian thông báo.' : campaignState.state === 'ended' ? 'Hẹn bạn ở đợt ưu đãi tiếp theo của Hẻm dessert.' : 'Bạn có thể xem trước thông tin chương trình và quay lại đúng thời gian để nhận ưu đãi.'}</p></div>` : ''}
  <main>
    <section class="birthday-hero campaign-event">
      <div class="birthday-hero-copy"><p class="campaign-kicker">${text(campaign.badge)} / ${text(campaign.campaignYear)}</p><h1>${withBreaks(campaign.title)}</h1><p class="birthday-lead">${text(campaign.description)}</p><a class="birthday-cta birthday-cta-primary" href="${safeUrl(campaign.orderUrl)}" target="_blank" rel="noopener noreferrer">Đặt món ngay ${icon(ArrowRight, 18)}</a><p class="campaign-microcopy">Trà đậm, ít ngọt. Một vị riêng cho ngày của bạn.</p></div>
      <div class="birthday-hero-art"><img src="${campaignAssetUrl(campaign.heroImage)}" alt="${text(campaign.heroImageAlt)}"></div>
    </section>
    <section class="offer-section campaign-event" aria-labelledby="offer-title"><div class="offer-stamp">${icon(Gift, 25)}<span>Quà<br>ưu đãi</span></div><div class="offer-main"><p class="section-label">${text(campaign.campaignName)}</p><p class="offer-value">${text(campaign.offerValue)}</p><h2 id="offer-title">${text(campaign.offerTitle)}</h2><p>${text(campaign.offerDescription)}</p><p class="offer-note">${text(campaign.offerNote)}</p></div><div class="countdown" aria-live="polite"><p>${campaign.promotionKind === 'recurring' ? 'Quà dành cho nhóm bạn' : campaignState.state === 'live' ? 'Ưu đãi kết thúc sau' : campaignState.state === 'notice' ? 'Ưu đãi bắt đầu sau' : campaignState.state === 'ended' ? 'Đợt tiếp theo bắt đầu sau' : 'Thông báo bắt đầu sau'}</p><strong data-countdown>${campaign.promotionKind === 'recurring' ? 'Gom đơn cùng vui' : '-- ngày'}</strong><span>${text(campaign.campaignYear)}</span></div></section>
    <section class="product-section campaign-event" aria-labelledby="product-title"><div class="product-copy"><p class="section-label">${text(campaign.productLabel || 'Vị riêng của Hẻm')}</p><h2 id="product-title">${withBreaks(campaign.productTitle || 'Chọn ly bạn thích,\nHẻm chuẩn bị phần quà.')}</h2><p>${text(campaign.productDescription || 'Những ly nước quen thuộc của Hẻm được giữ nguyên màu sắc, topping và logo thương hiệu trong thiết kế campaign.')}</p><a class="birthday-cta birthday-cta-primary" href="${safeUrl(campaign.orderUrl)}" target="_blank" rel="noopener noreferrer">Xem menu và đặt món ${icon(ArrowRight, 18)}</a></div><div class="product-collage product-count-${productImages.length}">${productImages.map((image) => `<figure><img src="${campaignImageUrl(image.file)}" alt="${text(image.alt)}" loading="lazy" decoding="async"><figcaption>${text(image.name)}</figcaption></figure>`).join('')}</div></section>
    <section class="steps-section" aria-labelledby="steps-title"><div class="section-intro"><p class="section-label">Thật đơn giản</p><h2 id="steps-title">Nhận ưu đãi<br>cùng Hẻm</h2></div><div class="steps-grid">${(campaign.steps || []).map((step) => `<article class="step-card"><b>${text(step.number)}</b><h3>${text(step.title)}</h3><p>${text(step.description)}</p></article>`).join('')}</div></section>
    <section class="contact-section" aria-labelledby="contact-title"><div><p class="section-label">Cần hỗ trợ?</p><h2 id="contact-title">Hẻm ở đây<br>để đồng hành cùng bạn.</h2><p>Liên hệ chi nhánh gần bạn để xác nhận ưu đãi trước khi đặt món.</p></div><div class="contact-list">${(campaign.locations || []).map((location) => `<div class="contact-item"><span>${icon(MapPin, 19)}</span><div><strong>${text(location.name)}</strong><a href="${safeUrl(`tel:${location.phoneLink}`)}">${icon(Phone, 16)} ${text(location.phone)}</a></div></div>`).join('')}</div></section>
    <section class="terms-section" aria-labelledby="terms-title"><div><p class="section-label">Thông tin chương trình</p><h2 id="terms-title">Điều kiện áp dụng</h2></div><ul>${(campaign.terms || []).map((term) => `<li>${text(term)}</li>`).join('')}</ul></section>
  </main>
  <footer class="birthday-footer"><span>Hẻm dessert</span><a class="birthday-cta" href="${safeUrl(campaign.orderUrl)}" target="_blank" rel="noopener noreferrer">Đặt món ngay ${icon(ArrowRight, 18)}</a></footer>
`
const countdown = document.querySelector('[data-countdown]')
if (campaign.promotionKind !== 'recurring') mountCountdown(countdown, campaign)
document.addEventListener('click', (event) => { const link = event.target.closest('a'); if (link) track('birthday_cta_click', { cta_text: link.textContent.trim(), cta_url: link.href }) })
track('campaign_landing_view', { campaign_type: campaign.campaignType, campaign_year: campaign.campaignYear, campaign_page: campaignFile, page_location: window.location.href })
}
