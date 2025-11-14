/**
 * Main application - Fourier Transform Visualizer Pro
 * Integrates all modules and manages application state
 */

class FourierVisualizerPro {
    constructor() {
        // Canvas
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');

        // State
        this.isPlaying = true;
        this.time = 0;
        this.speed = 1;
        this.numEpicycles = 50;
        this.trailLength = 1;
        this.loopMode = 'repeat';
        this.isReversed = false;

        // Data
        this.path = [];
        this.epicycles = [];
        this.drawnPath = [];

        // Display options
        this.showCircles = true;
        this.showVectors = true;
        this.showPath = true;
        this.rainbowMode = false;
        this.glowEffect = false;
        this.particleEffect = false;
        this.trailWidth = 3;

        // Colors
        this.colors = {
            bg: '#151935',
            circle: '#ffffff',
            circleOpacity: 0.3,
            vector: '#3b82f6',
            path: '#3b82f6'
        };

        // Theme
        this.theme = 'dark';

        // Modules
        this.drawingMode = new DrawingMode(this.canvas);
        this.pathEditor = new PathEditor(this.canvas);
        this.parametric = new Parametric();
        this.undoRedo = new UndoRedoManager();
        this.gallery = new Gallery();
        this.tutorial = new Tutorial();
        this.spectrum = new SpectrumVisualizer(document.getElementById('spectrumCanvas'));
        this.audioViz = new AudioVisualizer(document.getElementById('audioCanvas'));
        this.gifExporter = new GIFExporter(this.canvas);

        // Performance
        this.fps = 60;
        this.lastFrameTime = performance.now();
        this.frameCount = 0;

        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupControls();
        this.setupModals();
        this.setupTabs();
        this.setupFileHandlers();

        // Keyboard shortcuts
        this.keyboard = KeyboardManager.registerDefaults(this);

        // Load from URL if present
        const urlPath = URLShare.decodePathFromURL();
        if (urlPath) {
            this.loadPath(urlPath);
        } else {
            this.loadPreset('circle');
        }

        // Start animation
        this.animate();
        this.updateFPS();
    }

