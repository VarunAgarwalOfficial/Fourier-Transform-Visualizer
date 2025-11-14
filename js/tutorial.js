/**
 * Interactive tutorial system
 */

class Tutorial {
    constructor() {
        this.currentStep = 0;
        this.steps = this.createSteps();
    }

    /**
     * Create tutorial steps
     */
    createSteps() {
        return [
            {
                title: 'Welcome to Fourier Transform Visualizer!',
                content: `
                    <h3>What is this?</h3>
                    <p>This tool visualizes how any path or drawing can be represented as a sum of rotating circles (epicycles) using the Fourier Transform.</p>
                    <p>Each circle rotates at a specific frequency, and when combined, they trace out your original path!</p>
                `
            },
            {
                title: 'Getting Started',
                content: `
                    <h3>Try a Preset</h3>
                    <p>Click on any preset button in the <strong>Input</strong> tab (left sidebar) to load a shape:</p>
                    <ul>
                        <li>Circle, Square, Triangle</li>
                        <li>Star, Heart, Spiral</li>
                        <li>Lissajous, Rose</li>
                    </ul>
                    <p>Watch as the rotating circles (epicycles) recreate the shape!</p>
                `
            },
            {
                title: 'Drawing Custom Shapes',
                content: `
                    <h3>Draw Your Own</h3>
                    <p>In the <strong>Input</strong> tab:</p>
                    <ol>
                        <li>Click "Enable Drawing"</li>
                        <li>Draw on the canvas with your mouse</li>
                        <li>Click "Finish Drawing" when done</li>
                    </ol>
                    <p>Your drawing will be automatically converted to epicycles!</p>
                `
            },
            {
                title: 'Controls',
                content: `
                    <h3>Adjust the Visualization</h3>
                    <p>In the <strong>Controls</strong> tab:</p>
                    <ul>
                        <li><strong>Epicycles:</strong> More circles = more detail</li>
                        <li><strong>Speed:</strong> Control animation speed</li>
                        <li><strong>Trail Length:</strong> How much of the path to show</li>
                        <li>Toggle circles, vectors, and path visibility</li>
                    </ul>
                `
            },
            {
                title: 'Appearance',
                content: `
                    <h3>Customize Colors & Effects</h3>
                    <p>In the <strong>Appearance</strong> tab:</p>
                    <ul>
                        <li>Change colors for background, circles, vectors, and path</li>
                        <li>Enable rainbow trails for a colorful effect</li>
                        <li>Add glow or particle effects</li>
                        <li>Adjust trail width</li>
                    </ul>
                `
            },
            {
                title: 'Advanced Features',
                content: `
                    <h3>Power User Tools</h3>
                    <p>In the <strong>Advanced</strong> tab:</p>
                    <ul>
                        <li><strong>Path Editor:</strong> Manually edit individual points</li>
                        <li><strong>Step Mode:</strong> Step through one epicycle at a time</li>
                        <li><strong>Performance Mode:</strong> Optimize for slower devices</li>
                        <li><strong>Multiple Paths:</strong> Animate several shapes at once</li>
                    </ul>
                `
            },
            {
                title: 'Parametric Equations',
                content: `
                    <h3>Math-Powered Shapes</h3>
                    <p>In the <strong>Input</strong> tab, try entering equations:</p>
                    <ul>
                        <li><code>X(t) = cos(t)</code>, <code>Y(t) = sin(t)</code> → Circle</li>
                        <li><code>X(t) = sin(3*t)</code>, <code>Y(t) = sin(4*t)</code> → Lissajous</li>
                        <li><code>X(t) = sin(t)*(exp(cos(t)))</code> → Complex shapes!</li>
                    </ul>
                    <p>Use functions like sin, cos, tan, exp, sqrt, pow, etc.</p>
                `
            },
            {
                title: 'Frequency Spectrum',
                content: `
                    <h3>Understanding the Math</h3>
                    <p>Open the <strong>right panel</strong> to see:</p>
                    <ul>
                        <li><strong>Spectrum:</strong> Bar chart of frequency components</li>
                        <li><strong>Math:</strong> Actual Fourier coefficients</li>
                        <li><strong>Audio:</strong> Create shapes from microphone input</li>
                    </ul>
                `
            },
            {
                title: 'Keyboard Shortcuts',
                content: `
                    <h3>Work Faster</h3>
                    <ul>
                        <li><strong>Space:</strong> Play/Pause</li>
                        <li><strong>R:</strong> Reset</li>
                        <li><strong>↑/↓:</strong> Adjust epicycles</li>
                        <li><strong>←/→:</strong> Adjust speed</li>
                        <li><strong>C/V/P:</strong> Toggle circles/vectors/path</li>
                        <li><strong>1-6:</strong> Load presets</li>
                        <li><strong>Ctrl+S:</strong> Save project</li>
                        <li><strong>H or ?:</strong> Show all shortcuts</li>
                    </ul>
                `
            },
            {
                title: 'Save & Share',
                content: `
                    <h3>Save Your Work</h3>
                    <p>Use the toolbar buttons:</p>
                    <ul>
                        <li><strong>Save:</strong> Download project as JSON</li>
                        <li><strong>Load:</strong> Open saved project</li>
                        <li><strong>Export GIF:</strong> Create animated GIF</li>
                        <li><strong>Share URL:</strong> Get shareable link</li>
                        <li><strong>Import SVG/Image:</strong> Convert to Fourier path</li>
                    </ul>
                `
            },
            {
                title: 'You're Ready!',
                content: `
                    <h3>Start Creating</h3>
                    <p>You now know all the features. Have fun exploring the mathematics of Fourier Transforms through beautiful visualizations!</p>
                    <p>Tips:</p>
                    <ul>
                        <li>Try the gallery for curated examples</li>
                        <li>Experiment with parametric equations</li>
                        <li>Share your creations via URL</li>
                        <li>Press <strong>H</strong> anytime for keyboard shortcuts</li>
                    </ul>
                    <p><strong>Happy visualizing!</strong></p>
                `
            }
        ];
    }

    /**
     * Show tutorial modal
     */
    show() {
        this.currentStep = 0;
        this.updateDisplay();
        document.getElementById('tutorialModal').classList.add('active');
    }

    /**
     * Update tutorial display
     */
    updateDisplay() {
        const step = this.steps[this.currentStep];
        const content = document.getElementById('tutorialContent');
        const progress = document.getElementById('tutorialProgress');
        const prevBtn = document.getElementById('tutorialPrev');
        const nextBtn = document.getElementById('tutorialNext');

        content.innerHTML = `
            <h2>${step.title}</h2>
            ${step.content}
        `;

        progress.textContent = `Step ${this.currentStep + 1} of ${this.steps.length}`;

        prevBtn.disabled = this.currentStep === 0;
        nextBtn.textContent = this.currentStep === this.steps.length - 1 ? 'Finish' : 'Next';
    }

    /**
     * Go to next step
     */
    next() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.updateDisplay();
        } else {
            this.close();
        }
    }

    /**
     * Go to previous step
     */
    previous() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.updateDisplay();
        }
    }

    /**
     * Close tutorial
     */
    close() {
        document.getElementById('tutorialModal').classList.remove('active');
    }
}
