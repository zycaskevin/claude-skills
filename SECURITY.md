# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability within this project, please follow these steps:

### 1. Do NOT Create a Public Issue

Security vulnerabilities should **not** be reported through public GitHub issues.

### 2. Report Privately

Send a detailed report to the maintainers via:
- **GitHub Security Advisories**: [Report a vulnerability](https://github.com/zycaskevin/claude-skills/security/advisories/new)
- **Email**: Create a private security advisory on GitHub

### 3. Include in Your Report

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### 4. Response Timeline

| Action | Timeline |
|--------|----------|
| Initial response | Within 48 hours |
| Status update | Within 7 days |
| Fix release | Depends on severity |

## Security Best Practices

When using this project, please follow these security guidelines:

### For Hooks

1. **Review before use**: Always review hook code before enabling
2. **Don't disable security checks**: The `pre-tool-use.js` hook blocks dangerous commands for a reason
3. **Keep updated**: Security patches are released as needed

### For Skills

1. **API Keys**: Never hardcode real API keys in skill files
2. **Environment Variables**: Use environment variables for sensitive data
3. **Code Review**: Review generated code before execution

### Built-in Security Features

This project includes several security features:

#### Command Blocking (`pre-tool-use.js`)

```javascript
// Blocked commands (exit 1)
- rm -rf /
- drop database
- format C:
- curl | bash
- :(){ :|:& };:  // Fork bomb

// Warning commands (logged but allowed)
- rm -rf node_modules
- git push --force
- Writing to .env files
```

#### Best Practices Enforcement

- TDD workflow enforcement
- Code review requirements
- Verification before completion

## Acknowledgments

We appreciate responsible disclosure and will acknowledge security researchers who help us improve this project.

---

**Last Updated**: 2025-12-27