    setupCanvas() {
        const container = this.canvas.parentElement;
        const size = Math.min(container.clientWidth - 40, 800);
        this.canvas.width = size;
        this.canvas.height = size;

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
                this.loadPreset(btn.dataset.preset);
            });
        });

        // Drawing mode
        const drawBtn = document.getElementById('drawModeBtn');
        drawBtn.addEventListener('click', () => {
            if (this.drawingMode.isEnabled) {
                this.drawingMode.disable();
                drawBtn.textContent = 'Enable Drawing';
                drawBtn.classList.remove('active');

                const points = this.drawingMode.getPath();
                if (points.length > 10) {
                    const resampled = this.drawingMode.resamplePath(points, 150);
                    this.loadPath(resampled);
                }
            } else {
                this.drawingMode.enable();
                drawBtn.textContent = 'Finish Drawing';
                drawBtn.classList.add('active');
                this.isPlaying = false;
            }
        });

        document.getElementById('clearDrawingBtn').addEventListener('click', () => {
            this.drawingMode.clear();
            this.drawnPath = [];
        });

        // Parametric equations
        document.getElementById('applyParamBtn').addEventListener('click', () => {
            try {
                const xExpr = document.getElementById('paramX').value;
                const yExpr = document.getElementById('paramY').value;
                const numPoints = parseInt(document.getElementById('paramPoints').value);

                const points = this.parametric.generate(xExpr, yExpr, numPoints);
                this.loadPath(points);
            } catch (error) {
                alert('Invalid equation: ' + error.message);
            }
        });

        // Sliders
        const vectorSlider = document.getElementById('vectorSlider');
        vectorSlider.addEventListener('input', (e) => {
            this.numEpicycles = parseInt(e.target.value);
            document.getElementById('vectorCount').textContent = this.numEpicycles;
        });

        const speedSlider = document.getElementById('speedSlider');
        speedSlider.addEventListener('input', (e) => {
            this.speed = parseFloat(e.target.value);
            document.getElementById('speedValue').textContent = this.speed.toFixed(1) + 'x';
        });

        const trailSlider = document.getElementById('trailSlider');
        trailSlider.addEventListener('input', (e) => {
            this.trailLength = parseInt(e.target.value) / 100;
            document.getElementById('trailValue').textContent = e.target.value + '%';
        });

        const trailWidthSlider = document.getElementById('trailWidth');
        trailWidthSlider.addEventListener('input', (e) => {
            this.trailWidth = parseInt(e.target.value);
            document.getElementById('trailWidthValue').textContent = e.target.value;
        });

        // Toggles
        document.getElementById('showCircles').addEventListener('change', (e) => {
            this.showCircles = e.target.checked;
        });

        document.getElementById('showVectors').addEventListener('change', (e) => {
            this.showVectors = e.target.checked;
        });

        document.getElementById('showPath').addEventListener('change', (e) => {
            this.showPath = e.target.checked;
        });

        document.getElementById('rainbowMode').addEventListener('change', (e) => {
            this.rainbowMode = e.target.checked;
        });

        document.getElementById('glowEffect').addEventListener('change', (e) => {
            this.glowEffect = e.target.checked;
        });

        document.getElementById('particleEffect').addEventListener('change', (e) => {
            this.particleEffect = e.target.checked;
        });

        // Color pickers
        document.getElementById('bgColor').addEventListener('input', (e) => {
            this.colors.bg = e.target.value;
        });

        document.getElementById('circleColor').addEventListener('input', (e) => {
            this.colors.circle = e.target.value;
        });

        document.getElementById('circleOpacity').addEventListener('input', (e) => {
            this.colors.circleOpacity = parseInt(e.target.value) / 100;
        });

        document.getElementById('vectorColor').addEventListener('input', (e) => {
            this.colors.vector = e.target.value;
        });

        document.getElementById('pathColor').addEventListener('input', (e) => {
            this.colors.path = e.target.value;
        });

        // Timeline controls
        document.getElementById('playPauseBtn').addEventListener('click', () => {
            this.togglePlayPause();
        });

        document.getElementById('reverseBtn').addEventListener('click', () => {
            this.isReversed = !this.isReversed;
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.reset();
        });

        document.getElementById('loopMode').addEventListener('change', (e) => {
            this.loopMode = e.target.value;
        });

        const timeSlider = document.getElementById('timeSlider');
        timeSlider.addEventListener('input', (e) => {
            const t = parseInt(e.target.value) / 1000;
            this.time = t * Math.PI * 2;
            this.isPlaying = false;
        });

        // Path editor
        const editBtn = document.getElementById('editModeBtn');
        editBtn.addEventListener('click', () => {
            if (this.pathEditor.enabled) {
                this.pathEditor.disable();
                editBtn.textContent = 'Enable Edit Mode';
                editBtn.classList.remove('active');
                this.loadPath(this.pathEditor.getPoints());
            } else {
                this.pathEditor.setPoints(this.path);
                this.pathEditor.enable();
                editBtn.textContent = 'Disable Edit Mode';
                editBtn.classList.add('active');
                this.isPlaying = false;
            }
        });

        // Undo/Redo
        document.getElementById('undoBtn').addEventListener('click', () => this.undo());
        document.getElementById('redoBtn').addEventListener('click', () => this.redo());

        // Audio visualizer
        document.getElementById('audioToggleBtn').addEventListener('click', async () => {
            if (this.audioViz.isActive) {
                this.audioViz.disable();
                document.getElementById('audioToggleBtn').textContent = 'Enable Microphone';
            } else {
                const success = await this.audioViz.enable();
                if (success) {
                    document.getElementById('audioToggleBtn').textContent = 'Disable Microphone';
                } else {
                    alert('Failed to access microphone');
                }
            }
        });

        document.getElementById('audioSensSlider').addEventListener('input', (e) => {
            this.audioViz.setSensitivity(parseInt(e.target.value));
            document.getElementById('audioSensitivity').textContent = e.target.value;
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Fullscreen
        document.getElementById('fullscreenBtn').addEventListener('click', () => {
            this.toggleFullscreen();
        });

        // Right panel toggle
        document.getElementById('rightPanelToggle').addEventListener('click', () => {
            const panel = document.getElementById('rightPanel');
            panel.classList.toggle('collapsed');
            document.getElementById('rightPanelToggle').textContent =
                panel.classList.contains('collapsed') ? '▶' : '◀';
        });
    }

    setupModals() {
        // Close buttons
        document.querySelectorAll('.modal .close').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.closest('.modal').classList.remove('active');
            });
        });

        // Click outside to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });

        // Gallery
        document.getElementById('galleryBtn').addEventListener('click', () => {
            this.gallery.show((path) => this.loadPath(path));
        });

        // Tutorial
        document.getElementById('tutorialBtn').addEventListener('click', () => {
            this.tutorial.show();
        });

        document.getElementById('tutorialNext').addEventListener('click', () => {
            this.tutorial.next();
        });

        document.getElementById('tutorialPrev').addEventListener('click', () => {
            this.tutorial.previous();
        });

        // Shortcuts
        document.getElementById('shortcutsBtn').addEventListener('click', () => {
            this.keyboard.showHelp();
        });

        // Share URL
        document.getElementById('shareUrlBtn').addEventListener('click', () => {
            const url = URLShare.encodePathToURL(this.path);
            if (url) {
                URLShare.showShareDialog(url);
            }
        });

        // Export GIF
        document.getElementById('exportGifBtn').addEventListener('click', () => {
            document.getElementById('exportModal').classList.add('active');
        });

        document.getElementById('startExportBtn').addEventListener('click', async () => {
            const duration = parseInt(document.getElementById('gifDuration').value);
            const frameRate = parseInt(document.getElementById('gifFrameRate').value);

            document.getElementById('exportProgress').classList.remove('hidden');
            document.getElementById('startExportBtn').disabled = true;

            try {
                await this.gifExporter.exportVideo(duration);
                alert('Export complete!');
            } catch (error) {
                alert('Export failed: ' + error.message);
            }

            document.getElementById('exportProgress').classList.add('hidden');
            document.getElementById('startExportBtn').disabled = false;
            document.getElementById('exportModal').classList.remove('active');
        });
    }

    setupTabs() {
        // Sidebar tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                const parentTabs = btn.closest('.sidebar-tabs');
                const parentContainer = btn.closest('.sidebar');

                // Update buttons
                parentTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update content
                parentContainer.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                    if (content.dataset.tab === tabName) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    setupFileHandlers() {
        // SVG Import
        document.getElementById('importSvgBtn').addEventListener('click', () => {
            document.getElementById('svgFileInput').click();
        });

        document.getElementById('svgFileInput').addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const points = await FileHandlers.importSVG(file);
                    this.loadPath(points);
                } catch (error) {
                    alert('Failed to import SVG: ' + error.message);
                }
            }
        });

        // Image Import
        document.getElementById('importImageBtn').addEventListener('click', () => {
            document.getElementById('imageFileInput').click();
        });

        document.getElementById('imageFileInput').addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const points = await FileHandlers.importImage(file);
                    this.loadPath(points);
                } catch (error) {
                    alert('Failed to import image: ' + error.message);
                }
            }
        });

        // Save Project
        document.getElementById('saveProjectBtn').addEventListener('click', () => {
            this.saveProject();
        });

        // Load Project
        document.getElementById('loadProjectBtn').addEventListener('click', () => {
            document.getElementById('projectFileInput').click();
        });

        document.getElementById('projectFileInput').addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const data = await FileHandlers.importJSON(file);
                    this.loadProject(data);
                } catch (error) {
                    alert('Failed to load project: ' + error.message);
                }
            }
        });

        // Export JSON
        document.getElementById('exportJsonBtn').addEventListener('click', () => {
            FileHandlers.exportJSON({
                path: this.path,
                settings: {
                    numEpicycles: this.numEpicycles,
                    speed: this.speed,
                    colors: this.colors
                }
            });
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
            case 'lissajous':
                points = Presets.lissajous(centerX, centerY, size);
                break;
            case 'rose':
                points = Presets.rose(centerX, centerY, size);
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

        // Update slider max
        document.getElementById('vectorSlider').max = Math.min(this.epicycles.length, 200);

        // Save to undo history
        this.undoRedo.saveState({ path: this.path });

        // Resume animation
        if (!this.drawingMode.isEnabled && !this.pathEditor.enabled) {
            this.isPlaying = true;
            document.getElementById('playPauseBtn').textContent = '⏸';
        }
    }

    saveProject() {
        const data = {
            path: this.path,
            settings: {
                numEpicycles: this.numEpicycles,
                speed: this.speed,
                trailLength: this.trailLength,
                colors: this.colors,
                showCircles: this.showCircles,
                showVectors: this.showVectors,
                showPath: this.showPath
            }
        };

        FileHandlers.exportJSON(data, 'fourier-project.json');
    }

    loadProject(data) {
        if (data.path) {
            this.loadPath(data.path);
        }

        if (data.settings) {
            const s = data.settings;
            if (s.numEpicycles) this.numEpicycles = s.numEpicycles;
            if (s.speed) this.speed = s.speed;
            if (s.trailLength) this.trailLength = s.trailLength;
            if (s.colors) this.colors = { ...this.colors, ...s.colors };
            if (typeof s.showCircles === 'boolean') this.showCircles = s.showCircles;
            if (typeof s.showVectors === 'boolean') this.showVectors = s.showVectors;
            if (typeof s.showPath === 'boolean') this.showPath = s.showPath;

            // Update UI
            document.getElementById('vectorSlider').value = this.numEpicycles;
            document.getElementById('speedSlider').value = this.speed;
            document.getElementById('trailSlider').value = this.trailLength * 100;
        }
    }

    animate = () => {
        this.draw();

        if (this.isPlaying) {
            const direction = this.isReversed ? -1 : 1;
            this.time += (Math.PI * 2 / this.epicycles.length) * this.speed * direction;

            // Handle loop modes
            if (this.time >= Math.PI * 2) {
                if (this.loopMode === 'once') {
                    this.time = Math.PI * 2;
                    this.isPlaying = false;
                } else if (this.loopMode === 'pingpong') {
                    this.isReversed = !this.isReversed;
                    this.time = Math.PI * 2;
                } else {
                    this.time = 0;
                }
            } else if (this.time < 0) {
                if (this.loopMode === 'pingpong') {
                    this.isReversed = !this.isReversed;
                    this.time = 0;
                } else {
                    this.time = Math.PI * 2;
                }
            }

            // Update timeline slider
            const t = this.time / (Math.PI * 2);
            document.getElementById('timeSlider').value = Math.floor(t * 1000);
            document.getElementById('currentTime').textContent = (t * (this.epicycles.length / 60)).toFixed(1) + 's';
        }

        // Update spectrum and audio visualizers
        this.spectrum.draw(this.epicycles, this.numEpicycles);
        if (this.audioViz.isActive) {
            this.audioViz.draw();
        }

        requestAnimationFrame(this.animate);
    }

    draw() {
        // Clear
        this.ctx.fillStyle = this.colors.bg;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

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

            const maxLength = Math.floor(this.epicycles.length * this.trailLength);
            if (this.drawnPath.length > maxLength) {
                this.drawnPath.shift();
            }
        }

        // Draw path
        if (this.showPath && this.drawnPath.length > 1) {
            this.drawPath(this.drawnPath);
        }

        // Draw current drawing
        if (this.drawingMode.isEnabled && this.drawingMode.currentPath.length > 1) {
            this.drawDrawingPath(this.drawingMode.currentPath);
        }

        // Draw path editor points
        if (this.pathEditor.enabled) {
            this.pathEditor.draw(this.ctx);
        }

        this.ctx.restore();

        this.frameCount++;
    }

    drawEpicycles(cycles) {
        const circleColor = this.hexToRgb(this.colors.circle);
        const circleAlpha = this.colors.circleOpacity;

        for (let i = 0; i < cycles.length; i++) {
            const cycle = cycles[i];

            // Draw circle
            if (this.showCircles) {
                this.ctx.beginPath();
                this.ctx.arc(cycle.center.x, cycle.center.y, cycle.radius, 0, Math.PI * 2);
                this.ctx.strokeStyle = `rgba(${circleColor.r}, ${circleColor.g}, ${circleColor.b}, ${circleAlpha})`;
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }

            // Draw vector
            if (this.showVectors) {
                this.ctx.beginPath();
                this.ctx.moveTo(cycle.center.x, cycle.center.y);
                this.ctx.lineTo(cycle.endpoint.x, cycle.endpoint.y);
                this.ctx.strokeStyle = this.colors.vector;
                this.ctx.lineWidth = 2;
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.arc(cycle.endpoint.x, cycle.endpoint.y, 3, 0, Math.PI * 2);
                this.ctx.fillStyle = this.colors.vector;
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

        if (this.rainbowMode) {
            // Rainbow gradient
            const gradient = this.ctx.createLinearGradient(
                path[0].x, path[0].y,
                path[path.length - 1].x, path[path.length - 1].y
            );
            for (let i = 0; i <= 10; i++) {
                const hue = (i / 10) * 360;
                gradient.addColorStop(i / 10, `hsl(${hue}, 70%, 60%)`);
            }
            this.ctx.strokeStyle = gradient;
        } else {
            this.ctx.strokeStyle = this.colors.path;
        }

        this.ctx.lineWidth = this.trailWidth;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        if (this.glowEffect) {
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = this.colors.path;
        }

        this.ctx.stroke();

        this.ctx.shadowBlur = 0;
    }

    drawDrawingPath(path) {
        if (path.length < 2) return;

        this.ctx.beginPath();
        this.ctx.moveTo(path[0].x, path[0].y);

        for (let i = 1; i < path.length; i++) {
            this.ctx.lineTo(path[i].x, path[i].y);
        }

        this.ctx.strokeStyle = '#10b981';
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.stroke();
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 255, g: 255, b: 255 };
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

    togglePlayPause() {
        this.isPlaying = !this.isPlaying;
        document.getElementById('playPauseBtn').textContent = this.isPlaying ? '⏸' : '▶';
    }

    reset() {
        this.time = 0;
        this.drawnPath = [];
        this.isPlaying = true;
        document.getElementById('playPauseBtn').textContent = '⏸';
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', this.theme);
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    // Keyboard shortcut handlers
    toggleCircles() { this.showCircles = !this.showCircles; }
    toggleVectors() { this.showVectors = !this.showVectors; }
    togglePath() { this.showPath = !this.showPath; }

    adjustSpeed(delta) {
        this.speed = Math.max(0.1, Math.min(5, this.speed + delta));
        document.getElementById('speedSlider').value = this.speed;
        document.getElementById('speedValue').textContent = this.speed.toFixed(1) + 'x';
    }

    adjustEpicycles(delta) {
        this.numEpicycles = Math.max(1, Math.min(this.epicycles.length, this.numEpicycles + delta));
        document.getElementById('vectorSlider').value = this.numEpicycles;
        document.getElementById('vectorCount').textContent = this.numEpicycles;
    }

    undo() {
        const state = this.undoRedo.undo();
        if (state && state.path) {
            this.loadPath(state.path);
        }
    }

    redo() {
        const state = this.undoRedo.redo();
        if (state && state.path) {
            this.loadPath(state.path);
        }
    }

    exportGif() {
        document.getElementById('exportGifBtn').click();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new FourierVisualizerPro();
    window.app = app; // For debugging
});
