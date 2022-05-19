class Rectangle
{
    /**
     * Créer un rectangle à partir de l'angle HG, BD et de la rotation du rectangle
     * @param {Vector} v1 Vecteur représentant la position de l'angle haut gauche du rectangle
     * @param {Vector} v2 Vecteur représentant la position de l'angle bas droit du rectangle
     * @param {float} [theta = 0] Angle du rectangle en radian
     * @returns {Rectangle} 
     */
    static FromVector(v1,v2,theta = 0)
    {
        let v3 = Matrix.fromrotation(-theta).time(v1.to(v2));

        let origin = new Vector(Math.min(v1.x, v3.x),Math.min(v1.y, v3.y));
        let w = Math.abs(v3.x - v1.x);
        let h = Math.abs(v3.y - v1.y);
        return new Rectangle(origin, w, h,theta)
    }
    /**
     * Créer un rectangle à partir de la position et de la taille définit
     * @param {float} X Position X du rectangle (angle Haut Gauche)
     * @param {float} Y Position Y du rectangle (angle Haut Gauche)
     * @param {float} W Largeur du rectangle
     * @param {float} H Hauteur du rectangle
     * @param {float} [theta = 0] Angle du rectangle en radian
     * @returns {Rectangle}
     */
    static FromPosition(X,Y,W,H, theta = 0)
    {
        return new Rectangle(new Vector(X,Y), W, H, theta);
    }

    #refreshboundingbox = true;
    #_boundingbox = undefined

    /**
     * Créer un Rectangle
     * @class
     * @param {Vector} origin Vecteur représentant l'angle haut gauche du rectangle
     * @param {float} w Largeur du rectangle
     * @param {float} h Hauteur du rectangle
     * @param {float} [theta = 0] Angle du rectangle en radian
     */
    constructor(origin,w, h, theta = 0)
    {
        this.origin = origin;
        this.w = w;
        this.h = h;
        this.theta = theta;
        this.#refreshboundingbox = true;
        this.#_boundingbox = undefined;
    }

    /**
     * Bounding Box
     * @type {Rectangle}
     */
    get boundingbox()
    {
        if (this.#refreshboundingbox)
        {
            let box = this.#computeBoundingBox();
            this.#_boundingbox = new Rectangle(new Vector(box.x1, box.y1), box.x2 - box.x1, box.y2 - box.y1, 0);
            this.#refreshboundingbox = false;
        }
        return this.#_boundingbox;
    }

    get x()
    {
        return this.origin.x;
    }

    get y()
    {
        return this.origin.y;
    }

    get cx()
    {
        return this.x + this.w / 2
    }
    get cy()
    {
        return this.y + this.h / 2
    }
    get center()
    {
        return new Vector(this.cx, this.cy)
    }

    area()
    {
        return Math.abs(this.w * this.h);
    }

    #computeBoundingBox() {
        const x = this.origin.x;
        const y = this.origin.y;
        const result = (x1, x2, y1, y2) => ({x1, y1, x2, y2});
        const ux = Math.cos(this.theta); // unit vector along w
        const uy = Math.sin(this.theta);
        const wx = this.w * ux, wy = this.w * uy; // vector along w
        const hx = this.h *-uy, hy = this.h * ux; // vector along h
    
        if (ux > 0) { 
            return uy > 0 ?
                result(x + hx, x + wx,      y,      y + hy + wy) :
                result(x,      x + wx + hx, y + wy, y + hy);                
        }
        return uy > 0 ?
            result(x + hx + wx, x,      y + hy,      y + wy) :
            result(x + wx,      x + hx, y + wy + hy, y);                
    }

    
    #computeAABBCenter(x, y, w, h, theta) {
        const ux = Math.cos(theta) * 0.5; // half unit vector along w
        const uy = Math.sin(theta) * 0.5;
        const wx = w * ux, wy = w * uy; // vector along w
        const hx = h *-uy, hy = h * ux; // vector along h
        
        // all point from top left CW
        const x1 = x - wx - hx;
        const y1 = y - wy - hy;
        const x2 = x + wx - hx;
        const y2 = y + wy - hy;
        const x3 = x + wx + hx;
        const y3 = y + wy + hy;
        const x4 = x - wx + hx;
        const y4 = y - wy + hy;
        
        return {
          x1: Math.min(x1, x2, x3, x4),
          y1: Math.min(y1, y2, y3, y4),
          x2: Math.max(x1, x2, x3, x4),
          y2: Math.max(y1, y2, y3, y4),
        };
    }

    collide(rectangle)
    {
        if (this.angle == 0 && rectangle.angle == 0)
        {
            return this.#AABB(this,rectangle);
        }
        else
        {
            return this.#rotatedRectanglesCollide(
                this.x, this.y , this.w, this.h, this.theta,
                rectangle.x, rectangle.y, rectangle.w, rectangle.h, rectangle.theta);
        }
    }

    collisionWithOverlap(rectangle)
    {
        if (this.collide(rectangle))
        {
            if(rectangle.w == 0 || rectangle.h == 0)
                return Vector.Zero;
            
            let v = new Vector(0,0);
            if (this.cx > rectangle.cx)
            {
                v.x = rectangle.x+rectangle.w - this.x;
            }
            else
            {
                v.x = rectangle.x - (this.x + this.w)
            }
            if (this.cy > rectangle.cy)
            {
                v.y = rectangle.y + rectangle.h - this.y;
            }
            else
            {
                v.y = rectangle.y - (this.y + this.h)
            }
            let bn = (new Vector(rectangle.cx - this.cx, rectangle.cy - this.cy)).normalize()
            let vp = bn.time(v.dot(bn));
            let coef = Math.min(Math.abs(v.x) / Math.abs(vp.x), Math.abs(v.y) / Math.abs(vp.y));
            if(!isFinite(coef))
                coef = 1;
            let vc = vp.time(coef)
            return vc;
        }
        return Vector.Zero;
    }

    #AABB(R1, R2)//X1, Z1, X2, Z2)
    {
        return R1.x < R2.x + R2.w && R2.x > R1.x + R1.w && R1.y < R2.y + R2.h && R2.y > R1.y + R1.h
    }

    #rotatedRectanglesCollide(r1X, r1Y, r1W, r1H, r1A, r2X, r2Y, r2W, r2H, r2A) {
        let r1HW = r1W / 2;
        let r1HH = r1H / 2;
        let r2HW = r2W / 2;
        let r2HH = r2H / 2;
      
        let r1CX = r1X + r1HW;
        let r1CY = r1Y + r1HH;
        let r2CX = r2X + r2HW;
        let r2CY = r2Y + r2HH;
      
        let cosR1A = Math.cos(r1A);
        let sinR1A = Math.sin(r1A);
        let cosR2A = Math.cos(r2A);
        let sinR2A = Math.sin(r2A);
      
        let r1RX =  cosR2A * (r1CX - r2CX) + sinR2A * (r1CY - r2CY) + r2CX - r1HW;
        let r1RY = -sinR2A * (r1CX - r2CX) + cosR2A * (r1CY - r2CY) + r2CY - r1HH;
        let r2RX =  cosR1A * (r2CX - r1CX) + sinR1A * (r2CY - r1CY) + r1CX - r2HW;
        let r2RY = -sinR1A * (r2CX - r1CX) + cosR1A * (r2CY - r1CY) + r1CY - r2HH;
      
        let cosR1AR2A = Math.abs(cosR1A * cosR2A + sinR1A * sinR2A);
        let sinR1AR2A = Math.abs(sinR1A * cosR2A - cosR1A * sinR2A);
        let cosR2AR1A = Math.abs(cosR2A * cosR1A + sinR2A * sinR1A);
        let sinR2AR1A = Math.abs(sinR2A * cosR1A - cosR2A * sinR1A);
      
        let r1BBH = r1W * sinR1AR2A + r1H * cosR1AR2A;
        let r1BBW = r1W * cosR1AR2A + r1H * sinR1AR2A;
        let r1BBX = r1RX + r1HW - r1BBW / 2;
        let r1BBY = r1RY + r1HH - r1BBH / 2;
      
        let r2BBH = r2W * sinR2AR1A + r2H * cosR2AR1A;
        let r2BBW = r2W * cosR2AR1A + r2H * sinR2AR1A;
        let r2BBX = r2RX + r2HW - r2BBW / 2;
        let r2BBY = r2RY + r2HH - r2BBH / 2;
      
        return r1X < r2BBX + r2BBW && r1X + r1W > r2BBX && r1Y < r2BBY + r2BBH && r1Y + r1H > r2BBY &&
               r2X < r1BBX + r1BBW && r2X + r2W > r1BBX && r2Y < r1BBY + r1BBH && r2Y + r2H > r1BBY;
      }


    rotate(center, angle)
    {
        let cto = this.origin.to(center);
        cto = Matrix.fromrotation(angle).time(cto);
        return new Rectangle(cto.add(center), this.w, this.h, angle + this.theta);
    }

    toString()
    {
        return [this.x, this.y, this.w, this.h, this.theta].toString();
    }
}