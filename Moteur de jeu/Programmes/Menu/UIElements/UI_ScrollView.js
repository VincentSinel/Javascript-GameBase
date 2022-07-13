class UI_ScrollView extends UI_Element
{
    #ScrollHorizontal = true;
    #ScrollVertical = true;
    #ShowScrollBarHor = UI_ScrollView_ScrollBar.Auto;
    #ShowScrollBarVer = UI_ScrollView_ScrollBar.Auto;

    #HorizontalBar;
    #VerticalBar;
    #Grid;
    #View;
    

    constructor(Param)
    {
        super(Param)

        this.Capture_Scroll = true;

        this.H = UI_Element_Alignement.STRETCH;

        this.#Grid = new UI_Grid();
        this.#Grid.AddColumn(UI_Grid_Column.Star(1))
        this.#Grid.AddColumn(UI_Grid_Column.Auto())
        this.#Grid.AddRow(UI_Grid_Row.Star(1))
        this.#Grid.AddRow(UI_Grid_Row.Auto())

        let _this = this;
        this.#HorizontalBar = new UI_HorizontalScrollBar();
        this.#HorizontalBar.Grid_Row = 1;
        this.#HorizontalBar.onScrollChange.push(function(a) { _this.MoveViewX(a) })

        this.#VerticalBar = new UI_VerticalScrollBar();
        this.#VerticalBar.Grid_Column = 1;
        this.#VerticalBar.onScrollChange.push(function(a) { _this.MoveViewY(a) })
        this.#Grid.AddChildren(this.#HorizontalBar)
        this.#Grid.AddChildren(this.#VerticalBar)

        this.#View = new UI_ViewPort();
        this.#Grid.AddChildren(this.#View)
        
        super.AddChildren(this.#Grid);
        
        this.onSouris_Scroll.push(function(e) { _this.Souris_Scroll(e)})
        this.onScrollChange = [];
    }

    Souris_Scroll(e)
    {
        if (this.#ScrollVertical)
            this.#VerticalBar.ScrollPosition += e.Param.dy * 50;
        if (this.#ScrollHorizontal)
            this.#HorizontalBar.ScrollPosition += e.Param.dx * 30;
    }

    get ScrollHorizontal() { return this.#ScrollHorizontal; }
    set ScrollHorizontal(v) { this.#ScrollHorizontal = v; }
    
    get ScrollVertical() { return this.#ScrollVertical; }
    set ScrollVertical(v) { this.#ScrollVertical = v; }

    /**
     * Ajoute un élément enfant à cette élément
     * @param {UI_Element} Element Element Enfant
     */
    AddChildren(Element)
    {
        this.#View.AddChildren(Element);
    }
    /**
     * Supprimer un élément enfant
     * @param {UI_Element} Element Element enfant
     */
    RemoveChildren(Element)
    {
        this.#View.RemoveChildren(Element);
    }

    MoveViewX(x)
    {
        this.#View.ViewportX = x;
        
        this.onScrollChange.forEach(action => {
            action(a);
        });
    }
    MoveViewY(y)
    {
        this.#View.ViewportY = y;
        
        this.onScrollChange.forEach(action => {
            action(a);
        });
    }

    /**
     * Lance l'arrangement de cets éléments.
     * @param {Vector} finalRect Taille alloué à l'objet
     */
     Arrange(finalRect)
     {
        super.Arrange(finalRect);
        this.TotalSize = this.#View.FinalContentSize;
        if ((this.TotalSize.x <= this.#View.FinalSize.x && 
            this.#ShowScrollBarHor !== UI_ScrollView_ScrollBar.Visible) ||
            !this.#ScrollHorizontal)
        {
            this.#HorizontalBar.Visible = UI_Element_Visibilty.Collapsed;
        }
        else
        {
            this.#HorizontalBar.Visible = UI_Element_Visibilty.Visible;
        }
        
        if ((this.TotalSize.y <= this.#View.FinalSize.y && 
            this.#ShowScrollBarVer !== UI_ScrollView_ScrollBar.Visible) ||
            !this.#ScrollVertical)
        {
            this.#VerticalBar.Visible = UI_Element_Visibilty.Collapsed;
        }
        else
        {
            this.#VerticalBar.Visible = UI_Element_Visibilty.Visible;
        }
     }

    get Scroll_VPosition() { return this.#VerticalBar.ScrollPosition}
    set Scroll_VPosition(v) { this.#VerticalBar.ScrollPosition = v; this.Refresh(); };

    get Scroll_HPosition() { return this.#HorizontalBar.ScrollPosition}
    set Scroll_HPosition(v) { this.#HorizontalBar.ScrollPosition = v; this.Refresh(); };

    get TotalSize() { return new Vector(this.#HorizontalBar.TotalSize,this.#VerticalBar.TotalSize)}
    set TotalSize(v) { this.#HorizontalBar.TotalSize = v.x; this.#VerticalBar.TotalSize = v.y}

    /**
     * Effectue le dessin de ce canvas ainsi que de ses enfants
     * @param {CanvasRenderingContext2D} Context Context de dessin
     * @param {boolean} RecreateCanvas Définit si le canvas doit être recrée
     */
    Dessin(Context, RecreateCanvas, offsetX = 0, offsetY = 0)
    {
        super.Dessin(Context, RecreateCanvas, offsetX = 0, offsetY = 0)
    }

    DessinFrontUI(Context)
    {
        this.CurrentColor = this.BaseCouleur;
        if (!this.Actif)
            this.CurrentColor = this.InactifCouleur;
        let Contour = this.CurrentColor.RGBA2(46);

        let x = this.#HorizontalBar.FinalSize.x;
        let y = this.#VerticalBar.FinalSize.y;
        Context.fillStyle = this.CurrentColor.RGBA()
        Context.strokeStyle = Contour
        Drawing.RoundRect(Context, x, y, x, y, 2, true, true)
    }


}

class UI_ScrollView_ScrollBar
{
    static Visible = 0;
    static Auto = 1;
    static Hidden = 2;
}