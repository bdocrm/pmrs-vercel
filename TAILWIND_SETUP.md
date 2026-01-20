# PMRS with Tailwind CSS

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

This will install Tailwind CSS and its dependencies as defined in `package.json`.

### 2. Build CSS (Optional - for development)
```bash
npm run build:css
```

This command compiles the Tailwind CSS from `css/input.css` to `css/styles.css`.

### 3. Run the Application
```bash
npm start
# or for development with auto-reload
npm run dev
```

## Project Structure

```
pmrs-vercel/
├── css/
│   ├── input.css          # Tailwind input file (contains @tailwind directives)
│   └── styles.css         # Compiled CSS output (fallback with manual utilities)
├── js/
│   ├── app.js            # Main application logic
│   ├── config.js         # Configuration
├── api/
│   └── index.js          # Express API server
├── tailwind.config.js    # Tailwind configuration
├── postcss.config.js     # PostCSS configuration
├── package.json          # Dependencies and scripts
└── index.html            # Main HTML file
```

## Tailwind CSS Configuration

The `tailwind.config.js` file includes:
- Brand colors: navy, blue, orange, white, black
- Custom fonts: Cardo (headers), Open Sans (body)
- Extended spacing and shadows
- Responsive breakpoints

## Features

✅ **Material-UI Inspired Login Page**
- Split layout with info section and form
- Responsive design (stacks on mobile)
- Modern gradient backgrounds
- Professional branding with Cardo font

✅ **Tailwind CSS Utilities**
- All standard Tailwind classes available
- Custom component utilities (.btn-primary, .input-field, .card)
- Brand color variables
- Responsive utilities with lg: prefix

✅ **CSS Approach**
- CSS-in-Tailwind hybrid (manual utility classes in `styles.css`)
- No need to recompile for basic changes
- Fallback CSS if Tailwind compiler isn't available
- Small, maintainable stylesheet

## Usage Examples

### Login Page
- Modern split layout
- Gradient backgrounds using brand colors
- Form validation with focus states
- Social login buttons placeholder
- Remember me checkbox
- "Forgot password" link

### Component Classes
```html
<!-- Buttons -->
<button class="btn-primary">Click me</button>

<!-- Input fields -->
<input class="input-field" type="email" />

<!-- Cards -->
<div class="card">...</div>

<!-- Flexbox -->
<div class="flex justify-center items-center">...</div>

<!-- Gradients -->
<div class="bg-gradient-to-br">...</div>

<!-- Responsive -->
<div class="hidden lg:flex">Desktop only</div>
```

## Color Palette

- **Brand Navy**: #160D76 (primary dark)
- **Brand Blue**: #4094d9 (primary light)
- **Brand Orange**: #F08530 (accent)
- **Brand White**: #FFFFFA (background)
- **Brand Black**: #222222 (text)

## Typography

- **Headers**: Cardo (serif) - elegant, professional
- **Body**: Open Sans (sans-serif) - clean, readable
- Both imported from Google Fonts

## Development Notes

1. **CSS Output**: The compiled `styles.css` is committed to git for production readiness
2. **Responsive Design**: Use `lg:` prefix for desktop-only utilities
3. **Brand Colors**: Always use CSS variables or Tailwind color classes (e.g., `bg-brand-blue`)
4. **Custom Utilities**: Add new utilities to `css/input.css` under `@layer components`

## Deployment

The application is production-ready:
- CSS is pre-compiled and included in the repo
- No build step required for deployment
- Tailwind config and PostCSS config included for future builds
- All dependencies listed in package.json

## Next Steps

To extend Tailwind CSS functionality:
1. Edit `css/input.css` to add new utilities or components
2. Run `npm run build:css` to recompile
3. Or manually add utilities to `css/styles.css` as needed
