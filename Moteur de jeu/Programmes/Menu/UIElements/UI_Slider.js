class UI_Slider extends UI_Element
{
    static SliderW = 15;

    #dragstart;
    #OldValue;

    #MinValue;
    #MaxValue;
    #Value;


    constructor(X,Y,Z,W,H,Min = 0, Max = 1, Parent)
    {
        super(X, Y, Z, W, H, Parent)

        this.SourisCapture = true;
        this.Draggable = true;

        this.Couleur = UI_Element.BaseCouleur;

        this.#MinValue = Math.min(Min, Max);
        this.#MaxValue = Math.max(Min, Max);
        this.PasValue = 0;
        this.#Value = 0;

        this.onValueChanged = [];

        let _this = this;
        this.onSouris_Clique[Souris.ClicGauche].push(function(e) {_this.Souris_Clique(e)})
        this.onSouris_DragStart[Souris.ClicGauche].push(function(e) {_this.Souris_DragStart(e)})
        this.onSouris_Dragging[Souris.ClicGauche].push(function(e) {_this.Souris_Dragging(e)})
        this.onSouris_DragEnd[Souris.ClicGauche].push(function(e) {_this.Souris_DragEnd(e)})
        this.onSouris_Entre.push(function(e) {_this.Souris_Hover(e)})
        this.onSouris_Quitte.push(function(e) {_this.Souris_Leave(e)})
        this.onActivate.push(function(e) {_this.Activation(e)})
        this.onDeActivate.push(function(e) {_this.Desactivation(e)})
    }
    get ValeurMin()
    {
        return this.#MinValue;
    }
    set ValeurMin(v)
    {
        this.#MinValue = Math.min(v, this.#MaxValue);
        this.#MaxValue = Math.max(v, this.#MaxValue);
        this.RefreshUI();
    }
    get ValeurMax()
    {
        return this.#MaxValue;
    }
    set ValeurMax(v)
    {
        this.#MaxValue = Math.max(v, this.#MinValue);
        this.#MinValue = Math.min(v, this.#MinValue);
        this.RefreshUI();
    }
    get Valeur()
    {
        return this.#Value;
    }
    set Valeur(v)
    {
        if(this.PasValue > 0)
        {
            v = Math.round(v / this.PasValue) * this.PasValue
        }
        this.#Value = Math.max(Math.min(v,this.ValeurMax), this.ValeurMin);
        this.RefreshUI();
        for (let i = 0; i < this.onValueChanged.length; i++) {
            this.onValueChanged[i](this);
        }
    }

    Activation(e)
    {
        this.Couleur = this.BaseCouleur;
        this.RefreshUI();
    }
    Desactivation(e)
    {
        this.Couleur = this.InactifCouleur;
        this.RefreshUI();
    }
    Souris_Clique(event)
    {
        let pos = event.Param;
        this.Valeur = this.ValeurMin + (pos.x - this.GX - UI_Slider.SliderW / 2) / (this.W - UI_Slider.SliderW) * (this.ValeurMax - this.ValeurMin)
    }
    Souris_DragStart(event)
    {
        this.Couleur = this.HoverCouleur;
        this.#dragstart = event.Param.x;
        this.Souris_Clique(event)
        this.#OldValue = this.Valeur;
    }
    Souris_Dragging(event)
    {
        this.Couleur = this.HoverCouleur;
        let l = event.Param.x - this.#dragstart;

        this.Valeur = this.#OldValue + l / (this.W - UI_Slider.SliderW) * (this.ValeurMax - this.ValeurMin);
    }
    Souris_DragEnd(event)
    {
        this.Couleur = this.BaseCouleur;
        let l = event.Param.x - this.#dragstart;
        this.Valeur = this.#OldValue + l / (this.W - UI_Slider.SliderW) * (this.ValeurMax - this.ValeurMin);
    }

    Souris_Hover(event)
    {
        this.Couleur = this.HoverCouleur;
        this.RefreshUI();
    }
    Souris_Leave(event)
    {
        this.Couleur = this.BaseCouleur;
        this.RefreshUI();
    }

    RefreshUI()
    {
        super.RefreshUI();
    }


    DessinBackUI(Context)
    {
        let Contour = this.Couleur.RGBA2(46)//Color.CouleurByte(97,62,24,1);
        let Fond2 = this.Couleur.RGBA()//Color.CouleurByte(229,177,77,1);
        let Fond1 = this.Couleur.RGBA2(120)//Color.CouleurByte(226,163,42,1);

        var grd = ctx.createLinearGradient(0, 0, 0, this.H);
        grd.addColorStop(0, Fond1);
        grd.addColorStop(1, Fond2);

        Context.save();
        Context.fillStyle = Contour
        Context.strokeStyle = Contour
        let h = Math.max(3,this.H / 10);
        Drawing.RoundRect(Context, UI_Slider.SliderW / 2, this.H / 2 - h / 2, this.W - UI_Slider.SliderW, h, 2, true, true)

        let b = h / 2;
        Context.fillStyle = grd;
        Context.lineWidth = b * 2;

        let x = UI_Slider.SliderW / 2 + (this.Valeur - this.ValeurMin) / (this.ValeurMax - this.ValeurMin) * (this.W - UI_Slider.SliderW);

        let p1 = new Vector(b  + x - UI_Slider.SliderW / 2, b)
        let p2 = new Vector(-b + x + UI_Slider.SliderW / 2, b)
        let p3 = new Vector(-b + x + UI_Slider.SliderW / 2,- b + Math.max(0, this.H - UI_Slider.SliderW / 2))
        let p4 = new Vector(x,                        - b + this.H)
        let p5 = new Vector(b  + x - UI_Slider.SliderW / 2,- b + Math.max(0, this.H - UI_Slider.SliderW / 2))

        Drawing.RoundedPoly(Context, [p1,p2,p3,p4,p5], 3, true, true)

        Context.shadowOffsetY = 0;
        Context.shadowBlur = 0;
        Context.lineWidth = 1;
        Context.restore();

    }
}