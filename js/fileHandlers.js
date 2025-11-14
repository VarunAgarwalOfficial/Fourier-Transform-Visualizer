/**
 * File import/export handlers (SVG, Image, JSON)
 */

class FileHandlers {
    /**
     * Import SVG file and extract path
     */
    static async importSVG(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const svgText = e.target.result;
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(svgText, 'image/svg+xml');

                    // Find all path elements
                    const paths = doc.querySelectorAll('path');

                    if (paths.length === 0) {
                        reject(new Error('No paths found in SVG'));
                        return;
                    }

                    // Get first path data
                    const pathData = paths[0].getAttribute('d');
                    const points = this.parseSVGPath(pathData);

                    resolve(points);
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    /**
     * Parse SVG path data to points
     */
    static parseSVGPath(pathData, numSamples = 200) {
        // Create temporary SVG
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        svg.appendChild(path);

        const length = path.getTotalLength();
        const points = [];

        for (let i = 0; i < numSamples; i++) {
            const point = path.getPointAtLength((i / numSamples) * length);
            points.push({ x: point.x, y: point.y });
        }

        return this.centerPoints(points);
    }

    /**
     * Import image and detect edges
     */
    static async importImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const img = new Image();

                img.onload = () => {
                    try {
                        const points = this.imageToPoints(img);
                        resolve(points);
                    } catch (error) {
                        reject(error);
                    }
                };

                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = e.target.result;
            };

            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }

    /**
     * Convert image to points using edge detection
     */
    static imageToPoints(img, threshold = 128) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Resize for performance
        const maxSize = 300;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Simple edge detection
        const points = [];
        const step = 3;

        for (let y = 0; y < canvas.height; y += step) {
            for (let x = 0; x < canvas.width; x += step) {
                const i = (y * canvas.width + x) * 4;
                const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;

                if (brightness < threshold) {
                    points.push({ x, y });
                }
            }
        }

        if (points.length === 0) {
            throw new Error('No edges detected. Try adjusting the image.');
        }

        // Sample if too many points
        const maxPoints = 200;
        if (points.length > maxPoints) {
            const sampled = [];
            const step = Math.floor(points.length / maxPoints);
            for (let i = 0; i < points.length; i += step) {
                sampled.push(points[i]);
            }
            return this.centerPoints(sampled);
        }

        return this.centerPoints(points);
    }

    /**
     * Center and normalize points
     */
    static centerPoints(points) {
        if (points.length === 0) return [];

        // Find bounds
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        for (const p of points) {
            minX = Math.min(minX, p.x);
            maxX = Math.max(maxX, p.x);
            minY = Math.min(minY, p.y);
            maxY = Math.max(maxY, p.y);
        }

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        // Center and scale
        const range = Math.max(maxX - minX, maxY - minY);
        const scale = range > 0 ? 300 / range : 1;

        return points.map(p => ({
            x: (p.x - centerX) * scale,
            y: (p.y - centerY) * scale
        }));
    }

    /**
     * Export project as JSON
     */
    static exportJSON(data, filename = 'fourier-project.json') {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        this.downloadBlob(blob, filename);
    }

    /**
     * Import project from JSON
     */
    static async importJSON(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    resolve(data);
                } catch (error) {
                    reject(new Error('Invalid JSON file'));
                }
            };

            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    /**
     * Download blob as file
     */
    static downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}
