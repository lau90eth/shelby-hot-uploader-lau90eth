# Shelby Hot Uploader

**Upload files to decentralized storage on Shelby (Shelbynet)**

A simple, beautiful and fast dApp to upload files to **Shelby** (decentralized storage on Aptos), with drag & drop interface, file preview, customizable blob name, expiration selection and iconic pink button.

Built by **Lau90eth**.

## Live Demo

https://shelby-hot-uploader-lau90eth.vercel.app

## Features

- Drag & drop or file selection
- File preview + details (name, size, type)
- Customizable Blob Name (with automatic unique generation to avoid duplicates)
- Expiration selection (7, 30, 90, 365 days)
- Pink "Upload to Shelby" button with progress bar
- Wallet connection via Petra / Martian / Fewcha etc. (Aptos Wallet Adapter)
- On-chain upload to Shelbynet (Shelby contract)
- My Blobs view with metadata, expiration and transaction hash

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Wallet**: @aptos-labs/wallet-adapter-react ^8.2.1
- **Aptos SDK**: @aptos-labs/ts-sdk ^6.0.0
- **Shelby SDK**: @shelby-protocol/sdk ^0.0.9
- **Styling**: Tailwind CSS + lucide-react icons + framer-motion
- **Notifications**: react-hot-toast
- **Deployment**: Vercel

## Prerequisites

- Node.js ≥ 18
- Aptos wallet (Petra, Martian, Fewcha...) on **Shelbynet** network
- Shelby API key (optional, for future retrieval features): generate at https://geomi.dev

## Local Installation

1. Clone the repository

```bash
git clone https://github.com/lau90eth/shelby-hot-uploader-final.git
cd shelby-hot-uploader-final

Install dependencies

Bashnpm install --legacy-peer-deps

(Optional) Create .env.local for future retrieval features

Bashecho "VITE_SHELBY_API_KEY=AG-YOUR_KEY_HERE" > .env.local

Start development server

Bashnpm run dev
Open: http://localhost:5173
Deploy on Vercel

Push/fork the repo to GitHub
Go to https://vercel.com → New Project → Import Git Repository
Settings:
Framework Preset: Vite
Root Directory: ./
Environment Variables: add VITE_SHELBY_API_KEY if using retrieval

Deploy → automatic URL generated

How to Use

Connect your wallet (Petra or other on Shelbynet)
Drag & drop or select a file
Customize Blob Name (or keep auto-generated)
Choose expiration days
Click "Upload to Shelby" → approve transaction in wallet
Go to "My Blobs" to see your uploaded files metadata

Retrieval / Download
Direct browser download is not currently supported (Shelby retrieval uses CLI or server-side SDK).
To download a blob manually:
Bash# Install Shelby CLI (see docs.shelby.xyz/tools/cli)
shelby download "Your Blob Name.png" output.png
Future versions may include browser retrieval via SDK or backend proxy.
Project Structure
textsrc/
├── components/
│   ├── UploadForm.tsx       # upload form + drag & drop
│   └── MyBlobs.tsx          # list of registered blobs
├── shelby-real.ts           # on-chain upload logic
├── WalletProvider.tsx       # wallet adapter provider
├── App.tsx
└── main.tsx
License
MIT – feel free to use, fork, modify. If you build something cool with it, let me know! 😄
Credits / Contact

Built by Lau90eth
Thanks to Aptos & Shelby community for support

⭐ Star & fork welcome!
https://github.com/lau90eth/shelby-hot-uploader-final
