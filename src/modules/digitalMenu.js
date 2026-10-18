import { MENU_CATEGORIES, MENU_ITEMS } from '../data/menuData.js'
import defaultDrinkImg from '../assets/tra_sua_hem_noPhone.webp'

export const renderDigitalMenu = (container, orderUrl) => {
  let activeCategory = 'all'
  let searchQuery = ''

  container.innerHTML = `
    <div class="digital-menu-container">
      <div class="digital-menu-header">
        <div class="menu-search-box">
          <span class="search-icon" aria-hidden="true">🔍</span>
          <input
            type="search"
            class="menu-search-input"
            placeholder="Tìm món yêu thích (kem muối, ô long, đào, topping...)"
            aria-label="Tìm kiếm món trong menu"
          />
        </div>
        <div class="menu-categories" role="tablist" aria-label="Danh mục món">
          ${MENU_CATEGORIES.map(
            (cat) => `
            <button
              type="button"
              role="tab"
              class="category-pill ${cat.id === 'all' ? 'is-active' : ''}"
              data-category="${cat.id}"
              aria-selected="${cat.id === 'all'}"
            >
              <span>${cat.icon}</span> ${cat.name}
            </button>
          `
          ).join('')}
        </div>
      </div>

      <div class="digital-menu-status" aria-live="polite"></div>

      <div class="digital-menu-grid" id="digital-menu-items"></div>

      <div class="digital-menu-footer">
        <p class="menu-note">
          💡 <strong>Gu Hẻm:</strong> Trà đậm - Ít ngọt. Bạn có thể ghi chú điều chỉnh độ ngọt (0%, 30%, 50%, 70%) khi đặt món.
        </p>
      </div>
    </div>
  `

  const itemsGrid = container.querySelector('#digital-menu-items')
  const statusEl = container.querySelector('.digital-menu-status')
  const searchInput = container.querySelector('.menu-search-input')
  const categoryPills = container.querySelectorAll('.category-pill')

  const filterItems = () => {
    const q = searchQuery.toLowerCase().trim()
    return MENU_ITEMS.filter((item) => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(q)))
      return matchCat && matchSearch
    })
  }

  const renderItems = () => {
    const items = filterItems()
    statusEl.textContent = `Hiển thị ${items.length} món`

    if (items.length === 0) {
      itemsGrid.innerHTML = `
        <div class="menu-empty-state">
          <p>🍃 Không tìm thấy món phù hợp với từ khóa "<strong>${searchQuery}</strong>".</p>
          <button type="button" class="reset-search-btn">Xem tất cả món</button>
        </div>
      `
      itemsGrid.querySelector('.reset-search-btn')?.addEventListener('click', () => {
        searchInput.value = ''
        searchQuery = ''
        activeCategory = 'all'
        categoryPills.forEach((p) => {
          const isAll = p.dataset.category === 'all'
          p.classList.toggle('is-active', isAll)
          p.setAttribute('aria-selected', String(isAll))
        })
        renderItems()
      })
      return
    }

    itemsGrid.innerHTML = items
      .map((item) => {
        const itemImg = item.image || defaultDrinkImg
        const badgeHtml = item.badge
          ? `<span class="item-badge badge-${item.badgeType || 'default'}">${item.badge}</span>`
          : ''
        const tagsHtml = (item.tags || [])
          .map((t) => `<span class="item-tag">${t}</span>`)
          .join('')

        return `
        <article class="menu-item-card" data-category="${item.category}">
          <div class="item-visual">
            <img src="${itemImg}" alt="${item.name}" loading="lazy" decoding="async" />
            ${badgeHtml}
          </div>
          <div class="item-details">
            <div class="item-heading">
              <h3 class="item-name">${item.name}</h3>
              <span class="item-price">${item.priceLabel}</span>
            </div>
            <p class="item-desc">${item.description}</p>
            <div class="item-tags">${tagsHtml}</div>
            <div class="item-actions">
              <a
                class="item-order-btn"
                href="${orderUrl}"
                target="_blank"
                rel="noopener noreferrer"
                title="Đặt món ${item.name}"
              >
                Đặt món ngay ➔
              </a>
            </div>
          </div>
        </article>
      `
      })
      .join('')
  }

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value
    renderItems()
  })

  categoryPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      activeCategory = pill.dataset.category
      categoryPills.forEach((p) => {
        const isActive = p === pill
        p.classList.toggle('is-active', isActive)
        p.setAttribute('aria-selected', String(isActive))
      })
      renderItems()
    })
  })

  renderItems()
}
