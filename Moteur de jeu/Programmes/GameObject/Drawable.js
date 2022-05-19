class Drawable extends GameObject
{
    #BoundingBox = undefined;

    constructor(X, Y, Z)
    {
        super(X, Y, Z)

        this.Visible = true;
        this.#BoundingBox = undefined;
        this.CentreRotation = new Vector(0.5,0.5);

        this.Teinte = new Color(0,0,0,0);
        this.AllowScaling = true;
        this.AllowRotation = true;
    }

    PostSetParent()
    {
        if (this.Root)
        {
            if (!this.Root.DrawAbleObject.includes(this))
                this.Root.DrawAbleObject.push(this);
        }
    }


    set RadDirection(value)
    {
        this.#BoundingBox = undefined;
        super.RadDirection = value;
    }
    set Direction(value)
    {
        this.#BoundingBox = undefined;
        super.Direction = value;
    }
    get RadDirection()
    {
        return super.RadDirection
    }
    get Direction()
    {
        return super.Direction
    }

    get TextWidth()
    {
        return 0;
    }
    get TextHeight()
    {
        return 0;
    }

    get TopLeftAngle()
    {
        let x = this.width * this.CentreRotation.x;
        let y = this.height * this.CentreRotation.y;
        let cos = Math.cos(this.GRadDirection);
        let sin = Math.sin(this.GRadDirection);
        return new Vector(
            this.GX - (x * cos - y * sin), 
            this.GY - (x * sin + y * cos), 
            0)
    }

    get width()
    {
        return this.TextWidth * this.Zoom;
    }
    get height()
    {
        return this.TextHeight * this.Zoom;
    }
    get size()
    {
        return new Vector(this.width, this.height);
    }

    get Rect()
    {
        return new Rectangle(this.TopLeftAngle, this.width, this.height, this.GRadDirection);
    }

    get CollisionRect()
    {
        return this.Rect;
    }

    GetOverlapVector(rect, mouvement)
    {
        return rect.collisionWithOverlap(this.CollisionRect);
    }

    /**
     * Permet de montrer le tilemap
     */
    Show()
    {
        this.Visible = true;
    }
 
    /**
     * Permet de cacher le tilemap
     */
    Hide()
    {
        this.Visible = false;
    }

    Destroy()
    {
        super.Destroy()
        this.Root.DrawAbleObject.splice(this.Root.DrawAbleObject.indexOf(this), 1);
    }

    Draw(Context)
    {
        if (this.Visible)
        {
            // Sauvegarde la position actuel du canvas 
            Context.save();

            // Translate le canvas au centre de notre lutin 
            Context.translate(this.GX, this.GY); 
            // Tourne le canvas de l'angle souhaité
            if (this.AllowRotation)
                Context.rotate(this.GRadDirection); 
            else
                Context.scale(1 / Camera.Zoom, 1 / Camera.Zoom)
            // Agrandis le canvas suivant la taille de notre objet
            if (this.AllowScaling)
                Context.scale(this.Zoom, this.Zoom);
            else
                Context.rotate(-Camera.RadDirection);
            // Déplace le canvas à l'angle haut droit de l'image
            Context.translate(-this.TextWidth * this.CentreRotation.x, -this.TextHeight * this.CentreRotation.y);  

            if (this.Teinte.A != 0)
            {
                // Applique une teinte au lutin
                let imageCtx = document.createElement("canvas").getContext("2d"); // Création d'un canvas temporaire
                imageCtx.canvas.width = this.TextWidth; // Modification taille
                imageCtx.canvas.height = this.TextHeight; // Modification taille

                imageCtx.fillStyle = this.Teinte.RGBA();// Définit la couleur de remplissage
                imageCtx.fillRect(0, 0, imageCtx.canvas.width, imageCtx.canvas.height);// Dessine un rectangle de couleur par dessus la figure
                imageCtx.globalCompositeOperation = "destination-atop";// Modifie le style d'ajout des couleurs
                
                this.Dessin(imageCtx);
                Context.drawImage(imageCtx.canvas, 0, 0); // Dessin du canvas temporaire dans le canvas original
            }
            else
            {
                this.Dessin(Context);
            }

            // Retourne à la position initiale du canvas
            Context.restore(); 
        }
    }

    Dessin(Context)
    {
        // Override by element
    }

    
}