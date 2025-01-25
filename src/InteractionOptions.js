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
    if (hoveredItemId !== null) {
        console.log('Clicked on list item');
        const clickedItem = window._interactionOptions.find((item) => item.id === hoveredItemId);
        clickedItem.callback();
    }
    window.setTimeout(() => {
        handleMouseMove(evt);
    }, 100);
}

// Add event listeners
window.addEventListener("mousemove", handleMouseMove);
window.addEventListener("click", handleMouseClick);
