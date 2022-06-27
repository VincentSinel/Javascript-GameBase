class Pierre extends Lutin
{
    constructor(X,Y)
    {
        super(X,Y,["Images/IconSet.png"])
        let id = 341;
        let x = (id % 16) * 24;
        let y = Math.floor(id / 16) * 24;
        this.Decoupage = [x,y,24,24];
    }

    static Objets = ["Pierre", "Bois", "Planche"]

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
                Player.AjoutInventaire(Pierre.Objets[EntierAleat(0,3)], 1);
                this.Destroy()
            }
        }
    }

    get CollisionRect()
    {
        return new Rectangle(new Vector(0,0),0,0);
    }
}