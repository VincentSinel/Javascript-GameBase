class Moto extends Lutin 
{
    static VitesseMax = 10; // Vitesse maximal ateignable rapidement
    static VitesseMaxCompteur = 40; // Correspondance vitesse max sur le compteur
    static CoefficientVMax = 0.02; // Acceleration jusqu'a vitesse max
    static VitesseFixe = 0.005; // Vitesse fixe constant permettant de dépasser la vitesse max sur le long terme
    static DecelationSol = 0.9; // Décélération lorsque la roue touche le sol
    static VitesseCabrage = 1.2; // Vitesse de cabrage lorsque l'on appuie sur l'accelerateur
    static CoefficientChute = 1.7; // Vitesse de chute de la moto lorsque l'accelerateur n'est pas enfoncé
    static AngleMax = 360; // Vitesse de chute de la moto lorsque l'accelerateur n'est pas enfoncé

    constructor()
    {
        super(0,0,["Images/Moto/Moto1.png"])

        this.Vitesse = 30;
        this.Acceleration = 400;
        this.TempsAppuie = 0;

        this.OldX = -200;
        this.OldY = 0;

        this.CentreRotation = new Vector(24/155, 67.5/93);

        this.Mort = false;
        this.Immortel = 0;
        this.Vie = 3;
    }

    NouvellePartie()
    {
        this.Vie = 3;
        this.TempsStop = 0;
        this.X = 0;
        this.Acceleration = 400;
        this.Scene.ComboObject.ScoreGlobal = 0;
        this.Scene.NewGame.Visible = false;
        this.Scene.ProchaineVoiture = 180;
    }


    Calcul(Delta)
    {
        super.Calcul(Delta)

        if(this.Mort)
        {
            this.AnimationMort(Delta)
            return;
        }
 
        this.Commande(Delta)
        
        if((this.Contact() && this.Immortel <= 0) || this.Direction < -Moto.AngleMax)
        {
            this.Mort = true;
            this.Vie -= 1;
        }
        else if (this.Immortel > 0)
        {
            this.Immortel -= Delta;
        }
    }

    AnimationMort(Delta)
    {
        if (this.Direction > -180)
        {
            this.Direction -= 10 * Delta;
            this.X += this.Vitesse * Delta;
            this.Vitesse = this.Vitesse * 0.99;
            this.TempsStop = 60;
        }
        else if(this.TempsStop > 0)
        {
            this.TempsStop -= Delta;
            this.X += this.Vitesse * Delta;
            this.Vitesse = this.Vitesse * 0.99;
            if (this.Vie == 0)
            {
                this.TempsStop = 60;
                this.Scene.NewGame.Visible = true;
            }
        }
        else
        {
            this.Mort = false;
            this.Immortel = 120;
            this.Vitesse = 0;
            this.Acceleration = 0;
            this.Direction = 0;
            this.TempsAppuie = 0;
        }
    }

    Commande(Delta)
    {   
        this.X = this.OldX;
        this.Y = this.OldY;


        
        this.X += this.Vitesse * Delta

        if(Clavier.ToucheBasse(" "))
        {        
            this.Acceleration += Delta;
            this.TempsAppuie += Delta;
        }
        else
        {
            this.TempsAppuie = Math.max(0, this.TempsAppuie - Delta * Moto.CoefficientChute);
            if (this.Direction > -10)
            {
                this.Acceleration = Math.max((this.Acceleration - 0.0001) * Moto.DecelationSol, 0);
            }

        }

        this.Vitesse = (1 - Math.pow(Math.E, -this.Acceleration * Moto.CoefficientVMax)) * Moto.VitesseMax + this.Acceleration * Moto.VitesseFixe;

        this.Scene.Compteur.Aiguille.Direction = 30 - (this.Vitesse / Moto.VitesseMax) * 90 / 60 * Moto.VitesseMaxCompteur;

        if(Clavier.ToucheBasse("ArrowUp"))
        {
            this.Y -= this.Vitesse / 2 * Delta
            this.Y = Math.max(this.Y, -200)
        }
        if(Clavier.ToucheBasse("ArrowDown"))
        {
            this.Y += this.Vitesse / 2 * Delta
            this.Y = Math.min(this.Y, 200)
        }

        
        this.Direction = Math.min(-(this.TempsAppuie) * Moto.VitesseCabrage, 0)


        Camera.X = Math.max(this.X + Game.Ecran_Largeur / 2 * 5 / 6, Game.Ecran_Largeur / 2);
        
        this.OldX = this.X;
        this.OldY = this.Y;

        let L = this.Zoom * this.Image.width;
        let H = this.Zoom * this.Image.height;
        let decalageX = (24 / 155) * L;
        let decalageY = (25.5 / 93) * H;

        this.Z = this.Y + decalageY;

        this.ColRect = Rectangle.FromPosition(this.X - decalageX, this.Y + decalageY - H/3, L, H/3)
        //Debug.AjoutRectangle(this.ColRect, "green")
    }


    Contact()
    {
        for (let v = 0; v < this.Scene.Voitures.length; v++) {
            if (this.ColRect.collide(this.Scene.Voitures[v].ColRect))
                return true;
        }
        return false;
    }
}