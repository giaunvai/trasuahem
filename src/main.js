import './style.css'
import { ArrowUp, Menu, Mouse, X } from 'lucide'
import hemLogo from './assets/hem-logo.png'
import menuLogo from './assets/logo.png'
import hoursBackground from './assets/nen.webp'

const baseUrl = import.meta.env.BASE_URL
const assetUrl = (path) => path.startsWith('/') ? `${baseUrl}${path.slice(1)}` : path
const fallbackContent = { orderUrl: 'https://trasuahem.sapofnb.vn/', hero: { title: 'Hẻm dessert', description: 'Trà đậm, ít ngọt.', image: '/images/original-0.jpg', orderLabel: 'Đặt món ngay', appLabel: 'Đặt food app' }, member: { title: 'Đăng ký thành viên', description: 'Quét mã QR để nhận ưu đãi.', qrImage: '/images/original-2.jpg' }, about: { eyebrow: 'Hẻm dessert', title: 'Một vị trà riêng', paragraphs: [], buttonLabel: 'Đặt món ngay' }, hours: { title: 'Giờ làm việc', description: 'Mở cửa mỗi ngày.', items: [] }, menu: { title: 'MENU', intro: 'Xem menu và đặt món.', policy: '', deliveryTiers: [], buttonLabel: 'Đặt món ngay', image: '/images/original-6-menu.jpg', imageAlt: 'Menu Hẻm dessert' }, foodApps: { eyebrow: 'Đặt app giao hàng', title: 'Giao hàng food app', description: '', branches: [] }, locations: [], popup: { enabled: false }, analytics: {} }
const content = await fetch(`${baseUrl}content/site.json`).then((response) => {
  if (!response.ok) throw new Error('Không thể tải nội dung website.')
  return response.json()
}).catch(() => fallbackContent)
const { orderUrl, hero, member, about, hours, menu, foodApps, locations, popup, analytics = {} } = content
const icon = (item, size = 22) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${item.map(([tag, attributes]) => `<${tag} ${Object.entries(attributes).map(([key, value]) => `${key}="${value}"`).join(' ')} />`).join('')}</svg>`
const withBreaks = (text) => text.replaceAll('\n', '<br>')
const navItems = [['Trang chủ', '#trang-chu'], ['Về chúng tôi', '#ve-chung-toi'], ['Giờ làm việc', '#gio-lam-viec'], ['Menu', '#menu'], ['Đặt app giao hàng', '#food-app'], ['Liên hệ', '#lien-he']]
const timeColumn = (items) => items.map((item) => { const [hour, minute] = item.time.split(':'); return `<b>${item.label}</b><strong>${hour} <i>:</i> ${minute}</strong>` }).join('')

document.querySelector('#app').innerHTML = `
  <header class="site-header">
    <a class="logo-box" href="#trang-chu" aria-label="Hẻm dessert"><img src="${menuLogo}" alt="Hẻm dessert"></a>
    <nav aria-label="Điều hướng chính">${navItems.map(([label, target]) => `<a href="${target}">${label}</a>`).join('')}</nav>
    <a class="order-button header-order" href="${orderUrl}" target="_blank" rel="noreferrer">Đặt món</a>
    <button class="menu-toggle" type="button" aria-label="Mở menu" aria-expanded="false">${icon(Menu, 24)}</button>
  </header>
  <nav class="mobile-nav" aria-label="Điều hướng trên điện thoại" hidden>${navItems.map(([label, target]) => `<a href="${target}">${label}</a>`).join('')}<a href="${orderUrl}" target="_blank" rel="noreferrer">Đặt món</a></nav>
  <main>
    <section id="trang-chu" class="hero" style="background-image:linear-gradient(90deg,#0008,#fff1),url('${assetUrl(hero.image)}')"><div class="hero-content"><h1>${withBreaks(hero.title)}</h1><p>${hero.description}</p><div class="hero-actions"><a class="order-button yellow" href="${orderUrl}" target="_blank" rel="noreferrer">${hero.orderLabel}</a><a class="order-button coral" href="#food-app">${hero.appLabel}</a></div><div class="member-box"><img src="${assetUrl(member.qrImage)}" alt="Mã QR Zalo Hẻm dessert"><div><b>${member.title}</b><p>${withBreaks(member.description)}</p></div></div></div><button class="scroll-cue" type="button" aria-label="Cuộn xuống phần giới thiệu" title="Cuộn xuống">${icon(Mouse, 32)}</button></section>
    <section id="ve-chung-toi" class="about panel"><div class="about-logo"><img src="${hemLogo}" alt="Hẻm dessert" loading="lazy" decoding="async"></div><div class="about-copy"><span class="accent-line"></span><p class="eyebrow">${about.eyebrow}</p><h2>${withBreaks(about.title)}</h2>${about.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join('')}<a class="order-button yellow" href="${orderUrl}" target="_blank" rel="noreferrer">${about.buttonLabel}</a></div><div class="about-dots" aria-hidden="true"></div></section>
    <section id="gio-lam-viec" class="hours panel" style="background-image:linear-gradient(90deg,rgba(0,0,0,.44),rgba(0,0,0,.08)),url('${hoursBackground}')"><div class="hours-copy"><span class="accent-line"></span><h2>${hours.title}</h2><p>${hours.description}</p><a class="order-button yellow" href="${orderUrl}" target="_blank" rel="noreferrer">${hours.buttonLabel}</a></div><div class="time-card"><div class="time-group">${timeColumn(hours.items.slice(0, 2))}</div><div class="time-group">${timeColumn(hours.items.slice(2))}</div></div></section>
    <section id="menu" class="menu-section"><div class="menu-copy"><span class="accent-line"></span><h2>${menu.title}</h2><p>${withBreaks(menu.intro)}</p>${menu.deliveryTiers?.length ? `<p>${withBreaks(menu.policy)}</p><ul class="delivery-tiers">${menu.deliveryTiers.map((tier) => `<li>${tier}</li>`).join('')}</ul>` : `<p>${withBreaks(menu.policy)}</p>`}<a class="order-button yellow" href="${orderUrl}" target="_blank" rel="noreferrer">${menu.buttonLabel}</a></div><img class="menu-image" src="${assetUrl(menu.image)}" alt="${menu.imageAlt}" loading="lazy" decoding="async"></section>
    <section id="food-app" class="apps panel"><span class="accent-line"></span><p class="eyebrow">${foodApps.eyebrow}</p><h2>${foodApps.title}</h2><p>${withBreaks(foodApps.description)}</p><div class="app-grid">${foodApps.branches.map((branch) => `<article><b>${branch.name}</b><div><a class="vill" href="${branch.vill}" target="_blank" rel="noreferrer">VILL</a><a class="shopee" href="${branch.shopee}" target="_blank" rel="noreferrer">Shopee<br>Food</a><a class="grab" href="${branch.grab}" target="_blank" rel="noreferrer">Grab<br>Food</a></div></article>`).join('')}</div></section>
    <section id="lien-he" class="contact">${locations.filter((location) => location.visible !== false).map((location) => `<div><h2>${location.name}</h2><p>${location.oldAddress ? `🏠 ${location.oldAddress} (cũ)<br>` : ''}🏠 ${location.address} (mới)<br>📱 Hotline Zalo: <a href="tel:${location.phoneLink}">${location.phone}</a></p>${location.tagline ? `<h3>${location.tagline}</h3>` : ''}</div>`).join('')}</section>
  </main>
  <button class="back-top" type="button" aria-label="Lên đầu trang" title="Lên đầu trang">${icon(ArrowUp, 20)}</button>
  ${popup.enabled && popup.image && popup.link ? `<aside class="promotion-popup" role="dialog" aria-modal="true" aria-label="Ưu đãi đang diễn ra"><div class="promotion-popup-card"><button class="popup-close" type="button" aria-label="Đóng ưu đãi">×</button><a class="promotion-link" href="${popup.link}" target="_blank" rel="noreferrer"><img src="${assetUrl(popup.image)}" alt="${popup.alt || 'Ưu đãi từ Hẻm dessert'}"></a></div></aside>` : ''}
