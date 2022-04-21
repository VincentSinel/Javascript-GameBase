class JeuMoto extends Scene
{
    constructor()
    {
        super();
        Debug.Parametre.Camera = false;
       
        this.Routes = []
        for(let r = 0; r < 4 ; r ++){
                this.Routes.push(new Route(r));
        }
        this.Moto = new Moto(this);

        this.Voitures = [];
        this.ZObject.push(this.Moto);


        this.Compteur = new Lutin(0, 0,["Images/Moto/Compteur.png"]);
        this.Aiguille = new Lutin(0, 0,["Images/Moto/Aiguille.png"]);
        this.Aiguille.CentreRotation = new Vecteur2(7.5 / 68, 0.5);
    }

    AjouterVoiture()
    {
        let X = this.Moto.X + 1000 + Math.random() * 500;
        let Y = Math.random() * 240 - 120;
        let voiture = new Voiture(X, Y);
        this.Voitures.push(voiture);
        this.ZObject.push(voiture);
    }

    Calcul(Delta)
    {
        super.Calcul(Delta)
        for(let r = 0; r < 4 ; r ++){
             this.Routes[r].Calcul(Delta);
        }
        this.Moto.Calcul(Delta);

        for(let v = 0; v < this.Voitures.length; v++)
        {
            this.Voitures[v].Calcul(Delta);
        }

        //this.AjouterVoiture();

        this.Compteur.X = Camera.X - Ecran_Largeur / 2 + 55;
        this.Compteur.Y = Camera.Y - Ecran_Hauteur / 2 + 55;
        this.Aiguille.X = Camera.X - Ecran_Largeur / 2 + 55;
        this.Aiguille.Y = Camera.Y - Ecran_Hauteur / 2 + 55;
    }

    Dessin(Context)
    {
        for(let r = 0; r < 4 ; r ++){
             this.Routes[r].Dessin(Context);
        }

        super.Dessin(Context);

        this.Compteur.Dessin(Context);
        this.Aiguille.Dessin(Context);
    }
}