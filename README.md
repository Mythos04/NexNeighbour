# NexNeighbour

A Next.js + TypeScript application for connecting communities and neighbors.

![Landing Page](https://github.com/user-attachments/assets/01ee8c32-e51c-4062-8ca6-704edcfc6088)

## Features

- 🌍 **3D Interactive Earth** - Built with Three.js for an immersive hero experience
- 🔍 **Search Bar** - Find neighbors, places, and services
- 📂 **Category Navigation** - Browse by Neighbors, Services, Events, Places, Community, and Help
- 🎨 **Brand Colors** - Turquoise (#0F6D70) and white theme

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js with @react-three/fiber and @react-three/drei

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles with brand colors
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Landing page
└── components/
    ├── Header/          # Navigation header
    ├── Hero/            # Hero section with 3D Earth
    ├── Earth3D/         # Three.js 3D Earth component
    ├── SearchBar/       # Search input component
    └── CategoryLegend/  # Category navigation grid
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Brand Guidelines

- **Primary Color**: Turquoise `#0F6D70`
- **Primary Dark**: `#0a5355`
- **Primary Light**: `#1a8a8e`
- **Background**: White `#ffffff`
