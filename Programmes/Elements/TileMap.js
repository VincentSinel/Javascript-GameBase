class TileMap
{
    /**
     * Création d'un lutin manipulable avec des fonction simple
     * @param {number} X Position X du lutin
     * @param {number} Y Position Y du lutin
     * @param {Array<string>} Costumes Liste des costumes du lutin
     */
    constructor(X,Y, W, H, Texture,Decoupages)
    {
        this.X = X;
        this.Y = Y;
        this.Z = 0; //TODO Ajouter la prise en compte du Z
        this.Direction = 0;
        this.Zoom = 100;
        this.Image = new Image();
        this.Image.src = Costumes[0];
        this.Decoupages = Decoupages
        this.Texture = Texture;
        this.Visible = true;
        this.Time = 0;
        this.Teinte = new Color(0,0,0,0);
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

            if (this.Teinte.A != 0)
            {
                // Applique une teinte au lutin
                let imageCtx = document.createElement("canvas").getContext("2d"); // Création d'un canvas temporaire
                imageCtx.canvas.width = this.Image.width; // Modification taille
                imageCtx.canvas.height = this.Image.height; // Modification taille

                imageCtx.fillStyle = this.Teinte.RGBA();// Définit la couleur de remplissage
                imageCtx.fillRect(0, 0, this.Image.width, this.Image.height);// Dessine un rectangle de couleur par dessus la figure
                imageCtx.globalCompositeOperation = "destination-atop";// Modifie le style d'ajout des couleurs
                imageCtx.drawImage(this.Image,0,0); // Dessin de l'image sur le canvas temporaire
                Context.drawImage(imageCtx.canvas, 0, 0); // Dessin du canvas temporaire dans le canvas original
            }
            else
            {
                // Dessine le lutin
                Context.drawImage(this.Image, 0, 0);  
            }
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