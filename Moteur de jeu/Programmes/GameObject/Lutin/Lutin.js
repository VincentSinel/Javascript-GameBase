class Lutin extends Drawable
{
    /**
     * Création d'un lutin manipulable avec des fonction simple
     * @param {number} X Position X du lutin
     * @param {number} Y Position Y du lutin
     * @param {Array<string>} Costumes Liste des costumes du lutin
     */
    constructor(X, Y, Costumes)
    {
        super(X,Y,0)

        this.Costumes = [];
        for (let c = 0; c < Costumes.length; c++) {
            this.Costumes.push(Textures.Charger(Costumes[c]));
        }
        this.Image = this.Costumes[0]
        this.CostumeActuel = 0;

        this.Bulle = this.AddChildren(new BulleDialogue("", 0,0))

        this.Velocite = new Vector(0, 0, 0);
    }

    get Parle()
    {
        return this.Bulle.Visible;
    }
    set Parle(v)
    {
        this.Bulle.Visible = v;
    }

    ChangeParent(parent)
    {
        super.ChangeParent(parent);
    }

    
    get TextWidth()
    {
        if (this.Image)
            return this.Image.width;
        else
            return 0;
    }
    get TextHeight()
    {
        if (this.Image)
            return this.Image.height;
        else
            return 0;
    }

    ToucheSouris()
    {
        let a = this.Rectangle()
        return Contacts.PointDansRectangle(a[0], a[1], a[2], a[3], new Vector(Souris.X, Souris.Y))
    }

    ToucheLutin(lutin)
    {
        let a = this.Rectangle()
        let b = lutin.Rectangle();
        return Contacts.PolygonesIntersection(a,b);
    }

    Avancer(distance)
    {
        this.X += distance * Math.cos(this.RadDirection);
        this.Y += distance * Math.sin(this.RadDirection);
    }

    Tourner(Angle)
    {
        this.Direction += Angle
    }

    AllerA(X,Y)
    {
        this.X = X;
        this.Y = Y;
    }

    Dire(Texte)
    {
        this.Bulle.Texte = Texte;
        this.Bulle.Visible = true
    }

    OrienterVers(X,Y)
    {
        this.RadDirection = Math.atan2(Y - this.Y, X - this.X);
    }

    CostumeSuivant()
    {
        this.CostumeActuel = (this.CostumeActuel + 1) % this.Costumes.length
        this.Image = this.Costumes[this.CostumeActuel]
    }

    CostumePrecedent()
    {
        this.CostumeActuel = (this.CostumeActuel + this.Costumes.length - 1) % this.Costumes.length
        this.Image = this.Costumes[this.CostumeActuel]
    }

    BasculerCostume(index)
    {
        this.CostumeActuel = Math.round(index) % this.Costumes.length
        this.Image = this.Costumes[this.CostumeActuel]
    }

    Calcul(Delta)
    {
        this.Position = this.Position.add(this.Velocite.time(Delta));
        this.Bulle.Y = -this.TextHeight * this.CentreRotation.y;
    }

    Dessin(Context)
    {
        // Dessine le lutin
        if (this.Image)
            Context.drawImage(this.Image, 0, 0);  
    /*
        if (this.Parle)
        {
            let pos = Camera.CameraVersEcran(new Vecteur2(Camera.AdapteX(this.X) , Camera.AdapteY(this.Y + this.Image.height * this.CentreRotation.Y * this.Zoom / 100)))
            this.Bulle.X = pos.X;
            this.Bulle.Y = pos.Y;
            
            // Lance le dessin de la bulle
            this.Bulle.Dessin(Context)
        }*/

    }
}