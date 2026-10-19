/**
 * HERO CUP 3D PARALLAX & INTERACTIVE DRINK SWITCHER
 * Hẻm dessert - Modern F&B Landing Experience
 */

export const initHeroCup = (options = {}) => {
  const {
    cupBoba,
    cupSaltCream,
  } = options

  const heroSection = document.querySelector('#trang-chu')
  const heroStage = document.querySelector('#hero-stage')
  const cup3D = document.querySelector('#hero-cup-3d')
  const cupImg = document.querySelector('#hero-cup-img')
  const glowAura = document.querySelector('.hero-glow-aura')
  const boba1 = document.querySelector('.particle-boba-1')
  const boba2 = document.querySelector('.particle-boba-2')
  const boba3 = document.querySelector('.particle-boba-3')
  const leaf1 = document.querySelector('.particle-leaf-1')
  const leaf2 = document.querySelector('.particle-leaf-2')

  const drinkTitle = document.querySelector('#hero-drink-title')
  const drinkTag = document.querySelector('.drink-card-tag')
  const switchBtns = document.querySelectorAll('.drink-switch-btn')

  if (!heroSection || !cup3D || !cupImg) return

  // ----------------------------------------------------
  // 1. DRINK SWITCHER LOGIC
  // ----------------------------------------------------
  const DRINKS = {
    boba: {
      img: cupBoba,
      title: 'Trà Sữa Hẻm Trân Châu',
      tag: 'Đậm vị trà truyền thống, trân châu hoàng kim dai dẻo',
      alt: 'Ly Trà Sữa Hẻm Trân Châu Hoàng Kim',
    },
    saltcream: {
      img: cupSaltCream,
      title: 'Trà Sữa Kem Muối',
      tag: 'Lớp kem mặn béo ngậy, cân bằng vị trà đậm đà',
      alt: 'Ly Trà Sữa Kem Muối Hẻm dessert',
    },
  }

  let currentDrink = 'boba'

  const setDrink = (key) => {
    if (key === currentDrink || !DRINKS[key]) return
    currentDrink = key
    const data = DRINKS[key]

    // Button states
    switchBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.drink === key)
    })

    // Animation transition
    cupImg.classList.add('is-switching')
    setTimeout(() => {
      cupImg.src = data.img
      cupImg.alt = data.alt
      if (drinkTitle) drinkTitle.textContent = data.title
      if (drinkTag) drinkTag.textContent = data.tag
      cupImg.classList.remove('is-switching')
    }, 250)
  }

  switchBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      setDrink(btn.dataset.drink)
    })
  })

  // ----------------------------------------------------
  // 2. 3D MOUSE PARALLAX WITH LERP (SMOOTH DAMPING)
  // ----------------------------------------------------
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  if (!isFinePointer) return

  let targetX = 0
  let targetY = 0
  let currentX = 0
  let currentY = 0
  let rafId = null
  let isHovering = false

  const onMouseMove = (e) => {
    const rect = heroSection.getBoundingClientRect()
    // Normalized coordinates from center: -0.5 to 0.5
    targetX = (e.clientX - rect.left) / rect.width - 0.5
    targetY = (e.clientY - rect.top) / rect.height - 0.5
    isHovering = true
  }

  const onMouseLeave = () => {
    targetX = 0
    targetY = 0
    isHovering = false
  }

  const lerp = (start, end, factor) => start + (end - start) * factor

  const renderLoop = () => {
    // Smooth dampening factor
    currentX = lerp(currentX, targetX, 0.08)
    currentY = lerp(currentY, targetY, 0.08)

    // Calculate rotation angles
    const rotateY = currentX * 22 // deg
    const rotateX = -currentY * 18 // deg
    const transZ = isHovering ? 20 : 0

    // Tilt the 3D cup
    cup3D.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(${transZ}px)`

    // Parallax depth particles
    if (boba1) {
      boba1.style.transform = `translate3d(${(currentX * 36).toFixed(1)}px, ${(currentY * 36).toFixed(1)}px, 40px)`
    }
    if (boba2) {
      boba2.style.transform = `translate3d(${(-currentX * 28).toFixed(1)}px, ${(-currentY * 28).toFixed(1)}px, 20px)`
    }
    if (boba3) {
      boba3.style.transform = `translate3d(${(currentX * 18).toFixed(1)}px, ${(currentY * 18).toFixed(1)}px, 15px)`
    }
    if (leaf1) {
      leaf1.style.transform = `translate3d(${(-currentX * 42).toFixed(1)}px, ${(-currentY * 35).toFixed(1)}px, 50px) rotate(${(currentX * 15).toFixed(1)}deg)`
    }
    if (leaf2) {
      leaf2.style.transform = `translate3d(${(currentX * 24).toFixed(1)}px, ${(currentY * 24).toFixed(1)}px, 25px) rotate(${(-currentX * 12).toFixed(1)}deg)`
    }
    if (glowAura) {
      glowAura.style.transform = `translate3d(${(currentX * -20).toFixed(1)}px, ${(currentY * -20).toFixed(1)}px, 0)`
    }

    rafId = requestAnimationFrame(renderLoop)
  }

  heroSection.addEventListener('mousemove', onMouseMove, { passive: true })
  heroSection.addEventListener('mouseleave', onMouseLeave, { passive: true })

  // Start the smooth render loop
  rafId = requestAnimationFrame(renderLoop)

  return () => {
    heroSection.removeEventListener('mousemove', onMouseMove)
    heroSection.removeEventListener('mouseleave', onMouseLeave)
    if (rafId) cancelAnimationFrame(rafId)
  }
}
