class CheckBox extends UIElement
{
    /**
     * Creer une checkbox pour interface utilisateur.
     * Utiliser CheckBox.Check pour connaitre son état.
     * @param {Number} X Position X relative a l'objet parent
     * @param {Number} Y Position Y relative a l'objet parent
     * @param {String} Texte Contenu attaché à la boite à cocher
     * @param {UIElement} Parent Objet Parent (facultatif)
     */
    constructor(X, Y, Texte, Parent = undefined)
    {
        super(X,Y, 0, 0, Parent)

        this.Couleur = UIElement.BaseCouleur;
        this.Texte = Texte;
        this.H = this.FontTaille;
        this.W = this.FontTaille;
        this.Check = true;
        this.RafraichirTaille = true;
    }

    ModifierTexte(Texte)
    {
        this.Texte = Texte;
        this.RafraichirTaille = true;
    }

    Calcul()
    {
        super.Calcul();
        
        if (Souris.CX >= this.GX() && Souris.CX <= this.GX() + this.W && Souris.CY >= this.GY() && Souris.CY <= this.GY() + this.H)
        {
            this.Couleur = this.SelectionCouleur
            if (Souris.BoutonJustDeclic(0))
            {
                this.Check = !this.Check
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

        let b = (this.H / 10) / 2;
        Context.save();
        Context.strokeStyle = Contour
        Context.fillStyle = grd
        Context.lineWidth = b * 2;
        Context.shadowOffsetY = 5;
        Context.shadowBlur = 10;
        Context.shadowColor = "black";
        this.roundRect(Context, this.GX() + b, this.GY() + b, this.H - b * 2, this.H - b * 2, 2, true, true)

        Context.shadowOffsetY = 0;
        Context.shadowBlur = 0;
        Context.lineWidth = 1;
        Context.restore();

        if (this.Check)
        {
            Context.fillStyle = Contour;
            let x0 = this.GX() + b;
            let y0 = this.GY() + b;
            let s = this.H - b * 2
            Context.beginPath();
            Context.moveTo(x0 + s * 0.25, y0 + s * 0.33)
            Context.lineTo(x0 + s * 0.5, y0 + s * 0.8)
            Context.lineTo(x0 + s * 1, y0 + s * 0)
            Context.lineTo(x0 + s * 0.5, y0 + s * 0.5)
            Context.closePath();
            Context.fill();
        }
        

        Context.font = this.FontTaille + "px " + this.Font;
        Context.fillStyle = this.FontCouleur.RGBA()
        Context.textBaseline = 'middle'; 
        Context.fillText(this.Texte, this.GX() + 2 + this.H, this.GY() + this.FontTaille / 2)
    }
}