class UI_Root extends UI_Element
{
    #Window = undefined;

    constructor(WindowParent)
    {
        super();
        this.#Window = WindowParent;
        super.W = UI_Element_Alignement.STRETCH;
        super.H = UI_Element_Alignement.STRETCH;
    }

    //#region GETTER SETTER

    
    /**
     * Largeur de l'objet
     * @type {float}
     */
    get W() { return super.W }
    set W(v) { }
    /**
     * Hauteur de l'objet
     * @type {float}
     */
    get H() { return super.H }
    set H(v) { }
    /**
     * Position X de l'objet
     * @type {float}
     */
    get X() { return super.X }
    set X(v) { }
    /**
     * Position Y de l'objet
     * @type {float}
     */
    get Y() { return super.Y }
    set Y(v) { }
    /**
     * Position Z de l'objet
     * @type {float}
     */
    get Z() { return super.Z }
    set Z(v) { }

    /**
     * Calcul la position X de cette objet vis à vis de son parent
     * @override
     * @type {float}
     */
    get GX()
    {
        return this.Window.X;
    }
    /**
     * Calcul la position Y de cette objet vis à vis de son parent
     * @override
     * @type {float}
     */
    get GY()
    {
        return this.Window.Y;
    }
    /**
     * Calcul la position Z de cette objet vis à vis de son parent
     * @override
     * @type {float}
     */
    get GZ()
    {
        return this.Window.Z;
    }

    /**
     * Renvoie la Fenetre parente
     */
    get Window()
    {
        return this.#Window;
    }
    /**
     * Renvoie la Largeur disponible pour le dessin
     * @type {Array<UI_Element>}
     */
    get CW()
    {
        return this.Window.W - this.Window.Padding.left - this.Window.Padding.right;
    }
    /**
     * Renvoie la hauteur disponible pour le dessin
     * @type {Array<UI_Element>}
     */
    get CH()
    {
        return this.Window.H - this.Window.Padding.up - this.Window.Padding.down;
    }

    get Root()
    {
        return this;
    }

    get Padding()
    {
        return this.Window.Padding;
    }

    SetDirty()
    {
        super.SetDirty(true);
    }

    //#endregion

    /**
     * Mise a jour des UIElement
     * @param {float} Delta Nombre de frame écoulé depuis le dernier rafraichissement d'écran
     */
    Update(Delta)
    {
        if (this.Dirty)
        {
            this.Measure(new Vector(this.Window.W, this.Window.H));
            this.Arrange(new Vector(this.Window.W, this.Window.H));
        }
        this.Childrens.forEach(element => {
            element.Calcul(Delta)
        });
    }

}