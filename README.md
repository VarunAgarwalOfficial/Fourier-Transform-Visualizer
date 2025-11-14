# Fourier Transform Visualizer Pro

An advanced interactive visualization tool that demonstrates how any path or drawing can be represented as a sum of rotating circles (epicycles) using the Discrete Fourier Transform. Now with 20+ professional features!

![Fourier Transform Visualization](screenshots/1.gif)

## Features Overview

### 🎨 Input Methods
- **8 Built-in Presets**: Circle, Square, Triangle, Star, Heart, Spiral, Lissajous, Rose
- **Custom Drawing**: Draw freehand shapes with mouse/touch
- **Parametric Equations**: Enter mathematical formulas (e.g., `sin(3*t)`, `cos(t)*exp(t)`)
- **SVG Import**: Upload SVG files and extract paths automatically
- **Image Import**: Upload images with edge detection
- **Example Gallery**: Curated collection of interesting shapes

### 🎬 Animation Controls
- **Timeline Scrubber**: Drag to any point in the animation
- **Playback Speed**: 0.1x to 5.0x speed control
- **Loop Modes**: Repeat, Once, or Ping-Pong
- **Reverse Playback**: Play animation backwards
- **Step Mode**: Step through one epicycle at a time

### 🎨 Visual Customization
- **Full Color Control**: Customize background, circles, vectors, and path colors
- **Rainbow Mode**: Animated rainbow gradient trails
- **Glow Effects**: Add glow/bloom to paths
- **Particle Effects**: Trailing particle system
- **Trail Width**: Adjust path thickness (1-10px)
- **Opacity Controls**: Adjustable transparency for all elements

### 🛠️ Advanced Tools
- **Path Editor**: Click, drag, add, or remove individual points (double-click)
- **Undo/Redo**: Full history system (Ctrl+Z / Ctrl+Y)
- **Epicycle Control**: 1-200 rotating circles
- **Trail Length**: Show 10-100% of the drawn path
- **Performance Mode**: Optimize for slower devices

### 📊 Analysis Tools
- **Frequency Spectrum**: Bar chart showing amplitude of each frequency
- **Math Panel**: View actual Fourier coefficients and equations
- **Audio Visualizer**: Real-time microphone input visualization
- **FPS Counter**: Performance monitoring

### 💾 Import/Export
- **Save Projects**: Export complete project as JSON
- **Load Projects**: Resume saved work
- **Export GIF/Video**: Create sharable animations
- **Share URL**: Encode paths in URL for easy sharing
- **Export Coefficients**: Download math data as JSON

### ⌨️ Keyboard Shortcuts
- **Space**: Play/Pause
- **R**: Reset animation
- **↑/↓**: More/fewer epicycles
- **←/→**: Slower/faster speed
- **C/V/P**: Toggle circles/vectors/path
- **1-6**: Load presets quickly
- **Ctrl+S**: Save project
- **Ctrl+Z/Y**: Undo/Redo
- **F**: Fullscreen
- **T**: Toggle theme
- **H or ?**: Show all shortcuts

### 🎓 Learning Features
- **Interactive Tutorial**: Step-by-step guide for new users
- **Keyboard Shortcuts Help**: Quick reference modal
- **Tooltips**: Hover hints on all controls
- **Math Explanations**: Understanding the Fourier Transform

## Quick Start

### Web Version (Instant)

Simply open `index.html` in any modern browser. No installation needed!

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx serve

# Then visit http://localhost:8000
```

### Python Version

```bash
# Install dependencies
pip install -r requirements.txt

# Run with default circle preset
python python/fourier_visualizer.py

# Run with specific preset
python python/fourier_visualizer.py --preset star

# Load custom path from JSON
python python/fourier_visualizer.py --file data.json
```

## Usage Guide

### Basic Workflow

1. **Choose an Input Method**:
   - Click a preset button
   - Draw custom shape
   - Enter parametric equations
   - Import SVG or image

2. **Customize Visualization**:
   - Adjust number of epicycles for detail
   - Change colors and effects
   - Control animation speed

3. **Export or Share**:
   - Save project for later
   - Export as GIF/video
   - Share via URL

### Drawing Custom Shapes

1. Open the **Input** tab (left sidebar)
2. Click **"Enable Drawing"**
3. Draw on the canvas
4. Click **"Finish Drawing"**

The path will be automatically processed and converted to epicycles!

### Using Parametric Equations

1. Open the **Input** tab
2. Scroll to **Parametric Equation** section
3. Enter formulas for X(t) and Y(t)
4. Click **"Apply"**

**Examples**:
- Circle: `X(t) = cos(t)`, `Y(t) = sin(t)`
- Lissajous: `X(t) = sin(3*t)`, `Y(t) = sin(4*t)`
- Butterfly: `X(t) = sin(t)*(exp(cos(t))-2*cos(4*t))`

**Available Functions**: sin, cos, tan, abs, sqrt, pow, exp, log, floor, ceil, round

### Path Editing

1. Open the **Advanced** tab
2. Click **"Enable Edit Mode"**
3. Drag points to move them
4. Double-click to add/remove points
5. Click **"Disable Edit Mode"** to apply changes

### Importing Files

**SVG Files**:
- Click **Import SVG** in toolbar
- Select .svg file
- First path will be extracted automatically

**Images**:
- Click **Import Image** in toolbar
- Select any image file
- Edge detection extracts the shape

### Exporting

**As Project**:
- Click **Save** in toolbar
- Downloads .json with path and settings

**As Animation**:
- Click **Export GIF** in toolbar
- Set duration and quality
- Creates video file (WebM format)

**Share URL**:
- Click **Share URL** in toolbar
- URL with encoded path copied to clipboard

## Architecture

### Project Structure

```
Fourier-Transform-Visualizer/
├── index.html              # Main application
├── css/
│   └── style.css           # Complete UI styling (817 lines)
├── js/
│   ├── complex.js          # Complex number operations
│   ├── fourier.js          # FFT implementation
│   ├── presets.js          # Shape generators
│   ├── drawing.js          # Drawing mode + path simplification
│   ├── pathEditor.js       # Point manipulation
│   ├── parametric.js       # Equation parser
│   ├── fileHandlers.js     # SVG/Image/JSON import
│   ├── exportGif.js        # Animation export
│   ├── urlShare.js         # URL encoding/decoding
│   ├── spectrum.js         # Frequency visualization
│   ├── audioVisualizer.js  # Microphone input
│   ├── gallery.js          # Example collection
│   ├── tutorial.js         # Interactive guide
│   ├── keyboard.js         # Shortcut system
│   ├── undoRedo.js         # History management
│   └── main.js             # Application integration (829 lines)
├── python/
│   └── fourier_visualizer.py  # Python implementation
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

