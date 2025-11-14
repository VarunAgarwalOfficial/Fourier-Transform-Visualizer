/**
 * Keyboard shortcuts manager
 */

class KeyboardManager {
    constructor() {
        this.shortcuts = new Map();
        this.enabled = true;
        this.init();
    }

    init() {
        document.addEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = (e) => {
        if (!this.enabled) return;

        // Don't trigger shortcuts when typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        const key = this.getKeyString(e);
        const callback = this.shortcuts.get(key);

        if (callback) {
            e.preventDefault();
            callback(e);
        }
    }

    getKeyString(e) {
        const parts = [];
        if (e.ctrlKey) parts.push('Ctrl');
        if (e.altKey) parts.push('Alt');
        if (e.shiftKey) parts.push('Shift');
        parts.push(e.key);
        return parts.join('+');
    }

    /**
     * Register a keyboard shortcut
     */
    register(key, callback, description) {
        this.shortcuts.set(key, callback);

        // Store description for help display
        if (!this.descriptions) this.descriptions = new Map();
        this.descriptions.set(key, description);
    }

    /**
     * Unregister a shortcut
     */
    unregister(key) {
        this.shortcuts.delete(key);
        if (this.descriptions) {
            this.descriptions.delete(key);
        }
    }

    /**
     * Get all shortcuts with descriptions
     */
    getAllShortcuts() {
        const shortcuts = [];
        if (this.descriptions) {
            for (const [key, description] of this.descriptions) {
                shortcuts.push({ key, description });
            }
        }
        return shortcuts;
    }

    /**
     * Enable/disable shortcuts
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }

    /**
     * Display shortcuts modal
     */
    showHelp() {
        const shortcuts = this.getAllShortcuts();
        const modal = document.getElementById('shortcutsModal');
        const list = document.getElementById('shortcutsList');

        list.innerHTML = shortcuts.map(({ key, description }) => `
            <div class="shortcut-item">
                <span>${description}</span>
                <span class="shortcut-key">${key}</span>
            </div>
        `).join('');

        modal.classList.add('active');
    }

    /**
     * Register default shortcuts
     */
    static registerDefaults(app) {
        const km = new KeyboardManager();

        // Playback controls
        km.register(' ', () => app.togglePlayPause(), 'Play/Pause');
        km.register('r', () => app.reset(), 'Reset');
        km.register('ArrowLeft', () => app.adjustSpeed(-0.1), 'Decrease Speed');
        km.register('ArrowRight', () => app.adjustSpeed(0.1), 'Increase Speed');

        // Epicycles
        km.register('ArrowUp', () => app.adjustEpicycles(10), 'More Epicycles');
        km.register('ArrowDown', () => app.adjustEpicycles(-10), 'Fewer Epicycles');

        // View controls
        km.register('c', () => app.toggleCircles(), 'Toggle Circles');
        km.register('v', () => app.toggleVectors(), 'Toggle Vectors');
        km.register('p', () => app.togglePath(), 'Toggle Path');

        // File operations
        km.register('Ctrl+s', () => app.saveProject(), 'Save Project');
        km.register('Ctrl+o', () => app.loadProject(), 'Load Project');
        km.register('Ctrl+e', () => app.exportGif(), 'Export GIF');

        // Undo/Redo
        km.register('Ctrl+z', () => app.undo(), 'Undo');
        km.register('Ctrl+y', () => app.redo(), 'Redo');
        km.register('Ctrl+Shift+z', () => app.redo(), 'Redo (Alt)');

        // Misc
        km.register('f', () => app.toggleFullscreen(), 'Toggle Fullscreen');
        km.register('t', () => app.toggleTheme(), 'Toggle Theme');
        km.register('?', () => km.showHelp(), 'Show Shortcuts');
        km.register('h', () => km.showHelp(), 'Show Shortcuts');

        // Number keys for presets
        km.register('1', () => app.loadPreset('circle'), 'Preset: Circle');
        km.register('2', () => app.loadPreset('square'), 'Preset: Square');
        km.register('3', () => app.loadPreset('triangle'), 'Preset: Triangle');
        km.register('4', () => app.loadPreset('star'), 'Preset: Star');
        km.register('5', () => app.loadPreset('heart'), 'Preset: Heart');
        km.register('6', () => app.loadPreset('spiral'), 'Preset: Spiral');

        return km;
    }
}
