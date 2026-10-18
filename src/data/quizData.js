import traKemMuoi from '../assets/Tra_Sua_Kem_Muoi.webp'
import traSuaHem from '../assets/tra_sua_hem_noPhone.webp'

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Hôm nay bạn cần cảm giác gì nhất?',
    subtitle: 'Hãy chọn tâm trạng hiện tại của bạn',
    options: [
      { id: 'dam-vi', icon: '⚡', label: 'Cần tỉnh táo, đậm vị trà để cày việc & học tập' },
      { id: 'thanh-nhiet', icon: '🍃', label: 'Cần giải nhiệt mát rượi, sảng khoái tức thì' },
      { id: 'beo-ngot', icon: '🍮', label: 'Thèm béo thơm, tự thưởng sau ngày dài' },
    ],
  },
  {
    id: 2,
    question: 'Độ ngọt lý tưởng cho ly nước của bạn?',
    subtitle: 'Hẻm luôn khuyến khích gu ít ngọt để giữ trọn vị trà',
    options: [
      { id: 'it-ngot', icon: '🎯', label: 'Ít ngọt (30% - 50%), hậu vị trà sâu và rõ' },
      { id: 'tu-nhien', icon: '🍊', label: 'Ngọt thanh tự nhiên từ trái cây và thảo mộc' },
      { id: 'tron-vi', icon: '✨', label: 'Đậm đà tròn vị, béo ngậy quyến rũ' },
    ],
  },
  {
    id: 3,
    question: 'Topping nào là "chân ái" không thể thiếu?',
    subtitle: 'Mỗi loại topping đều được Hẻm nấu mới mỗi ngày',
    options: [
      { id: 'kem-muoi', icon: '🌊', label: 'Kem muối biển sánh mịn, mằn mặn béo ngậy' },
      { id: 'thach-gion', icon: '🧊', label: 'Thạch củ năng, đào giòn sần sật nhai vui miệng' },
      { id: 'tran-chau', icon: '🧋', label: 'Trân châu đen dẻo dai đượm hương mật mía' },
    ],
  },
]

export const QUIZ_RESULTS = {
  'kem-muoi': {
    title: 'Trà Sữa Hẻm Kem Muối',
    subtitle: 'Chân Ái Cho Người Sành Trà',
    badge: 'GU ĐẬM ĐÀ & TINH TẾ',
    image: traKemMuoi,
    price: '33.000đ',
    description: 'Bạn là người có gu thưởng thức tinh tế, chuộng sự tương phản hài hòa giữa vị trà đậm đà truyền thống và lớp kem muối béo ngậy mằn mặn trên cùng.',
    voucherTip: 'Mẹo: Dùng kèm trân châu đen hoặc thạch củ năng để nhân đôi độ cuốn!',
  },
  'trai-cay': {
    title: 'Lục Trà Lài Dưa Lưới Tươi',
    subtitle: 'Năng Lượng Thanh Mát & Tươi Mới',
    badge: 'GU THANH NHIỆT MÁT LẠNH',
    image: traSuaHem,
    price: '28.000đ',
    description: 'Tâm hồn bạn yêu thích sự tươi mới, nhẹ nhàng và tự nhiên. Ly lục trà lài hòa quyện cùng dưa lưới tươi ngọt giòn sẽ nạp lại 100% năng lượng cho bạn!',
    voucherTip: 'Mẹo: Món này cực kỳ hợp khi kết hợp cùng thạch củ năng giòn rụm.',
  },
  'dam-vi': {
    title: 'Trà Sữa Đậm Vị Hẻm (Signature)',
    subtitle: 'Vị Trà Riêng Mang Bản Sắc Hẻm',
    badge: 'GU NGUYÊN BẢN CHUẨN HẺM',
    image: traSuaHem,
    price: '28.000đ',
    description: 'Một gu trà đậm, một vị trà riêng! Bạn yêu thích vị trà mộc mạc nguyên bản, thơm nồng nàn và để lại hậu ngọt êm dịu, không hề bị lấn át bởi sữa béo.',
    voucherTip: 'Mẹo: Giảm ngọt 50% đường để cảm nhận trọn vẹn từng tầng vị trà.',
  },
}
