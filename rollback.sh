#!/bin/bash
# ========================================================
# FPL Mini - Rollback & Milestone Navigator
# Usage:
#   ./rollback.sh list             # ดูรายการ rollback ทั้งหมด
#   ./rollback.sh go <name/number> # ย้ายไปยัง rollback นั้นๆ (เช่น ./rollback.sh go 2 หรือ ./rollback.sh go rollback_3)
#   ./rollback.sh main             # กลับมายังเวอร์ชันล่าสุด (main)
#   ./rollback.sh save <number>    # บันทึก milestone ใหม่ (เช่น ./rollback.sh save 4)
# ========================================================

ACTION="${1:-list}"
TARGET="$2"

case "$ACTION" in
  list)
    echo "========================================================"
    echo "📌 Available Rollback Milestones in FPL Mini:"
    echo "========================================================"
    git tag -l "rollback_*" | sort -V | while read -r tag; do
      COMMIT_MSG=$(git log -1 --pretty=format:"%s (%cr)" "$tag" 2>/dev/null)
      echo "  • $tag -> $COMMIT_MSG"
    done
    echo ""
    CURRENT_BRANCH=$(git branch --show-current)
    echo "Current Active Branch: $CURRENT_BRANCH"
    echo "========================================================"
    echo "คำสั่งที่ใช้ได้:"
    echo "  ./rollback.sh go 2      -> ย้ายไป rollback_2"
    echo "  ./rollback.sh go 3      -> ย้ายไป rollback_3"
    echo "  ./rollback.sh main      -> กลับมาเวอร์ชันล่าสุด (main)"
    echo "  ./rollback.sh save <X>  -> บันทึก rollback_X ใหม่และ push ขึ้น GitHub"
    ;;

  go)
    if [ -z "$TARGET" ]; then
      echo "❌ กรุณาระบุชื่อหรือตัวเลข rollback เช่น: ./rollback.sh go 2 หรือ ./rollback.sh go rollback_3"
      exit 1
    fi
    # If user typed just number e.g. "2" -> expand to "rollback_2"
    if [[ "$TARGET" =~ ^[0-9]+$ ]]; then
      TARGET="rollback_${TARGET}"
    fi
    echo "🔄 Switching to $TARGET..."
    git checkout "$TARGET"
    python3 update_preview.py
    echo "✅ Switched to $TARGET successfully!"
    ;;

  main|latest)
    echo "🔄 Returning to main (latest version)..."
    git checkout main
    python3 update_preview.py
    echo "✅ Switched to main successfully!"
    ;;

  save)
    if [ -z "$TARGET" ]; then
      echo "❌ กรุณาระบุตัวเลขหรือชื่อ rollback เช่น: ./rollback.sh save 4"
      exit 1
    fi
    if [[ "$TARGET" =~ ^[0-9]+$ ]]; then
      TAG_NAME="rollback_${TARGET}"
    else
      TAG_NAME="$TARGET"
    fi
    echo "💾 Creating Milestone $TAG_NAME..."
    git add -A
    git commit -m "Milestone $TAG_NAME: Auto-saved milestone" || true
    git branch -f "$TAG_NAME" HEAD
    git tag -f -a "$TAG_NAME" -m "Milestone $TAG_NAME"
    git push origin main || true
    git push -f origin "refs/heads/${TAG_NAME}:refs/heads/${TAG_NAME}"
    git push -f origin "refs/tags/${TAG_NAME}:refs/tags/${TAG_NAME}"
    echo "✅ Saved and pushed $TAG_NAME to GitHub successfully!"
    ;;

  *)
    echo "คำสั่งไม่ถูกต้อง กรุณาใช้:"
    echo "  ./rollback.sh list"
    echo "  ./rollback.sh go <name/number>"
    echo "  ./rollback.sh main"
    echo "  ./rollback.sh save <number>"
    ;;
esac
