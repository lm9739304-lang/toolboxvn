export type ToolCategory =
  | "Văn bản"
  | "Mã hoá & Dev"
  | "Màu sắc"
  | "Ngẫu nhiên"
  | "Chuyển đổi"
  | "Tài chính"
  | "Sức khoẻ"
  | "Thời gian"
  | "SEO & Marketing"
  | "Hình ảnh"
  | "Tiện ích";

export const CATEGORIES: { name: ToolCategory; icon: string; desc: string }[] = [
  { name: "Văn bản", icon: "text-stats", desc: "Đếm từ, chuyển chữ hoa thường, xử lý dòng, slug..." },
  { name: "Mã hoá & Dev", icon: "base64", desc: "Base64, hash SHA, JSON, regex, preview HTML/Markdown..." },
  { name: "Màu sắc", icon: "palette", desc: "Đổi HEX/RGB, palette, gradient, tương phản..." },
  { name: "Ngẫu nhiên", icon: "dice", desc: "Mật khẩu, UUID, QR, xúc xắc, tên ngẫu nhiên..." },
  { name: "Chuyển đổi", icon: "number-base", desc: "Hệ đếm, đơn vị đo, nhiệt độ, tiền tệ..." },
  { name: "Tài chính", icon: "compound", desc: "Lãi kép, vay vốn, VAT, lương Gross/Net..." },
  { name: "Sức khoẻ", icon: "bmi", desc: "BMI, BMR, TDEE, nước, ngày dự sinh..." },
  { name: "Thời gian", icon: "age", desc: "Tính tuổi, đếm ngược, timestamp, giờ thế giới..." },
  { name: "SEO & Marketing", icon: "serp", desc: "SERP, mật độ từ khoá, robots, sitemap, UTM..." },
  { name: "Hình ảnh", icon: "image-compress", desc: "Nén ảnh, resize, ảnh sang Base64, favicon..." },
  { name: "Tiện ích", icon: "notepad", desc: "Ghi chú, Tết countdown, tử vi, GPA, typing test..." },
];

export type Tool = {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  impl: string;
  keywords: string[];
  guide: string[];
};

function t(
  slug: string,
  name: string,
  description: string,
  category: ToolCategory,
  icon: string,
  impl: string,
  keywords: string[] = [],
  guide: string[] = []
): Tool {
  return { slug, name, description, category, icon, impl, keywords, guide };
}

