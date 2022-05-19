class Joueur extends Lutin_SC
{
    constructor(X,Y)
    {
        super(X,Y, "Images/Joueur/Perso.png", [32,32], 1);
        this.Vue = 0
        this.CentreRotation = new Vector(0.5,1);
        this.Vitesse = 2;
    }


    Calcul(Delta)
    {
        super.Calcul(Delta)
        let deplacementx = 0;
        let deplacementy = 0;

        if (Clavier.ToucheBasse("z"))
            deplacementy -= 1
        if (Clavier.ToucheBasse("s"))
            deplacementy += 1
        if (Clavier.ToucheBasse("q"))
            deplacementx -= 1
        if (Clavier.ToucheBasse("d"))
            deplacementx += 1

        let id = 4 + this.Vue *12

        if (deplacementx != 0 || deplacementy != 0)
        {
            let direction = new Vector(deplacementx, deplacementy)
            direction = direction.normalize(this.Vitesse * Delta);

            let v = new Vector(direction.x,0);
            let contact = this.TestContact(v)
            if (contact)
            {
                direction.x = contact.x;
            }
            v = new Vector(0,direction.y);
            contact = this.TestContact(v)
            if (contact)
            {
                direction.y = contact.y;
            }
            
            if (direction.length > this.Vitesse * Delta)
                direction = direction.normalize(this.Vitesse * Delta);

            this.X += direction.x;
            this.Y += direction.y;


            if (deplacementx > 0)
                this.Vue = 2
            if (deplacementx < 0)
                this.Vue = 1
            if (deplacementy > 0 && deplacementx == 0)
                this.Vue = 0
            if (deplacementy < 0 && deplacementx == 0)
                this.Vue = 3

            if (deplacementx != 0 || deplacementy != 0)
                id = 3 + this.Vue * 12 + 1 + ((-2 + Math.floor(this.Time / 12) % 4) % 2)
        }

        Camera.X = this.X;
        Camera.Y = this.Y;
        this.Z = this.Y;
        
        
        this.BasculerCostume(id)
    }

    TestContact(dir)
    {
        let rect = this.CollisionRect;
        rect.origin = rect.origin.add(dir);
        for (let i = 0; i < this.Parent.Children.length; i++) {
            const element = this.Parent.Children[i];
            if (element != this)
            {
                let v = element.GetOverlapVector(rect, dir);
                if (v && (v.x != 0 || v.y != 0))
                    return dir.add(v);  
            }
        }
        return false
    }

}