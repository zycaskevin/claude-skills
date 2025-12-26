#!/usr/bin/env node
// stop.js - AI 完成回答後的智能收尾 Hook
// 觸發時機：AI 完成回答後

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ============================================
// 配置項
// ============================================
const CONFIG = {
  // 音效設定
  playSound: true,

  // 文件組織
  docsDir: 'docs',
  rootDir: process.cwd(),

  // 臨時文件模式（刪除）
  tempPatterns: [
    'test-*.js',        // 測試腳本
    'test-input.json',  // 測試數據
    '*.tmp',
    '*.temp',
    'nul',              // Windows 誤創建
    '.DS_Store',
    'Thumbs.db',
  ],

  // 文檔文件模式（需移至 docs/）
  docPatterns: [
    '*.md',
    'GUIDE*.md',
    'SPECIFICATION*.md',
    'ROADMAP*.md',
  ],

  // 必須保留在根目錄的文件（白名單）
  rootWhitelist: [
    'README.md',
    'CLAUDE.md',
    'CHANGELOG.md',
    'LICENSE',
    '.gitignore',
    'package.json',
    'package-lock.json',
  ],
};

// ============================================
// 1. 播放完成音效
// ============================================
function playCompletionSound() {
  if (!CONFIG.playSound) return;

  try {
    if (process.platform === 'win32') {
      execSync('powershell -c (New-Object Media.SoundPlayer "C:\\Windows\\Media\\Windows Ding.wav").PlaySync()', {
        stdio: 'ignore',
        timeout: 2000
      });
      console.log('🔔 完成音效已播放');
    } else if (process.platform === 'darwin') {
      execSync('afplay /System/Library/Sounds/Glass.aiff', {
        stdio: 'ignore',
        timeout: 2000
      });
      console.log('🔔 完成音效已播放');
    } else {
      process.stdout.write('\x07'); // Beep
    }
  } catch (error) {
    console.log('🔇 音效播放失敗（已忽略）');
  }
}

// ============================================
// 2. 追蹤本次對話創建的文件
// ============================================
function trackSessionFiles() {
  try {
    // 使用 Git 查詢未追蹤 + 已修改的文件
    const status = execSync('git status --short', { encoding: 'utf-8', stdio: 'pipe' }).trim();

    if (!status) {
      return { created: [], modified: [] };
    }

    const created = [];
    const modified = [];

    status.split('\n').forEach(line => {
      const statusCode = line.substring(0, 2).trim();
      const file = line.substring(3);

      if (statusCode === '??' || statusCode === 'A') {
        created.push(file);
      } else if (statusCode === 'M' || statusCode === 'MM') {
        modified.push(file);
      }
    });

    return { created, modified };

  } catch (error) {
    // 非 Git 倉庫，使用時間戳判斷（最近 5 分鐘）
    const recentFiles = findRecentFiles(CONFIG.rootDir, 5);
    return { created: recentFiles, modified: [] };
  }
}

function findRecentFiles(dir, minutesAgo) {
  const results = [];
  const cutoffTime = Date.now() - (minutesAgo * 60 * 1000);

  function search(currentDir, depth = 0) {
    if (depth > 3) return; // 限制深度

    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });

      entries.forEach(entry => {
        if (entry.name === 'node_modules' || entry.name === '.git') return;

        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
          search(fullPath, depth + 1);
        } else if (entry.isFile()) {
          const stats = fs.statSync(fullPath);
          if (stats.mtimeMs > cutoffTime) {
            results.push(path.relative(CONFIG.rootDir, fullPath));
          }
        }
      });
    } catch (error) {
      // 忽略錯誤
    }
  }

  search(dir);
  return results;
}

// ============================================
// 3. 清理臨時文件
// ============================================
function cleanTemporaryFiles() {
  const cleaned = [];

  CONFIG.tempPatterns.forEach(pattern => {
    const files = findFilesByPattern(CONFIG.rootDir, pattern, { maxDepth: 2 });

    files.forEach(file => {
      try {
        fs.unlinkSync(file);
        cleaned.push(path.relative(CONFIG.rootDir, file));
      } catch (error) {
        // 忽略刪除失敗
      }
    });
  });

  return cleaned;
}

// ============================================
// 4. 組織文檔到 docs/ 目錄
// ============================================
function organizeDocs() {
  const docsPath = path.join(CONFIG.rootDir, CONFIG.docsDir);
  const moved = [];

  // 確保 docs/ 目錄存在
  if (!fs.existsSync(docsPath)) {
    fs.mkdirSync(docsPath, { recursive: true });
  }

  // 查找根目錄下的文檔文件
  const rootFiles = fs.readdirSync(CONFIG.rootDir);

  rootFiles.forEach(file => {
    const filePath = path.join(CONFIG.rootDir, file);

    // 跳過目錄
    if (fs.statSync(filePath).isDirectory()) return;

    // 檢查是否為文檔文件
    const isDoc = CONFIG.docPatterns.some(pattern => matchPattern(file, pattern));

    // 檢查是否在白名單中
    const isWhitelisted = CONFIG.rootWhitelist.some(whiteFile =>
      file.toLowerCase() === whiteFile.toLowerCase()
    );

    // 如果是文檔且不在白名單，移至 docs/
    if (isDoc && !isWhitelisted) {
      const targetPath = path.join(docsPath, file);

      try {
        fs.renameSync(filePath, targetPath);
        moved.push({ from: file, to: `${CONFIG.docsDir}/${file}` });
      } catch (error) {
        // 忽略移動失敗
      }
    }
  });

  return moved;
}

