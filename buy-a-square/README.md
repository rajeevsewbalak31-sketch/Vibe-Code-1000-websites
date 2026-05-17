# Buy a Square - Next.js Application

A modern web application for purchasing digital squares on a 10×10 grid using Next.js, React, and Tailwind CSS.

## Features

- Interactive 10×10 grid of clickable squares
- Modern UI with dark mode support
- PayPal integration for payments
- Responsive design
- TypeScript support
- Tailwind CSS styling

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
# or
yarn install
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

```bash
npm run build
npm run start
```

## Project Structure

```
buy-a-square/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── globals.css         # Global styles
│   └── page.tsx            # Home page
├── components/
│   ├── ui/                 # Reusable UI components
│   └── theme-provider.tsx  # Theme provider
├── lib/
│   └── utils.ts           # Utility functions
└── package.json
```

## Technologies Used

- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Radix UI** - Accessible component primitives
- **next-themes** - Dark mode support
- **Vercel Analytics** - Analytics (production only)

## License

MIT License - See LICENSE file for details
