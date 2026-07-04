# Stephanie Van Horn — Project Dashboards

Contains both dashboards as one deployable site with a tab switcher:
- **Bookstore Delivery Dashboard** — SAFe agile delivery board for the bookstore digital transformation program
- **DFW Relocation Dashboard** — weighted decision-support comparison of Las Colinas vs. Legacy West

## Fastest path to a live URL (no install needed)

1. Go to [vercel.com](https://vercel.com) and sign up free with your GitHub account.
2. Go to [github.com/new](https://github.com/new), create a repo (e.g. `stephanie-dashboards`), and upload this whole folder (drag and drop works, or use GitHub Desktop).
3. In Vercel, click **Add New → Project**, select your new repo, leave all settings on default (Vercel auto-detects Vite), and click **Deploy**.
4. In ~60 seconds you'll get a live URL like `stephanie-dashboards.vercel.app`.
5. Every time you push a change to GitHub, Vercel redeploys automatically.

## Running it locally first (optional, to preview before deploying)

```bash
npm install
npm run dev
```

Then open the local URL it prints (usually `http://localhost:5173`).

## Once it's live

Copy your Vercel URL and paste it into the "Live MVP" / "Agile delivery dashboard" /
"Live dashboard" links in `portfolio.html`, replacing the `#` placeholders.

You can deep-link to a specific tab later if you want — right now both dashboards live
on one URL with tabs at the top, which keeps things simple for a single portfolio link.
