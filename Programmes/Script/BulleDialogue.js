/**
 * Bulle de dialogue avec ajustement automatique de la taille.
 */
class BulleDialogue extends NinePatch
{
    /**
     * Création d'une bulle de dialogue contenant un texte précis.
     * @param {string} Texte Texte à afficher
     * @param {number} X Position X de l'origine de la bulle
     * @param {number} Y Position Y de l'origine de la bulle
     */
    constructor(Texte, X, Y)
    {
        super("Images/Bulle.png",[45, 20, 20, 35])
        this.Texte = Texte
        this.X = X;
        this.Y = Y;
        this.Font = "Arial"
        this.FontSize = 12
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

    /**
     * Prépare le contenue et la bulle pour l'affichage d'un texte. Un contexte de canvas est nécessaire pour effectuer les mesures.
     * La largeur maximal de la bulle est 250 px par default
     * @param {context} Context Context d'un canvas
     * @param {number} MaxW Largeur maximum de la bulle de dialogue
     */
    CalculTailleBulle(Context,MaxW = 250)
    {
        Context.font = this.FontSize + "px " + this.Font;
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

            this.Reajuster(MaxW + 16, (this.FontSize + 2) * line.length + 32)
            this.Lines = line
        }
        else
        {
            this.Reajuster(Context.measureText(this.Texte).width + 16, this.FontSize + 34)
            this.Lines = [this.Texte];
        }
        this.Rafraichir = false;
    }


    /**
     * Dessine la bulle de dialogue à l'écran
     * @param {context} Context 
     */
    Dessin(Context)
    {
        if (this.Rafraichir)
        {
            this.CalculTailleBulle(Context)
        }
        this.Y += this.H;
        this.X -= 33;
        super.Dessin(Context)

        Context.font = this.FontSize + "px " + this.Font;
        Context.fillStyle = "black"
        for (let line = 0; line < this.Lines.length; line++) {
            const element = this.Lines[line];
            ctx.fillText(element, Ecran_Largeur / 2 + Camera.AdapteX(this.X) + 9, Ecran_Hauteur / 2 + Camera.AdapteY(this.Y) + 5 + (line + 1) * (this.FontSize + 2));
        }

        this.Y -= this.H;
        this.X += 33;
    }

}