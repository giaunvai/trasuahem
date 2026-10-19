/**
 * HERO CUP 3D PARALLAX & HIGH-PERFORMANCE MULTI-IMAGE CAROUSEL
 * Hẻm dessert - Modern F&B Experience
 */

export const initHeroCup = (options = {}) => {
  const { drinks = [] } = options

  const heroSection = document.querySelector('#trang-chu')
  const heroStage = document.querySelector('#hero-stage')
  const cup3D = document.querySelector('#hero-cup-3d')
  const cupImages = Array.from(document.querySelectorAll('.hero-cup-img'))
  const glowAura = document.querySelector('.hero-glow-aura')
  const drinkTitle = document.querySelector('#hero-drink-title')
  const drinkCounter = document.querySelector('#hero-drink-counter')
  const dotsContainer = document.querySelector('#hero-drink-dots')
  const prevBtn = document.querySelector('.cup-nav-prev')
  const nextBtn = document.querySelector('.cup-nav-next')

  if (!heroSection || !cup3D || !cupImages.length || !drinks.length) return

  // Pre-cache and pre-decode all drink images in GPU memory
  drinks.forEach((d) => {
    if (d.img) {
      const preload = new Image()
      preload.src = d.img
      preload.decode?.().catch(() => {})
    }
  })

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
  // 2. INSTANT ZERO-LATENCY SWITCH FUNCTION (GPU ACCELERATED)
  // ----------------------------------------------------
  const setDrink = (targetIndex, direction = 1) => {
    // Cyclic wrapping
    if (targetIndex < 0) {
      targetIndex = drinks.length - 1
    } else if (targetIndex >= drinks.length) {
      targetIndex = 0
    }

    if (targetIndex === currentIndex) return

    const prevIndex = currentIndex
    currentIndex = targetIndex
    const drink = drinks[currentIndex]

    // Instant hardware-accelerated class transitions
    cupImages.forEach((img, idx) => {
      if (idx === currentIndex) {
        img.className = 'hero-cup-img active'
      } else if (idx === prevIndex) {
        img.className = direction >= 0 ? 'hero-cup-img prev-slide' : 'hero-cup-img next-slide'
      } else {
        img.className = 'hero-cup-img'
      }
    })

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

    // Update title
    if (drinkTitle) {
      drinkTitle.textContent = drink.name
    }

    // Update glow aura color smoothly
    if (glowAura && drink.glow) {
      glowAura.style.background = `radial-gradient(circle, ${drink.glow} 0%, rgba(0, 0, 0, 0) 70%)`
    }
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
