"""
Fourier Transform Visualizer - Python Implementation
A modern, efficient implementation using Pygame and NumPy
"""

import pygame
import numpy as np
import json
import argparse
from pathlib import Path


class Complex:
    """Complex number operations for clarity and educational purposes"""

    @staticmethod
    def from_polar(magnitude, phase):
        """Create complex number from polar coordinates"""
        return magnitude * np.exp(1j * phase)


class FourierTransform:
    """Fourier Transform calculations using NumPy's efficient FFT"""

    @staticmethod
    def compute(signal):
        """
        Compute Discrete Fourier Transform of a signal
        Uses NumPy's FFT for O(n log n) performance
        """
        N = len(signal)
        spectrum = np.fft.fft(signal)

        # Convert to frequency components with amplitude and phase
        components = []
        for k in range(N):
            amplitude = np.abs(spectrum[k]) / N
            phase = np.angle(spectrum[k])
            components.append({
                'freq': k,
                'amplitude': amplitude,
                'phase': phase,
                'complex': spectrum[k] / N
            })

        # Sort by amplitude (most significant first)
        components.sort(key=lambda x: x['amplitude'], reverse=True)
        return components

    @staticmethod
    def reconstruct(components, time, num_components):
        """
        Reconstruct a point from frequency components at a given time
        Returns the position and all epicycle data
        """
        N = len(components)
        position = 0 + 0j
        cycles = []

        for i in range(min(num_components, len(components))):
            comp = components[i]
            angle = comp['freq'] * time + comp['phase']
            offset = Complex.from_polar(comp['amplitude'], angle)

            center = position
            position += offset

            cycles.append({
                'center': (center.real, center.imag),
                'radius': comp['amplitude'],
                'endpoint': (position.real, position.imag)
            })

        return position, cycles


class Presets:
    """Preset shapes for visualization"""

    @staticmethod
    def circle(center, radius, num_points=100):
        """Generate circle path"""
        t = np.linspace(0, 2 * np.pi, num_points, endpoint=False)
        return center + radius * np.exp(1j * t)

    @staticmethod
    def square(center, size, num_points=100):
        """Generate square path"""
        points = []
        half = size / 2
        corners = [
            center + complex(-half, -half),
            center + complex(half, -half),
            center + complex(half, half),
            center + complex(-half, half)
        ]

        points_per_side = num_points // 4
        for i in range(4):
            start = corners[i]
            end = corners[(i + 1) % 4]
            for j in range(points_per_side):
                t = j / points_per_side
                points.append(start + (end - start) * t)

        return np.array(points)

    @staticmethod
    def star(center, outer_radius, num_points=100):
        """Generate star path"""
        inner_radius = outer_radius * 0.4
        spikes = 5
        points = []

        for i in range(spikes * 2):
            radius = outer_radius if i % 2 == 0 else inner_radius
            angle = i * np.pi / spikes - np.pi / 2
            points.append(center + Complex.from_polar(radius, angle))

        # Interpolate between vertices
        result = []
        points_per_segment = num_points // len(points)
        for i in range(len(points)):
            start = points[i]
            end = points[(i + 1) % len(points)]
            for j in range(points_per_segment):
                t = j / points_per_segment
                result.append(start + (end - start) * t)

        return np.array(result)

    @staticmethod
    def heart(center, size, num_points=100):
        """Generate heart shape"""
        t = np.linspace(0, 2 * np.pi, num_points, endpoint=False)
        x = size * 16 * np.sin(t) ** 3
        y = -size * (13 * np.cos(t) - 5 * np.cos(2 * t) -
                     2 * np.cos(3 * t) - np.cos(4 * t))
        return center + (x + 1j * y) / 20


