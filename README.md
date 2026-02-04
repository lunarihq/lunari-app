# Bluma

A private-first period tracking app designed to be a delight to use whilst preserving the users’ privacy by using local-only data storage.

<img width="1024" height="500" alt="featured-graphic" src="https://github.com/user-attachments/assets/93f5ab69-a223-4287-8440-00f3d8ca6427" />

# ⚙️ Features

- Period & ovulation predictions.
- Symptoms, moods, flow & discharge tracking.
- Cycle statistics & history.
- Cycle phase insights.
- Period reminders.
- Biometric app lock.
- Encrypted local database (SQLite with device-bound encryption key).
- Dark & light themes (including system).
- Completely offline - All data is stored locally on your device.
- Delete all data - One-tap full data deletion from settings.
- No account required.
- No ads ever.
- No third‑party trackers.
- Open-source code.

# 👩🏻‍💻 Technologies used

**Core**

- React Native 0.81.5 - Android and iOS
- Expo SDK 54 - Development and build (EAS)
- Expo Router - File-based routing
- Drizzle ORM (SQLite via expo-sqlite) - Local data storage
- TypeScript 5.9 - Type-safe development
- i18next / react-i18next - Localization (en, es, pt-BR, pt-PT)

**Development & quality**

- ESLint + Prettier - Linting and formatting
- Jest (jest-expo) - Test setup (see `package.json` scripts)

**Accessibility**

- WCAG-oriented patterns - accessibilityRole, accessibilityLabel, accessibilityHint in key components
- Multiple indication methods - Color + icon + text where status is shown (e.g. calendar)

# 📄 License

Copyright © 2025 Maribel Ferreira  
This project is licensed under the [GNU General Public License v3.0](LICENSE).

You may use, modify, and distribute the software under the GPL-3.0 license. If you distribute a modified version, you must also make the corresponding source code available under the same license.
