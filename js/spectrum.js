/**
 * Frequency spectrum visualizer
 */

class SpectrumVisualizer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.showLabels = true;
        this.maxBars = 50;
    }

    /**
     * Draw frequency spectrum
     */
    draw(epicycles, numEpicycles) {
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Clear
        this.ctx.fillStyle = '#151935';
        this.ctx.fillRect(0, 0, width, height);

        if (!epicycles || epicycles.length === 0) return;

        // Get top frequencies
        const topFreqs = epicycles.slice(0, Math.min(this.maxBars, numEpicycles));

        // Find max amplitude for scaling
        const maxAmp = Math.max(...topFreqs.map(e => e.amplitude));

        // Bar dimensions
        const barWidth = width / topFreqs.length;
        const padding = 2;

        // Draw bars
        for (let i = 0; i < topFreqs.length; i++) {
            const epicycle = topFreqs[i];
            const barHeight = (epicycle.amplitude / maxAmp) * (height - 40);

            // Color gradient based on frequency
            const hue = (epicycle.freq / epicycles.length) * 360;
            this.ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;

            // Draw bar
            const x = i * barWidth + padding;
            const y = height - barHeight - 20;

            this.ctx.fillRect(x, y, barWidth - padding * 2, barHeight);

            // Draw frequency label
            if (this.showLabels && i % Math.ceil(topFreqs.length / 10) === 0) {
                this.ctx.fillStyle = '#a1a1aa';
                this.ctx.font = '10px monospace';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(
                    epicycle.freq.toString(),
                    x + barWidth / 2,
                    height - 5
                );
            }
        }

        // Draw axis
        this.ctx.strokeStyle = '#27293d';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(0, height - 20);
        this.ctx.lineTo(width, height - 20);
        this.ctx.stroke();

        // Draw title
        this.ctx.fillStyle = '#e4e4e7';
        this.ctx.font = '12px sans-serif';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Top ${topFreqs.length} Frequencies`, 10, 15);
    }

    /**
     * Toggle labels
     */
    toggleLabels() {
        this.showLabels = !this.showLabels;
    }

    /**
     * Set maximum number of bars to display
     */
    setMaxBars(max) {
        this.maxBars = Math.max(10, Math.min(100, max));
    }
}
