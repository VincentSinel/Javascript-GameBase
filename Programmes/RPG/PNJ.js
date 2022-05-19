class PNJ extends Lutin
{
    constructor(X, Y, Costumes)
    {
        super(X,Y,Costumes)

        this.Phrases = ["Did you ever play AMONG US Gregory", "I know it's hard for you to be sus", "YOU NEED TO VENT GREGORY"]

        this.Texte = "Moi j'aime pas les gens"
        this.CentreRotation = new Vector(0.5,1) //#####################
        this.Z = this.Y
        this.onSpeak = undefined
    }

    Calcul(Delta)
    {
        super.Calcul(Delta)

        let x = Player.X - this.X;
        let y = Player.Y - this.Y;
        let distance = Math.sqrt(x*x + y*y)


        if (distance < 60)
        {
            if(Clavier.ToucheJusteBasse("Enter"))
            {
                if(this.onSpeak)
                    this.onSpeak()
                this.Dire(this.Phrases[EntierAleat(0,this.Phrases.length)])
            }

        }
        else
        {
            this.Parle = false
        }
    }
}