<div dir="rtl">

# قارپ (Gharp)

[English](README.md) | [فارسی](README-fa.md)

ابزار تخصصی ویرایش خودکار ویدیو برای ریلز اینستاگرام هکرز و نقاش‌ها، با استفاده از فریم‌ورک Remotion. نام «قارپ» نشان‌دهنده هدف این ابزار است: ساده کردن فرایند تولید محتوا .

🌐 وبسایت: [hackersandpainters.xyz](https://hackersandpainters.xyz)  
📸 اینستاگرام: [@hackersandpainters](https://instagram.com/hackersandpainters)

## پیش‌نیازها

- Node.js (آخرین نسخه LTS)
- نصب ffmpeg و در دسترس بودن در PATH سیستم
- npm یا yarn

## تکنولوژی‌ها

- 🎬 ساخته شده با [Remotion](https://www.remotion.dev/) - فریم‌ورک React برای تولید ویدیو
- ⚛️ React و TypeScript برای ساخت کامپوننت‌محور ویدیو
- 🎨 Tailwind CSS برای استایل‌دهی
- 🎭 Framer Motion برای انیمیشن‌های روان

## شروع سریع

۱. نصب وابستگی‌ها:
```bash
npm install
```

۲. پیکربندی ویدیو (این کار فایل videoConfig.json را می‌سازد):
```bash
npm run hp
```

از شما این موارد پرسیده خواهد شد:
- نام فایل SRT (در پوشه public/)
- نام فایل ویدیوی اصلی (در پوشه public/)
- تنظیمات اینترو/اوترو
- اطلاعات گوینده (اختیاری)

۳. پیش‌نمایش در Remotion:
```bash
npm run dev
```

## ساختار پروژه

- پوشه `public/`:
  - فایل ویدیوی اصلی (مثال: K2.mp4)
  - فایل زیرنویس (مثال: K2.srt)
  - لوگو (logo.png)
  - تنظیمات اورلی (overlays.json)

## امکانات

- ⚡ بهینه‌سازی شده برای ریلز اینستاگرام
- 🎭 انیمیشن روان گوینده با رنگ‌های برند
- 📝 پشتیبانی از زیرنویس دوزبانه (فارسی/انگلیسی)
- 🎨 اورلی‌های آموزشی سفارشی
- 🎬 اینترو/اوترو اختیاری با برند
- 🔄 واترمارک هکرز و نقاش‌ها

## پیکربندی

اسکریپت `npm run hp` فایل `videoConfig.json` را با تنظیمات شما ایجاد می‌کند، شامل:
- تنظیمات FPS ویدیو
- مدت زمان اینترو/اوترو
- مسیر ویدیوی اصلی
- تنظیمات زیرنویس
- تنظیمات گوینده

## ساخت خروجی

برای رندر کردن ویدیوی نهایی:

```bash
npm run build
```

## شخصی‌سازی

- ویرایش `src/Overlay.tsx` برای تغییرات بصری
- بروزرسانی `public/overlays.json` برای محتوای اورلی سفارشی
- تنظیم استایل‌ها در بخش stylesheet فایل Overlay.tsx

## مجوز

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

این پروژه متن‌باز است و تحت مجوز MIT در دسترس است.

</div>
