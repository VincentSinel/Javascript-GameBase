class PNJ extends Lutin
{
    constructor(X, Y, Costumes)
    {
        super(X,Y,Costumes)

        this.Texte = "Bonjour, quelle belle journée !"
    }

    Calcul()
    {
        super.Calcul()

        let x = Niveau1.Joueur.X - this.X;
        let y = Niveau1.Joueur.Y - this.Y;
        let distance = Math.sqrt(x*x + y*y)


        if (distance < 60)
        {
            if(Clavier.ToucheJusteBasse("Enter"))
            {
                this.Dire(this.Texte)
            }
        }
        
    }
}