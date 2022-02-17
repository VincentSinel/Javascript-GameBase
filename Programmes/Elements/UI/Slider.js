class Slider extends UIElement
{
    /**
     * Créer un Slider pour interface utilisateur.
     * Utiliser Slider.Pas pour définir un pas de graduation (0 signifiant aucun pas).
     * Utiliser Slider.Valeur pour connaitre la position actuel du slider
     * @param {Number} X Position X relative à l'objet parent
     * @param {Number} Y Position Y relative à l'objet parent
     * @param {Number} W Largeur du slider
     * @param {Number} H Hauteur du slider
     * @param {Number} Min Valeur minimal du slider (0 de base)
     * @param {Number} Max Valeur maximal du slider (1 de base)
     * @param {UIElement} Parent Objet Parent (facultatif)
     */
    constructor(X,Y,W,H, Min = 0, Max = 1, Parent = undefined)
    {
        super(X,Y, W, H, Parent)

        this.Couleur = UIElement.BaseCouleur;

        this.Valeur = Min;
        this.Min = Min;
        this.Max = Max;
        this.Pas = 0;

        this.SliderW = 15;
    }

    Calcul()
    {
        super.Calcul();
        
        if (Souris.CX >= this.GX() && Souris.CX <= this.GX() + this.W && Souris.CY >= this.GY() && Souris.CY <= this.GY() + this.H)
        {
            this.Couleur = this.SelectionCouleur
            if (Souris.BoutonClic(0))
            {
                if(this.Pas > 0)
                {
                    let pos = (Souris.CX - (this.GX() + this.SliderW / 2)) / (this.W - this.SliderW);
                    let cran = (this.Max - this.Min) / this.Pas;
                    let newpos = Math.round(pos * cran);
                    this.Valeur = Math.min(this.Max,Math.max(this.Min,this.Min + newpos * this.Pas))
                }
                else
                {
                    let pos = (Souris.CX - (this.GX() + this.SliderW / 2)) / (this.W - this.SliderW);
                    let cran = (this.Max - this.Min);
                    this.Valeur = Math.min(this.Max,Math.max(this.Min,this.Min + pos * cran))
                }
            }
        }
        else
        {
            this.Couleur = this.BaseCouleur
        }
    }

    Dessin(Context)
    {
        if (this.RafraichirTaille)
        {
            Context.font = this.FontTaille + "px " + this.Font;
            this.W = Context.measureText(this.Texte).width + 2 + this.FontTaille;
            this.RafraichirTaille = false;
        }


        this.DessinerCoche(Context)

        super.Dessin(Context)
    }

    DessinerCoche(Context)
    {
        let Contour = this.Couleur.RGBA2(46)//Color.CouleurByte(97,62,24,1);
        let Fond2 = this.Couleur.RGBA()//Color.CouleurByte(229,177,77,1);
        let Fond1 = this.Couleur.RGBA2(120)//Color.CouleurByte(226,163,42,1);
        let Check = this.Couleur.RGBA2(150)//Color.CouleurByte(226,163,42,1);


        var grd = ctx.createLinearGradient(0, 0, 0, this.H);
        grd.addColorStop(0, Fond1);
        grd.addColorStop(1, Fond2);

        Context.save();
        Context.fillStyle = Contour
        Context.strokeStyle = Contour
        Context.shadowOffsetY = 5;
        Context.shadowBlur = 10;
        Context.shadowColor = "black";
        let h = Math.max(3,this.H / 10);
        this.roundRect(Context, this.GX() + this.SliderW / 2, this.GY() + this.H / 2 - h / 2, this.W - this.SliderW, h, 2, true, true)


        let b = h / 2;
        Context.fillStyle = grd
        Context.lineWidth = b * 2;

        let x = this.SliderW / 2 + (this.Valeur - this.Min) / (this.Max - this.Min) * (this.W - this.SliderW);

        let p1 = new Vecteur2(this.GX() + b + x - this.SliderW / 2, this.GY() + b)
        let p2 = new Vecteur2(this.GX() - b + x + this.SliderW / 2, this.GY() + b)
        let p3 = new Vecteur2(this.GX() - b + x + this.SliderW / 2, this.GY() - b + Math.max(0, this.H - this.SliderW / 2))
        let p4 = new Vecteur2(this.GX() + x,                    this.GY() - b + this.H)
        let p5 = new Vecteur2(this.GX() + b + x - this.SliderW / 2, this.GY() - b + Math.max(0, this.H - this.SliderW / 2))


        this.roundedPoly(Context, [p1,p2,p3,p4,p5], 3, true, true)

        Context.shadowOffsetY = 0;
        Context.shadowBlur = 0;
        Context.lineWidth = 1;
        Context.restore();
    }
}