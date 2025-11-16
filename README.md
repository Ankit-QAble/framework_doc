# Documentation Site

This is a static documentation site configured for Netlify deployment.

## Structure

- `docs/` - Documentation files in Markdown format
- `index.html` - Main landing page
- `netlify.toml` - Netlify configuration

## Local Development

To serve the site locally:

```bash
npm install
npm run serve
```

Or use any static file server:

```bash
npx serve .
```

## Deployment

This site is configured for Netlify. Simply connect your repository to Netlify and it will automatically deploy.

The `netlify.toml` file contains the deployment configuration:
- No build step required (static site)
- Publish directory: root directory (`.`)
- Node version: 20

## Documentation

All documentation files are located in the `docs/` directory. They are written in Markdown format and can be viewed directly or converted to HTML as needed.
