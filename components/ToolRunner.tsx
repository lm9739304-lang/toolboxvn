"use client";

import type { Tool } from "@/lib/tools";
import { TextStats, CaseConverter, ReverseText, RemoveAccents, SlugGenerator, CleanSpaces, RemoveLinebreaks, LineTools, TextDiff, LoremGen, FancyText, SeoTrim, KeywordDensity } from "./tools/TextTools";
import { Base64Tool, UrlCodec, HtmlEntities, Sha256, ShaMulti, Md5Tool, JwtDecoder, MorseTool, RegexTester, JsonFormatter, CsvToJson, JsonToCsv, HtmlPreview, MarkdownPreview, Minifier, StringEscape, MyIp, SerpPreview, RobotsGen, SitemapGen, MetaGen, UtmBuilder, PingTest } from "./tools/CodecTools";
import { HexToRgb, RgbToHex, Palette, Contrast, Gradient, ColorPicker } from "./tools/ColorTools";
import { PasswordGen, PasswordStrength, UuidGen, QrGen, BarcodeGen, PinGen, Dice, Coin, RandomNumber, RandomName, Wheel } from "./tools/RandomTools";
import { NumberBase, Roman, NumberWords, UnitLength, UnitWeight, UnitTemp, UnitArea, UnitVolume, UnitSpeed, UnitData, UnitTime, UnitPressure, Currency } from "./tools/ConvertTools";
import { Compound, Loan, Vat, Discount, Salary, Tip, Percent, Calculator, Bmi, Bmr, Tdee, Water, IdealWeight, DueDate, HeartRate, AgeCalc, Gpa, Signature } from "./tools/FinanceHealth";
import { Countdown, Stopwatch, Timestamp, DateAdd, DateDiff, LeapYear, Weekday, WorldClock, TetCountdown, Zodiac, CanChi, Typing, Notepad } from "./tools/TimeTools";
import { ImageCompress, ImageResize, ImageBase64, FaviconGen, ImageRotate } from "./tools/ImageTools";

export default function ToolRunner({ tool }: { tool: Tool }) {
  const impl = tool.impl;
  switch (impl) {
    case "text-stats": return <TextStats mode={tool.slug} />;
    case "word-freq": return <TextStats mode="word-freq" />;
    case "case-converter": return <CaseConverter />;
    case "reverse-text": return <ReverseText />;
    case "remove-accents": return <RemoveAccents />;
    case "slug-generator": return <SlugGenerator />;
    case "clean-spaces": return <CleanSpaces />;
    case "remove-linebreaks": return <RemoveLinebreaks />;
    case "sort-lines":
    case "dedupe-lines":
    case "number-lines":
    case "shuffle-lines": return <LineTools mode={impl} />;
    case "text-diff": return <TextDiff />;
    case "lorem": return <LoremGen />;
    case "fancy-text": return <FancyText />;
    case "seo-trim": return <SeoTrim />;
    case "keyword-density": return <KeywordDensity />;

    case "base64": return <Base64Tool decode={tool.slug.includes("giai")} />;
    case "url-codec": return <UrlCodec />;
    case "html-entities": return <HtmlEntities />;
    case "sha256": return <Sha256 />;
    case "sha-multi": return <ShaMulti />;
    case "md5": return <Md5Tool />;
    case "jwt-decoder": return <JwtDecoder />;
    case "morse": return <MorseTool />;
    case "regex-tester": return <RegexTester />;
    case "json-formatter": return <JsonFormatter />;
    case "csv-to-json": return <CsvToJson />;
    case "json-to-csv": return <JsonToCsv />;
    case "html-preview": return <HtmlPreview />;
    case "markdown-preview": return <MarkdownPreview />;
    case "minifier": return <Minifier />;
    case "string-escape": return <StringEscape />;
    case "my-ip": return <MyIp />;
    case "serp": return <SerpPreview />;
    case "robots-gen": return <RobotsGen />;
    case "sitemap-gen": return <SitemapGen />;
    case "meta-gen": return <MetaGen />;
    case "utm": return <UtmBuilder />;
    case "ping-test": return <PingTest />;

    case "hex-to-rgb": return <HexToRgb />;
    case "rgb-to-hex": return <RgbToHex />;
    case "palette": return <Palette />;
    case "contrast": return <Contrast />;
    case "gradient": return <Gradient />;
    case "color-picker": return <ColorPicker />;

    case "password-gen": return <PasswordGen />;
    case "password-strength": return <PasswordStrength />;
    case "uuid-gen": return <UuidGen />;
    case "qr-gen": return <QrGen />;
    case "wifi-qr": return <QrGen wifi />;
    case "barcode-gen": return <BarcodeGen />;
    case "pin-gen": return <PinGen />;
    case "dice": return <Dice />;
    case "coin": return <Coin />;
    case "random-number": return <RandomNumber />;
    case "random-name": return <RandomName />;
    case "wheel": return <Wheel />;

    case "number-base": return <NumberBase />;
    case "roman": return <Roman />;
    case "number-words": return <NumberWords />;
    case "unit-length": return <UnitLength />;
    case "unit-weight": return <UnitWeight />;
    case "unit-temp": return <UnitTemp />;
    case "unit-area": return <UnitArea />;
    case "unit-volume": return <UnitVolume />;
    case "unit-speed": return <UnitSpeed />;
    case "unit-data": return <UnitData />;
    case "unit-time": return <UnitTime />;
    case "unit-pressure": return <UnitPressure />;
    case "currency": return <Currency />;

    case "compound": return <Compound />;
    case "loan": return <Loan />;
    case "vat": return <Vat />;
    case "discount": return <Discount />;
    case "salary": return <Salary />;
    case "tip": return <Tip />;
    case "percent": return <Percent />;
    case "calculator": return <Calculator />;
    case "bmi": return <Bmi />;
    case "bmr": return <Bmr />;
    case "tdee": return <Tdee />;
    case "water": return <Water />;
    case "ideal-weight": return <IdealWeight />;
    case "due-date": return <DueDate />;
    case "heart-rate": return <HeartRate />;
    case "age": return <AgeCalc />;
    case "gpa": return <Gpa />;
    case "signature": return <Signature />;

    case "countdown": return <Countdown />;
    case "stopwatch": return <Stopwatch />;
    case "timestamp": return <Timestamp />;
    case "date-add": return <DateAdd />;
    case "date-diff": return <DateDiff />;
    case "leap-year": return <LeapYear />;
    case "weekday": return <Weekday />;
    case "world-clock": return <WorldClock />;
    case "tet-countdown": return <TetCountdown />;
    case "zodiac": return <Zodiac />;
    case "canchi": return <CanChi />;
    case "typing": return <Typing />;
    case "notepad": return <Notepad />;

    case "image-compress": return <ImageCompress />;
    case "image-resize": return <ImageResize />;
    case "image-base64": return <ImageBase64 />;
    case "favicon-gen": return <FaviconGen />;
    case "image-rotate": return <ImageRotate />;

    default: return <TextStats mode={tool.slug} />;
  }
}
