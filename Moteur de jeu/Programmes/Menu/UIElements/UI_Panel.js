class UI_Panel extends UI_Element
{
    constructor(X = 0,Y = 0,Z = 0, Parent = undefined)
    {
        super(X,Y,Z,Parent)
        
        this.Padding = this.EpaisseurBord;
        this.H = UI_Element_Alignement.STRETCH;
    }

    DessinBackUI(Context)
    {
        if (!this.Actif)
            this.CurrentColor = this.InactifCouleur;
        else
            this.CurrentColor = this.BaseCouleur;

        let Contour = this.CurrentColor.RGBA2(46)//Color.CouleurByte(97,62,24,1);
        let Fond2 = this.CurrentColor.RGBA()//Color.CouleurByte(229,177,77,1);
        let Fond1 = this.CurrentColor.RGBA2(120)//Color.CouleurByte(226,163,42,1);


        var grd = Context.createLinearGradient(0, 0, 0, this.FinalSize.y);
        grd.addColorStop(0, Fond1);
        grd.addColorStop(1, Fond2);

        Context.strokeStyle = Contour
        Context.fillStyle = grd
        Context.lineWidth = this.EpaisseurBord;
        Context.shadowOffsetY = 5;
        Context.shadowBlur = 10;
        Context.shadowColor = "black";
        Drawing.RoundRect(Context, 
            this.EpaisseurBord / 2, this.EpaisseurBord / 2, 
            this.FinalSize.x - this.EpaisseurBord, 
            this.FinalSize.y - this.EpaisseurBord, 2, true, true)
        
        Context.shadowOffsetY = 0;
        Context.shadowBlur = 0;
        Context.lineWidth = 1;
    }
}