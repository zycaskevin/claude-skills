#!/usr/bin/env node
// pre-tool-use.js - 工具使用前安全檢查 Hook
// 觸發時機：AI 執行 Bash 命令或寫入文件之前

const fs = require('fs');

// ============================================
// 讀取 Hook 輸入（從 stdin）
// ============================================
function readStdin() {
  return new Promise((resolve, reject) => {
    let inputData = '';

    process.stdin.setEncoding('utf8');

    process.stdin.on('data', (chunk) => {
      inputData += chunk;
    });

    process.stdin.on('end', () => {
      try {
        const hookData = JSON.parse(inputData);
        resolve(hookData);
      } catch (error) {
        reject(new Error(`JSON 解析失敗: ${error.message}\nInput: ${inputData}`));
      }
    });

    process.stdin.on('error', (error) => {
      reject(error);
    });
  });
}

// ============================================
// 主執行邏輯
// ============================================
(async () => {
  try {
    const hookData = await readStdin();
    const result = analyzeSafety(hookData);

    // 輸出結果（JSON 格式）
    console.log(JSON.stringify(result));

    // 退出碼：block=1, warn/allow=0
    // 注意：warn 也返回 0，由 Claude Code 決定是否詢問用戶
    process.exit(result.decision === 'block' ? 1 : 0);
  } catch (error) {
    console.log(JSON.stringify({
      decision: 'block',
      reason: `Hook 執行錯誤: ${error.message}`
    }));
    process.exit(1);
  }
})();

// ============================================
// 1. 危險命令黑名單（直接阻止）
// ============================================
const dangerousPatterns = [
  // 文件系統破壞
  /rm\s+(-rf?|--recursive)\s*\/\s*[^\/\s]*/i,  // rm -rf / 及變體
  /rm\s+(-rf?|--recursive)\s*(\/|~|\\)/i,       // rm -rf 根目錄
  /del\s+\/[sS]\s+[cC]:\\/i,                    // Windows: del /S C:\

  // 數據庫破壞
  /drop\s+(database|table|schema)\s+/i,         // SQL 刪除
  /truncate\s+table\s+/i,                       // 清空表

  // 磁盤格式化
  /format\s+[a-zA-Z]:/i,                        // Windows 格式化
  /mkfs\./i,                                    // Linux 格式化

  // 寫入磁盤設備
  />\s*\/dev\/(sda|sdb|nvme)/i,                 // 直接寫入磁盤
  /dd\s+.*of=\/dev\//i,                         // dd 寫入磁盤

  // 權限提升
  /sudo\s+su\s*$/i,                             // 切換到 root
  /chmod\s+777\s+\//i,                          // 全局權限開放

  // 惡意下載執行
  /curl.*\|\s*bash/i,                           // curl | bash
  /wget.*\|\s*sh/i,                             // wget | sh

  // Fork 炸彈
  /:\(\)\s*\{\s*:\|:&\s*\};:/,                  // :(){ :|:& };:
];

// ============================================
// 2. 敏感操作黃名單（警告但允許）
// ============================================
const sensitivePatterns = [
  // 文件刪除
  { pattern: /rm\s+-rf?\s+[^\s]+/i, msg: '刪除文件/目錄' },
  { pattern: /del\s+\/[sS]\s+/i, msg: 'Windows 批量刪除' },

  // 系統配置修改
  { pattern: /\/etc\/(passwd|shadow|sudoers|hosts)/i, msg: '修改系統配置文件' },
  { pattern: /registry\s+add/i, msg: '修改 Windows 註冊表' },

  // 網絡操作
  { pattern: /iptables/i, msg: '修改防火牆規則' },
  { pattern: /netsh/i, msg: 'Windows 網絡配置' },

  // 環境變量
  { pattern: /export\s+PATH=/i, msg: '修改 PATH 環境變量' },
  { pattern: /setx/i, msg: 'Windows 永久環境變量' },

  // Git 危險操作
  { pattern: /git\s+push\s+.*--force/i, msg: 'Git 強制推送' },
  { pattern: /git\s+reset\s+--hard\s+HEAD/i, msg: 'Git 硬重置' },

  // 包管理器全局安裝
  { pattern: /npm\s+install\s+-g/i, msg: 'NPM 全局安裝' },
  { pattern: /pip\s+install\s+.*--break-system-packages/i, msg: 'Pip 系統包安裝' },
];

