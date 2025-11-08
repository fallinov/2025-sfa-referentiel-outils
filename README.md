# Nuxt Starter Template

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)

Use this template to get started with [Nuxt UI](https://ui.nuxt.com) quickly.

- [Live demo](https://starter-template.nuxt.dev/)
- [Documentation](https://ui.nuxt.com/docs/getting-started/installation/nuxt)

<a href="https://starter-template.nuxt.dev/" target="_blank">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://ui.nuxt.com/assets/templates/nuxt/starter-dark.png">
    <source media="(prefers-color-scheme: light)" srcset="https://ui.nuxt.com/assets/templates/nuxt/starter-light.png">
    <img alt="Nuxt Starter Template" src="https://ui.nuxt.com/assets/templates/nuxt/starter-light.png">
  </picture>
</a>

> The starter template for Vue is on https://github.com/nuxt-ui-templates/starter-vue.

## Quick Start

```bash [Terminal]
npm create nuxt@latest -- -t github:nuxt-ui-templates/starter
```

## Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-name=starter&repository-url=https%3A%2F%2Fgithub.com%2Fnuxt-ui-templates%2Fstarter&demo-image=https%3A%2F%2Fui.nuxt.com%2Fassets%2Ftemplates%2Fnuxt%2Fstarter-dark.png&demo-url=https%3A%2F%2Fstarter-template.nuxt.dev%2F&demo-title=Nuxt%20Starter%20Template&demo-description=A%20minimal%20template%20to%20get%20started%20with%20Nuxt%20UI.)

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## 🚀 Deployment Strategy (DevOps)

This project uses a **trunk-based development** workflow with automated deployments to two environments:

### **Environments**

| Environment | URL | Trigger | Deployment |
|-------------|-----|---------|------------|
| **Staging** | https://fallinov.github.io/2025-sfa-referentiel-outils/ | Push to `main` | GitHub Pages (automatic) |
| **Production** | Your production domain | Release/Tag (e.g., `v1.0.0`) | SFTP (automatic) |

### **Workflow**

```
1. Development
   ↓ git push origin main
2. Staging (GitHub Pages)
   ↓ Test & validate
3. Create release (v1.0.0)
   ↓ Automatic deployment
4. Production (SFTP)
```

### **Commands**

```bash
# Generate for GitHub Pages (staging)
pnpm run generate:github

# Generate for production (root domain)
pnpm run generate:prod

# Standard generate (uses env var or defaults to root)
pnpm run generate
```

### **Creating a Release**

To deploy to production:

```bash
# 1. Tag the release
git tag v1.0.0
git push origin v1.0.0

# 2. Create a GitHub release
# Go to: https://github.com/fallinov/2025-sfa-referentiel-outils/releases/new
# Or use GitHub CLI:
gh release create v1.0.0 --title "Release v1.0.0" --notes "Description of changes"
```

The SFTP deployment will trigger automatically.

### **Configuration Required**

For SFTP deployment to work, configure these **GitHub Secrets**:

1. Go to `Settings` → `Secrets and variables` → `Actions`
2. Add the following secrets:
   - `SFTP_SERVER`: Your SFTP server hostname
   - `SFTP_USERNAME`: SFTP username
   - `SFTP_PASSWORD`: SFTP password
   - `SFTP_PORT`: SFTP port (optional, defaults to 21)
   - `SFTP_SERVER_DIR`: Target directory on server (e.g., `/public_html/`)

Optional: Set `PRODUCTION_URL` variable for environment link.

### **Manual Deployment**

If you prefer manual SFTP upload:

```bash
# Generate the site
pnpm run generate:prod

# Upload the .output/public/ folder to your server via:
# - FileZilla, Cyberduck, or your preferred SFTP client
# - Or use the GitHub Actions workflow_dispatch manually
```
