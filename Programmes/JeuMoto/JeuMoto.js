class JeuMoto
{
    constructor()
    {
        Debug.Parametre.Camera = false;

        this.Moto = new Moto();
    }

    Calcul(Delta)
    {
        this.Moto.Calcul(Delta);
    }

    Dessin(Context)
    {
        this.Moto.Dessin(Context);
    }
}