// ============================================
// 5. 更新 README.md 文檔索引
// ============================================
function updateReadmeDocIndex(sessionFiles, movedDocs) {
  const readmePath = path.join(CONFIG.rootDir, 'README.md');
  const docsPath = path.join(CONFIG.rootDir, CONFIG.docsDir);

  // 如果 README 不存在，創建一個
  if (!fs.existsSync(readmePath)) {
    const template = generateReadmeTemplate();
    fs.writeFileSync(readmePath, template);
    return { created: true, updated: false };
  }

  // 讀取現有 README
  let readme = fs.readFileSync(readmePath, 'utf-8');

  // 生成文檔索引
  const docIndex = generateDocIndex(docsPath);

  // 檢查是否已有 ## 📚 文檔索引 章節
  const docSectionRegex = /## 📚 文檔索引[\s\S]*?(?=\n## |\n---|\z)/;

  if (docSectionRegex.test(readme)) {
    // 替換現有章節
    readme = readme.replace(docSectionRegex, docIndex);
  } else {
    // 在文件末尾新增章節
    readme += `\n\n${docIndex}\n`;
  }

  // 寫回 README
  fs.writeFileSync(readmePath, readme);

  return { created: false, updated: true };
}

function generateDocIndex(docsPath) {
  let index = `## 📚 文檔索引

> **自動生成時間**: ${new Date().toLocaleString('zh-TW')}

`;

  if (!fs.existsSync(docsPath)) {
    index += '目前沒有文檔。\n';
    return index;
  }

  const docs = fs.readdirSync(docsPath).filter(file => file.endsWith('.md'));

  if (docs.length === 0) {
    index += '目前沒有文檔。\n';
    return index;
  }

  // 分類文檔
  const categories = {
    '指南': [],
    '規格': [],
    '計畫': [],
    '其他': []
  };

  docs.forEach(file => {
    const filePath = path.join(docsPath, file);
    const { summary, category } = analyzeDocument(filePath);

    categories[category].push({ file, summary });
  });

  // 生成索引
  Object.entries(categories).forEach(([category, files]) => {
    if (files.length === 0) return;

    index += `\n### ${category}\n\n`;

    files.forEach(({ file, summary }) => {
      index += `- **[${file}](docs/${file})**\n`;
      index += `  - ${summary.purpose}\n`;
      index += `  - 💡 **閱讀理由**: ${summary.reason}\n\n`;
    });
  });

  return index;
}

function analyzeDocument(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath);

  // 提取第一個標題作為目的
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : filename;

  // 提取前 200 字作為摘要
  const plainText = content
    .replace(/^#.+$/gm, '')  // 移除標題
    .replace(/```[\s\S]*?```/g, '')  // 移除代碼塊
    .trim()
    .substring(0, 200);

  // 分類
  let category = '其他';
  if (/GUIDE|指南/i.test(filename)) category = '指南';
  else if (/SPEC|規格|DESIGN/i.test(filename)) category = '規格';
  else if (/ROADMAP|TODO|計畫/i.test(filename)) category = '計畫';

  // 推測閱讀理由
  let reason = '了解專案細節';
  if (category === '指南') reason = '學習如何使用或開發此功能';
  else if (category === '規格') reason = '理解系統設計與架構決策';
  else if (category === '計畫') reason = '追蹤專案進度與未來規劃';

  return {
    summary: {
      purpose: title,
      reason
    },
    category
  };
}

function generateReadmeTemplate() {
  return `# 專案名稱

> 簡短描述這個專案的用途

## 📚 文檔索引

目前沒有文檔。

## 🚀 快速開始

\`\`\`bash
# 安裝依賴
npm install

# 運行專案
npm start
\`\`\`

## 📝 授權

MIT
`;
}

// ============================================
// 6. 分析 Git 變更並推薦操作
// ============================================
function analyzeAndRecommend() {
  try {
    const status = execSync('git status --short', { encoding: 'utf-8', stdio: 'pipe' }).trim();

    if (!status) {
      return {
        hasChanges: false,
        recommendations: ['✅ 沒有變更，可以開始新任務']
      };
    }

    const lines = status.split('\n');
    const stats = { modified: 0, added: 0, untracked: 0 };

    lines.forEach(line => {
      const code = line.substring(0, 2).trim();
      if (code === 'M' || code === 'MM') stats.modified++;
      else if (code === 'A' || code === 'AM') stats.added++;
      else if (code === '??') stats.untracked++;
    });

    const recommendations = [];

    // 推薦 commit
    if (stats.modified + stats.added > 0) {
      const type = stats.added > stats.modified ? 'feat' : 'fix';
      recommendations.push(`📝 建議提交: git add . && git commit -m "${type}: [描述變更]"`);
    }

    // 推薦處理未追蹤文件
    if (stats.untracked > 0) {
      recommendations.push(`📂 有 ${stats.untracked} 個未追蹤檔案，檢查是否需要 .gitignore`);
    }

    return {
      hasChanges: true,
      stats,
      recommendations
    };

  } catch (error) {
    return {
      hasChanges: false,
      recommendations: ['❌ 非 Git 倉庫']
    };
  }
}

