let hoveredItemId = null; // Track the `id` of the hovered item

export function renderInteractionPrompt() {
    const context = window._context;
    window._interactionOptions.forEach((item, index) => {
        const isHovered = item.id === hoveredItemId;
        item.top = window._player.position.top - window._camera.offsetY + (item.height * index);
        item.left = window._player.position.left - window._camera.offsetX + window._player.position.width + 10;
        let top = item.top;
        let left = item.left;
        context.fillStyle = isHovered ? "black" : "white"; // Background
        context.fillRect(left, top, item.width, item.height);
        context.fillStyle = isHovered ? "white" : "black"; // Text
        context.strokeRect(left, top, item.width, item.height);
        // context.font = "20px Arial";
        // context.textAlign = "center";
        context.textBaseline = "middle";

        context.fillText(
            item.label,
            item.left + 15,
            item.top + 15
        );
    });
}


// Check if the mouse is over an item
function handleMouseMove(evt) {
    const rect = window._canvas.getBoundingClientRect();
    const mouseX = evt.clientX - rect.left;
    const mouseY = evt.clientY - rect.top;

    // Update hoveredItemId based on mouse position
    const hoveredItem = window._interactionOptions.find(
        (item) =>
            mouseX >= item.left &&
            mouseX <= item.left + item.width &&
            mouseY >= item.top &&
            mouseY <= item.top + item.height && !item.disabled
    );

    hoveredItemId = hoveredItem ? hoveredItem.id : null;
}

// Handle click events
function handleMouseClick(evt) {
    // Determine the input type (mouse or touch)
    let mouseX, mouseY;

    if (evt.type === "touchstart") {
        // For touch events, use the first touch point
        const touch = evt.touches[0];
        mouseX = touch.clientX;
        mouseY = touch.clientY;
    } else if (evt.type === "mousedown") {
        // For mouse events, use clientX and clientY directly
        mouseX = evt.clientX;
        mouseY = evt.clientY;
    }

    // Handle hovered item click
    if (hoveredItemId !== null) {
        console.log('Clicked on list item');
        const clickedItem = window._interactionOptions.find((item) => item.id === hoveredItemId);
        clickedItem.callback();
    } else {
        console.log('Move to location from click');
        let pos = {
            mouseX: mouseX,
            mouseY: mouseY,
            offsetX: window._camera.offsetX,
            offsetY: window._camera.offsetY
        };
        console.log(pos);

        // Calculate world coordinates
        const rect = window._canvas.getBoundingClientRect(); // Get canvas bounding box
        const scaleX = window._canvas.width / rect.width; // Horizontal scale factor
        const scaleY = window._canvas.height / rect.height; // Vertical scale factor

        const canvasX = (mouseX - rect.left) * scaleX; // Adjust for canvas scaling
        const canvasY = (mouseY - rect.top) * scaleY; // Adjust for canvas scaling

        const worldX = canvasX + pos.offsetX; // Adjust for camera offset
        const worldY = canvasY + pos.offsetY; // Adjust for camera offset

        // Debug: Log and draw the target position
        console.log('World Coordinates:', { worldX, worldY });

        // Optional: Draw a marker at the target position
        window._context.fillStyle = 'red';
        window._context.beginPath();
        window._context.arc(worldX - pos.offsetX, worldY - pos.offsetY, 5, 0, Math.PI * 2);
        window._context.fill();

        // Set player's target position
        window._player.targetPosition.top = worldY;
        window._player.targetPosition.left = worldX;
    }

    // Handle hover detection after the click
    window.setTimeout(() => {
        handleMouseMove(evt);
    }, 100);
}


// Add event listeners
window.addEventListener("mousemove", handleMouseMove);
window.addEventListener("click", handleMouseClick);
window.addEventListener("touchstart", handleMouseClick);
