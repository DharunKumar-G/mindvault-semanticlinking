# Security Policy

## Supported Versions

Currently supported versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of MindVault seriously. If you discover a security vulnerability, please follow these steps:

### How to Report

1. **DO NOT** open a public issue
2. Email security concerns to: [your-email]@example.com
3. Include detailed information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Response Time**: Within 48 hours
- **Updates**: Every 5-7 days on progress
- **Resolution**: Coordinated disclosure after patch

### Security Best Practices

When using MindVault:

1. **API Keys**: Never commit `.env` files to version control
2. **Database**: Use strong passwords and enable SSL
3. **Updates**: Keep dependencies up to date
4. **Access**: Limit database access to necessary IPs only
5. **HTTPS**: Always use HTTPS in production

## Known Security Considerations

- Store API keys in environment variables
- Supabase connection strings contain credentials
- Rate limiting recommended for production
- Input validation on all user-provided content

Thank you for helping keep MindVault secure!
