class UI_CheckBox extends UI_Button
{
    static MarkSize = 20

    #Check = false
    constructor(Param)
    {
        super(Param)
        this.Focusable = true;
        this.onCheck = [];
        this.CurrentMarkSize = UI_CheckBox.MarkSize;
        this.Padding.left = UI_CheckBox.MarkSize + 5;
    }
    get Check()
    {
        return this.#Check
    }
    set Check(v)
    {
        this.#Check = v;
        for (let i = 0; i < this.onCheck.length; i++) {
            this.onCheck[i](this);
        }
    }

    SetTexte(texte)
    {
        super.SetTexte(texte)
        this.Texte.HorizontalAlignement = HorizontalAlignementType.Left;
    }

    Souris_Clique(event)
    {
        super.Souris_Clique(event);
        this.Check = !this.Check;
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

        let t = this.CurrentMarkSize 

        var grd = Context.createLinearGradient(0, 0, 0, t);
        grd.addColorStop(0, Fond1);
        grd.addColorStop(1, Fond2);

        let b = (t / 10) / 2;
        Context.save();
        Context.strokeStyle = Contour
        Context.fillStyle = grd
        Context.lineWidth = b * 2;

        Drawing.RoundRect(Context, b, (this.FinalSize.y - t + b * 2) / 2, t - b * 2, t - b * 2, 2, true, true)

        Context.shadowOffsetY = 0;
        Context.shadowBlur = 0;
        Context.lineWidth = 1;
        
        Context.restore();

        let b2 = (this.FinalSize.y - t + b * 2) / 2

        if (this.Check)
        {
            Context.fillStyle = Contour;
            let s = t - b * 2
            Context.beginPath();
            Context.moveTo(b + s * 0.25, b2 + s * 0.33)
            Context.lineTo(b + s * 0.5, b2 + s * 0.8)
            Context.lineTo(b + s * 1, b2 + s * 0)
            Context.lineTo(b + s * 0.5, b2 + s * 0.5)
            Context.closePath();
            Context.fill();
        }
    }


}