/**
 * Drawing mode functionality for creating custom paths
 */
class DrawingMode {
    constructor(canvas) {
        this.canvas = canvas;
        this.isDrawing = false;
        this.isEnabled = false;
        this.currentPath = [];
        this.simplificationTolerance = 3; // Douglas-Peucker tolerance
    }

    enable() {
        this.isEnabled = true;
        this.canvas.style.cursor = 'crosshair';
        this.attachEventListeners();
    }

    disable() {
        this.isEnabled = false;
        this.canvas.style.cursor = 'default';
        this.removeEventListeners();
    }

    clear() {
        this.currentPath = [];
    }

    attachEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
        this.canvas.addEventListener('mouseleave', this.handleMouseUp);

        // Touch support
        this.canvas.addEventListener('touchstart', this.handleTouchStart);
        this.canvas.addEventListener('touchmove', this.handleTouchMove);
        this.canvas.addEventListener('touchend', this.handleTouchEnd);
    }

    removeEventListeners() {
        this.canvas.removeEventListener('mousedown', this.handleMouseDown);
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('mouseup', this.handleMouseUp);
        this.canvas.removeEventListener('mouseleave', this.handleMouseUp);

        this.canvas.removeEventListener('touchstart', this.handleTouchStart);
        this.canvas.removeEventListener('touchmove', this.handleTouchMove);
        this.canvas.removeEventListener('touchend', this.handleTouchEnd);
    }

    handleMouseDown = (e) => {
        if (!this.isEnabled) return;
        this.isDrawing = true;
        this.currentPath = [];
        this.addPoint(e.offsetX, e.offsetY);
    }

    handleMouseMove = (e) => {
        if (!this.isEnabled || !this.isDrawing) return;
        this.addPoint(e.offsetX, e.offsetY);
    }

    handleMouseUp = () => {
        if (!this.isEnabled) return;
        this.isDrawing = false;
    }

    handleTouchStart = (e) => {
        if (!this.isEnabled) return;
        e.preventDefault();
        this.isDrawing = true;
        this.currentPath = [];
        const rect = this.canvas.getBoundingClientRect();
        const touch = e.touches[0];
        this.addPoint(touch.clientX - rect.left, touch.clientY - rect.top);
    }

    handleTouchMove = (e) => {
        if (!this.isEnabled || !this.isDrawing) return;
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const touch = e.touches[0];
        this.addPoint(touch.clientX - rect.left, touch.clientY - rect.top);
    }

    handleTouchEnd = () => {
        if (!this.isEnabled) return;
        this.isDrawing = false;
    }

    addPoint(x, y) {
        // Convert from canvas coordinates to centered coordinates
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        this.currentPath.push({
            x: x - centerX,
            y: y - centerY
        });
    }

    getPath() {
        if (this.currentPath.length < 3) return [];

        // Simplify the path using Douglas-Peucker algorithm
        return this.simplifyPath(this.currentPath, this.simplificationTolerance);
    }

    /**
     * Douglas-Peucker path simplification algorithm
     */
    simplifyPath(points, tolerance) {
        if (points.length <= 2) return points;

        const sqTolerance = tolerance * tolerance;

        // Find the point with maximum distance from the line segment
        let maxDistance = 0;
        let index = 0;

        const first = points[0];
        const last = points[points.length - 1];

        for (let i = 1; i < points.length - 1; i++) {
            const distance = this.perpendicularDistanceSquared(points[i], first, last);
            if (distance > maxDistance) {
                maxDistance = distance;
                index = i;
            }
        }

        // If max distance is greater than tolerance, recursively simplify
        if (maxDistance > sqTolerance) {
            const left = this.simplifyPath(points.slice(0, index + 1), tolerance);
            const right = this.simplifyPath(points.slice(index), tolerance);

            return left.slice(0, -1).concat(right);
        } else {
            return [first, last];
        }
    }

    /**
     * Calculate squared perpendicular distance from point to line segment
     */
    perpendicularDistanceSquared(point, lineStart, lineEnd) {
        const dx = lineEnd.x - lineStart.x;
        const dy = lineEnd.y - lineStart.y;

        if (dx === 0 && dy === 0) {
            // Line segment is a point
            const px = point.x - lineStart.x;
            const py = point.y - lineStart.y;
            return px * px + py * py;
        }

        const t = Math.max(0, Math.min(1,
            ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / (dx * dx + dy * dy)
        ));

        const projX = lineStart.x + t * dx;
        const projY = lineStart.y + t * dy;

        const distX = point.x - projX;
        const distY = point.y - projY;

        return distX * distX + distY * distY;
    }

    /**
     * Resample path to have uniform spacing
     */
    resamplePath(points, numPoints = 100) {
        if (points.length < 2) return points;

        // Calculate total path length
        let totalLength = 0;
        for (let i = 1; i < points.length; i++) {
            const dx = points[i].x - points[i - 1].x;
            const dy = points[i].y - points[i - 1].y;
            totalLength += Math.sqrt(dx * dx + dy * dy);
        }

        // Resample
        const resampled = [];
        const targetSpacing = totalLength / (numPoints - 1);

        resampled.push(points[0]);

        let currentLength = 0;
        let nextTargetLength = targetSpacing;

        for (let i = 1; i < points.length; i++) {
            const dx = points[i].x - points[i - 1].x;
            const dy = points[i].y - points[i - 1].y;
            const segmentLength = Math.sqrt(dx * dx + dy * dy);

            const prevLength = currentLength;
            currentLength += segmentLength;

            while (nextTargetLength <= currentLength && resampled.length < numPoints - 1) {
                const t = (nextTargetLength - prevLength) / segmentLength;
                resampled.push({
                    x: points[i - 1].x + dx * t,
                    y: points[i - 1].y + dy * t
                });
                nextTargetLength += targetSpacing;
            }
        }

        resampled.push(points[points.length - 1]);

        return resampled;
    }
}
