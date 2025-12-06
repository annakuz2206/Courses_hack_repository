# ITAM Hackathon Mobile App - Skeleton

> React Native (Expo) + TypeScript skeleton with navigation and functional screens. **NO STYLING** - only layout structure.

## 📁 Project Structure

```
mobile-app/
├── App.tsx                          # Root component
├── src/
│   ├── navigation/
│   │   ├── RootNavigator.tsx        # Root stack (Auth/Main)
│   │   ├── AuthNavigator.tsx        # Auth stack (Login/ProfileForm)
│   │   ├── MainTabNavigator.tsx     # Bottom tabs (4 tabs)
│   │   └── HackathonsNavigator.tsx  # Hackathons stack
│   ├── screens/
│   │   ├── auth/
│   │   │   └── LoginScreen.tsx      # Login with participant ID
│   │   ├── onboarding/
│   │   │   └── ProfileFormScreen.tsx # Profile setup form
│   │   ├── hackathons/
│   │   │   ├── HackathonListScreen.tsx   # FlatList of hackathons
│   │   │   └── HackathonDetailScreen.tsx # Detail + Participate button
│   │   ├── matching/
│   │   │   └── SwipeScreen.tsx      # Tinder-style swipe cards
│   │   └── team/
│   │       ├── TeamScreen.tsx       # Team management
│   │       └── MyProfileScreen.tsx  # User profile (read-only)
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces
│   └── services/
│       └── api.ts                   # API client (axios)
├── package.json
├── tsconfig.json
└── app.json
```

## 🚀 Installation

```bash
cd mobile-app
npm install
```

## 🏃 Run

```bash
# Start Expo dev server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run in web browser
npm run web
```

## 📱 Navigation Flow

### 1. Auth Stack
- **LoginScreen** → Enter participant ID → Login
- **ProfileFormScreen** → Fill name, role, skills, bio → Next

### 2. Main Tabs (After Auth)

#### Tab 1: Hackathons
- **HackathonListScreen** → FlatList of hackathons
- **HackathonDetailScreen** → Details + "Participate" button
  - On "Participate" → Alert: "Join Team" or "Create Team"

#### Tab 2: Matching (Swipe)
- **SwipeScreen** → Card in center + "Dislike"/"Like" buttons
  - Shows teams or participants to swipe
  - On match → Alert notification

#### Tab 3: My Team
- **TeamScreen** → List of team members
  - If captain: "Edit", "Remove Member" buttons
  - If member: "Leave Team" button

#### Tab 4: Profile
- **MyProfileScreen** → Read-only profile view
  - "Edit Profile" button
  - "Logout" button

## 🎯 Key Features

### ✅ Implemented
- TypeScript types for all navigation
- Stack Navigator (Auth flow)
- Bottom Tab Navigator (Main app)
- Nested Stack Navigator (Hackathons)
- API service with axios
- All screens functional (no styling)
- Alert dialogs for user actions

### 📦 Components Used
- `<View>` - Layout containers
- `<Text>` - Text display
- `<Button>` - System buttons
- `<TextInput>` - Input fields
- `<ScrollView>` - Scrollable content
- `<FlatList>` - Lists
- `<TouchableOpacity>` - Touchable items
- `<Picker>` - Dropdown select

### 🎨 Styling Approach
- **ZERO custom styling** (colors, shadows, gradients)
- Only `StyleSheet` for layout (flex, padding, margin)
- System default appearance
- Focus on structure, not design

## 🔧 API Integration

Backend URL: `http://localhost:8000`

### Endpoints Used
- `POST /api/auth/dev-login` - Login
- `GET /api/participants/me` - Get current user
- `PUT /api/participants/me` - Update profile
- `GET /api/admin/hackathons` - List hackathons
- `GET /api/teams` - List teams
- `POST /api/swipe` - Swipe action

## 📝 TypeScript Types

All types defined in `src/types/index.ts`:
- Navigation param lists
- User, Hackathon, Team interfaces
- SwipeCard interface

## 🧪 Testing Flow

1. **Start backend** (from main project):
   ```bash
   cd itam_hack
   python main.py
   ```

2. **Start mobile app**:
   ```bash
   cd mobile-app
   npm start
   ```

3. **Test login**:
   - Enter ID: `u1`, `u2`, `u3`, or `u4`
   - Should navigate to main tabs

4. **Test navigation**:
   - Browse hackathons
   - Click hackathon → See details
   - Click "Participate" → See alert
   - Go to Matching tab → Swipe cards
   - Go to Team tab → See team members
   - Go to Profile tab → See your profile

## 🚧 Next Steps (Not Implemented)

This is a **skeleton** - add these later:
- [ ] Styling and design system
- [ ] Real authentication flow
- [ ] Context/Redux for state management
- [ ] Error handling UI
- [ ] Loading states
- [ ] Form validation
- [ ] Image uploads
- [ ] Push notifications
- [ ] Real-time chat
- [ ] Animations

## 📚 Dependencies

- **expo** - React Native framework
- **@react-navigation/native** - Navigation
- **@react-navigation/stack** - Stack navigator
- **@react-navigation/bottom-tabs** - Tab navigator
- **axios** - HTTP client
- **@react-native-picker/picker** - Dropdown picker
- **TypeScript** - Type safety

## 🎓 Architecture Notes

### Navigation Pattern
```
RootNavigator (Stack)
├── AuthNavigator (Stack)
│   ├── LoginScreen
│   └── ProfileFormScreen
└── MainTabNavigator (Tabs)
    ├── HackathonsNavigator (Stack)
    │   ├── HackathonListScreen
    │   └── HackathonDetailScreen
    ├── SwipeScreen
    ├── TeamScreen
    └── MyProfileScreen
```

### State Management
- Currently using local state (`useState`)
- Auth state in `App.tsx`
- Screen-level state in each screen
- **TODO**: Add Context API or Redux

### API Layer
- Centralized in `src/services/api.ts`
- Axios instance with base URL
- Token management
- Type-safe responses

## 🔒 Security Notes

- Using dev-login for testing
- Token stored in axios headers
- **TODO**: Secure token storage (AsyncStorage + encryption)
- **TODO**: Refresh token logic
- **TODO**: Proper Telegram auth

---

**Status:** ✅ Skeleton Complete

**Version:** 1.0.0

**Date:** December 6, 2025

---

## 🎯 Remember

This is a **SKELETON** - structure only, no design. Add styling in the next phase!
