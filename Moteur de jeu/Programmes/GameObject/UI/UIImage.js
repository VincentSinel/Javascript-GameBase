class UIImage extends UIElement
{
    /**
     * Créer un panneau pour interface utilisateur. Il permet de regrouper plusieurs objet.
     * @param {Number} X Position X relative à l'objet parent
     * @param {Number} Y Position Y relative à l'objet parent
     * @param {Number} W Largeur du panneau
     * @param {Number} H Hauteur du panneau
     * @param {String} Texture Chemin d'accés au fichier Image.
     * @param {rectangle} SourceRectangle Rectangle de découpe dans l'image source {X: 0,Y: 0,W: Largeur,H: Hauteur}. (facultatif, si omis l'ensemble de la texture est dessiné)
     * @param {UIElement} Parent Objet Parent (facultatif)
     */
    constructor(X,Y,W,H, Texture, SourceRectangle = undefined, Parent = undefined)
    {
        super(X,Y,W,H, Parent)

        this.Image = Textures.Charger(Texture)

        this.SourceRectangle = SourceRectangle;

        this.Couleur = UIElement.BaseCouleur;
    }


    Calcul(Delta)
    {
        super.Calcul(Delta);
    }

    Dessin(Context)
    {
        if (this.ImageChargé)
        {
            this.DessinerImage(Context)
        }

        super.Dessin(Context)
    }

    DessinerImage(Context)
    {
        //Context.save();
        Context.drawImage(this.Image, this.SourceRectangle.X, this.SourceRectangle.Y, this.SourceRectangle.W, this.SourceRectangle.H, 
            this.GX(), this.GY(), this.W, this.H);
        
        //Context.shadowOffsetY = 0;
        //Context.shadowBlur = 0;
        //Context.lineWidth = 1;
        //Context.restore();
    }
}