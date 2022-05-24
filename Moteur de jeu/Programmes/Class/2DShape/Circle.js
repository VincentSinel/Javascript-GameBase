/**
 * Représente un cercle permettant de gerer les collisions avec une autre forme
 * @class
 * @extends Shape
 */
class Circle extends Shape
{
    #refreshboundingbox = true;
    #_boundingbox = undefined
    #radius

    /**
     * Créer un nouveau cercle
     * @constructor
     * @param {Vector} origin Position du centre du cercle
     * @param {float} radius Rayon du cercle
     */
    constructor(origin, radius)
    {
        super()
        this.origin = origin;
        this.radius = radius;
    }

    //#region GETTER SETTER

    /**
     * Origine X
     * @type {float}
     */
     get x()
     {
         return this.origin.x;
     }
     set x(v)
     {
         this.origin.x = v;
         this.#refreshboundingbox = true;
     }
     /**
      * Origine Y
      * @type {float}
      */
     get y()
     {
         return this.origin.y;
     }
     set y(v)
     {
         this.origin.y = v;
         this.#refreshboundingbox = true;
     }
    /**
     * Rayon du cercle
     * @type {float}
     */
    get radius()
    {
        return this.#radius;
    }
    set radius(v)
    {
        this.#radius = v;
        this.#refreshboundingbox = true;
    }
    /**
     * Bounding Box
     * @type {Rectangle}
     */
    get boundingbox()
    {
        if (this.#refreshboundingbox)
        {
            this.#_boundingbox = new Rectangle(new Vector(this.x - this.radius, this.y - this.radius), this.radius * 2, this.radius * 2, 0);
            this.#refreshboundingbox = false;
        }
        return this.#_boundingbox;
    }

    //#endregion

    /**
     * Vérifie si il y a collision entre ce cercle et un rectangle
     * @override
     * @param {Rectangle} rectangle Rectangle à tester
     * @returns {boolean} Représente si il y a collision
     */
    collide_Rectangle(rectangle)
    {
        let p = rectangle.toPolygon();
        return !SAT.test(this,p);
    }
    /**
     * Calcul le déplacement nécessaire à effectuer par ce cercle pour sortir d'un rectangle
     * @override
     * @param {Rectangle} rectangle Rectangle à tester
     * @returns {Vector} Déplacement à effectuer pour sortir
     */
    collide_RectangleOverlap(rectangle)
    {
        let p = rectangle.toPolygon();
        let r = SAT.test(this,p)
        if (r)
            return r.separation;
        return Vector.Zero; 
    }
    /**
     * Vérifie si il y a collision entre ce cercle et un autre
     * @override
     * @param {Circle} circle Cercle à tester
     * @returns {boolean} Représente si il y a collision
     */
    collide_Circle(circle)
    {
        var r = this.radius * this.radius + circle.radius * circle.radius;
        return this.origin.to(circle.origin).sqrlength <= r;
    }
    /**
     * Calcul le déplacement nécessaire à effectuer par ce cercle pour sortir d'un autre
     * @override
     * @param {Circle} circle Cercle à tester
     * @returns {Vector} Déplacement à effectuer pour sortir
     */
    collide_CircleOverlap(circle)
    {
        var r = this.radius * this.radius + circle.radius * circle.radius;
        let v = circle.origin.to(this.origin);
        let a = v.sqrlength;
        if (a <=  r)
        {
            return v.normalize(r - Math.sqrt(a));
        }
        return Vector.Zero;
    }
    /**
     * Vérifie si il y a collision entre ce cercle et un polygone
     * @override
     * @param {Polygon} polygon Polygone à tester
     * @returns {boolean} Représente si il y a collision
     */
    collide_Polygon(polygon)
    {
        return !SAT.test(this,polygon);
    }
    /**
     * Calcul le déplacement nécessaire à effectuer par ce cercle pour sortir d'un polygone
     * @override
     * @param {Polygon} polygon Polygone à tester
     * @returns {Vector} Déplacement à effectuer pour sortir
     */
    collide_PolygonOverlap(polygon)
    {
        let r = SAT.test(this,polygon)
        if (r)
            return r.separation;
        return Vector.Zero; 
    }
}