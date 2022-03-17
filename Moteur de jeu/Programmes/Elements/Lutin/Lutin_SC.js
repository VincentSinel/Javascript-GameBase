class Lutin_SC extends Lutin
{
    /**
     * Création d'un lutin manipulable avec des fonction simple
     * @param {number} X Position X du lutin
     * @param {number} Y Position Y du lutin
     * @param {string} Texture Texture à utiliser;
     * @param {Array<number>} Decoupage Hauteur et Largeur d'un Sprite;
     */
    constructor(X,Y, Texture, Decoupage, IdCostum = 0)
    {
        super(X,Y,[Texture])
        this.Decoupage = Decoupage;

        let t = this;
        this.Image.onload = function (){t.Recalcul()};

        this.CostumeActuel = Math.max(Math.min(IdCostum, this.MaxCostume),0);
    }

    Recalcul()
    {
        let w = this.Image.width / this.Decoupage[0]
        let h = this.Image.height / this.Decoupage[1]
        this.MaxCostume = w * h - 1;
    }

    /**
     * Calcul et renvoie un tableau contenant la position relative à la camera des angles de notre lutin avec le costume actuel.
     * @returns Liste des points définissant le rectangle de l'image
     */
     Rectangle()
     {
         let ar = [];
         let offw = this.Zoom / 100.0 * this.Decoupage[0] * this.CentreRotation.X;
         let offh = this.Zoom / 100.0 * this.Decoupage[1] * this.CentreRotation.Y;
         let cos = Math.cos(this.Direction * Math.PI / 180);
         let sin = Math.sin(this.Direction * Math.PI / 180);
         ar.push(new Vecteur2(this.X + (-offw * cos - offh * sin), this.Y + (-offw * sin + offh * cos)));
         ar.push(new Vecteur2(this.X + (+offw * cos - offh * sin), this.Y + (+offw * sin + offh * cos)));
         ar.push(new Vecteur2(this.X + (+offw * cos + offh * sin), this.Y + (+offw * sin - offh * cos)));
         ar.push(new Vecteur2(this.X + (-offw * cos + offh * sin), this.Y + (-offw * sin - offh * cos)));
         return ar;
     }

     RectangleWH()
    {
        let ar = [];
        let offw = this.Zoom / 100.0 * this.Decoupage[0] * this.CentreRotation.X;
        let offh = this.Zoom / 100.0 * this.Decoupage[1] * this.CentreRotation.Y;
        let cos = Math.cos(this.Direction * Math.PI / 180);
        let sin = Math.sin(this.Direction * Math.PI / 180);
        ar.push(new Vecteur2(this.X + (-offw * cos - offh * sin), this.Y + (-offw * sin + offh * cos)));
        ar.push(this.Decoupage[0] * this.Zoom / 100.0);
        ar.push(this.Decoupage[1] * this.Zoom / 100.0);
        ar.push(this.Direction);
        return ar;
    }


    CostumeSuivant()
    {
        this.CostumeActuel = (this.CostumeActuel + 1) % this.MaxCostume
    }

    CostumePrecedent()
    {
        this.CostumeActuel = (this.CostumeActuel + this.MaxCostume - 1) % this.MaxCostume
    }

    BasculerCostume(index)
    {
        this.CostumeActuel = Math.round(index) % this.MaxCostume
    }

    Calcul(Delta)
    {
        super.Calcul(Delta)
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
            Context.translate(-this.Decoupage[0] * this.CentreRotation.X, -this.Decoupage[1] * this.CentreRotation.Y);  

            let x = this.Decoupage[0] * (this.CostumeActuel % (this.Image.width / this.Decoupage[0]));
            let y = this.Decoupage[1] * Math.floor(this.CostumeActuel / (this.Image.width / this.Decoupage[0]));
            if (this.Teinte.A != 0)
            {
                // Applique une teinte au lutin
                let imageCtx = document.createElement("canvas").getContext("2d"); // Création d'un canvas temporaire
                imageCtx.canvas.width = this.Decoupage[0]; // Modification taille
                imageCtx.canvas.height = this.Decoupage[1]; // Modification taille

                imageCtx.fillStyle = this.Teinte.RGBA();// Définit la couleur de remplissage
                imageCtx.fillRect(0, 0, this.Image.width, this.Image.height);// Dessine un rectangle de couleur par dessus la figure
                imageCtx.globalCompositeOperation = "destination-atop";// Modifie le style d'ajout des couleurs
                imageCtx.drawImage(this.Image, x, y, this.Decoupage[0], this.Decoupage[1], 0, 0, this.Decoupage[0], this.Decoupage[1]); // Dessin de l'image sur le canvas temporaire
                Context.drawImage(imageCtx.canvas, 0, 0); // Dessin du canvas temporaire dans le canvas original
            }
            else
            {
                // Dessine le lutin
                Context.drawImage(this.Image, x, y, this.Decoupage[0], this.Decoupage[1], 0, 0, this.Decoupage[0], this.Decoupage[1]);  
            }
            // Retourne à la position initiale du canvas
            Context.restore(); 
        }
        if (this.Parle)
        {
            let pos = Camera.CameraVersEcran(new Vecteur2(Camera.AdapteX(this.X) , Camera.AdapteY(this.Y + this.Decoupage[1] * this.CentreRotation.Y * this.Zoom / 100)))
            this.Bulle.X = pos.X;
            this.Bulle.Y = pos.Y;
            
            // Lance le dessin de la bulle
            this.Bulle.Dessin(Context)
        }

    }
}