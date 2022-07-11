class UI_TextBox extends UI_Panel
{
    static AllowedCharacter = 
    ["a"]
    #TexteTemps
    constructor(X,Y,Z,W,Texte, ToolTip = "",Parent = undefined)
    {
        super(X,Y,Z,W,0,Parent)
        this.Texte = Texte;
        this.ToolTip = ToolTip;
        this.CursorPosition = Texte.length;
        this.SourisCapture = true;
        this.H = this.FontTaille + 6;

        let _this = this;
        this.onClavier_ToucheJusteBasse.push(function(e) {_this.Clavier_ToucheJusteBasse(e)})
        this.onSouris_Clique[Souris.ClicGauche].push(function(e) {_this.Souris_Clique(e)})
        this.onSouris_Basse[Souris.ClicGauche].push(function(e) {_this.Souris_Down(e)})
        this.onSouris_Relache[Souris.ClicGauche].push(function(e) {_this.Souris_Release(e)})
        this.onSouris_Entre.push(function(e) {_this.Souris_Hover(e)})
        this.onSouris_Quitte.push(function(e) {_this.Souris_Leave(e)})
    }

    get MaxPosition()
    {
        return this.Texte.length;
    }

    Souris_Clique(event)
    {
        this.Focus()
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
        if(this.Etat === "Base")
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
    Clavier_ToucheJusteBasse(event)
    {
        console.log(event)
    }
    

    Calcul()
    {

    }

    DessinBackUI(Context)
    {
        super.DessinBackUI(Context);
        this.DessinText(Context);
    }

    DessinText(Context)
    {
        Context.lineWidth = 1;
        if (this.Texte === "")
        {
            Context.fillStyle = this.InactifCouleur.RGBA()
            Context.font = this.FontTaille + "px " + this.Font;
            Context.fillText(this.Tooltip, 3, this.H - 6, this.W - 3);
            let barre = 10 <= Game.TotalFrame % 20;
            if (barre && this.Selected)
            {
                Context.fillStyle = this.FontCouleur.RGBA()
                Context.fillText("|", 3, this.H - 6, this.W - 3);
            }
        }
        else
        {
            let barre = 10 <= TotalFrame % 20;
            let t = this.Texte;
            if (barre && this.Selected)
                t = t.substring(0,this.CursorPosition) + "|" + t.substring(this.CursorPosition);
            Context.fillStyle = this.FontCouleur.RGBA()
            Context.font = this.FontTaille + "px " + this.Font;
            Context.fillText(t,3, this.H - 6, this.W - 3);
        }
    }
}