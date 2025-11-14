/**
 * Undo/Redo system for path changes
 */

class UndoRedoManager {
    constructor(maxHistorySize = 50) {
        this.history = [];
        this.currentIndex = -1;
        this.maxHistorySize = maxHistorySize;
    }

    /**
     * Save current state to history
     */
    saveState(state) {
        // Remove any states after current index (when undoing then making new change)
        this.history = this.history.slice(0, this.currentIndex + 1);

        // Add new state
        this.history.push(JSON.parse(JSON.stringify(state)));
        this.currentIndex++;

        // Limit history size
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
            this.currentIndex--;
        }
    }

    /**
     * Undo to previous state
     */
    undo() {
        if (this.canUndo()) {
            this.currentIndex--;
            return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
        }
        return null;
    }

    /**
     * Redo to next state
     */
    redo() {
        if (this.canRedo()) {
            this.currentIndex++;
            return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
        }
        return null;
    }

    /**
     * Check if undo is available
     */
    canUndo() {
        return this.currentIndex > 0;
    }

    /**
     * Check if redo is available
     */
    canRedo() {
        return this.currentIndex < this.history.length - 1;
    }

    /**
     * Clear history
     */
    clear() {
        this.history = [];
        this.currentIndex = -1;
    }

    /**
     * Get current state without modifying history
     */
    getCurrentState() {
        if (this.currentIndex >= 0) {
            return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
        }
        return null;
    }
}
