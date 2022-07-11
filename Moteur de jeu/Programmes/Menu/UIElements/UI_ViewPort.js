class UI_ViewPort extends UI_Element
{
    #Viewport = Rectangle.FromPosition(0,0,0,0);

    constructor(Param)
    {
        super(Param);
        this.H = UI_Element_Alignement.STRETCH;
    }

    get Viewport() { return this.#Viewport; }

    get ViewportX() { return this.#Viewport.x}
    set ViewportX(v) { this.#Viewport.origin.x = v; this.Refresh()}
    get ViewportY() { return this.#Viewport.y}
    set ViewportY(v) { this.#Viewport.origin.y = v; this.Refresh()}

    /**
     * Calcul la position X de point de départ d'un contenue d'objet (padding)
     * @type {float}
     */
    CX(sender)
    {
        return -this.ViewportX + super.CX(sender);
    }
    /**
     * Calcul la position Y de point de départ d'un contenue d'objet (padding)
     * @type {float}
     */
    CY(sender)
    {
        return -this.ViewportY + super.CY(sender);
    }

    /**
     * Définit la taille total de l'élément et calcul la taille du contenue
     * @param {Vector} Size Taille final de l'élément
     */
    Set_FinalSize(value)
    {
        super.Set_FinalSize(value);
        this.#Viewport.w = value.x;
        this.#Viewport.h = value.y;
    }
    Set_FinalContentSize(Size)
    {
        super.Set_FinalContentSize(this.Desiredsize);
    }



    /**
     * Effectue le dessin du canvas enfants sur le canvas parent
     * @param {CanvasRenderingContext2D} Context Context de dessin
     */
     DessinChild(Context, offsetX = 0, offsetY = 0)
     {
         if (this.Childctx.canvas.width > 0 && this.Childctx.canvas.height > 0)
         {
            Context.drawImage(this.Childctx.canvas, 
               this.Viewport.x, this.Viewport.y, this.Viewport.w, this.Viewport.h,
               this.X + offsetX, this.Y + offsetY,
               this.Viewport.w, this.Viewport.h);
         }
     }

}