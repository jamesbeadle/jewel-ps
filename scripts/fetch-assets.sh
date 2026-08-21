#!/usr/bin/env bash
# Downloads the images used by the site from the current jewelps.co.uk
# into static/images/, so the new site can self-host them.
# Run from the project root:  bash scripts/fetch-assets.sh
# Then change IMG_BASE in src/lib/site.js to '/images'.
set -euo pipefail

mkdir -p static/images
cd static/images

files=(
  "Logo_Jewel-Property-Serve.png"
  "Jewel-Property-Serve.webp"
  "Jewel-diamond.svg"
  "Jewel-PS-Favicon.png"
  "Safe-Contractor-Approved.png"
  "NIC-EIC-Logo.webp"
  "Vantify-.jpg"
  "image6.jpg"
  "Jewel-repair.jpg"
  "common-roof-repairs.webp"
  "customer-service-24-hours-7-days-support2.jpg"
  "Kitchens.jpg"
  "Bathroom--Plumbing.avif"
  "Carpentry-and-Joinery.png"
  "6870d940dea0ec79c9489c62_Tilling-p-800.jpg"
  "image10.jpg"
  "50-Liverpool-st-Lounge-Area-Workroom-view_MC_HR_13.14-1920x1280.jpg"
  "jewel_style_prime_london_lobby_option_3-1.png"
  "Office-Picture-1.png"
  "construction-engineer-with-foreman-worker-checking-2021-08-26-17-34-59-utc_60.jpg"
  "Ecoligi.jpg"
  "9174928687_ba363209af_k.jpg"
)

for f in "${files[@]}"; do
  echo "Fetching $f"
  curl -sfL "https://www.jewelps.co.uk/images/$f" -o "$f" || echo "  FAILED: $f"
done

echo "Done. Now set IMG_BASE = '/images' in src/lib/site.js"