`

const toggle = document.querySelector('.menu-toggle')
const mobileNav = document.querySelector('.mobile-nav')
const setMenu = (open) => { toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu'); toggle.innerHTML = icon(open ? X : Menu, 24); mobileNav.hidden = !open }
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'))
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !mobileNav.hidden) setMenu(false) })
mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => toggle.click()))
const backTop = document.querySelector('.back-top')
const scrollCue = document.querySelector('.scroll-cue')
const updateScrollControls = () => backTop.classList.toggle('is-visible', window.scrollY > 400)
window.addEventListener('scroll', updateScrollControls, { passive: true })
updateScrollControls()
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }))
scrollCue.addEventListener('click', () => document.querySelector('#ve-chung-toi').scrollIntoView({ behavior: 'smooth' }))
const promotionPopup = document.querySelector('.promotion-popup')
const closePromotionPopup = () => { promotionPopup?.remove(); document.body.classList.remove('popup-open') }
promotionPopup?.addEventListener('click', (event) => { if (event.target === promotionPopup) closePromotionPopup() })
promotionPopup?.querySelector('.popup-close')?.addEventListener('click', closePromotionPopup)
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closePromotionPopup() })
if (promotionPopup) document.body.classList.add('popup-open')

const track = (name, parameters = {}) => {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event: name, ...parameters })
  window.gtag?.('event', name, parameters)
  window.fbq?.('trackCustom', name, parameters)
}
const loadAnalytics = () => {
  if (analytics.ga4MeasurementId) {
    window.dataLayer = window.dataLayer || []
    window.gtag = (...args) => window.dataLayer.push(args)
    window.gtag('js', new Date())
    window.gtag('config', analytics.ga4MeasurementId)
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analytics.ga4MeasurementId)}`
    document.head.append(script)
  }
  if (analytics.metaPixelId) {
    window.fbq = window.fbq || ((...args) => (window.fbq.queue = window.fbq.queue || []).push(args))
    window.fbq.loaded = true
    window.fbq.version = '2.0'
    window.fbq('init', analytics.metaPixelId)
    window.fbq('track', 'PageView')
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://connect.facebook.net/en_US/fbevents.js'
    document.head.append(script)
  }
}
loadAnalytics()
const query = Object.fromEntries(new URLSearchParams(window.location.search))
track('landing_page_view', { page_location: window.location.href, ...Object.fromEntries(Object.entries(query).filter(([key]) => key.startsWith('utm_'))) })
document.addEventListener('click', (event) => { const link = event.target.closest('a'); if (!link) return; track('cta_click', { cta_text: link.textContent.trim(), cta_url: link.href }) })
