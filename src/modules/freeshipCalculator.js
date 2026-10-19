export const renderFreeshipCalculator = (container, locations = [], orderUrl = '#') => {
  const visibleLocations = locations.filter((loc) => loc.visible !== false)
  let selectedLocationIndex = 0
  let currentDistance = 0.4

  const tiers = [
    { maxKm: 0.5, minOrder: 55000, label: 'Dưới 0.5 km', minOrderLabel: '55.000đ' },
    { maxKm: 1.0, minOrder: 105000, label: 'Từ 0.5 km đến dưới 1.0 km', minOrderLabel: '105.000đ' },
    { maxKm: 1.5, minOrder: 155000, label: 'Từ 1.0 km đến dưới 1.5 km', minOrderLabel: '155.000đ' },
  ]

  const calculatePolicy = (dist) => {
    if (dist <= 0.5) {
      return {
        status: 'freeship',
        title: '🎉 Miễn Phí Giao Hàng Cho Đơn Từ 55.000đ',
        desc: 'Khoảng cách rất gần (< 0.5km)! Chỉ cần từ 2 ly trà là bạn đã được Hẻm tự giao miễn phí tận tay.',
        fallbackFee: 'Đơn dưới 55.000đ: phí ship đồng giá 10.000đ.',
        highlight: 'Chỉ cần đơn từ 55.000đ',
        canStoreDeliver: true,
      }
    } else if (dist <= 1.0) {
      return {
        status: 'freeship',
        title: '🎉 Miễn Phí Giao Hàng Cho Đơn Từ 105.000đ',
        desc: 'Khoảng cách từ 0.5km đến 1km: Đơn từ 3–4 ly là được quán giao miễn phí ngay tức thì.',
        fallbackFee: 'Đơn dưới 105.000đ: phí ship đồng giá 10.000đ.',
        highlight: 'Chỉ cần đơn từ 105.000đ',
        canStoreDeliver: true,
      }
    } else if (dist <= 1.5) {
      return {
        status: 'freeship',
        title: '🎉 Miễn Phí Giao Hàng Cho Đơn Từ 155.000đ',
        desc: 'Khoảng cách từ 1km đến 1.5km: Gom đơn cùng bạn bè hoặc đồng nghiệp để được miễn phí ship.',
        fallbackFee: 'Đơn dưới 155.000đ: phí ship đồng giá 10.000đ.',
        highlight: 'Chỉ cần đơn từ 155.000đ',
        canStoreDeliver: true,
      }
    } else {
      return {
        status: 'app-delivery',
        title: '🛵 Đặt Qua Food App Để Được Giao Nhanh Nhất',
        desc: 'Quán trực tiếp giao trong bán kính 1.5km. Với khoảng cách trên 1.5km, Hẻm kết nối đối tác ShopeeFood, GrabFood & VILL để giao nhanh, bảo quản đá lạnh sâu và áp mã giảm giá từ app!',
        fallbackFee: 'Phí ship tính theo biểu phí của ứng dụng.',
        highlight: 'Giao hàng qua Food App',
        canStoreDeliver: false,
      }
    }
  }

  const formatBranchName = (rawName) => {
    if (!rawName) return ''
    return rawName
      .replace(/LONG AN/i, 'Long An')
      .replace(/MỸ THO/i, 'Mỹ Tho')
      .replace(/SÀI GÒN/i, 'Sài Gòn')
      .replace(/^Hẻm dessert\s+/i, 'Hẻm dessert - ')
  }

  const getBranchArea = (name) => {
    const lower = (name || '').toLowerCase()
    if (lower.includes('long an') || lower.includes('tân an')) return 'TP. Tân An'
    if (lower.includes('mỹ tho') || lower.includes('tiền giang')) return 'TP. Mỹ Tho'
    return 'Hồ Chí Minh'
  }

  const initialLoc = visibleLocations[selectedLocationIndex] || visibleLocations[0] || { name: 'Hẻm dessert - Long An', phone: '088.626.1902' }
  const initialDisplayName = formatBranchName(initialLoc.name)
  const initialArea = getBranchArea(initialLoc.name)

  container.innerHTML = `
    <div class="calculator-card">
      <div class="calculator-header">
        <span class="calc-tag">TIỆN ÍCH GIAO HÀNG</span>
        <h3>Kiểm Tra Mốc Miễn Phí Ship Tận Tay</h3>
        <p>Với tiêu chí <em>"MỘT LY CŨNG GIAO"</em>, Hẻm hỗ trợ giao hàng tận nơi với chính sách freeship rõ ràng.</p>
      </div>

      <div class="calc-controls">
        <div class="calc-branch-select">
          <label id="calc-branch-label" for="custom-select-trigger">Chọn cửa hàng gần bạn:</label>
          <div class="custom-select-container" id="branch-select-container">
            <button
              type="button"
              id="custom-select-trigger"
              class="custom-select-trigger"
              aria-haspopup="listbox"
              aria-expanded="false"
              aria-labelledby="calc-branch-label custom-select-val"
            >
              <div class="select-trigger-left">
                <span class="select-store-icon" aria-hidden="true">📍</span>
                <div class="select-text-group">
                  <span class="custom-select-value" id="custom-select-val">${initialDisplayName}</span>
                  <span class="custom-select-sub" id="custom-select-sub">${initialArea}</span>
                </div>
              </div>
              <svg class="select-chevron" viewBox="0 0 20 20" fill="currentColor" width="18" height="18" aria-hidden="true">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </button>

            <div class="custom-select-dropdown" id="custom-select-dropdown" role="listbox" aria-labelledby="calc-branch-label">
              ${visibleLocations
                .map((loc, idx) => {
                  const isSelected = idx === selectedLocationIndex
                  const displayName = formatBranchName(loc.name)
                  const area = getBranchArea(loc.name)
                  return `
                <div
                  class="custom-option ${isSelected ? 'selected' : ''}"
                  role="option"
                  aria-selected="${isSelected}"
                  data-index="${idx}"
                  tabindex="0"
                >
                  <div class="option-content">
                    <span class="option-title">${displayName}</span>
                    <span class="option-desc">${area} • Hotline: ${loc.phone || ''}</span>
                  </div>
                  <span class="option-check" aria-hidden="true">${isSelected ? '✓' : ''}</span>
                </div>
              `
                })
                .join('')}
            </div>

            <!-- Native select for accessibility / fallback -->
            <select id="calc-branch" class="visually-hidden-select" tabindex="-1" aria-hidden="true">
              ${visibleLocations
                .map(
                  (loc, idx) => `
                <option value="${idx}" ${idx === selectedLocationIndex ? 'selected' : ''}>${formatBranchName(loc.name)}</option>
              `
                )
                .join('')}
            </select>
          </div>

          <div class="selected-store-bar" id="selected-store-bar">
            <span class="store-dot" aria-hidden="true"></span>
            <span class="store-bar-text">Cửa hàng: <strong id="bar-store-name">${initialDisplayName}</strong> • Hotline: <a id="bar-store-phone" href="tel:${initialLoc.phoneLink || initialLoc.phone || ''}" class="store-phone-link">${initialLoc.phone || ''}</a></span>
          </div>
        </div>

        <div class="calc-distance-box">
          <div class="distance-heading">
            <label for="distance-slider">Khoảng cách từ quán đến bạn:</label>
            <strong class="distance-badge" id="distance-val">${currentDistance} km</strong>
          </div>
          <input
            type="range"
            id="distance-slider"
            min="0.1"
            max="3.0"
            step="0.1"
            value="${currentDistance}"
            aria-label="Khoảng cách tính theo km"
          />
          <div class="quick-distance-buttons">
            <button type="button" class="quick-dist-btn" data-dist="0.3">&lt; 0.5km</button>
            <button type="button" class="quick-dist-btn" data-dist="0.8">0.8km</button>
            <button type="button" class="quick-dist-btn" data-dist="1.2">1.2km</button>
            <button type="button" class="quick-dist-btn" data-dist="2.0">&gt; 1.5km (App)</button>
          </div>
        </div>
      </div>

      <div class="calc-result" id="calc-result-box" aria-live="polite"></div>

      <div class="calc-actions">
        <a class="calc-order-cta" id="calc-cta-btn" href="${orderUrl}" target="_blank" rel="noopener noreferrer">
          Đặt đơn ngay để nhận Freeship ➔
        </a>
      </div>
    </div>
  `

  const slider = container.querySelector('#distance-slider')
  const distanceVal = container.querySelector('#distance-val')
  const resultBox = container.querySelector('#calc-result-box')
  const quickButtons = container.querySelectorAll('.quick-dist-btn')
  const branchSelect = container.querySelector('#calc-branch')
  const selectContainer = container.querySelector('#branch-select-container')
  const selectTrigger = container.querySelector('#custom-select-trigger')
  const selectDropdown = container.querySelector('#custom-select-dropdown')
  const selectVal = container.querySelector('#custom-select-val')
  const selectSub = container.querySelector('#custom-select-sub')
  const options = container.querySelectorAll('.custom-option')
  const barStoreName = container.querySelector('#bar-store-name')
  const barStorePhone = container.querySelector('#bar-store-phone')

  const updateResult = () => {
    distanceVal.textContent = `${Number(currentDistance).toFixed(1)} km`
    const res = calculatePolicy(Number(currentDistance))
    const currentLoc = visibleLocations[selectedLocationIndex] || visibleLocations[0] || {}
    const locName = formatBranchName(currentLoc.name)

    resultBox.className = `calc-result result-${res.status}`
    resultBox.innerHTML = `
      <div class="res-badge">${res.highlight}</div>
      <h4 class="res-title">${res.title}</h4>
      <p class="res-desc">${res.desc}</p>
      <div class="res-fee-note">ℹ️ ${res.fallbackFee}</div>
    `

    const ctaBtn = container.querySelector('#calc-cta-btn')
    if (res.canStoreDeliver) {
      ctaBtn.textContent = `Đặt đơn ${locName} giao ngay ➔`
      ctaBtn.href = orderUrl
      ctaBtn.target = '_blank'
      ctaBtn.rel = 'noopener noreferrer'
    } else {
      ctaBtn.textContent = 'Xem link đặt trên ShopeeFood / Grab / Vill ➔'
      ctaBtn.href = '#food-app'
      ctaBtn.target = '_self'
      ctaBtn.removeAttribute('rel')
    }
  }

  // Custom Select Dropdown Toggle
  const toggleDropdown = (open) => {
    const isOpen = open !== undefined ? open : !selectContainer.classList.contains('is-open')
    if (isOpen) {
      selectContainer.classList.add('is-open')
      selectTrigger.setAttribute('aria-expanded', 'true')
      const currentSelected = selectDropdown.querySelector('.custom-option.selected')
      if (currentSelected) currentSelected.focus()
    } else {
      selectContainer.classList.remove('is-open')
      selectTrigger.setAttribute('aria-expanded', 'false')
    }
  }

  selectTrigger.addEventListener('click', (e) => {
    e.stopPropagation()
    toggleDropdown()
  })

  // Select Option Click
  options.forEach((opt) => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation()
      const idx = Number(opt.dataset.index)
      selectBranchByIndex(idx)
      toggleDropdown(false)
      selectTrigger.focus()
    })

    opt.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        const idx = Number(opt.dataset.index)
        selectBranchByIndex(idx)
        toggleDropdown(false)
        selectTrigger.focus()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        const next = opt.nextElementSibling
        if (next && next.classList.contains('custom-option')) next.focus()
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const prev = opt.previousElementSibling
        if (prev && prev.classList.contains('custom-option')) prev.focus()
      } else if (e.key === 'Escape') {
        toggleDropdown(false)
        selectTrigger.focus()
      }
    })
  })

  const selectBranchByIndex = (idx) => {
    selectedLocationIndex = idx
    const loc = visibleLocations[idx]
    if (!loc) return

    const displayName = formatBranchName(loc.name)
    const area = getBranchArea(loc.name)

    selectVal.textContent = displayName
    selectSub.textContent = area

    if (barStoreName) barStoreName.textContent = displayName
    if (barStorePhone) {
      barStorePhone.textContent = loc.phone || ''
      barStorePhone.href = `tel:${loc.phoneLink || loc.phone || ''}`
    }

    options.forEach((o) => {
      const isSelected = Number(o.dataset.index) === idx
      o.classList.toggle('selected', isSelected)
      o.setAttribute('aria-selected', isSelected ? 'true' : 'false')
      const checkSpan = o.querySelector('.option-check')
      if (checkSpan) checkSpan.textContent = isSelected ? '✓' : ''
    })

    if (branchSelect) {
      branchSelect.value = String(idx)
    }

    updateResult()
  }

  // Close dropdown on click outside
  document.addEventListener('click', (e) => {
    if (!selectContainer.contains(e.target)) {
      toggleDropdown(false)
    }
  })

  // Keydown on trigger
  selectTrigger.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleDropdown(true)
    } else if (e.key === 'Escape') {
      toggleDropdown(false)
    }
  })

  slider.addEventListener('input', (e) => {
    currentDistance = e.target.value
    updateResult()
  })

  quickButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      currentDistance = btn.dataset.dist
      slider.value = currentDistance
      updateResult()
    })
  })

  if (branchSelect) {
    branchSelect.addEventListener('change', (e) => {
      selectBranchByIndex(Number(e.target.value))
    })
  }

  updateResult()
}
