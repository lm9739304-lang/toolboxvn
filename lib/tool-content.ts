import type { Lang } from "./translations";
import type { Tool } from "./tools";

type Content = { what: string; why: string; example: string };

/* Hand-written explanations for the tools people open most. Everything else
   falls back to the tool description + a category-level reason. */
const CONTENT: Record<string, { vi: Content; en: Content }> = {
  "tao-ma-qr": {
    vi: {
      what: "Biến một đường link, đoạn văn bản hoặc thông tin WiFi thành mã QR tải về được. Bạn chọn kích thước, nhập nội dung và mã QR cập nhật ngay lập tức.",
      why: "In lên menu, dán lên bao bì, hoặc chia sẻ WiFi cho khách mà không cần ai gõ mật khẩu. Không cần cài app, không có watermark.",
      example: "Dán link https://toolbox.vn → tải PNG → dán lên bàn tiệc.",
    },
    en: {
      what: "Turns a link, plain text, or WiFi credentials into a downloadable QR code. Pick a size, type your content, and the code updates live.",
      why: "Print it on a menu, stick it on packaging, or let guests scan your WiFi instead of typing a password. No app, no watermark.",
      example: "Paste https://toolbox.vn → download PNG → put it on the table.",
    },
  },
  "json-formatter": {
    vi: {
      what: "Dán JSON xấu xí vào, nhận về JSON đã thụt dòng, đúng chuẩn, kèm thông báo lỗi chi tiết nếu cú pháp sai — kèm nút thu gọn về 1 dòng.",
      why: "Cấu hình API, log, hay file export thường bị nén thành một dòng. Công cụ này giúp bạn đọc và sửa chúng trong vài giây, ngay trên máy bạn.",
      example: '{"name":"ToolBox","tools":110,"free":true} → bấm Làm đẹp → đọc dễ ngay.',
    },
    en: {
      what: "Paste ugly JSON in, get properly indented JSON out — plus a clear error message when the syntax is wrong, and a minify button for the reverse.",
      why: "API responses, logs and exports arrive as one long line. This reads and fixes them in seconds, entirely on your device.",
      example: '{"name":"ToolBox","tools":110,"free":true} → click Format → instantly readable.',
    },
  },
  "tinh-bmi": {
    vi: {
      what: "Nhập chiều cao và cân nặng, nhận ngay chỉ số khối cơ thể (BMI) kèm phân loại theo chuẩn dành cho người châu Á.",
      why: "Là bước kiểm tra đầu tiên để biết cân nặng đang ở mức nào so với chiều cao — nhanh, miễn phí, và không cần app.",
      example: "165 cm / 60 kg → BMI 22.0 → Bình thường.",
    },
    en: {
      what: "Enter height and weight, get your Body Mass Index immediately, classified on the Asia-appropriate scale.",
      why: "It's the quickest first check of whether your weight is in a healthy range for your height — no app needed.",
      example: "165 cm / 60 kg → BMI 22.0 → Normal.",
    },
  },
  "tao-mat-khau": {
    vi: {
      what: "Tạo mật khẩu ngẫu nhiên 4–64 ký tự bằng bộ sinh số thật sự ngẫu nhiên của trình duyệt (crypto). Tùy chọn chữ hoa, số, ký hiệu và loại bỏ ký tự dễ nhầm như 0/O, 1/l.",
      why: "Mật khẩu do con người nghĩ ra thường dễ đoán. Mật khẩu sinh ngẫu nhiên gần như không thể bẻ khoá — và công cụ không bao giờ gửi nó đi đâu.",
      example: "16 ký tự, đủ cả 4 nhóm → mật khẩu như 'kR7#mPx2vN9qLw4a'.",
    },
    en: {
      what: "Generates a random 4–64 character password using the browser's real cryptographic random generator. You control uppercase, numbers, symbols, and can exclude lookalikes like 0/O and 1/l.",
      why: "Human-made passwords are guessable. Randomly generated ones are effectively uncrackable — and this tool never sends them anywhere.",
      example: "16 characters, all four groups → something like 'kR7#mPx2vN9qLw4a'.",
    },
  },
  "dem-tu": {
    vi: {
      what: "Đếm từ, ký tự, câu, đoạn, số dòng và cả thời gian đọc ước tính — cập nhật ngay khi bạn dán hoặc gõ.",
      why: "Bài đăng mạng xã hội giới hạn ký tự, SEO cần tiêu đề đúng chuẩn, bài nói cần đúng thời lượng. Con số này cần thiết hàng ngày.",
      example: "Dán caption Facebook → thấy 273/250 ký tự → cắt bớt tới khi đạt.",
    },
    en: {
      what: "Counts words, characters, sentences, paragraphs, lines and even estimated reading time — updating live as you type or paste.",
      why: "Social posts have character caps, SEO needs exact title lengths, speeches need the right duration. This number matters daily.",
      example: "Paste a Facebook caption → see 273/250 characters → trim until it fits.",
    },
  },
  "ma-hoa-base64": {
    vi: {
      what: "Mã hoá văn bản sang Base64 và ngược lại, hỗ trợ đầy đủ tiếng Việt (Unicode) — thứ mà nhiều công cụ khác làm hỏng.",
      why: "Base64 xuất hiện khắp nơi: email, token, API, thẻ data URI. Đây là cách nhanh nhất để kiểm tra hoặc tạo một chuỗi Base64 cho đúng.",
      example: "ToolBoxVN → VG9vbEJveFZO. Ngược lại cũng vậy.",
    },
    en: {
      what: "Encodes text to Base64 and back, with full Unicode support — the part many other tools break.",
      why: "Base64 shows up everywhere: emails, tokens, APIs, data URIs. This is the fastest way to verify or produce one correctly.",
      example: "ToolBoxVN → VG9vbEJveFZO. And the reverse.",
    },
  },
  "may-tinh": {
    vi: {
      what: "Máy tính cơ bản với bàn phím lớn, hỗ trợ % và ngoặc, kèm lịch sử 10 phép tính gần nhất.",
      why: "Lúc cần nhân chia nhanh mà không muốn mở app hay điện thoại. Bấm phím Enter để tính, lịch sử ngay bên dưới.",
      example: "Gõ 2*(3+4)/5 → = 2.8.",
    },
    en: {
      what: "A basic calculator with a large keypad, percent and parentheses support, plus a history of your last 10 calculations.",
      why: "For quick multiplication and division when you don't want to hunt for the phone app. Press Enter to solve, history sits right below.",
      example: "Type 2*(3+4)/5 → = 2.8.",
    },
  },
  "doi-tien-te": {
    vi: {
      what: "Đổi nhanh giữa VND và 9 đồng tiền phổ biến (USD, EUR, JPY...) theo tỉ giá tham khảo được cập nhật thủ công.",
      why: "Khi xem giá trên web nước ngoài hay chuẩn bị đơn hàng, bạn cần một con số thô — không cần mở app ngân hàng.",
      example: "100 USD → ~2,545,000 VND (tỉ giá tham khảo, không dùng để giao dịch).",
    },
    en: {
      what: "Quickly converts between VND and 9 common currencies (USD, EUR, JPY…) using a hand-maintained reference rate.",
      why: "When browsing foreign prices or preparing an order, you need a rough number fast — not a banking app.",
      example: "100 USD → ~2,545,000 VND (reference rate, not for transactions).",
    },
  },
  "nen-anh": {
    vi: {
      what: "Giảm dung lượng ảnh JPG/PNG/WebP ngay trong trình duyệt bằng cách vẽ lại ảnh với mức chất lượng bạn chọn — ảnh không bao giờ được tải lên server.",
      why: "Ảnh chụp điện thoại thường 3–8 MB, làm web chậm và email đầy. Nén còn 200–500 KB thường vẫn đẹp mắt, mà không cần cài phần mềm.",
      example: "Ảnh 4.2 MB → chọn chất lượng 80% → còn ~600 KB, nhìn gần như giống hệt.",
    },
    en: {
      what: "Shrinks JPG/PNG/WebP files right in your browser by re-encoding at your chosen quality — the image never leaves your device.",
      why: "Phone photos run 3–8 MB and slow down websites and emails. Compressing to 200–500 KB usually looks identical, with zero software to install.",
      example: "A 4.2 MB photo → quality 80% → ~600 KB, visually near-identical.",
    },
  },
  "tinh-lai-kep": {
    vi: {
      what: "Mô phỏng gửi tiết kiệm lãi kép: nhập vốn ban đầu, lãi suất, số năm và khoản gửi thêm hàng tháng để thấy tổng nhận sau cùng.",
      why: "Lãi kép là lý do bắt đầu sớm quan trọng hơn gửi nhiều. Thử vài con số và bạn sẽ thấy chênh lệch sau 10–20 năm.",
      example: "100 triệu + 2 triệu/tháng, 6%/năm, 10 năm → ~497 triệu, trong đó lãi chiếm hơn một nửa.",
    },
    en: {
      what: "Simulates compound-interest savings: enter principal, rate, years, and a monthly top-up to see the final balance.",
      why: "Compounding is why starting early beats saving big. Play with the numbers and watch the gap after 10–20 years.",
      example: "100M + 2M/month at 6% for 10 years → ~497M — interest is more than half of it.",
    },
  },
  "luong-gross-net": {
    vi: {
      what: "Nhập lương Gross, nhận về lương Net ước tính sau khi trừ BHXH, BHYT, BHTN và thuế TNCN theo biểu hiện hành.",
      why: "Khi đàm phán lương, bạn cần biết con số thực nhận. Công cụ này ước tính nhanh để bạn không phải hỏi kế toán mỗi lần.",
      example: "Gross 20 triệu → Net ~17.3 triệu (chưa tính người phụ thuộc).",
    },
    en: {
      what: "Enter a Gross salary and get an estimated Net after Vietnamese social insurance, health insurance, unemployment insurance, and personal income tax.",
      why: "When negotiating salary you need the take-home number. This estimates it fast so you don't have to ask an accountant every time.",
      example: "Gross 20M VND → Net ~17.3M VND (no dependants factored).",
    },
  },
  "tinh-tuoi": {
    vi: {
      what: "Nhập ngày sinh, nhận tuổi chính xác theo năm/tháng/ngày, tổng số ngày đã sống và cung hoàng đạo.",
      why: "Làm giấy tờ, đăng ký thi cử, hay đơn giản là thắc mắc 'mình sống được bao lâu rồi' — một công cụ, mọi câu trả lời.",
      example: "01/01/2000 → 26 tuổi 8 tháng 8 ngày · 9,762 ngày.",
    },
    en: {
      what: "Enter a birth date and get exact age in years/months/days, total days lived, and a zodiac sign.",
      why: "For paperwork, exam registrations, or simply wondering how many days you've been around — one input, all the answers.",
      example: "Jan 1, 2000 → 26y 8m 8d · 9,762 days.",
    },
  },
  "hex-sang-rgb": {
    vi: {
      what: "Dán mã HEX (hoặc chọn từ bảng màu) để nhận RGB, kèm ô xem trước màu lớn.",
      why: "CSS cần rgb(), Figma muốn HEX, còn mắt bạn cần thấy màu thật. Công cụ này dịch giữa hai thế giới trong một lần bấm.",
      example: "#1d4ed8 → rgb(29, 78, 216).",
    },
    en: {
      what: "Paste a HEX code (or pick from the color panel) and get RGB with a large live preview swatch.",
      why: "CSS wants rgb(), Figma asks for HEX, and your eyes need the actual color. This translates between the two in one click.",
      example: "#1d4ed8 → rgb(29, 78, 216).",
    },
  },
  "tao-slug": {
    vi: {
      what: "Biến tiêu đề tiếng Việt thành slug URL chuẩn: bỏ dấu, chuyển chữ thường, thay khoảng trắng bằng gạch ngang.",
      why: "URL đẹp giúp người dùng tin link hơn và SEO tốt hơn. Làm thủ công dễ gõ sót dấu — công cụ này không bao giờ sót.",
      example: "'Tiêu đề bài viết đẹp 2026!' → tieu-de-bai-viet-dep-2026.",
    },
    en: {
      what: "Turns a Vietnamese title into a clean URL slug: accents stripped, lowercased, spaces become hyphens.",
      why: "Clean URLs earn trust and rank better. Doing it by hand risks leftover diacritics — this tool never misses one.",
      example: "'Tiêu đề bài viết đẹp 2026!' → tieu-de-bai-viet-dep-2026.",
    },
  },
  "xem-truoc-serp": {
    vi: {
      what: "Nhập title, URL và description để xem trang của bạn hiển thị thế nào trên Google desktop và mobile, kèm số ký tự.",
      why: "Tiêu đề bị cắt cụt là click mất. Nhìn thấy trước khi xuất bản giúp bạn viết meta đúng chuẩn ngay từ đầu.",
      example: "Title 68 ký tự → thấy bị cắt '...' ở phần cuối trên mobile.",
    },
    en: {
      what: "Enter title, URL and description to see how your page renders on Google desktop and mobile, with live character counts.",
      why: "A truncated title loses clicks. Seeing it before you publish means you write correct metadata the first time.",
      example: "A 68-char title → you see the '...' cut-off on mobile.",
    },
  },
  "luyen-go-phim": {
    vi: {
      what: "Đo tốc độ gõ (WPM) bằng đoạn văn tiếng Việt có dấu, có tô màu đúng/sai theo từng từ.",
      why: "Gõ nhanh là kỹ năng trả lãi mỗi ngày — học lại bàn phím, chuẩn bị phỏng vấn, hay chỉ để biết mình đang ở mức nào.",
      example: "Gõ 60 giây → 42 WPM, độ chính xác 94%.",
    },
    en: {
      what: "Measures typing speed (WPM) with an accented Vietnamese passage, coloring each word right or wrong as you go.",
      why: "Fast typing pays off daily — relearning the keyboard, prepping for interviews, or just knowing where you stand.",
      example: "Type for 60 seconds → 42 WPM at 94% accuracy.",
    },
  },
};

