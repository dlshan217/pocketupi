# PocketUPI

An UPI-style payment simulator built for Android

## Features

* Virtual balance and Transaction history management
* QR code and Contact-based simulated payments
* No real money is transferred ( always return *insufficient balance )
* PIN verification
* Offline data storage
* 

it recreates the digital payment experience without connecting to real banking systems. Users can configure their own virtual account details .All data is stored locally on the device using IndexedDB.


## Tech Stack

* React –User interface
* Vite – Development and build tool
* Tailwind CSS – Styling
* Capacitor – Android integration
* IndexedDB – Local data storage
* Gradle – Android APK generation

## Requirements

* Node.js and npm
* Android Studio
* Android SDK

## Setup

Clone the repository:

```bash
git clone https://github.com/dlshan217/pocketupi.git
cd pocketupi
```

Install dependencies:

```bash
npm ci
```

Run development server:

```bash
npm run dev
```

## Build Android APK


Run the included Windows build script:

```text
BuildPocketUPI.bat
```

Or 

build manually:

```bash
npm run build
npx cap sync android
cd android
gradlew.bat assembleDebug
```

**APK Output:**

`android/app/build/outputs/apk/debug/app-debug.apk`

## Note

PocketUPI is an educational payment simulator. It does not process real UPI transactions or connect to banking services.