/**
 * Complex number class for Fourier Transform calculations
 */
class Complex {
    constructor(real, imag = 0) {
        this.real = real;
        this.imag = imag;
    }

    /**
     * Add two complex numbers
     */
    add(c) {
        return new Complex(this.real + c.real, this.imag + c.imag);
    }

    /**
     * Subtract two complex numbers
     */
    subtract(c) {
        return new Complex(this.real - c.real, this.imag - c.imag);
    }

    /**
     * Multiply two complex numbers
     */
    multiply(c) {
        const real = this.real * c.real - this.imag * c.imag;
        const imag = this.real * c.imag + this.imag * c.real;
        return new Complex(real, imag);
    }

    /**
     * Get the magnitude of the complex number
     */
    magnitude() {
        return Math.sqrt(this.real * this.real + this.imag * this.imag);
    }

    /**
     * Get the phase (angle) of the complex number
     */
    phase() {
        return Math.atan2(this.imag, this.real);
    }

    /**
     * Create a complex number from polar coordinates
     */
    static fromPolar(magnitude, phase) {
        return new Complex(
            magnitude * Math.cos(phase),
            magnitude * Math.sin(phase)
        );
    }

    /**
     * Scale the complex number by a real value
     */
    scale(s) {
        return new Complex(this.real * s, this.imag * s);
    }
}
