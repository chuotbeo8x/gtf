# Đề xuất cải tiến cho theme Simply (nghiên cứu tổng quan)

## 1) Phạm vi và cách nghiên cứu

Tài liệu này tổng hợp đề xuất cải tiến dựa trên:

- Cấu trúc hiện tại của theme (`.hbs`, `src/css`, `src/js`, `gulpfile.js`, `tailwind.config.js`, `package.json`).
- Tài liệu sản phẩm trong `README.md` và `docs/README.md`.
- Kết quả kiểm tra tương thích Ghost bằng `gscan`.
- Tình trạng quy trình lint/test thực tế trong môi trường hiện tại.

Mục tiêu: ưu tiên các cải tiến **có thể triển khai theo từng giai đoạn**, giảm rủi ro và tăng chất lượng theme trên cả góc độ hiệu năng, khả năng bảo trì, và trải nghiệm người dùng.

---

## 2) Hiện trạng chính (tóm tắt)

### Điểm mạnh

- Theme có phạm vi tính năng lớn: nhiều layout homepage, nhiều post format, hỗ trợ memberships/comments, đa ngôn ngữ.
- Cấu trúc `src/css` và `src/js` đã tách theo module tương đối rõ.
- Có luồng build/deploy qua `gulp` và hỗ trợ deploy bằng Ghost Admin API.

### Vấn đề nổi bật cần xử lý sớm

1. **Tooling chưa đồng bộ**: script đang gọi `yarn`, nhưng môi trường thiếu lockfile phù hợp (`yarn` báo lỗi lockfile) nên lint/test bị chặn.
2. **Cần đồng bộ với Ghost 6**: Ghost Admin đã có tùy chọn đổi fonts, theme nên map đúng sang biến font chuẩn để người dùng đổi font trực tiếp từ admin.
3. **Thiếu “quality gate” chuẩn hóa trong CI**: chưa thấy quy trình CI rõ ràng để chặn regression trước khi release.

---

## 3) Đề xuất cải tiến theo mức độ ưu tiên

## P0 — Ổn định nền tảng phát triển và release (ưu tiên cao nhất)

### 3.1 Chuẩn hóa package manager + lockfile

**Vấn đề**: scripts dùng `yarn` (`lint`, `test`) nhưng hiện tại lockfile chưa khớp, khiến không chạy được pipeline kiểm tra tự động.

**Đề xuất**:

- Chọn một chuẩn chính thức cho repo:
  - **Phương án A**: tiếp tục dùng Yarn (khuyến nghị nếu team đang dùng Yarn), commit lockfile tương thích version đang dùng.
  - **Phương án B**: chuyển scripts sang npm hoàn toàn để giảm phụ thuộc Yarn trong CI.
- Thêm tài liệu ngắn trong README: phiên bản Node + package manager chuẩn, lệnh bootstrap, lệnh test.

**KPI**:

- `lint`, `test`, `build` chạy thành công trên máy mới chỉ với 2–3 lệnh setup.

### 3.2 Thiết lập CI tối thiểu cho theme

**Đề xuất**:

- Tạo workflow (GitHub Actions) chạy trên pull request:
  - Install dependencies
  - `lint`
  - `gscan .`
  - `build`
- Đặt rule: PR không đạt checks thì không merge.

**KPI**:

- 100% PR có trạng thái kiểm tra tự động trước merge.
- Giảm lỗi vỡ theme sau phát hành.

---

## P1 — Nâng tương thích Ghost + hiệu năng render

### 3.3 Đồng bộ custom fonts với Ghost 6

**Vấn đề**: Ghost 6 có sẵn tùy chọn fonts trong admin; nếu theme không dùng biến font chuẩn thì người dùng đổi trong admin nhưng giao diện không phản ánh đúng.

**Đề xuất**:

- Bổ sung cơ chế custom fonts theo chuẩn Ghost theme (định nghĩa biến/font stack rõ ràng và tương thích setting custom font của Ghost).
- Kiểm tra lại typography trong `src/css/base/typography.css`, `src/css/base/root.css` để bảo đảm fallback font hợp lý.

**KPI**:

- `gscan` không còn warning custom fonts.

