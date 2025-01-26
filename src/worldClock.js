function secondsToTimeFormat(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
const dayLength = 86400;
setInterval(() => {
    if (window._world_time >= dayLength) {
        window._world_time = 0;
    } else {
        window._world_time = Math.floor(window._world_time + 16);
    }
    window._world_hours = window._world_time / 3600;
    window._world_percentage_through_day = Math.ceil((window._world_time / dayLength) * 100);
    window._formattedTime = secondsToTimeFormat(window._world_time);
}, 16);
let alpha = 0.1;
export default function manageWorldTimeAndRender(canvas) {
    const ctx = canvas.getContext("2d");

    // Ensure global time is initialized
    if (typeof window._world_time === "undefined") {
        window._world_time = 0; // Start at the beginning of the day
    }

    const colors = {
        dawn: "#ef951f", // Dawn color
        midday: "#87CEEB", // Midday color
        dusk: "#5e2f11", // Dusk color
        midnight: "#000000" // Midnight color
    };

    // Get the interpolated color based on the time of day
    function getSunlightColor(worldTime) {
        const t = Math.floor((worldTime / dayLength) * 100);
        const _t = worldTime / dayLength;
        if (t < 25) {
            // Dawn to Midday
            const progress = _t / 0.25;
            return interpolateColor(colors.dawn, colors.midday, progress);
        } else if (t < 50) {
            // Midday to Dusk
            const progress = (_t - 0.25) / 0.25;
            return interpolateColor(colors.midday, colors.dusk, progress);
        } else if (t < 75) {
            // Dusk to Midnight
            const progress = (_t - 0.5) / 0.25;
            return interpolateColor(colors.dusk, colors.midnight, progress);
        } else {
            // Midnight to Dawn
            const progress = (_t - 0.75) / 0.25;
            return interpolateColor(colors.midnight, colors.dawn, progress);
        }
    }

    // Linear interpolation between two colors
    function interpolateColor(color1, color2, progress) {
        const c1 = hexToRgb(color1);
        const c2 = hexToRgb(color2);

        const r = Math.round(c1.r + (c2.r - c1.r) * progress);
        const g = Math.round(c1.g + (c2.g - c1.g) * progress);
        const b = Math.round(c1.b + (c2.b - c1.b) * progress);

        return `rgb(${r}, ${g}, ${b})`;
    }

    // Convert hex color to RGB
    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
        };
    }

    function mapPercentageToWave(value) {
        const clampedValue = Math.max(0, Math.min(1, value));

        if (clampedValue <= 0.4) {
            return clampedValue * 0.5; // Maps 0.4 to 0.2
        } else if (clampedValue <= 0.6) {
            return 0.5;
        } else if (clampedValue <= 0.7) {
            return 5 * (clampedValue - 0.6) + 0.5; // Maps 0.7 to 1
        } else if (clampedValue <= 0.8) {
            return 1 - 2 * (clampedValue - 0.7); // Maps 0.8 to 0.8
        } else {
            return 0.8 - 4 * (clampedValue - 0.8); // Maps 1 to 0
        }
    }

    // Render the overlay
    function renderOverlay() {
        const currentColor = getSunlightColor(window._world_time);

        // Draw a full-screen rectangle with the current color
        ctx.fillStyle = currentColor;
        ctx.globalAlpha = mapPercentageToWave(window._world_time / dayLength); // Set fill opacity to 50%
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0; // Reset to full opacity
    }

    renderOverlay();
}
