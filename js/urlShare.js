/**
 * URL sharing system - encode/decode paths in URL
 */

class URLShare {
    /**
     * Encode path data to base64 URL parameter
     */
    static encodePathToURL(path) {
        try {
            // Simplify path data (only x, y coordinates)
            const simplified = path.map(p => [
                Math.round(p.x * 100) / 100,
                Math.round(p.y * 100) / 100
            ]);

            const json = JSON.stringify(simplified);
            const base64 = btoa(json);

            // Create shareable URL
            const url = new URL(window.location.href.split('?')[0]);
            url.searchParams.set('path', base64);

            return url.toString();
        } catch (e) {
            console.error('Failed to encode path:', e);
            return null;
        }
    }

    /**
     * Decode path data from URL parameter
     */
    static decodePathFromURL() {
        try {
            const params = new URLSearchParams(window.location.search);
            const base64 = params.get('path');

            if (!base64) return null;

            const json = atob(base64);
            const simplified = JSON.parse(json);

            // Convert back to point objects
            return simplified.map(([x, y]) => ({ x, y }));
        } catch (e) {
            console.error('Failed to decode path from URL:', e);
            return null;
        }
    }

    /**
     * Copy URL to clipboard
     */
    static async copyToClipboard(url) {
        try {
            await navigator.clipboard.writeText(url);
            return true;
        } catch (e) {
            // Fallback for older browsers
            const input = document.createElement('input');
            input.value = url;
            document.body.appendChild(input);
            input.select();
            const success = document.execCommand('copy');
            document.body.removeChild(input);
            return success;
        }
    }

    /**
     * Show share modal with URL
     */
    static showShareDialog(url) {
        const message = `Share this URL:\n\n${url}`;

        // Try to copy to clipboard
        this.copyToClipboard(url).then(success => {
            if (success) {
                alert('URL copied to clipboard!\n\n' + url);
            } else {
                prompt('Copy this URL to share:', url);
            }
        });
    }
}
