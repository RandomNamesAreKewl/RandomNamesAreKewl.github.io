export class Scene {
    objects;
    lights;
    camera;
}
export class Camera {
    position;
    rotation;
    fov = 90;
    constructor(position, rotation) {
        this.position = position;
        this.rotation = rotation;
    }
}
export class Light {
    position;
    color;
    constructor(position, color) {
        this.position = position;
        this.color = color;
    }
}
export class RayHit {
    object;
    distance;
    hitPos;
    constructor(object, distance, hitPos) {
        this.object = object;
        this.distance = distance;
        this.hitPos = hitPos;
    }
}
export class Ray {
    origin;
    direction;
    constructor(origin, direction) {
        this.origin = origin;
        this.direction = direction;
    }
    Cast(scene, maxDistance = 1000) {
        let DistanceTravelled = 0;
        let CurrentPosition = this.origin;
        let ClosestObject = null;
        let ClosestDistance = maxDistance;
        while (DistanceTravelled < maxDistance) {
            for (let i = 0; i < scene.objects.length; i++) {
                let object = scene.objects[i];
                let distance = object.DistanceTo(CurrentPosition);
                if (distance < ClosestDistance) {
                    ClosestDistance = distance;
                    ClosestObject = object;
                }
            }
            if (ClosestDistance < 0.1 && ClosestObject != null) {
                return new RayHit(ClosestObject, DistanceTravelled, CurrentPosition);
            }
        }
    }
    return;
}
export class GameObject {
    position;
    rotation;
    scale;
    constructor(position, rotation, scale) {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
    }
    // For pathtracing
    DistanceTo(point) {
        return Vector3.Distance(this.position, point);
    }
}
export class Sphere extends GameObject {
    radius;
    constructor(radius, position) {
        super(position, Vector3.Zero, Vector3.Zero);
        this.radius = radius;
    }
    DistanceTo(point) {
        return Vector3.Distance(this.position, point) - this.radius;
    }
}
export class Vector3 {
    x;
    y;
    z;
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    static Zero = new Vector3(0, 0, 0);
    static One = new Vector3(1, 1, 1);
    static Up = new Vector3(0, 1, 0);
    static Down = new Vector3(0, -1, 0);
    static Left = new Vector3(-1, 0, 0);
    static Right = new Vector3(1, 0, 0);
    static Forward = new Vector3(0, 0, 1);
    static Back = new Vector3(0, 0, -1);
    static Add(a, b) {
        return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
    }
    static Subtract(a, b) {
        return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
    }
    static Multiply(a, b) {
        return new Vector3(a.x * b.x, a.y * b.y, a.z * b.z);
    }
    static Divide(a, b) {
        return new Vector3(a.x / b.x, a.y / b.y, a.z / b.z);
    }
    static Scale(a, b) {
        return new Vector3(a.x * b, a.y * b, a.z * b);
    }
    static Magnitude(a) {
        return Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
    }
    static Normalize(a) {
        var m = Vector3.Magnitude(a);
        return new Vector3(a.x / m, a.y / m, a.z / m);
    }
    static Dot(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }
    static Cross(a, b) {
        return new Vector3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
    }
    static Distance(a, b) {
        return Vector3.Magnitude(Vector3.Subtract(a, b));
    }
    static Lerp(a, b, t) {
        return Vector3.Add(Vector3.Scale(a, 1 - t), Vector3.Scale(b, t));
    }
}
