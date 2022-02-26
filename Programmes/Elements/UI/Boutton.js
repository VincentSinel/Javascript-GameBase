class Boutton extends UIElement
{
    /**
     * Créer un boutton pour interface utilisateur.
     * Utiliser la variable Boutton.ClicAction pour définir l'action du boutton.
     * @param {Number} X Position X relative à l'objet parent
     * @param {Number} Y Position Y relative à l'objet parent
     * @param {Number} W Largeur du boutton
     * @param {Number} H Hauteur du boutton
     * @param {String} Texte Texte affiché sur le boutton
     * @param {UIElement} Parent Objet Parent (facultatif)
     */
    constructor(X,Y,W,H,Texte, Parent = undefined)
    {
        super(X,Y,W,H, Parent)
        this.Texte = Texte;

        this.Etat = "Base"
        this.ClicAction = undefined; // Action a effectuer lorsque le boutton est pressé
        this.Couleur = UIElement.BaseCouleur;
        this.SourisCapture = true;
    }


    Calcul(Delta)
    {
        super.Calcul(Delta)

        if (this.Actif)
        {
            if (this.IsTop)
            {
                this.Couleur = this.SelectionCouleur
                if (Souris.BoutonClic(0))
                    this.Etat = "Hover_Click"
                else
                    this.Etat = "Hover"
                if (Souris.BoutonJustClic(0))
                {
                    if (this.ClicAction)
                    {
                        this.ClicAction();
                    }
                }
            }
            else
            {
                this.Etat = "Base"
                this.Couleur = this.BaseCouleur
            }
        }
        else
        {
            this.Couleur = this.InactifCouleur
        }
    }

    Dessin(Context)
    {
        this.DessinBoutton(Context)

        super.Dessin(Context)
    }


    DessinBoutton(Context)
    {
        let Contour = this.Couleur.RGBA2(46)
        let Fond2 = this.Couleur.RGBA()
        let Fond1 = this.Couleur.RGBA2(120)
        let Fond3 = this.Couleur.RGBA2(60)

        let offy = 0;
        let offh = Math.min(10,this.H * 0.2);
        if (this.Etat == "Hover_Click")
        {
            offy = offh * 0.7;
            offh -= offy;
        }
        

        var grd = ctx.createLinearGradient(0, 0, 0, this.H);
        grd.addColorStop(0, Fond1);
        grd.addColorStop(1, Fond2);

        Context.save();
        Context.strokeStyle = Contour
        Context.fillStyle = Fond3
        Context.lineWidth = 3;
        Context.shadowOffsetY = offh / 2;
        Context.shadowBlur = 10;
        Context.shadowColor = "black";
        this.roundRect(Context, this.GX() + 1.5, this.GY() + 1.5 + offy, this.W - 3, this.H - 3 - offy, 2, true, true)

        Context.strokeStyle = Contour
        Context.fillStyle = grd
        this.roundRect(Context, this.GX() + 1.5, this.GY() + 1.5 + offy, this.W - 3, this.H - 3 - offy - offh, 2, true, true)
        
        Context.shadowOffsetY = 0;
        Context.shadowBlur = 0;
        Context.lineWidth = 1;

        Context.fillStyle = this.FontCouleur.RGBA()
        Context.font = this.FontTaille + "px " + this.Font;
        Context.textAlign = "center";
        Context.fillText(this.Texte, this.GX() + this.W / 2, this.GY() + offy + (this.H - offh - offy + this.FontTaille * 0.7) / 2);

        Context.restore();


    }

}