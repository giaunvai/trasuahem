# Website Hẻm dessert

Website marketing Vite cho Hẻm dessert. Website có một trang promotion duy nhất, dùng để hiển thị các chương trình theo lịch và dẫn khách tới trang đặt món.

## Cấu trúc nội dung

Các file nội dung nằm trong `public/content`:

- `site.json`: nội dung trang chủ, thông tin cửa hàng, link đặt món và cấu hình popup.
- `birthday.json`: chương trình sinh nhật hằng năm.
- `tet.json`: chương trình Tết âm lịch hằng năm.
- `khai-truong.json`: chương trình khai trương theo ngày bạn nhập.
- `deal.json`: chương trình gom đơn thường xuyên.

Không xóa các file campaign trên. Chúng không phải các trang HTML riêng; chúng là dữ liệu để `promotion.html` đọc, sắp xếp và hiển thị.

## Trang promotion

Chỉ dùng một URL:

```text
/promotion.html
```

Trang tự tải ba campaign mùa vụ và một campaign deal:

- Campaign mùa vụ được sắp xếp theo thời điểm gần nhất.
- Campaign deal luôn nằm ở cuối và không có countdown.
- Các nút `Đặt đơn ngay` đều dẫn tới `orderUrl` trong dữ liệu campaign.
- Popup trên trang chủ dẫn về `/promotion.html`, nên khách vẫn có thể xem ưu đãi khi popup bị tắt.
- URL cũ có `?campaign=...` vẫn mở trang danh mục, không còn trang chi tiết riêng.

## Lịch hiển thị campaign

### Khai trương

Chỉnh ngày trực tiếp trong `public/content/khai-truong.json`:

```json
"eventDate": "2027-03-10"
```

Ngày phải có dạng `YYYY-MM-DD`. Với ví dụ trên:

- Campaign bắt đầu hiển thị từ `28/02/2027`, trước ngày khai trương 10 ngày.
- Countdown đếm tới `10/03/2027`.
- Campaign vẫn hiển thị thêm 7 ngày sau khi chương trình kết thúc.
- Sau thời gian đó, campaign tự ẩn.

Nếu chưa có ngày khai trương, để trống:

```json
"eventDate": ""
```

Campaign sẽ không xuất hiện trên trang promotion.

### Tết

Không nhập ngày dương lịch cho Tết. Hệ thống tự tính mùng 1 Tết bằng `src/lunar-calendar.js`.

Trong `public/content/tet.json`, giữ:

```json
"campaignType": "tet",
"noticeLeadDays": 35,
"eventLunarStartDay": 1,
"eventLunarStartMonth": 1,
"eventLunarEndDay": 3,
"eventLunarEndMonth": 1
```

Thông tin Tết bắt đầu hiển thị và countdown từ 35 ngày trước mùng 1 Tết âm lịch. Campaign vẫn hiển thị thêm 7 ngày sau mùng 3 Tết để tạo cảm giác tiếc nuối, sau đó tự ẩn.

### Sinh nhật

Trong `public/content/birthday.json`:

```json
"recurringDate": "07-01",
"noticeLeadDays": 15,
"eventDurationDays": 3
```

Hệ thống hiểu chương trình diễn ra từ ngày 01 đến hết ngày 03 tháng 07, hiển thị trước 15 ngày và countdown tới ngày bắt đầu. Sau chương trình, campaign vẫn hiển thị thêm 7 ngày rồi tự ẩn.

## Bật hoặc tắt campaign

Để ép campaign hiển thị ngay, bỏ qua cửa sổ ngày tự động, dùng:

```json
"displayMode": "on"
```

Để chạy theo lịch bình thường:

```json
"displayMode": "auto"
```

Để ẩn campaign:

```json
"displayMode": "off"
```

`displayMode` điều khiển việc hiển thị theo từng campaign. Countdown vẫn tính theo ngày diễn ra; deal gom đơn không có countdown.

Để tắt hẳn một campaign, sửa:

```json
"active": false
```

Để bật lại:

```json
"active": true
```

`active: false` luôn ẩn campaign, bất kể ngày trong lịch. Với khai trương, vẫn cần có `eventDate` hợp lệ để hệ thống biết ngày tổ chức.

## Chỉnh nội dung campaign

Trong file campaign tương ứng, các trường thường chỉnh là:

- `campaignName`: tên chương trình.
- `campaignYear`: dòng thông tin phụ.
- `badge`: nhãn ngắn phía trên tiêu đề.
- `title`: tiêu đề chính. Không thêm xuống dòng nếu không thật sự cần.
- `description`: mô tả ngắn, nên viết 1-2 câu.
- `offerValue`: mốc ưu đãi nổi bật.
- `offerTitle`, `offerDescription`, `offerNote`: nội dung chi tiết.
- `summaryPoints`: các ý ngắn hiển thị trên card danh mục.
- `summaryGroups`: nhóm thông tin đầy đủ cho deal gom đơn.
- `terms`: điều kiện áp dụng trên trang promotion.
- `orderUrl`: link trang đặt món.

