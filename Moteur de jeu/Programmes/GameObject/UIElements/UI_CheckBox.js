class UI_CheckBox extends UIElement
{
    #Texte
    #Check
    constructor(X,Y,Z, Label,Parent = undefined)
    {
        super(X,Y,Z,UIElement.BaseFontTaille,UIElement.BaseFontTaille,Parent)


        this.Couleur = this.BaseCouleur;
        this.#Check = false;
        this.Texte = Label;
        this.SourisCapture = true;
        this.onCheck = [];

        let _this = this;
        this.onSouris_Clique[Souris.ClicGauche].push(function(e) {_this.Souris_Clique(e)})
        this.onSouris_Entre.push(function(e) {_this.Souris_Hover(e)})
        this.onSouris_Quitte.push(function(e) {_this.Souris_Leave(e)})
        this.onActivate.push(function(e) {_this.Activation(e)})
        this.onDeActivate.push(function(e) {_this.Desactivation(e)})
    }

    get Texte()
    {
        return this.#Texte
    }
    set Texte(v)
    {
        this.#Texte = v;
        this.Backctx.font = this.FontTaille + "px " + this.Font;
        this.W = this.Backctx.measureText(this.Texte).width + 2 + this.FontTaille;
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
        this.Check = !this.Check;
        this.RefreshUI();
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

    DessinBackUI(Context)
    {
        let Contour = this.Couleur.RGBA2(46)//Color.CouleurByte(97,62,24,1);
        let Fond2 = this.Couleur.RGBA()//Color.CouleurByte(229,177,77,1);
        let Fond1 = this.Couleur.RGBA2(120)//Color.CouleurByte(226,163,42,1);


        var grd = ctx.createLinearGradient(0, 0, 0, this.H);
        grd.addColorStop(0, Fond1);
        grd.addColorStop(1, Fond2);

        let b = (this.H / 10) / 2;
        Context.save();
        Context.strokeStyle = Contour
        Context.fillStyle = grd
        Context.lineWidth = b * 2;
        //Context.shadowOffsetY = 5;
        //Context.shadowBlur = 10;
        //Context.shadowColor = "black";
        this.roundRect(Context, b, b, this.H - b * 2, this.H - b * 2, 2, true, true)

        Context.restore();

        if (this.Check)
        {
            Context.fillStyle = Contour;
            let s = this.H - b * 2
            Context.beginPath();
            Context.moveTo(b + s * 0.25, b + s * 0.33)
            Context.lineTo(b + s * 0.5, b + s * 0.8)
            Context.lineTo(b + s * 1, b + s * 0)
            Context.lineTo(b + s * 0.5, b + s * 0.5)
            Context.closePath();
            Context.fill();
        }
        

        Context.font = this.FontTaille + "px " + this.Font;
        Context.fillStyle = this.FontCouleur.RGBA()
        Context.textBaseline = 'middle'; 
        Context.fillText(this.Texte, 2 + this.H, (this.FontTaille + 3) / 2)
    }


}