### 3.4 Tối ưu tải tài nguyên front-end

**Đề xuất**:

- Rà soát JS không cần thiết cho từng template, chỉ load script theo trang (giảm JS toàn cục).
- Đảm bảo ảnh cover/card dùng kích thước phù hợp với `image_sizes` đã cấu hình trong `package.json`.
- Cân nhắc preload có chọn lọc cho ảnh/LCP ở homepage template quan trọng.

**KPI**:

- Cải thiện LCP/CLS trên trang chủ và trang bài viết (đo bằng Lighthouse hoặc WebPageTest).

---

## P2 — Trải nghiệm người dùng và maintainability

### 3.5 Chuẩn hóa accessibility (A11y)

**Đề xuất**:

- Kiểm tra tương phản màu ở dark/light mode.
- Rà soát nhãn cho icon-only button (search, menu, social).
- Đảm bảo keyboard navigation tốt cho dropdown/menu/modal.

**KPI**:

- Không còn lỗi nghiêm trọng theo Lighthouse A11y (mức baseline nội bộ).

### 3.6 Chuẩn hóa tài liệu kỹ thuật cho contributor

**Đề xuất**:

- Thêm file hướng dẫn “Development Quick Start”: Node version, package manager, lệnh lint/test/build/deploy.
- Bổ sung checklist release: `gscan`, build production, smoke test các template trọng yếu.

**KPI**:

- Contributor mới có thể chạy dự án trong < 15 phút.

---

## 4) Lộ trình triển khai gợi ý (4 tuần)

- **Tuần 1 (P0)**: chốt package manager, sửa scripts/lockfile, đưa CI vào PR.
- **Tuần 2 (P1)**: xử lý warning gscan + kiểm tra typography/custom fonts.
- **Tuần 3 (P1)**: tối ưu JS/CSS/image cho các template traffic cao.
- **Tuần 4 (P2)**: pass A11y baseline + hoàn thiện tài liệu contributor/release.

---

## 5) Danh sách công việc cụ thể (backlog mẫu)

1. Chọn chuẩn dependency management (Yarn hoặc npm) và cập nhật scripts tương ứng.
2. Thêm workflow CI cho lint + gscan + build.
3. Sửa hỗ trợ custom fonts theo khuyến nghị Ghost.
4. Thêm benchmark script Lighthouse (ít nhất cho homepage + post).
5. Tạo checklist QA trước release.
6. Cập nhật tài liệu “quick start” cho contributor.

---

## 6) Kết luận

Ưu tiên hiện tại nên tập trung vào **nền tảng phát triển (P0)** trước, vì đây là điều kiện cần để các cải tiến tiếp theo (hiệu năng, A11y, mở rộng tính năng) được triển khai an toàn và bền vững. Sau khi ổn định pipeline, việc xử lý cảnh báo tương thích Ghost và tối ưu tải trang sẽ tạo tác động trực tiếp đến chất lượng theme khi triển khai thực tế.


---

## 7) Tiến độ triển khai (đã thực hiện)

- [x] Chuẩn hóa script sang npm (`lint`, `test`) để tránh phụ thuộc Yarn lockfile mismatch.
- [x] Bổ sung CI workflow tự động chạy `lint:js`, `lint:css`, `scan`, `build`.
- [x] Bổ sung tài liệu `Development Quick Start` cho contributor mới.

- [x] P1: đồng bộ custom fonts theo Ghost 6 (đã hoàn tất).
- [x] P1 (đang triển khai): thêm `defer` cho bundle JS chính để giảm blocking render ở `default.hbs` và `custom-kusi-doc.hbs`.
- [x] P1: preload có chọn lọc ảnh cover trang chủ (layout Cover) và chuyển ảnh hero sang eager/high priority để cải thiện LCP.
- [x] P1: giảm khai báo Prism biến toàn cục, chỉ inject ở `post/page` thay vì mọi template.
- [x] P2: chuẩn hóa nhãn `aria-label` cho các điều khiển icon-only (header/author/AMP social) và chuyển toggle không điều hướng sang `<button>`.
- [x] P2: bổ sung tài liệu `release-checklist.md` cho quy trình phát hành và smoke test template trọng yếu.
