/**
 * Discrete Fourier Transform implementation
 * Converts a sequence of complex numbers into frequency domain
 */
function dft(signal) {
    const N = signal.length;
    const spectrum = [];

    for (let k = 0; k < N; k++) {
        let sum = new Complex(0, 0);

        for (let n = 0; n < N; n++) {
            const angle = (-2 * Math.PI * k * n) / N;
            const c = new Complex(Math.cos(angle), Math.sin(angle));
            sum = sum.add(signal[n].multiply(c));
        }

        spectrum.push({
            freq: k,
            amplitude: sum.magnitude() / N,
            phase: sum.phase(),
            complex: sum
        });
    }

    return spectrum;
}

/**
 * Fast Fourier Transform (Cooley-Tukey algorithm)
 * More efficient than DFT for large datasets: O(n log n) vs O(n²)
 */
function fft(signal) {
    const N = signal.length;

    // Base case
    if (N <= 1) return signal;

    // Ensure N is a power of 2
    if (N & (N - 1)) {
        // Pad with zeros if not power of 2
        const nextPow2 = Math.pow(2, Math.ceil(Math.log2(N)));
        while (signal.length < nextPow2) {
            signal.push(new Complex(0, 0));
        }
        return fft(signal);
    }

    // Divide
    const even = [];
    const odd = [];
    for (let i = 0; i < N; i++) {
        if (i % 2 === 0) even.push(signal[i]);
        else odd.push(signal[i]);
    }

    // Conquer
    const evenFFT = fft(even);
    const oddFFT = fft(odd);

    // Combine
    const spectrum = new Array(N);
    for (let k = 0; k < N / 2; k++) {
        const angle = (-2 * Math.PI * k) / N;
        const w = new Complex(Math.cos(angle), Math.sin(angle));
        const t = w.multiply(oddFFT[k]);

        spectrum[k] = evenFFT[k].add(t);
        spectrum[k + N / 2] = evenFFT[k].subtract(t);
    }

    return spectrum;
}

/**
 * Convert FFT output to frequency spectrum with amplitude and phase
 */
function getFrequencySpectrum(fftOutput) {
    const N = fftOutput.length;
    const spectrum = [];

    for (let k = 0; k < N; k++) {
        spectrum.push({
            freq: k,
            amplitude: fftOutput[k].magnitude() / N,
            phase: fftOutput[k].phase(),
            complex: fftOutput[k]
        });
    }

    return spectrum;
}

/**
 * Sort spectrum by amplitude (most significant frequencies first)
 */
function sortSpectrum(spectrum) {
    return spectrum.slice().sort((a, b) => b.amplitude - a.amplitude);
}

/**
 * Create epicycles from a path of points
 */
function createEpicycles(points, useFft = true) {
    // Convert points to complex numbers
    const signal = points.map(p => new Complex(p.x, p.y));

    // Apply Fourier Transform
    let spectrum;
    if (useFft && isPowerOf2(signal.length)) {
        const fftOutput = fft(signal);
        spectrum = getFrequencySpectrum(fftOutput);
    } else {
        spectrum = dft(signal);
    }

    // Sort by amplitude for better visualization
    return sortSpectrum(spectrum);
}

/**
 * Check if a number is a power of 2
 */
function isPowerOf2(n) {
    return n > 0 && (n & (n - 1)) === 0;
}

/**
 * Reconstruct a point from epicycles at a given time
 */
function getPointFromEpicycles(epicycles, time, numEpicycles) {
    let position = new Complex(0, 0);
    const cycles = [];

    for (let i = 0; i < Math.min(numEpicycles, epicycles.length); i++) {
        const { freq, amplitude, phase } = epicycles[i];
        const angle = freq * time + phase;

        const offset = Complex.fromPolar(amplitude, angle);
        cycles.push({
            center: { x: position.real, y: position.imag },
            radius: amplitude,
            endpoint: { x: position.real + offset.real, y: position.imag + offset.imag }
        });

        position = position.add(offset);
    }

    return {
        point: { x: position.real, y: position.imag },
        cycles: cycles
    };
}
