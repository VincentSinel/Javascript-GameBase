class Moto extends Lutin 
{
    constructor()
    {
        super(0,0,["Images/Moto/Moto1.png"])

        this.Vitesse = 1;
        this.Acceleration = 1.05;

        this.VitesseMax = 10;

        this.OldX = 100;
        this.OldY = 0;

        this.CentreRotation = new Vecteur2(24/155, 67.5/93)
    }


    Calcul(Delta)
    {
        super.Calcul(Delta)

        this.X = this.OldX;
        this.Y = this.OldY;

        // Test des touches
        this.X += this.Vitesse * Delta

        if(Clavier.ToucheBasse(" "))
        {        
            this.Vitesse = Math.max(1, this.Vitesse * this.Acceleration);
        }
        else
        {
            this.Vitesse = (this.Vitesse - 0.1) * 0.99
        }

        this.Vitesse = Math.max(0, Math.min(this.VitesseMax, this.Vitesse))

        if(Clavier.ToucheBasse("ArrowUp"))
        {
            this.Y += this.Vitesse / 2 * Delta
            this.Y = Math.min(this.Y, 200)
        }
        if(Clavier.ToucheBasse("ArrowDown"))
        {
            this.Y -= this.Vitesse / 2 * Delta
            this.Y = Math.max(this.Y, -200)
        }

        // Calcul du cabrage
        let coef = Math.max(this.Vitesse / this.VitesseMax * 100 - 20, 0) / 80 * 45
        this.Direction = coef;

        // Déplacement de la camera
        Camera.X = Math.max(this.X, Ecran_Largeur / 2);
        
        this.OldX = this.X;
        this.OldY = this.Y;

        let L = (this.Zoom / 100) * this.Image.width;
        let H = (this.Zoom / 100) * this.Image.height;

        // Assignation de la coordonnée Z
        let decalageX = (24 / 155) * H;
        let decalageY = (25.5 / 93) * L;
        this.Z = - this.Y + decalageY; 


        this.ColRect = [this.X - decalageX, this.Y - decalageY + H/3, L, H/3]

        Debug.AjoutVecteur(
            new Vecteur2(this.X - decalageX, this.Y - decalageY + H/3), 
            new Vecteur2(0,0)
            )

        Debug.AjoutVecteur(
            new Vecteur2(this.X - decalageX + L, this.Y - decalageY + H/3), 
            new Vecteur2(0,0)
            )

        Debug.AjoutVecteur(
            new Vecteur2(this.X - decalageX, this.Y - decalageY), 
            new Vecteur2(0,0)
            )

        Debug.AjoutVecteur(
            new Vecteur2(this.X - decalageX + L, this.Y - decalageY), 
            new Vecteur2(0,0)
            )



        //////////
        //let decalageX = (53.5 /155) * (this.Zoom / 100) * this.Image.width;
        let IW =  this.Image.width * this.Zoom / 100;
        let IH =  this.Image.height * this.Zoom / 100;
        Debug.AjoutRectangle([this.X + decalageX - IW / 2, this.Y - decalageY + IH / 3, IW, IH / 3])

        this.TestCollision()

    }
    
    


    Collision()
    {
        let decalageX = (53.5 /155) * (this.Zoom / 100) * this.Image.width;
        let decalageY = (25.5 / 93) * (this.Zoom / 100) * this.Image.height;
        let IW =  this.Image.width * this.Zoom / 100;
        let IH =  this.Image.height * this.Zoom / 100;
        return [this.X + decalageX - IW / 2, this.Y - decalageY + IH / 3, IW, IH / 3]
    }

    TestCollision()
    {
        let rect = this.Collision();
        let v3 = new Vecteur2(rect[0], rect[1])
        let v4 = new Vecteur2(rect[0] + rect[2], rect[1] + rect[3])
        for (let v = 0; v < this.Parent.Voitures.length; v++) 
        {
            const voiture = this.Parent.Voitures[v];

            rect = voiture.Collision();
            let v1 = new Vecteur2(rect[0], rect[1])
            let v2 = new Vecteur2(rect[0] + rect[2], rect[1] + rect[3])
            if (Contacts.AABB(v1,v2,v3,v4))
            {
                return true
            }
        }
        return false
    }
}