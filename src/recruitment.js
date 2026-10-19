import './style.css'
import './interactive.css'
import './fonts.js'
import './recruitment.css'
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Heart,
  MapPin,
  Menu,
  Phone,
  RefreshCw,
  Send,
  Sparkles,
  Upload,
  Users,
  X,
} from 'lucide'
import menuLogo from './assets/branding/logo.png'
import defaultPoster from './assets/recruitment/tuyen_dung_hem.png'

const STORAGE_KEY = 'hem_recruitment_poster_custom'
const baseUrl = import.meta.env.BASE_URL

const escapeHtml = (value = '') =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

const icon = (item, size = 20) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${item.map(([tag, attributes]) => `<${tag} ${Object.entries(attributes).map(([key, value]) => `${key}="${value}"`).join(' ')} />`).join('')}</svg>`

// Load site configuration for locations & orderUrl
let siteData = { orderUrl: 'https://trasuahem.sapofnb.vn/', locations: [] }
try {
  const res = await fetch(`${baseUrl}content/site.json`)
  if (res.ok) {
    siteData = await res.json()
  }
} catch (e) {
  console.warn('Could not load site.json, using defaults', e)
}

const locations = siteData.locations || []
const orderUrl = siteData.orderUrl || 'https://trasuahem.sapofnb.vn/'

const navLinks = [
  ['Trang chủ', `${baseUrl}#trang-chu`],
  ['Menu', `${baseUrl}#menu`],
  ['Về chúng tôi', `${baseUrl}#ve-chung-toi`],
  ['Giờ làm việc', `${baseUrl}#gio-lam-viec`],
  ['App giao hàng', `${baseUrl}#food-app`],
  ['Tuyển dụng', `${baseUrl}tuyen-dung.html`],
]

const app = document.querySelector('#recruitment-app')

