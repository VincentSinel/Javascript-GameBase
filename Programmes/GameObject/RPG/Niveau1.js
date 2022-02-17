class Niveau1
{
    static Joueur;

    constructor()
    {
        Niveau1.Joueur = new Joueur(0,0)

        this.PNJ = new PNJ(200,200,["Images/Joueur/B_1.png"])

    }

    Calcul()
    {
        Niveau1.Joueur.Calcul()
        this.PNJ.Calcul()
    }

    Dessin(Context)
    {
        Niveau1.Joueur.Dessin(Context)
        this.PNJ.Dessin(Context)
    }
}