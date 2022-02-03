class Paddle extends Lutin
{
    constructor(X,Y) 
    {
        var Costumes = ["Images/Paddle.png"]
        //Cette fonction appel le constructeur de la class Lutin
        // Le "super" de manière général permet d'appeler des élèments de la class parents
        super(X,Y, Costumes);

        this.Vitesse = 5;
    }

    Calcul() 
    {
        super.Calcul();

        if (Clavier.ToucheBasse("ArrowLeft"))
        {
            this.X -= this.Vitesse;
            this.X = Math.max(this.Image.width / 2, this.X)
        }
        if (Clavier.ToucheBasse("ArrowRight"))
        {
            this.X += this.Vitesse;
            this.X = Math.min(JeuPong.JeuLargeur - this.Image.width / 2, this.X)
        }
    }
}