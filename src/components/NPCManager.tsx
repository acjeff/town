import './Player.css';
import { useState } from "react";
import { NPCs as initialNPCs } from "../Data.tsx"; // Import initial NPC data
import NPC from "./NPC.tsx";

function NPCManager() {
    // Store NPCs in state
    const [npcs, setNpcs] = useState(initialNPCs);

    // Function to update NPC position
    const updateNPCPosition = (id: string, newPosition: typeof initialNPCs[0]["position"]) => {
        setNpcs((prevNpcs) =>
            prevNpcs.map((npc) =>
                npc.id === id ? { ...npc, position: newPosition } : npc
            )
        );
    };

    return (
        <>
            {npcs.map((npc) => (
                <NPC
                    key={npc.id}
                    npc={npc}
                    updatePosition={(newPosition) => updateNPCPosition(npc.id, newPosition)}
                />
            ))}
        </>
    );
}

export default NPCManager;
