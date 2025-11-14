/**
 * Example gallery with preset demonstrations
 */

class Gallery {
    constructor() {
        this.examples = this.createExamples();
    }

    /**
     * Create example gallery items
     */
    createExamples() {
        return [
            {
                name: 'Circle',
                generate: () => Presets.circle(0, 0, 150)
            },
            {
                name: 'Square',
                generate: () => Presets.square(0, 0, 200)
            },
            {
                name: 'Triangle',
                generate: () => Presets.triangle(0, 0, 200)
            },
            {
                name: 'Star',
                generate: () => Presets.star(0, 0, 150)
            },
            {
                name: 'Heart',
                generate: () => Presets.heart(0, 0, 150)
            },
            {
                name: 'Spiral',
                generate: () => Presets.spiral(0, 0, 150)
            },
            {
                name: 'Lissajous',
                generate: () => Presets.lissajous(0, 0, 150)
            },
            {
                name: 'Rose',
                generate: () => Presets.rose(0, 0, 150)
            },
            {
                name: 'Figure 8',
                generate: () => {
                    const param = new Parametric();
                    return param.generate('sin(t)', 'sin(t)*cos(t)', 100);
                }
            },
            {
                name: 'Trefoil',
                generate: () => {
                    const param = new Parametric();
                    return param.generate('sin(t)+2*sin(2*t)', 'cos(t)-2*cos(2*t)', 100);
                }
            },
            {
                name: 'Butterfly',
                generate: () => {
                    const param = new Parametric();
                    return param.generate(
                        'sin(t)*(exp(cos(t))-2*cos(4*t))',
                        'cos(t)*(exp(cos(t))-2*cos(4*t))',
                        150
                    );
                }
            },
            {
                name: 'Infinity',
                generate: () => {
                    const param = new Parametric();
                    return param.generate('sin(t)*200/(1+pow(cos(t),2))', 'sin(t)*cos(t)*200/(1+pow(cos(t),2))', 100);
                }
            }
        ];
    }

    /**
     * Render gallery grid
     */
    render(containerElement, onSelect) {
        containerElement.innerHTML = '';

        this.examples.forEach((example, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';

            // Create preview canvas
            const canvas = document.createElement('canvas');
            canvas.width = 150;
            canvas.height = 150;
            item.appendChild(canvas);

            // Draw preview
            this.drawPreview(canvas, example.generate());

            // Add name
            const nameDiv = document.createElement('div');
            nameDiv.className = 'gallery-item-name';
            nameDiv.textContent = example.name;
            item.appendChild(nameDiv);

            // Click handler
            item.addEventListener('click', () => {
                onSelect(example.generate());
            });

            containerElement.appendChild(item);
        });
    }

    /**
     * Draw preview of path on small canvas
     */
    drawPreview(canvas, points) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear
        ctx.fillStyle = '#1e2441';
        ctx.fillRect(0, 0, width, height);

        if (!points || points.length === 0) return;

        // Find bounds
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        for (const p of points) {
            minX = Math.min(minX, p.x);
            maxX = Math.max(maxX, p.x);
            minY = Math.min(minY, p.y);
            maxY = Math.max(maxY, p.y);
        }

        // Calculate scale and offset
        const rangeX = maxX - minX;
        const rangeY = maxY - minY;
        const scale = Math.min(width, height) * 0.8 / Math.max(rangeX, rangeY);
        const offsetX = width / 2 - (minX + maxX) / 2 * scale;
        const offsetY = height / 2 - (minY + maxY) / 2 * scale;

        // Draw path
        ctx.beginPath();
        ctx.moveTo(
            points[0].x * scale + offsetX,
            points[0].y * scale + offsetY
        );

        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(
                points[i].x * scale + offsetX,
                points[i].y * scale + offsetY
            );
        }

        ctx.closePath();
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    /**
     * Show gallery modal
     */
    show(onSelect) {
        const modal = document.getElementById('galleryModal');
        const grid = document.getElementById('galleryGrid');

        this.render(grid, (path) => {
            modal.classList.remove('active');
            onSelect(path);
        });

        modal.classList.add('active');
    }
}
