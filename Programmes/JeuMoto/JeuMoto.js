class JeuMoto extends Scene
{
    static CoefAppV = 5000;

    static Voitures = [];
    static Moto;
    static Aiguille;

    constructor()
    {
        super();
        Debug.Parametre.Camera = false;
        CouleurFond = "green"
       
        this.Routes = []
        for(let r = 0; r < 4 ; r ++){
                this.Routes.push(new Route(r));
        }

        JeuMoto.Moto = new Moto();
        JeuMoto.Aiguille = new Lutin(0, 0,["Images/Moto/Aiguille.png"]);

        this.ZObject.push(JeuMoto.Moto);

        this.ComboObject = new Combo();

        this.Compteur = new Lutin(0, 0,["Images/Moto/Compteur.png"]);
        JeuMoto.Aiguille.CentreRotation = new Vecteur2(7.5 / 68, 0.5);
        
        this.ProchaineVoiture = 180;
    }

    AjouterVoiture(Delta)
    {
        let i = 0
        while (this.ProchaineVoiture <= 0 && i < 30)
        {
            let X = JeuMoto.Moto.X + Ecran_Largeur + 200 //+ Math.random() * 500;
            let Y = Math.random() * 350 - 200;
            let voiture = new Voiture(X, Y);
            JeuMoto.Voitures.push(voiture);
            this.ZObject.push(voiture);

            this.ProchaineVoiture += 180 * 
            JeuMoto.CoefAppV / 
            (JeuMoto.CoefAppV + Camera.X);
            i++
        }
        if (!JeuMoto.Moto.Mort)
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
        JeuMoto.Moto.Calcul(Delta);

        for(let v = 0; v < JeuMoto.Voitures.length; v++)
        {
            JeuMoto.Voitures[v].Calcul(Delta);
        }
        
        let id = 0;
        while (id < JeuMoto.Voitures.length) 
        {
            if(JeuMoto.Voitures[id].X < Camera.X - Ecran_Largeur / 2 - 200)
            {
                this.ZObject.splice(this.ZObject.indexOf(JeuMoto.Voitures[id]), 1);
                JeuMoto.Voitures.splice(id, 1);
            }
            else
            {
                id++;
            }
        }

        this.ComboObject.Calcul(Delta);

        this.AjouterVoiture(Delta);
        

        this.Compteur.X = Camera.X - Ecran_Largeur / 2 + 55;
        this.Compteur.Y = Camera.Y - Ecran_Hauteur / 2 + 55;
        JeuMoto.Aiguille.X = Camera.X - Ecran_Largeur / 2 + 55;
        JeuMoto.Aiguille.Y = Camera.Y - Ecran_Hauteur / 2 + 55;
    }

    Dessin(Context)
    {
        for(let r = 0; r < 4 ; r ++){
             this.Routes[r].Dessin(Context);
        }

        super.Dessin(Context);
        
        this.ComboObject.Dessin(Context);

        this.Compteur.Dessin(Context);
        JeuMoto.Aiguille.Dessin(Context);
    }
}