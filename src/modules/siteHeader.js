import { Menu, X } from 'lucide'

const renderIcon = (item, size = 24) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${item.map(([tag, attributes]) => `<${tag} ${Object.entries(attributes).map(([key, value]) => `${key}="${value}"`).join(' ')} />`).join('')}</svg>`

export const renderSubpageHeader = ({ baseUrl = '/', logoSrc, orderUrl = 'https://trasuahem.sapofnb.vn/', active = '' }) => {
  const links = [
    { id: 'home', label: 'Trang chủ', href: baseUrl },
    { id: 'menu', label: 'Menu', href: `${baseUrl}#menu` },
    { id: 'promotion', label: 'Khuyến mãi', href: `${baseUrl}promotion.html` },
    { id: 'wheel', label: 'Vòng quay', href: `${baseUrl}lucky-wheel.html` },
    { id: 'job', label: 'Tuyển dụng', href: `${baseUrl}job.html` },
  ]

  return `
    <header class="site-header hem-shared-header">
      <a class="logo-box" href="${baseUrl}" aria-label="Về trang chủ Hẻm dessert"><img src="${logoSrc}" alt="Hẻm dessert"></a>
      <nav aria-label="Điều hướng chính">${links.map((item) => `<a href="${item.href}"${item.id === active ? ' class="is-active" aria-current="page"' : ''}>${item.label}</a>`).join('')}</nav>
      <a class="order-button header-order" href="${orderUrl}" target="_blank" rel="noopener noreferrer">Đặt món</a>
      <button class="menu-toggle" type="button" aria-label="Mở menu" aria-expanded="false" aria-controls="mobile-navigation">${renderIcon(Menu, 24)}</button>
    </header>
    <nav id="mobile-navigation" class="mobile-nav" aria-label="Điều hướng trên điện thoại" hidden>
      ${links.map((item) => `<a href="${item.href}"${item.id === active ? ' class="is-active" aria-current="page"' : ''}>${item.label}</a>`).join('')}
      <a href="${orderUrl}" target="_blank" rel="noopener noreferrer">Đặt món ngay</a>
    </nav>
  `
}

export const initSubpageHeader = () => {
  const siteHeader = document.querySelector('.site-header')
  const toggle = document.querySelector('.menu-toggle')
  const mobileNav = document.querySelector('.mobile-nav')
  if (!toggle || !mobileNav) return

  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open))
    toggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu')
    toggle.innerHTML = renderIcon(open ? X : Menu, 24)
    mobileNav.hidden = !open
  }

  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'))
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !mobileNav.hidden) setMenu(false)
  })
  mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)))

  const updateScroll = () => siteHeader?.classList.toggle('is-scrolled', window.scrollY > 24)
  window.addEventListener('scroll', updateScroll, { passive: true })
  updateScroll()
}
