class ExempleLutin extends Lutin 
{
    constructor()
    {
        super(0,0,["Images/Chat.png"])

        this.Vitesse = 1;
        this.Acceleration = 1.1;

        this.VitesseMax = 10;
    }


    Calcul()
    {
        super.Calcul()

        this.X += this.Vitesse
        this.Dire(this.X)

        this.Vitesse *= this.Acceleration;
        this.Vitesse = Math.min(this.VitesseMax, this.Vitesse)

        //Camera.X = this.X
    }
}