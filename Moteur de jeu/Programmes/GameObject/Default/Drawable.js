/**
 * Objet dessinable
 * @class
 * @extends GameObject
 */
class Drawable extends GameObject
{
    #CentreRotation;
    #Teinte;
    #AllowScaling = true;
    #AllowRotation = true;

    /**
     * Créer un Object avec une représentation visuel
     * @constructor
     * @param {float} X Position X
     * @param {float} Y Position Y
     * @param {float} Z Position Z
     */
    constructor(X, Y, Z)
    {
        super(X, Y, Z)

        this.Visible = true;
        this.#CentreRotation = new Vector(0.5,0.5);

        this.#Teinte = new Color(0,0,0,0);
        this.#AllowScaling = true;
        this.#AllowRotation = true;
    }

    //#region GETTER SETTER

    /**
     * Position du centre de rotation relatif à la texture.
     * @type {Vector}
     */
    get CentreRotation()
    {
        return this.#CentreRotation;
    }
    set CentreRotation(v)
    {
        if (v instanceof Vector)
        {
            this.#CentreRotation = v
        }
        else
        {
            Debug.LogErreurType("CentreRotation", "Vector", v);
        }
    }
    /**
     * Teinte à appliquer à la texture.
     * @type {Color}
     */
    get Teinte()
    {
        return this.#Teinte;
    }
    set Teinte(v)
    {
        if (v instanceof Color)
        {
            this.#Teinte = v
        }
        else
        {
            Debug.LogErreurType("Teinte", "Color", v);
        }
    }
    /**
     * Autorisation de changement d'angle
     * @type {boolean}
     */
    get AllowRotation()
    {
        return this.#AllowRotation
    }
    set AllowRotation(v)
    {
        if (typeof(v) === "boolean")
        {
            this.#AllowRotation = v;
        }
        else
        {
            Debug.LogErreurType("AllowRotation", "boolean", v);
        }
    }
    /**
     * Autorisation de changement de taille
     * @type {boolean}
     */
    get AllowScaling()
    {
        return this.#AllowScaling
    }
    set AllowScaling(v)
    {
        if (typeof(v) === "boolean")
        {
            this.#AllowScaling = v;
        }
        else
        {
            Debug.LogErreurType("AllowScaling", "boolean", v);
        }
    }
    /**
     * Angle en radian.
     * @override
     * @type {float}
     */
    get RadDirection()
    {
        return super.RadDirection
    }
    set RadDirection(value)
    {
        super.RadDirection = value;
    }
    /**
     * Angle en degré.
     * @override
     * @type {float}
     */
    get Direction()
    {
        return super.Direction
    }
    set Direction(value)
    {
        super.Direction = value;
    }
    /**
     * Largeur de l'objet à dessiner.
     * @type {float}
     */
    get TextWidth()
    {
        return 0;
    }
    /**
     * Hauteur de l'objet à dessiner.
     * @type {float}
     */
    get TextHeight()
    {
        return 0;
    }
    /**
     * Largeur de l'objet.
     * @type {float}
     */
    get width()
    {
        return this.TextWidth * this.Zoom;
    }
    /**
     * Hauteur de l'objet.
     * @type {float}
     */
    get height()
    {
        return this.TextHeight * this.Zoom;
    }
    /**
     * Taille de l'objet.
     * @type {Vector}
     */
    get size()
    {
        return new Vector(this.width, this.height);
    }
    /**
     * Rectangle contenant l'objet.
     * @type {Rectangle}
     */
    get Rect()
    {
        return new Rectangle(this.TopLeftAngle, this.width, this.height, this.GRadDirection);
    }
    /**
     * Rectangle de collision.
     * @type {Rectangle}
     */
    get CollisionRect()
    {
        return this.Rect;
    }
    /**
     * Récupère la position Haut Gauche de la zone de dessin.
     * @type {Vector}
     */
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


    //#endregion


    /**
     * Supprime l'objet enfant selectionné
     * @override
     * @param {GameObject} object Objet enfant à supprimer
     */
    RemoveChildren(object)
    {
        super.RemoveChildren(object);
        if (this.Root)
            this.Root.DeleteDrawable(object);
    }
    /**
     * S'execute après l'assignation d'un parents pour ajouter l'object à la liste des objects de dessin d'un objet racine
     * @override
     */
    PostSetRoot()
    {
        if (this.Root)
        {
            if (!this.Root.DrawAbleObject.includes(this))
                this.Root.DrawAbleObject.push(this);
            this.Root.SortDrawable();
        }
    }
    /**
     * Calcul le vecteur d'overlap d'un rectangle et de cette objet
     * @param {Rectangle} rect Rectangle à tester
     * @param {Vector} mouvement Direction de déplacement du rectangle à tester
     * @returns {Vector} Vecteur représentant le déplacement à effectuer pour sortir de l'overlap
     */
    GetOverlapVector(rect, mouvement)
    {
        return rect.collide_Overlap(this.CollisionRect);
    }
    /**
     * Permet de montrer l'objet
     */
    Show()
    {
        this.Visible = true;
    }
    /**
     * Permet de cacher l'objet
     */
    Hide()
    {
        this.Visible = false;
    }
    /**
     * Effectue le dessin de cette objet en prenant en compte la position de la camera, la rotation, la taille et la teinte
     * @param {CanvasRenderingContext2D} Context Context de dessin
     */
    Draw(Context)
    {
        if (this.Visible)
        {
            // Sauvegarde la position actuel du canvas 
            Context.save();
            this.DessinSansCamera(Context);
            Context.restore(); 

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
    /**
     * Effectue le dessin voulue (a override)
     * @param {CanvasRenderingContext2D} Context Contexte de dessin
     */
    Dessin(Context)
    {
        // Override by element
    }
    /**
     * Effectue le dessin voulue sans déplacement de camera (a override)
     * @param {CanvasRenderingContext2D} Context Contexte de dessin
     */
    DessinSansCamera(Context)
    {
        // Override by element
    }
}