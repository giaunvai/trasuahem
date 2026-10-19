import './style.css'
import './interactive.css'
import './fonts.js'
import { ArrowUp, Gift, Menu, X } from 'lucide'
import hemLogo from './assets/branding/hem-logo.png'
import menuLogo from './assets/branding/logo.png'
import zaloQr from './assets/Zalo_OA.jpg'
import hoursBackground from './assets/backgrounds/nen.webp'
import menuImage from './assets/menu/menu.webp'
import { ASSET_PATHS } from './assetsConfig.js'
import { isCampaignPopupActive } from './countdown.js'
import { initAnalytics, track, trackLinkClicks } from './analytics.js'
import { renderFreeshipCalculator } from './modules/freeshipCalculator.js'
import { renderQuickActions } from './modules/quickActions.js'
import './heroCup.css'
import cupBoba from './assets/tra_sua_hem_noPhone.webp'
import cupSaltCream from './assets/Tra_Sua_Kem_Muoi.webp'
import { initHeroCup } from './modules/heroCup.js'

const menuDownloadUrl = ASSET_PATHS.menuDownload

// Ảnh popup chỉ tải khi có chiến dịch đang bật, không nhúng sẵn vào mọi lượt mở trang
const popupAssetLoaders = import.meta.glob('./assets/popup_*.webp', { query: '?url', import: 'default' })