### Technical Details

**Web Implementation**:
- **Pure JavaScript**: Zero runtime dependencies
- **FFT Algorithm**: Cooley-Tukey radix-2 for O(n log n) performance
- **Canvas 2D API**: Hardware-accelerated rendering
- **Modular Architecture**: 14 independent modules
- **Responsive Design**: Mobile-friendly interface
- **Theme Support**: Dark and light modes
- **URL State Management**: Shareable configurations

**Python Implementation**:
- **NumPy FFT**: Highly optimized C implementation
- **Pygame Graphics**: Hardware-accelerated rendering
- **Command-line Interface**: Argparse for flexibility
- **Interactive Controls**: Real-time keyboard input

### Performance

- **Web**: Maintains 60 FPS with 100+ epicycles
- **Python**: Handles 200+ epicycles smoothly
- **FFT**: O(n log n) vs naive DFT's O(n²)
- **Path Simplification**: Douglas-Peucker algorithm reduces points
- **Efficient Rendering**: Only active elements drawn

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with Canvas API support

## Mathematical Background

The Fourier Transform decomposes any periodic function into a sum of sine and cosine waves. In the complex plane, this becomes rotating circles:

```
f(t) = Σ c_n * e^(i*n*t)
```

Where:
- `c_n` = Fourier coefficient (amplitude + phase)
- `n` = frequency (rotation speed)
- `t` = time parameter

Each term `c_n * e^(i*n*t)` represents one rotating circle (epicycle). The sum of all circles traces the original path!

### Why It Works

1. Any closed path can be parameterized as a function
2. Fourier analysis finds the frequency components
3. Each frequency becomes a rotating circle
4. Circles combine to recreate the original

## Educational Use

Perfect for:
- Learning Fourier analysis concepts
- Understanding signal processing
- Teaching complex numbers geometrically
- Demonstrating frequency domain concepts
- Interactive mathematics education
- STEM demonstrations

## Tips & Tricks

### For Best Results

- **More epicycles = more detail** (but slower performance)
- **Use presets to learn** how different shapes decompose
- **Try parametric equations** for mathematical shapes
- **Enable rainbow mode** for beautiful visualizations
- **Use step mode** to understand individual frequencies
- **Check the spectrum** to see which frequencies dominate

### Performance Optimization

- Reduce epicycle count on slow devices
- Decrease trail length to reduce drawing
- Disable circles/vectors if only interested in path
- Use performance mode for older hardware
- Close right panel when not needed

### Creative Uses

- Create mathematical art from equations
- Convert signatures to Fourier series
- Analyze logo designs
- Generate unique animations for sharing
- Educational demonstrations
- Interactive math exhibits

## FAQ

**Q: What's the difference between DFT and FFT?**
A: Same result, different algorithms. FFT is much faster (O(n log n) vs O(n²)).

**Q: Why do some shapes need more epicycles?**
A: Complex shapes with sharp corners or fine details require more frequency components.

**Q: Can I use my own SVG files?**
A: Yes! Click "Import SVG" and select any .svg file. The first path will be used.

**Q: How do I save my work?**
A: Click "Save" to download a project file, or "Share URL" for a link.

**Q: What equation format do I use?**
A: JavaScript math syntax. Examples: `sin(t)`, `cos(3*t)`, `pow(sin(t),3)`, `exp(cos(t))`

**Q: Why is my GIF export a video file?**
A: Modern browsers use WebM format. Convert to GIF using online tools if needed.

## Known Limitations

- GIF export creates WebM video (browser limitation)
- SVG import only uses first path element
- Image edge detection is basic (works best with high contrast)
- Audio visualizer requires microphone permission
- Some features require modern browser

## Future Enhancements

Potential additions:
- True GIF export (requires external library)
- 3D visualization mode
- Multiple simultaneous paths with blending
- Advanced SVG path support
- Webcam-based shape detection
- Collaborative sharing platform
- Mobile app version

## Credits

- **Fourier Transform Theory**: Jean-Baptiste Joseph Fourier
- **FFT Algorithm**: Cooley-Tukey (1965)
- **Inspiration**: 3Blue1Brown's Fourier series visualization
- **Mathematical Foundations**: Complex analysis and signal processing

## License

MIT License - See LICENSE file for details.

## Contributing

Contributions welcome! Areas for improvement:
- Additional preset shapes
- Better image processing algorithms
- More parametric equation examples
- Additional export formats
- Performance optimizations
- Mobile enhancements
- Accessibility improvements

## Support

For issues or questions:
1. Check the interactive tutorial (click Tutorial button)
2. Press **H** for keyboard shortcuts
3. Review this README
4. Open an issue on the repository

---

**Experience the beauty of mathematics through interactive visualization!**

Built with ❤️ for education and exploration of Fourier analysis.
