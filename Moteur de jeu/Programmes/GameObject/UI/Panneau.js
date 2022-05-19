class Panneau extends UIElement
{
    /**
     * Créer un panneau pour interface utilisateur. Il permet de regrouper plusieurs objet.
     * @param {Number} X Position X relative à l'objet parent
     * @param {Number} Y Position Y relative à l'objet parent
     * @param {Number} W Largeur du panneau
     * @param {Number} H Hauteur du panneau
     * @param {UIElement} Parent Objet Parent (facultatif)
     */
    constructor(X,Y,W,H, Parent = undefined)
    {
        super(X,Y,W,H, Parent)

        this.Couleur = UIElement.BaseCouleur;
    }


    Calcul(Delta)
    {
        super.Calcul(Delta);


        
    }

    Dessin(Context)
    {
        this.DessinerPanneau(Context)

        super.Dessin(Context)
    }

    DessinerPanneau(Context)
    {
        let Contour = this.Couleur.RGBA2(46)//Color.CouleurByte(97,62,24,1);
        let Fond2 = this.Couleur.RGBA()//Color.CouleurByte(229,177,77,1);
        let Fond1 = this.Couleur.RGBA2(120)//Color.CouleurByte(226,163,42,1);


        var grd = ctx.createLinearGradient(0, 0, 0, this.H);
        grd.addColorStop(0, Fond1);
        grd.addColorStop(1, Fond2);

        Context.save();
        Context.strokeStyle = Contour
        Context.fillStyle = grd
        Context.lineWidth = 3;
        Context.shadowOffsetY = 5;
        Context.shadowBlur = 10;
        Context.shadowColor = "black";
        this.roundRect(Context, this.GX() + 1.5, this.GY() + 1.5, this.W - 3, this.H - 3, 2, true, true)
        
        Context.shadowOffsetY = 0;
        Context.shadowBlur = 0;
        Context.lineWidth = 1;
        Context.restore();
    }
}