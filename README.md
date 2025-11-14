# Fourier Transform Visualizer

An interactive visualization tool that demonstrates how any path or drawing can be represented as a sum of rotating circles (epicycles) using the Discrete Fourier Transform.

![Fourier Transform Visualization](screenshots/1.gif)

## Features

### Web Version
- **Interactive Drawing**: Draw custom shapes and watch them transform into epicycles
- **Preset Shapes**: Circle, square, triangle, star, heart, and spiral
- **Real-time Controls**: Adjust number of epicycles, speed, and trail length
- **Modern UI**: Beautiful dark/light theme with responsive design
- **Performance**: Efficient FFT implementation with 60 FPS rendering
- **Customization**: Toggle circles, vectors, and path display

### Python Version
- **High Performance**: NumPy FFT implementation for fast computation
- **Keyboard Controls**: Interactive controls for real-time adjustments
- **Multiple Presets**: Built-in shapes plus custom JSON file support
- **Modern Graphics**: Pygame-based rendering with smooth animations

## Quick Start

### Web Version

Simply open `index.html` in a modern web browser. No installation required!

```bash
# Using Python's built-in HTTP server
python3 -m http.server 8000
# Then open http://localhost:8000 in your browser
```

Or use any other static file server:

```bash
# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

### Python Version

1. **Install Dependencies**
```bash
pip install -r requirements.txt
```

2. **Run the Visualizer**
```bash
# With default circle preset
python python/fourier_visualizer.py

# With specific preset
python python/fourier_visualizer.py --preset star

# Load custom path from JSON
python python/fourier_visualizer.py --file data.json

