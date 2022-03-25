class JeuMoto extends Scene
{
    constructor()
    {
        super();
        Debug.Parametre.Camera = false;
       
        // Création des routes
        this.Routes = []
        for(let r = 0; r < 4 ; r ++){
                this.Routes.push(new Route(r));
        }


        // Création du joueur
        this.Moto = new Moto();
        this.Moto.Parent = this; ////////Ajout du parent
        this.ZObject.push(this.Moto);

        this.Roue = new Lutin(0,0,["Images/Moto/Roue.png"]);
        this.ZObject.push(this.Roue)

        // Création des voitures
        this.NombreVoiture = 20
        this.Voitures = []
        for(let v = 0; v < this.NombreVoiture; v++)
        {
            let voiture = new Voiture()
            voiture.Parent = this; ////////Ajout du parent
            this.Voitures.push(voiture)
            this.ZObject.push(voiture)
        }

        this.Compteur = new Lutin(0,0,["Images/Moto/Compteur.png"]);
        this.Aiguille = new Lutin(0,0,["Images/Moto/Aiguille.png"]);
        this.Aiguille.CentreRotation = new Vecteur2(7.5 / 68, 0.5)

    }

    Calcul(Delta)
    {
        //super.Calcul(Delta)

        // Mise a jour Routes
        for(let r = 0; r < 4 ; r ++){
             this.Routes[r].Calcul(Delta);
        }

        // Mise a jour Moto
        this.Moto.Calcul(Delta);
        this.Roue.X = this.Moto.X;
        this.Roue.Z = this.Moto.Z - 1;
        this.Roue.Y = this.Moto.Y;
        this.Roue.Direction = -this.Roue.X / 153 * 360

        // Mise a jour Voitures
        for(let v = 0; v < this.NombreVoiture; v++)
        {
            this.Voitures[v].Calcul(Delta)
        }

        this.Compteur.Calcul(Delta);
        this.Aiguille.Calcul(Delta);

        this.Compteur.X = Camera.X - Ecran_Largeur / 2 + 55;
        this.Compteur.Y = Camera.Y - Ecran_Hauteur / 2 + 55;
        this.Aiguille.X = Camera.X - Ecran_Largeur / 2 + 55;
        this.Aiguille.Y = Camera.Y - Ecran_Hauteur / 2 + 55;

        super.Calcul(Delta)
    }

    Dessin(Context)
    {
        // Dessin des routes
        for(let r = 0; r < 4 ; r ++){
             this.Routes[r].Dessin(Context);
        }

        // Dessin des éléments du ZObject
        super.Dessin(Context);


        this.Compteur.Dessin(Context)
        this.Aiguille.Dessin(Context)
    }
}