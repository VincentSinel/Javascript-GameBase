class Moto extends Lutin 
{
    constructor()
    {
        super(0,0,["Images/Moto/Moto1.png"])

        this.Vitesse = 1;
        this.Acceleration = 1.05;

        this.VitesseMax = 10;

        this.OldX = 100;
        this.OldY = 0;

        //this.CentreRotation = new Vecteur2(24/155, 67.5/93)
    }


    Calcul()
    {
        super.Calcul()

        this.X = this.OldX;
        this.Y = this.OldY;


        this.X += this.Vitesse

        if(Clavier.ToucheBasse(" "))
        {        
            this.Vitesse = Math.max(1, this.Vitesse * this.Acceleration);
        }
        else
        {
            this.Vitesse = (this.Vitesse - 0.1) * 0.99
        }

        this.Vitesse = Math.max(0, Math.min(this.VitesseMax, this.Vitesse))

        if(Clavier.ToucheBasse("ArrowUp"))
        {
            this.Y += this.Vitesse / 2 //###########################
            this.Y = Math.min(this.Y, 200)
        }
        if(Clavier.ToucheBasse("ArrowDown"))
        {
            this.Y -= this.Vitesse / 2 //###########################
            this.Y = Math.max(this.Y, -200)
        }

        //let coef = Math.max(this.Vitesse / this.VitesseMax * 100 - 20, 0) / 80 * 45
        //this.Direction = coef;


        Camera.X = Math.max(this.X, Ecran_Largeur / 2);
        
        this.OldX = this.X;
        this.OldY = this.Y;
    }
}