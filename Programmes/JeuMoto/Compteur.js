class Compteur extends Lutin
{
    constructor()
    {
        super(0, 0,["Images/Moto/Compteur.png"]);
        this.Z = 500000;

        this.Aiguille = this.AddChildren(new Lutin(0, 0,["Images/Moto/Aiguille.png"]));
        this.Aiguille.CentreRotation = new Vector(7.5 / 68, 0.5);
        this.Aiguille.Z = 10000000;
    }

    Calcul(Delta)
    {
        this.X = Camera.X - Game.Ecran_Largeur / 2 + 55;
        this.Y = Camera.Y + Game.Ecran_Hauteur / 2 - 55;

        let v = this.Scene.Moto.Vitesse;
        this.Aiguille.Direction = 30 - (v / Moto.VitesseMax) * 90 / 60 * Moto.VitesseMaxCompteur;
    }
}