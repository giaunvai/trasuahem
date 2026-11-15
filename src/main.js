import './style.css'
import './interactive.css'
import './fonts.js'
import { ArrowUp, Briefcase, Clock, Gift, Leaf, MapPin, Menu, Phone, Sparkles, Ticket, Truck, X, Zap } from 'lucide'
import hemLogo from './assets/branding/hem-logo.png'
import menuLogo from './assets/branding/logo.png'
import zaloQr from './assets/Zalo_OA.jpg'
import hoursBackground from './assets/backgrounds/nen.webp'
import menuImage from './assets/menu/menu.webp'
import { ASSET_PATHS } from './assetsConfig.js'
import { isCampaignPopupActive } from './countdown.js'
import { appendUtmToUrl, initAnalytics, track, trackLinkClicks, trackStandardConversion } from './analytics.js'
import { renderFreeshipCalculator } from './modules/freeshipCalculator.js'
import { renderQuickActions } from './modules/quickActions.js'
import './heroCup.css'
import './theme.css'
import cupTraSuaHem from './assets/tra_sua_hem_noPhone.webp'
import cupKemMuoi from './assets/Tra_Sua_Kem_Muoi.webp'
import cupDuaLuoi from './assets/Tra_Dua_Luoi_Dua_Gion.webp'
import cupChanhNho from './assets/Tra_Chanh_Nho.webp'
import cupLaiSuiBot from './assets/Tra_Lai_Sui_Bot.webp'
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
const orderLink = appendUtmToUrl(safeUrl(orderUrl))

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
            <span class="hero-prop-pill">${icon(Leaf, 15)} Lá trà nguyên bản</span>
            <span class="hero-prop-pill">${icon(Sparkles, 15)} Vị ít ngọt thanh nhẹ</span>
            <span class="hero-prop-pill">${icon(Zap, 15)} Nấu mới mỗi ngày</span>
          </div>
          <div class="hero-actions">
            <a class="hero-btn-order" href="${orderLink}" target="_blank" rel="noopener noreferrer">${text(hero.orderLabel)}</a>
            <a class="hero-btn-menu" href="#menu">Xem Menu Hẻm</a>
          </div>
          <div class="hero-trust-strip" aria-label="Thông tin nhanh">
            <span class="hero-trust-item">${icon(MapPin, 15)} Tân An &amp; Mỹ Tho</span>
            <span class="hero-trust-item">${icon(Clock, 15)} 08:30 – 22:00 mỗi ngày</span>
            <span class="hero-trust-item">${icon(Truck, 15)} Một ly cũng giao</span>
          </div>
          <div class="member-box">
            <img src="${zaloQr}" alt="Mã QR Zalo Hẻm dessert" width="152" height="152" loading="lazy" decoding="async">
            <div>
              <b>${text(member.title)}</b>
              <p>${withBreaks(member.description)}</p>
            </div>
          </div>
        </div>

        <div class="hero-stage" id="hero-stage" aria-label="Bộ sưu tập thức uống Hẻm dessert">
          <div class="hero-glow-aura" aria-hidden="true"></div>
          <div class="hero-ring hero-ring-outer" aria-hidden="true"></div>
          <div class="hero-ring hero-ring-inner" aria-hidden="true"></div>

          <button class="cup-nav-btn cup-nav-prev" type="button" aria-label="Món trước đó" title="Món trước đó">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
          </button>

          <div class="hero-cup-wrapper">
            <div class="hero-cup-3d" id="hero-cup-3d">
              <img class="hero-cup-img active" src="${cupTraSuaHem}" alt="Ly Trà Sữa Hẻm" data-index="0" fetchpriority="high" decoding="async">
              <img class="hero-cup-img" src="${cupKemMuoi}" alt="Ly Trà Sữa Hẻm Kem Muối" data-index="1" loading="lazy" decoding="async">
              <img class="hero-cup-img" src="${cupDuaLuoi}" alt="Ly Trà Dưa Lưới Dừa Giòn" data-index="2" loading="lazy" decoding="async">
              <img class="hero-cup-img" src="${cupChanhNho}" alt="Ly Trà Chanh Nho" data-index="3" loading="lazy" decoding="async">
              <img class="hero-cup-img" src="${cupLaiSuiBot}" alt="Ly Trà Lài Sủi Bọt" data-index="4" loading="lazy" decoding="async">
            </div>
          </div>

          <button class="cup-nav-btn cup-nav-next" type="button" aria-label="Món tiếp theo" title="Món tiếp theo">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
          </button>

          <div class="hero-drink-card">
            <div class="drink-card-header">
              <span class="drink-card-badge">${icon(Sparkles, 13)} MÓN NỔI BẬT</span>
              <span class="drink-card-counter" id="hero-drink-counter">1 / 5</span>
            </div>
            <h3 class="drink-card-name" id="hero-drink-title">Trà Sữa Hẻm</h3>
            <div class="drink-dots-row" id="hero-drink-dots" role="tablist" aria-label="Chọn thức uống"></div>
          </div>
        </div>
      </div>
    </section>

    <section id="uu-dai-noi-bat" class="campaigns-hub" aria-label="Ưu đãi và sự kiện Hẻm dessert">
      <div class="campaigns-hub-inner">
        <div class="campaigns-hub-head">
          <h2>Ưu đãi &amp; Sự kiện tại Hẻm</h2>
          <span>Cập nhật liên tục</span>
        </div>
        <div class="campaigns-grid">
          <a class="campaign-link-card" href="${baseUrl}promotion.html">
            <div class="campaign-card-top">
              <span class="campaign-icon-box">${icon(Gift, 18)}</span>
              <span class="campaign-tag">Hot Deal</span>
            </div>
            <div>
              <strong>Khuyến mãi &amp; Sự kiện</strong>
              <p>Tổng hợp deal nhóm, combo tiệc và ưu đãi đang diễn ra.</p>
            </div>
          </a>
          <a class="campaign-link-card" href="${baseUrl}lucky-wheel.html">
            <div class="campaign-card-top">
              <span class="campaign-icon-box">${icon(Sparkles, 18)}</span>
              <span class="campaign-tag">Mini Game</span>
            </div>
            <div>
              <strong>Vòng quay may mắn</strong>
              <p>Quay nhận voucher giảm giá đến 100% cho đơn tiếp theo.</p>
            </div>
          </a>
          <a class="campaign-link-card" href="${baseUrl}li-xi-tet.html">
            <div class="campaign-card-top">
              <span class="campaign-icon-box">${icon(Ticket, 18)}</span>
              <span class="campaign-tag">Theo mùa</span>
            </div>
            <div>
              <strong>Lì xì &amp; Sự kiện Tết</strong>
              <p>Săn bao lì xì may mắn và ưu đãi dịp lễ hội đặc biệt.</p>
            </div>
          </a>
          <a class="campaign-link-card" href="${baseUrl}job.html">
            <div class="campaign-card-top">
              <span class="campaign-icon-box">${icon(Briefcase, 18)}</span>
              <span class="campaign-tag">Gia nhập Hẻm</span>
            </div>
            <div>
              <strong>Tuyển dụng</strong>
              <p>Cơ hội làm việc năng động tại chi nhánh Tân An &amp; Mỹ Tho.</p>
            </div>
          </a>
        </div>
      </div>
    </section>

    <section id="mon-noi-bat" class="bestsellers-section" aria-label="Món bán chạy nhất">
      <div class="bestsellers-head">
        <div>
          <span class="accent-line"></span>
          <h2>Best Seller nhà Hẻm</h2>
        </div>
        <p>Trà đậm vị nguyên bản, ít ngọt thanh nhẹ — chọn nhanh và đặt ngay.</p>
      </div>
      <div class="bestsellers-grid">
        <article class="bestseller-card">
          <div class="bestseller-thumb"><img src="${cupTraSuaHem}" alt="Trà Sữa Hẻm" loading="lazy" decoding="async"></div>
          <span class="bestseller-tag">Signature</span>
          <h3>Trà Sữa Hẻm</h3>
          <p>Trà đen ủ đậm quyện sữa béo thanh, ít ngọt chuẩn gu.</p>
          <a class="bestseller-cta" href="${orderLink}" target="_blank" rel="noopener noreferrer">Đặt ngay</a>
        </article>
        <article class="bestseller-card">
          <div class="bestseller-thumb"><img src="${cupKemMuoi}" alt="Trà Sữa Hẻm Kem Muối" loading="lazy" decoding="async"></div>
          <span class="bestseller-tag">Bán chạy</span>
          <h3>Trà Sữa Kem Muối</h3>
          <p>Lớp kem muối mặn nhẹ béo mịn hòa cùng cốt trà đậm.</p>
          <a class="bestseller-cta" href="${orderLink}" target="_blank" rel="noopener noreferrer">Đặt ngay</a>
        </article>
        <article class="bestseller-card">
          <div class="bestseller-thumb"><img src="${cupDuaLuoi}" alt="Trà Dưa Lưới Dừa Giòn" loading="lazy" decoding="async"></div>
          <span class="bestseller-tag">Thanh mát</span>
          <h3>Trà Dưa Lưới Dừa Giòn</h3>
          <p>Vị dưa lưới thơm dịu kết hợp thạch dừa giòn sần sật.</p>
          <a class="bestseller-cta" href="${orderLink}" target="_blank" rel="noopener noreferrer">Đặt ngay</a>
        </article>
        <article class="bestseller-card">
          <div class="bestseller-thumb"><img src="${cupChanhNho}" alt="Trà Chanh Nho" loading="lazy" decoding="async"></div>
          <span class="bestseller-tag">Giải nhiệt</span>
          <h3>Trà Chanh Nho</h3>
          <p>Chua ngọt hài hòa từ nho tươi và chanh, sảng khoái tức thì.</p>
          <a class="bestseller-cta" href="${orderLink}" target="_blank" rel="noopener noreferrer">Đặt ngay</a>
        </article>
        <article class="bestseller-card">
          <div class="bestseller-thumb"><img src="${cupLaiSuiBot}" alt="Trà Lài Sủi Bọt" loading="lazy" decoding="async"></div>
          <span class="bestseller-tag">Hương hoa</span>
          <h3>Trà Lài Sủi Bọt</h3>
          <p>Trà lài ướp hương tự nhiên lắc bọt mịn, hậu vị thanh tao.</p>
          <a class="bestseller-cta" href="${orderLink}" target="_blank" rel="noopener noreferrer">Đặt ngay</a>
        </article>
      </div>
    </section>

    <section id="menu" class="menu-section"><div class="menu-copy"><span class="accent-line"></span><h2>${text(menu.title)}</h2><p>${withBreaks(menu.intro)}</p>${menu.deliveryTiers?.length ? `<p>${withBreaks(menu.policy)}</p><ul class="delivery-tiers">${menu.deliveryTiers.map((tier) => `<li>${text(tier)}</li>`).join('')}</ul>` : `<p>${withBreaks(menu.policy)}</p>`}<a class="order-button yellow" href="${orderLink}" target="_blank" rel="noopener noreferrer">${text(menu.buttonLabel)}</a></div><button class="menu-image-trigger" type="button" aria-label="Xem menu phóng to" title="Xem menu phóng to"><img class="menu-image" src="${menuImage}" alt="${text(menu.imageAlt)}" loading="lazy" decoding="async"></button></section>

    <section id="tra-cuu-ship" class="freeship-section">
      <div id="freeship-calc-mount"></div>
    </section>

    <section id="ve-chung-toi" class="about panel"><div class="about-logo"><img src="${hemLogo}" alt="Hẻm dessert" loading="lazy" decoding="async"></div><div class="about-copy"><span class="accent-line"></span><p class="eyebrow">${text(about.eyebrow)}</p><h2>${withBreaks(about.title)}</h2>${(about.paragraphs || []).map((paragraph) => `<p>${text(paragraph)}</p>`).join('')}<a class="order-button yellow" href="${orderLink}" target="_blank" rel="noopener noreferrer">${text(about.buttonLabel)}</a></div><div class="about-dots" aria-hidden="true"></div></section>
    <section id="gio-lam-viec" class="hours panel" style="background-image:linear-gradient(90deg,rgba(0,0,0,.44),rgba(0,0,0,.08)),url('${escapeHtml(hours.image ? assetUrl(hours.image) : hoursBackground)}')"><div class="hours-copy"><span class="accent-line"></span><h2>${text(hours.title)}</h2><p>${text(hours.description)}</p><a class="order-button yellow" href="${orderLink}" target="_blank" rel="noopener noreferrer">${text(hours.buttonLabel)}</a></div><div class="time-card"><div class="time-group">${timeColumn((hours.items || []).slice(0, 2))}</div><div class="time-group">${timeColumn((hours.items || []).slice(2))}</div></div></section>
    <section id="food-app" class="apps panel"><span class="accent-line"></span><p class="eyebrow">${text(foodApps.eyebrow)}</p><h2>${text(foodApps.title)}</h2><p>${withBreaks(foodApps.description)}</p><div class="app-grid">${(foodApps.branches || []).map((branch) => `<article><b>${text(branch.name)}</b><div><a class="vill" href="${safeUrl(branch.vill)}" target="_blank" rel="noopener noreferrer">VILL</a><a class="shopee" href="${safeUrl(branch.shopee)}" target="_blank" rel="noopener noreferrer">Shopee<br>Food</a><a class="grab" href="${safeUrl(branch.grab)}" target="_blank" rel="noopener noreferrer">Grab<br>Food</a></div></article>`).join('')}</div></section>
    <section id="lien-he" class="contact">${(locations || []).filter((location) => location.visible !== false).map((location) => `<div><h2>${text(location.name)}</h2><p class="contact-details">${location.oldAddress ? `<span class="contact-line">${icon(MapPin, 16)} <span>${text(location.oldAddress)} (cũ)</span></span>` : ''}<span class="contact-line">${icon(MapPin, 16)} <span>${text(location.address)} (mới)</span></span><span class="contact-line">${icon(Phone, 16)} <span>Hotline Zalo: <a href="${safeUrl(`tel:${location.phoneLink}`)}">${text(location.phone)}</a></span></span></p>${location.tagline ? `<h3>${text(location.tagline)}</h3>` : ''}</div>`).join('')}</section>
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
  drinks: [
    {
      id: 'tra-sua-hem',
      name: 'Trà Sữa Hẻm',
      img: cupTraSuaHem,
      alt: 'Ly Trà Sữa Hẻm',
      glow: 'rgba(247, 197, 29, 0.38)',
    },
    {
      id: 'tra-sua-hem-kem-muoi',
      name: 'Trà Sữa Hẻm Kem Muối',
      img: cupKemMuoi,
      alt: 'Ly Trà Sữa Hẻm Kem Muối',
      glow: 'rgba(250, 180, 80, 0.38)',
    },
    {
      id: 'tra-dua-luoi-dua-gion',
      name: 'Trà Dưa Lưới Dừa Giòn',
      img: cupDuaLuoi,
      alt: 'Ly Trà Dưa Lưới Dừa Giòn',
      glow: 'rgba(74, 222, 128, 0.36)',
    },
    {
      id: 'tra-chanh-nho',
      name: 'Trà Chanh Nho',
      img: cupChanhNho,
      alt: 'Ly Trà Chanh Nho',
      glow: 'rgba(225, 29, 72, 0.36)',
    },
    {
      id: 'tra-lai-sui-bot',
      name: 'Trà Lài Sủi Bọt',
      img: cupLaiSuiBot,
      alt: 'Ly Trà Lài Sủi Bọt',
      glow: 'rgba(251, 191, 36, 0.38)',
    },
  ],
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
const openMenuLightbox = () => { if (!menuLightbox) return; menuPreviousFocus = document.activeElement; menuLightbox.hidden = false; document.body.classList.add('menu-lightbox-open'); menuLightboxClose?.focus(); trackStandardConversion('ViewContent', { content_name: 'Menu Hẻm dessert' }) }
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

// Scroll-reveal nhẹ bằng IntersectionObserver (GPU opacity + transform, không tốn bundle)
const revealTargets = document.querySelectorAll('.campaigns-hub, .bestsellers-section, .menu-section, .freeship-section, .panel, .contact')
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-revealed')
      observer.unobserve(entry.target)
    })
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 })
  revealTargets.forEach((el) => {
    el.classList.add('reveal')
    revealObserver.observe(el)
  })
}
