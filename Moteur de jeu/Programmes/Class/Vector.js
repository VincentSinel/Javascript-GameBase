class Vector 
{

    /**
     * Vecteur nul
     * @type {Vector}
     */
    static get Zero()
    {
        return new Vector(0,0,0);
    }
    /**
     * Vecteur Un (1,1,1)
     * @type {Vector}
     */
    static get One()
    {
        return new Vector(1,1,1);
    }
    /**
     * Vecteur Un plan (1,1,0)
     * @type {Vector}
     */
    static get OnePlan()
    {
        return new Vector(1,1,0);
    }
    /**
     * Vecteur Droite (1,0,0)
     * @type {Vector}
     */
    static get Right()
    {
        return new Vector(1,0,0);
    }
    /**
     * Vecteur Haut (0,1,0)
     * @type {Vector}
     */
    static get Up()
    {
        return new Vector(0,1,0);
    }
    /**
     * Vecteur Avant (0,0,1)
     * @type {Vector}
     */
    static get Foreward()
    {
        return new Vector(0,0,1);
    }
    /**
     * Crée un Vecteur normalisé, tourné d'un angle précis
     * @param {float} theta Angle en radian
     * @returns Vecteur de longueur 1
     */
    static FromAngle(theta)
    {
        let x = Math.cos(theta);
        let y = Math.sin(theta);
        return new Vector(x,y,0);
    }
    /**
     * Créer un vecteur
     * @constructor
     * @param {float} x Position X
     * @param {float} y Position Y
     * @param {float} z Position Z
     */
    constructor(x, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    //#region  GETTER SETTER

    /**
     * Longueur
     * @type {float}
     */
    get length() {
        return VMath.Length(this);
    }
    /**
     * Longueur carré
     * @type {float}
     */
    get sqrlength()
    {
        return VMath.SqrLength(this);
    }
    /**
     * Milieu
     * @type {Vector}
     */
    get middle()
    {
        return this.time(0.5);
    }
    /**
     * Angle
     * @type {float}
     */
    get angle()
    {
        return Math.atan2(this.y, this.x);
    }

    //#endregion

    /**
     * Calcul la somme de ce vecteur et d'un autre
     * @param {Vector} v2 Vecteur à ajouter
     * @returns {Vector} Ce vecteur plus le vecteur choisie
     */
    add(v2) {
        var v = new Vector(this.x + v2.x,
            this.y + v2.y,
            this.z + v2.z);
        return v;
    }
    /**
     * Calcul le vecteur entre ce point et celui choisi
     * @param {Vector} v2 Vecteur d'arriver
     * @returns {Vector} Nouveau Vecteur
     */
    to(v2) {
        var v = new Vector(v2.x - this.x,
            v2.y - this.y,
            v2.z - this.z);
        return v;
    }
    /**
     * Effectue une homothétie de ce vecteur
     * @param {Vector} v2 Coefficient à appliquer
     * @returns {Vector} Nouveau Vecteur
     */
    time(coef) {
        var v = new Vector(this.x * coef,
            this.y * coef,
            this.z * coef);
        return v;
    }
    /**
     * Calcul le produit scalaire de ce vecteur et d'un autre
     * @param {Vector} v2 Vecteur 2
     * @returns Produit scalaire
     */
    dot(v2)
    {
        return this.x * v2.x + this.y * v2.y + this.z * v2.z
    }
    /**
     * Créer un vecteur de même direction de la longueur choisie
     * @param {float} [newlenght=1] Nouvelle longueur
     * @returns Nouveau Vecteur
     */
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
    /**
     * Calcul l'angle entre ce point et un point cible
     * @param {Vector} v2 Position
     * @returns Angle entre ce point et celui cible
     */
    angleto(v2)
    {
        return Math.acos(this.dot(v2) / (this.length * v2.length));
    }
    /**
     * Calcul le produit vectoriel de ce vecteur et d'un second
     * @param {Vector} v2 Vecteur 2
     * @returns {Vector} Produit vectoriel
     */
    cross(v2)
    {
        var v = new Vector(this.y*v2.z - this.z*v2.y,
            this.z*v2.x - this.x*v2.z,
            this.x*v2.y - this.y*v2.x);
        return v;
    }
    /**
     * Calcul la distance entre ce point et un second
     * @param {Vector} v2 Vecteur2
     * @returns Distance entre ce point et un second
     */
    distance(v2)
    {
        return this.to(v2).length;
    }
    /**
     * Effectue la rotation d'un angle choisi de ce vecteur
     * @param {float} angle Angle en radian
     * @returns {Vector} Nouveau Vecteur
     */
    rotate(angle)
    {
        return  Matrix.fromrotation(angle).time(this);
    }
}
/**
 * Outils de calcul pour vecteur
 */
class VMath
{
    /**
     * Calcul la longueur d'un vecteur
     * @param {Vector} v1 Vecteur
     * @returns {float} Longueur du vecteur
     */
    static Length(v1)
    {
        return Math.sqrt(VMath.SqrLength(v1));
    }
    /**
     * Calcul la longueur au carré d'un vecteur
     * @param {Vector} v1 Vecteur
     * @returns {float} Longueur au carré d'un vecteur
     */
    static SqrLength(v1)
    {
        return VMath.Square(v1.x) + VMath.Square(v1.y) + VMath.Square(v1.z)
    }
    /**
     * Calcul le carré d'un nombre
     * @param {float} value Valeur
     * @returns Valeur au carré
     */
    static Square(value)
    {
        return value * value;
    }
}