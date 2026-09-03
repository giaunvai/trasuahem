# Website Hẻm dessert

## Cập nhật nội dung không cần sửa code

Mở tệp [public/content/site.json](public/content/site.json) trên GitHub, bấm biểu tượng cây bút, thay nội dung cần thiết rồi bấm **Commit changes**. GitHub Pages sẽ tự cập nhật website sau vài phút.

Không đổi hoặc xóa các dấu `"`, `{`, `}`, `[` và `]`. Chỉ thay phần nằm sau dấu `:` và giữa dấu `"`.

Các phần thường chỉnh:

- `orderUrl`: đường dẫn trang đặt món Sapo.
- `hero`: tiêu đề và nội dung ở ảnh mở đầu.
- `member`: nội dung đăng ký thành viên và ảnh QR.
- `about`, `hours`, `menu`: nội dung giới thiệu, giờ làm việc và chính sách giao hàng.
- `foodApps.branches`: link VILL, ShopeeFood và GrabFood từng chi nhánh.
- `locations`: địa chỉ, hotline, tên cửa hàng.

## Đo lường quảng cáo

Trong `analytics` của `public/content/site.json`:

- Dán mã Google Analytics 4 vào `ga4MeasurementId` (dạng `G-XXXXXXXXXX`).
- Dán mã Meta Pixel vào `metaPixelId` nếu chạy quảng cáo Facebook/Instagram.
- Để trống nếu chưa dùng; website sẽ không tải thêm dịch vụ đo lường.

Website tự ghi nhận lượt xem landing page và click vào nút đặt món, app giao hàng, hotline. Khi chạy quảng cáo, thêm các tham số vào cuối đường dẫn:

```text
?utm_source=facebook&utm_medium=paid&utm_campaign=khuyen-mai-thang-9
```

Dùng tên chiến dịch thống nhất để so sánh hiệu quả giữa Facebook, Google và các kênh khác.

## Thêm chi nhánh

Trong `locations`, thêm một dòng mới trước dấu `]` cuối cùng. Dòng trước đó phải có dấu phẩy `,` ở cuối:

```json
{ "name": "hẻm BẾN LỨC - LONG AN", "address": "Địa chỉ chi nhánh", "phone": "0123.456.789", "phoneLink": "0123456789", "tagline": "Tiệm Trà Bến Lức" }
```

Website tự tạo khối mới và tự chia cột. Trên điện thoại, các chi nhánh luôn xếp dọc để dễ đọc. Thêm `"visible": false` vào một chi nhánh để tạm ẩn; đổi thành `true` để hiện lại.

## Thay ảnh

1. Trên GitHub, mở thư mục `public/images`.
2. Chọn **Add file** → **Upload files**.
3. Tải ảnh mới lên và ghi nhớ tên tệp, ví dụ `menu-thang-9.jpg`.
4. Mở `public/content/site.json`, thay đường dẫn ảnh thành `/images/menu-thang-9.jpg`.
5. Commit thay đổi.

Các trường ảnh có thể đổi: `hero.image`, `member.qrImage`, `hours.image`, `menu.image`, `popup.image`.

## Bật popup khuyến mãi

Trong phần `popup` của `public/content/site.json`:

- Đổi `"enabled": false` thành `"enabled": true`.
- Điền đường dẫn ảnh vào `image`.
- Điền link cần mở vào `link`.
- Đổi mô tả ảnh trong `alt`.

Đổi `enabled` về `false` để tắt popup.

## Chiến dịch định kỳ

Website có một trang landing page chiến dịch dùng chung giao diện:

- `/promotion.html`: trang campaign chính.
- Chọn nội dung bằng tham số, ví dụ `/promotion.html?campaign=tet` hoặc `/promotion.html?campaign=khai-truong`.

Nội dung nằm trong `public/content/campaign.json`, `public/content/tet.json` và `public/content/khai-truong.json`.

- Campaign lặp hằng năm: dùng `recurringDate` dạng `MM-DD`, ví dụ `07-01`.
- Campaign có thời gian cụ thể như Noel, 2/9 hoặc 30/4: dùng `endDate` dạng `YYYY-MM-DD`.
- Đổi `campaignType`, `campaignName`, `campaignYear`, `title`, `offerValue`, `offerDescription`, `steps` và `terms` theo từng chương trình.
- Giữ nguyên tên các URL; link quảng cáo có thể dùng ổn định cho từng nhóm campaign.

Ví dụ chương trình khai trương:

```json
{
	"campaignType": "grand-opening",
	"campaignName": "Khai trương Hẻm dessert",
	"campaignYear": "Tháng 10/2026",
	"endDate": "2026-10-31",
	"offerValue": "MUA 2 TẶNG 1"
}
```

## Chạy website trên máy

```powershell
npm install
npm run dev
```

Mở địa chỉ hiện trong Terminal, thường là `http://localhost:5173`.

## Kiểm tra trước khi đưa lên GitHub

```powershell
npm run build
```
