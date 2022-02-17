class JeuMoto
{
    constructor()
    {
        Debug.Parametre.Camera = false;

        this.Moto = new Moto();
    }

    Calcul()
    {
        this.Moto.Calcul();
    }

    Dessin(Context)
    {
        this.Moto.Dessin(Context);
    }
}