class UI_Stack extends UI_Element
{
    #Orientation = UI_Stack_Orientation.Vertical;

    constructor(Param)
    {
        super(Param)
    }

    get Orientation() { return this.#Orientation }
    set Orientation(v) { this.#Orientation = v; this.SetDirty() }

    /**
     * Calcul la position X de point de départ d'un contenue d'objet (padding)
     * @type {float}
     */
    CX(sender)
    {
        if (this.Orientation === UI_Stack_Orientation.Horizontal)
        {
            let x = 0;
            for (let i = 0; i < this.Childrens.length; i++) 
            {
                if (this.Childrens[i] === sender)
                    return x + super.CX(sender);
                x += this.Childrens[i].FinalSize.x;
            }
        }
        return super.CX(sender);
    }
    /**
     * Calcul la position Y de point de départ d'un contenue d'objet (padding)
     * @type {float}
     */
    CY(sender)
    {
        if (this.Orientation === UI_Stack_Orientation.Vertical)
        {
            let y = 0;
            for (let i = 0; i < this.Childrens.length; i++) 
            {
                if (this.Childrens[i] === sender)
                    return y + super.CY(sender);
                y += this.Childrens[i].FinalSize.y;
            }
        }
        return super.CY(sender);
    }

    /**
     * Coeur de la mesure de l'objet. Cette fonction demande à l'objet la taille qu'il souhaite prendre
     * !!!!!!!  Cette fonction doit appelé la fonction Measure sur l'ensemble des objets enfants.
     * @param {Vector} availableSize Taille disponible actuellement
     * @param {boolean} skip Définit si la mesure doit être sauté
     * @returns {Vector} Taille souhaité par cet objet
     */
    MeasureCore(availableSize, skip)
    {
        //Calcul de la taille du contenue dans ce cas
        let contentsize = availableSize.clone();
        let offw = this.Padding.left + this.Padding.right + this.X + this.Margin.right;
        let offh = this.Padding.up + this.Padding.down + this.Y + this.Margin.down;
        contentsize.x -= offw;
        contentsize.y -= offh;

        // Ajustement si la largeur ou hauteur est définit
        if (this.W >= 0)
            contentsize.x = Math.min(Math.max(this.W,this.MinW),this.MaxW) - this.Padding.left - this.Padding.right;
        if (this.H >= 0)
            contentsize.y = Math.min(Math.max(this.H,this.MinH),this.MaxH) - this.Padding.up - this.Padding.down;
        
            contentsize.x = this.W === UIElement_Alignement.AUTO ? Math.max(0,this.MinW - this.Padding.left - this.Padding.right) : contentsize.x;
            contentsize.y = this.H === UIElement_Alignement.AUTO ? Math.max(0,this.MinH - this.Padding.up - this.Padding.down) : contentsize.y;


        //Calcul de la taille voulue des enfants
        let desiredsize = new Vector(0,0);
        this.Childrens.forEach(child => 
            {
                let a = child.Measure(contentsize.clone());
                if (this.Orientation === UI_Stack_Orientation.Horizontal)
                    desiredsize.x += a.x
                else
                    desiredsize.x = Math.max(a.x,desiredsize.x);
                
                if (this.Orientation === UI_Stack_Orientation.Vertical)
                    desiredsize.y += a.y
                else
                    desiredsize.y = Math.max(a.y,desiredsize.y);
            });
        desiredsize.x += offw;
        desiredsize.y += offh;
        contentsize.x += offw;
        contentsize.y += offh;

        let x = Math.max(contentsize.x, desiredsize.x, this.MinW);
        let y = Math.max(contentsize.y, desiredsize.y, this.MinH);

        // Renvoie la taille maximal voulue
        return new Vector(x, y);
    }

    /**
     * Coeur de l'arrangement des éléments. Cette fonction demande à l'objet de s'adapter à la taille choisie.
     * !!!! Celle-ci doit aussi appelé Arrange sur l'ensemble de ses enfants.
     * @param {Vector} finalRect Taille alloué a l'objet
     * @param {boolean} sameAsMesure Définit si la taille final est identique a la taille de mesure
     */
    ArrangeCore(finalRect,sameAsMesure)
    {
        // Ajustement si la largeur ou hauteur est définit
        if (this.W >= 0)
            finalRect.x = Math.min(Math.max(this.W,this.MinW),this.MaxW);// - this.Padding.left - this.Padding.right;
        if (this.H >= 0)
            finalRect.y = Math.min(Math.max(this.H,this.MinH),this.MaxH);// - this.Padding.up - this.Padding.down;
        
        
        let x = this.W === UIElement_Alignement.AUTO ? Math.min(finalRect.x, this.Desiredsize.x) : finalRect.x ;
        let y = this.H === UIElement_Alignement.AUTO ? Math.min(finalRect.y, this.Desiredsize.y) : finalRect.y;

        this.SetFinalSize(new Vector(x, y));
        this.Childrens.forEach(child => {
        let allowsize = this.FinalContentSize.clone()
        if (this.Orientation === UI_Stack_Orientation.Horizontal)
            allowsize.x = child.Desiredsize.x;
        if (this.Orientation === UI_Stack_Orientation.Vertical)
            allowsize.y = child.Desiredsize.y;

            child.Arrange(allowsize);
        });
    }

     
    /**
     * Effectue le dessin des enfants sur le canvas contenue local
     */
    DessinChildLocal(RecreateCanvas)
    {
        this.Childctx.clearRect(0,0,this.Childctx.canvas.width, this.Childctx.canvas.height);
        let x = 0;
        let y = 0;
        for (let e = 0; e < this.Childrens.length; e++) {
            this.Childrens[e].Draw(this.Childctx, RecreateCanvas, x, y);
            if (this.Orientation === UI_Stack_Orientation.Horizontal)
                x += this.Childrens[e].FinalContentSize.x;
            if (this.Orientation === UI_Stack_Orientation.Vertical)
                y += this.Childrens[e].FinalContentSize.y;
        }
    }

}
class UI_Stack_Orientation
{
    static Vertical = 0;
    static Horizontal = 1;
}