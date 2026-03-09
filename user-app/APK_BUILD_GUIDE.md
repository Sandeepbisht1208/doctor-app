# Android APK Build Guide

To generate an installable `.apk` file for your Doctor Service App (instead of a Play Store `.aab` file), follow these steps using Expo Application Services (EAS).

### 1. Install EAS CLI
First, install the Expo Build tool globally:
```bash
npm install -g eas-cli
```

### 2. Login to Expo
You need a free Expo account. Login if you haven't already:
```bash
eas login
```

### 3. Configure the Build (`eas.json`)
Run this command in the `user-app` folder to initialize the build configuration:
```bash
eas build:configure
```

To ensure you get an **APK** (which you can send to other phones) rather than an AAB (App Bundle), modify your `eas.json` to include the `buildType: "apk"` property. Replace the contents of `eas.json` with this:

```json
{
  "cli": {
    "version": ">= 5.9.3"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

### 4. Run the Build
Now, start the build process for the APK:
```bash
eas build -p android --profile preview
```

### 5. Download the APK
Once the build is complete (usually 5-10 minutes on Expo's servers), a download link will be provided in your terminal. You can:
1. Open the link to download the `.apk`.
2. Send this file to any Android device to install and test.

> [!IMPORTANT]
> Since the backend is currently running on `localhost`, you will need to update the `BASE_URL` in `src/services/api.js` to your computer's **Local IP Address** (e.g., `192.168.x.x`) before building, so the app on your phone can talk to the server on your computer.
