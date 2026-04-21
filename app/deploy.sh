#!/usr/bin/env bash
# Build this Vite app and deploy to mushcore/study-guides (GitHub Pages).
# Live URL: https://mushcore.github.io/study-guides/
set -euo pipefail

SRC="$(cd "$(dirname "$0")" && pwd)"
DEPLOY="${DEPLOY_DIR:-$SRC/../deploy}"
MSG="${1:-deploy: $(date -u +%Y-%m-%dT%H:%M:%SZ)}"

[ -d "$DEPLOY/.git" ] || { echo "deploy clone missing: $DEPLOY" >&2; exit 1; }

echo "==> building"
cd "$SRC"
npm run build

echo "==> syncing to $DEPLOY"
cd "$DEPLOY"
git fetch origin main --quiet
git reset --hard origin/main --quiet

# wipe tracked files but keep .git
git ls-files -z | xargs -0 rm -f
find . -type d -empty -not -path './.git/*' -not -name '.git' -delete 2>/dev/null || true

cp -R "$SRC/dist/." .
cp index.html 404.html
touch .nojekyll

if git diff --quiet && git diff --cached --quiet; then
  echo "==> no changes"; exit 0
fi

git add -A
git commit -m "$MSG"
git push origin main
echo "==> pushed. Pages will rebuild in ~30s: https://mushcore.github.io/study-guides/"
