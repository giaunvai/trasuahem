export const renderQuickActions = (container, { orderUrl, promotionUrl, locations = [] }) => {
  const visibleLocations = locations.filter((loc) => loc.visible !== false)
  const defaultPhone = visibleLocations[0]?.phoneLink || '0886261902'

  container.innerHTML = `
    <aside class="mobile-quick-bar" aria-label="Thao tác nhanh">
      <a class="quick-btn btn-order" href="${orderUrl}" target="_blank" rel="noopener noreferrer">
        <span class="quick-icon" aria-hidden="true">🛵</span>
        <span class="quick-text">Đặt món</span>
      </a>
      <a class="quick-btn btn-phone" href="tel:${defaultPhone}">
        <span class="quick-icon" aria-hidden="true">📞</span>
        <span class="quick-text">Hotline</span>
      </a>
      <a class="quick-btn btn-locations" href="#lien-he">
        <span class="quick-icon" aria-hidden="true">📍</span>
        <span class="quick-text">Cửa hàng</span>
      </a>
      <a class="quick-btn btn-promo" href="${promotionUrl}">
        <span class="quick-icon" aria-hidden="true">🎁</span>
        <span class="quick-text">Ưu đãi</span>
      </a>
    </aside>
  `
}
