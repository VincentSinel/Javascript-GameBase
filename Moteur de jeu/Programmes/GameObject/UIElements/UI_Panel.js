class UI_Panel extends UIElement
{
    constructor(X,Y,Z,W,H, Parent = undefined)
    {
        super(X,Y,Z,W,H,Parent)

        let _this = this;
        this.onActivate.push(function(e) {_this.enter(e)})
        this.onDeActivate.push(function(e) {_this.leave(e)})
        
        this.Couleur = this.BaseCouleur;
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

    DessinBackUI(Context)
    {
        let Contour = this.Couleur.RGBA2(46)//Color.CouleurByte(97,62,24,1);
        let Fond2 = this.Couleur.RGBA()//Color.CouleurByte(229,177,77,1);
        let Fond1 = this.Couleur.RGBA2(120)//Color.CouleurByte(226,163,42,1);


        var grd = Context.createLinearGradient(0, 0, 0, this.H);
        grd.addColorStop(0, Fond1);
        grd.addColorStop(1, Fond2);

        Context.strokeStyle = Contour
        Context.fillStyle = grd
        Context.lineWidth = this.EpaisseurBord;
        Context.shadowOffsetY = 5;
        Context.shadowBlur = 10;
        Context.shadowColor = "black";
        this.roundRect(Context, this.EpaisseurBord / 2, this.EpaisseurBord / 2, this.W - this.EpaisseurBord, this.H - this.EpaisseurBord, 2, true, true)
        
        Context.shadowOffsetY = 0;
        Context.shadowBlur = 0;
        Context.lineWidth = 1;
    }
}