app.innerHTML = `
  <header class="site-header">
    <a class="logo-box" href="${baseUrl}" aria-label="Hẻm dessert"><img src="${menuLogo}" alt="Hẻm dessert"></a>
    <nav aria-label="Điều hướng chính">${navLinks.map(([label, href]) => `<a href="${href}" class="${label === 'Tuyển dụng' ? 'is-active' : ''}">${label}</a>`).join('')}</nav>
    <a class="order-button header-order" href="${orderUrl}" target="_blank" rel="noopener noreferrer">Đặt món</a>
    <button class="menu-toggle" type="button" aria-label="Mở menu" aria-expanded="false" aria-controls="mobile-navigation">${icon(Menu, 24)}</button>
  </header>
  <nav id="mobile-navigation" class="mobile-nav" aria-label="Điều hướng trên điện thoại" hidden>
    ${navLinks.map(([label, href]) => `<a href="${href}">${label}</a>`).join('')}
    <a href="${orderUrl}" target="_blank" rel="noopener noreferrer">Đặt món</a>
  </nav>

  <main class="recruitment-main">
    <section class="rec-hero">
      <div class="rec-badge">${icon(Sparkles, 16)} Gia nhập gia đình Hẻm dessert</div>
      <h1>Cơ Hội Việc Làm & Tuyển Dụng</h1>
      <p>Hẻm dessert tìm kiếm những bạn trẻ nhiệt huyết, yêu thích trà sữa và mong muốn làm việc trong môi trường năng động, vui vẻ, xoay ca linh hoạt theo lịch học.</p>
    </section>

    <div class="rec-layout-grid">
      <!-- Cột Trái: Poster Tuyển Dụng & Công Cụ Tải Lên -->
      <aside class="rec-poster-card" aria-label="Thông tin poster tuyển dụng">
        <div class="poster-header">
          <h2>${icon(Briefcase, 20)} Poster Tuyển Dụng</h2>
          <span id="poster-status-tag" class="poster-tag">Ảnh mẫu</span>
        </div>

        <div id="poster-drop-zone" class="poster-frame" title="Bấm hoặc kéo thả ảnh vào đây để tải lên poster mới">
          <img id="recruitment-poster-img" class="poster-img" src="${defaultPoster}" alt="Poster Tuyển Dụng Hẻm dessert" loading="eager" />
          <div class="poster-overlay-cue">
            ${icon(Upload, 32)}
            <span>Kéo thả ảnh hoặc bấm để thay đổi poster</span>
          </div>
        </div>

        <input type="file" id="poster-file-input" accept="image/*" style="display: none;" />

        <div class="poster-actions-panel">
          <button type="button" id="btn-trigger-upload" class="btn-upload-poster">
            ${icon(Upload, 18)} Tải lên ảnh tuyển dụng mới
          </button>
          <div class="poster-sub-actions">
            <button type="button" id="btn-lightbox" class="btn-poster-action" title="Xem phóng to poster">
              ${icon(Eye, 16)} Xem phóng to
            </button>
            <button type="button" id="btn-download-poster" class="btn-poster-action" title="Tải ảnh về máy">
              ${icon(Download, 16)} Tải ảnh về
            </button>
          </div>
          <button type="button" id="btn-reset-poster" class="btn-poster-action" style="display: none;" title="Khôi phục ảnh mẫu ban đầu">
            ${icon(RefreshCw, 15)} Khôi phục ảnh mặc định
          </button>
          <p class="poster-tip">💡 <strong>Mẹo:</strong> Bạn có thể tải lên ảnh poster mới bất kỳ lúc nào. Ảnh sẽ được tự động lưu lại trên trình duyệt của bạn.</p>
        </div>
      </aside>

      <!-- Cột Phải: Chi tiết công việc & Đăng ký -->
      <section class="rec-content-column" aria-label="Chi tiết quyền lợi và ứng tuyển">
        <!-- Card 1: Vị trí & Lương thưởng -->
        <article class="rec-card">
          <div class="rec-card-header">
            <div class="rec-card-icon">${icon(Briefcase, 22)}</div>
            <div>
              <h3>Vị Trí & Mức Thu Nhập</h3>
              <p style="margin:2px 0 0;font-size:13px;color:#63777a;">Nhân viên pha chế & phục vụ (Part-time / Theo giờ)</p>
            </div>
          </div>

          <div class="rec-salary-banner">
            <div class="rec-salary-main">
              Mức thu nhập chính thức
              <strong>25.000 đ <span>/ giờ</span></strong>
            </div>
            <div class="rec-salary-trial">
              Lương thử việc: <b>20.000 đ/giờ</b>
            </div>
          </div>

          <div class="shifts-grid">
            <div class="shift-pill">
              <span class="shift-name">Ca 1 (Sáng)</span>
              <span class="shift-time">08:30 – 15:30</span>
            </div>
            <div class="shift-pill">
              <span class="shift-name">Ca 2 (Chiều tối)</span>
              <span class="shift-time">15:30 – 22:00</span>
            </div>
            <div class="shift-pill">
              <span class="shift-name">Ca Gãy / Tự do</span>
              <span class="shift-time">Thỏa thuận</span>
            </div>
          </div>
          <p class="shifts-note">🔄 <em>Hẻm hỗ trợ xoay ca linh hoạt hàng tuần theo lịch học hoặc lịch cá nhân của các bạn sinh viên.</em></p>
        </article>

        <!-- Card 2: Chế độ & Quyền lợi -->
        <article class="rec-card">
          <div class="rec-card-header">
            <div class="rec-card-icon coral">${icon(Heart, 22)}</div>
            <div>
              <h3>Chế Độ & Quyền Lợi Hấp Dẫn</h3>
              <p style="margin:2px 0 0;font-size:13px;color:#63777a;">Chăm lo tốt nhất cho các thành viên của Hẻm dessert</p>
            </div>
          </div>

          <ul class="benefits-list">
            <li>${icon(CheckCircle, 18)} <span><strong>Lương Tết Nguyên Đán x3:</strong> Áp dụng từ mùng 1 đến mùng 5 Âm lịch.</span></li>
            <li>${icon(CheckCircle, 18)} <span><strong>Lương các ngày Lễ lớn x2:</strong> Tết Dương lịch (1/1), Giỗ Tổ Hùng Vương (10/3), Ngày 30/4, 1/5 và Quốc khánh 2/9.</span></li>
            <li>${icon(CheckCircle, 18)} <span><strong>Thưởng trách nhiệm doanh thu:</strong> Từ 200.000 đ – 500.000 đ / tháng.</span></li>
            <li>${icon(CheckCircle, 18)} <span><strong>Đào tạo từ đầu:</strong> Được hướng dẫn tận tình công thức pha chế trà đậm chuẩn vị và nghiệp vụ dịch vụ khách hàng.</span></li>
            <li>${icon(CheckCircle, 18)} <span><strong>Cơ hội phát triển:</strong> Xét duyệt tăng lương định kỳ, cơ hội thăng tiến lên Trưởng ca / Quản lý cửa hàng.</span></li>
            <li>${icon(CheckCircle, 18)} <span><strong>Môi trường làm việc:</strong> Thân thiện, hòa đồng, luôn vui vẻ và tôn trọng lẫn nhau.</span></li>
          </ul>
        </article>

        <!-- Card 3: Cửa hàng tuyển dụng & Liên hệ phỏng vấn -->
        <article class="contact-callout">
          <div class="contact-callout-header">
            <h3>Liên Hệ Phỏng Vấn Trực Tiếp</h3>
            <p>Hẻm dessert - Cửa hàng HẺM Long An: 10 Nguyễn Thông, Phường 3, Thành phố Tân An, Tỉnh Long An</p>
          </div>

          <div style="background:rgba(255,255,255,0.08);padding:14px 18px;border-radius:12px;">
            <p style="margin:0 0 6px;font-size:13px;color:#e7ecee;">Quản lý tuyển dụng:</p>
            <p style="margin:0;font-size:18px;font-weight:900;color:#f7c51d;">Nguyễn Duyên Anh</p>
            <p style="margin:4px 0 0;font-size:14px;color:#e7ecee;">Số điện thoại: <strong>0586 898 528</strong> (Gọi trực tiếp hẹn lịch phỏng vấn)</p>
          </div>

          <div class="contact-buttons-grid">
            <a class="btn-contact-call" href="tel:0586898528">
              ${icon(Phone, 18)} Gọi 0586 898 528
            </a>
            <a class="btn-contact-zalo" href="https://zalo.me/0586898528" target="_blank" rel="noopener noreferrer">
              ${icon(Send, 18)} Nhắn tin Zalo
            </a>
          </div>
        </article>

        <!-- Card 4: Form ứng tuyển nhanh trực tuyến -->
        <article class="rec-card">
          <div class="rec-card-header">
            <div class="rec-card-icon teal">${icon(Users, 22)}</div>
            <div>
              <h3>Đăng Ký Ứng Tuyển Nhanh</h3>
              <p style="margin:2px 0 0;font-size:13px;color:#63777a;">Điền thông tin để quản lý liên hệ phỏng vấn bạn trong 24 giờ</p>
            </div>
          </div>

          <form id="quick-apply-form" class="apply-form">
            <div class="form-row">
              <div class="form-group">
                <label for="apply-name">Họ và tên của bạn *</label>
                <input type="text" id="apply-name" name="name" placeholder="Ví dụ: Nguyễn Văn A" required />
              </div>
              <div class="form-group">
                <label for="apply-phone">Số điện thoại / Zalo *</label>
                <input type="tel" id="apply-phone" name="phone" placeholder="Ví dụ: 0912 345 678" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="apply-birth">Năm sinh *</label>
                <input type="number" id="apply-birth" name="birthYear" min="1980" max="2012" placeholder="Ví dụ: 2004" required />
              </div>
              <div class="form-group">
                <label for="apply-location">Cửa hàng muốn làm việc *</label>
                <select id="apply-location" name="location">
                  <option value="Hẻm Long An (10 Nguyễn Thông, Tân An)" selected>Hẻm Long An (10 Nguyễn Thông, TP. Tân An)</option>
                  ${locations.map((loc) => `<option value="${escapeHtml(loc.name)}">${escapeHtml(loc.name)}</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="apply-shift">Ca làm việc mong muốn</label>
              <select id="apply-shift" name="shift">
                <option value="Ca 1 (08:30 - 15:30)">Ca 1: 08:30 – 15:30</option>
                <option value="Ca 2 (15:30 - 22:00)">Ca 2: 15:30 – 22:00</option>
                <option value="Ca gãy / Xoay ca linh hoạt" selected>Ca gãy / Xoay ca linh hoạt theo lịch học</option>
              </select>
            </div>

            <div class="form-group">
              <label for="apply-note">Ghi chú thêm (kinh nghiệm nếu có, trường đang học...)</label>
              <textarea id="apply-note" name="note" rows="3" placeholder="Ví dụ: Em có thể làm ca sáng thứ 2, 4, 6 và cả ngày cuối tuần..."></textarea>
            </div>

            <button type="submit" class="btn-submit-apply">
              ${icon(Send, 18)} Gửi thông tin ứng tuyển qua Zalo
            </button>
          </form>
        </article>
      </section>
    </div>
  </main>

  <footer class="contact">
    ${locations.filter((l) => l.visible !== false).map((l) => `
      <div>
        <h2>${escapeHtml(l.name)}</h2>
        <p>
          ${l.oldAddress ? `🏠 ${escapeHtml(l.oldAddress)} (cũ)<br>` : ''}
          🏠 ${escapeHtml(l.address)} (mới)<br>
          📱 Hotline Zalo: <a href="tel:${escapeHtml(l.phoneLink)}">${escapeHtml(l.phone)}</a>
        </p>
      </div>
    `).join('')}
  </footer>

  <!-- Lightbox Modal -->
  <aside id="poster-lightbox-modal" class="poster-lightbox" hidden>
    <div class="poster-lightbox-panel">
      <button type="button" id="btn-close-lightbox" class="poster-lightbox-close" aria-label="Đóng">×</button>
      <img id="lightbox-img" src="${defaultPoster}" alt="Poster phóng to" />
    </div>
  </aside>

  <!-- Toast Notification -->
  <div id="rec-toast" class="rec-toast">
    ${icon(CheckCircle, 20)}
    <span id="toast-text">Đã cập nhật ảnh thành công!</span>
  </div>
