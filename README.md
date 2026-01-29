# DCL Regenesis Labs Dashboard

A React dashboard for tracking Decentraland Regenesis Labs treasury balances, budget allocation, and DeFi positions.

## Development

```bash
npm install       # Install dependencies
npm run dev       # Start dev server (port 8080)
npm run build     # Production build
npm run lint      # Run ESLint
```

## Data Scripts

The dashboard displays data fetched by automated scripts that run daily via GitHub Actions.

### Fetch Balances

```bash
npm run fetch-balances
```

Fetches wallet token balances and DeFi positions:
- Token balances (ETH, USDC, USDT, MANA, etc.)
- Morpho lending positions
- Merkl unclaimed rewards
- USD values via CoinGecko prices

Output: `data/balances.json`

### Fetch Dashboard Data

```bash
npm run fetch-dashboard
```

Fetches budget and roadmap data from Google Sheets.

Output: `data/dashboard-data.json`

### Fetch Roadmap Data

```bash
npm run fetch-roadmap
```

Fetches roadmap initiatives from a Notion database.

**Required environment variable:**
- `NOTION_TOKEN` - Notion integration API token

Output: `data/roadmap.json`

**Setup:**
1. Create a Notion integration at [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Share the roadmap database with the integration
3. Add `NOTION_TOKEN` as a GitHub repository secret

## Monthly Snapshots

On the 1st of each month, a snapshot of the balance data is automatically saved for historical tracking.

**How it works:**
- The `fetch-balances` script checks if it's the 1st of the month (UTC)
- If so, it saves a copy of the current data to `data/snapshots/MM-YYYY.json`
- No workflow changes needed - runs on existing daily cron

**File structure:**
```
data/
├── balances.json          # Current balances (updated daily)
├── dashboard-data.json    # Current budget data (updated daily)
├── roadmap.json           # Current roadmap data (updated daily)
└── snapshots/
    ├── 01-2026.json       # January 2026 snapshot
    ├── 02-2026.json       # February 2026 snapshot
    └── ...
```

Each snapshot contains the full balance data from the 1st of that month, allowing you to track treasury variations over time.

## Project Structure

```
src/
├── components/ui/     # shadcn/ui primitives
├── components/        # Dashboard components (Header, MetricCard, etc.)
├── pages/             # Route components
├── hooks/             # Custom React hooks (useBalanceData, useDashboardData, useRoadmapData)
└── lib/               # Utilities

scripts/
├── lib/               # Shared utilities (output.ts)
├── notion/            # Notion data fetching (roadmap)
├── sheets/            # Google Sheets data fetching
└── web3/              # Blockchain data fetching
    ├── config/        # Wallet addresses, token configs
    └── lib/           # Token, Morpho, Merkl helpers

data/                  # JSON data files (gitignored in production)
```

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, shadcn/ui
- **Data:** Direct RPC calls (viem), CoinGecko API, Google Sheets API
- **Automation:** GitHub Actions (daily cron)

## Deployment

Built with [Lovable](https://lovable.dev). Changes sync bidirectionally with lovable.dev.