# Custom window size
python python/fourier_visualizer.py --width 1200 --height 900
```

## How It Works

The Fourier Transform is a mathematical tool that decomposes any periodic function into a sum of sine and cosine waves (or equivalently, rotating circles in the complex plane).

### The Mathematics

For a path represented as a sequence of complex numbers, the Discrete Fourier Transform is:

```
X[k] = Σ(n=0 to N-1) x[n] * e^(-i*2π*k*n/N)
```

Where:
- `X[k]` is the k-th frequency component
- `x[n]` is the input signal (path points)
- `N` is the number of points
- `k` is the frequency index

Each frequency component can be represented as a rotating circle (epicycle) with:
- **Amplitude**: `|X[k]|` - the radius of the circle
- **Phase**: `arg(X[k])` - the initial angle
- **Frequency**: `k` - how fast it rotates

### The Implementation

1. **Path Sampling**: Convert the input path into discrete points
2. **FFT Computation**: Apply Fast Fourier Transform (O(n log n) complexity)
3. **Component Sorting**: Sort frequency components by amplitude
4. **Reconstruction**: At each time step, sum all rotating vectors
5. **Visualization**: Draw the epicycles and trace the resulting path

## Web Interface Controls

### Presets
- Click any preset button to load predefined shapes
- Available: Circle, Square, Triangle, Star, Heart, Spiral

### Drawing Mode
1. Click "Enable Drawing"
2. Draw on the canvas with your mouse or touch
3. Click "Finish Drawing" to process your drawing
4. Use "Clear Drawing" to start over

### Sliders
- **Epicycles**: Controls how many frequency components to display (1-200)
- **Speed**: Animation speed multiplier (0.1x - 3.0x)
- **Trail Length**: How much of the path to show (10% - 100%)

### Toggles
- **Show Circles**: Display the rotating circles
- **Show Vectors**: Display the radius vectors
- **Show Path**: Display the traced path

### Buttons
- **Pause/Play**: Control animation
- **Reset**: Reset to the beginning
- **Toggle Theme**: Switch between dark and light themes

## Python Keyboard Controls

| Key | Action |
|-----|--------|
| `SPACE` | Pause/Play animation |
| `R` | Reset to beginning |
| `↑` / `↓` | Increase/decrease epicycles |
| `←` / `→` | Decrease/increase speed |
| `C` | Toggle circles display |
| `V` | Toggle vectors display |
| `P` | Toggle path display |
| `1` | Load circle preset |
| `2` | Load square preset |
| `3` | Load star preset |
| `4` | Load heart preset |
| `ESC` | Exit application |

## Project Structure

```
Fourier-Transform-Visualizer/
├── index.html              # Main web application
├── css/
│   └── style.css          # Styles with dark/light theme
├── js/
│   ├── complex.js         # Complex number operations
│   ├── fourier.js         # DFT/FFT implementation
│   ├── presets.js         # Preset shape generators
│   ├── drawing.js         # Drawing mode functionality
│   └── main.js            # Main application logic
├── python/
│   ├── fourier_visualizer.py  # Modern Python implementation
│   ├── data.json          # Sample path data
│   └── happy.json         # Additional sample data
├── screenshots/
│   └── 1.gif              # Demo animation
├── requirements.txt       # Python dependencies
├── LICENSE               # Project license
└── README.md             # This file
```

## Technical Details

### Web Implementation
- **Pure JavaScript**: No external dependencies (except browser APIs)
- **FFT Algorithm**: Cooley-Tukey radix-2 FFT for O(n log n) performance
- **Canvas API**: Hardware-accelerated 2D rendering
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern CSS**: CSS Grid, Flexbox, CSS Variables for theming

### Python Implementation
- **NumPy FFT**: Leverages highly optimized C implementation
- **Pygame**: Hardware-accelerated graphics with alpha blending
- **Modular Design**: Clean separation of concerns
- **Type Hints**: Modern Python 3.7+ features
- **Argparse**: Command-line interface for easy customization

### Performance
- Web: Maintains 60 FPS with 100+ epicycles
- Python: Handles 200+ epicycles smoothly on modern hardware
- FFT: O(n log n) vs naive DFT's O(n²)

## Creating Custom Shapes

### Using JSON Files

Create a JSON file with your path data:

```json
{
  "points": [
    x1, y1,
    x2, y2,
    x3, y3,
    ...
  ]
}
```

Load it in Python:
```bash
python python/fourier_visualizer.py --file your_shape.json
```

### Drawing Custom Shapes (Web)

1. Open the web version
2. Click "Enable Drawing"
3. Draw your shape on the canvas
4. Click "Finish Drawing"

The path will be automatically simplified and processed using the Douglas-Peucker algorithm.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with Canvas support

## Mathematical Background

The Fourier Transform reveals that any periodic function can be expressed as a sum of simple sine and cosine waves. In the complex plane, this translates to rotating circles:

- Each circle rotates at a specific frequency
- The radius represents the amplitude of that frequency
- The initial angle represents the phase
- Summing all the circle endpoints traces the original path

This visualization makes the abstract concept of Fourier analysis tangible and intuitive.

## Educational Use

This tool is perfect for:
- Learning about Fourier analysis
- Understanding signal processing concepts
- Teaching complex numbers and their geometric interpretation
- Demonstrating the connection between time and frequency domains
- Exploring the mathematics behind epicycles

## Performance Tips

### Web Version
- Reduce number of epicycles for smoother animation on slower devices
- Decrease trail length to reduce drawing overhead
- Disable circles/vectors if only interested in the final path

### Python Version
- Use presets for best performance
- Reduce window size for better FPS on older hardware
- Limit epicycle count for real-time responsiveness

## Contributing

Contributions are welcome! Areas for improvement:
- Additional preset shapes
- SVG file import
- Export animations as GIF/video
- 3D visualization
- More color themes
- Mobile optimizations

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by 3Blue1Brown's excellent Fourier series visualization
- FFT algorithm based on Cooley-Tukey radix-2 method
- Mathematical foundations from Jean-Baptiste Joseph Fourier's work

## Support

For issues, questions, or suggestions, please open an issue on the project repository.

---

**Enjoy exploring the beautiful mathematics of Fourier transforms!**