`

// ----------------------------------------------------
// Toast Helper
// ----------------------------------------------------
const toastEl = document.querySelector('#rec-toast')
const toastTextEl = document.querySelector('#toast-text')
let toastTimeout = null

const showToast = (message) => {
  if (!toastEl) return
  toastTextEl.textContent = message
  toastEl.classList.add('show')
  if (toastTimeout) clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => {
    toastEl.classList.remove('show')
  }, 3500)
}

// ----------------------------------------------------
// Navigation toggle
// ----------------------------------------------------
const toggle = document.querySelector('.menu-toggle')
const mobileNav = document.querySelector('.mobile-nav')
const setMenu = (open) => {
  toggle.setAttribute('aria-expanded', String(open))
  toggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu')
  toggle.innerHTML = icon(open ? X : Menu, 24)
  mobileNav.hidden = !open
}
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'))
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !mobileNav.hidden) setMenu(false)
})
mobileNav.querySelectorAll('a').forEach((l) => l.addEventListener('click', () => toggle.click()))

// ----------------------------------------------------
// Poster Manager & Upload Logic
// ----------------------------------------------------
const posterImg = document.querySelector('#recruitment-poster-img')
const lightboxImg = document.querySelector('#lightbox-img')
const dropZone = document.querySelector('#poster-drop-zone')
const fileInput = document.querySelector('#poster-file-input')
const triggerBtn = document.querySelector('#btn-trigger-upload')
const resetBtn = document.querySelector('#btn-reset-poster')
const statusTag = document.querySelector('#poster-status-tag')
const lightboxModal = document.querySelector('#poster-lightbox-modal')
const lightboxBtn = document.querySelector('#btn-lightbox')
const closeLightboxBtn = document.querySelector('#btn-close-lightbox')
const downloadBtn = document.querySelector('#btn-download-poster')

// Client-side image compression using canvas
const compressImage = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = (e) => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const maxDimension = 1600
        let { width, height } = img
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width)
            width = maxDimension
          } else {
            width = Math.round((width * maxDimension) / height)
            height = maxDimension
          }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        // Export as WebP or JPEG
        const dataUrl = canvas.toDataURL('image/webp', 0.88)
        resolve(dataUrl)
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })

const updatePosterDisplay = (src, isCustom = false) => {
  posterImg.style.opacity = '0.4'
  setTimeout(() => {
    posterImg.src = src
    lightboxImg.src = src
    posterImg.style.opacity = '1'
  }, 150)

  if (isCustom) {
    statusTag.textContent = 'Ảnh tùy chỉnh'
    statusTag.classList.add('is-custom')
    resetBtn.style.display = 'inline-flex'
  } else {
    statusTag.textContent = 'Ảnh mẫu'
    statusTag.classList.remove('is-custom')
    resetBtn.style.display = 'none'
  }
}

// Initial state from localStorage
const savedPoster = localStorage.getItem(STORAGE_KEY)
if (savedPoster) {
  updatePosterDisplay(savedPoster, true)
}

const handleFile = async (file) => {
  if (!file || !file.type.startsWith('image/')) {
    showToast('Vui lòng chọn file hình ảnh (JPG, PNG, WebP)!')
    return
  }
  try {
    showToast('Đang xử lý và nén ảnh...')
    const compressed = await compressImage(file)
    try {
      localStorage.setItem(STORAGE_KEY, compressed)
    } catch (storageErr) {
      console.warn('LocalStorage quota exceeded', storageErr)
    }
    updatePosterDisplay(compressed, true)
    showToast('Tải lên và cập nhật ảnh tuyển dụng thành công!')
  } catch (err) {
    console.error('Lỗi tải ảnh:', err)
    showToast('Không thể tải ảnh này, vui lòng thử ảnh khác.')
  }
}

// Click to upload
triggerBtn.addEventListener('click', () => fileInput.click())
dropZone.addEventListener('click', () => fileInput.click())

fileInput.addEventListener('change', (e) => {
  const file = e.target.files?.[0]
  if (file) {
    handleFile(file)
    fileInput.value = ''
  }
})

// Drag and drop handlers
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault()
  dropZone.classList.add('drag-over')
})
dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('drag-over')
})
dropZone.addEventListener('drop', (e) => {
  e.preventDefault()
  dropZone.classList.remove('drag-over')
  const file = e.dataTransfer?.files?.[0]
  if (file) handleFile(file)
})

// Reset to default poster
resetBtn.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY)
  updatePosterDisplay(defaultPoster, false)
  showToast('Đã khôi phục ảnh tuyển dụng mặc định!')
})

// Lightbox modal handlers
lightboxBtn.addEventListener('click', () => {
  lightboxModal.hidden = false
})
closeLightboxBtn.addEventListener('click', (e) => {
  e.stopPropagation()
  lightboxModal.hidden = true
})
lightboxModal.addEventListener('click', (e) => {
  if (e.target === lightboxModal || e.target.closest('#btn-close-lightbox')) {
    lightboxModal.hidden = true
  }
})
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !lightboxModal.hidden) {
    lightboxModal.hidden = true
  }
})

// Download current poster
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a')
  link.href = posterImg.src
  link.download = 'tuyen-dung-hem-dessert.png'
  document.body.appendChild(link)
  link.click()
  link.remove()
  showToast('Đang tải ảnh tuyển dụng về máy...')
})

// ----------------------------------------------------
// Quick Application Form Submit Handler
// ----------------------------------------------------
const form = document.querySelector('#quick-apply-form')
form.addEventListener('submit', (e) => {
  e.preventDefault()
  const formData = new FormData(form)
  const name = formData.get('name') || ''
  const phone = formData.get('phone') || ''
  const birthYear = formData.get('birthYear') || ''
  const location = formData.get('location') || ''
  const shift = formData.get('shift') || ''
  const note = formData.get('note') || ''

  const message = `Chào Quản lý Hẻm dessert, em muốn ứng tuyển:\n- Họ tên: ${name}\n- Số điện thoại: ${phone}\n- Năm sinh: ${birthYear}\n- Cửa hàng ứng tuyển: ${location}\n- Ca mong muốn: ${shift}${note ? `\n- Ghi chú: ${note}` : ''}`

  // Open Zalo message to Manager 0586898528
  const zaloUrl = `https://zalo.me/0586898528?text=${encodeURIComponent(message)}`
  window.open(zaloUrl, '_blank')

  showToast('Đã mở Zalo để gửi thông tin ứng tuyển đến Quản lý!')
})
