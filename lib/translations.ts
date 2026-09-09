export type Lang = "en" | "vi";

export const translations = {
  en: {
    // Header
    searchPlaceholder: "Search tools...",
    navTools: "Tools",
    navCategories: "Categories",
    navPopular: "Popular",
    navAdmin: "Admin",
    menu: "Menu",
    close: "Close",
    language: "Language",

    // New editorial homepage
    brandKicker: "TOOLBOXVN / DIGITAL UTILITIES",
    heroHeadlineA: "Tools for the things",
    heroHeadlineB: "you do every day.",
    heroSub: "A quiet set of fast, private utilities. No accounts. No uploads. Everything runs on your device.",
    heroSearchPlaceholder: "Search utilities…",
    heroSearchHint: "Press",
    metaPrivate: "Private by design",
    metaNoSignup: "No sign-up",
    metaLocal: "Runs locally",
    explorerKicker: "Explorer",
    explorerTitle: "Browse by intent",
    explorerDesc: "Pick a category on the left. Every tool opens instantly.",
    explorerAll: "All",
    explorerCount: (n: number) => `${n} utilities`,
    featuredKicker: "Featured",
    featuredTitle: "Start here",
    featuredOpen: "Open tool",
    popularKicker: "Most used",
    popularTitle: "Popular right now",
    popularEmpty: "Use any tool and it will show up here.",
    recentKicker: "Application",
    recentTitle: "Recently opened",
    recentEmpty: "Nothing opened yet. Your history stays on this device.",
    recentClear: "Clear",
    footerStatement: "A small, independent set of utilities. Built to be fast, private, and out of your way.",
    footerExplore: "Explore",
    footerCompany: "Product",
    footerLegal: "Legal",
    footerRights: "All processing happens in your browser.",

    // Spec hero + meta
    heroEyebrowTop: "TOOLBOXVN",
    heroEyebrowSub: "DIGITAL UTILITIES",
    metaTools: (n: number) => `${n}+ TOOLS`,
    metaNoLogin: "NO LOGIN",
    metaFree: "FREE",
    metaFast: "FAST",

    // Palette
    paletteCategories: "Categories",
    paletteTools: "Tools",

    // Tool detail workspace
    workspace: "Workspace",

    // Info pages
    aboutTitle: "About",
    aboutLead: "ToolboxVN is a small workshop for everyday digital tasks.",
    aboutBody: [
      "Every utility on this site does one job, opens instantly, and runs entirely in your browser. There are no accounts, no uploads, and no tracking of what you type.",
      "The project is maintained independently. New tools are added slowly and deliberately — only when they earn their place.",
    ],
    privacyTitle: "Privacy",
    privacyLead: "Your data never leaves your device.",
    privacyBody: [
      "All tools process your input locally in the browser using JavaScript, Web Crypto, or Canvas. Nothing you type, paste, or upload is sent to any server by ToolboxVN.",
      "Preferences such as theme, language, favorites, and recently used tools are stored only in your browser's localStorage. Clearing your browser data removes them completely.",
      "Third-party scripts on this site are limited to advertising (Google AdSense) and anonymous analytics, each governed by its provider's own policy.",
    ],
    termsTitle: "Terms",
    termsLead: "Simple rules for a simple product.",
    termsBody: [
      "ToolboxVN provides every tool free of charge, as-is, without warranty of any kind. Results — from currency conversions to health estimates — are references, not professional advice.",
      "Do not use the tools for anything unlawful, and do not attempt to disrupt the site. Automated bulk scraping that degrades the service for others is not welcome.",
      "These terms may be updated occasionally. Continued use of the site means you accept the current version.",
    ],
    backHome: "Back to home",

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
    copyBtn: "Copy",
    download: "Download",

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
    navTools: "Công cụ",
    navCategories: "Danh mục",
    navPopular: "Phổ biến",
    navAdmin: "Admin",
    menu: "Menu",
    close: "Đóng",
    language: "Ngôn ngữ",

    // New editorial homepage
    brandKicker: "TOOLBOXVN / TIỆN ÍCH SỐ",
    heroHeadlineA: "Công cụ cho những việc",
    heroHeadlineB: "bạn làm mỗi ngày.",
    heroSub: "Bộ tiện ích gọn, nhanh và riêng tư. Không tài khoản. Không tải lên. Mọi thứ chạy trên thiết bị của bạn.",
    heroSearchPlaceholder: "Tìm tiện ích…",
    heroSearchHint: "Nhấn",
    metaPrivate: "Riêng tư theo thiết kế",
    metaNoSignup: "Không cần đăng ký",
    metaLocal: "Chạy ngay trên máy",
    explorerKicker: "Khám phá",
    explorerTitle: "Duyệt theo nhu cầu",
    explorerDesc: "Chọn danh mục bên trái. Mọi công cụ mở ngay lập tức.",
    explorerAll: "Tất cả",
    explorerCount: (n: number) => `${n} tiện ích`,
    featuredKicker: "Nổi bật",
    featuredTitle: "Bắt đầu từ đây",
    featuredOpen: "Mở công cụ",
    popularKicker: "Dùng nhiều",
    popularTitle: "Đang được dùng nhiều",
    popularEmpty: "Dùng thử một công cụ, nó sẽ hiện ở đây.",
    recentKicker: "Ứng dụng",
    recentTitle: "Mới mở gần đây",
    recentEmpty: "Chưa mở gì cả. Lịch sử chỉ lưu trên máy bạn.",
    recentClear: "Xoá",
    footerStatement: "Bộ tiện ích nhỏ, độc lập. Nhanh, riêng tư và không làm phiền bạn.",
    footerExplore: "Khám phá",
    footerCompany: "Sản phẩm",
    footerLegal: "Pháp lý",
    footerRights: "Mọi xử lý diễn ra trên trình duyệt của bạn.",

    // Spec hero + meta
    heroEyebrowTop: "TOOLBOXVN",
    heroEyebrowSub: "TIỆN ÍCH SỐ",
    metaTools: (n: number) => `${n}+ CÔNG CỤ`,
    metaNoLogin: "KHÔNG ĐĂNG NHẬP",
    metaFree: "MIỄN PHÍ",
    metaFast: "NHANH",
    paletteCategories: "Danh mục",
    paletteTools: "Công cụ",
    workspace: "Không gian làm việc",
    aboutTitle: "Giới thiệu",
    aboutLead: "ToolboxVN là một xưởng nhỏ cho những tác vụ số hằng ngày.",
    aboutBody: [
      "Mỗi tiện ích làm đúng một việc, mở ngay lập tức và chạy hoàn toàn trên trình duyệt. Không tài khoản, không tải lên, không theo dõi những gì bạn nhập.",
      "Dự án được duy trì độc lập. Công cụ mới được thêm chậm rãi và có chọn lọc — chỉ khi thực sự xứng đáng.",
    ],
    privacyTitle: "Riêng tư",
    privacyLead: "Dữ liệu của bạn không bao giờ rời khỏi thiết bị.",
    privacyBody: [
      "Mọi công cụ xử lý dữ liệu ngay trên trình duyệt bằng JavaScript, Web Crypto hoặc Canvas. Không có gì bạn nhập, dán hay tải lên được gửi tới máy chủ của ToolboxVN.",
      "Các tuỳ chọn như giao diện, ngôn ngữ, yêu thích và công cụ mới dùng chỉ lưu trong localStorage của trình duyệt. Xoá dữ liệu trình duyệt là xoá sạch.",
      "Script bên thứ ba trên trang chỉ gồm quảng cáo (Google AdSense) và thống kê ẩn danh, mỗi bên tuân theo chính sách riêng của họ.",
    ],
    termsTitle: "Điều khoản",
    termsLead: "Quy tắc đơn giản cho một sản phẩm đơn giản.",
    termsBody: [
      "ToolboxVN cung cấp mọi công cụ miễn phí, nguyên trạng, không bảo đảm dưới bất kỳ hình thức nào. Mọi kết quả — từ đổi tiền tới ước tính sức khoẻ — chỉ mang tính tham khảo, không phải tư vấn chuyên môn.",
      "Không dùng công cụ cho việc vi phạm pháp luật, không phá hoại trang web. Việc thu thập dữ liệu tự động hàng loạt gây ảnh hưởng tới người khác là không được chào đón.",
      "Điều khoản có thể được cập nhật thỉnh thoảng. Tiếp tục sử dụng trang nghĩa là bạn chấp nhận phiên bản hiện hành.",
    ],
    backHome: "Về trang chủ",

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
    copyBtn: "Sao chép",
    download: "Tải về",

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