export const TOOLS: Tool[] = [
  // ── Văn bản (15) ──
  t("dem-tu", "Đếm từ online", "Đếm số từ, ký tự, câu, đoạn văn và thời gian đọc miễn phí.", "Văn bản", "text-stats", "text-stats", ["đếm từ", "word counter"], ["Dán văn bản vào ô nhập.", "Kết quả cập nhật theo thời gian thực.", "Bấm Sao chép để copy thống kê."]),
  t("dem-ky-tu", "Đếm ký tự online", "Đếm ký tự có/không dấu cách, số dòng, bytes chính xác.", "Văn bản", "text-stats", "text-stats", ["đếm ký tự", "character counter"]),
  t("dem-cau", "Đếm câu & đoạn văn", "Phân tích số câu, đoạn văn, từ dài nhất, mật độ câu.", "Văn bản", "text-stats", "text-stats", ["đếm câu"]),
  t("chuyen-hoa-chu", "Chuyển đổi chữ HOA / thường", "UPPERCASE, lowercase, Title Case, Sentence case, aLtErNaTiNg...", "Văn bản", "case-converter", "case-converter", ["hoa thường", "case converter"], ["Nhập văn bản.", "Chọn kiểu chuyển đổi.", "Bấm Sao chép kết quả."]),
  t("dao-nguoc-van-ban", "Đảo ngược văn bản", "Đảo toàn bộ chuỗi, từng từ hoặc từng dòng.", "Văn bản", "reverse-text", "reverse-text", ["đảo chữ"]),
  t("xoa-dau-tieng-viet", "Xoá dấu tiếng Việt", "Chuyển đ → d, ễ → e... giữ nguyên chữ hoa/thường.", "Văn bản", "remove-accents", "remove-accents", ["xóa dấu", "khong dau"]),
  t("tao-slug", "Tạo slug URL chuẩn SEO", "Tạo slug không dấu, gạch ngang, lowercase từ tiêu đề.", "Văn bản", "slug-generator", "slug-generator", ["slug", "url thân thiện"]),
  t("xoa-khoang-trang-thua", "Xoá khoảng trắng thừa", "Gộp nhiều space, xoá space đầu/cuối dòng, chuẩn hoá văn bản.", "Văn bản", "clean-spaces", "clean-spaces", ["xóa space thừa"]),
  t("xoa-xuong-dong", "Xoá xuống dòng", "Gộp nhiều dòng thành 1 dòng hoặc nối bằng ký tự tuỳ chọn.", "Văn bản", "remove-linebreaks", "remove-linebreaks", ["gộp dòng"]),
  t("sap-xep-dong", "Sắp xếp dòng A-Z", "Sort tăng/giảm dần, theo số, theo độ dài dòng.", "Văn bản", "sort-lines", "sort-lines", ["sort lines"]),
  t("xoa-dong-trung", "Xoá dòng trùng lặp", "Loại bỏ dòng giống nhau, giữ thứ tự xuất hiện.", "Văn bản", "dedupe-lines", "dedupe-lines", ["remove duplicate"]),
  t("danh-so-dong", "Đánh số dòng", "Thêm số thứ tự đầu mỗi dòng theo nhiều định dạng.", "Văn bản", "number-lines", "number-lines", ["number lines"]),
  t("tron-dong-ngau-nhien", "Trộn dòng ngẫu nhiên", "Shuffle thứ tự các dòng, tách danh sách trúng thưởng.", "Văn bản", "shuffle-lines", "shuffle-lines", ["shuffle"]),
  t("tach-tu-khoa", "Tách từ & tần suất", "Liệt kê từng từ kèm số lần xuất hiện, lọc stop-word.", "Văn bản", "word-freq", "word-freq", ["tần suất từ"]),
  t("so-sanh-van-ban", "So sánh 2 văn bản", "Diff theo dòng, tô màu thêm/xoá, thống kê giống nhau.", "Văn bản", "text-diff", "text-diff", ["diff", "so sánh"]),

  // ── Mã hoá & Dev (18) ──
  t("ma-hoa-base64", "Mã hoá Base64", "Encode văn bản / file sang Base64, hỗ trợ Unicode.", "Mã hoá & Dev", "base64", "base64", ["base64 encode"]),
  t("giai-ma-base64", "Giải mã Base64", "Decode Base64 sang văn bản gốc, báo lỗi khi sai định dạng.", "Mã hoá & Dev", "base64", "base64", ["base64 decode"]),
  t("ma-hoa-url", "Encode / Decode URL", "Mã hoá URL an toàn, xử lý tiếng Việt Unicode.", "Mã hoá & Dev", "url-codec", "url-codec", ["url encode decode"]),
  t("html-entities", "Encode HTML Entities", "Chuyển < > & \" ' sang &lt; &gt; &amp;... và ngược lại.", "Mã hoá & Dev", "html-entities", "html-entities", ["html entities"]),
  t("bam-sha256", "Băm SHA-256", "Tạo hash SHA-256 bằng Web Crypto, chạy 100% trên trình duyệt.", "Mã hoá & Dev", "sha256", "sha256", ["sha256", "hash"]),
  t("bam-sha512", "Băm SHA-512 / SHA-1", "Tạo SHA-1, SHA-384, SHA-512 nhanh, so sánh 2 chuỗi hash.", "Mã hoá & Dev", "sha-multi", "sha-multi", ["sha512", "sha1"]),
  t("bam-md5", "Băm MD5", "Tạo MD5 bằng JS thuần (không gửi server), kiểm tra checksum.", "Mã hoá & Dev", "md5", "md5", ["md5"]),
  t("giai-ma-jwt", "Giải mã JWT", "Decode header + payload JWT, xem exp/iat dạng ngày giờ.", "Mã hoá & Dev", "jwt-decoder", "jwt-decoder", ["jwt decode"]),
  t("ma-morse", "Mã Morse", "Chuyển văn bản sang Morse (.-) và ngược lại, có phát âm thanh.", "Mã hoá & Dev", "morse", "morse", ["morse code"]),
  t("kiem-tra-regex", "Kiểm tra Regex", "Test biểu thức chính quy, highlight match, giải thích flag.", "Mã hoá & Dev", "regex-tester", "regex-tester", ["regex tester"]),
  t("json-formatter", "Format JSON online", "Làm đẹp, thu gọn, validate JSON, tree-view, sửa lỗi dấu phẩy.", "Mã hoá & Dev", "json-formatter", "json-formatter", ["json formatter", "làm đẹp json"]),
  t("csv-sang-json", "CSV sang JSON", "Chuyển CSV sang JSON, tuỳ chọn dấu phân cách, header.", "Mã hoá & Dev", "csv-to-json", "csv-to-json", ["csv to json"]),
  t("json-sang-csv", "JSON sang CSV", "Chuyển mảng JSON sang CSV để mở bằng Excel.", "Mã hoá & Dev", "json-to-csv", "json-to-csv", ["json to csv"]),
  t("xem-truoc-html", "Chạy thử HTML/CSS/JS", "Preview code HTML trực tiếp trong iframe sandbox an toàn.", "Mã hoá & Dev", "html-preview", "html-preview", ["html preview"]),
  t("xem-truoc-markdown", "Xem trước Markdown", "Soạn Markdown và xem kết quả theo thời gian thực.", "Mã hoá & Dev", "markdown-preview", "markdown-preview", ["markdown"]),
  t("nen-css-js", "Nén CSS / JS", "Minify CSS/JS bằng cách xoá comment, space thừa.", "Mã hoá & Dev", "minifier", "minifier", ["minify css js"]),
  t("tao-slug-dev", "Escape chuỗi lập trình", "Escape/unescape JSON string, Unicode \\uXXXX.", "Mã hoá & Dev", "string-escape", "string-escape", ["escape string"]),
  t("kiem-tra-ip", "Xem IP của bạn", "Hiển thị IP công cộng, user-agent, màn hình, múi giờ.", "Mã hoá & Dev", "my-ip", "my-ip", ["my ip", "địa chỉ ip"]),

  // ── Màu sắc (6) ──
  t("hex-sang-rgb", "HEX sang RGB", "Chuyển #ff5733 sang rgb(255,87,51), kèm HSL, CMYK.", "Màu sắc", "hex-to-rgb", "hex-to-rgb", ["hex to rgb"]),
  t("rgb-sang-hex", "RGB sang HEX", "Nhập R,G,B (0-255) để lấy mã HEX + xem trước màu.", "Màu sắc", "rgb-to-hex", "rgb-to-hex", ["rgb to hex"]),
  t("bang-mau", "Tạo bảng màu", "Random palette 5 màu hài hoà, khoá màu ưng ý, copy HEX.", "Màu sắc", "palette", "palette", ["color palette"]),
  t("kiem-tra-tuong-phan", "Kiểm tra tương phản màu", "Tính tỉ lệ contrast WCAG AA/AAA cho chữ và nền.", "Màu sắc", "contrast", "contrast", ["contrast checker"]),
  t("tao-gradient", "Tạo Gradient CSS", "Trộn 2-3 màu, xoay góc, copy code linear-gradient.", "Màu sắc", "gradient", "gradient", ["gradient generator"]),
  t("chon-mau", "Bảng chọn màu", "Color picker + EyeDropper, copy HEX/RGB/HSL nhanh.", "Màu sắc", "color-picker", "color-picker", ["color picker"]),

  // ── Ngẫu nhiên (10) ──
  t("tao-mat-khau", "Tạo mật khẩu mạnh", "Random password 4-64 ký tự, tuỳ chọn số/ký hiệu, loại trừ ký tự dễ nhầm.", "Ngẫu nhiên", "password-gen", "password-gen", ["tạo mật khẩu", "password generator"]),
  t("kiem-tra-mat-khau", "Kiểm tra độ mạnh mật khẩu", "Chấm điểm 0-100, ước tính thời gian bẻ khoá, gợi ý cải thiện.", "Ngẫu nhiên", "password-strength", "password-strength", ["password strength"]),
  t("tao-uuid", "Tạo UUID / GUID", "Sinh UUID v4 hàng loạt, bulk 100 cái, uppercase/lowercase.", "Ngẫu nhiên", "uuid-gen", "uuid-gen", ["uuid generator"]),
  t("tao-ma-qr", "Tạo mã QR", "Tạo QR từ link/văn bản/wifi, tải PNG, tuỳ kích thước.", "Ngẫu nhiên", "qr-gen", "qr-gen", ["tạo qr", "qr code"]),
  t("tao-ma-barcode", "Tạo mã Barcode", "Vẽ barcode Code39/Code128 bằng Canvas, tải PNG.", "Ngẫu nhiên", "barcode-gen", "barcode-gen", ["barcode"]),
  t("tao-ma-pin", "Tạo mã PIN", "Random PIN 4/6/8 số, không trùng, không liên tiếp.", "Ngẫu nhiên", "pin-gen", "pin-gen", ["pin generator"]),
  t("tung-xuc-xac", "Tung xúc xắc", "Gieo 1-6 viên xúc xắc, lịch sử kết quả, tổng điểm.", "Ngẫu nhiên", "dice", "dice", ["xúc xắc"]),
  t("tung-dong-xu", "Tung đồng xu", "Sấp/ngửa ngẫu nhiên, đếm tỉ lệ, hiệu ứng lật.", "Ngẫu nhiên", "coin", "coin", ["tung xu"]),
  t("so-ngau-nhien", "Số ngẫu nhiên", "Random trong khoảng min-max, không trùng, sắp xếp.", "Ngẫu nhiên", "random-number", "random-number", ["random number"]),
  t("ten-ngau-nhien", "Tên ngẫu nhiên", "Gợi ý tên người Việt ngẫu nhiên theo giới tính.", "Ngẫu nhiên", "random-name", "random-name", ["random name"]),

  // ── Chuyển đổi (13) ──
  t("doi-he-dem", "Đổi hệ đếm (2/8/10/16)", "Chuyển Dec ↔ Bin ↔ Oct ↔ Hex theo thời gian thực.", "Chuyển đổi", "number-base", "number-base", ["đổi hệ đếm", "binary decimal hex"]),
  t("so-la-ma", "Số La Mã", "Đổi số Ả Rập ↔ La Mã (I, IV, IX, MCMXC...).", "Chuyển đổi", "roman", "roman", ["số la mã", "roman numerals"]),
  t("doc-so-thanh-chu", "Đọc số thành chữ", "Đọc số tiền tiếng Việt (một triệu hai trăm...) và English.", "Chuyển đổi", "number-words", "number-words", ["đọc số thành chữ"]),
  t("doi-do-dai", "Đổi đơn vị độ dài", "mm, cm, m, km, inch, feet, yard, mile, hải lý.", "Chuyển đổi", "unit-length", "unit-length", ["đổi độ dài"]),
  t("doi-khoi-luong", "Đổi đơn vị khối lượng", "mg, g, kg, tấn, ounce, pound...", "Chuyển đổi", "unit-weight", "unit-weight", ["đổi cân nặng"]),
  t("doi-nhiet-do", "Đổi nhiệt độ", "°C ↔ °F ↔ K, công thức chi tiết.", "Chuyển đổi", "unit-temp", "unit-temp", ["đổi nhiệt độ"]),
  t("doi-dien-tich", "Đổi diện tích", "m², km², ha, sào, mẫu, acre, feet²...", "Chuyển đổi", "unit-area", "unit-area", ["đổi diện tích"]),
  t("doi-the-tich", "Đổi thể tích", "ml, lít, m³, gallon, cup, ounce lỏng...", "Chuyển đổi", "unit-volume", "unit-volume", ["đổi thể tích"]),
  t("doi-toc-do", "Đổi tốc độ", "km/h, m/s, mph, knot, Mach...", "Chuyển đổi", "unit-speed", "unit-speed", ["đổi tốc độ"]),
  t("doi-luu-tru", "Đổi đơn vị lưu trữ", "Bit, Byte, KB, MB, GB, TB (cả 1000 và 1024).", "Chuyển đổi", "unit-data", "unit-data", ["đổi dung lượng"]),
  t("doi-thoi-gian", "Đổi đơn vị thời gian", "ms, giây, phút, giờ, ngày, tuần, năm...", "Chuyển đổi", "unit-time", "unit-time", ["đổi thời gian"]),
  t("doi-ap-suat", "Đổi áp suất", "Pa, kPa, bar, psi, atm, mmHg...", "Chuyển đổi", "unit-pressure", "unit-pressure", ["đổi áp suất"]),
  t("doi-tien-te", "Đổi tiền tệ", "VND, USD, EUR, JPY... theo tỉ giá tham khảo cập nhật tay.", "Chuyển đổi", "currency", "currency", ["đổi tiền", "exchange"]),

  // ── Tài chính (8) ──
  t("tinh-lai-kep", "Tính lãi kép", "Mô phỏng gửi tiết kiệm cộng dồn, biểu đồ tăng trưởng.", "Tài chính", "compound", "compound", ["lãi kép"]),
  t("tinh-lai-vay", "Tính lãi vay ngân hàng", "Dư nợ giảm dần & cố định, lịch trả hàng tháng.", "Tài chính", "loan", "loan", ["tính lãi vay"]),
  t("tinh-vat", "Tính VAT", "Cộng/trừ VAT 8%/10%, suy ngược giá trước thuế.", "Tài chính", "vat", "vat", ["tính vat"]),
  t("tinh-chiet-khau", "Tính chiết khấu", "% giảm giá, giá sau giảm, mua 2 tặng 1 quy đổi.", "Tài chính", "discount", "discount", ["chiết khấu"]),
  t("luong-gross-net", "Lương Gross sang Net", "Ước tính lương Net Việt Nam sau BHXH, thuế TNCN.", "Tài chính", "salary", "salary", ["gross net"]),
  t("tinh-tien-tip", "Tính tiền Tip & chia bill", "Chia hoá đơn nhóm, gồm VAT + tip theo đầu người.", "Tài chính", "tip", "tip", ["chia bill", "tip"]),
  t("tinh-phan-tram", "Tính phần trăm %", "X là bao nhiêu % của Y, tăng/giảm bao nhiêu %.", "Tài chính", "percent", "percent", ["tính phần trăm"]),
  t("may-tinh", "Máy tính online", "Cộng trừ nhân chia, %, ngoặc, lịch sử phép tính.", "Tài chính", "calculator", "calculator", ["máy tính"]),

  // ── Sức khoẻ (7) ──
  t("tinh-bmi", "Tính BMI", "Chỉ số khối cơ thể, phân loại gầy/bình thường/béo phì.", "Sức khoẻ", "bmi", "bmi", ["tính bmi"]),
  t("tinh-bmr", "Tính BMR", "Năng lượng nghỉ ngơi Mifflin-St Jeor theo tuổi/giới tính.", "Sức khoẻ", "bmr", "bmr", ["bmr"]),
  t("tinh-tdee", "Tính TDEE", "Tổng năng lượng tiêu hao theo mức vận động, gợi ý cắt/giảm cân.", "Sức khoẻ", "tdee", "tdee", ["tdee"]),
  t("luong-nuoc", "Lượng nước cần uống", "Công thức theo cân nặng + vận động + thời tiết.", "Sức khoẻ", "water", "water", ["uống nước"]),
  t("can-nang-ly-tuong", "Cân nặng lý tưởng", "Công thức Devine, Robinson, Miller theo chiều cao.", "Sức khoẻ", "ideal-weight", "ideal-weight", ["cân lý tưởng"]),
  t("ngay-du-sinh", "Tính ngày dự sinh", "Naegele từ kỳ kinh cuối + tuần thai hiện tại.", "Sức khoẻ", "due-date", "due-date", ["dự sinh"]),
  t("nhip-tim", "Nhịp tim mục tiêu", "Vùng đốt mỡ Cardio theo công thức Karvonen.", "Sức khoẻ", "heart-rate", "heart-rate", ["nhịp tim"]),

  // ── Thời gian (9) ──
  t("tinh-tuoi", "Tính tuổi chính xác", "Tuổi theo năm/tháng/ngày, tổng ngày sống, cung hoàng đạo.", "Thời gian", "age", "age", ["tính tuổi"]),
  t("dem-nguoc", "Đếm ngược thời gian", "Countdown tới sự kiện, full-screen, có âm báo.", "Thời gian", "countdown", "countdown", ["đếm ngược"]),
  t("bam-gio", "Bấm giờ & Đồng hồ", "Stopwatch ms chính xác + đồng hồ kim/số trực tiếp.", "Thời gian", "stopwatch", "stopwatch", ["bấm giờ"]),
  t("doi-timestamp", "Đổi Timestamp", "Unix ↔ ngày giờ, hiện tại, UTC/GMT+7.", "Thời gian", "timestamp", "timestamp", ["timestamp"]),
  t("cong-tru-ngay", "Cộng trừ ngày", "Ngày X sau/cách đây N ngày là thứ mấy, ngày nào.", "Thời gian", "date-add", "date-add", ["cộng ngày"]),
  t("khoang-cach-ngay", "Khoảng cách 2 ngày", "Số ngày/tuần/tháng giữa 2 mốc, ngày làm việc.", "Thời gian", "date-diff", "date-diff", ["khoảng cách ngày"]),
  t("nam-nhuan", "Năm nhuận?", "Kiểm tra năm nhuận + số ngày tháng 2, lịch 400 năm.", "Thời gian", "leap-year", "leap-year", ["năm nhuận"]),
  t("thu-trong-tuan", "Thứ trong tuần", "Tra thứ của bất kỳ ngày nào (quá khứ/tương lai).", "Thời gian", "weekday", "weekday", ["thứ mấy"]),
  t("gio-the-gioi", "Giờ thế giới", "Xem giờ live Hà Nội, Tokyo, London, New York...", "Thời gian", "world-clock", "world-clock", ["giờ thế giới"]),

  // ── SEO & Marketing (7) ──
  t("xem-truoc-serp", "Xem trước SERP Google", "Preview title + description trên desktop/mobile, đếm pixel.", "SEO & Marketing", "serp", "serp", ["serp preview"]),
  t("mat-do-tu-khoa", "Mật độ từ khoá", "Phân tích keyword density 1-3 từ, gợi ý SEO.", "SEO & Marketing", "keyword-density", "keyword-density", ["mật độ từ khóa"]),
  t("tao-robots", "Tạo robots.txt", "Sinh robots.txt Allow/Disallow + Sitemap nhanh.", "SEO & Marketing", "robots-gen", "robots-gen", ["robots.txt"]),
  t("tao-sitemap", "Tạo sitemap.xml", "Nhập list URL để sinh sitemap.xml chuẩn.", "SEO & Marketing", "sitemap-gen", "sitemap-gen", ["sitemap"]),
  t("tao-meta-tags", "Tạo Meta Tags", "Sinh title, description, Open Graph, Twitter Card.", "SEO & Marketing", "meta-gen", "meta-gen", ["meta tags"]),
  t("tao-utm", "Tạo link UTM", "Builder utm_source/medium/campaign chuẩn GA4.", "SEO & Marketing", "utm", "utm", ["utm builder"]),
  t("rut-gon-van-ban-seo", "Rút gọn mô tả SEO", "Cắt description đúng 155-160 ký tự, không cụt từ.", "SEO & Marketing", "seo-trim", "seo-trim", ["meta description"]),

  // ── Hình ảnh (5) ──
  t("nen-anh", "Nén ảnh online", "Giảm dung lượng JPG/PNG/WebP ngay trên trình duyệt.", "Hình ảnh", "image-compress", "image-compress", ["nén ảnh", "compress image"]),
  t("doi-size-anh", "Đổi kích thước ảnh", "Resize theo px hoặc %, giữ tỉ lệ, tải PNG/JPG.", "Hình ảnh", "image-resize", "image-resize", ["resize ảnh"]),
  t("anh-sang-base64", "Ảnh sang Base64", "Chuyển ảnh thành data URI để nhúng HTML/CSS.", "Hình ảnh", "image-base64", "image-base64", ["ảnh base64"]),
  t("tao-favicon", "Tạo Favicon", "Vẽ chữ/emoji thành favicon PNG 64px, tải về.", "Hình ảnh", "favicon-gen", "favicon-gen", ["favicon"]),
  t("xoay-lat-anh", "Xoay / Lật ảnh", "Xoay 90°, lật ngang/dọc, tải ảnh mới.", "Hình ảnh", "image-rotate", "image-rotate", ["xoay ảnh"]),

  // ── Tiện ích (12) ──
  t("ghi-chu", "Ghi chú online", "Notepad auto-save localStorage, đếm chữ, tải .txt.", "Tiện ích", "notepad", "notepad", ["ghi chú", "notepad"]),
  t("dem-nguoc-tet", "Đếm ngược Tết", "Còn bao nhiêu ngày tới Tết Nguyên Đán tiếp theo.", "Tiện ích", "tet-countdown", "tet-countdown", ["đếm ngược tết"]),
  t("cung-hoang-dao", "Cung hoàng đạo", "Tra cung từ ngày sinh + tử vi nhanh.", "Tiện ích", "zodiac", "zodiac", ["cung hoàng đạo"]),
  t("tinh-diem-gpa", "Tính điểm GPA", "Trung bình môn, quy đổi 10 → 4 → chữ A/B/C.", "Tiện ích", "gpa", "gpa", ["tính gpa"]),
  t("luyen-go-phim", "Luyện gõ phím", "Test tốc độ WPM 60 giây, tiếng Việt có dấu.", "Tiện ích", "typing", "typing", ["typing test", "gõ phím"]),
  t("tao-chu-ky", "Tạo chữ ký email", "Sinh chữ ký HTML với tên, chức danh, SĐT.", "Tiện ích", "signature", "signature", ["chữ ký email"]),
  t("quay-so", "Vòng quay may mắn", "Random picker: nhập danh sách → quay chọn 1.", "Tiện ích", "wheel", "wheel", ["vòng quay", "random picker"]),
  t("tao-lorem", "Tạo văn bản Lorem", "Sinh đoạn Lorem Ipsum / tiếng Việt mẫu theo số từ.", "Tiện ích", "lorem", "lorem", ["lorem ipsum"]),
  t("doi-don-vi-van-ban", "Đổi font chữ FB", "Chữ 𝔫𝔤𝔥ệ𝔠𝔥 𝔫𝔤ượ𝔠, ⓑⓞⓝⓖ... để đăng Facebook/TikTok.", "Tiện ích", "fancy-text", "fancy-text", ["font chữ đẹp"]),
  t("kiem-tra-dung-luong-mang", "Bấm giờ phản hồi", "Đo ping tới server bằng fetch, vẽ biểu đồ ms.", "Tiện ích", "ping-test", "ping-test", ["đo ping"]),
  t("tao-ma-vach-qr-wifi", "Tạo QR WiFi", "QR đăng nhập WiFi (SSID, mật khẩu, WPA/WEP).", "Tiện ích", "wifi-qr", "wifi-qr", ["qr wifi"]),
  t("lich-van-nien-mini", "Ngày tốt / Can Chi", "Can-Chi năm, mệnh ngũ hành, giờ hoàng đạo (tham khảo).", "Tiện ích", "canchi", "canchi", ["can chi", "ngày tốt"]),
];

export const TOOL_COUNT = TOOLS.length;

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getRelated(tool: Tool, n = 6): Tool[] {
  const same = TOOLS.filter((x) => x.slug !== tool.slug && x.category === tool.category);
  const other = TOOLS.filter((x) => x.slug !== tool.slug && x.category !== tool.category);
  return [...same, ...other].slice(0, n);
}

export function searchTools(q: string): Tool[] {
  const s = q.trim().toLowerCase();
  if (!s) return TOOLS;
  return TOOLS.filter(
    (t) =>
      t.name.toLowerCase().includes(s) ||
      t.description.toLowerCase().includes(s) ||
      t.slug.includes(s.replace(/\s+/g, "-")) ||
      t.keywords.some((k) => k.toLowerCase().includes(s))
  );
}
