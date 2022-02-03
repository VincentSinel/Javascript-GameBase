class Lutin
{
    /**
     * Création d'un lutin manipulable avec des fonction simple
     * @param {number} X Position X du lutin
     * @param {number} Y Position Y du lutin
     * @param {Array<string>} Costumes Liste des costumes du lutin
     */
    constructor(X,Y, Costumes)
    {
        this.X = X;
        this.Y = Y;
        this.Z = 0; //TODO Ajouter la prise en compte du Z
        this.Direction = 0;
        this.Zoom = 100;
        this.Image = new Image();
        this.Image.src = Costumes[0];
        this.Costumes = Costumes;
        this.CostumeActuel = 0;
        this.Visible = true;
        this.Time = 0;
        this.Teinte = new Color(0,0,0,0);
        this.Parle = false
        this.Bulle = new BulleDialogue("", 0,0)
    }

    /**
     * Calcul et renvoie un tableau contenant la position relative à la camera des angles de notre lutin avec le costume actuel.
     * @returns Liste des points définissant le rectangle de l'image
     */
    Rectangle()
    {
        let ar = [];
        let offw = this.Zoom / 100.0 * this.Image.width / 2;
        let offh = this.Zoom / 100.0 * this.Image.height / 2;
        let cos = Math.cos(this.Direction * Math.PI / 180);
        let sin = Math.sin(this.Direction * Math.PI / 180);
        ar.push(new Vecteur2(this.X + (-offw * cos - offh * sin), this.Y + (-offw * sin + offh * cos)));
        ar.push(new Vecteur2(this.X + (+offw * cos - offh * sin), this.Y + (+offw * sin + offh * cos)));
        ar.push(new Vecteur2(this.X + (+offw * cos + offh * sin), this.Y + (+offw * sin - offh * cos)));
        ar.push(new Vecteur2(this.X + (-offw * cos + offh * sin), this.Y + (-offw * sin - offh * cos)));
        return ar;
    }

    VecteurDirection()
    {
        return new Vecteur2(Math.cos(this.Direction * Math.PI / 180), Math.sin(this.Direction * Math.PI / 180));
    }

    ToucheSouris()
    {
        let a = this.Rectangle()
        return Contacts.PointDansRectangle(a[0], a[1], a[2], a[3], new Vecteur2(Souris.X, Souris.Y))
    }

    ToucheLutin(lutin)
    {
        let a = this.Rectangle()
        let b = lutin.Rectangle();
        return Contacts.PolygonesIntersection(a,b);
    }

    Avancer(distance)
    {
        this.X += distance * Math.cos(this.Direction * Math.PI / 180);
        this.Y += distance * Math.sin(this.Direction * Math.PI / 180);
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
        this.Bulle.ModifierTexte(Texte)
        this.Parle = true
    }

    OrienterVers(X,Y)
    {
        this.Direction = Math.atan2(Y - this.Y, X - this.X) * 180 / Math.PI;
    }

    CostumeSuivant()
    {
        this.CostumeActuel = (this.CostumeActuel + 1) % this.Costumes.length
        this.Image.src = this.Costumes[this.CostumeActuel]
    }

    CostumePrecedent()
    {
        this.CostumeActuel = (this.CostumeActuel + this.Costumes.length - 1) % this.Costumes.length
        this.Image.src = this.Costumes[this.CostumeActuel]
    }

    BasculerCostume(index)
    {
        this.CostumeActuel = index % this.Costumes.length
        this.Image.src = this.Costumes[this.CostumeActuel]
    }

    Montrer()
    {
        this.Visible = true;
    }

    Cacher()
    {
        this.Visible = false;
    }

    Calcul()
    {
        this.Time += 1;
    }

    Dessin(Context)
    {
        if (this.Visible)
        {
            // Sauvegarde la position actuel du canvas 
            Context.save();
            // Adapte la position à celle de la camera
            Camera.DeplacerCanvas(Context)
            // Translate le canvas au centre de notre lutin 
            Context.translate(Camera.AdapteX(this.X), Camera.AdapteY(this.Y));  
            // Tourne le canvas de l'angle souhaité
            Context.rotate(-this.Direction * Math.PI / 180);  
            // Agrandis le canvas suivant la taille de notre objet
            Context.scale(this.Zoom / 100.0, this.Zoom / 100.0)
            // Déplace le canvas à l'angle haut droit de l'image
            Context.translate(-this.Image.width * 0.5, -this.Image.height * 0.5);  
            // Dessine le lutin
            Context.drawImage(this.Image, 0, 0);  

            // Applique une teinte au lutin
            Context.globalCompositeOperation = "source-atop"; // Modifie le style d'ajout des couleurs
            Context.fillStyle = this.Teinte.RGBA(); // Définit la couleur de remplissage
            Context.fillRect(0,0,this.Image.width, this.Image.height) // Dessine un rectangle de couleur par dessus la figure
            Context.globalCompositeOperation = "source-over"; // Retour à la position initiale du style d'ajout de couleur
            // Retourne à la position initiale du canvas
            Context.restore(); 
        }
        if (this.Parle)
        {
            let pos = Camera.CameraVersEcran(new Vecteur2(Camera.AdapteX(this.X) , Camera.AdapteY(this.Y + this.Image.height * 0.5)))
            this.Bulle.X = pos.X;
            this.Bulle.Y = pos.Y;
            
            // Lance le dessin de la bulle
            this.Bulle.Dessin(Context)
        }

    }
}