/* Category-level fallback reasons, used when a tool has no hand-written entry. */
const CATEGORY_WHY: Record<string, { vi: string; en: string }> = {
  "Văn bản": {
    vi: "Xử lý văn bản là việc hàng ngày: đếm, chuẩn hoá, so sánh. Làm ngay trên trình duyệt, không cần mở Word.",
    en: "Text work is daily work: counting, cleaning, comparing. Do it in the browser — no Word required.",
  },
  "Mã hoá & Dev": {
    vi: "Kiểu công cụ nhỏ mà developer dùng mười lần một ngày nhưng không ai muốn viết lại. Mở là dùng.",
    en: "The small kind of tool developers reach for ten times a day but never want to rewrite. Open and use.",
  },
  "Màu sắc": {
    vi: "Tra, pha và kiểm tra màu mà không cần mở phần mềm thiết kế. Copy mã là xong.",
    en: "Look up, mix and check colors without opening design software. Copy the code and you're done.",
  },
  "Ngẫu nhiên": {
    vi: "Khi cần một kết quả không thiên vị: mật khẩu, UUID, quay số. Bộ sinh ngẫu nhiên của trình duyệt đảm bảo điều đó.",
    en: "When you need an unbiased outcome: passwords, UUIDs, picks. The browser's crypto RNG guarantees it.",
  },
  "Chuyển đổi": {
    vi: "Đổi đơn vị là việc nhỏ nhưng hay quên hệ số. Tra một lần, có ngay con số, không phải đoán.",
    en: "Unit conversion is small but easy to get wrong. Look it up once, get the exact number, stop guessing.",
  },
  "Tài chính": {
    vi: "Những con số tài chính quan trọng nên được tính lại một lần nữa trước khi ký. Đây là nơi để làm điều đó.",
    en: "Financial numbers deserve a second calculation before you sign anything. This is where to do it.",
  },
  "Sức khoẻ": {
    vi: "Ước tính nhanh để tham khảo — BMI, nước, nhịp tim. Không thay thế bác sĩ, nhưng tốt hơn việc đoán mò.",
    en: "Quick reference estimates — BMI, hydration, heart rate. Not a doctor, but far better than guessing.",
  },
  "Thời gian": {
    vi: "Tuổi, deadline, timestamp, múi giờ — thời gian thì ai cũng phải tính, và làm sai thì tốn kém.",
    en: "Ages, deadlines, timestamps, time zones — everyone counts time, and getting it wrong is expensive.",
  },
  "SEO & Marketing": {
    vi: "Kiểm tra meta, sinh robots và sitemap, xây link UTM — những việc lặp đi lặp lại nên được tự động hoá.",
    en: "Meta checks, robots and sitemap generation, UTM links — repetitive chores that deserve automation.",
  },
  "Hình ảnh": {
    vi: "Nén, resize, chuyển đổi ảnh mà không cần cài phần mềm — và ảnh không hề rời khỏi máy bạn.",
    en: "Compress, resize and convert images without installing software — and the file never leaves your machine.",
  },
  "Tiện ích": {
    vi: "Những tiện ích nhỏ không thuộc danh mục nào nhưng đúng là lúc cần thì rất cần.",
    en: "Small utilities that belong to no category but are exactly what you need when you need them.",
  },
};

export function getToolContent(
  tool: Tool,
  lang: Lang,
  fallbackDescription: string
): Content {
  const entry = CONTENT[tool.slug];
  if (entry) return entry[lang];
  const catWhy = CATEGORY_WHY[tool.category];
  return {
    what: fallbackDescription,
    why: catWhy ? catWhy[lang] : "",
    example: "",
  };
}

export const HAS_EXAMPLE = (slug: string): boolean => slug in CONTENT;
