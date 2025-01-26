function secondsToTimeFormat(totalSeconds) {
    // Calculate hours, minutes, and seconds
    const hours = Math.floor(totalSeconds / 3600); // 1 hour = 3600 seconds
    const minutes = Math.floor((totalSeconds % 3600) / 60); // Remaining minutes
    const seconds = totalSeconds % 60; // Remaining seconds

    // Pad hours, minutes, and seconds with leading zeros if needed
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    // Combine into HH:MM:SS format
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
const dayLength = 86400; // Total length of a day in milliseconds
setInterval(() => {
    if (window._world_time >= dayLength) {
        window._world_time = 0;
    } else {
        window._world_time = Math.floor(window._world_time + 500);
    }
    window._world_percentage_through_day = Math.ceil((window._world_time / dayLength) * 100);
    window._formattedTime = secondsToTimeFormat(window._world_time);
}, 500);
let alpha = 0.1;
export default function manageWorldTimeAndRender(canvas) {
    const ctx = canvas.getContext("2d");

    // Ensure global time is initialized
    if (typeof window._world_time === "undefined") {
        window._world_time = 0; // Start at the beginning of the day
    }

    const colors = {
        dawn: "#FFCC33", // Dawn color
        midday: "#87CEEB", // Midday color
        dusk: "#FF4500", // Dusk color
        midnight: "#001933" // Midnight color
    };

    // Get the interpolated color based on the time of day
    function getSunlightColor(worldTime) {
        const t = Math.floor(worldTime / dayLength); // Normalize time to a range of 0-1

        if (t < 0.25) {
            // Dawn to Midday
            const progress = t / 0.25;
            alpha = 0.2; // Set fill opacity to 50%
            return interpolateColor(colors.dawn, colors.midday, progress);
        } else if (t < 0.5) {
            // Midday to Dusk
            alpha = 0.2; // Set fill opacity to 50%
            const progress = (t - 0.25) / 0.25;
            return interpolateColor(colors.midday, colors.dusk, progress);
        } else if (t < 0.75) {
            alpha = 0.9; // Set fill opacity to 50%
            // Dusk to Midnight
            const progress = (t - 0.5) / 0.25;
            return interpolateColor(colors.dusk, colors.midnight, progress);
        } else {
            // Midnight to Dawn
            alpha = 0.2; // Set fill opacity to 50%
            const progress = (t - 0.75) / 0.25;
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

    // Render the overlay
    function renderOverlay() {
        const currentColor = getSunlightColor(window._world_time);

        // Draw a full-screen rectangle with the current color
        ctx.fillStyle = currentColor;
        ctx.globalAlpha = alpha; // Set fill opacity to 50%
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0; // Reset to full opacity
    }

    console.log()
    renderOverlay();
}
