class Lutin
{
    constructor(X,Y, Costumes)
    {
        this.X = X;
        this.Y = Y;
        this.Z = 0;
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
        this.Direction = Math.atan2(X, Y);
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
            // Translate le canvas au centre de l'écran
            Context.translate(Ecran_Largeur / 2, Ecran_Hauteur / 2); 
            // Tourne le canvas de l'angle pour la camera
            Context.rotate(Camera.Direction * Math.PI / 180);  
            // Translate le canvas au centre de notre lutin 
            Context.translate(Camera.AdapteX(this.X), Camera.AdapteY(this.Y));  
            // Tourne le canvas de l'angle souhaité
            Context.rotate(this.Direction * Math.PI / 180);  
            // Agrandis le canvas suivant la taille de notre objet
            Context.scale(Camera.AdapteZoom(this.Zoom), Camera.AdapteZoom(this.Zoom))
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
            // Assignation de la position X de la bulle
            this.Bulle.X = this.X;
            // Assignation de la position Y de la bulle(Prend en compte la rotation de l'objet)
            this.Bulle.Y = this.Y + 
            Math.abs(this.Image.height * 0.5 * Math.cos((Camera.Direction + this.Direction) * Math.PI / 180) * Camera.AdapteZoom(this.Zoom)) +
            Math.abs(this.Image.width  * 0.5 * Math.sin((Camera.Direction + this.Direction) * Math.PI / 180) * Camera.AdapteZoom(this.Zoom))
            // Lance le dessin de la bulle
            this.Bulle.Dessin(Context)
        }
    }
}