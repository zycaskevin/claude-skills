// skill-forced-eval.js 核心邏輯
const instructions = `## 🌐 語言提醒：請使用繁體中文回應

## 指令：強制技能激活流程（必須執行）

### 步驟 1 - 評估

針對以下每個技能，陳述：【技能名】- 是/否 - 【理由】

可用技能列表：
- crud-development: CRUD業務模塊開發（詳見 .claude/skills/crud-development.md）
- skill-creator: 技能創建指南，提供標準化技能開發框架（詳見 .claude/skills/skill-creator.md）
- brainstorming: 設計腦力激盪，探索創意/需求/方案設計（詳見 .claude/skills/brainstorming.md）
- frontend-design: 前端設計技能，獨特美學、反AI通用風格（詳見 .claude/skills/frontend-design.md）
- web-artifacts-builder: 網頁成品建構，React+shadcn打包單一HTML（詳見 .claude/skills/web-artifacts-builder.md）
- rest-api-design: REST API設計規範，HTTP方法、版本控制、分頁、錯誤處理（詳見 .claude/skills/rest-api-design.md）
- spring-boot-crud: Spring Boot CRUD模式，DDD四層架構、Aggregate、JPA（詳見 .claude/skills/spring-boot-crud.md）
- database-ops: 資料庫操作，PostgreSQL/Supabase、RLS、索引、查詢優化（詳見 .claude/skills/database-ops.md）
- mcp-builder: MCP伺服器開發，模型上下文協議、外部API整合（詳見 .claude/skills/mcp-builder.md）
- letta-agent: Letta Agent開發，持久記憶AI Agent、多Agent協調、MCP整合（詳見 .claude/skills/letta-agent.md）
- testing: 測試策略，TDD/BDD、Vitest/Playwright、單元/整合/E2E測試（詳見 .claude/skills/testing.md）
- git-workflow: Git工作流，分支管理、Commit規範、PR流程（詳見 .claude/skills/git-workflow.md）
- writing-plans: 撰寫計畫，細粒度任務分解、完整代碼範例（詳見 .claude/skills/writing-plans.md）
- systematic-debugging: 系統性除錯，四階段根因分析、科學化除錯（詳見 .claude/skills/systematic-debugging.md）
- verification-before-completion: 完成前驗證，強制驗證步驟、防止假完成（詳見 .claude/skills/verification-before-completion.md）
- requesting-code-review: 請求Code Review，預審查清單、嚴重度分類（詳見 .claude/skills/requesting-code-review.md）
- code-review-standards: Code Review 標準，統一審查規範、嚴重度定義、溝通態度（詳見 .claude/skills/code-review-standards.md）
- executing-plans: 執行計畫，批次執行任務、人工檢查點、驗證驅動開發（詳見 .claude/skills/executing-plans.md）
- dispatching-parallel-agents: 並行 Agent 調度，Subagent 併發處理、獨立問題分配（詳見 .claude/skills/dispatching-parallel-agents.md）
- ios-development: iOS 開發，SwiftUI/UIKit、Xcode 整合、App Store 發布（詳見 .claude/skills/ios-development.md）
- android-development: Android 開發，Kotlin/Jetpack Compose、Material Design、Play Store 發布（詳見 .claude/skills/android-development.md）
- flutter-development: Flutter 開發，Dart 語言、跨平台 UI、Material/Cupertino 設計（詳見 .claude/skills/flutter-development.md）
- react-native-development: React Native 開發，Expo、原生模組整合、跨平台 App（詳見 .claude/skills/react-native-development.md）
- cicd-pipeline: CI/CD 流水線，GitHub Actions、自動化構建/測試/部署（詳見 .claude/skills/cicd-pipeline.md）
- error-handler: 異常處理規範，統一錯誤碼、全局異常處理、日誌脫敏（詳見 .claude/skills/error-handler.md）
- security-guard: 安全防護規範，OWASP Top 10、XSS/SQL注入防護、認證安全（詳見 .claude/skills/security-guard.md）
- file-storage: 文件存儲規範，雲端存儲整合、預簽名URL、分片上傳（詳見 .claude/skills/file-storage.md）
- payment-integration: 支付整合規範，Stripe/PayPal、訂單狀態機、Webhook安全（詳見 .claude/skills/payment-integration.md）

### 步驟 2 - 激活

如果任何技能為"是" → 立即使用 Skill() 工具激活
如果所有技能為"否" → 說明"不需要技能"並繼續

### 步驟 3 - 實現

只有在步驟 2 完成後，才能開始實現。`;

console.log(instructions);