// ============================================
// 輔助函數
// ============================================
function findFilesByPattern(dir, pattern, options = {}) {
  const { maxDepth = 2 } = options;
  const results = [];

  function search(currentDir, depth) {
    if (depth > maxDepth) return;

    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });

      entries.forEach(entry => {
        if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'docs') {
          return;
        }

        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
          search(fullPath, depth + 1);
        } else if (entry.isFile() && matchPattern(entry.name, pattern)) {
          results.push(fullPath);
        }
      });
    } catch (error) {
      // 忽略錯誤
    }
  }

  search(dir, 0);
  return results;
}

function matchPattern(filename, pattern) {
  const regexPattern = pattern
    .replace(/\./g, '\\.')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');

  return new RegExp(`^${regexPattern}$`, 'i').test(filename);
}

// ============================================
// 7. Token 使用追蹤
// ============================================
let hookOutputLength = 0;
const originalLog = console.log;

console.log = function(...args) {
  const output = args.join(' ');
  hookOutputLength += output.length;
  return originalLog.apply(console, args);
};

function displayTokenUsage() {
  // 恢復原始 console.log
  console.log = originalLog;

  // 估算本次 Hook 輸出的 Token（字符數 / 4）
  const estimatedHookTokens = Math.ceil(hookOutputLength / 4);

  console.log('\n📊 Token 使用提醒:');
  console.log('   💡 **請定期檢查**: 對話視窗右上角的 Token 計數器');
  console.log('   ⚠️  **建議閾值**: 超過 160,000 tokens (80%) 時開始新對話');
  console.log('   📏 **本次 Hook 輸出**: ~' + estimatedHookTokens + ' tokens (估算)');
  console.log('   🔢 **總預算**: 200,000 tokens');
  console.log('\n   💭 **Token 管理技巧**:');
  console.log('      - 長對話可能累積大量上下文');
  console.log('      - 及時開始新對話可保持回應速度');
  console.log('      - 重要決策記錄在文檔中，避免重複詢問');
}

// ============================================
// 主執行邏輯
// ============================================
(async () => {
  try {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║             🎬 AI 回答完成 - 智能收尾中...                  ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    // 1. 播放音效
    playCompletionSound();

    // 2. 追蹤本次對話創建的文件
    console.log('📋 本次對話文件清單:');
    const sessionFiles = trackSessionFiles();

    if (sessionFiles.created.length > 0) {
      console.log('\n   ✨ 新創建的文件:');
      sessionFiles.created.forEach(file => {
        console.log(`      - ${file}`);
      });
    }

    if (sessionFiles.modified.length > 0) {
      console.log('\n   📝 修改的文件:');
      sessionFiles.modified.forEach(file => {
        console.log(`      - ${file}`);
      });
    }

    if (sessionFiles.created.length === 0 && sessionFiles.modified.length === 0) {
      console.log('   ✅ 沒有新文件或修改');
    }

    // 3. 清理臨時文件
    console.log('\n🧹 清理臨時文件...');
    const cleaned = cleanTemporaryFiles();

    if (cleaned.length > 0) {
      console.log(`   ✅ 已刪除 ${cleaned.length} 個臨時文件:`);
      cleaned.forEach(file => {
        console.log(`      - ${file}`);
      });
    } else {
      console.log('   ✅ 沒有需要清理的臨時文件');
    }

    // 4. 組織文檔
    console.log('\n📁 組織文檔到 docs/ 目錄...');
    const movedDocs = organizeDocs();

    if (movedDocs.length > 0) {
      console.log(`   ✅ 已移動 ${movedDocs.length} 個文檔:`);
      movedDocs.forEach(({ from, to }) => {
        console.log(`      - ${from} → ${to}`);
      });
    } else {
      console.log('   ✅ 根目錄整潔，沒有需要移動的文檔');
    }

    // 5. 更新 README.md
    console.log('\n📖 更新 README.md 文檔索引...');
    const readmeResult = updateReadmeDocIndex(sessionFiles, movedDocs);

    if (readmeResult.created) {
      console.log('   ✅ 已創建 README.md 模板');
    } else if (readmeResult.updated) {
      console.log('   ✅ 已更新文檔索引');
    }

    // 6. 推薦下一步操作
    console.log('\n💡 智能推薦下一步:');
    const analysis = analyzeAndRecommend();
    analysis.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });

    console.log('\n' + '='.repeat(64));
    console.log('✨ 收尾完成！目錄整潔，文檔已組織。');

    // 7. 顯示 Token 使用統計
    displayTokenUsage();

  } catch (error) {
    console.error('❌ Stop Hook 執行錯誤:', error.message);
    process.exit(1);
  }
})();
