/**
 * Path editor for manipulating individual points
 */

class PathEditor {
    constructor(canvas) {
        this.canvas = canvas;
        this.enabled = false;
        this.points = [];
        this.selectedPoint = null;
        this.hoverPoint = null;
        this.isDragging = false;
        this.pointRadius = 6;
    }

    enable() {
        this.enabled = true;
        this.attachEventListeners();
    }

    disable() {
        this.enabled = false;
        this.selectedPoint = null;
        this.hoverPoint = null;
        this.removeEventListeners();
    }

    setPoints(points) {
        this.points = points.map(p => ({ ...p }));
    }

    getPoints() {
        return this.points.map(p => ({ ...p }));
    }

    attachEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
        this.canvas.addEventListener('dblclick', this.handleDoubleClick);
    }

    removeEventListeners() {
        this.canvas.removeEventListener('mousedown', this.handleMouseDown);
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('mouseup', this.handleMouseUp);
        this.canvas.removeEventListener('dblclick', this.handleDoubleClick);
    }

    handleMouseDown = (e) => {
        if (!this.enabled) return;

        const point = this.getPointAtMouse(e);
        if (point !== null) {
            this.selectedPoint = point;
            this.isDragging = true;
            this.canvas.style.cursor = 'grabbing';
        }
    }

    handleMouseMove = (e) => {
        if (!this.enabled) return;

        if (this.isDragging && this.selectedPoint !== null) {
            const rect = this.canvas.getBoundingClientRect();
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;

            this.points[this.selectedPoint].x = e.offsetX - centerX;
            this.points[this.selectedPoint].y = e.offsetY - centerY;
        } else {
            const point = this.getPointAtMouse(e);
            this.hoverPoint = point;
            this.canvas.style.cursor = point !== null ? 'pointer' : 'default';
        }
    }

    handleMouseUp = () => {
        if (!this.enabled) return;

        this.isDragging = false;
        this.selectedPoint = null;
        this.canvas.style.cursor = 'default';
    }

    handleDoubleClick = (e) => {
        if (!this.enabled) return;

        const point = this.getPointAtMouse(e);
        if (point !== null) {
            // Delete point
            this.points.splice(point, 1);
        } else {
            // Add point
            const rect = this.canvas.getBoundingClientRect();
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;

            this.points.push({
                x: e.offsetX - centerX,
                y: e.offsetY - centerY
            });
        }
    }

    getPointAtMouse(e) {
        const rect = this.canvas.getBoundingClientRect();
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const mouseX = e.offsetX - centerX;
        const mouseY = e.offsetY - centerY;

        for (let i = 0; i < this.points.length; i++) {
            const dx = this.points[i].x - mouseX;
            const dy = this.points[i].y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < this.pointRadius * 2) {
                return i;
            }
        }

        return null;
    }

    draw(ctx) {
        if (!this.enabled || this.points.length === 0) return;

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // Draw control points
        for (let i = 0; i < this.points.length; i++) {
            const p = this.points[i];
            const isSelected = i === this.selectedPoint;
            const isHover = i === this.hoverPoint;

            ctx.beginPath();
            ctx.arc(
                centerX + p.x,
                centerY + p.y,
                this.pointRadius,
                0,
                Math.PI * 2
            );

            if (isSelected) {
                ctx.fillStyle = '#10b981';
                ctx.strokeStyle = '#ffffff';
            } else if (isHover) {
                ctx.fillStyle = '#3b82f6';
                ctx.strokeStyle = '#ffffff';
            } else {
                ctx.fillStyle = '#ef4444';
                ctx.strokeStyle = '#ffffff';
            }

            ctx.fill();
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
}
