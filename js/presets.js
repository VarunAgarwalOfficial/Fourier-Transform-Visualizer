/**
 * Preset shapes for the Fourier Transform visualizer
 */

const Presets = {
    /**
     * Generate a circle path
     */
    circle: function(centerX, centerY, radius, numPoints = 100) {
        const points = [];
        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            points.push({
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            });
        }
        return points;
    },

    /**
     * Generate a square path
     */
    square: function(centerX, centerY, size, numPoints = 100) {
        const points = [];
        const half = size / 2;
        const pointsPerSide = Math.floor(numPoints / 4);

        // Top side
        for (let i = 0; i < pointsPerSide; i++) {
            const t = i / pointsPerSide;
            points.push({
                x: centerX - half + size * t,
                y: centerY - half
            });
        }

        // Right side
        for (let i = 0; i < pointsPerSide; i++) {
            const t = i / pointsPerSide;
            points.push({
                x: centerX + half,
                y: centerY - half + size * t
            });
        }

        // Bottom side
        for (let i = 0; i < pointsPerSide; i++) {
            const t = i / pointsPerSide;
            points.push({
                x: centerX + half - size * t,
                y: centerY + half
            });
        }

        // Left side
        for (let i = 0; i < pointsPerSide; i++) {
            const t = i / pointsPerSide;
            points.push({
                x: centerX - half,
                y: centerY + half - size * t
            });
        }

        return points;
    },

    /**
     * Generate a triangle path
     */
    triangle: function(centerX, centerY, size, numPoints = 100) {
        const points = [];
        const height = size * Math.sqrt(3) / 2;

        const vertices = [
            { x: centerX, y: centerY - height * 0.66 },
            { x: centerX + size / 2, y: centerY + height * 0.33 },
            { x: centerX - size / 2, y: centerY + height * 0.33 }
        ];

        const pointsPerSide = Math.floor(numPoints / 3);

        for (let side = 0; side < 3; side++) {
            const start = vertices[side];
            const end = vertices[(side + 1) % 3];

            for (let i = 0; i < pointsPerSide; i++) {
                const t = i / pointsPerSide;
                points.push({
                    x: start.x + (end.x - start.x) * t,
                    y: start.y + (end.y - start.y) * t
                });
            }
        }

        return points;
    },

    /**
     * Generate a star path
     */
    star: function(centerX, centerY, outerRadius, numPoints = 100) {
        const points = [];
        const innerRadius = outerRadius * 0.4;
        const spikes = 5;
        const step = Math.PI / spikes;

        const vertices = [];
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = i * step - Math.PI / 2;
            vertices.push({
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            });
        }

        const pointsPerSide = Math.floor(numPoints / vertices.length);

        for (let i = 0; i < vertices.length; i++) {
            const start = vertices[i];
            const end = vertices[(i + 1) % vertices.length];

            for (let j = 0; j < pointsPerSide; j++) {
                const t = j / pointsPerSide;
                points.push({
                    x: start.x + (end.x - start.x) * t,
                    y: start.y + (end.y - start.y) * t
                });
            }
        }

        return points;
    },

    /**
     * Generate a heart path
     */
    heart: function(centerX, centerY, size, numPoints = 100) {
        const points = [];

        for (let i = 0; i < numPoints; i++) {
            const t = (i / numPoints) * Math.PI * 2;
            const x = size * 16 * Math.pow(Math.sin(t), 3);
            const y = -size * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

            points.push({
                x: centerX + x / 20,
                y: centerY + y / 20
            });
        }

        return points;
    },

    /**
     * Generate a spiral path
     */
    spiral: function(centerX, centerY, maxRadius, numPoints = 150) {
        const points = [];
        const turns = 3;

        for (let i = 0; i < numPoints; i++) {
            const t = i / numPoints;
            const angle = t * Math.PI * 2 * turns;
            const radius = maxRadius * t;

            points.push({
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            });
        }

        return points;
    },

    /**
     * Generate a Lissajous curve
     */
    lissajous: function(centerX, centerY, size, numPoints = 100) {
        const points = [];
        const a = 3; // frequency of x
        const b = 4; // frequency of y
        const delta = Math.PI / 2; // phase shift

        for (let i = 0; i < numPoints; i++) {
            const t = (i / numPoints) * Math.PI * 2;
            points.push({
                x: centerX + size * Math.sin(a * t + delta),
                y: centerY + size * Math.sin(b * t)
            });
        }

        return points;
    },

    /**
     * Generate a rose curve
     */
    rose: function(centerX, centerY, size, numPoints = 100) {
        const points = [];
        const n = 5; // number of petals (if odd) or 2n (if even)
        const d = 3; // denominator

        for (let i = 0; i < numPoints; i++) {
            const theta = (i / numPoints) * Math.PI * 2;
            const k = n / d;
            const r = size * Math.cos(k * theta);

            points.push({
                x: centerX + r * Math.cos(theta),
                y: centerY + r * Math.sin(theta)
            });
        }

        return points;
    }
};
