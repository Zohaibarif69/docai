# Frontend Setup & Development

This is the React + Vite frontend for Smart Doctor Connect AI.

## 📋 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🗂️ Project Structure

```
src/
├── app/
│   ├── components/           # Reusable components
│   │   ├── DoctorCard.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ui/               # UI components
│   ├── pages/                # Page components
│   │   ├── HomePage.tsx
│   │   ├── AuthPage.tsx
│   │   ├── ChatPage.tsx
│   │   ├── DoctorProfilePage.tsx
│   │   ├── AppointmentPage.tsx
│   │   ├── PatientDashboard.tsx
│   │   ├── DoctorDashboard.tsx
│   │   ├── AdminPanel.tsx
│   │   ├── SearchResultsPage.tsx
│   │   └── NotificationsPage.tsx
│   ├── data/
│   │   └── mockData.ts       # Mock data (replace with API calls)
│   ├── routes.tsx            # Router configuration
│   ├── App.tsx               # Main app component
│   └── Root.tsx              # Root layout
├── styles/                   # Global styles
│   ├── index.css
│   ├── tailwind.css
│   ├── fonts.css
│   └── theme.css
├── imports/                  # Asset imports
├── main.tsx                  # Entry point
├── index.html                # HTML template
├── vite.config.ts            # Vite configuration
├── postcss.config.mjs        # PostCSS configuration
├── tsconfig.json             # TypeScript configuration
└── tailwind.config.ts        # Tailwind CSS configuration
```

## 🎨 Technologies Used

- **React 18.3.1** - UI library
- **Vite 6.3.5** - Build tool & dev server
- **TypeScript** - Type safety
- **Tailwind CSS 4.1.12** - Utility-first CSS
- **React Router 7.13.0** - Client-side routing
- **Radix UI** - Accessible components
- **Lucide React** - Icons
- **Sonner** - Toast notifications
- **Motion** - Animations
- **Recharts** - Charts & graphs

## 📦 Available Scripts

```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linter (if configured)
```

## 🔗 API Integration

The frontend connects to the FastAPI backend at `http://localhost:8000/api/v1`.

See `../docs/FRONTEND_BACKEND_INTEGRATION.md` for:
- How to replace mock data with API calls
- Authentication setup
- Chat integration
- Error handling

### Quick Example

```typescript
import { doctors } from "../utils/api";

// Fetch doctors from backend
const [doctorsList, setDoctorsList] = useState([]);

useEffect(() => {
  doctors.getList()
    .then(setDoctorsList)
    .catch(error => console.error(error));
}, []);
```

## 🎯 Development Workflow

1. **Create Components**: Add to `src/app/components/`
2. **Create Pages**: Add to `src/app/pages/`
3. **Style**: Use Tailwind CSS classes
4. **Route**: Add to `src/app/routes.tsx`
5. **Test**: Run `npm run dev` and test in browser
6. **Build**: Run `npm run build`

## 📝 Environment Variables

Create `.env.local` in the frontend folder:

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=Smart Doctor Connect AI
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Drag dist/ folder to Netlify
```

See `../docs/DEPLOYMENT.md` for more options.

## 🔧 Troubleshooting

### Port already in use?
```bash
npm run dev -- --port 3000
```

### Modules not found?
```bash
npm install
```

### Build errors?
```bash
rm -rf node_modules dist
npm install
npm run build
```

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Radix UI Components](https://www.radix-ui.com/docs/primitives/overview/introduction)

## ✨ Notes

- This is a React frontend built with Vite
- All styling uses Tailwind CSS
- Currently uses mock data - integrate with backend API
- Component library uses Radix UI for accessibility
- Routing handled by React Router v7

---

**Next**: Run `npm run dev` and start building! 🚀
