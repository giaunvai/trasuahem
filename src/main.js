import './style.css'
import { Menu, X } from 'lucide'
import hemLogo from './assets/hem-logo.png'
import menuLogo from './assets/logo.png'
import hoursBackground from './assets/nen.webp'

const content = await fetch('/content/site.json').then((response) => {
  if (!response.ok) throw new Error('Không thể tải nội dung website.')
  return response.json()
})
const { orderUrl, hero, member, about, hours, menu, foodApps, locations, popup } = content
const icon = (item, size = 22) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${item.map(([tag, attributes]) => `<${tag} ${Object.entries(attributes).map(([key, value]) => `${key}="${value}"`).join(' ')} />`).join('')}</svg>`
const withBreaks = (text) => text.replaceAll('\n', '<br>')
const navItems = [['Trang chủ', '#trang-chu'], ['Về chúng tôi', '#ve-chung-toi'], ['Giờ làm việc', '#gio-lam-viec'], ['Menu', '#menu'], ['Đặt app giao hàng', '#food-app'], ['Liên hệ', '#lien-he']]
const timeColumn = (items) => items.map((item) => { const [hour, minute] = item.time.split(':'); return `<b>${item.label}</b><strong>${hour} <i>:</i> ${minute}</strong>` }).join('')

document.querySelector('#app').innerHTML = `
  <header class="site-header">
    <a class="logo-box" href="#trang-chu" aria-label="Hẻm dessert"><img src="${menuLogo}" alt="Hẻm dessert"></a>
    <nav>${navItems.map(([label, target]) => `<a href="${target}">${label}</a>`).join('')}</nav>
    <a class="order-button header-order" href="${orderUrl}" target="_blank" rel="noreferrer">Đặt món</a>
    <button class="menu-toggle" type="button" aria-label="Mở menu" aria-expanded="false">${icon(Menu, 24)}</button>
  </header>
  <nav class="mobile-nav" hidden>${navItems.map(([label, target]) => `<a href="${target}">${label}</a>`).join('')}<a href="${orderUrl}" target="_blank" rel="noreferrer">Đặt món</a></nav>
  <main>
    <section id="trang-chu" class="hero" style="background-image:linear-gradient(90deg,#0008,#fff1),url('${hero.image}')"><div class="hero-content"><h1>${withBreaks(hero.title)}</h1><p>${hero.description}</p><div class="hero-actions"><a class="order-button yellow" href="${orderUrl}" target="_blank" rel="noreferrer">${hero.orderLabel}</a><a class="order-button coral" href="#food-app">${hero.appLabel}</a></div><div class="member-box"><img src="${member.qrImage}" alt="Mã QR Zalo Hẻm dessert"><div><b>${member.title}</b><p>${withBreaks(member.description)}</p></div></div></div></section>
    <section id="ve-chung-toi" class="about panel"><div class="about-logo"><img src="${hemLogo}" alt="Hẻm dessert"></div><div class="about-copy"><span class="accent-line"></span><h5>${about.eyebrow}</h5><h2>${withBreaks(about.title)}</h2>${about.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join('')}<a class="order-button yellow" href="${orderUrl}" target="_blank" rel="noreferrer">${about.buttonLabel}</a></div><div class="about-dots" aria-hidden="true"></div></section>
    <section id="gio-lam-viec" class="hours panel" style="background-image:linear-gradient(90deg,rgba(0,0,0,.44),rgba(0,0,0,.08)),url('${hoursBackground}')"><div class="hours-copy"><span class="accent-line"></span><h2>${hours.title}</h2><p>${hours.description}</p><a class="order-button yellow" href="${orderUrl}" target="_blank" rel="noreferrer">${hours.buttonLabel}</a></div><div class="time-card"><div class="time-group">${timeColumn(hours.items.slice(0, 2))}</div><div class="time-group">${timeColumn(hours.items.slice(2))}</div></div></section>
    <section id="menu" class="menu-section"><div class="menu-copy"><span class="accent-line"></span><h2>${menu.title}</h2><p>${withBreaks(menu.intro)}</p><p>${withBreaks(menu.policy)}</p><a class="order-button yellow" href="${orderUrl}" target="_blank" rel="noreferrer">${menu.buttonLabel}</a></div><img class="menu-image" src="${menu.image}" alt="${menu.imageAlt}"></section>
    <section id="food-app" class="apps panel"><span class="accent-line"></span><h5>${foodApps.eyebrow}</h5><h2>${foodApps.title}</h2><p>${withBreaks(foodApps.description)}</p><div class="app-grid">${foodApps.branches.map((branch) => `<article><b>${branch.name}</b><div><a class="vill" href="${branch.vill}" target="_blank" rel="noreferrer">VILL</a><a class="shopee" href="${branch.shopee}" target="_blank" rel="noreferrer">Shopee<br>Food</a><a class="grab" href="${branch.grab}" target="_blank" rel="noreferrer">Grab<br>Food</a></div></article>`).join('')}</div></section>
    <section id="lien-he" class="contact">${locations.map((location) => `<div><h2>${location.name}</h2><p>🏠 ${location.address}<br>📱 Hotline Zalo: <a href="tel:${location.phoneLink}">${location.phone}</a></p><h3>${location.tagline}</h3></div>`).join('')}</section>
  </main>
  <button class="back-top" type="button" aria-label="Lên đầu trang">↑</button>
  ${popup.enabled ? `<aside class="promotion-popup" role="dialog" aria-labelledby="popup-title"><button class="popup-close" type="button" aria-label="Đóng popup">×</button>${popup.image ? `<img src="${popup.image}" alt="">` : ''}<div><h2 id="popup-title">${popup.title}</h2><p>${withBreaks(popup.message)}</p><a class="order-button yellow" href="${orderUrl}" target="_blank" rel="noreferrer">${popup.buttonLabel}</a></div></aside>` : ''}
`

const toggle = document.querySelector('.menu-toggle')
const mobileNav = document.querySelector('.mobile-nav')
toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') === 'true'; toggle.setAttribute('aria-expanded', String(!open)); toggle.innerHTML = icon(open ? Menu : X, 24); mobileNav.hidden = open })
mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => toggle.click()))
document.querySelector('.back-top').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }))
document.querySelector('.popup-close')?.addEventListener('click', (event) => event.currentTarget.closest('.promotion-popup').remove())
