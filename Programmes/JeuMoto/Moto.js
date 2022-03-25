class Moto extends Lutin 
{
    constructor()
    {
        super(0,0,["Images/Moto/Moto2.png"])

        this.Vitesse = 1;
        this.Acceleration = 1.05;

        this.VitesseMax = 10;

        this.OldX = 100;
        this.OldY = 0;

        this.CentreRotation = new Vecteur2(24/155, 67.5/93)
        this.Immortel = 60;
    }


    Calcul(Delta)
    {
        super.Calcul(Delta)

        if (this.Mort)
        {
            this.AnimationMort(Delta);
            return;
        }

        this.X = this.OldX;
        this.Y = this.OldY;

        // Test des touches
        this.X += this.Vitesse * Delta



        if(Clavier.ToucheBasse(" "))
        {        
            this.Acceleration = Math.max(1 + 0.001 / Math.max(this.Vitesse,1), 1.15 - Math.pow(this.Vitesse / this.VitesseMax, 0.1) * 0.15);
            this.Vitesse = Math.max(1, this.Vitesse * this.Acceleration);
            this.Acceleration = Math.max(Math.pow(this.Acceleration, 0.5), 1.02)
        }
        else
        {
            this.Acceleration = 0.95     ;
            if (this.Direction < 10)
                this.Vitesse = (this.Vitesse - 0.1) * 0.995
        }

        this.Vitesse = Math.max(0, this.Vitesse)

        this.Parent.Aiguille.Direction = -30 + (this.Vitesse / this.VitesseMax) * 90

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
        this.Direction = Math.max(this.Direction + (this.Acceleration - 1.0001) / 0.14 * 5, 0)
        //this.Direction = coef;

        // Déplacement de la camera
        Camera.X = Math.max(this.X + 300, Ecran_Largeur / 2)
        
        this.OldX = this.X;
        this.OldY = this.Y;

        let L = (this.Zoom / 100) * this.Image.width;
        let H = (this.Zoom / 100) * this.Image.height;

        // Assignation de la coordonnée Z
        let decalageY = (1 - this.CentreRotation.Y) * H;
        this.Z = - this.Y + decalageY; 

        if ((this.TestCollision() && this.Immortel <= 0) || this.Direction > 70)
        {
            this.Mort = true;
        }

        this.Immortel -= 1
    }
    
    AnimationMort(Delta)
    {
        if (this.Direction + 2 < 180)
        {
            this.Direction += 10 * Delta;
            this.X += this.Vitesse * Delta
            this.Vitesse = this.Vitesse * 0.99
            this.TempsStop = 60;
        }
        else if (this.TempsStop > 0)
        {
            this.TempsStop -= Delta;
            this.X += this.Vitesse * Delta
            this.Vitesse = this.Vitesse * 0.99
        }
        else{
            this.Mort = false;
            this.Immortel = 120;
            this.Vitesse = 0
            this.Acceleration = 0
            this.Direction = 0
        }
    }


    Collision()
    {
        let L =  this.Image.width * this.Zoom / 100;
        let H =  this.Image.height * this.Zoom / 100;
        let decalageX = this.CentreRotation.X * L;
        let decalageY = (1 - this.CentreRotation.Y) * H;
        return [this.X - decalageX, this.Y - decalageY + H/3, L, H/3]
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