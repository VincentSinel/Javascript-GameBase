class MenuEditionTileMap extends Panneau
{
    constructor(Tilemap, Taille = 100)
    {
        super(0,Ecran_Hauteur - Tilemap.TailleTile - 20, Ecran_Largeur, Tilemap.TailleTile + 20)
        this.T = Tilemap;
    }

    Calcul(Delta)
    {
        super.Calcul(Delta)
    }

    Dessin(Context)
    {
        super.Dessin(Context)
    }
}