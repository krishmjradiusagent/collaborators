# Mel AI Goal Setting Module

A full-stack monorepo for the Radius Real Estate App's Mel AI Goal Setting module. This module allows Team Leads to set monthly numeric targets for their agents across four key performance metrics.

## Monorepo Structure

- `packages/shared`: Core TypeScript types, constants, mock services, and React hooks.
- `packages/mobile`: React Native + Expo mobile application (Dark Mode).
- `packages/web`: Vite React + Tailwind CSS + shadcn/ui dashboard (Light Mode).

## Tech Stack

- **Shared**: TypeScript, Zod.
- **Mobile**: React Native, Expo, Lucide Icons, React Navigation.
- **Web**: Vite, Tailwind CSS, shadcn/ui (Radix), React Hook Form, Sonner.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm

### Installation
From the root directory:
```bash
npm install
```

### Running the Apps

#### Web Dashboard
```bash
npm run dev -w @mel-goals/web
```

#### Mobile App
```bash
cd packages/mobile
npm run ios # or npm run android
```

## Design System

### Mobile (Dark Mode)
- **Background**: `#0F0F0F` (Deep Black)
- **Cards**: `#1A1A1A` (Charcoal)
- **Primary Accent**: `#5A5FF2`
- **Text**: White/Gray palette

### Web (Light Mode)
- **Background**: White
- **Primary Accent**: `#5A5FF2`
- **Typography**: Inter (Google Fonts)

## API Integration Guide

The system currently uses a service abstraction with a mock implementation (`GoalServiceMock`). To integrate with a real backend:
1. Implement the `GoalServiceInterface` in `packages/shared/src/services`.
2. Swap the `goalService` export in `packages/shared/src/index.ts`.
3. Update the `useGoals` hook to use the new service.

## Validation Rules
- All 4 metrics (New Leads, Calls, Unique Convos, Appointments) are required.
- Values must be integers between 1 and 9999.
