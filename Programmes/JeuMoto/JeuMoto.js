class JeuMoto extends Scene
{
    static CoefAppV = 50000;

    constructor()
    {
        super("JeuMoto");
        Debug.Parametre.Camera = false;
        Debug.Parametre.Grille = false;
        Debug.Parametre.Info = false;
        Debug.Parametre.TimeMesure = false;

        let UI2 = new UI_Button(Ecran_Largeur - 80, 0, 1000000000, 80, 25, "Plein Ecran")
        UI2.ClicAction = function(){ Camera.PleinEcran()};

        CouleurFond = "dark grey"
        this.KeepUpdating = true;

        this.Routes = []
        for(let r = 0; r < 4 ; r ++){
                this.Routes.push(this.AddChildren(new Route(r)));
        }

        this.Voitures = []
        this.Moto = this.AddChildren(new Moto(this));
        this.Aiguille = this.AddChildren(new Lutin(0, 0,["Images/Moto/Aiguille.png"]));

        this.ComboObject = this.AddChildren(new Combo(this));
        this.ComboObject.Z = 100000000

        this.Compteur = this.AddChildren(new Lutin(0, 0,["Images/Moto/Compteur.png"]));
        this.Aiguille.CentreRotation = new Vector(7.5 / 68, 0.5);
        this.Compteur.Z = 500000
        this.Aiguille.Z = 500001
        
        this.ProchaineVoiture = 180;

        let _this = this;
        this.NewGame = new UI_Button(Ecran_Largeur / 2 - 60, Ecran_Hauteur - 100, 1000000000, 120, 25, "Nouvelle Partie")
        this.NewGame.ClicAction = function(){ _this.Moto.NouvellePartie()};
        this.NewGame.Visible = false;
    }

    AjouterVoiture(Delta)
    {
        let i = 0
        while (this.ProchaineVoiture <= 0 && i < 30)
        {
            let X = this.Moto.X + Ecran_Largeur + 200 //+ Math.random() * 500;
            let Y = Math.random() * 350 - 200;
            let voiture = this.AddChildren(new Voiture(X, Y));
            this.Voitures.push(voiture);

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

        let id = 0;
        while (id < this.Voitures.length) 
        {
            if(this.Voitures[id].X < Camera.X - Ecran_Largeur / 2 - 200)
            {
                this.RemoveChildren(this.Voitures[id])
                this.Voitures.splice(id, 1);
            }
            else
            {
                id++;
            }
        }

        this.AjouterVoiture(Delta);
        

        this.Compteur.X = Camera.X - Ecran_Largeur / 2 + 55;
        this.Compteur.Y = Camera.Y + Ecran_Hauteur / 2 - 55;
        this.Aiguille.X = Camera.X - Ecran_Largeur / 2 + 55;
        this.Aiguille.Y = Camera.Y + Ecran_Hauteur / 2 - 55;
    }
}