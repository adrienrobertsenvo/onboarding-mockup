# Senvo Onboarding Theme Package

This package contains the complete implementation of the Senvo carrier onboarding flow with the custom purple gradient theme.

## 📦 What's Included

- `senvo_onboarding_flow.yaml` - Complete page structure, fields, and content specifications
- `senvo_purple_gradient.yaml` - Visual style configuration (colors, gradients, shadows)
- `client/` - Full React/TypeScript implementation
- This README with setup instructions

## 🎨 Current Theme Specifications

### Colors
- **Primary/Accent**: `#745DBF` (rich purple)
- **Background**: Multi-layered gradient from `#A7B8FF` (light blue-purple) to `#745DBF` (deep purple)
- **Cards**: Semi-transparent white (`rgba(255,255,255,0.95)`) with glass-morphism effect

### Layout
- **Max Width**: 1600px
- **Padding**: 80px horizontal, 48px vertical
- **Font**: Inter, 18px base size
- **Border Radius**: 16px for cards, 10px for buttons

### Special Effects
- 3-layer gradient background with diagonal sheen texture
- Subtle repeating diagonal stripes for visual depth
- Soft drop shadows: `0 14px 44px rgba(0,0,0,0.10)`

## 🚀 Setup Instructions

### Option 1: Using Claude Code (Recommended)

If you have Claude Code installed:

1. Open the `client/` folder in Claude Code
2. Ask Claude to start the development server:
   ```
   Please run the development server
   ```
3. The app will open at `http://localhost:5173`
4. Make changes by describing what you want to Claude

### Option 2: Manual Setup (Without Claude Code)

**Prerequisites:**
- Node.js 18+ installed ([download here](https://nodejs.org/))
- A code editor (VS Code recommended)

**Steps:**

1. **Extract this package** to your desired location

2. **Open Terminal/Command Prompt** and navigate to the client folder:
   ```bash
   cd path/to/extracted/package/client
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser** to the URL shown (typically `http://localhost:5173`)

## 🎨 Making Style Changes

### Quick Color Changes

Edit `/client/src/styles/global.css`:

**To change the accent color** (buttons, links):
```css
:root {
  --primary: #745DBF;     /* Change this hex value */
  --accent: #745DBF;      /* Keep these matching */
}
```

**To adjust the gradient:**
```css
body {
  background:
    linear-gradient(135deg, #A7B8FF 0%, #8FA1FB 28%, #8A86ED 58%, #7E6FD4 82%, #745DBF 100%),
    /* Modify these hex color stops */
```

**To change card transparency:**
```css
.card {
  background: rgba(255, 255, 255, 0.95);  /* Last number = opacity (0-1) */
}
```

### Page Content Changes

Edit the React component files in `/client/src/pages/`:
- `CarrierContacts.tsx` - Carrier contact information page
- `AccountContracts.tsx` - Account numbers and contracts matching
- `Invoices.tsx` - Invoice forwarding setup
- `TrackingAPI.tsx` - API credentials configuration
- `WarehouseData.tsx` - Warehouse management upload

### Layout Changes

Edit `/client/src/styles/global.css`:

```css
.container {
  max-width: 1600px;           /* Page width */
  padding: 48px 80px;          /* Vertical, Horizontal padding */
}
```

## 📧 Email Template for Sharing

---

**Subject:** Senvo Onboarding Flow - Design Review Package

Hi [Designer Name],

I've put together a package with our carrier onboarding flow implementation. This includes:

✅ Complete working React application
✅ Custom purple gradient theme
✅ All 5 onboarding pages fully functional
✅ YAML specifications for easy reference

**To view and test:**

1. Extract the ZIP file
2. Follow the instructions in `README_FOR_DESIGNER.md`
3. If you have Claude Code, it will help you make changes interactively
4. Otherwise, use the manual setup (just needs Node.js)

**What to review:**

- Overall visual flow and consistency
- Purple gradient background and card styling
- Typography and spacing
- Button styles and interactions
- Form field layouts
- Progress indicators

**Making changes:**

The README includes instructions for quick style adjustments. All colors, spacing, and layout values are clearly documented.

Let me know if you have any questions or need help getting it running!

Best,
[Your Name]

---

## 🔧 Technical Details

**Tech Stack:**
- React 18 with TypeScript
- Vite for development server
- React Router for navigation
- CSS with custom properties (no frameworks)

**Browser Support:**
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

**File Structure:**
```
client/
├── src/
│   ├── pages/           # Page components
│   ├── components/      # Reusable components
│   ├── services/        # API service layer
│   └── styles/          # Global CSS
├── package.json
└── vite.config.ts
```

## 💡 Tips for Designers

1. **Colors**: All theme colors use CSS variables in `:root`, making global changes easy
2. **Spacing**: Uses consistent rem-based spacing (1rem = 16px)
3. **Fonts**: Inter is loaded from Google Fonts automatically
4. **Icons**: Currently using emoji (👋, 📦, 💌, etc.) - easy to replace with icon library
5. **Animations**: Subtle slide-up animation on card appearance
6. **Mobile**: Currently optimized for desktop (responsive: false) - mobile can be added later

## 🆘 Troubleshooting

**Port already in use:**
```bash
# Kill the process using port 5173
npx kill-port 5173
# Then try npm run dev again
```

**Dependencies won't install:**
```bash
# Clear npm cache and try again
npm cache clean --force
npm install
```

**Changes not appearing:**
- Save your file (Ctrl+S / Cmd+S)
- Check browser console for errors
- Try hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

## 📞 Need Help?

If you run into issues:
1. Check the browser console for error messages
2. Ensure Node.js 18+ is installed: `node --version`
3. Try deleting `node_modules/` and running `npm install` again
4. Reach out to me directly

---

**Package Version:** 1.0
**Last Updated:** 2025-10-17
**Created by:** Theresa
