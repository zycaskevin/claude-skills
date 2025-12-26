#!/usr/bin/env node
// session-start.js - 會話啟動 Hook
// 觸發時機：每次啟動 Claude Code 會話時

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ============================================
// 1. Git 狀態檢查
// ============================================
function getGitStatus() {
  try {
    const branch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
    const status = execSync('git status --short', { encoding: 'utf-8' }).trim();
    const uncommittedCount = status ? status.split('\n').length : 0;

    return {
      branch,
      uncommittedCount,
      hasChanges: uncommittedCount > 0,
      statusLines: status ? status.split('\n').slice(0, 5) : [] // 最多顯示 5 個檔案
    };
  } catch (error) {
    return {
      branch: 'N/A (非 Git 倉庫)',
      uncommittedCount: 0,
      hasChanges: false,
      statusLines: []
    };
  }
}

// ============================================
// 2. 專案待辦事項加載
// ============================================
function getTodoItems() {
  const todoFiles = [
    'TODO.md',
    '.claude/TODO.md',
    'CLAUDE.md'
  ];

  for (const file of todoFiles) {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8');

      // 提取待辦事項（尋找 [ ] 未完成的項目）
      const todoRegex = /^[\s-]*\[ \]\s+(.+)$/gm;
      const todos = [];
      let match;

      while ((match = todoRegex.exec(content)) !== null) {
        todos.push(match[1]);
        if (todos.length >= 5) break; // 最多顯示 5 個
      }

      if (todos.length > 0) {
        return { file, todos };
      }
    }
  }

  return { file: null, todos: [] };
}

// ============================================
// 3. 快捷命令菜單
// ============================================
function getQuickCommands() {
  return [
    { cmd: '/help', desc: 'Claude Code 完整幫助' },
    { cmd: '/commit', desc: '提交 Git 變更' },
    { cmd: '/review-pr', desc: '審查 Pull Request' },
    { cmd: '/test', desc: '執行測試套件' },
    { cmd: '/crud', desc: 'CRUD 業務模塊開發' },
    { cmd: '/api', desc: 'API 設計與開發' }
  ];
}

// ============================================
// 4. 生成會話啟動訊息
// ============================================
function generateSessionMessage() {
  const git = getGitStatus();
  const { file: todoFile, todos } = getTodoItems();
  const commands = getQuickCommands();

  let message = `
╔══════════════════════════════════════════════════════════════╗
║           🚀 Claude Code 會話已啟動                          ║
╚══════════════════════════════════════════════════════════════╝

## 🌐 語言設定提醒
💡 **預設輸出語言**: 繁體中文
   - 所有思考、文檔、回應皆使用繁體中文
   - 如需其他語言，請明確指定（例如：「用英文回答」）

## 📊 當前專案狀態

### 🌿 Git 分支狀態
- **當前分支**: ${git.branch}
- **未提交變更**: ${git.uncommittedCount} 個檔案
`;

  if (git.hasChanges) {
    message += `\n**變更預覽**:\n`;
    git.statusLines.forEach(line => {
      message += `  ${line}\n`;
    });
    if (git.uncommittedCount > 5) {
      message += `  ... 還有 ${git.uncommittedCount - 5} 個檔案未顯示\n`;
    }
  }

  message += `\n### 📋 待辦事項`;

  if (todos.length > 0) {
    message += ` (來源: ${todoFile})\n`;
    todos.forEach((todo, index) => {
      message += `${index + 1}. [ ] ${todo}\n`;
    });
  } else {
    message += `\n✅ 沒有待辦事項 (或未找到 TODO 檔案)\n`;
  }

  message += `\n### ⚡ 快捷命令菜單\n`;
  commands.forEach(({ cmd, desc }) => {
    message += `  ${cmd.padEnd(15)} - ${desc}\n`;
  });

  message += `\n---
💡 **提示**: 直接輸入命令或描述您的需求即可開始工作！
🔧 **專案根目錄**: ${process.cwd()}
📖 **完整指南**: 查看 CLAUDE.md 獲取詳細工作流程

`;

  return message;
}

// ============================================
// 主執行邏輯
// ============================================
try {
  const message = generateSessionMessage();
  console.log(message);
} catch (error) {
  console.error('❌ SessionStart Hook 執行錯誤:', error.message);
  process.exit(1);
}
