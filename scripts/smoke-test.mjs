import { stat } from 'node:fs/promises'
import { getCampaignSchedule, getCampaignState, isCampaignPopupActive } from '../src/countdown.js'
import tet from '../public/content/tet.json' with { type: 'json' }
import site from '../public/content/site.json' with { type: 'json' }
import luckyWheel from '../public/content/lucky-wheel.json' with { type: 'json' }
import liXiTet from '../public/content/li-xi-tet.json' with { type: 'json' }

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
assert(luckyWheel.prizes.length >= 2, 'Vòng quay phải có ít nhất 2 giải thưởng.')
assert(luckyWheel.prizes.length === 10, 'Vòng quay phải có đúng 10 giải thưởng.')
assert(luckyWheel.prizes.every((prize) => Number(prize.weight) > 0), 'Mỗi giải thưởng vòng quay phải có tỉ lệ lớn hơn 0.')
assert(luckyWheel.prizes.every((prize) => prize.notice), 'Mỗi giải thưởng vòng quay phải có thông báo áp dụng.')
assert(luckyWheel.prizes.every((prize) => !('code' in prize)), 'Vòng quay không dùng mã quà.')
assert(new Set(luckyWheel.prizes.map((prize) => prize.id)).size === luckyWheel.prizes.length, 'Mỗi giải thưởng vòng quay phải có id riêng.')
assert(Math.abs(luckyWheel.prizes.reduce((sum, prize) => sum + Number(prize.weight), 0) - 100) < 0.001, 'Tổng tỉ lệ vòng quay phải bằng 100.')
assert(luckyWheel.prizes.find((prize) => prize.id === 'mien-phi-100')?.weight === 0.1, 'Giải miễn phí 100% phải có tỉ lệ 0.1%.')
assert(liXiTet.prizes.length === 15, 'Lì xì Tết phải có đúng 15 giải thưởng hiển thị.')
assert(liXiTet.totalPrizeCount === 1000, 'Lì xì Tết phải có tổng 1.000 phần thưởng.')
assert(liXiTet.cooldownSeconds >= 60, 'Lì xì Tết phải nghỉ ít nhất 60 giây giữa các lượt.')
assert(Math.abs(liXiTet.prizes.reduce((sum, prize) => sum + Number(prize.weight), 0) - 100) < 0.001, 'Tổng tỉ lệ lì xì Tết phải bằng 100%.')
assert(new Map(liXiTet.prizes.map((prize) => [prize.poolId, prize.quantity])).size === 5, 'Lì xì Tết phải có 5 mệnh giá.')
assert([...new Map(liXiTet.prizes.map((prize) => [prize.poolId, prize.quantity])).values()].reduce((sum, quantity) => sum + quantity, 0) === 1000, 'Kho lì xì phải có 1.000 phần thưởng.')

console.log('Smoke tests passed: campaign schedule and menu assets.')
