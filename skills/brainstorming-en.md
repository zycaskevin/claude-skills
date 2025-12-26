# Brainstorming Skill

> **Skill ID**: brainstorming-en
> **Version**: v2.0 (Phase 2 Advanced Features)
> **Purpose**: Explore ideas, requirements, and design solutions before implementation
> **Token Budget**: ~4,800 words (~1,200 tokens)
> **New Features**: Auto-generated architecture diagrams, AI quality assessment, multilingual support

---

## 🎯 Trigger Conditions

### Keywords

```
brainstorm, brainstorming, idea, creative design, solution design,
architecture design, requirements analysis, explore ideas
```

### Use Cases

1. **Before creative work**: "I want to design a new feature"
2. **Unclear requirements**: "Not sure how to implement this"
3. **Multiple solution options**: "Which approach is best?"

---

## 🏗️ Core Workflow

### Stage 1: Understand Intent

**Goal**: Understand requirements through one question at a time

**Checklist**:
- [ ] Current project status (Git status, files, documentation)
- [ ] Understand purpose (Why build this?)
- [ ] Understand constraints (Tech stack, timeline, budget)
- [ ] Understand success criteria (How to measure success?)

**Question Pattern** (prefer multiple choice):

```markdown
## Question [N]: [Short Title]

[Question Description]

**A. [Option 1]** (Recommended/if applicable)
- [Description]
- **Pros**: ...
- **Cons**: ...

**B. [Option 2]**
- [Description]
- **Pros**: ...
- **Cons**: ...

Which would you prefer? (Or do you have other ideas?)
```

---

### Stage 2: Explore Solutions

**Goal**: Propose 2-3 solutions with trade-off analysis

**Solution Template**:

```markdown
## Solution Exploration

### Solution A: [Name] (Recommended)
**Core Idea**: ...
**Tech Stack**: ...
**Pros**:
- ...
**Cons**:
- ...
**Use Case**: ...

### Solution B: [Name]
...

---

## Recommended Solution: A
**Rationale**: ...
```

**YAGNI Principle**:
- ❌ Remove features that "might be needed in the future"
- ✅ Keep only features that are "definitely needed now"
- 📝 Document removed ideas for future reference

---

### Stage 3: Design Confirmation

**Goal**: Present design in sections, confirm after each

**Design Sections** (200-300 words each):

1. **Architecture Overview**
   - System components
   - Data flow
   - Key interfaces

2. **Core Components**
   - Component A
   - Component B
   - Component C

3. **Data Flow & State Management**
   - Input → Processing → Output
   - State change logic

4. **Error Handling & Edge Cases**
   - Common error scenarios
   - Handling strategies

5. **Testing Strategy**
   - Unit tests
   - Integration tests
   - E2E tests

**Confirmation Method**:
Ask after each section: "Does this look right? Need any adjustments?"

---

### Stage 3.5: Auto-Generated Architecture Diagrams (NEW in v2.0)

**Goal**: Automatically generate Mermaid diagrams after design confirmation

**Supported Diagram Types**:

1. **System Architecture** (Flowchart)

   ```mermaid
   flowchart TD
       A[Frontend UI] --> B[Controller]
       B --> C[Service]
       C --> D[DAO]
       D --> E[Database]
   ```

2. **Process Flow** (Sequence Diagram)

   ```mermaid
   sequenceDiagram
       User->>Controller: HTTP Request
       Controller->>Service: Business Logic
       Service->>DAO: Data Query
       DAO->>Database: SQL
       Database-->>DAO: Results
       DAO-->>Service: Entity
       Service-->>Controller: DTO
       Controller-->>User: JSON Response
   ```

3. **Class Diagram**

   ```mermaid
   classDiagram
       class UserEntity {
           +Long id
           +String username
           +String email
       }
       class UserService {
           +register()
           +login()
       }
       UserService --> UserEntity
   ```

**Auto-Generation Logic**:

```javascript
// Step 1: Analyze design document
const components = extractComponents(designDoc)
const dataFlow = extractDataFlow(designDoc)

// Step 2: Choose appropriate diagram type
if (designDoc.includes("architecture")) {
    generateFlowchart(components)
} else if (designDoc.includes("process")) {
    generateSequenceDiagram(dataFlow)
} else if (designDoc.includes("class")) {
    generateClassDiagram(components)
}

// Step 3: Insert into design document
insertDiagram(designDoc, mermaidCode)
```

**Completion Message**:

```
✅ Architecture diagram generated!

📊 Diagram Type: Flowchart (System Architecture)
📏 Component Count: 5
📝 Inserted into: docs/plans/YYYY-MM-DD-<topic>-design.md
```

---

### Stage 3.6: AI Design Quality Assessment + Red Team Review (NEW in v2.0)

**Goal**: Automatically assess design quality using AI and identify potential issues through red team thinking

#### Quality Assessment (10 Dimensions)

