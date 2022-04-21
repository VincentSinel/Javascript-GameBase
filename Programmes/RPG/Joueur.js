class Joueur extends Lutin_SC
{
    constructor(X,Y, scene)
    {
        super(X,Y, "Images/Joueur/Perso.png", [32,32], 1);
        this.Vue = 0
        this.CentreRotation = new Vecteur2(0.5,1)

        this.Scene = scene;
        this.OldX = X;
        this.OldY = Y;
    }


    Calcul(Delta)
    {
        super.Calcul(Delta)
        let deplacementx = 0;
        let deplacementy = 0;

        if (Clavier.ToucheBasse("z"))
            deplacementy += 1
        if (Clavier.ToucheBasse("s"))
            deplacementy -= 1
        if (Clavier.ToucheBasse("q"))
            deplacementx -= 1
        if (Clavier.ToucheBasse("d"))
            deplacementx += 1

        this.X += deplacementx * 2 * Delta
        this.Y += deplacementy * 2 * Delta

        let id = 4 + this.Vue * 12;
        if (this.TestContact())
        {
            this.X = this.OldX;
            this.Y = this.OldY;
        }
        else
        {
            this.OldX = this.X;
            this.OldY = this.Y;
            if (deplacementx > 0)
                this.Vue = 2
            if (deplacementx < 0)
                this.Vue = 1
            if (deplacementy > 0 && deplacementx == 0)
                this.Vue = 3
            if (deplacementy < 0 && deplacementx == 0)
                this.Vue = 0

            if (deplacementx != 0 || deplacementy != 0)
                id = 3 + this.Vue * 12 + 1 + ((-2 + Math.floor(this.Time / 12) % 4) % 2)
        }
            
        this.BasculerCostume(id)

        
    }


    TestContact()
    {
        if (this.Scene.MiddleTileMap.Contact_AABB(this))
        {
            return true
        }

        return false
    }
}