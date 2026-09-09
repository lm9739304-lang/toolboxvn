import {
  Type, Hash, FileText, CaseUpper, RotateCcw, RemoveFormatting,
  Link2, Eraser, Minus, ArrowUpDown, Copy, ListOrdered,
  Shuffle, Tag, GitCompare, Code2, Upload, Globe, Paperclip,
  Lock, Shield, Fingerprint, Ticket, Radio, TestTube, Braces,
  FileJson, FileSpreadsheet, Eye, Download, Scissors, Lightbulb,
  Palette, Pipette, Contrast, Droplets, Paintbrush,
  KeyRound, ShieldCheck, QrCode, HashIcon, Dice5, Coins,
  Dices, User, ArrowDownUp, Landmark, BookOpen, Ruler,
  Scale, Thermometer, Square, FlaskConical, Car, HardDrive,
  Clock, Gauge, Compass, DollarSign, TrendingUp, Building2,
  Receipt, BadgePercent, Calculator, Flame, Zap,
  Droplet, Target, Baby, Heart, Cake, Hourglass, Timer,
  CalendarClock, CalendarDays, Calendar, CalendarRange,
  CalendarCheck, Search, BarChart3, Bot, Map,
  FileCode, Link, Image, Maximize2,
  RotateCw, StickyNote, PartyPopper, GraduationCap, Keyboard,
  PenTool, CircleDot, ScrollText, Sparkles, Wifi, CalendarHeart,
  Star, Wrench,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  // Text
  "text-stats": Type,
  "case-converter": CaseUpper,
  "reverse-text": RotateCcw,
  "remove-accents": RemoveFormatting,
  "slug-generator": Link2,
  "clean-spaces": Eraser,
  "remove-linebreaks": Minus,
  "sort-lines": ArrowUpDown,
  "dedupe-lines": Copy,
  "number-lines": ListOrdered,
  "shuffle-lines": Shuffle,
  "word-freq": Tag,
  "text-diff": GitCompare,

  // Dev
  "base64": Code2,
  "url-codec": Globe,
  "html-entities": Paperclip,
  "sha256": Lock,
  "sha-multi": Shield,
  "md5": Hash,
  "jwt-decoder": Ticket,
  "morse": Radio,
  "regex-tester": TestTube,
  "json-formatter": Braces,
  "csv-to-json": FileJson,
  "json-to-csv": FileSpreadsheet,
  "html-preview": Eye,
  "markdown-preview": Download,
  "minifier": Scissors,
  "string-escape": Lightbulb,
  "my-ip": Globe,

  // Colors
  "hex-to-rgb": Palette,
  "rgb-to-hex": Pipette,
  "palette": Paintbrush,
  "contrast": Contrast,
  "gradient": Droplets,
  "color-picker": Pipette,

  // Random
  "password-gen": KeyRound,
  "password-strength": ShieldCheck,
  "uuid-gen": Fingerprint,
  "qr-gen": QrCode,
  "barcode-gen": HashIcon,
  "pin-gen": Hash,
  "dice": Dice5,
  "coin": Coins,
  "random-number": Dices,
  "random-name": User,

  // Convert
  "number-base": ArrowDownUp,
  "roman": Landmark,
  "number-words": BookOpen,
  "unit-length": Ruler,
  "unit-weight": Scale,
  "unit-temp": Thermometer,
  "unit-area": Square,
  "unit-volume": FlaskConical,
  "unit-speed": Car,
  "unit-data": HardDrive,
  "unit-time": Clock,
  "unit-pressure": Gauge,
  "currency": Compass,

  // Finance
  "compound": TrendingUp,
  "loan": Building2,
  "vat": Receipt,
  "discount": BadgePercent,
  "salary": Calculator,
  "tip": DollarSign,
  "percent": BadgePercent,
  "calculator": Calculator,

  // Health
  "bmi": Scale,
  "bmr": Flame,
  "tdee": Zap,
  "water": Droplet,
  "ideal-weight": Target,
  "due-date": Baby,
  "heart-rate": Heart,

  // Time
  "age": Cake,
  "countdown": Hourglass,
  "stopwatch": Timer,
  "timestamp": CalendarClock,
  "date-add": CalendarDays,
  "date-diff": CalendarRange,
  "leap-year": CalendarCheck,
  "weekday": Calendar,
  "world-clock": Globe,

  // SEO
  "serp": Search,
  "keyword-density": BarChart3,
  "robots-gen": Bot,
  "sitemap-gen": Map,
  "meta-gen": FileCode,
  "utm": Link,
  "seo-trim": Scissors,

  // Image
  "image-compress": Maximize2,
  "image-resize": Maximize2,
  "image-base64": Image,
  "favicon-gen": Star,
  "image-rotate": RotateCw,

  // Utilities
  "notepad": StickyNote,
  "tet-countdown": PartyPopper,
  "zodiac": Star,
  "gpa": GraduationCap,
  "typing": Keyboard,
  "signature": PenTool,
  "wheel": CircleDot,
  "lorem": ScrollText,
  "fancy-text": Sparkles,
  "ping-test": Wifi,
  "wifi-qr": QrCode,
  "canchi": CalendarHeart,
};

export default function Icon({ name, className = "h-4 w-4" }: { name: string; className?: string }) {
  const LucideIcon = iconMap[name] || Wrench;
  return <LucideIcon className={className} strokeWidth={1.5} />;
}

// Category icons
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Văn bản": FileText,
  "Mã hoá & Dev": Code2,
  "Màu sắc": Palette,
  "Ngẫu nhiên": Dices,
  "Chuyển đổi": ArrowDownUp,
  "Tài chính": DollarSign,
  "Sức khoẻ": Heart,
  "Thời gian": Clock,
  "SEO & Marketing": Search,
  "Hình ảnh": Image,
  "Tiện ích": Wrench,
};
