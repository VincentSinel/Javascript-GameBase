class Vector {


    static get Zero()
    {
        return new Vector(0,0,0);
    }
    static get One()
    {
        return new Vector(1,1,1);
    }
    static get OnePlan()
    {
        return new Vector(1,1,0);
    }
    static get Right()
    {
        return new Vector(1,0,0);
    }
    static get Up()
    {
        return new Vector(0,1,0);
    }
    static get Foreward()
    {
        return new Vector(0,0,1);
    }

    static FromAngle(theta)
    {
        let x = Math.cos(theta);
        let y = Math.sin(theta);
        return new Vector(x,y,0);
    }

    constructor(x, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    add(v2) {
        var v = new Vector(this.x + v2.x,
            this.y + v2.y,
            this.z + v2.z);
        return v;
    }
    to(v2) {
        var v = new Vector(v2.x - this.x,
            v2.y - this.y,
            v2.z - this.z);
        return v;
    }
    time(coef) {
        var v = new Vector(this.x * coef,
            this.y * coef,
            this.z * coef);
        return v;
    }
    get length() {
        return VMath.Length(this);
    }
    get sqrlength()
    {
        return VMath.SqrLength(this);
    }
    dot(v2)
    {
        return this.x * v2.x + this.y * v2.y + this.z * v2.z
    }
    get middle()
    {
        return this.time(0.5);
    }
    normalize(newlenght = 1)
    {
        let l = this.length
        if (l > 0)
        {
            return this.time(newlenght/this.length);
        }
        else
        {
            return Vector.Zero;
        }
    }
    get angle()
    {
        return Math.atan2(this.y, this.x);
    }
    angleto(v2)
    {
        return Math.acos(this.dot(v2) / (this.length * v2.length));
    }
    cross(v2)
    {
        var v = new Vector(this.y*v2.z - this.z*v2.y,
            this.z*v2.x - this.x*v2.z,
            this.x*v2.y - this.y*v2.x);
        return v;
    }
    distance(v2)
    {
        return this.to(v2).length;
    }

    rotate(angle)
    {
        return  Matrix.fromrotation(angle).time(this);
    }
}

class VMath
{
    static Length(v1)
    {
        return Math.sqrt(VMath.SqrLength(v1));
    }
    static SqrLength(v1)
    {
        return VMath.Square(v1.x) + VMath.Square(v1.y) + VMath.Square(v1.z)
    }

    static Square(value)
    {
        return value * value;
    }
}