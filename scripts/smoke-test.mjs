import { stat } from 'node:fs/promises'
import { getCampaignSchedule, getCampaignState, isCampaignPopupActive } from '../src/countdown.js'
import tet from '../public/content/tet.json' with { type: 'json' }
import site from '../public/content/site.json' with { type: 'json' }

const assert = (condition, message) => {
  if (!condition) throw new Error(message)
}

const tetPopupStart = new Date('2027-01-03T12:00:00+07:00')
const tetDuringCampaign = new Date('2027-01-15T12:00:00+07:00')
const tetEnd = new Date('2027-02-07T00:00:00+07:00')
const tetNostalgiaEnd = new Date('2027-02-15T12:00:00+07:00')
const schedule = getCampaignSchedule(tet, tetDuringCampaign)

assert(getCampaignState(tet, tetDuringCampaign).state === 'live', 'Tết phải ở trạng thái live trong 35 ngày trước mùng 1.')
assert(schedule.eventEnd.getTime() === schedule.eventStart.getTime(), 'Tết phải kết thúc khi bước sang mùng 1.')
assert(getCampaignState(tet, tetEnd).state !== 'live', 'Tết không được live từ mùng 1.')
assert(isCampaignPopupActive(tet, tetPopupStart), 'Popup Tết phải bật từ 35 ngày trước mùng 1.')
assert(!isCampaignPopupActive(tet, tetEnd), 'Popup Tết phải tắt từ mùng 1.')
assert(!isCampaignPopupActive(tet, tetNostalgiaEnd), 'Popup Tết phải tắt trong giai đoạn hiển thị tiếc nuối.')
assert(schedule.eventStart.getFullYear() === 2027, 'Lịch Tết trong campaign 2027 không được nhảy sang năm sau.')
assert(site.menu.image === 'menu.webp', 'Cấu hình menu phải dùng ảnh WebP hiển thị.')
await stat(new URL('../src/assets/menu/original_menu.jpg', import.meta.url))

console.log('Smoke tests passed: campaign schedule and menu assets.')
