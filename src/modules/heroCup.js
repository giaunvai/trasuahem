/**
 * HERO CUP 3D PARALLAX & AUTO-SLIDING DRINK CAROUSEL
 * Hẻm dessert - Modern F&B Experience
 */

export const initHeroCup = (options = {}) => {
  const { drinks = [] } = options

  const heroSection = document.querySelector('#trang-chu')
  const heroStage = document.querySelector('#hero-stage')
  const cup3D = document.querySelector('#hero-cup-3d')
  const cupImg = document.querySelector('#hero-cup-img')
  const glowAura = document.querySelector('.hero-glow-aura')
  const drinkTitle = document.querySelector('#hero-drink-title')
  const drinkCounter = document.querySelector('#hero-drink-counter')
  const dotsContainer = document.querySelector('#hero-drink-dots')
  const prevBtn = document.querySelector('.cup-nav-prev')
  const nextBtn = document.querySelector('.cup-nav-next')

  if (!heroSection || !cup3D || !cupImg || !drinks.length) return

  let currentIndex = 0
  let autoSlideTimer = null
  let isHovered = false
  const AUTOPLAY_INTERVAL = 3800

  // ----------------------------------------------------
  // 1. RENDER DOTS
  // ----------------------------------------------------
  if (dotsContainer) {
    dotsContainer.innerHTML = drinks.map((drink, i) => `
      <button
        class="cup-dot ${i === 0 ? 'active' : ''}"
        type="button"
        data-index="${i}"
        aria-label="Xem ${drink.name}"
        aria-selected="${i === 0 ? 'true' : 'false'}"
        role="tab"
      ></button>
    `).join('')
  }

  const dotButtons = dotsContainer ? dotsContainer.querySelectorAll('.cup-dot') : []

  // ----------------------------------------------------
  // 2. SWITCH DRINK FUNCTION
  // ----------------------------------------------------
  let isTransitioning = false

  const setDrink = (targetIndex, direction = 1) => {
    if (isTransitioning) return
    isTransitioning = true

    // Normalize target index (cyclic)
    if (targetIndex < 0) {
      targetIndex = drinks.length - 1
    } else if (targetIndex >= drinks.length) {
      targetIndex = 0
    }

    currentIndex = targetIndex
    const drink = drinks[currentIndex]

    // Update dots
    dotButtons.forEach((dot, idx) => {
      const isActive = idx === currentIndex
      dot.classList.toggle('active', isActive)
      dot.setAttribute('aria-selected', String(isActive))
    })

    // Update counter
    if (drinkCounter) {
      drinkCounter.textContent = `${currentIndex + 1} / ${drinks.length}`
    }

    // Slide animation on cup
    const slideOutClass = direction >= 0 ? 'slide-out-left' : 'slide-out-right'
    const slideInClass = direction >= 0 ? 'slide-in-right' : 'slide-in-left'

    cupImg.classList.add(slideOutClass)

    setTimeout(() => {
      cupImg.src = drink.img
      cupImg.alt = drink.alt || drink.name
      if (drinkTitle) {
        drinkTitle.textContent = drink.name
      }

      // Update glow aura color if provided
      if (glowAura && drink.glow) {
        glowAura.style.background = `radial-gradient(circle, ${drink.glow} 0%, rgba(0, 0, 0, 0) 70%)`
      }

      cupImg.classList.remove(slideOutClass)
      cupImg.classList.add(slideInClass)

      requestAnimationFrame(() => {
        setTimeout(() => {
          cupImg.classList.remove(slideInClass)
          isTransitioning = false
        }, 280)
      })
    }, 220)
  }

  const nextDrink = () => setDrink(currentIndex + 1, 1)
  const prevDrink = () => setDrink(currentIndex - 1, -1)

  // Arrow button events
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      nextDrink()
      resetAutoSlide()
    })
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      prevDrink()
      resetAutoSlide()
    })
  }

  // Dots button events
  dotButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      const idx = parseInt(btn.dataset.index, 10)
      if (idx !== currentIndex) {
        setDrink(idx, idx > currentIndex ? 1 : -1)
        resetAutoSlide()
      }
    })
  })

  // Keyboard navigation
  heroStage?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      nextDrink()
      resetAutoSlide()
    } else if (e.key === 'ArrowLeft') {
      prevDrink()
      resetAutoSlide()
    }
  })

  // ----------------------------------------------------
  // 3. AUTO-SLIDE LOGIC (PAUSE ON HOVER)
  // ----------------------------------------------------
  const startAutoSlide = () => {
    if (autoSlideTimer) clearInterval(autoSlideTimer)
    autoSlideTimer = setInterval(() => {
      if (!isHovered) {
        nextDrink()
      }
    }, AUTOPLAY_INTERVAL)
  }

  const stopAutoSlide = () => {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer)
      autoSlideTimer = null
    }
  }

  const resetAutoSlide = () => {
    stopAutoSlide()
    startAutoSlide()
  }

  heroSection?.addEventListener('mouseenter', () => {
    isHovered = true
  })

  heroSection?.addEventListener('mouseleave', () => {
    isHovered = false
  })

  // Touch Swipe for Mobile
  let touchStartX = 0
  let touchEndX = 0

  heroStage?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX
    isHovered = true
  }, { passive: true })

  heroStage?.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX
    const diff = touchStartX - touchEndX
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextDrink()
      } else {
        prevDrink()
      }
      resetAutoSlide()
    }
    // Resume autoplay after 3 seconds
    setTimeout(() => {
      isHovered = false
    }, 3000)
  }, { passive: true })

  startAutoSlide()

  // ----------------------------------------------------
  // 4. 3D MOUSE PARALLAX WITH LERP (SMOOTH DAMPING)
  // ----------------------------------------------------
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  if (!isFinePointer) return

  let targetX = 0
  let targetY = 0
  let currentX = 0
  let currentY = 0
  let rafId = null

  const onMouseMove = (e) => {
    const rect = heroSection.getBoundingClientRect()
    targetX = (e.clientX - rect.left) / rect.width - 0.5
    targetY = (e.clientY - rect.top) / rect.height - 0.5
  }

  const onMouseLeave = () => {
    targetX = 0
    targetY = 0
    isHovered = false
  }

  const lerp = (start, end, factor) => start + (end - start) * factor

  const renderLoop = () => {
    currentX = lerp(currentX, targetX, 0.08)
    currentY = lerp(currentY, targetY, 0.08)

    const rotateY = currentX * 22
    const rotateX = -currentY * 18
    const transZ = isHovered ? 20 : 0

    cup3D.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(${transZ}px)`

    if (glowAura) {
      glowAura.style.transform = `translate3d(${(currentX * -18).toFixed(1)}px, ${(currentY * -18).toFixed(1)}px, 0)`
    }

    rafId = requestAnimationFrame(renderLoop)
  }

  heroSection.addEventListener('mousemove', onMouseMove, { passive: true })
  heroSection.addEventListener('mouseleave', onMouseLeave, { passive: true })

  rafId = requestAnimationFrame(renderLoop)

  return () => {
    stopAutoSlide()
    heroSection.removeEventListener('mousemove', onMouseMove)
    heroSection.removeEventListener('mouseleave', onMouseLeave)
    if (rafId) cancelAnimationFrame(rafId)
  }
}
