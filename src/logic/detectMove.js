import { getVector, normalize, angleBetween } from "./vectorUtils.js";

export function detectFingerStatesWithOrientation(landmarks) {
    const palmVector = getVector(landmarks[0], landmarks[9]); // Wrist to middle MCP
    const normalizedPalm = normalize(palmVector);

    const isFingerUp = (fingerTip, fingerBase) => {
        const fingerVector = getVector(landmarks[fingerBase], landmarks[fingerTip]);
        const normalizedFinger = normalize(fingerVector);
        const angle = angleBetween(normalizedFinger, normalizedPalm);
        return angle < Math.PI / 4; // Threshold: adjust for sensitivity
    };

    return {
        thumb: isFingerUp(4, 2), // Thumb Tip to Thumb MCP
        index: isFingerUp(8, 5), // Index Tip to Index MCP
        middle: isFingerUp(12, 9), // Middle Tip to Middle MCP
        ring: isFingerUp(16, 13), // Ring Tip to Ring MCP
        pinky: isFingerUp(20, 17), // Pinky Tip to Pinky MCP
    };
}


export function detectMove(landmarks) {
    if (!landmarks || landmarks.length === 0) return null;

    const fingerStatuses = detectFingerStatesWithOrientation(landmarks);
    if (!fingerStatuses.index && !fingerStatuses.middle) {
        return "stone"
    }
    if (fingerStatuses.index && fingerStatuses.middle && fingerStatuses.ring) {
        return "paper"
    }
    if (fingerStatuses.index && fingerStatuses.middle && !fingerStatuses.ring) {
        return "scissors"
    }
    return null
}

// eslint-disable-next-line
function drawFingerLines(canvasCtx, landmarks) {
    if (!landmarks || landmarks.length === 0) return;
    const fingers = {
        thumb: [0, 1, 2, 3, 4], // Thumb indices
        index: [5, 6, 7, 8],    // Index finger indices
        middle: [9, 10, 11, 12], // Middle finger indices
        ring: [13, 14, 15, 16],  // Ring finger indices
        pinky: [17, 18, 19, 20], // Pinky finger indices
    };

    const fingerStatuses = detectFingerStatesWithOrientation(landmarks);

    canvasCtx.lineWidth = 4; // Line width for better visibility

    for (const [finger, indices] of Object.entries(fingers)) {
        const color = fingerStatuses[finger] ? "green" : "red";

        canvasCtx.strokeStyle = color;
        canvasCtx.beginPath();

        for (let i = 0; i < indices.length - 1; i++) {
            const start = landmarks[indices[i]];
            const end = landmarks[indices[i + 1]];

            canvasCtx.moveTo(start.x * canvasCtx.canvas.width, start.y * canvasCtx.canvas.height);
            canvasCtx.lineTo(end.x * canvasCtx.canvas.width, end.y * canvasCtx.canvas.height);
        }

        canvasCtx.stroke();
    }
};
