class Balle extends Lutin
{
    constructor(X,Y) 
    {
        var Costumes = [
            "Images/Brique1.png",
            "Images/Brique2.png",
            "Images/Brique3.png",
            "Images/Brique4.png",
            "Images/Brique5.png"
        ]
        //Cette fonction appel le constructeur de la class Lutin
        // Le "super" de manière général permet d'appeler des élèments de la class parents
        super(X,Y, Costumes);

        this.BasculerCostume(EntierAleat(5))

        this.Vitesse = 5;
        this.Direction = 90//EntierAleat(20,160)

        this.Radius = 10;
    }

    // Redéfinition de la fonction calcul
    Calcul() 
    {
        super.Calcul();

        this.Vitesse += 0.001
        if (this.X >= JeuPong.JeuLargeur)
        {
            this.X = JeuPong.JeuLargeur
            this.Direction = 180 - this.Direction;
        }
        if (this.X <= 0)
        {
            this.X = 0;
            this.Direction = 180 - this.Direction;
        }
        if (this.Y >= JeuPong.JeuHauteur)
        {
            this.Y = JeuPong.JeuHauteur
            this.Direction = - this.Direction;
        }
        if (this.Y <= 0)
        {
            this.Y = 0;
            this.Direction = - this.Direction;
        }

        this.Avancer(this.Vitesse)
    }
}