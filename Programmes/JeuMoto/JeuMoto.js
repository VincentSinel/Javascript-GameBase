class JeuMoto extends Scene
{
    static CoefAppV = 5000;

    constructor()
    {
        super("JeuMoto");
        Debug.Parametre.Camera = false;
        CouleurFond = "green"
       
        this.Routes = []
        for(let r = 0; r < 4 ; r ++){
                this.Routes.push(this.AjoutEnfant(new Route(r)));
        }

        this.Voitures = []
        this.Moto = this.AjoutEnfant(new Moto(this));
        this.Aiguille = this.AjoutEnfant(new Lutin(0, 0,["Images/Moto/Aiguille.png"]));

        //this.ZObject.push(JeuMoto.Moto);

        this.ComboObject = this.AjoutEnfant(new Combo(this));
        this.ComboObject.Z = 100000000

        this.Compteur = this.AjoutEnfant(new Lutin(0, 0,["Images/Moto/Compteur.png"]));
        this.Aiguille.CentreRotation = new Vector(7.5 / 68, 0.5);
        this.Compteur.Z = 500000
        this.Aiguille.Z = 500001
        
        this.ProchaineVoiture = 180;
    }

    AjouterVoiture(Delta)
    {
        let i = 0
        while (this.ProchaineVoiture <= 0 && i < 30)
        {
            let X = this.Moto.X + Ecran_Largeur + 200 //+ Math.random() * 500;
            let Y = Math.random() * 350 - 200;
            let voiture = this.AjoutEnfant(new Voiture(X, Y));
            this.Voitures.push(voiture);
            //this.ZObject.push(voiture);

            this.ProchaineVoiture += 180 * 
            JeuMoto.CoefAppV / 
            (JeuMoto.CoefAppV + Camera.X);
            i++
        }
        if (!this.Moto.Mort)
        {
            this.ProchaineVoiture -= Delta;
        }
        
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
        
        let id = 0;
        while (id < this.Voitures.length) 
        {
            if(this.Voitures[id].X < Camera.X - Ecran_Largeur / 2 - 200)
            {
                this.SupprimerEnfant(this.Voitures[id])
                this.Voitures.splice(id, 1);
            }
            else
            {
                id++;
            }
        }

        this.ComboObject.Calcul(Delta);

        this.AjouterVoiture(Delta);
        

        this.Compteur.X = Camera.X - Ecran_Largeur / 2 + 55;
        this.Compteur.Y = Camera.Y + Ecran_Hauteur / 2 - 55;
        this.Aiguille.X = Camera.X - Ecran_Largeur / 2 + 55;
        this.Aiguille.Y = Camera.Y + Ecran_Hauteur / 2 - 55;
    }

    Dessin(Context)
    {
        //for(let r = 0; r < 4 ; r ++){
        //     this.Routes[r].Dessin(Context);
        //}

        //super.Dessin(Context);
        
        //this.ComboObject.Dessin(Context);

        //this.Compteur.Dessin(Context);
        //JeuMoto.Aiguille.Dessin(Context);
    }
}