const baseUrl = import.meta.env.BASE_URL
const assetUrl = (path) => path.startsWith('/') ? `${baseUrl}${path.slice(1)}` : path
const fallbackContent = { orderUrl: 'https://trasuahem.sapofnb.vn/', hero: { title: 'Hẻm dessert', description: 'Trà đậm, ít ngọt.', image: ASSET_PATHS.hero, orderLabel: 'Đặt món ngay', appLabel: 'Đặt food app' }, member: { title: 'Đăng ký thành viên', description: 'Quét mã QR để nhận ưu đãi.', qrImage: ASSET_PATHS.qr }, about: { eyebrow: 'Hẻm dessert', title: 'Một vị trà riêng', paragraphs: [], buttonLabel: 'Đặt món ngay' }, hours: { title: 'Giờ làm việc', description: 'Mở cửa mỗi ngày.', items: [] }, menu: { title: 'MENU', intro: 'Xem menu và đặt món.', policy: '', deliveryTiers: [], buttonLabel: 'Đặt món ngay', image: ASSET_PATHS.menuDownload, imageAlt: 'Menu Hẻm dessert' }, foodApps: { eyebrow: 'Đặt app giao hàng', title: 'Giao hàng food app', description: '', branches: [] }, locations: [], popup: { enabled: false }, analytics: {} }
const content = await fetch(`${baseUrl}content/site.json`).then((response) => {
  if (!response.ok) throw new Error('Không thể tải nội dung website.')
  return response.json()
}).catch(() => fallbackContent)
const { orderUrl, hero, member, about, hours, menu, foodApps, locations, popup = {}, analytics = {} } = content
// Popup hiện sau khi trang đã hiển thị để không che nội dung chính ngay lúc khách vừa vào
const POPUP_DELAY_MS = 3000
const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
const text = (value = '') => escapeHtml(value)
const withBreaks = (value = '') => text(value).replaceAll('\n', '<br>')
const safeUrl = (value, fallback = '#') => {
  try {
    const url = new URL(String(value || ''), window.location.origin)
    if (url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'tel:' || url.protocol === 'mailto:' || url.protocol === 'about:') return escapeHtml(url.href)
    if (String(value || '').startsWith('#')) return escapeHtml(String(value))
  } catch {}
  return fallback
}
const safeAsset = (path) => {
  const value = String(path || '')
  return value.startsWith('/images/') ? escapeHtml(assetUrl(value)) : ''
}
const icon = (item, size = 22) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${item.map(([tag, attributes]) => `<${tag} ${Object.entries(attributes).map(([key, value]) => `${key}="${value}"`).join(' ')} />`).join('')}</svg>`
const navItems = [
  ['Trang chủ', '#trang-chu'],
  ['Menu', '#menu'],
  ['Về chúng tôi', '#ve-chung-toi'],
  ['Giờ làm việc', '#gio-lam-viec'],
  ['App giao hàng', '#food-app'],
  ['Tuyển dụng', `${baseUrl}job.html`],
]
const timeColumn = (items = []) => items.map((item) => { const [hour, minute] = String(item.time || '').split(':'); return `<b>${text(item.label)}</b><strong>${text(hour)} <i>:</i> ${text(minute)}</strong>` }).join('')
const orderLink = safeUrl(orderUrl)

document.querySelector('#app').innerHTML = `
  <header class="site-header">
    <a class="logo-box" href="#trang-chu" aria-label="Hẻm dessert"><img src="${menuLogo}" alt="Hẻm dessert"></a>
    <nav aria-label="Điều hướng chính">${navItems.map(([label, target]) => `<a href="${target}">${label}</a>`).join('')}</nav>
    <a class="order-button header-order" href="${orderLink}" target="_blank" rel="noopener noreferrer">Đặt món</a>
    <button class="menu-toggle" type="button" aria-label="Mở menu" aria-expanded="false" aria-controls="mobile-navigation">${icon(Menu, 24)}</button>
  </header>
  <nav id="mobile-navigation" class="mobile-nav" aria-label="Điều hướng trên điện thoại" hidden>${navItems.map(([label, target]) => `<a href="${target}">${label}</a>`).join('')}<a href="${orderLink}" target="_blank" rel="noopener noreferrer">Đặt món</a></nav>
  <main>
    <section id="trang-chu" class="hero hero-interactive">
      <div class="hero-backdrop-glow" aria-hidden="true"></div>
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="hero-badge-dot"></span>
            Hẻm dessert • Trà đậm vị riêng
          </div>
          <h1>${withBreaks(hero.title)}</h1>
          <p class="hero-description">${text(hero.description)}</p>
          <div class="hero-props-row">
            <span class="hero-prop-pill">🍃 Lá trà nguyên bản</span>
            <span class="hero-prop-pill">🍯 Vị ít ngọt thanh nhẹ</span>
            <span class="hero-prop-pill">⚡ Nấu mới mỗi ngày</span>
          </div>
          <div class="hero-actions">
            <a class="hero-btn-order" href="${orderLink}" target="_blank" rel="noopener noreferrer">${text(hero.orderLabel)}</a>
            <a class="hero-btn-menu" href="#menu">Xem Menu Hẻm</a>
          </div>
          <div class="member-box">
            <img src="${zaloQr}" alt="Mã QR Zalo Hẻm dessert">
            <div>
              <b>${text(member.title)}</b>
              <p>${withBreaks(member.description)}</p>
            </div>
          </div>
        </div>

        <div class="hero-stage" id="hero-stage" aria-label="Hình ảnh ly trà sữa Hẻm dessert">
          <div class="hero-glow-aura" aria-hidden="true"></div>
          <div class="hero-ring hero-ring-outer" aria-hidden="true"></div>
          <div class="hero-ring hero-ring-inner" aria-hidden="true"></div>

          <div class="hero-cup-wrapper">
            <div class="hero-cup-3d" id="hero-cup-3d">
              <img id="hero-cup-img" class="hero-cup-img" src="${cupBoba}" alt="Ly Trà Sữa Hẻm Trân Châu Hoàng Kim">
            </div>
          </div>

          <div class="hero-particle particle-boba-1" aria-hidden="true"></div>
          <div class="hero-particle particle-boba-2" aria-hidden="true"></div>
          <div class="hero-particle particle-boba-3" aria-hidden="true"></div>
          <div class="hero-particle particle-leaf-1" aria-hidden="true">🍃</div>
          <div class="hero-particle particle-leaf-2" aria-hidden="true">🍃</div>

          <div class="hero-drink-card">
            <div class="drink-card-badge">✨ BEST SELLER</div>
            <h3 class="drink-card-name" id="hero-drink-title">Trà Sữa Hẻm Trân Châu</h3>
            <p class="drink-card-tag">Đậm vị trà truyền thống, trân châu hoàng kim dai dẻo</p>
            <div class="drink-card-actions">
              <button class="drink-switch-btn active" data-drink="boba" type="button">Trân Châu</button>
              <button class="drink-switch-btn" data-drink="saltcream" type="button">Kem Muối</button>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section id="menu" class="menu-section"><div class="menu-copy"><span class="accent-line"></span><h2>${text(menu.title)}</h2><p>${withBreaks(menu.intro)}</p>${menu.deliveryTiers?.length ? `<p>${withBreaks(menu.policy)}</p><ul class="delivery-tiers">${menu.deliveryTiers.map((tier) => `<li>${text(tier)}</li>`).join('')}</ul>` : `<p>${withBreaks(menu.policy)}</p>`}<a class="order-button yellow" href="${orderLink}" target="_blank" rel="noopener noreferrer">${text(menu.buttonLabel)}</a></div><button class="menu-image-trigger" type="button" aria-label="Xem menu phóng to" title="Xem menu phóng to"><img class="menu-image" src="${menuImage}" alt="${text(menu.imageAlt)}" loading="lazy" decoding="async"></button></section>

    <section id="tra-cuu-ship" class="freeship-section">
      <div id="freeship-calc-mount"></div>
    </section>

    <section id="ve-chung-toi" class="about panel"><div class="about-logo"><img src="${hemLogo}" alt="Hẻm dessert" loading="lazy" decoding="async"></div><div class="about-copy"><span class="accent-line"></span><p class="eyebrow">${text(about.eyebrow)}</p><h2>${withBreaks(about.title)}</h2>${(about.paragraphs || []).map((paragraph) => `<p>${text(paragraph)}</p>`).join('')}<a class="order-button yellow" href="${orderLink}" target="_blank" rel="noopener noreferrer">${text(about.buttonLabel)}</a></div><div class="about-dots" aria-hidden="true"></div></section>
    <section id="gio-lam-viec" class="hours panel" style="background-image:linear-gradient(90deg,rgba(0,0,0,.44),rgba(0,0,0,.08)),url('${escapeHtml(hours.image ? assetUrl(hours.image) : hoursBackground)}')"><div class="hours-copy"><span class="accent-line"></span><h2>${text(hours.title)}</h2><p>${text(hours.description)}</p><a class="order-button yellow" href="${orderLink}" target="_blank" rel="noopener noreferrer">${text(hours.buttonLabel)}</a></div><div class="time-card"><div class="time-group">${timeColumn((hours.items || []).slice(0, 2))}</div><div class="time-group">${timeColumn((hours.items || []).slice(2))}</div></div></section>
    <section id="food-app" class="apps panel"><span class="accent-line"></span><p class="eyebrow">${text(foodApps.eyebrow)}</p><h2>${text(foodApps.title)}</h2><p>${withBreaks(foodApps.description)}</p><div class="app-grid">${(foodApps.branches || []).map((branch) => `<article><b>${text(branch.name)}</b><div><a class="vill" href="${safeUrl(branch.vill)}" target="_blank" rel="noopener noreferrer">VILL</a><a class="shopee" href="${safeUrl(branch.shopee)}" target="_blank" rel="noopener noreferrer">Shopee<br>Food</a><a class="grab" href="${safeUrl(branch.grab)}" target="_blank" rel="noopener noreferrer">Grab<br>Food</a></div></article>`).join('')}</div></section>
    <section id="lien-he" class="contact">${(locations || []).filter((location) => location.visible !== false).map((location) => `<div><h2>${text(location.name)}</h2><p>${location.oldAddress ? `🏠 ${text(location.oldAddress)} (cũ)<br>` : ''}🏠 ${text(location.address)} (mới)<br>📱 Hotline Zalo: <a href="${safeUrl(`tel:${location.phoneLink}`)}">${text(location.phone)}</a></p>${location.tagline ? `<h3>${text(location.tagline)}</h3>` : ''}</div>`).join('')}</section>
  </main>
  <div id="quick-actions-mount"></div>
  <a class="promotion-cue" href="${baseUrl}promotion.html" aria-label="Xem các chương trình ưu đãi" title="Xem ưu đãi">${icon(Gift, 23)}</a>
  <button class="back-top" type="button" aria-label="Lên đầu trang" title="Lên đầu trang">${icon(ArrowUp, 20)}</button>
  <aside class="menu-lightbox" role="dialog" aria-modal="true" aria-labelledby="menu-lightbox-title" hidden><div class="menu-lightbox-panel"><div class="menu-lightbox-actions"><h2 id="menu-lightbox-title">${text(menu.title)}</h2><a class="menu-download" href="${menuDownloadUrl}" download="menu-hem-dessert.jpg" aria-label="Tải menu" title="Tải menu">Tải menu</a><button class="menu-lightbox-close" type="button" aria-label="Đóng ảnh menu" title="Đóng">×</button></div><img src="${menuImage}" alt="${text(menu.imageAlt)}"></div></aside>
