const markdownInput = document.getElementById('markdown-input');
const markdownPreview = document.getElementById('markdown-preview');
const openFileWindowBtn = document.getElementById('open-file-window');
const fileInput = document.getElementById('file-input');
const toggleButton = document.getElementById('toggle-button');
const container = document.querySelector('.container');
const toggleTooltip = toggleButton.nextElementSibling;

// Default README content
const defaultReadmeContent = `# Markdown Previewer

## Overview

Markdown Previewer is a simple web-based tool that allows you to write, edit, and preview Markdown text in real-time. The application supports syntax highlighting for code blocks, mathematical expressions with KaTeX, and the ability to copy code blocks with a single click. Additionally, users can load Markdown files from their local system to view and edit them directly in the previewer.

## Features

- **Real-time Markdown Preview:** As you type in the Markdown input area, the preview pane updates in real-time to reflect your changes.
- **Code Syntax Highlighting:** Supports syntax highlighting for code blocks using \`highlight.js\`.
- **KaTeX Integration:** Render mathematical expressions inline and in display mode using KaTeX.
- **Load Markdown Files:** Upload and load \`.md\` files directly into the editor for preview and further editing.
- **Copy Code Blocks:** Easily copy code blocks to the clipboard with a single click.
- **Responsive Design:** Toggle between a full-width preview or side-by-side view with the editor for an improved writing experience.

### Installation

<details>
<summary><strong>1. Standalone Installation</strong></summary>

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/h471x/markdown_previewer.git
   \`\`\`
   
2. **Navigate to the project directory:**
   \`\`\`bash
   cd markdown_previewer
   \`\`\`

3. **Open \`index.html\` in your browser:**
   - Simply open the \`index.html\` file in your preferred web browser to start using the Markdown Previewer.

</details>

<details>
<summary><strong>2. Web Server Hosted Installation</strong></summary>

**For Linux (Apache or Nginx):**

1. **Clone the repository directly to the web server directory:**
   - For **Apache** (default document root: \`/var/www/html/\`):
     \`\`\`bash
     sudo git clone https://github.com/h471x/markdown_previewer.git /var/www/html/markdown_previewer
     \`\`\`
   - For **Nginx** (default document root: \`/usr/share/nginx/html/\`):
     \`\`\`bash
     sudo git clone https://github.com/h471x/markdown_previewer.git /usr/share/nginx/html/markdown_previewer
     \`\`\`

2. **Ensure the web server is running:**
   - For **Apache**:
     \`\`\`bash
     sudo systemctl start apache2
     \`\`\`
   - For **Nginx**:
     \`\`\`bash
     sudo systemctl start nginx
     \`\`\`

3. **Access the Markdown Previewer in your browser:**
   - Navigate to \`http://localhost/markdown_previewer\`.

---

**For Windows (Using WAMP or XAMPP):**

1. **Clone the repository to your local machine:**
   \`\`\`bash
   git clone https://github.com/h471x/markdown_previewer.git
   \`\`\`

2. **Copy the project directory to the WAMP or XAMPP document root:**
   - For **WAMP** (usually \`C:\\wamp64\\www\\\`):
     \`\`\`bash
     xcopy markdown_previewer C:\\wamp64\\www\\markdown_previewer /E /I
     \`\`\`
   - For **XAMPP** (usually \`C:\\xampp\\htdocs\\\`):
     \`\`\`bash
     xcopy markdown_previewer C:\\xampp\\htdocs\\markdown_previewer /E /I
     \`\`\`

3. **Start the WAMP or XAMPP server.**

4. **Access the Markdown Previewer in your browser:**
   - Navigate to \`http://localhost/markdown_previewer\`.

</details>

## Usage

- **Writing Markdown:**
  - Type your Markdown content in the textarea on the left side of the screen.
  - The preview pane on the right side will automatically update to show the rendered HTML.

- **Uploading a Markdown File:**
  - Click the "+" button (floating button) to open the file input dialog.
  - Select a \`.md\` file from your computer.
  - The content of the file will be loaded into the editor, and the preview will be updated accordingly.

- **Copying Code Blocks:**
  - Hover over any code block in the preview pane.
  - Click the copy button that appears in the top-right corner of the code block to copy its content to your clipboard.

- **Toggle Full Preview Mode:**
  - Use the toggle button (floating button) to switch between a side-by-side view and a full-width preview mode.

## Dependencies

- [Marked.js](https://github.com/markedjs/marked) - A fast, powerful Markdown parser and compiler.
- [highlight.js](https://highlightjs.org/) - JavaScript syntax highlighter for code blocks.
- [KaTeX](https://katex.org/) - Fast math typesetting library.
- [PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) - Basic setup for a progressive web app (PWA).

## Contributing

If you'd like to contribute to this project, feel free to fork the repository and submit a pull request. Contributions, bug reports, and feature requests are welcome!`;

