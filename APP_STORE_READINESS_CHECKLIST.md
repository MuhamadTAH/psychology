# App Store Readiness Checklist

## ✅ COMPLETED (Medium Priority Tasks)

### 1. Console.log Statements Removed ✓
- **Status:** COMPLETED
- **Details:** Removed all 231 console.log/error/warn statements from the codebase
- **Files Affected:** 30 TypeScript/JavaScript files
- **Impact:** Improved app performance and security

### 2. Manifest.json Fixed ✓
- **Status:** COMPLETED
- **Changes Made:**
  - Updated app name to "DuoLearn - Master Dark Psychology"
  - Fixed app description to focus on Dark Psychology content
  - Corrected shortcuts to use SVG icons instead of PNG
  - Removed non-existent `/learn` and `/profile` routes
  - Removed screenshot references (screenshots not yet created)

### 3. Feature Graphic Created ✓
- **Status:** COMPLETED
- **File:** `public/feature-graphic.svg`
- **Dimensions:** 1024x500 (Play Store requirement)
- **Design:** Dark theme with brain emoji, shield icon, key features
- **Note:** SVG format - convert to PNG for final submission

### 4. App Store Descriptions Written ✓
- **Status:** COMPLETED
- **File:** `APP_STORE_DESCRIPTIONS.md`
- **Includes:**
  - Short description (80 chars)
  - Full description for Play Store (under 4000 chars)
  - Full description for App Store (under 4000 chars)
  - Keywords (100 chars)
  - Promotional text (170 chars)
  - Release notes template
  - Support email template
  - Category recommendations
  - Content rating guidance

---

## 🔴 CRITICAL ISSUES (Must Fix Before Submission)

### 1. Production Build Failing ❌
- **Issue:** Next.js 15.5.4 Windows EISDIR bug
- **Error:** `EISDIR: illegal operation on a directory, readlink analytics-ai/route.ts`
- **Solutions:**
  1. Downgrade to Next.js 15.0.3
  2. Wait for Next.js 15.5.5+ fix
  3. Migrate API routes to Convex
- **Impact:** Cannot deploy to production

### 2. Localhost URL in Capacitor Config ❌
- **File:** `capacitor.config.ts`
- **Issue:** Hardcoded `http://localhost:3000`
- **Required:** Must change to production URL
- **Impact:** App won't work on real devices

### 3. Privacy Policy Missing ❌
- **Status:** NOT CREATED
- **Requirement:** Both app stores REQUIRE privacy policy
- **Action Needed:** Create and host privacy policy URL
- **Impact:** App will be rejected without this

---

## 🟡 HIGH PRIORITY (Should Fix Before Submission)

### 1. App Store Screenshots Missing ❌
- **Status:** NOT CREATED
- **Required Screenshots:**
  - **Android:** 2-8 screenshots per device size
  - **iOS:** Screenshots for all device sizes
- **Suggested Screenshots:**
  1. Welcome/Onboarding screen
  2. Lesson selection screen
  3. Interactive lesson example
  4. Progress tracking screen
  5. Gamification features (streak, XP, achievements)

### 2. App Icons for Stores ❌
- **Current:** SVG icons only
- **Required:**
  - **Play Store:** 512x512 PNG (high-res icon)
  - **App Store:** 1024x1024 PNG (App Store icon)
- **Action:** Convert SVG to PNG at required sizes

---

## 📋 MEDIUM PRIORITY (Completed)

### 1. Console.log Statements ✅
- **Status:** COMPLETED
- **Removed:** 231 statements

### 2. Manifest.json ✅
- **Status:** COMPLETED
- **Fixed:** Shortcuts, descriptions, icons

### 3. Feature Graphic ✅
- **Status:** COMPLETED
- **File:** `public/feature-graphic.svg`

### 4. App Descriptions ✅
- **Status:** COMPLETED
- **File:** `APP_STORE_DESCRIPTIONS.md`

---

## 📝 Additional Requirements

### For Google Play Store:
1. ✅ Feature graphic (1024x500) - DONE (needs PNG conversion)
2. ❌ Short description (80 chars) - DONE in file, needs to be added to store
3. ❌ Full description (4000 chars) - DONE in file, needs to be added to store
4. ❌ Screenshots (minimum 2) - NOT CREATED
5. ❌ Privacy policy URL - NOT CREATED
6. ❌ App icon (512x512 PNG) - NOT CREATED
7. ✅ App category - DONE (Education)
8. ✅ Content rating - DONE (documented as 12+)

### For Apple App Store:
1. ❌ App Store icon (1024x1024 PNG) - NOT CREATED
2. ❌ Screenshots for all device sizes - NOT CREATED
3. ❌ Short description (170 chars promotional) - DONE in file
4. ❌ Full description (4000 chars) - DONE in file
5. ❌ Keywords (100 chars) - DONE in file
6. ❌ Privacy policy URL - NOT CREATED
7. ✅ App category - DONE (Education)
8. ✅ Content rating - DONE (documented as 12+)
9. ✅ Support URL - DONE (documented as support@duolearn.app)

---

## 🚀 Next Steps (Priority Order)

### CRITICAL (Do First):
1. **Fix Production Build**
   - Option A: Run `npm install next@15.0.3`
   - Option B: Migrate API routes to Convex
   - Option C: Wait for Next.js fix

2. **Create Privacy Policy**
   - Write privacy policy document
   - Host on website or GitHub Pages
   - Add URL to app configs

3. **Update Capacitor Config**
   - Change localhost:3000 to production Vercel URL
   - Test on real Android device

### HIGH (Do Second):
4. **Create Screenshots**
   - Take 5-8 screenshots of app in action
   - Resize for different device sizes
   - Add to `public/screenshots/` folder

5. **Create PNG Icons**
   - Convert SVG icons to PNG
   - Create 512x512 for Play Store
   - Create 1024x1024 for App Store

### MEDIUM (Already Done):
6. ✅ Remove console.log statements
7. ✅ Fix manifest.json
8. ✅ Create feature graphic
9. ✅ Write app descriptions

---

## 📊 Progress Summary

**Total Tasks:** 15
**Completed:** 4
**In Progress:** 0
**Not Started:** 11

**Completion:** 27%

**Blockers:**
- Production build failing (CRITICAL)
- No privacy policy (CRITICAL)
- localhost URL in Capacitor (CRITICAL)

**Estimated Time to App Store Ready:**
- Fix critical issues: 2-4 hours
- Create screenshots: 1-2 hours
- Create icons: 30 minutes
- **Total:** 3.5-6.5 hours

---

## 📞 Support Resources

**Created Files:**
- `APP_STORE_DESCRIPTIONS.md` - All text content for stores
- `public/feature-graphic.svg` - Feature graphic (needs PNG conversion)
- `APP_STORE_READINESS_CHECKLIST.md` - This file

**External Resources Needed:**
- Privacy policy generator: https://www.privacypolicygenerator.info/
- Screenshot templates: Figma or Canva
- Icon converter: https://cloudconvert.com/svg-to-png

---

## ⚠️ Important Notes

1. **Production URL Required:** Before deploying to Capacitor, you MUST have a working production URL
2. **Privacy Policy is Mandatory:** Both stores will reject without it
3. **Test on Real Devices:** Always test on actual Android/iOS devices before submission
4. **Build Must Succeed:** Cannot deploy if `npm run build` fails
5. **Review Times:** Google Play: 1-7 days, Apple App Store: 1-3 days

---

Last Updated: December 27, 2025