`

const freeshipMount = document.querySelector('#freeship-calc-mount')
if (freeshipMount) {
  renderFreeshipCalculator(freeshipMount, locations, orderLink)
}

const quickActionsMount = document.querySelector('#quick-actions-mount')
if (quickActionsMount) {
  renderQuickActions(quickActionsMount, {
    orderUrl: orderLink,
    promotionUrl: `${baseUrl}promotion.html`,
    locations,
  })
}

initHeroCup({
  cupBoba,
  cupSaltCream,
})

const siteHeader = document.querySelector('.site-header')
const toggle = document.querySelector('.menu-toggle')
const mobileNav = document.querySelector('.mobile-nav')
const setMenu = (open) => { toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu'); toggle.innerHTML = icon(open ? X : Menu, 24); mobileNav.hidden = !open }
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'))
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !mobileNav.hidden) setMenu(false) })
mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => toggle.click()))
const backTop = document.querySelector('.back-top')
const updateScrollControls = () => {
  backTop.classList.toggle('is-visible', window.scrollY > 400)
  siteHeader?.classList.toggle('is-scrolled', window.scrollY > 30)
}
window.addEventListener('scroll', updateScrollControls, { passive: true })
updateScrollControls()
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }))
const trapDialogFocus = (dialog, event) => {
  if (event.key !== 'Tab') return
  const focusable = [...dialog.querySelectorAll('a[href], button:not([disabled])')]
  if (!focusable.length) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
}
let promotionPopup = null
let popupPreviousFocus = null
const closePromotionPopup = () => {
  if (!promotionPopup) return
  promotionPopup.remove()
  promotionPopup = null
  document.body.classList.remove('popup-open')
  popupPreviousFocus?.focus?.()
}
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closePromotionPopup() })
const findActivePopup = async () => {
  if (!popup.enabled) return null
  const popupEntries = (popup.campaigns || [{ campaign: popup.campaign || 'tet', image: popup.image, link: popup.link, alt: popup.alt }]).filter((entry) => /^[a-z0-9-]+$/i.test(entry.campaign || ''))
  const candidates = await Promise.all(popupEntries.map(async (entry) => {
    const campaign = await fetch(`${baseUrl}content/${entry.campaign}.json`).then((response) => response.ok ? response.json() : null).catch(() => null)
    return campaign ? { entry, popupActive: isCampaignPopupActive(campaign) } : null
  }))
  return candidates.find((candidate) => candidate?.popupActive)?.entry || null
}
const showCampaignPopup = async () => {
  const activePopup = await findActivePopup()
  if (!activePopup?.image || !activePopup?.link) return
  const popupAssetKey = `./assets/popup_${String(activePopup.image).replace(/^popup-/i, '').replace(/\.[a-z0-9]+$/i, '')}.webp`
  const popupImage = popupAssetLoaders[popupAssetKey] ? await popupAssetLoaders[popupAssetKey]() : safeAsset(activePopup.image)
  if (!popupImage) return
  await new Promise((resolve) => window.setTimeout(resolve, POPUP_DELAY_MS))
  // Không chen popup khi khách đang xem menu phóng to hoặc mở menu điều hướng
  if (document.body.classList.contains('menu-lightbox-open') || !mobileNav.hidden) return
  document.querySelector('#app').insertAdjacentHTML('beforeend', `<aside class="promotion-popup" role="dialog" aria-modal="true" aria-label="Ưu đãi từ Hẻm dessert"><div class="promotion-popup-card"><button class="popup-close" type="button" aria-label="Đóng ưu đãi">×</button><a class="promotion-link" href="${safeUrl(activePopup.link)}" target="_blank" rel="noopener noreferrer"><img src="${escapeHtml(popupImage)}" alt="${text(activePopup.alt || 'Ưu đãi từ Hẻm dessert')}"></a></div></aside>`)
  promotionPopup = document.querySelector('.promotion-popup')
  popupPreviousFocus = document.activeElement
  const popupCloseButton = promotionPopup.querySelector('.popup-close')
  promotionPopup.addEventListener('click', (event) => { if (event.target === promotionPopup) closePromotionPopup() })
  popupCloseButton.addEventListener('click', closePromotionPopup)
  promotionPopup.addEventListener('keydown', (event) => trapDialogFocus(promotionPopup, event))
  document.body.classList.add('popup-open')
  popupCloseButton.focus()
  track('promotion_popup_view', { campaign: activePopup.campaign })
}

const menuLightbox = document.querySelector('.menu-lightbox')
const menuImageTrigger = document.querySelector('.menu-image-trigger')
const menuLightboxClose = menuLightbox?.querySelector('.menu-lightbox-close')
const menuDownloadButton = menuLightbox?.querySelector('.menu-download')
let menuPreviousFocus = null
const closeMenuLightbox = () => { if (!menuLightbox) return; menuLightbox.hidden = true; document.body.classList.remove('menu-lightbox-open'); menuPreviousFocus?.focus?.() }
const openMenuLightbox = () => { if (!menuLightbox) return; menuPreviousFocus = document.activeElement; menuLightbox.hidden = false; document.body.classList.add('menu-lightbox-open'); menuLightboxClose?.focus() }
const downloadMenuImage = (event) => {
  if (event) event.preventDefault()
  const link = document.createElement('a')
  link.href = menuDownloadUrl
  link.download = 'menu-hem-dessert.jpg'
  link.rel = 'noopener'
  document.body.append(link)
  link.click()
  link.remove()
}
menuImageTrigger?.addEventListener('click', openMenuLightbox)
menuDownloadButton?.addEventListener('click', downloadMenuImage)
menuLightboxClose?.addEventListener('click', closeMenuLightbox)
menuLightbox?.addEventListener('click', (event) => { if (event.target === menuLightbox) closeMenuLightbox() })
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && menuLightbox && !menuLightbox.hidden) closeMenuLightbox() })
menuLightbox?.addEventListener('keydown', (event) => trapDialogFocus(menuLightbox, event))

initAnalytics(analytics)
track('landing_page_view', { page_location: window.location.href })
trackLinkClicks('cta_click')
showCampaignPopup()
