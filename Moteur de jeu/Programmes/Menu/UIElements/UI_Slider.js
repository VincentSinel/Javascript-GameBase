class UI_HoriSlider extends UI_Draggable
{
    static SliderW = 15;
    static BaseH = 20;

    #OldValue;

    #MinValue = 0;
    #MaxValue = 10;
    #Value = 5;
    #PasValue = 0;


    constructor(Param)
    {
        super(Param)

        this.W = UI_Element_Alignement.STRETCH;
        this.H = UI_HoriSlider.BaseH;
        this.VerticalAlignement = HorizontalAlignementType.Center;

        this.onValueChanged = [];
    }

    get ValeurMin() { return this.#MinValue; }
    set ValeurMin(v) { this.#MinValue = Math.min(v, this.#MaxValue); this.#MaxValue = Math.max(v, this.#MaxValue); this.Refresh(); }
    get ValeurMax() { return this.#MaxValue; }
    set ValeurMax(v) { this.#MaxValue = Math.max(v, this.#MinValue); this.#MinValue = Math.min(v, this.#MinValue); this.Refresh(); }
    get PasValue() { return this.#PasValue; }
    set PasValue(v) { this.#PasValue = v; }
    get Valeur() { return this.#Value; }
    set Valeur(v)
    {
        if(this.PasValue > 0)
        {
            v = Math.round(v / this.PasValue) * this.PasValue
        }
        this.#Value = Math.max(Math.min(v,this.ValeurMax), this.ValeurMin);
        this.Refresh();
        for (let i = 0; i < this.onValueChanged.length; i++) {
            this.onValueChanged[i](this);
        }
    }

    Souris_Clique(event)
    {
        let pos = event.Param;
        this.Valeur = this.ValeurMin + (pos.x - this.GX - UI_HoriSlider.SliderW / 2) / (this.FinalSize.x - UI_HoriSlider.SliderW) * (this.ValeurMax - this.ValeurMin)
    }
    Souris_DragStart(event)
    {
        super.Souris_DragStart(event);
        this.Souris_Clique(event)
        this.#OldValue = this.Valeur;
    }
    Souris_Dragging(event)
    {
        super.Souris_Dragging(event);
        this.Valeur = this.#OldValue + this.DragMove.x / (this.FinalSize.x - UI_HoriSlider.SliderW) * (this.ValeurMax - this.ValeurMin);
    }
    Souris_DragEnd(event)
    {
        super.Souris_DragEnd(event);
        this.Valeur = this.#OldValue + this.DragMove.x / (this.FinalSize.x - UI_HoriSlider.SliderW) * (this.ValeurMax - this.ValeurMin);
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

        let Contour = this.CurrentColor.RGBA2(46)
        let Fond2 = this.CurrentColor.RGBA()
        let Fond1 = this.CurrentColor.RGBA2(120)

        var grd = Context.createLinearGradient(0, 0, 0, this.H);
        grd.addColorStop(0, Fond1);
        grd.addColorStop(1, Fond2);

        Context.save();
        Context.fillStyle = Contour
        Context.strokeStyle = Contour
        let h = Math.max(3,this.FinalSize.y / 10);
        Drawing.RoundRect(Context, UI_HoriSlider.SliderW / 2, this.FinalSize.y / 2 - h / 2, this.FinalSize.x - UI_HoriSlider.SliderW, h, 2, true, true)

        let b = h / 2;
        Context.fillStyle = grd;
        Context.lineWidth = b * 2;

        let x = UI_HoriSlider.SliderW / 2 + (this.Valeur - this.ValeurMin) / (this.ValeurMax - this.ValeurMin) * (this.FinalSize.x - UI_HoriSlider.SliderW);

        let p1 = new Vector(b  + x - UI_HoriSlider.SliderW / 2, b)
        let p2 = new Vector(-b + x + UI_HoriSlider.SliderW / 2, b)
        let p3 = new Vector(-b + x + UI_HoriSlider.SliderW / 2,- b + Math.max(0, this.FinalSize.y - UI_HoriSlider.SliderW / 2))
        let p4 = new Vector(x,                        - b + this.H)
        let p5 = new Vector(b  + x - UI_HoriSlider.SliderW / 2,- b + Math.max(0, this.FinalSize.y - UI_HoriSlider.SliderW / 2))

        Drawing.RoundedPoly(Context, [p1,p2,p3,p4,p5], 3, true, true)

        Context.restore();
    }
}