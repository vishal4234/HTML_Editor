const htmlCode = document.getElementById('html-code');
const preview = document.getElementById('preview');
const resizer = document.getElementById('resizer');
const editorPanel = document.getElementById('editor-panel');
const editorContainer = document.querySelector('.editor-container');
const tabs = document.querySelectorAll('.tab');

// Warn user before leaving the page
window.addEventListener('beforeunload', (e) => {
    const hasUnsavedChanges = Object.values(content).some(code => code.trim() !== '');
    if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Store content for each tab
const content = {
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dark Mode</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>`,
    css: `/* CSS code goes here */`,
    js: `// JavaScript code goes here`
};

// CodeMirror Initialization
const editor = CodeMirror.fromTextArea(htmlCode, {
    mode: 'htmlmixed',
    lineNumbers: true,
    autoCloseTags: true,
    theme: 'material-darker',
    tabSize: 2,
});

// Update preview when code changes
editor.on('change', () => {
    const activeTab = document.querySelector('.tab.active');
    const contentKey = activeTab.getAttribute('data-content');
    content[contentKey] = editor.getValue();
    updatePreview();
});

// Function to update the preview
function updatePreview() {
    const iframeDocument = preview.contentDocument || preview.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Preview</title>
            <style>${content.css}</style>
        </head>
        <body>
            ${content.html}
            <script>${content.js}</script>
        </body>
        </html>
    `);
    iframeDocument.close();
}

// Tab Switching Functionality
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const activeTab = document.querySelector('.tab.active');
        const activeContentKey = activeTab.getAttribute('data-content');
        content[activeContentKey] = editor.getValue();

        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const mode = tab.getAttribute('data-mode');
        const contentKey = tab.getAttribute('data-content');
        editor.setOption('mode', mode);
        editor.setValue(content[contentKey] || '');
    });
});


let isResizing = false;

resizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
});

function resize(e) {
    if (isResizing) {
        const containerRect = editorContainer.getBoundingClientRect();
        const newWidth = e.clientX - containerRect.left;
        const minWidth = 300; // Minimum width for the editor panel
        const maxWidth = containerRect.width - 300; // Maximum width for the editor panel

        // Ensure the editor panel stays within the min and max width
        const editorWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));

        // Update the editor panel width
        editorPanel.style.width = `${editorWidth}px`;
        editorPanel.style.flex = `0 0 ${editorWidth}px`;

        // Update the preview panel width
        previewPanel.style.flex = `1 1 ${containerRect.width - editorWidth}px`;
    }
}

function stopResize() {
    isResizing = false;
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
}

// Initialize with HTML content
editor.setValue(content.html);
updatePreview();


