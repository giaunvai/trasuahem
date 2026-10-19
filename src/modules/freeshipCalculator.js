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

  container.innerHTML = `
    <div class="calculator-card">
      <div class="calculator-header">
        <span class="calc-tag">TIỆN ÍCH GIAO HÀNG</span>
        <h3>Kiểm Tra Mốc Miễn Phí Ship Tận Tay</h3>
        <p>Với tiêu chí <em>"MỘT LY CŨNG GIAO"</em>, Hẻm hỗ trợ giao hàng tận nơi với chính sách freeship rõ ràng.</p>
      </div>

      <div class="calc-controls">
        <div class="calc-branch-select">
          <label for="calc-branch">Chọn cửa hàng gần bạn:</label>
          <select id="calc-branch" class="branch-dropdown">
            ${visibleLocations
              .map(
                (loc, idx) => `
              <option value="${idx}">${loc.name}</option>
            `
              )
              .join('')}
          </select>
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

  const updateResult = () => {
    distanceVal.textContent = `${Number(currentDistance).toFixed(1)} km`
    const res = calculatePolicy(Number(currentDistance))

    resultBox.className = `calc-result result-${res.status}`
    resultBox.innerHTML = `
      <div class="res-badge">${res.highlight}</div>
      <h4 class="res-title">${res.title}</h4>
      <p class="res-desc">${res.desc}</p>
      <div class="res-fee-note">ℹ️ ${res.fallbackFee}</div>
    `

    const ctaBtn = container.querySelector('#calc-cta-btn')
    if (res.canStoreDeliver) {
      ctaBtn.textContent = 'Đặt đơn quán giao ngay ➔'
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

  branchSelect.addEventListener('change', (e) => {
    selectedLocationIndex = Number(e.target.value)
    updateResult()
  })

  updateResult()
}