Ví dụ nội dung deal ngắn:

```json
"summaryPoints": [
  "400.000đ: tặng 02 ly trà tươi.",
  "800.000đ: tặng 05 ly trà tươi.",
  "Inbox Hẻm để xác nhận quà và điều kiện."
]
```

Nội dung khuyến mãi nên ghi rõ mốc đơn, số lượng quà, giới hạn giá trị quà, phí giao hàng và cách xác nhận ưu đãi. Không dùng câu mơ hồ như `nhiều quà hấp dẫn` nếu chưa có điều kiện cụ thể.

## Thay ảnh

Ảnh của campaign đặt trong `src/assets`.

1. Đặt ảnh mới vào `src/assets`.
2. Ưu tiên WebP để giảm dung lượng tải quảng cáo.
3. Trong file JSON, dùng đúng tên file, ví dụ:

```json
"posterImage": "popup_tet.webp",
"heroImage": "popup_tet.webp"
```

`posterImage` được dùng cho card trên trang danh mục. `heroImage` được dùng khi hiển thị minh họa campaign. Với ảnh poster có chữ sẵn, nên dùng `object-fit: contain` để không cắt nội dung.

Các ảnh đang được dùng gồm:

- `GOM_DON_SIEU_TIEC.webp`: banner đầu trang promotion.
- `DEAL_400K.webp`: poster deal gom đơn.
- `popup_tet.webp`: poster Tết.
- `Sinh_Nhat_Hem.webp`: poster sinh nhật.

Giữ file gốc PNG/JPG nếu cần chỉnh sửa về sau, nhưng website nên tham chiếu bản WebP.

### Kích thước ảnh khuyến nghị

Kích thước bên dưới ghi theo thứ tự **rộng x cao** (width x height), đơn vị pixel. Nên giữ đúng tỷ lệ của từng nhóm để ảnh không bị méo hoặc crop.

| Khu vực | File hoặc campaign | Kích thước nên dùng | Tỷ lệ |
| --- | --- | ---: | ---: |
| Banner đầu trang promotion | `GOM_DON_SIEU_TIEC.webp` | `1680 x 640` | 21:8 |
| Poster deal gom đơn | `deal.json` / `DEAL_400K.webp` | `1134 x 1417` | 4:5 |
| Poster Tết | `tet.json` / `popup_tet.webp` | `928 x 1152` | 4:5 |
| Poster sinh nhật | `birthday.json` / `Sinh_Nhat_Hem.webp` | `1200 x 1697` | 7:10 |
| Ảnh khai trương ngang | `khai-truong.json` / `original-0.jpg` | `2000 x 1125` | 16:9 |
| Ảnh menu trang chủ | `site.json` / `menu.webp` | `1600 x 1120` | 10:7 |

Poster Tết, sinh nhật và deal nên thiết kế theo chiều dọc. Không thêm viền trắng hoặc khoảng đệm lớn ở đầu/cuối ảnh; website đã tự căn ảnh theo khung card. Banner đầu trang nên thiết kế ngang, đặt tiêu đề và thông tin quan trọng trong vùng trung tâm để hiển thị tốt trên cả desktop và mobile.

Ảnh campaign nên xuất WebP, chất lượng khoảng 80-85 và cố gắng dưới 400KB. Với ảnh có chữ nhỏ, ưu tiên giữ kích thước pixel như bảng trên thay vì giảm quá nhỏ làm chữ bị nhòe.

## Nội dung trang chủ

Chỉnh `public/content/site.json` cho các phần:

- `hero`: tiêu đề, mô tả và nút đầu trang.
- `member`: nội dung thành viên và QR.
- `about`: giới thiệu Hẻm.
- `hours`: giờ mở cửa và giờ giao hàng.
- `menu`: nội dung menu và chính sách giao hàng.
- `foodApps.branches`: link VILL, ShopeeFood và GrabFood.
- `locations`: địa chỉ, số điện thoại và trạng thái hiển thị chi nhánh.
- `popup`: danh sách popup campaign của trang chủ.

### Cách chỉnh từng khu vực

Mỗi lần chỉnh, chỉ thay phần giá trị nằm sau dấu `:`; giữ nguyên dấu ngoặc, dấu phẩy và tên trường.

Trang đầu:

```json
"hero": {
  "title": "Một Gu Trà Đậm\nMột Vị Trà Riêng",
  "description": "Trải nghiệm một gu trà rất riêng mang phong cách Hẻm dessert",
  "image": "/images/ten-anh.jpg",
  "orderLabel": "Đặt đơn ngay",
  "appLabel": "Đặt food app"
}
```

- `hero.title`: tiêu đề lớn. Dùng `\n` nếu thật sự muốn xuống dòng.
- `hero.description`: câu giới thiệu ngắn.
- `hero.image`: ảnh nền từ `public/images`.
- `orderLabel` và `appLabel`: chữ trên hai nút đầu trang.

