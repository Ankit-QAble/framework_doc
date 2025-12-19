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
    <script>
        // Initialize theme immediately to prevent flash
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
    </script>
</head>
<body>
    <header>
        <div class="container header-content">
            <h1>
                <a href="${indexPath}" style="display: flex; align-items: center;">
                    <img src="${depth}assets/logo-light.png" class="header-logo logo-light" alt="Logo">
                    <img src="${depth}assets/logo-dark.svg" class="header-logo logo-dark" alt="Logo">
                    Playwright TypeScript Framework
                </a>
            </h1>
            <nav class="header-nav">
                <ul>
                    <li><a href="${indexPath}">Home</a></li>
                    <li class="dropdown">
                        <a href="${depth}intro.html">Documents</a>
                        <div class="dropdown-content">
                            <a href="${depth}intro.html">Introduction</a>
                            <a href="${depth}getting-started.html">Getting Started</a>
                            <a href="${depth}html/getting-started/getting-started-FRAMEWORK_CHEATSHEET.html">Cheatsheet</a>
                            <a href="${depth}azure.html">Azure</a>
                            <a href="${depth}browserstack.html">BrowserStack</a>
                            <a href="${depth}github-actions.html">GitHub Actions</a>
                            <a href="${depth}grid.html">Grid Setup</a>
                            <a href="${depth}examples.html">Examples</a>
                            <a href="${depth}troubleshooting.html">Troubleshooting</a>
                            <a href="${depth}html/accessibility-testing-accessibility-testing.html">Accessibility</a>
                        </div>
                    </li>
                    <li><a href="${depth}html/about-about.html">About</a></li>
                </ul>
            </nav>
            <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">
                <svg id="moon-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                <svg id="sun-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none;"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            </button>
        </div>
    </header>
    <div class="container">
        <div class="content">
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

        // Theme Toggle Logic
        const toggleButton = document.getElementById('theme-toggle');
        const moonIcon = document.getElementById('moon-icon');
        const sunIcon = document.getElementById('sun-icon');

        function updateIcons(theme) {
            if (theme === 'dark') {
                moonIcon.style.display = 'none';
                sunIcon.style.display = 'block';
            } else {
                moonIcon.style.display = 'block';
                sunIcon.style.display = 'none';
            }
        }

        const currentTheme = localStorage.getItem('theme') || 'light';
        updateIcons(currentTheme);

        toggleButton.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateIcons(newTheme);
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
    
    // Check if it's a README file - if so, map to category.html in root
    // But only if it's not the top-level README
    if (filename === 'README' && parts.length > 1) {
        return {
            dir: 'html',
            filename: category + '.html'
        };
    }
    
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

