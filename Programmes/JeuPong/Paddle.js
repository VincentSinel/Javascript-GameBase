class Paddle extends Lutin
{
    constructor(X,Y) 
    {
        var Costumes = ["Images/CasseBrique/Paddle.png"]
        //Cette fonction appel le constructeur de la class Lutin
        // Le "super" de manière général permet d'appeler des élèments de la class parents
        super(X,Y, Costumes);
    }

    Calcul(Delta) 
    {
        super.Calcul(Delta);

        this.X = Souris.X

        this.X = Math.max(this.TextWidth / 2, this.X)
        this.X = Math.min(JeuPong.JeuLargeur - this.TextWidth / 2, this.X)
    }
}