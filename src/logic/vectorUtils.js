// vectorUtils.js
export const getVector = (point1, point2) => ({
    x: point2.x - point1.x,
    y: point2.y - point1.y,
    z: point2.z - point1.z,
});

export const normalize = (vector) => {
    const length = Math.sqrt(
        vector.x * vector.x + vector.y * vector.y + vector.z * vector.z
    );
    return { x: vector.x / length, y: vector.y / length, z: vector.z / length };
};

export const dotProduct = (v1, v2) =>
    v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;

export const angleBetween = (v1, v2) => {
    const dot = dotProduct(v1, v2);
    return Math.acos(dot); // In radians
};
