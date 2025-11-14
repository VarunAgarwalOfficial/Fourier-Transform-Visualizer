/**
 * Audio visualizer using microphone input
 */

class AudioVisualizer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.isActive = false;
        this.sensitivity = 50;
    }

    /**
     * Enable microphone and start visualization
     */
    async enable() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;

            const source = this.audioContext.createMediaStreamSource(stream);
            source.connect(this.analyser);

            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            this.isActive = true;

            return true;
        } catch (error) {
            console.error('Failed to access microphone:', error);
            return false;
        }
    }

    /**
     * Disable audio visualization
     */
    disable() {
        this.isActive = false;

        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }

        this.analyser = null;
        this.dataArray = null;
    }

    /**
     * Draw audio waveform
     */
    draw() {
        if (!this.isActive || !this.analyser) return;

        this.analyser.getByteFrequencyData(this.dataArray);

        const width = this.canvas.width;
        const height = this.canvas.height;

        // Clear
        this.ctx.fillStyle = '#151935';
        this.ctx.fillRect(0, 0, width, height);

        // Draw frequency bars
        const barWidth = width / this.dataArray.length;

        for (let i = 0; i < this.dataArray.length; i++) {
            const value = this.dataArray[i];
            const barHeight = (value / 255) * height * (this.sensitivity / 50);

            // Color gradient
            const hue = (i / this.dataArray.length) * 360;
            this.ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;

            const x = i * barWidth;
            const y = height - barHeight;

            this.ctx.fillRect(x, y, barWidth - 1, barHeight);
        }

        // Draw center line
        this.ctx.strokeStyle = '#3b82f6';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, height / 2);
        this.ctx.lineTo(width, height / 2);
        this.ctx.stroke();
    }

    /**
     * Get path from audio (convert audio to drawing path)
     */
    getPathFromAudio(numPoints = 100) {
        if (!this.isActive || !this.analyser) return null;

        this.analyser.getByteFrequencyData(this.dataArray);

        const points = [];
        const angleStep = (Math.PI * 2) / numPoints;

        for (let i = 0; i < numPoints; i++) {
            const dataIndex = Math.floor((i / numPoints) * this.dataArray.length);
            const amplitude = (this.dataArray[dataIndex] / 255) * 200;
            const angle = i * angleStep;

            points.push({
                x: amplitude * Math.cos(angle),
                y: amplitude * Math.sin(angle)
            });
        }

        return points;
    }

    /**
     * Set sensitivity
     */
    setSensitivity(value) {
        this.sensitivity = Math.max(1, Math.min(100, value));
    }
}
