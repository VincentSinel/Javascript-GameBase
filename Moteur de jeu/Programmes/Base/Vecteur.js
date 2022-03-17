class Vecteur2
{
    /**
     * Calcul le produit scalaire de deux vecteur
     * @param {Vecteur2} vecteur1 Vecteur A
     * @param {Vecteur2} vecteur2 Vecteur B
     * @returns Renvoie le produit scalaire : A.B
     */
    static Dot(vecteur1, vecteur2)
    {
        return vecteur1.X * vecteur2.X + vecteur1.Y * vecteur2.Y
    }

    /**
     * Créer un vecteur représentant le déplacement d'un point A vers un point B
     * @param {Vecteur2} A Point de départ
     * @param {Vecteur2} B Point d'arrivé
     * @returns Vecteur représentant le déplacement A vers B
     */
    static AVersB(A, B)
    {
        return new Vecteur2(B.X - A.X, B.Y - A.Y);
    }

    /**
     * Projette un angle sur les axe X et Y
     * @param {number} Direction Angle en degré
     * @returns Vecteur2 représentant les deux projection de cette angle
     */
    static AngleVersVecteur(Direction)
    {
        return new Vecteur2(Math.cos(Direction * Math.PI / 180), Math.sin(Direction * Math.PI / 180));
    }

    /**
     * Créer un vecteur représentant la position d'un point
     * @param {number} X Position X
     * @param {number} Y Position Y
     */
    constructor(X = 0,Y = 0)
    {
        this.X = X;
        this.Y = Y;
    }

    /**
     * Calcul la longueur du vecteur
     * @returns Longueur du vecteur
     */
    Longueur()
    {
        return Math.sqrt(this.LongueurCarre());
    }

    /**
     * Calcul la longueur du vecteur au carré
     * @returns Longueur au carré du vecteur
     */
    LongueurCarre()
    {
        return this.X * this.X + this.Y * this.Y
    }

    /**
     * Determine la position relative d'un point vis à vis d'un segment orienté.
     * @param {Vecteur2} LigneDeb Point de début de segment
     * @param {Vecteur2} LigneFin Point de fin du segment
     * @returns Nombre > 0 si à gauche du segment; Nombre < 0 si à droite du segment; 0 si sur le segment
     */
    AGauche(LigneDeb,LigneFin)
    {
        return (LigneFin.X - LigneDeb.X) * (this.Y - LigneDeb.Y) - (this.X - LigneDeb.X) * (LigneFin.Y - LigneDeb.Y);
    }


    Normaliser(NouvelleLongueur = 1)
    {
        let l = this.Longueur();
        return new Vecteur2(this.X / l * NouvelleLongueur, this.Y / l * NouvelleLongueur);
    }

    Multiplier(valeur)
    {
        return new Vecteur2(this.X * valeur, this.Y * valeur)
    }

}