| Dimension | Criteria | Weight |
| --------- | -------- | ------ |
| **Scalability** | Easy to add new features? | 15% |
| **Maintainability** | Code easy to understand and modify? | 15% |
| **Performance** | Performance bottlenecks considered? | 10% |
| **Security** | Security vulnerabilities? | 20% |
| **Testability** | Easy to write tests? | 10% |
| **Error Handling** | Edge cases covered? | 10% |
| **Resource Usage** | Memory/CPU/Network usage? | 5% |
| **User Experience** | Response time/Usability? | 5% |
| **Documentation** | Design docs clear? | 5% |
| **Technical Debt** | Introduces tech debt? | 5% |

**Evaluation Logic**:

```javascript
// Auto-evaluation function
function evaluateDesign(designDoc) {
    const scores = {
        scalability: analyzeScalability(designDoc),
        maintainability: analyzeMaintainability(designDoc),
        performance: analyzePerformance(designDoc),
        security: analyzeSecurity(designDoc),
        testability: analyzeTestability(designDoc),
        errorHandling: analyzeErrorHandling(designDoc),
        resourceUsage: analyzeResources(designDoc),
        userExperience: analyzeUX(designDoc),
        documentation: analyzeDocumentation(designDoc),
        technicalDebt: analyzeTechnicalDebt(designDoc)
    }

    // Calculate weighted score
    const totalScore = calculateWeightedScore(scores)

    return {
        totalScore: totalScore,  // 0-100
        breakdown: scores,
        recommendations: generateRecommendations(scores)
    }
}
```

#### Red Team Thinking Review

**Attack Surface Analysis**:

1. **Security Vulnerabilities**
   - SQL injection risks
   - XSS attack possibilities
   - CSRF protection complete
   - Authentication/Authorization flaws

2. **Performance Attacks**
   - DDoS protection
   - Resource exhaustion attacks
   - Slow query attacks

3. **Data Security**
   - Sensitive data leakage
   - Excessive logging
   - Backup strategy security

4. **Business Logic Flaws**
   - Race conditions
   - Privilege escalation
   - Business rule bypasses

**Red Team Review Logic**:

```javascript
function redTeamReview(designDoc) {
    const vulnerabilities = []

    // 1. Scan for SQL injection
    if (designDoc.includes("dynamic SQL") && !designDoc.includes("parameterized")) {
        vulnerabilities.push({
            type: "SQL Injection",
            severity: "High",
            description: "Using dynamic SQL without parameterized queries",
            recommendation: "Use PreparedStatement or ORM framework"
        })
    }

    // 2. Scan for authentication flaws
    if (designDoc.includes("JWT") && !designDoc.includes("blacklist")) {
        vulnerabilities.push({
            type: "Authentication Bypass",
            severity: "Medium",
            description: "Incomplete JWT logout mechanism",
            recommendation: "Implement Token blacklist"
        })
    }

    // 3. Scan for performance risks
    if (designDoc.includes("loop") && designDoc.includes("database query")) {
        vulnerabilities.push({
            type: "N+1 Query Problem",
            severity: "Medium",
            description: "Possible N+1 query issue",
            recommendation: "Use batch queries or JOIN"
        })
    }

    return {
        totalVulnerabilities: vulnerabilities.length,
        criticalCount: vulnerabilities.filter(v => v.severity === "High").length,
        details: vulnerabilities
    }
}
```

**Assessment Report Format**:

````markdown
## 🔍 AI Design Quality Assessment Report

### Overall Score: 78/100 (Good)

**Score Distribution**:
```
Scalability:     ████████░░ 80/100
Maintainability: ███████░░░ 70/100
Performance:     ██████████ 100/100
Security:        ██████░░░░ 60/100 ⚠️
Testability:     █████████░ 90/100
Error Handling:  ███████░░░ 70/100
Resource Usage:  ████████░░ 80/100
User Experience: █████████░ 90/100
Documentation:   ████████░░ 80/100
Technical Debt:  ████████░░ 80/100
```

---

## 🛡️ Red Team Review Results

**Vulnerabilities Found**: 3
**Severity Distribution**: High (1), Medium (2), Low (0)

### Critical Vulnerabilities

**1. SQL Injection Risk**
- **Severity**: High
- **Location**: DAO layer query building
- **Description**: Using dynamic SQL without parameterized queries
- **Recommendation**: Use PreparedStatement or MyBatis-Plus LambdaQueryWrapper

### Medium Vulnerabilities

**2. Incomplete JWT Logout**
- **Severity**: Medium
- **Location**: AuthenticationService.logout()
- **Description**: Token still valid after logout
- **Recommendation**: Implement Redis Token blacklist

**3. N+1 Query Problem**
- **Severity**: Medium
- **Location**: UserService.getOrderHistory()
- **Description**: Database queries in loop
- **Recommendation**: Use batch queries or LEFT JOIN

---

## 💡 Improvement Recommendations (Prioritized)

### 🔴 Urgent (Must Fix)
1. **Fix SQL Injection Risk**
   - Convert all dynamic SQL to parameterized queries
   - Use MyBatis-Plus Wrapper instead of SQL concatenation

### 🟡 Important (Should Fix)
2. **Complete JWT Logout Mechanism**
   - Introduce Redis for Token blacklist
   - Set blacklist TTL = Token expiry

3. **Optimize N+1 Queries**
   - Refactor getOrderHistory() to use batch queries
   - Consider @BatchSize or custom queries

