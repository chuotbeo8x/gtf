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


---

## 8) Kế hoạch cải tiến & phát triển cụ thể (90 ngày)

## Mục tiêu theo quý

- **Ổn định release**: mọi PR đều qua quality gate tự động trước merge.
- **Nâng hiệu năng thực tế**: giảm render-blocking, cải thiện LCP/CLS cho home + post.
- **Nâng khả năng mở rộng sản phẩm**: có checklist phát hành, có baseline A11y, sẵn sàng tách starter cho theme mới.

## Giai đoạn 1 (Tuần 1–2) — Ổn định nền tảng

**Deliverables**

1. Chốt npm workflow + CI bắt buộc cho PR (lint/js/css/scan/build).
2. Tài liệu hóa quy trình contributor (`development-quick-start`, `release-checklist`).
3. Chuẩn hóa deploy an toàn (không log secret trong deploy task).

**Tiêu chí hoàn thành**

- 100% PR mới có status check đầy đủ.
- Team mới clone repo có thể chạy `install -> lint -> scan -> build` trong < 15 phút.

## Giai đoạn 2 (Tuần 3–6) — Hiệu năng & tương thích Ghost

**Deliverables**

1. Đồng bộ font với Ghost Admin (Ghost 6 custom fonts).
2. Rà soát tải JS theo template (chỉ inject thứ cần thiết cho từng trang).
3. Tối ưu LCP homepage:
   - preload có điều kiện ảnh hero,
   - ảnh LCP dùng `src/srcset/sizes` + `fetchpriority="high"`.
4. Đo Lighthouse định kỳ (home + post) và lưu kết quả làm baseline.

**Tiêu chí hoàn thành**

- `gscan` không cảnh báo về phần đã xử lý.
- LCP home và post giảm rõ rệt so với baseline đầu kỳ.

## Giai đoạn 3 (Tuần 7–10) — A11y & chất lượng tương tác

**Deliverables**

1. Chuẩn hóa điều khiển semantic (`button` cho action không điều hướng).
2. Hoàn thiện nhãn `aria-label` cho icon-only controls còn lại.
3. Hoàn thiện keyboard UX:
   - ESC đóng dropdown/modal,
   - focus state rõ ràng cho control quan trọng.

**Tiêu chí hoàn thành**

- Không còn lỗi nghiêm trọng trong audit A11y nội bộ.
- Smoke test keyboard pass cho header/menu/slider/search.

## Giai đoạn 4 (Tuần 11–13) — Productization & chuẩn bị theme mới

**Deliverables**

1. Tách “starter profile” từ theme hiện tại:
   - giữ base layout + build + docs cốt lõi,
   - route/template nâng cao chuyển thành module/preset.
2. Viết guide “Create new theme from starter” (không cần clone toàn bộ theme đầy đủ).
3. Chuẩn hóa naming/structure cho template để giảm chi phí bảo trì.

**Tiêu chí hoàn thành**

- Tạo theme mới từ starter trong 1 ngày làm việc (thay vì clone + dọn dẹp nhiều).
- Có checklist migration khi nâng Ghost version.

## Backlog ưu tiên (thực thi ngay)

- [x] Thiết lập benchmark Lighthouse script cho `/` và `/post/:slug`.
- [x] Bổ sung script kiểm tra dead links cơ bản cho docs nội bộ.
- [x] Review và loại bỏ plugin/config không còn cần thiết trong Tailwind/Gulp.
- [x] Chuẩn hóa conventions đặt tên template theo nhóm `home/`, `post/`, `archive/`, `members/`.

## Cơ chế vận hành (đề xuất)

- Mỗi tuần 1 buổi review roadmap 30 phút.
- Mỗi PR bắt buộc ghi rõ: phạm vi, ảnh hưởng UX/perf, cách verify.
- Mỗi release có changelog ngắn + checklist runbook.

- [x] CI chạy kiểm tra local markdown links qua `npm run check:docs-links` trên mỗi PR.

- [x] P3: thêm tài liệu conventions + benchmark script để chuẩn bị tách starter profile cho theme mới.

- [x] P4: hoàn tất starter profile workflow (`starter/starter-files.txt` + script generate profile).
- [x] P4: bổ sung guide `create-theme-from-starter.md` cho quy trình tạo theme mới.
- [x] P4: bổ sung `ghost-migration-checklist.md` cho quy trình nâng version Ghost.
