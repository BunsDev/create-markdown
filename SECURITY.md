# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of create-markdown seriously. If you discover a security vulnerability, please follow these steps:

### How to Report

1. **Do not** open a public GitHub issue for security vulnerabilities
2. Email your findings to **val@viewdue.ai** (replace with your actual security email)
3. Alternatively, use [GitHub's private vulnerability reporting](https://github.com/BunsDev/create-markdown/security/advisories/new)

### What to Include

Please provide as much information as possible to help us understand and resolve the issue:

- Type of vulnerability (e.g., XSS, injection, denial of service)
- Full paths of affected source files
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if available)
- Impact assessment and potential severity

### What to Expect

- **Initial Response**: We will acknowledge receipt of your report within 48 hours
- **Status Updates**: We will keep you informed of our progress toward a fix
- **Resolution Timeline**: We aim to resolve critical vulnerabilities within 7 days
- **Disclosure**: We will coordinate with you on the timing of public disclosure

### Safe Harbor

We consider security research conducted in accordance with this policy to be:

- Authorized concerning any applicable anti-hacking laws
- Authorized concerning any relevant anti-circumvention laws
- Exempt from restrictions in our Terms of Service that would interfere with conducting security research

We will not pursue civil action or initiate a complaint to law enforcement for accidental, good-faith violations of this policy.

## Security Best Practices

When using create-markdown in your projects:

1. **Sanitize User Input**: Always sanitize markdown content from untrusted sources before rendering
2. **Keep Dependencies Updated**: Regularly update to the latest version to receive security patches
3. **Content Security Policy**: Implement appropriate CSP headers when rendering markdown in browsers
4. **Review Generated HTML**: Be cautious with HTML output, especially when allowing raw HTML in markdown

## Acknowledgments

We appreciate the security research community's efforts in helping keep create-markdown secure. Contributors who report valid security issues will be acknowledged here (with their permission).