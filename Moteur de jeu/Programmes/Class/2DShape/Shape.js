/**
 * Représente une forme 2D pour tester des collisions
 * @class
 */
class Shape
{
    /**
     * Vérifie si il y a collision entre deux Shape
     * @param {Shape|Vector} object Objet à tester vis à vis de celui-ci
     * @returns {boolean} Représente si il y a collision
     */
    collide(object)
    {
        if (object instanceof Rectangle)
        {
            return this.collide_Rectangle(object)
        }
        else if (object instanceof Circle)
        {
            return this.collide_Circle(object)
        }
        else if (object instanceof Polygon)
        {
            return this.collide_Polygon(object)
        }
        else if (object instanceof Vector)
        {
            return this.collide_Point(object)
        }
    }
    /**
     * Vérifie si il y a collision entre deux Shape
     * @param {Shape|Vector} object Objet à tester vis à vis de celui-ci
     * @returns {boolean} Représente si il y a collision
     */
    collide_Overlap(object)
    {
        if (object instanceof Rectangle)
        {
            return this.collide_RectangleOverlap(object)
        }
        else if (object instanceof Circle)
        {
            return this.collide_CircleOverlap(object)
        }
        else if (object instanceof Polygon)
        {
            return this.collide_PolygonOverlap(object)
        }
        else if (object instanceof Vector)
        {
            return this.collide_PointOverlap(object)
        }
    }
    /**
     * Vérifie si il y a collision entre ce shape et un rectangle
     * @param {Rectangle} rectangle Rectangle à tester
     * @returns {boolean} Représente si il y a collision
     */
    collide_Rectangle(rectangle)
    {
        throw "Cette fonction n'est pas encore disponible"
    }
    /**
     * Calcul le déplacement nécessaire à effectuer par ce shape pour sortir d'un rectangle
     * @param {Rectangle} rectangle Rectangle à tester
     * @returns {Vector} Déplacement à effectuer pour sortir
     */
    collide_RectangleOverlap(rectangle)
    {
        throw "Cette fonction n'est pas encore disponible"
    }
    /**
     * Vérifie si il y a collision entre ce shape et un cercle
     * @param {Circle} circle Cercle à tester
     * @returns {boolean} Représente si il y a collision
     */
    collide_Circle(circle)
    {
        throw "Cette fonction n'est pas encore disponible"
    }
    /**
     * Calcul le déplacement nécessaire à effectuer par ce shape pour sortir d'un cercle
     * @param {Circle} circle Rectangle à tester
     * @returns {Vector} Déplacement à effectuer pour sortir
     */
    collide_CircleOverlap(circle)
    {
        throw "Cette fonction n'est pas encore disponible"
    }
    /**
     * Vérifie si il y a collision entre ce shape et un polygone
     * @param {Polygon} polygon Polygone à tester
     * @returns {boolean} Représente si il y a collision
     */
    collide_Polygon(polygon)
    {
        throw "Cette fonction n'est pas encore disponible"
    }
    /**
     * Calcul le déplacement nécessaire à effectuer par ce shape pour sortir d'un polygone
     * @param {Polygon} polygon Polygone à tester
     * @returns {Vector} Déplacement à effectuer pour sortir
     */
    collide_PolygonOverlap(polygon)
    {
        throw "Cette fonction n'est pas encore disponible"
    }
    /**
     * Vérifie si il y a collision entre ce shape et un vecteur
     * @param {Vector} vector Vecteur à tester
     * @returns {boolean} Représente si il y a collision
     */
    collide_Point(vector)
    {
        throw "Cette fonction n'est pas encore disponible"
    }
    /**
     * Calcul le déplacement nécessaire à effectuer par ce shape pour sortir d'un vecteur
     * @param {Vector} vector Vecteur à tester
     * @returns {Vector} Déplacement à effectuer pour sortir
     */
    collide_PointOverlap(vector)
    {
        throw "Cette fonction n'est pas encore disponible"
    }
}