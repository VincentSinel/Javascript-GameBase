class UI_Button extends UI_Selectable
{
    /**
     * Créer un boutton pour interface utilisateur.
     * Utiliser la variable Boutton.ClicAction pour définir l'action du boutton.
     * @param {UIParam} [Param=undefined] Parametre de l'UI
     */
    constructor(Param)
    {
        super(Param)
        
        this.Texte = undefined;
        //this.Couleur = this.BaseCouleur;
        this.ClicAction = function() {console.log("Button clic action not set");};
    }

    SetTexte(texte)
    {
        if (this.Texte === undefined)
        {
            this.Texte = new UI_Label();
            this.AddChildren(this.Texte);
        }
        this.Texte.Texte = texte;
    }

    Souris_Clique(event)
    {
        super.Souris_Clique(event);
        if (this.ClicAction)
            this.ClicAction(event);
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
        let Fond3 = this.CurrentColor.RGBA2(60)

        let offy = 0;
        let offh = Math.min(10,this.FinalSize.y * 0.2);
        if (this.Etat === UI_Selectable_Etat.HOVER_CLIC
            || this.Etat === UI_Selectable_Etat.CLIC)
        {
            offy = offh * 0.7;
            offh -= offy;
        }
        

        var grd = Context.createLinearGradient(0, 0, 0, this.FinalSize.y);
        grd.addColorStop(0, Fond1);
        grd.addColorStop(1, Fond2);

        Context.save();
        Context.strokeStyle = Contour
        Context.fillStyle = Fond3
        Context.lineWidth = this.EpaisseurBord;
        Drawing.RoundRect(Context, this.EpaisseurBord / 2, 
        this.EpaisseurBord / 2 + offy, 
        this.FinalSize.x - this.EpaisseurBord, 
        this.FinalSize.y - this.EpaisseurBord - offy, 2, true, true)

        Context.shadowOffsetY = offh / 2;
        Context.shadowBlur = 10;
        Context.shadowColor = "black";
        Context.strokeStyle = Contour
        Context.fillStyle = grd
        Drawing.RoundRect(Context, this.EpaisseurBord / 2, 
        this.EpaisseurBord / 2 + offy, 
        this.FinalSize.x - this.EpaisseurBord, 
        this.FinalSize.y - this.EpaisseurBord - offy - offh, 2, true, true)
        
        Context.shadowOffsetY = 0;
        Context.shadowBlur = 0;
        Context.lineWidth = 1;

        //Context.fillStyle = this.FontCouleur.RGBA()
        //Context.font = this.FontTaille + "px " + this.Font;
        //Context.textAlign = "center";
        //Context.fillText(this.Texte, this.W / 2, offy + (this.H - offh - offy + this.FontTaille * 0.7) / 2);

        Context.restore();
    }
}