// ============================================
// 3. 受保護的關鍵文件
// ============================================
const protectedFiles = [
  /\.git\/config$/i,
  /package\.json$/i,
  /\.env$/i,
  /\.ssh\/(id_rsa|config)$/i,
  /CLAUDE\.md$/i,
  /settings\.json$/i,
];

// ============================================
// 4. 安全分析主邏輯
// ============================================
function analyzeSafety(hookData) {
  const { tool, parameters } = hookData;

  // 4.1 Bash 命令檢查
  if (tool === 'Bash' && parameters.command) {
    const command = parameters.command;

    // 檢查危險命令（直接阻止）
    for (const pattern of dangerousPatterns) {
      if (pattern.test(command)) {
        return {
          decision: 'block',
          reason: `🚨 檢測到危險命令，已阻止執行！\n\n` +
                  `命令: ${command}\n` +
                  `威脅等級: 🔴 極高\n` +
                  `匹配模式: ${pattern}\n\n` +
                  `⚠️ 此命令可能導致：\n` +
                  `- 系統文件損壞\n` +
                  `- 數據永久丟失\n` +
                  `- 磁盤格式化\n\n` +
                  `如果您確定要執行，請手動在終端運行。`
        };
      }
    }

    // 檢查敏感操作（警告）
    for (const { pattern, msg } of sensitivePatterns) {
      if (pattern.test(command)) {
        return {
          decision: 'warn',
          reason: `⚠️ 敏感操作警告\n\n` +
                  `操作類型: ${msg}\n` +
                  `命令: ${command}\n` +
                  `威脅等級: 🟡 中等\n\n` +
                  `建議：\n` +
                  `- 仔細檢查命令參數\n` +
                  `- 確保已備份重要數據\n` +
                  `- 考慮使用 --dry-run 預覽結果\n\n` +
                  `繼續執行請回覆 "yes"，取消請回覆 "no"。`
        };
      }
    }
  }

  // 4.2 寫入文件檢查
  if ((tool === 'Write' || tool === 'Edit') && parameters.file_path) {
    const filePath = parameters.file_path;

    // 檢查受保護文件
    for (const pattern of protectedFiles) {
      if (pattern.test(filePath)) {
        return {
          decision: 'warn',
          reason: `⚠️ 受保護文件警告\n\n` +
                  `文件: ${filePath}\n` +
                  `操作: ${tool}\n` +
                  `保護原因: 關鍵配置文件\n\n` +
                  `建議：\n` +
                  `- 確認修改內容正確\n` +
                  `- 建議先備份原文件\n` +
                  `- 考慮使用 Git 版本控制\n\n` +
                  `繼續執行請回覆 "yes"，取消請回覆 "no"。`
        };
      }
    }

    // 檢查寫入系統目錄
    if (/^(\/etc\/|\/sys\/|\/proc\/|C:\\Windows\\)/i.test(filePath)) {
      return {
        decision: 'block',
        reason: `🚨 禁止寫入系統目錄！\n\n` +
                `目標路徑: ${filePath}\n` +
                `威脅等級: 🔴 極高\n\n` +
                `此操作可能導致：\n` +
                `- 系統不穩定\n` +
                `- 安全漏洞\n` +
                `- 無法恢復的損壞\n\n` +
                `請在用戶空間進行操作。`
      };
    }
  }

  // 4.3 其他工具安全檢查
  if (tool === 'Bash' && parameters.dangerouslyDisableSandbox) {
    return {
      decision: 'warn',
      reason: `⚠️ 檢測到沙盒禁用請求\n\n` +
              `參數: dangerouslyDisableSandbox = true\n` +
              `威脅等級: 🟠 高\n\n` +
              `這將允許命令訪問：\n` +
              `- 完整文件系統\n` +
              `- 網絡資源\n` +
              `- 系統進程\n\n` +
              `確保命令來源可信！`
    };
  }

  // 通過所有檢查
  return {
    decision: 'allow',
    reason: '✅ 操作已通過安全檢查'
  };
}

// ============================================
// 5. 安全統計（可選）
// ============================================
function logSecurityEvent(decision, tool, details) {
  const logFile = '.claude/hooks/security.log';
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${decision.toUpperCase()} - ${tool} - ${details}\n`;

  try {
    fs.appendFileSync(logFile, logEntry);
  } catch (error) {
    // 日誌寫入失敗不影響主流程
  }
}

// 測試時禁用日誌（避免未使用警告）
// 生產環境可在 analyzeSafety 中調用：
// logSecurityEvent(result.decision, hookData.tool, JSON.stringify(hookData.parameters));
