#!/usr/bin/env bash
# Run from inside your team-velocity repo folder.
set -e

echo "Patching marquee loop math in partner.css and home.css..."
python3 << 'PYEOF'
def patch(path, old, new, label):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    if old not in content:
        print(f"  [SKIP] {label}: exact text not found in {path} (already changed, or differs from expected).")
        return
    content = content.replace(old, new, 1)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  [OK] {label} patched in {path}")

# partner.css
patch("partner.css",
      '.sponsor-track{display:flex;gap:54px;width:max-content;align-items:center;animation:sponsorRollPartner 20s linear infinite}',
      '.sponsor-track{display:flex;width:max-content;align-items:center;animation:sponsorRollPartner 20s linear infinite}',
      "partner.css .sponsor-track — drop gap")
patch("partner.css",
      '.sponsor-logo{width:190px;height:74px;display:flex;align-items:center;justify-content:center}',
      '.sponsor-logo{width:190px;height:74px;margin-right:54px;display:flex;align-items:center;justify-content:center}',
      "partner.css .sponsor-logo — add margin-right (desktop)")
patch("partner.css",
      '.sponsor-track{gap:35px}.sponsor-logo{width:140px;height:56px}}',
      '.sponsor-logo{width:140px;height:56px;margin-right:35px}}',
      "partner.css mobile — drop gap, add margin-right")

# home.css
patch("home.css",
      '.sponsor-track{display:flex;gap:54px;width:max-content;align-items:center;animation:sponsorRoll 20s linear infinite}',
      '.sponsor-track{display:flex;width:max-content;align-items:center;animation:sponsorRoll 20s linear infinite}',
      "home.css .sponsor-track — drop gap")
patch("home.css",
      '.sponsor-logo{width:190px;height:74px;display:flex;align-items:center;justify-content:center}',
      '.sponsor-logo{width:190px;height:74px;margin-right:54px;display:flex;align-items:center;justify-content:center}',
      "home.css .sponsor-logo — add margin-right (desktop)")
patch("home.css",
      '.sponsor-track{gap:35px}.sponsor-logo{width:140px;height:56px}}',
      '.sponsor-logo{width:140px;height:56px;margin-right:35px}}',
      "home.css mobile — drop gap, add margin-right")

print("Done.")
PYEOF

echo ""
echo "Review with: git status"
echo "Then: git add -A && git commit -m 'Fix sponsor marquee infinite-loop seam (gap -> margin-right)' && git push"
