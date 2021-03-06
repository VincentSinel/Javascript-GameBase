class Joueur extends Actor
{

    constructor(X,Y)
    {
        super(X,Y, "Images/Joueur/Perso.png", false,1);
        this.CentreRotation = new Vector(0.5,1);
        this.Vitesse = 2;

        this.Inventaire = {};
    }

    get Y()
    {
        return super.Y;
    }
    set Y(v)
    {
        super.Y = v;
        this.Z = v;
    }

    AjoutInventaire(Objet, Nbr)
    {
        if (this.Inventaire.hasOwnProperty(Objet))
        {
            this.Inventaire[Objet] += Nbr;
            if(this.Inventaire[Objet] <= 0)
            {
                delete this.Inventaire[Objet]
            }
        }
        else
        {
            if(Nbr > 0)
            {
                this.Inventaire[Objet] = Nbr;
            }
        }
        if (this.MenuInventaire)
            this.MenuInventaire.RefreshUI();
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

        if(Clavier.ToucheJusteBasse("f"))
        {
            //this.MontrerInventaire()
        }


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
                this.DirectionVue = 2
            if (deplacementx < 0)
                this.DirectionVue = 1
            if (deplacementy > 0 && deplacementx == 0)
                this.DirectionVue = 0
            if (deplacementy < 0 && deplacementx == 0)
                this.DirectionVue = 3

            this.FrameSuivante();
        }
        else
        {
            this.FrameIDLE()
        }

        Camera.X = this.X;
        Camera.Y = this.Y;
        //this.Z = this.Y;
    }

    TestContact(dir)
    {
        let rect = this.CollisionRect;
        //Debug.AjoutRectangle(rect,"Purple")
        rect.origin = rect.origin.add(dir);
        for (let i = 0; i < this.Parent.Children.length; i++) 
        {
            const element = this.Parent.Children[i];
            if (element != this)
            {
                let v = element.GetOverlapVector(rect, dir);
                if (v && (v.x != 0 || v.y != 0))
                    return dir.add(v);  
            }
        }
        return false;
    }


    MontrerInventaire()
    {
        if(!this.MenuInventaire)
            this.MenuInventaire = new Inventaire()
        else if (!this.MenuInventaire.Visible)
            this.MenuInventaire.Visible = true;
        else
            this.MenuInventaire.Visible = false;
        this.MenuInventaire.RefreshUI();
    }
    
    get CollisionRect()
    {
        let rect = super.CollisionRect;
        let e = Rectangle.FromPosition(rect.x + 5, rect.y + 8, rect.w - 10, rect.h - 8);
        return e;
    }
}