Giới thiệu Hẻm:

- `member.title`, `member.description`, `member.qrImage`: khu vực đăng ký thành viên và QR.
- `about.eyebrow`, `about.title`, `about.paragraphs`, `about.buttonLabel`: phần câu chuyện thương hiệu.

Giờ, menu và giao hàng:

- `hours.items`: mỗi dòng gồm `label` và `time`, dùng định dạng `HH:MM`.
- `menu.intro`: thông điệp menu và chính sách miễn phí giao hàng.
- `menu.policy`: phạm vi giao hàng và phí phát sinh.
- `menu.deliveryTiers`: các mốc miễn phí giao hàng; thêm hoặc xóa từng dòng trong mảng này.
- `menu.image`: tên ảnh menu trong `src/assets`.

App và liên hệ:

- `foodApps.branches`: cập nhật link VILL, ShopeeFood và GrabFood theo từng chi nhánh.
- `locations`: cập nhật tên, địa chỉ, số điện thoại. Dùng `visible: false` để ẩn tạm một chi nhánh.

Sau khi sửa JSON, chạy `npm run check` để phát hiện lỗi dấu phẩy, JSON hoặc đường dẫn ảnh trước khi đưa lên GitHub.

Để ẩn một chi nhánh, dùng:

```json
"visible": false
```

## Đo lường quảng cáo

Trong `public/content/site.json`:

```json
"analytics": {
  "ga4MeasurementId": "G-XXXXXXXXXX",
  "metaPixelId": ""
}
```

Để trống nếu chưa sử dụng. Website ghi nhận lượt xem trang và click vào nút đặt món, app giao hàng và hotline.

Cả trang chủ (`index.html`) và trang promotion (`promotion.html`) đều dùng module chung `src/analytics.js`. Vì vậy chỉ cần chỉnh ID và quy tắc theo dõi trong `site.json` một lần, không sửa riêng từng landing page.

### Cấu hình GA4

1. Tạo hoặc mở thuộc tính GA4 của website.
2. Lấy Measurement ID có dạng `G-XXXXXXXXXX`.
3. Dán ID vào `analytics.ga4MeasurementId`.
4. Chạy `npm run check`, sau đó push website.
5. Trong GA4 mở **Reports > Realtime** để kiểm tra lượt truy cập.

### Cấu hình Meta Pixel

1. Mở Events Manager của Meta và lấy Pixel ID.
2. Dán ID vào `analytics.metaPixelId`.
3. Dùng Meta Pixel Helper hoặc Events Manager để kiểm tra event sau khi website cập nhật.

Website tải thư viện GA4 và Meta Pixel khi trình duyệt rảnh để không làm chậm trang. Các event cơ bản vẫn được đưa vào `dataLayer` ngay khi xảy ra.

Các event hiện có:

- `landing_page_view`: user mở trang chủ, kèm URL và các tham số `utm_`.
- `cta_click`: user click nút đặt món, nút app giao hàng, hotline hoặc liên kết khác trên trang chủ.
- `promotion_directory_view`: user mở trang promotion.
- `promotion_cta_click`: user click CTA trên trang promotion.

### Gắn UTM cho quảng cáo

Dùng một URL promotion chung, chỉ thay giá trị UTM theo campaign và kênh:

```text
https://www.trasuahem.com/promotion.html?utm_source=facebook&utm_medium=paid_social&utm_campaign=tet_2027&utm_content=video_01
```

Quy ước đề xuất:

- `utm_source`: `facebook`, `google`, `zalo`.
- `utm_medium`: `paid_social`, `cpc`, `broadcast`.
- `utm_campaign`: tên campaign, ví dụ `tet_2027`, `birthday_2027`, `deal_400k`.
- `utm_content`: mã mẫu quảng cáo, video hoặc ảnh, ví dụ `video_01`.

Không dùng dấu cách hoặc tên khác nhau cho cùng một campaign. Nhờ vậy có thể so sánh nguồn traffic, mẫu quảng cáo và số click đặt món trong GA4.

Lưu ý: hệ thống hiện đo click tới trang đặt món và các link liên hệ. Để đo chính xác **đơn đã hoàn tất**, cần thêm tracking hoặc quyền tích hợp từ nền tảng đặt món Sapo.

Link quảng cáo có thể thêm UTM:

```text
/promotion.html?utm_source=facebook&utm_medium=paid&utm_campaign=deal_400k
```

## Chạy và kiểm tra local

```powershell
npm install
npm run dev
```

Mở URL Vite in trong Terminal, thường là `http://localhost:5173`.

Trước khi commit hoặc đưa lên GitHub:

```powershell
npm run check
```

Lệnh này kiểm tra JSON, asset campaign bị thiếu, ảnh campaign quá nặng và build production.

## Commit và push

```powershell
git status
git add -A
git commit -m "Update promotion content"
git push origin main
```

Không commit thư mục `node_modules`. Luôn chạy `npm run check` trước khi push.
