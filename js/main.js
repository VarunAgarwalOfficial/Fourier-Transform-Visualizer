/**
 * Main application logic for Fourier Transform Visualizer
 */

class FourierVisualizer {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');

        // Animation state
        this.isPlaying = true;
        this.time = 0;
        this.speed = 1;
        this.trailLength = 1;

        // Visualization state
        this.epicycles = [];
        this.path = [];
        this.drawnPath = [];
        this.numEpicycles = 50;

        // Display options
        this.showCircles = true;
        this.showVectors = true;
        this.showPath = true;

        // Drawing mode
        this.drawingMode = new DrawingMode(this.canvas);

        // FPS tracking
        this.lastFrameTime = performance.now();
        this.fps = 60;
        this.frameCount = 0;
        this.fpsUpdateInterval = 30;

        // Theme
        this.theme = 'dark';

        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupControls();
        this.loadPreset('circle');
        this.animate();
        this.updateFPS();
    }

    setupCanvas() {
        // Set canvas size
        const container = this.canvas.parentElement;
        const size = Math.min(container.clientWidth - 40, 800);
        this.canvas.width = size;
        this.canvas.height = size;

        // Handle window resize
        window.addEventListener('resize', () => {
            const newSize = Math.min(container.clientWidth - 40, 800);
            this.canvas.width = newSize;
            this.canvas.height = newSize;
        });
    }

    setupControls() {
        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const preset = btn.dataset.preset;
                this.loadPreset(preset);
            });
        });

        // Drawing mode
        const drawModeBtn = document.getElementById('drawModeBtn');
        const clearDrawingBtn = document.getElementById('clearDrawingBtn');

        drawModeBtn.addEventListener('click', () => {
            if (this.drawingMode.isEnabled) {
                this.drawingMode.disable();
                drawModeBtn.textContent = 'Enable Drawing';
                drawModeBtn.classList.remove('active');

                // Process drawn path
                const drawnPoints = this.drawingMode.getPath();
                if (drawnPoints.length > 10) {
                    const resampled = this.drawingMode.resamplePath(drawnPoints, 150);
                    this.loadPath(resampled);
                }
            } else {
                this.drawingMode.enable();
                drawModeBtn.textContent = 'Finish Drawing';
                drawModeBtn.classList.add('active');
                this.isPlaying = false;
            }
        });

        clearDrawingBtn.addEventListener('click', () => {
            this.drawingMode.clear();
            this.drawnPath = [];
        });

        // Vector slider
        const vectorSlider = document.getElementById('vectorSlider');
        const vectorCount = document.getElementById('vectorCount');
        vectorSlider.addEventListener('input', (e) => {
            this.numEpicycles = parseInt(e.target.value);
            vectorCount.textContent = this.numEpicycles;
        });

        // Speed slider
        const speedSlider = document.getElementById('speedSlider');
        const speedValue = document.getElementById('speedValue');
        speedSlider.addEventListener('input', (e) => {
            this.speed = parseFloat(e.target.value);
            speedValue.textContent = this.speed.toFixed(1) + 'x';
        });

        // Trail slider
        const trailSlider = document.getElementById('trailSlider');
        const trailValue = document.getElementById('trailValue');
        trailSlider.addEventListener('input', (e) => {
            this.trailLength = parseInt(e.target.value) / 100;
            trailValue.textContent = e.target.value + '%';
        });

        // Display toggles
        document.getElementById('showCircles').addEventListener('change', (e) => {
            this.showCircles = e.target.checked;
        });

        document.getElementById('showVectors').addEventListener('change', (e) => {
            this.showVectors = e.target.checked;
        });

        document.getElementById('showPath').addEventListener('change', (e) => {
            this.showPath = e.target.checked;
        });

        // Play/Pause button
        const playPauseBtn = document.getElementById('playPauseBtn');
        playPauseBtn.addEventListener('click', () => {
            this.isPlaying = !this.isPlaying;
            playPauseBtn.textContent = this.isPlaying ? 'Pause' : 'Play';
        });

        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.time = 0;
            this.drawnPath = [];
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    loadPreset(presetName) {
        const centerX = 0;
        const centerY = 0;
        const size = Math.min(this.canvas.width, this.canvas.height) * 0.3;

        let points;
        switch (presetName) {
            case 'circle':
                points = Presets.circle(centerX, centerY, size);
                break;
            case 'square':
                points = Presets.square(centerX, centerY, size * 1.5);
                break;
            case 'triangle':
                points = Presets.triangle(centerX, centerY, size * 1.5);
                break;
            case 'star':
                points = Presets.star(centerX, centerY, size);
                break;
            case 'heart':
                points = Presets.heart(centerX, centerY, size);
                break;
            case 'spiral':
                points = Presets.spiral(centerX, centerY, size);
                break;
            default:
                points = Presets.circle(centerX, centerY, size);
        }

        this.loadPath(points);
    }

    loadPath(points) {
        this.path = points;
        this.epicycles = createEpicycles(points, true);
        this.time = 0;
        this.drawnPath = [];

        // Update vector slider max
        const vectorSlider = document.getElementById('vectorSlider');
        vectorSlider.max = Math.min(this.epicycles.length, 200);

        // Resume animation if drawing mode is disabled
        if (!this.drawingMode.isEnabled) {
            this.isPlaying = true;
            document.getElementById('playPauseBtn').textContent = 'Pause';
        }
    }

    animate = () => {
        this.draw();

        if (this.isPlaying) {
            this.time += (Math.PI * 2 / this.epicycles.length) * this.speed;

            // Reset when complete cycle
            if (this.time >= Math.PI * 2) {
                this.time = 0;
            }
        }

        requestAnimationFrame(this.animate);
    }

    draw() {
        // Clear canvas
        const bgColor = this.theme === 'dark' ? '#151935' : '#ffffff';
        this.ctx.fillStyle = bgColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Translate to center
        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);

        // Get current point and cycles
        const result = getPointFromEpicycles(this.epicycles, this.time, this.numEpicycles);

        // Draw epicycles
        if (this.showCircles || this.showVectors) {
            this.drawEpicycles(result.cycles);
        }

        // Add to drawn path
        if (this.isPlaying) {
            this.drawnPath.push(result.point);

            // Limit trail length
            const maxLength = Math.floor(this.epicycles.length * this.trailLength);
            if (this.drawnPath.length > maxLength) {
                this.drawnPath.shift();
            }
        }

        // Draw the traced path
        if (this.showPath && this.drawnPath.length > 1) {
            this.drawPath(this.drawnPath);
        }

        // Draw current drawing
        if (this.drawingMode.isEnabled && this.drawingMode.currentPath.length > 1) {
            this.drawDrawingPath(this.drawingMode.currentPath);
        }

        this.ctx.restore();

        // Update FPS
        this.frameCount++;
    }

    drawEpicycles(cycles) {
        const lineColor = this.theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';
        const vectorColor = this.theme === 'dark' ? '#3b82f6' : '#2563eb';

        for (let i = 0; i < cycles.length; i++) {
            const cycle = cycles[i];

            // Draw circle
            if (this.showCircles) {
                this.ctx.beginPath();
                this.ctx.arc(cycle.center.x, cycle.center.y, cycle.radius, 0, Math.PI * 2);
                this.ctx.strokeStyle = lineColor;
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }

            // Draw vector
            if (this.showVectors) {
                this.ctx.beginPath();
                this.ctx.moveTo(cycle.center.x, cycle.center.y);
                this.ctx.lineTo(cycle.endpoint.x, cycle.endpoint.y);
                this.ctx.strokeStyle = vectorColor;
                this.ctx.lineWidth = 2;
                this.ctx.stroke();

                // Draw endpoint dot
                this.ctx.beginPath();
                this.ctx.arc(cycle.endpoint.x, cycle.endpoint.y, 3, 0, Math.PI * 2);
                this.ctx.fillStyle = vectorColor;
                this.ctx.fill();
            }
        }
    }

    drawPath(path) {
        this.ctx.beginPath();
        this.ctx.moveTo(path[0].x, path[0].y);

        for (let i = 1; i < path.length; i++) {
            this.ctx.lineTo(path[i].x, path[i].y);
        }

        // Gradient stroke
        const gradient = this.ctx.createLinearGradient(
            path[0].x, path[0].y,
            path[path.length - 1].x, path[path.length - 1].y
        );

        if (this.theme === 'dark') {
            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
            gradient.addColorStop(1, 'rgba(59, 130, 246, 1)');
        } else {
            gradient.addColorStop(0, 'rgba(37, 99, 235, 0.3)');
            gradient.addColorStop(1, 'rgba(37, 99, 235, 1)');
        }

        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.stroke();
    }

    drawDrawingPath(path) {
        if (path.length < 2) return;

        this.ctx.beginPath();
        this.ctx.moveTo(path[0].x, path[0].y);

        for (let i = 1; i < path.length; i++) {
            this.ctx.lineTo(path[i].x, path[i].y);
        }

        this.ctx.strokeStyle = this.theme === 'dark' ? '#10b981' : '#059669';
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.stroke();
    }

    updateFPS() {
        setInterval(() => {
            const now = performance.now();
            const delta = now - this.lastFrameTime;
            this.fps = Math.round((this.frameCount * 1000) / delta);
            this.lastFrameTime = now;
            this.frameCount = 0;

            document.getElementById('fpsCounter').textContent = `FPS: ${this.fps}`;
        }, 1000);
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', this.theme);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new FourierVisualizer();
});
