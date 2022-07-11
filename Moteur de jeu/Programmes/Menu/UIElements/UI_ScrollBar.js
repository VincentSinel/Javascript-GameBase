class UI_VerticalScrollBar extends UI_Draggable
{
    static ScrollW = 15;

    #ScrollOldPosition = 0;
    #ScrollPosition = 0;
    #TotalSize = 0;

    constructor(Param)
    {
        super(Param);
        this.Z = 200;
        this.W = UI_VerticalScrollBar.ScrollW;
        this.H = UI_Element_Alignement.STRETCH;
        this.HorizontalAlignement = HorizontalAlignementType.Right
        this.onScrollChange = [];
    }

    get ScrollPosition()
    {
        return this.#ScrollPosition;
    }
    set ScrollPosition(v)
    {
        let a = Math.max(0,Math.min(this.TotalSize - this.FinalSize.y, v));
        this.#ScrollPosition = a
        this.Refresh();
        this.onScrollChange.forEach(action => {
            action(a);
        });
    }
    get TotalSize() { return this.#TotalSize }
    set TotalSize(v) { this.#TotalSize = v; this.ScrollPosition = this.ScrollPosition; }

    Souris_Clique(event)
    {
        let cy = this.GY + this.ScrollPosition / this.TotalSize * this.FinalSize.y;
        let ch = this.FinalSize.y / this.TotalSize * this.FinalSize.y;
        let pos = event.Param;
        if (pos.y < cy)
        {
            this.ScrollPosition = (pos.y - this.GY) / this.FinalSize.y * this.TotalSize
        }
        else if (pos.y > cy + ch)
        {
            this.ScrollPosition = (pos.y - this.GY) / this.FinalSize.y * this.TotalSize - this.FinalSize.y;
        }

    }
    Souris_DragStart(event)
    {
        super.Souris_DragStart(event)
        this.Souris_Clique(event)
        this.#ScrollOldPosition = this.ScrollPosition;
    }
    Souris_Dragging(event)
    {
        super.Souris_Dragging(event)
        this.ScrollPosition = this.#ScrollOldPosition + this.DragMove.y / this.FinalSize.y * this.TotalSize;
    }
    Souris_DragEnd(event)
    {
        super.Souris_DragEnd(event)
        this.ScrollPosition = this.#ScrollOldPosition + this.DragMove.y / this.FinalSize.y * this.TotalSize;
    }

    DessinBackUI(Context)
    {
        if (this.Etat === UI_Selectable_Etat.DEFAULT ||
            this.Etat === UI_Selectable_Etat.CLIC)
            this.CurrentColor = this.BaseCouleur;
        else if (this.Etat === UI_Selectable_Etat.HOVER
            || this.Etat === UI_Selectable_Etat.HOVER_CLIC)
            this.CurrentColor = this.HoverCouleur;
        if (!this.Actif)
            this.CurrentColor = this.InactifCouleur;

        let Contour = this.CurrentColor.RGBA2(46)//Color.CouleurByte(97,62,24,1);

        Context.save();
        Context.fillStyle = Color.Couleur(0,0,0,0.2)
        Context.strokeStyle = Color.Couleur(0,0,0,0.2)
        Drawing.RoundRect(Context, 0, 0, this.FinalSize.x, this.FinalSize.y, 2, true, true)

        let y = this.ScrollPosition / this.TotalSize * this.FinalSize.y
        let h = this.FinalSize.y * this.FinalSize.y / this.TotalSize
        Context.fillStyle = this.CurrentColor.RGBA()
        Context.strokeStyle = Contour
        Drawing.RoundRect(Context, 0, y, this.FinalSize.x, h, 2, true, true)

        Context.restore();

    }
}
class UI_HorizontalScrollBar extends UI_Draggable
{
    static ScrollH = 15;

    #ScrollOldPosition = 0;
    #ScrollPosition = 0;
    #TotalSize = 0;

    constructor(Param)
    {
        super(Param)
        this.Z = 200;
        this.W = UI_Element_Alignement.STRETCH;
        this.H = UI_HorizontalScrollBar.ScrollH;
        this.VerticalAlignement = VerticalAlignementType.Down;
        this.onScrollChange = [];
    }

    get ScrollPosition()
    {
        return this.#ScrollPosition;
    }
    set ScrollPosition(v)
    {
        let a = Math.max(0,Math.min(this.TotalSize - this.FinalSize.x, v));
        this.#ScrollPosition = a;
        this.Refresh();
        this.onScrollChange.forEach(action => {
            action(a);
        });
    }
    get TotalSize() { return this.#TotalSize }
    set TotalSize(v) { this.#TotalSize = v; this.ScrollPosition = this.ScrollPosition; }

    Souris_Clique(event)
    {
        let cx = this.GX + this.ScrollPosition / this.TotalSize * this.FinalSize.x;
        let cw = this.FinalSize.x / this.TotalSize * this.FinalSize.x;
        let pos = event.Param;
        if (pos.x < cx)
        {
            this.ScrollPosition = (pos.x - this.GX) / this.FinalSize.x * this.TotalSize
        }
        else if (pos.x > cx + cw)
        {
            this.ScrollPosition = (pos.x - this.GX) / this.FinalSize.x * this.TotalSize - this.FinalSize.x;
        }

    }
    Souris_DragStart(event)
    {
        super.Souris_DragStart(event)
        this.Souris_Clique(event)
        this.#ScrollOldPosition = this.ScrollPosition;
    }
    Souris_Dragging(event)
    {
        super.Souris_Dragging(event)
        this.ScrollPosition = this.#ScrollOldPosition + this.DragMove.x / this.FinalSize.x * this.TotalSize;
    }
    Souris_DragEnd(event)
    {
        super.Souris_DragEnd(event)
        this.ScrollPosition = this.#ScrollOldPosition + this.DragMove.x / this.FinalSize.x * this.TotalSize;
    }

    DessinBackUI(Context)
    {
        if (this.Etat === UI_Selectable_Etat.DEFAULT ||
            this.Etat === UI_Selectable_Etat.CLIC)
            this.CurrentColor = this.BaseCouleur;
        else if (this.Etat === UI_Selectable_Etat.HOVER
            || this.Etat === UI_Selectable_Etat.HOVER_CLIC)
            this.CurrentColor = this.HoverCouleur;
        if (!this.Actif)
            this.CurrentColor = this.InactifCouleur;

        let Contour = this.CurrentColor.RGBA2(46)//Color.CouleurByte(97,62,24,1);

        Context.save();
        Context.fillStyle = Color.Couleur(0,0,0,0.2)
        Context.strokeStyle = Color.Couleur(0,0,0,0.2)
        Drawing.RoundRect(Context, 0, 0, this.FinalSize.x, this.FinalSize.y, 2, true, true)

        let x = this.ScrollPosition / this.TotalSize * this.FinalSize.x
        let w = this.FinalSize.x * this.FinalSize.x / this.TotalSize
        Context.fillStyle = this.CurrentColor.RGBA()
        Context.strokeStyle = Contour
        Drawing.RoundRect(Context, x, 0, w, this.FinalSize.y, 2, true, true)

        Context.restore();

    }
}