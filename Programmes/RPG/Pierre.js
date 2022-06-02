class Pierre extends Lutin
{
    constructor(X,Y)
    {
        super(X,Y,["Images/Chat.png"])
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
                Player.AjoutInventaire("Pierre", 1);
                this.Destroy()
            }
        }
    }

    get CollisionRect()
    {
        return new Rectangle(new Vector(0,0),0,0);
    }
}