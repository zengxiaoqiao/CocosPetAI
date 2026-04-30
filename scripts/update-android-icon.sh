#!/bin/bash
# 从 settings/icon.png 生成 Android 各密度图标，替换 native/engine/android/res 下的 ic_launcher
# 用法: ./scripts/update-android-icon.sh

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ICON_SRC="$PROJECT_ROOT/settings/icon.png"
RES_BASE="$PROJECT_ROOT/native/engine/android/res"

if [ ! -f "$ICON_SRC" ]; then
  echo "错误: 找不到 $ICON_SRC"
  exit 1
fi

for size in 48 72 96 144 192; do
  case $size in
    48)  dir="mipmap-mdpi"   ;;
    72)  dir="mipmap-hdpi"   ;;
    96)  dir="mipmap-xhdpi"  ;;
    144) dir="mipmap-xxhdpi" ;;
    192) dir="mipmap-xxxhdpi" ;;
  esac
  sips -z $size $size "$ICON_SRC" --out "$RES_BASE/$dir/ic_launcher.png"
  echo "已更新 $dir/ic_launcher.png ($size×$size)"
done
echo "完成"
