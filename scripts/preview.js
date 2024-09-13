const markdownInput = document.getElementById('markdown-input');
const markdownPreview = document.getElementById('markdown-preview');

// Function to update the markdown preview
function updatePreview() {
  const markdownText = markdownInput.value;
  const htmlContent = marked.parse(markdownText);
  markdownPreview.innerHTML = htmlContent;
  addCopyButtons();
}

// Function to add copy buttons to code blocks
function addCopyButtons() {
  const codeBlocks = markdownPreview.querySelectorAll('pre > code');
  codeBlocks.forEach((codeBlock) => {
    const preElement = codeBlock.parentElement;
    const container = document.createElement('div');
    container.className = 'code-block';
    preElement.parentNode.insertBefore(container, preElement);
    container.appendChild(preElement);

    // Create the copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-btn';
    copyButton.innerHTML = `<img src="images/copy.png" alt="Copy">`;

    // Attach click event for copy functionality
    copyButton.addEventListener('click', () => {
      const codeText = codeBlock.innerText;
      navigator.clipboard.writeText(codeText).then(() => {
        copyButton.classList.add('copied');
        copyButton.innerHTML = `<img src="images/check.png" alt="Copied">`;

        setTimeout(() => {
          copyButton.classList.remove('copied');
          copyButton.innerHTML = `<img src="images/copy.png" alt="Copy">`;
        }, 1500);
      });
    });

    container.appendChild(copyButton);
  });
}

// Update preview on input change
markdownInput.addEventListener('input', updatePreview);

// Initial content for demonstration (optional)
// markdownInput.value = `# Markdown Previewer with Code Copy\n\n\`\`\`shell\n# Example shell code block\nls -la\n\`\`\``;
updatePreview();
