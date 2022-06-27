/**
 * Représente un polygone permettant de gerer les collisions avec une autre forme
 * @class
 * @extends Shape
 */
class Polygon extends Shape
{
    #refreshboundingbox = true;
    #_boundingbox = undefined
    #rotation = 0;
    #scale = 0;

    /**
     * Créer un polygone régulier avec le nombre de sommet choisie, et une taille définit
     * @param {int} numOfSides 
     * @param {number} radius 
     */
     static Regular(origin = Vector.Zero, numOfSides=3, radius = 100)
     {
         numOfSides = Math.round(numOfSides);
         if (numOfSides < 3)
             throw "You need at least 3 sides for a polygon"
 
         var poly = new Polygon(origin, []);
         // figure out the angles required
         var rotangle = (Math.PI * 2) / numOfSides;
         var angle = 0;
         // loop through and generate each point
         for (var i = 0; i < numOfSides; i++) {
             angle = (i * rotangle) + ((Math.PI-rotangle)*0.5);
             let pt = new Vector(Math.cos(angle) * radius,
                            Math.sin(angle) * radius);
             poly.vertices.push(pt);
         }
         return poly;
     }

    /**
     * Créer une représentation de polygone ATTENTION, celui-ci doit être Convexe
     * @constructor
     * @param {Vector} origin Origine du polygone
     * @param {Vector[]} Points Tableau des sommets relatif à l'origine de celui-ci
     */
    constructor(origin, vertices)
    {
        super()
        this.origin = origin;
        this.vertices = vertices;
        this.scale = 1.0;
        this.rotation = 0;
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
      * Orientation
      * @type {float}
      */
     get rotation()
     {
         return this.#rotation;
     }
     set rotation(v)
     {
         this.#rotation = v;
         this.#refreshboundingbox = true;
     }
     /**
      * Taille
      * @type {float}
      */
     get scale()
     {
         return this.#scale;
     }
     set scale(v)
     {
         this.#scale = v;
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
             let vert = this.getTransformedVerts();
             if (vert.length === 0)
                return new Rectangle(this.origin, 0,0);
             let xmin = vert[0].x;
             let ymin = vert[0].y;
             let xmax = xmin;
             let ymax = ymax;
             for (let v = 1; v < vert.length; v++) 
             {
                xmin = Math.min(vert[v].x, xmin);
                ymin = Math.min(vert[v].y, ymin);
                xmax = Math.max(vert[v].x, xmax);
                ymax = Math.max(vert[v].y, ymax);
             }
             this.#_boundingbox = new Rectangle(new Vector(this.x + xmin, this.y + ymin), Math.abs(xmax - xmin), Math.abs(ymax - ymin));
             this.#refreshboundingbox = false;
         }
         return this.#_boundingbox;
     }

     //#endregion

    /**
     * Adapt la positions des sommets à l'orientation du polygone et à son zoom
     * @returns {Vector[]} Liste des sommets adapté
     */
    getTransformedVerts()
    {
        return this.vertices.map(vert => {
            var newVert = vert.clone();
            if (this.rotation != 0)
            {
                let hyp = Math.sqrt(Math.pow(vert.x, 2) + Math.pow(vert.y,2));
                let angle = Math.atan2(vert.y, vert.x);
                angle += this.rotation;
                
                newVert.x = Math.cos(angle) * hyp;
                newVert.y = Math.sin(angle) * hyp;
            }
            if (this.scale != 0)
            {
                newVert.x *= this.scale;
                newVert.y *= this.scale;
            }

            return newVert;
        });
    }
    /**
     * Vérifie si il y a collision entre ce polygone et un rectangle
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
     * Calcul le déplacement nécessaire à effectuer par ce polygone pour sortir d'un rectangle
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
     * Vérifie si il y a collision entre ce polygone et un cercle
     * @override
     * @param {Circle} circle Cercle à tester
     * @returns {boolean} Représente si il y a collision
     */
    collide_Circle(circle)
    {
        return !SAT.test(this,circle);
    }
    /**
     * Calcul le déplacement nécessaire à effectuer par ce polygone pour sortir d'un cercle
     * @override
     * @param {Circle} circle Cercle à tester
     * @returns {Vector} Déplacement à effectuer pour sortir
     */
    collide_CircleOverlap(circle)
    {
        let r = SAT.test(this,circle)
        if (r)
            return r.separation;
        return Vector.Zero; 
    }
    /**
     * Vérifie si il y a collision entre ce polygone et un autre
     * @override
     * @param {Polygon} polygon Polygone à tester
     * @returns {boolean} Représente si il y a collision
     */
    collide_Polygon(polygon)
    {
        return !SAT.test(this,polygon);
    }
    /**
     * Calcul le déplacement nécessaire à effectuer par ce polygone pour sortir d'un autre
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