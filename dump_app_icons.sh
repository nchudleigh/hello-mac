#!/usr/bin/env zsh
# save as dump_app_icons.sh, then:  chmod +x dump_app_icons.sh && ./dump_app_icons.sh ~/Desktop/AppIcons

set -eu

# Where to drop the PNGs (defaults to ~/AppIcons if nothing passed)
OUTDIR="${1:-$HOME/AppIcons}"
mkdir -p "$OUTDIR"

# Folders to scan – add more if you keep apps elsewhere
SEARCH_DIRS=(
  "/Applications"
  "/System/Applications"
  "$HOME/Applications"
)

print_icon () {
  local app="$1"
  local plist="$app/Contents/Info.plist"

  # Try the modern and the legacy plist key
  local iconbase=$(/usr/libexec/PlistBuddy -c "Print :CFBundleIconName" "$plist" 2>/dev/null || true)
  [[ -z "$iconbase" ]] && iconbase=$(/usr/libexec/PlistBuddy -c "Print :CFBundleIconFile" "$plist" 2>/dev/null || true)
  [[ -z "$iconbase" ]] && return        # couldn’t find an icon entry

  # Make sure it has an .icns extension
  [[ "$iconbase" == *.icns ]] || iconbase="${iconbase}.icns"

  local icns_path="$app/Contents/Resources/$iconbase"
  [[ -f "$icns_path" ]] || return       # icon file missing

  # Convert to 1024-pixel PNG (largest representation in the .icns)
  local name="${app:t:r}"               # “Foo.app” ➜ “Foo”
  sips --setProperty format png "$icns_path" --out "$OUTDIR/$name.png" >/dev/null
  echo "✓ $name"
}

for dir in $SEARCH_DIRS; do
  [[ -d "$dir" ]] || continue
  find "$dir" -maxdepth 1 -type d -name "*.app" -print0 |
    while IFS= read -r -d '' app; do
      print_icon "$app"
    done
done

echo "Icons saved to $OUTDIR"

