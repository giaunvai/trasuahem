import './style.css'
import './interactive.css'
import './fonts.js'
import './job.css'
import './shared-light.css'
import {
  Briefcase,
  CheckCircle,
  Heart,
  MapPin,
  Phone,
  RefreshCw,
  Send,
} from 'lucide'
import menuLogo from './assets/branding/logo.png'
import { initSubpageHeader, renderSubpageHeader } from './modules/siteHeader.js'

const baseUrl = import.meta.env.BASE_URL

const escapeHtml = (value = '') =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

const icon = (item, size = 20) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${item.map(([tag, attributes]) => `<${tag} ${Object.entries(attributes).map(([key, value]) => `${key}="${value}"`).join(' ')} />`).join('')}</svg>`

let siteData = { orderUrl: 'https://trasuahem.sapofnb.vn/', locations: [] }
try {
  const res = await fetch(`${baseUrl}content/site.json`)
  if (res.ok) {
    siteData = await res.json()
  }
} catch (e) {
  console.warn('Could not load site.json, using fallback', e)
}

const locations = siteData.locations || []
const orderUrl = siteData.orderUrl || 'https://trasuahem.sapofnb.vn/'

const navLinks = [
  ['Trang chủ', `${baseUrl}#trang-chu`],
  ['Menu', `${baseUrl}#menu`],
  ['Về chúng tôi', `${baseUrl}#ve-chung-toi`],
  ['Giờ làm việc', `${baseUrl}#gio-lam-viec`],
  ['App giao hàng', `${baseUrl}#food-app`],
  ['Tuyển dụng', `${baseUrl}job.html`],
]

const app = document.querySelector('#job-app')

app.innerHTML = `
  ${renderSubpageHeader({ baseUrl, logoSrc: menuLogo, orderUrl, active: 'job' })}

  <main class="job-main">
    <div class="job-stack">
      <!-- Card 1: Vị trí & Thu nhập -->
      <article class="job-card">
        <div class="job-card-header">
          <div class="job-card-icon">${icon(Briefcase, 22)}</div>
          <div>
            <h2>Vị Trí Ứng Tuyển & Thu Nhập</h2>
            <p>Nhân viên pha chế & phục vụ (Part-time / Theo giờ)</p>
          </div>
        </div>

        <div class="salary-banner">
          <div class="salary-main">
            Mức thu nhập chính thức
            <strong>25.000 đ <span>/ giờ</span></strong>
          </div>
          <div class="salary-trial">
            Lương thử việc: <b>20.000 đ/giờ</b>
          </div>
        </div>

        <div class="shifts-grid">
          <div class="shift-pill">
            <span class="shift-name">Ca 1 (Sáng)</span>
            <span class="shift-time">08:30 – 15:00</span>
          </div>
          <div class="shift-pill">
            <span class="shift-name">Ca 2 (Chiều tối)</span>
            <span class="shift-time">15:00 – 22:00</span>
          </div>
          <div class="shift-pill">
            <span class="shift-name">Ca Gãy / Linh hoạt</span>
            <span class="shift-time">Thỏa thuận</span>
          </div>
        </div>
        <p class="shifts-note"><span class="contact-line">${icon(RefreshCw, 15)} <em>Hẻm hỗ trợ xoay ca linh hoạt hàng tuần theo lịch học hoặc lịch cá nhân của các bạn sinh viên.</em></span></p>
      </article>

      <!-- Card 2: Chế độ & Quyền lợi -->
      <article class="job-card">
        <div class="job-card-header">
          <div class="job-card-icon coral">${icon(Heart, 22)}</div>
          <div>
            <h2>Chế Độ & Quyền Lợi Hấp Dẫn</h2>
            <p>Chăm lo tốt nhất cho các thành viên của gia đình Hẻm dessert</p>
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
          <h2>Địa Chỉ Cửa Hàng & Liên Hệ Phỏng Vấn</h2>
          <p>Cửa hàng: <strong>HẺM Long An</strong> — 10 Nguyễn Thông, Phường 3, Thành phố Tân An, Tỉnh Long An</p>
        </div>

        <div class="contact-manager-box">
          <p>Quản lý phụ trách tuyển dụng:</p>
          <div class="manager-name">Nguyễn Duyên Anh</div>
          <p>Hotline: <strong>0586 898 528</strong> (Gọi điện thoại hoặc nhắn tin Zalo hẹn lịch phỏng vấn)</p>
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
    </div>
  </main>

  <footer class="contact">
    ${locations.filter((l) => l.visible !== false).map((l) => `
      <div>
        <h2>${escapeHtml(l.name)}</h2>
        <p>
          ${l.oldAddress ? `<span class="contact-line">${icon(MapPin, 15)} <span>${escapeHtml(l.oldAddress)} (cũ)</span></span><br>` : ''}
          <span class="contact-line">${icon(MapPin, 15)} <span>${escapeHtml(l.address)} (mới)</span></span><br>
          <span class="contact-line">${icon(Phone, 15)} <span>Hotline Zalo: <a href="tel:${escapeHtml(l.phoneLink)}">${escapeHtml(l.phone)}</a></span></span>
        </p>
      </div>
    `).join('')}
  </footer>
`

initSubpageHeader()
