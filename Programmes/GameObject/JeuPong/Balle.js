class Balle extends Lutin
{
    constructor() 
    {
        var Costumes = ["Images/CasseBrique/Balle.png"]
        //Cette fonction appel le constructeur de la class Lutin
        // Le "super" de manière général permet d'appeler des élèments de la class parents
        super(JeuPong.JeuLargeur / 2, JeuPong.JeuHauteur / 4, Costumes);

        this.Vitesse = 5;
        this.Direction = EntierAleat(20,160)

        this.Radius = 10;
        this.BalleAttente = 60;
    }

    // Redéfinition de la fonction calcul
    Calcul(Delta) 
    {
        super.Calcul(Delta);


        if (this.BalleAttente == 0)
        {
            this.Vitesse += 0.001
            if (this.X >= JeuPong.JeuLargeur - this.Radius)
            {
                this.X = JeuPong.JeuLargeur - this.Radius
                this.Direction = 180 - this.Direction;
            }
            if (this.X <=  this.Radius)
            {
                this.X = this.Radius;
                this.Direction = 180 - this.Direction;
            }
            if (this.Y >= JeuPong.JeuHauteur - this.Radius)
            {
                this.Y = JeuPong.JeuHauteur - this.Radius
                this.Direction = - this.Direction;
            }
            if (this.Y <= -this.Radius)
            {
                this.X = JeuPong.JeuLargeur / 2;
                this.Y = JeuPong.JeuHauteur / 4;
                this.Direction = EntierAleat(20,160);
                this.BalleAttente = 60;
            }

            this.Avancer(this.Vitesse * Delta)
        }
        else
        {
            this.BalleAttente -= 1;
        }

        
    }
}