class FourierVisualizer:
    """Main visualizer application"""

    def __init__(self, width=1000, height=800, preset='circle'):
        pygame.init()
        self.width = width
        self.height = height
        self.screen = pygame.display.set_mode((width, height))
        pygame.display.set_caption('Fourier Transform Visualizer')

        self.clock = pygame.time.Clock()
        self.fps = 60

        # State
        self.running = False
        self.paused = False
        self.time = 0
        self.speed = 1.0

        # Visualization settings
        self.num_epicycles = 50
        self.show_circles = True
        self.show_vectors = True
        self.show_path = True

        # Colors (modern dark theme)
        self.bg_color = (10, 14, 39)
        self.circle_color = (255, 255, 255, 50)
        self.vector_color = (59, 130, 246)
        self.path_color = (59, 130, 246)
        self.text_color = (228, 228, 231)
        self.ui_bg_color = (21, 25, 53)

        # Data
        self.path = []
        self.components = []
        self.drawn_path = []

        # Font
        self.font = pygame.font.Font(None, 24)
        self.font_small = pygame.font.Font(None, 20)

        # Load initial preset
        self.load_preset(preset)

    def load_preset(self, preset_name):
        """Load a preset shape"""
        center = 0 + 0j
        size = min(self.width, self.height) * 0.25

        presets_map = {
            'circle': lambda: Presets.circle(center, size),
            'square': lambda: Presets.square(center, size * 1.2),
            'star': lambda: Presets.star(center, size),
            'heart': lambda: Presets.heart(center, size)
        }

        if preset_name in presets_map:
            self.path = presets_map[preset_name]()
        else:
            self.path = Presets.circle(center, size)

        self.components = FourierTransform.compute(self.path)
        self.time = 0
        self.drawn_path = []

    def load_from_file(self, filename):
        """Load path from JSON file"""
        with open(filename, 'r') as f:
            data = json.load(f)
            points = data['points']

        # Convert to complex numbers
        path = []
        for i in range(0, len(points), 2):
            path.append(complex(points[i], points[i + 1]))

        self.path = np.array(path)

        # Center the path
        mean_x = np.mean(np.real(self.path))
        mean_y = np.mean(np.imag(self.path))
        self.path -= (mean_x + 1j * mean_y)

        self.components = FourierTransform.compute(self.path)
        self.time = 0
        self.drawn_path = []

    def handle_events(self):
        """Handle user input"""
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False

            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:
                    self.paused = not self.paused

                elif event.key == pygame.K_r:
                    self.time = 0
                    self.drawn_path = []

                elif event.key == pygame.K_UP:
                    self.num_epicycles = min(self.num_epicycles + 10,
                                            len(self.components))

                elif event.key == pygame.K_DOWN:
                    self.num_epicycles = max(self.num_epicycles - 10, 1)

                elif event.key == pygame.K_RIGHT:
                    self.speed = min(self.speed + 0.1, 5.0)

                elif event.key == pygame.K_LEFT:
                    self.speed = max(self.speed - 0.1, 0.1)

                elif event.key == pygame.K_c:
                    self.show_circles = not self.show_circles

                elif event.key == pygame.K_v:
                    self.show_vectors = not self.show_vectors

                elif event.key == pygame.K_p:
                    self.show_path = not self.show_path

                elif event.key == pygame.K_1:
                    self.load_preset('circle')

                elif event.key == pygame.K_2:
                    self.load_preset('square')

                elif event.key == pygame.K_3:
                    self.load_preset('star')

                elif event.key == pygame.K_4:
                    self.load_preset('heart')

                elif event.key == pygame.K_ESCAPE:
                    self.running = False

    def draw(self):
        """Draw the visualization"""
        self.screen.fill(self.bg_color)

        # Center of screen
        cx = self.width // 2
        cy = self.height // 2

        # Reconstruct current point
        position, cycles = FourierTransform.reconstruct(
            self.components, self.time, self.num_epicycles
        )

        # Draw epicycles
        if self.show_circles or self.show_vectors:
            for cycle in cycles:
                center = cycle['center']
                radius = cycle['radius']
                endpoint = cycle['endpoint']

                screen_center = (int(cx + center[0]), int(cy + center[1]))
                screen_endpoint = (int(cx + endpoint[0]), int(cy + endpoint[1]))

                # Draw circle
                if self.show_circles and radius > 0.5:
                    surf = pygame.Surface((self.width, self.height), pygame.SRCALPHA)
                    pygame.draw.circle(surf, self.circle_color, screen_center,
                                     int(radius), 1)
                    self.screen.blit(surf, (0, 0))

                # Draw vector
                if self.show_vectors:
                    pygame.draw.line(self.screen, self.vector_color,
                                   screen_center, screen_endpoint, 2)
                    pygame.draw.circle(self.screen, self.vector_color,
                                     screen_endpoint, 4)

        # Update drawn path
        if not self.paused:
            self.drawn_path.append(position)
            max_length = int(len(self.components) * 0.9)
            if len(self.drawn_path) > max_length:
                self.drawn_path.pop(0)

        # Draw path
        if self.show_path and len(self.drawn_path) > 1:
            points = [(int(cx + p.real), int(cy + p.imag))
                     for p in self.drawn_path]

            for i in range(len(points) - 1):
                alpha = int(255 * (i + 1) / len(points))
                color = (*self.path_color, alpha)
                surf = pygame.Surface((self.width, self.height), pygame.SRCALPHA)
                pygame.draw.line(surf, color, points[i], points[i + 1], 3)
                self.screen.blit(surf, (0, 0))

        # Draw UI
        self.draw_ui()

    def draw_ui(self):
        """Draw user interface elements"""
        padding = 20
        y_offset = padding

        # Background panel
        panel_width = 280
        panel_height = 280
        panel = pygame.Surface((panel_width, panel_height), pygame.SRCALPHA)
        panel.fill((*self.ui_bg_color, 200))
        self.screen.blit(panel, (padding, padding))

        # Title
        title = self.font.render('Fourier Transform', True, self.text_color)
        self.screen.blit(title, (padding + 10, y_offset + 10))
        y_offset += 40

        # Controls
        controls = [
            f'Epicycles: {self.num_epicycles} / {len(self.components)}',
            f'Speed: {self.speed:.1f}x',
            f'Status: {"Paused" if self.paused else "Running"}',
            '',
            'Controls:',
            'SPACE - Pause/Play',
            'R - Reset',
            'UP/DOWN - Epicycles',
            'LEFT/RIGHT - Speed',
            'C - Toggle Circles',
            'V - Toggle Vectors',
            'P - Toggle Path',
            '1-4 - Presets',
            'ESC - Quit'
        ]

        for line in controls:
            if line:
                text = self.font_small.render(line, True, self.text_color)
                self.screen.blit(text, (padding + 10, y_offset + 10))
            y_offset += 22

        # FPS
        fps_text = self.font_small.render(
            f'FPS: {int(self.clock.get_fps())}',
            True, self.text_color
        )
        self.screen.blit(fps_text, (self.width - 100, padding))

    def run(self):
        """Main application loop"""
        self.running = True

        while self.running:
            self.handle_events()
            self.draw()

            # Update time
            if not self.paused:
                dt = (2 * np.pi / len(self.components)) * self.speed
                self.time += dt

                # Reset after full cycle
                if self.time >= 2 * np.pi:
                    self.time = 0

            pygame.display.flip()
            self.clock.tick(self.fps)

        pygame.quit()


def main():
    """Entry point"""
    parser = argparse.ArgumentParser(
        description='Fourier Transform Visualizer'
    )
    parser.add_argument(
        '--preset',
        choices=['circle', 'square', 'star', 'heart'],
        default='circle',
        help='Initial preset shape'
    )
    parser.add_argument(
        '--file',
        type=str,
        help='Load path from JSON file'
    )
    parser.add_argument(
        '--width',
        type=int,
        default=1000,
        help='Window width'
    )
    parser.add_argument(
        '--height',
        type=int,
        default=800,
        help='Window height'
    )

    args = parser.parse_args()

    visualizer = FourierVisualizer(args.width, args.height, args.preset)

    if args.file:
        visualizer.load_from_file(args.file)

    visualizer.run()


if __name__ == '__main__':
    main()
