# 🚀 Quick Setup Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Expo CLI (will be installed automatically)
- iOS Simulator (Mac) or Android Emulator

## Step 1: Install Dependencies

```bash
cd mobile-app
npm install
```

This will install:
- Expo SDK
- React Navigation
- TypeScript
- Axios
- All required dependencies

## Step 2: Start Backend

The mobile app needs the backend API running:

```bash
# In another terminal, from project root
cd itam_hack
python main.py
```

Backend should be running on `http://localhost:8000`

## Step 3: Start Mobile App

```bash
npm start
```

This opens Expo Dev Tools in your browser.

## Step 4: Run on Device/Simulator

### Option A: iOS Simulator (Mac only)
```bash
npm run ios
```

### Option B: Android Emulator
```bash
npm run android
```

### Option C: Physical Device
1. Install "Expo Go" app from App Store/Play Store
2. Scan QR code from Expo Dev Tools

### Option D: Web Browser (for testing)
```bash
npm run web
```

## 🧪 Test the App

### 1. Login
- Enter participant ID: `u1`, `u2`, `u3`, or `u4`
- Click "Enter"

### 2. Profile Form (if new user)
- Fill in name, role, skills
- Click "Next"

### 3. Main App
You should see 4 tabs at the bottom:
- **Hackathons** - Browse events
- **Matching** - Swipe cards
- **Team** - Your team
- **Profile** - Your profile

## 📱 Navigation Test

1. **Hackathons Tab**:
   - See list of hackathons
   - Tap one → See details
   - Tap "Participate" → See alert with options

2. **Matching Tab**:
   - See a card in the center
   - Tap "Like" or "Dislike"
   - Should move to next card

3. **Team Tab**:
   - See team members (if in a team)
   - If captain: see "Remove" buttons
   - See "Leave Team" button

4. **Profile Tab**:
   - See your profile info
   - See "Edit Profile" button
   - See "Logout" button

## 🐛 Troubleshooting

### "Cannot connect to Metro"
```bash
# Clear cache and restart
npm start -- --clear
```

### "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### "Network request failed"
- Make sure backend is running on `http://localhost:8000`
- Check `src/services/api.ts` - API_BASE_URL should match your backend

### iOS Simulator not opening
```bash
# Install iOS Simulator (Xcode required)
xcode-select --install
```

### Android Emulator not opening
- Open Android Studio
- Tools → AVD Manager
- Create/Start a virtual device

## 📦 Project Structure

```
mobile-app/
├── App.tsx                    # Entry point
├── src/
│   ├── navigation/            # All navigators
│   ├── screens/               # All screens
│   ├── types/                 # TypeScript types
│   └── services/              # API client
├── package.json
└── README.md
```

## 🎯 What's Included

✅ Complete navigation structure
✅ All screens (functional, no styling)
✅ TypeScript types
✅ API integration
✅ Auth flow
✅ Main app flow

## 🚧 What's NOT Included

❌ Styling/Design
❌ State management (Context/Redux)
❌ Error handling UI
❌ Loading states
❌ Form validation
❌ Real Telegram auth

This is a **SKELETON** - add styling and features later!

## 📚 Next Steps

1. ✅ Get the skeleton running
2. Add design system (colors, fonts, components)
3. Add state management (Context API)
4. Add error handling
5. Add loading states
6. Add animations
7. Add real authentication

---

**Need help?** Check `README.md` for detailed documentation.
