class PNJ extends Lutin
{
    constructor(X, Y, Costumes)
    {
        super(X,Y,Costumes)

        this.Texte = "Bonjour, quelle belle journée !"
        this.CentreRotation = new Vecteur2(0.5,1) //#####################
    }

    Calcul(Delta)
    {
        super.Calcul(Delta)

        let x = Niveau2.Joueur.X - this.X;
        let y = Niveau2.Joueur.Y - this.Y;
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