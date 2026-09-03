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
- Sửa `title`, `message`, `buttonLabel`.
- Điền đường dẫn ảnh như `"image": "/images/khuyen-mai.jpg"`; để trống nếu không dùng ảnh.

Đổi `enabled` về `false` để tắt popup.

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
