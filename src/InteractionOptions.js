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
    console.log(evt, ' : event type');
    if (hoveredItemId !== null) {
        console.log('Clicked on list item');
        const clickedItem = window._interactionOptions.find((item) => item.id === hoveredItemId);
        clickedItem.callback();
    } else {
        console.log('Move to location from click');
        let pos = {
            mouseX: evt.clientX,
            mouseY: evt.clientY,
            offsetX: window._camera.offsetX,
            offsetY: window._camera.offsetY
        };
        console.log(pos)

        // Step 1: Get the canvas bounding rectangle

        let worldY = pos.mouseY + pos.offsetY;
        let worldX = pos.mouseX + pos.offsetX;
        // Debug: Draw a red marker at the calculated world coordinates

        // Step 5: Set player's target position in world coordinates
        window._player.targetPosition.top = worldY;
        window._player.targetPosition.left = worldX;
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
