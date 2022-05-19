class UI_Button extends UIElement
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
    constructor(X,Y,Z,W,H,Texte,Parent)
    {
        super(X,Y,Z,W,H,Parent)
        
        this.Texte = Texte;
        this.Couleur = this.BaseCouleur;
        this.Etat = "Base"
        this.ClicAction = undefined; 
        this.SourisCapture = true;

        let _this = this;
        this.onSouris_Clique[Souris.ClicGauche].push(function(e) {_this.Souris_Clique(e)})
        this.onSouris_Basse[Souris.ClicGauche].push(function(e) {_this.Souris_Down(e)})
        this.onSouris_Relache[Souris.ClicGauche].push(function(e) {_this.Souris_Release(e)})
        this.onSouris_Entre.push(function(e) {_this.Souris_Hover(e)})
        this.onSouris_Quitte.push(function(e) {_this.Souris_Leave(e)})
        this.onActivate.push(function(e) {_this.Activation(e)})
        this.onDeActivate.push(function(e) {_this.Desactivation(e)})
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
        if (this.ClicAction)
        {
            this.ClicAction(event);
        }
    }
    Souris_Down(event)
    {
        if (this.Etat != "Hover_Click")
        {
            this.Etat = "Hover_Click";
            this.Couleur = this.HoverCouleur;
            this.RefreshUI();
        }
    }
    Souris_Release(event)
    {
        this.Etat = "Hover";
        this.Couleur = this.HoverCouleur;
        this.RefreshUI();
    }

    Souris_Hover(event)
    {
        if(this.Etat == "Base")
        {
            this.Etat = "Hover"
            this.Couleur = this.HoverCouleur;
            this.RefreshUI();
        }
    }
    Souris_Leave(event)
    {
        this.Etat = "Base"
        this.Couleur = this.BaseCouleur;
        this.RefreshUI();
    }


    DessinBackUI(Context)
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
        

        var grd = Context.createLinearGradient(0, 0, 0, this.H);
        grd.addColorStop(0, Fond1);
        grd.addColorStop(1, Fond2);

        Context.save();
        Context.strokeStyle = Contour
        Context.fillStyle = Fond3
        Context.lineWidth = this.EpaisseurBord;
        this.roundRect(Context, this.EpaisseurBord / 2, this.EpaisseurBord / 2 + offy, this.W - this.EpaisseurBord, this.H - this.EpaisseurBord - offy, 2, true, true)

        Context.shadowOffsetY = offh / 2;
        Context.shadowBlur = 10;
        Context.shadowColor = "black";
        Context.strokeStyle = Contour
        Context.fillStyle = grd
        this.roundRect(Context, this.EpaisseurBord / 2, this.EpaisseurBord / 2 + offy, this.W - this.EpaisseurBord, this.H - this.EpaisseurBord - offy - offh, 2, true, true)
        
        Context.shadowOffsetY = 0;
        Context.shadowBlur = 0;
        Context.lineWidth = 1;

        Context.fillStyle = this.FontCouleur.RGBA()
        Context.font = this.FontTaille + "px " + this.Font;
        Context.textAlign = "center";
        Context.fillText(this.Texte, this.W / 2, offy + (this.H - offh - offy + this.FontTaille * 0.7) / 2);

        Context.restore();
    }
}