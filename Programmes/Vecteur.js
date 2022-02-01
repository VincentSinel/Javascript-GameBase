class Vecteur2
{

    static Dot(vecteur1, vecteur2)
    {
        return vecteur1.X * vecteur2.X + vecteur1.Y * vecteur2.Y
    }

    static AVersB(A, B)
    {
        return new Vecteur2(B.X - A.X, B.Y - A.Y);
    }

    constructor(X = 0,Y = 0)
    {
        this.X = X;
        this.Y = Y;
    }


    Longueur()
    {
        return Math.sqrt(LongueurCarre());
    }

    LongueurCarre()
    {
        return this.X*this.X + this.Y*this.Y
    }

    AGauche(LigneDeb,LigneFin)
    {
        return ( (LigneFin.X - LigneDeb.X) * (this.Y - LigneDeb.Y) - (this.X - LigneDeb.X) * (LigneFin.Y - LigneDeb.Y) );
    }
}