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

        // Mise a jour Voitures
        for(let v = 0; v < this.NombreVoiture; v++)
        {
            this.Voitures[v].Calcul(Delta)
        }

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
    }
}