// Initialize the application
function init() {
  loadReadmeOnStartup();
  updateToggleButtonTooltip();
  updateToggleButtonImage();
}

// Function to update the markdown preview
function updatePreview(markdownText = markdownInput.value) {
  const htmlContent = marked.parse(markdownText);
  markdownPreview.innerHTML = htmlContent;

  highlightCodeBlocks();
  renderMathExpressions();
  addCopyButtons();
}

// Function to highlight code blocks
function highlightCodeBlocks() {
  document.querySelectorAll('pre code').forEach(block => {
    hljs.highlightElement(block);
  });
}

// Function to render math expressions with KaTeX
function renderMathExpressions() {
  renderMathInElement(markdownPreview, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false },
      { left: '\\(', right: '\\)', display: false },
      { left: '\\[', right: '\\]', display: true }
    ],
    throwOnError: false
  });
}

// Function to add copy buttons to code blocks
function addCopyButtons() {
  const codeBlocks = markdownPreview.querySelectorAll('pre > code');
  codeBlocks.forEach(codeBlock => {
    const container = createCodeBlockContainer(codeBlock);
    const copyButton = createCopyButton(codeBlock);

    container.appendChild(copyButton);
  });
}

// Function to create a container for code blocks
function createCodeBlockContainer(codeBlock) {
  const preElement = codeBlock.parentElement;
  const container = document.createElement('div');
  container.className = 'code-block';
  preElement.parentNode.insertBefore(container, preElement);
  container.appendChild(preElement);
  return container;
}

// Function to create a copy button
function createCopyButton(codeBlock) {
  const copyButton = document.createElement('button');
  copyButton.className = 'copy-btn';
  copyButton.innerHTML = `<img src="imgs/copy.png" alt="Copy">`;

  copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(codeBlock.innerText).then(() => {
      showCopiedState(copyButton);
    });
  });

  return copyButton;
}

// Function to show copied state on button
function showCopiedState(copyButton) {
  copyButton.classList.add('copied');
  copyButton.innerHTML = `<img src="imgs/check.png" alt="Copied">`;

  setTimeout(() => {
    copyButton.classList.remove('copied');
    copyButton.innerHTML = `<img src="imgs/copy.png" alt="Copy">`;
  }, 1500);
}

// Function to update the toggle button image based on state
function updateToggleButtonImage() {
  const imgSrc = container.classList.contains('full-width') ? 'show.png' : 'hide.png';
  toggleButton.innerHTML = `<img src="imgs/${imgSrc}" alt="${imgSrc === 'show.png' ? 'Show' : 'Hide'}">`;
}

// Update tooltip for the toggle button
function updateToggleButtonTooltip() {
  toggleTooltip.textContent = container.classList.contains('full-width') ? 'Show Source' : 'Hide Source';
}

// Open file input dialog when the "+" button is clicked
openFileWindowBtn.addEventListener('click', () => {
  openFileWindowBtn.blur();
  fileInput.value = '';
  updatePreview();
  fileInput.click();
});

// Load README.md on startup
function loadReadmeOnStartup() {
  fetch('/markdown_preview/README.md')
    .then(response => response.ok ? response.text() : Promise.reject())
    .then(data => {
      markdownInput.value = data;
      updatePreview();
    })
    .catch(() => {
      markdownInput.value = defaultReadmeContent;
      updatePreview();
    });
}

// Handle file input change event
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      markdownInput.value = e.target.result;
      container.classList.add('full-width');
      updateToggleButtonImage();
      updateToggleButtonTooltip();
      updatePreview();
    };
    reader.readAsText(file);
  }
});

// Toggle full preview mode
toggleButton.addEventListener('click', () => {
  container.classList.toggle('full-width');
  updateToggleButtonImage();
  updateToggleButtonTooltip();
});

// Update preview on markdown input change
markdownInput.addEventListener('input', () => {
  fileInput.value = '';
  updatePreview();
});

// Initialize the application
init();