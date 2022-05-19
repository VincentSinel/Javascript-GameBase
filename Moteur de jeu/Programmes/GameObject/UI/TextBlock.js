class TextBlock extends UIElement
{
    /**
     * Créer un TextBlock pour interface utilisateur. C'est un block de texte.
     * Utiliser Slider.ModifierTexte(Texte) pour modifier le contenue (effectue un rafraichissement du découpage).
     * @param {Number} X Position X relative à l'objet parent
     * @param {Number} Y Position Y relative à l'objet parent
     * @param {Number} W Largeur du TextBlock
     * @param {Number} H Hauteur du TextBlock
     * @param {Number} Texte Texte à afficher, les lignes sont automatiquement découper selon la largeur de l'objet
     * @param {UIElement} Parent Objet Parent (facultatif)
     */
    constructor(X,Y,W,H, Texte, Parent = undefined)
    {
        super(X,Y,W,H, Parent)

        this.Texte = Texte;
        this.Lines = []
        this.Rafraichir = true;
    }

    /**
     * Modifie le texte de la bulle (donnant ordre de recalculer sa taille)
     * @param {string} Texte 
     */
     ModifierTexte(Texte)
     {
         this.Texte = Texte
         this.Rafraichir = true;
     }

    Calcul(Delta)
    {
        super.Calcul(Delta);
    }

    /**
     * Prépare le contenue et la bulle pour l'affichage d'un texte. Un contexte de canvas est nécessaire pour effectuer les mesures.
     * La largeur maximal de la bulle est 250 px par default
     * @param {context} Context Context d'un canvas
     * @param {number} MaxW Largeur maximum de la bulle de dialogue
     */
     CalculTailleBulle(Context,MaxW = 250)
     {
         Context.font = this.FontTaille + "px " + this.Font;
         MaxW = MaxW - 16;
         if (Context.measureText(this.Texte).width > MaxW)
         {
             let line = [];
             let actualline = "";
             let mots = this.Texte.split(" ");
     
             for (let m = 0; m < mots.length; m++) {
                 let mot = mots[m];
                 
                 if (actualline != "")
                 {
                     if (Context.measureText(actualline + " " + mot).width > MaxW)
                     {
                         line.push(actualline);
                         actualline = "";
                     }
                     else
                     {
                         actualline += " " + mot;
                     }
                 }
                 if (actualline == "")
                 {
                     if (Context.measureText(mot).width > MaxW)
                     {
                         actualline = mot[0]
                         for (let l = 1; l < mot.length; l++) 
                         {
                             let lettre = mot[l];
                             if (Context.measureText(actualline + lettre).width > MaxW)
                             {
                                 line.push(actualline);
                                 actualline = lettre;
                             }
                             else
                             {
                                 actualline += lettre;
                             }
                         }
                     }
                     else
                     {
                         actualline = mot;
                     }
                 }
     
             }
             if (actualline != "")
             {
                 line.push(actualline);
             }
 
             this.Lines = line
         }
         else
         {
             this.Lines = [this.Texte];
         }
         this.Rafraichir = false;
     }

    Dessin(Context)
    {
        this.DessinerTexte(Context)

        super.Dessin(Context)
    }

    DessinerTexte(Context)
    {
        if (this.Rafraichir)
        {
            this.CalculTailleBulle(Context, this.W)
        }

        Context.save();
        Context.fillStyle = this.FontCouleur.RGBA();
        Context.font = this.FontTaille + "px " + this.Font;
        
        for (let line = 0; line < this.Lines.length; line++) {
            const element = this.Lines[line];
            let pos = this.GY() - 2 + (line + 1) * (this.FontTaille + 2)
            if (pos < this.GY() + this.H)
            {
                Context.fillText(element, this.GX(), pos);
            }
        }

        Context.restore();
    }
}