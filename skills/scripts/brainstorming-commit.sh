#!/bin/bash
# Brainstorming Skill - 自動 Git Commit 腳本
# 用法: ./brainstorming-commit.sh <設計文檔路徑> <主題> <方案數> <選定方案>

set -e  # 遇到錯誤立即退出

DESIGN_FILE="$1"
TOPIC="$2"
SOLUTION_COUNT="${3:-2}"  # 默認 2 種方案
CHOSEN_SOLUTION="${4:-方案 A}"  # 默認方案 A

# 檢查參數
if [ -z "$DESIGN_FILE" ] || [ -z "$TOPIC" ]; then
    echo "❌ 錯誤: 缺少必要參數"
    echo "用法: $0 <設計文檔路徑> <主題> [方案數] [選定方案]"
    exit 1
fi

# 檢查文件是否存在
if [ ! -f "$DESIGN_FILE" ]; then
    echo "❌ 錯誤: 文件不存在: $DESIGN_FILE"
    exit 1
fi

# 檢查是否為 Git 專案
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "⚠️  警告: 非 Git 專案，跳過 Git 操作"
    exit 0
fi

# Git 操作
echo "📝 添加文件到 Git: $DESIGN_FILE"
git add "$DESIGN_FILE"

echo "💾 創建 Commit..."
git commit -m "docs(brainstorming): 完成 ${TOPIC} 設計文檔

- 探索 ${SOLUTION_COUNT} 種方案
- 選定方案: ${CHOSEN_SOLUTION}
- 涵蓋: 架構/組件/數據流/測試

🧠 Generated via Brainstorming Skill"

COMMIT_HASH=$(git rev-parse --short HEAD)

echo "✅ Commit 完成: $COMMIT_HASH"
echo ""
echo "📄 設計文檔: $DESIGN_FILE"
echo "🎯 Git commit: $COMMIT_HASH"
echo ""
echo "💡 下一步建議:"
echo "   1. git push origin main  # 推送到遠端"
echo "   2. 開始實作（建議使用 TDD 流程）"
