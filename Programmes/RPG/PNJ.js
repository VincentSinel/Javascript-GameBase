class PNJ extends Lutin
{
    constructor(X, Y, Costumes, Scene)
    {
        super(X,Y,Costumes)

        this.Texte = "Bonjour, quelle belle journée !"
        this.CentreRotation = new Vecteur2(0.5,1) //#####################
        this.Parent = Scene;
    }

    Calcul(Delta)
    {
        super.Calcul(Delta)

        let x = this.Parent.Joueur.X - this.X;
        let y = this.Parent.Joueur.Y - this.Y;
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