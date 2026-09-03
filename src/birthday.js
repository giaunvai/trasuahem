import './birthday.css'
import { ArrowRight, CalendarDays, Gift, MapPin, Phone } from 'lucide'
import menuLogo from './assets/logo.png'
const campaignImages = import.meta.glob('./assets/*.{png,jpg,jpeg,JPG}', { eager: true, query: '?url', import: 'default' })

const baseUrl = import.meta.env.BASE_URL
const assetUrl = (path) => path.startsWith('/') ? `${baseUrl}${path.slice(1)}` : path
const campaignImageUrl = (name) => campaignImages[`./assets/${name}`] || ''
const icon = (item, size = 20) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${item.map(([tag, attributes]) => `<${tag} ${Object.entries(attributes).map(([key, value]) => `${key}="${value}"`).join(' ')} />`).join('')}</svg>`
const withBreaks = (text = '') => text.replaceAll('\n', '<br>')
const fallback = { campaignType: 'birthday', campaignName: 'Sinh nhật Hẻm dessert', campaignYear: '01/07 hằng năm', recurringDate: '07-01', orderUrl: 'https://trasuahem.sapofnb.vn/', heroImage: '/images/original-0.jpg', heroImageAlt: 'Ưu đãi sinh nhật Hẻm dessert', badge: 'BIRTHDAY TREAT', title: 'Sinh nhật này,\nHẻm mời bạn một niềm vui', description: 'Mua 2 ly, tặng 1 ly cùng nhóm bạn.', offerValue: 'MUA 2 TẶNG 1', offerTitle: 'Một tháng đặc biệt, một phần quà thật riêng', offerDescription: 'Liên hệ Hẻm để biết điều kiện chương trình.', offerNote: '', steps: [], terms: [], locations: [] }
const campaignFile = new URLSearchParams(window.location.search).get('campaign') || document.body.dataset.campaign || 'campaign'
const campaign = await fetch(`${baseUrl}content/${campaignFile}.json`).then((response) => response.ok ? response.json() : Promise.reject()).catch(() => fallback)
document.body.classList.toggle('campaign-inactive', campaign.active === false)
document.body.classList.add(`campaign-theme-${campaign.theme || 'thuong-hieu'}`)
const track = (name, parameters = {}) => { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: name, ...parameters }); window.gtag?.('event', name, parameters); window.fbq?.('trackCustom', name, parameters) }
const app = document.querySelector('#birthday-app')
app.innerHTML = `
  <header class="birthday-header"><a class="birthday-brand" href="${baseUrl}" aria-label="Về trang chủ Hẻm dessert"><img src="${menuLogo}" alt="Hẻm dessert"></a><a class="birthday-home" href="${baseUrl}">Trang chủ</a></header>
  <main>
    <section class="birthday-hero campaign-event">
      <div class="birthday-hero-copy"><p class="campaign-kicker">${campaign.badge} / ${campaign.campaignYear}</p><h1>${withBreaks(campaign.title)}</h1><p class="birthday-lead">${campaign.description}</p><a class="birthday-cta birthday-cta-primary" href="${campaign.orderUrl}" target="_blank" rel="noreferrer">Đặt món ngay ${icon(ArrowRight, 18)}</a><p class="campaign-microcopy">Trà đậm, ít ngọt. Một vị riêng cho ngày của bạn.</p></div>
      <div class="birthday-hero-art"><img src="${assetUrl(campaign.heroImage)}" alt="${campaign.heroImageAlt}"></div>
    </section>
    <section class="offer-section campaign-event" aria-labelledby="offer-title"><div class="offer-stamp">${icon(Gift, 25)}<span>Quà<br>ưu đãi</span></div><div class="offer-main"><p class="section-label">${campaign.campaignName}</p><p class="offer-value">${campaign.offerValue}</p><h2 id="offer-title">${campaign.offerTitle}</h2><p>${campaign.offerDescription}</p><p class="offer-note">${campaign.offerNote}</p></div><div class="countdown" aria-live="polite"><p>Chương trình còn</p><strong data-countdown>-- ngày</strong><span>${campaign.campaignYear}</span></div></section>
    <section class="product-section campaign-event" aria-labelledby="product-title"><div class="product-copy"><p class="section-label">Vị riêng của Hẻm</p><h2 id="product-title">Chọn ly bạn thích,<br>Hẻm chuẩn bị phần quà.</h2><p>Những ly nước quen thuộc của Hẻm được giữ nguyên màu sắc, topping và logo thương hiệu trong thiết kế campaign.</p><a class="birthday-cta birthday-cta-primary" href="${campaign.orderUrl}" target="_blank" rel="noreferrer">Xem menu và đặt món ${icon(ArrowRight, 18)}</a></div><div class="product-collage">${(campaign.productImages || []).map((image) => `<figure><img src="${campaignImageUrl(image.file)}" alt="${image.alt}" loading="lazy" decoding="async"><figcaption>${image.name}</figcaption></figure>`).join('')}</div></section>
    <section class="steps-section" aria-labelledby="steps-title"><div class="section-intro"><p class="section-label">Thật đơn giản</p><h2 id="steps-title">Nhận ưu đãi<br>cùng Hẻm</h2></div><div class="steps-grid">${campaign.steps.map((step) => `<article class="step-card"><b>${step.number}</b><h3>${step.title}</h3><p>${step.description}</p></article>`).join('')}</div></section>
    <section class="contact-section" aria-labelledby="contact-title"><div><p class="section-label">Cần hỗ trợ?</p><h2 id="contact-title">Hẻm ở đây<br>để đồng hành cùng bạn.</h2><p>Liên hệ chi nhánh gần bạn để xác nhận ưu đãi trước khi đặt món.</p></div><div class="contact-list">${campaign.locations.map((location) => `<div class="contact-item"><span>${icon(MapPin, 19)}</span><div><strong>${location.name}</strong><a href="tel:${location.phoneLink}">${icon(Phone, 16)} ${location.phone}</a></div></div>`).join('')}</div></section>
    <section class="terms-section" aria-labelledby="terms-title"><div><p class="section-label">Thông tin chương trình</p><h2 id="terms-title">Điều kiện áp dụng</h2></div><ul>${campaign.terms.map((term) => `<li>${term}</li>`).join('')}</ul></section>
  </main>
  <footer class="birthday-footer"><span>Hẻm dessert</span><a class="birthday-cta" href="${campaign.orderUrl}" target="_blank" rel="noreferrer">Đặt món ngay ${icon(ArrowRight, 18)}</a></footer>
`
const [recurringMonth, recurringDay] = (campaign.recurringDate || '01-01').split('-').map(Number)
const nextCampaignDate = () => { const now = new Date(); const target = campaign.endDate ? new Date(`${campaign.endDate}T23:59:59+07:00`) : new Date(now.getFullYear(), recurringMonth - 1, recurringDay, 23, 59, 59); if (!campaign.endDate && target < now) target.setFullYear(now.getFullYear() + 1); return target }
const countdown = document.querySelector('[data-countdown]')
const updateCountdown = () => { const days = Math.max(0, Math.ceil((nextCampaignDate() - new Date()) / 86400000)); countdown.textContent = days ? `${days} ngày` : 'Hôm nay' }
updateCountdown()
setInterval(updateCountdown, 3600000)
document.addEventListener('click', (event) => { const link = event.target.closest('a'); if (link) track('birthday_cta_click', { cta_text: link.textContent.trim(), cta_url: link.href }) })
track('campaign_landing_view', { campaign_type: campaign.campaignType, campaign_year: campaign.campaignYear, campaign_page: campaignFile, page_location: window.location.href })