### 🟢 Optional (Future Optimization)
4. **Increase Error Handling Coverage**
   - Add edge case handling
   - Add retry mechanisms

---

## 📈 Trend Analysis

Compared to similar designs:
- Security: **Below Average** (60 vs 75)
- Performance: **Above Average** (100 vs 85)
- Maintainability: **Average** (70 vs 70)
````

**Completion Message**:

```
✅ AI Quality Assessment Complete!

📊 Overall Score: 78/100 (Good)
🛡️ Vulnerabilities Found: 3 (High: 1, Medium: 2)
💡 Recommendations: 4 (Urgent: 1, Important: 2, Optional: 1)
📄 Full report inserted into design document
```

---

### Stage 4: Automated Execution

**File Generation**:

```bash
docs/plans/YYYY-MM-DD-<topic>-design.md
```

**Content Structure**:

```markdown
# [Topic] Design Document

**Date**: YYYY-MM-DD
**Status**: Design Complete
**Skill**: brainstorming

---

## 1. Requirements Understanding
[Stage 1 conclusions]

## 2. Solution Exploration
[Stage 2 solutions (2-3 options)]

## 3. Final Design
[Stage 3 complete design]

## 4. Architecture Diagrams
[Auto-generated Mermaid diagrams]

## 5. Quality Assessment
[AI evaluation report + Red team review]

## 6. Next Steps
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3
```

**Git Automation**:

```bash
git add docs/plans/YYYY-MM-DD-<topic>-design.md
git commit -m "docs(brainstorming): Complete [topic] design document

- Explored [N] solutions
- Selected solution: [solution name]
- Covers: architecture/components/data-flow/testing
- Quality score: [score]/100
- Vulnerabilities: [count]

🧠 Generated via Brainstorming Skill"
```

**Stop Hook Trigger**:

- Organize docs/plans/ directory
- Update project README
- Record token usage

**Completion Message**:

```
✅ Brainstorming Complete!

📄 Design Document: docs/plans/YYYY-MM-DD-<topic>-design.md
🎯 Git commit: [commit hash]
📊 Token Usage: [X] tokens
🎨 Diagrams: [count] generated
📈 Quality Score: [score]/100

Next Steps: Start implementation (recommend TDD workflow)
```

---

## ❌ Prohibitions

| Prohibited Behavior | Correct Approach |
| ------------------- | ---------------- |
| ❌ Ask multiple questions at once | ✅ One question at a time |
| ❌ Give single solution directly | ✅ Provide 2-3 solution comparison |
| ❌ Show entire design at once | ✅ Present in sections, confirm each |
| ❌ Manual Git commit creation | ✅ Automated Git operations |
| ❌ Keep "might need" features | ✅ Strictly apply YAGNI principle |

---

## ✅ Self-Check Checklist

### Stage 1: Understand Intent

- [ ] Ask one question at a time
- [ ] Prefer multiple choice questions
- [ ] Understand purpose, constraints, success criteria

### Stage 2: Explore Solutions

- [ ] Propose 2-3 solutions
- [ ] Each solution has trade-off analysis
- [ ] Clearly recommend solution + rationale
- [ ] Apply YAGNI principle

### Stage 3: Design Confirmation

- [ ] Each section 200-300 words
- [ ] Confirm after each section
- [ ] Cover 5 core chapters

### Stage 3.5: Architecture Diagrams (NEW)

- [ ] Auto-generate appropriate diagram type
- [ ] Diagrams inserted into design doc
- [ ] Mermaid syntax validated

### Stage 3.6: Quality Assessment (NEW)

- [ ] Run 10-dimension evaluation
- [ ] Execute red team review
- [ ] Generate improvement recommendations
- [ ] Include assessment report in doc

### Stage 4: Automated Execution

- [ ] File written to docs/plans/
- [ ] Git commit auto-executed
- [ ] Stop hook auto-triggered
- [ ] Completion message clear

---

## 💡 Memory Mnemonic

```
Understand intent one by one, multiple choice preferred
Explore two to three solutions, trade-offs analyzed YAGNI clear
Design confirmed section by section, confirm each without rush
Auto-execute Hook integrated, docs and Git in one flow
```

---

## 📚 Reference Resources

**Hook Integration**:

- `.claude/hooks/stop.js` - Auto-trigger point
- `.claude/hooks/skill-forced-eval.js` - Skill activation

**Git Standards**:

- [Conventional Commits](https://www.conventionalcommits.org/)
- `.claude/hooks/user-prompt-submit.js` - Commit format validation

**Design Templates**:

- `docs/plans/` - Historical design docs reference
- `.claude/skills/references/brainstorming-example-design.md` - Complete example
- `EvoMem` - Query similar design experiences

**Automation Scripts**:

- `.claude/skills/scripts/brainstorming-commit.sh` - Git auto-commit script

---

**Version**: v2.0
**Changes**: Deep Hook integration, Git automation, Token optimization, Architecture diagrams, AI quality assessment, Multilingual support
**Maintainer**: Claude Code + zycaskevin
**Last Updated**: 2025-12-26
