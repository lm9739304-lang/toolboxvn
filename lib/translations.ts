export type Lang = "en" | "vi";

export const translations = {
  en: {
    // Header
    searchPlaceholder: "Search tools...",
    navTools: "Tools",
    navPopular: "Popular",
    navAdmin: "Admin",

    // Hero
    heroTitle1: "100+ tools for",
    heroTitle2: "developers & creators.",
    heroDesc: "No login. No uploads. Everything runs in your browser.",
    searchInput: (n: number) => `Search ${n} tools...`,
    clear: "Clear",
    statTools: "tools",
    statClient: "Client-side",
    statFree: "Free forever",

    // Sidebar
    allTools: "All tools",
    all: "All",

    // Home sections
    continueUsing: "Continue",
    mostUsed: "Most used",
    featured: "Featured",
    trending: "Trending",
    resultsFor: (q: string, cat: string) =>
      `${q ? `for "${q}"` : ""}${cat ? ` in ${cat}` : ""}`.trim(),
    noResults: 'No tools found. Try "qr", "bmi", "json"...',

    // Footer
    footerDesc: "100+ free online tools. Everything runs in your browser. No data uploads. No accounts required.",
    footerCategories: "Categories",
    footerPopular: "Popular tools",
    footerInfo: "Info",
    footerAllTools: "All tools",
    footerAds: "Ads are placed in fixed positions with clear labels. They never obscure content or functional buttons.",
    footerCopyright: "Built for speed. Deployed on Cloudflare Pages.",

    // Tool detail
    breadcrumbHome: "Home",
    howToUse: "How to use",
    faqTitle: "FAQ",
    faqFree: "Is it free?",
    faqFreeAnswer: "Yes, 100% free. No limits, no account needed.",
    faqSafe: "Is my data safe?",
    faqSafeAnswer: "Everything runs on your browser (client-side). Nothing is sent to any server.",
    faqMobile: "Does it work on mobile?",
    faqMobileAnswer: "Yes. Responsive layout, ads resize to avoid blocking content.",
    relatedTools: "Related tools",
    defaultGuide: [
      "Enter your data in the field above.",
      "Results update in real time.",
      "Copy or download the output.",
    ],

    // ToolActions
    save: "Save",
    saved: "Saved",
    share: "Share",
    copied: "Copied!",

    // ToolCard
    unfavorite: "Unfavorite",
    favorite: "Favorite",

    // Admin
    adminLogin: "Login",
    adminPassword: "Password",
    adminSubmit: "Submit",
    adminLogout: "Logout",
    adminTitle: "Admin Panel",
    adminTools: "Tools",
    adminAds: "Ads",
    adminSettings: "Settings",

    // Category names
    catText: "Text",
    catDev: "Code & Dev",
    catColor: "Colors",
    catRandom: "Random",
    catConvert: "Convert",
    catFinance: "Finance",
    catHealth: "Health",
    catTime: "Time",
    catSeo: "SEO & Marketing",
    catImage: "Images",
    catUtility: "Utilities",
  },

  vi: {
    // Header
    searchPlaceholder: "Tìm công cụ...",
    navTools: "Tools",
    navPopular: "Phổ biến",
    navAdmin: "Admin",

    // Hero
    heroTitle1: "100+ công cụ cho",
    heroTitle2: "nhà phát triển & sáng tạo.",
    heroDesc: "Không cần đăng nhập. Không tải lên. Mọi thứ chạy trên trình duyệt.",
    searchInput: (n: number) => `Tìm trong ${n} công cụ...`,
    clear: "Xoá",
    statTools: "công cụ",
    statClient: "Client-side",
    statFree: "Miễn phí",

    // Sidebar
    allTools: "Tất cả",
    all: "Tất cả",

    // Home sections
    continueUsing: "Tiếp tục sử dụng",
    mostUsed: "Nhiều người dùng",
    featured: "Nổi bật",
    trending: "Phổ biến",
    resultsFor: (q: string, cat: string) =>
      `${q ? `cho "${q}"` : ""}${cat ? ` trong ${cat}` : ""}`.trim(),
    noResults: 'Không tìm thấy. Thử "qr", "bmi", "json"...',

    // Footer
    footerDesc: "100+ công cụ online miễn phí. Mọi thứ chạy trên trình duyệt. Không tải dữ liệu. Không cần tài khoản.",
    footerCategories: "Danh mục",
    footerPopular: "Công cụ phổ biến",
    footerInfo: "Thông tin",
    footerAllTools: "Tất cả công cụ",
    footerAds: "Quảng cáo hiển thị ở vị trí cố định, có nhãn rõ ràng, không che nội dung, không đặt sát nút chức năng.",
    footerCopyright: "Tốc độ • Deploy trên Cloudflare Pages.",

    // Tool detail
    breadcrumbHome: "Trang chủ",
    howToUse: "Cách dùng",
    faqTitle: "Câu hỏi thường gặp",
    faqFree: "Có miễn phí không?",
    faqFreeAnswer: "Có, 100% miễn phí. Không giới hạn, không cần tài khoản.",
    faqSafe: "Dữ liệu có an toàn?",
    faqSafeAnswer: "Mọi xử lý chạy trên trình duyệt (client-side). Không gửi lên máy chủ.",
    faqMobile: "Dùng trên điện thoại được không?",
    faqMobileAnswer: "Có. Giao diện responsive, banner quảng cáo tự co giãn, không che nội dung.",
    relatedTools: "Công cụ liên quan",
    defaultGuide: [
      "Nhập dữ liệu vào ô phía trên.",
      "Kết quả cập nhật theo thời gian thực.",
      "Bấm Sao chép / Tải về để sử dụng.",
    ],

    // ToolActions
    save: "Lưu",
    saved: "Đã lưu",
    share: "Chia sẻ",
    copied: "Đã copy!",

    // ToolCard
    unfavorite: "Bỏ yêu thích",
    favorite: "Yêu thích",

    // Admin
    adminLogin: "Đăng nhập",
    adminPassword: "Mật khẩu",
    adminSubmit: "Xác nhận",
    adminLogout: "Đăng xuất",
    adminTitle: "Quản trị",
    adminTools: "Công cụ",
    adminAds: "Quảng cáo",
    adminSettings: "Cài đặt",

    // Category names
    catText: "Văn bản",
    catDev: "Mã hoá & Dev",
    catColor: "Màu sắc",
    catRandom: "Ngẫu nhiên",
    catConvert: "Chuyển đổi",
    catFinance: "Tài chính",
    catHealth: "Sức khoẻ",
    catTime: "Thời gian",
    catSeo: "SEO & Marketing",
    catImage: "Hình ảnh",
    catUtility: "Tiện ích",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
