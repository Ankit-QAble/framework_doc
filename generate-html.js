const fs = require('fs');
const path = require('path');

// Template for HTML files
const htmlTemplate = (title, mdPath, sidebarSection = '', depth = '') => {
    const stylesPath = depth + 'styles.css';
    const indexPath = depth + 'index.html';
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Playwright TypeScript Framework Documentation</title>
    <link rel="stylesheet" href="${stylesPath}">
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
</head>
<body>
    <header>
        <div class="container">
            <h1><a href="${indexPath}">Playwright TypeScript Framework Documentation</a></h1>
        </div>
    </header>
    <div class="container">
        <div class="content">
            <nav class="sidebar">
                <h2>Documentation</h2>
                <ul>
                    <li><a href="${indexPath}">Home</a></li>
                    <li><a href="${depth}intro.html">Introduction</a></li>
                    <li><a href="${depth}getting-started.html">Getting Started</a></li>
                    <li><a href="${depth}azure.html">Azure</a></li>
                    <li><a href="${depth}browserstack.html">BrowserStack</a></li>
                    <li><a href="${depth}github-actions.html">GitHub Actions</a></li>
                    <li><a href="${depth}grid.html">Grid Setup</a></li>
                    <li><a href="${depth}examples.html">Examples</a></li>
                    <li><a href="${depth}troubleshooting.html">Troubleshooting</a></li>
                </ul>
                ${sidebarSection}
            </nav>
            <main class="main-content" id="content">
                <div class="loading">Loading...</div>
            </main>
        </div>
    </div>
    <footer>
        <div class="container">
            <p>&copy; 2024 Playwright TypeScript Framework. Built for Netlify.</p>
        </div>
    </footer>
    <script>
        fetch('${depth}${mdPath}')
            .then(response => response.text())
            .then(markdown => {
                // Remove frontmatter if present
                const cleanedMarkdown = markdown.replace(/^---[\\s\\S]*?---\\n/, '');
                document.getElementById('content').innerHTML = marked.parse(cleanedMarkdown);
            })
            .catch(error => {
                document.getElementById('content').innerHTML = '<p>Error loading content: ' + error.message + '</p>';
            });
    </script>
</body>
</html>`;
};

// Function to convert MD path to HTML filename and directory
function mdToHtmlPath(mdPath) {
    // Remove 'docs/' prefix and .md extension
    const pathWithoutDocs = mdPath.replace(/^docs\//, '').replace(/\.md$/, '');
    const parts = pathWithoutDocs.split('/');
    const category = parts[0];
    const filename = parts.slice(1).join('-') || parts[0];
    
    // Determine output directory
    let outputDir = 'html';
    if (category === 'examples') outputDir = 'html/examples';
    else if (category === 'azure') outputDir = 'html/azure';
    else if (category === 'browserstack') outputDir = 'html/browserstack';
    else if (category === 'github-actions') outputDir = 'html/github-actions';
    else if (category === 'grid') outputDir = 'html/grid';
    else if (category === 'getting-started') outputDir = 'html/getting-started';
    else if (category === 'troubleshooting') outputDir = 'html/troubleshooting';
    else if (category === 'workflows') outputDir = 'html/workflows';
    
    return {
        dir: outputDir,
        filename: (category === 'examples' && (filename === 'basepage-examples' || filename === 'basetest-examples')) 
            ? filename + '.html' 
            : category + '-' + filename + '.html'
    };
}

// Function to get title from filename
function getTitle(filename) {
    return filename
        .replace(/\.md$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

// Get sidebar section based on category
function getSidebarSection(category) {
    const sidebars = {
        examples: `
                <h2 style="margin-top: 2rem;">Examples</h2>
                <ul>
                    <li><a href="basepage-examples.html">BasePage Examples</a></li>
                    <li><a href="basetest-examples.html">BaseTest Examples</a></li>
                    <li><a href="examples.html">All Examples</a></li>
                </ul>`,
        azure: '',
        browserstack: '',
        'github-actions': '',
        grid: '',
        'getting-started': '',
        troubleshooting: ''
    };
    return sidebars[category] || '';
}

// Find all MD files and generate HTML
function generateHtmlFiles() {
    const docsDir = path.join(__dirname, 'docs');
    const mdFiles = [];
    
    function findMdFiles(dir, basePath = '') {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                findMdFiles(fullPath, path.join(basePath, file));
            } else if (file.endsWith('.md')) {
                const mdPath = path.join(basePath, file).replace(/\\/g, '/');
                mdFiles.push('docs/' + mdPath);
            }
        });
    }
    
    findMdFiles(docsDir);
    
    // Generate HTML for each MD file
    mdFiles.forEach(mdPath => {
        const { dir, filename } = mdToHtmlPath(mdPath);
        const category = mdPath.split('/')[1];
        const title = getTitle(path.basename(mdPath));
        const sidebarSection = getSidebarSection(category);
        
        // Calculate depth (../ for subdirectories)
        const depth = dir === 'html' ? '../' : '../../';
        
        // Ensure directory exists
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        const htmlPath = path.join(dir, filename);
        const htmlContent = htmlTemplate(title, mdPath, sidebarSection, depth);
        fs.writeFileSync(htmlPath, htmlContent);
        console.log(`Generated: ${htmlPath} -> ${mdPath}`);
    });
    
    console.log(`\nGenerated ${mdFiles.length} HTML files`);
}

generateHtmlFiles();

