/**
 * Parametric equation handler
 * Allows users to input custom mathematical equations for X(t) and Y(t)
 */

class Parametric {
    constructor() {
        this.safeEval = this.createSafeEval();
    }

    /**
     * Create a safe evaluation function for mathematical expressions
     */
    createSafeEval() {
        const mathFunctions = {
            sin: Math.sin,
            cos: Math.cos,
            tan: Math.tan,
            abs: Math.abs,
            sqrt: Math.sqrt,
            pow: Math.pow,
            exp: Math.exp,
            log: Math.log,
            floor: Math.floor,
            ceil: Math.ceil,
            round: Math.round,
            PI: Math.PI,
            E: Math.E
        };

        return function(expr, t) {
            try {
                // Replace common notation
                expr = expr.replace(/\^/g, '**');
                expr = expr.replace(/π/g, 'PI');

                // Create function with math context
                const func = new Function(...Object.keys(mathFunctions), 't', `return ${expr};`);
                return func(...Object.values(mathFunctions), t);
            } catch (e) {
                throw new Error(`Invalid expression: ${expr}`);
            }
        };
    }

    /**
     * Generate points from parametric equations
     */
    generate(xExpr, yExpr, numPoints = 100) {
        const points = [];
        const tMax = Math.PI * 2;

        for (let i = 0; i < numPoints; i++) {
            const t = (i / numPoints) * tMax;

            try {
                const x = this.safeEval(xExpr, t);
                const y = this.safeEval(yExpr, t);

                if (isFinite(x) && isFinite(y)) {
                    points.push({ x, y });
                }
            } catch (e) {
                console.error('Error evaluating at t=' + t, e);
                throw e;
            }
        }

        if (points.length === 0) {
            throw new Error('No valid points generated');
        }

        return this.centerAndScale(points);
    }

    /**
     * Center and scale points to fit canvas
     */
    centerAndScale(points, targetSize = 200) {
        // Find bounding box
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        for (const p of points) {
            minX = Math.min(minX, p.x);
            maxX = Math.max(maxX, p.x);
            minY = Math.min(minY, p.y);
            maxY = Math.max(maxY, p.y);
        }

        const width = maxX - minX;
        const height = maxY - minY;
        const maxDim = Math.max(width, height);
        const scale = maxDim > 0 ? targetSize / maxDim : 1;

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        // Transform points
        return points.map(p => ({
            x: (p.x - centerX) * scale,
            y: (p.y - centerY) * scale
        }));
    }

    /**
     * Get example equations
     */
    static getExamples() {
        return [
            { name: 'Circle', x: 'cos(t)', y: 'sin(t)' },
            { name: 'Ellipse', x: '2*cos(t)', y: 'sin(t)' },
            { name: 'Figure 8', x: 'sin(t)', y: 'sin(t)*cos(t)' },
            { name: 'Lissajous', x: 'sin(3*t)', y: 'sin(4*t)' },
            { name: 'Butterfly', x: 'sin(t)*(exp(cos(t))-2*cos(4*t)-pow(sin(t/12),5))', y: 'cos(t)*(exp(cos(t))-2*cos(4*t)-pow(sin(t/12),5))' },
            { name: 'Cardioid', x: '16*pow(sin(t),3)', y: '13*cos(t)-5*cos(2*t)-2*cos(3*t)-cos(4*t)' },
            { name: 'Astroid', x: 'pow(cos(t),3)', y: 'pow(sin(t),3)' }
        ];
    }
}
