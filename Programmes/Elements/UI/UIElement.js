class UIElement
{
    static BaseCouleur = new Color(200,157,57,1);
    static BaseSelectionCouleur = new Color(229,177,77,1);
    static BaseInactifCouleur = new Color(177,177,177,1);
    static BaseTexteCouleur = new Color(255,255,255,1);

    static BaseFont = "Arial";
    static BaseFontTaille = 12;


    constructor(X,Y,W,H, Parent = undefined)
    {
        this.Font = UIElement.BaseFont;
        this.FontTaille = UIElement.BaseFontTaille;
        this.FontCouleur = UIElement.BaseTexteCouleur;
        this.BaseCouleur = UIElement.BaseCouleur;
        this.SelectionCouleur = UIElement.BaseSelectionCouleur;
        this.InactifCouleur = UIElement.BaseInactifCouleur;

        this.X = X;
        this.Y = Y;
        this.W = W;
        this.H = H;
        this.Parent = Parent;
        this.Enfants = [];
        if (Parent != undefined)
        {
            Parent.Enfants.push(this);
        }

        this.Actif = true;
    }

    GX()
    {
        if (this.Parent)
            return this.X + this.Parent.GX();
        else
            return this.X;
    }

    GY()
    {
        if (this.Parent)
            return this.Y + this.Parent.GY();
        else
            return this.Y;
    }

    Calcul()
    {
        for (let e = 0; e < this.Enfants.length; e++) {
            this.Enfants[e].Calcul();
        }
    }

    Dessin(Context)
    {
        for (let e = 0; e < this.Enfants.length; e++) {
            this.Enfants[e].Dessin(Context);
        }
    }
 
    /**
     * Draws a rounded rectangle using the current state of the canvas.
     * If you omit the last three params, it will draw a rectangle
     * outline with a 5 pixel border radius
     * @param {CanvasRenderingContext2D} ctx
     * @param {Number} x The top left x coordinate
     * @param {Number} y The top left y coordinate
     * @param {Number} width The width of the rectangle
     * @param {Number} height The height of the rectangle
     * @param {Number} [radius = 5] The corner radius; It can also be an object 
     *                 to specify different radii for corners
     * @param {Number} [radius.tl = 0] Top left
     * @param {Number} [radius.tr = 0] Top right
     * @param {Number} [radius.br = 0] Bottom right
     * @param {Number} [radius.bl = 0] Bottom left
     * @param {Boolean} [fill = false] Whether to fill the rectangle.
     * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
     */
    roundRect(ctx, x, y, width, height, radius, fill, stroke) {
        if (typeof stroke === 'undefined') 
        {
            stroke = true;
        }
        if (typeof radius === 'undefined') 
        {
            radius = 5;
        }
        if (typeof radius === 'number') 
        {
            radius = {tl: radius, tr: radius, br: radius, bl: radius};
        } 
        else 
        {
            var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
            for (var side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
        if (fill) {
            ctx.fill();
        }
        if (stroke) {
            ctx.stroke();
        }
    
    }
}