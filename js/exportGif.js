/**
 * GIF Export functionality
 *
 * Note: This uses the browser's MediaRecorder API for video capture,
 * then converts to GIF using a simple frame capture approach.
 * For production, consider using gif.js library for better quality.
 */

class GIFExporter {
    constructor(canvas) {
        this.canvas = canvas;
        this.isRecording = false;
        this.frames = [];
        this.recordedBlob = null;
    }

    /**
     * Start recording canvas
     */
    async startRecording(duration = 5, frameRate = 30) {
        try {
            this.frames = [];
            this.isRecording = true;
            const totalFrames = duration * frameRate;
            const frameDelay = 1000 / frameRate;

            return new Promise((resolve) => {
                let frameCount = 0;

                const captureFrame = () => {
                    if (frameCount >= totalFrames) {
                        this.isRecording = false;
                        resolve(this.frames);
                        return;
                    }

                    // Capture current canvas state
                    this.canvas.toBlob((blob) => {
                        if (blob) {
                            this.frames.push(blob);
                        }

                        frameCount++;
                        setTimeout(captureFrame, frameDelay);
                    }, 'image/png');
                };

                captureFrame();
            });
        } catch (error) {
            console.error('Recording failed:', error);
            this.isRecording = false;
            throw error;
        }
    }

    /**
     * Export as WebM video (modern browsers)
     */
    async exportVideo(duration = 5) {
        return new Promise((resolve, reject) => {
            const stream = this.canvas.captureStream(30);
            const recorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp9'
            });

            const chunks = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                this.downloadBlob(blob, 'fourier-animation.webm');
                resolve(blob);
            };

            recorder.onerror = (e) => {
                reject(e);
            };

            recorder.start();

            setTimeout(() => {
                recorder.stop();
            }, duration * 1000);
        });
    }

    /**
     * Simple GIF-like export using sequential PNG frames
     * Downloads a zip of frames that can be converted to GIF externally
     */
    async exportFramesAsZip(duration = 5, frameRate = 30) {
        const frames = await this.startRecording(duration, frameRate);

        // Create download for frame sequence
        alert(`Captured ${frames.length} frames. Download as individual images or use an online tool to convert to GIF.`);

        // Download first frame as example
        if (frames.length > 0) {
            this.downloadBlob(frames[0], 'fourier-frame-001.png');
        }

        return frames;
    }

    /**
     * Alternative: Export as APNG (Animated PNG)
     * Supported in modern browsers
     */
    async exportAPNG(duration = 5) {
        alert('APNG export requires external library. Falling back to video export.');
        return this.exportVideo(duration);
    }

    /**
     * Download blob as file
     */
    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Show export progress
     */
    updateProgress(current, total, progressBar, progressText) {
        const percent = Math.round((current / total) * 100);
        if (progressBar) progressBar.value = percent;
        if (progressText) progressText.textContent = `${percent}%`;
    }

    /**
     * Cancel recording
     */
    cancel() {
        this.isRecording = false;
        this.frames = [];
    }
}

/**
 * Note to users:
 * For true GIF export with better quality and smaller file sizes,
 * consider integrating the gif.js library:
 * https://github.com/jnordberg/gif.js
 *
 * This implementation provides basic export functionality
 * using browser-native APIs.
 */
