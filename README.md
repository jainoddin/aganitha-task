# TinyLink - URL Shortener

A URL shortener web application similar to bit.ly, built with Next.js and PostgreSQL.

## Features

- ✅ Create short links with optional custom codes
- ✅ URL validation before saving
- ✅ Global unique code validation (409 error if duplicate)
- ✅ HTTP 302 redirects with click tracking
- ✅ Delete links (returns 404 after deletion)
- ✅ Dashboard with table view, search, and filtering
- ✅ Stats page for individual link analytics
- ✅ Health check endpoint
- ✅ Responsive, polished UI with loading states and error handling

## Tech Stack

- **Framework**: Next.js 16
- **Database**: PostgreSQL (Neon)
- **Styling**: Tailwind CSS
- **Language**: JavaScript/React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (use [Neon](https://neon.tech) for free hosting)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd tiny-link
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
DATABASE_URL=postgresql://user:password@host:port/database
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file with the following variables:

- `DATABASE_URL` - PostgreSQL connection string (required)
- `NEXT_PUBLIC_BASE_URL` - Base URL for your application (defaults to localhost:3000)

## API Endpoints

### Links API

- `POST /api/links` - Create a new short link
  - Body: `{ "url": "https://example.com", "code": "optional" }`
  - Returns 409 if code already exists

- `GET /api/links` - List all links

- `GET /api/links/:code` - Get stats for a specific link

- `DELETE /api/links/:code` - Delete a link

### Other Endpoints

- `GET /healthz` - Health check endpoint
- `GET /:code` - Redirect to original URL (302)

## Pages

- `/` - Dashboard (list, add, delete links)
- `/code/:code` - Stats page for a specific link
- `/:code` - Redirect endpoint

## Code Format

Short codes must follow the pattern: `[A-Za-z0-9]{6,8}` (6-8 alphanumeric characters)

## Deployment

### Vercel + Neon

1. Push your code to GitHub
2. Create a Neon database at [neon.tech](https://neon.tech)
3. Deploy to Vercel:
   - Import your GitHub repository
   - Add environment variables:
     - `DATABASE_URL` from Neon
     - `NEXT_PUBLIC_BASE_URL` as your Vercel deployment URL
4. Vercel will automatically build and deploy

## Project Structure

```
tiny-link/
├── lib/
│   └── db.js           # Database connection and initialization
├── pages/
│   ├── api/
│   │   ├── links/      # Links API endpoints
│   │   └── healthz.js  # Health check endpoint
│   ├── code/
│   │   └── [code].js   # Stats page
│   ├── [code].js       # Redirect handler
│   ├── index.js        # Dashboard
│   └── _app.js         # App wrapper
├── styles/
│   └── globals.css     # Global styles
└── package.json
```

## Testing

The application follows the specified URL conventions for automated testing:

- `/healthz` returns 200 with `{ "ok": true, "version": "1.0" }`
- Creating a link works; duplicate codes return 409
- Redirect works and increments click count
- Deletion stops redirect (404)

## License

MIT
