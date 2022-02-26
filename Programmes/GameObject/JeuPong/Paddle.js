class Paddle extends Lutin
{
    constructor(X,Y) 
    {
        var Costumes = ["Images/CasseBrique/Paddle.png"]
        //Cette fonction appel le constructeur de la class Lutin
        // Le "super" de manière général permet d'appeler des élèments de la class parents
        super(X,Y, Costumes);

        this.Vitesse = 5;
    }

    Calcul(Delta) 
    {
        super.Calcul(Delta);

        if (Clavier.ToucheBasse("ArrowLeft"))
        {
            this.X -= this.Vitesse * Delta;
            this.X = Math.max(this.Image.width / 2, this.X)
        }
        if (Clavier.ToucheBasse("ArrowRight"))
        {
            this.X += this.Vitesse * Delta;
            this.X = Math.min(JeuPong.JeuLargeur - this.Image.width / 2, this.X)
        }
    }
}