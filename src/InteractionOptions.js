let hoveredItemId = null; // Track the `id` of the hovered item

export function renderInteractionPrompt() {
    const context = window._context;
    window._interactionOptions.forEach((item, index) => {
        const isHovered = item.id === hoveredItemId;

        // Calculate the fixed bottom-middle position for each option
        const bottomPadding = 50; // Distance from the bottom of the screen
        const centerX = window.innerWidth - item.width; // Horizontal center of the screen
        const itemSpacing = 10; // Spacing between items

        // Determine the top and left position for the option
        const top = window.innerHeight - bottomPadding - ((window._interactionOptions.length - index) * (item.height + itemSpacing));
        const left = centerX - item.width / 2;

        // Set the item's position (for future logic if needed)
        item.top = top;
        item.left = left;

        // Render the option at the calculated position
        context.fillStyle = isHovered ? "white" : "black"; // Background
        context.fillRect(left, top, item.width, item.height);
        context.font = "20px Arial"; // Set font size to 20px and font family to Arial
        context.fillStyle = isHovered ? "black" : "white"; // Text

        context.strokeRect(left, top, item.width, item.height);
        context.textBaseline = "middle";

        // Draw the label text inside the option
        context.fillText(
            item.label,
            left + 15, // Center the text horizontally
            top + item.height / 2 // Center the text vertically
        );
        context.font = "10px Arial"; // Set font size to 20px and font family to Arial
    });
    context.fillText(
        `${window._world_percentage_through_day}% through day`,
        20,
        20
    );
    context.fillText(
        `${window._formattedTime}`,
        20,
        40
    );
    context.fillText(
        `${window._world_hours}`,
        20,
        60
    );

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
    if (hoveredItemId !== null) {
        const clickedItem = window._interactionOptions.find((item) => item.id === hoveredItemId);
        clickedItem.callback();
    } else {
        let pos = {
            mouseX: evt.clientX,
            mouseY: evt.clientY,
            offsetX: window._camera.offsetX,
            offsetY: window._camera.offsetY
        };

        // Step 1: Get the canvas bounding rectangle
        let worldXY = window._camera.screenToWorld(pos.mouseX, pos.mouseY);
        let worldY = worldXY.top;
        let worldX = worldXY.left;
        // Debug: Draw a red marker at the calculated world coordinates

        // Step 5: Set player's target position in world coordinates
        window._player.setTarget({
            top: worldY,
            left: worldX
        })
        // window._player.moveFromClick = true;
    }
    window.setTimeout(() => {
        handleMouseMove(evt);
    }, 100);
}

// Add event listeners
window.addEventListener("mousemove", handleMouseMove);
window.addEventListener("click", handleMouseClick);
window.addEventListener("touchstart", handleMouseClick);
