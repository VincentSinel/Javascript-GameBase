/**
 * Bulle de dialogue avec ajustement automatique de la taille.
 * @class
 * @extends NinePatch
 */
class BulleDialogue extends NinePatch
{
    static BaseFontSize = 20;
    static MaxW = 300;

    #Texte
    #Font
    #FontSize
    #Lines;
    /**
     * Création d'une bulle de dialogue contenant un texte précis.
     * @constructor
     * @param {string} Texte Texte à afficher
     * @param {number} X Position X de l'origine de la bulle
     * @param {number} Y Position Y de l'origine de la bulle
     */
    constructor(Texte, X, Y)
    {
        super(X,Y,"System/Bulle",[45, 20, 20, 35])
        this.TempCanvas.textAlign = "left";
        this.TempCanvas.fillStyle = "black"
        this.#Texte = Texte;
        this.#Font = "Arial";
        this.#FontSize = BulleDialogue.BaseFontSize;
        this.#Lines = [];
        this.Visible = false;

        this.AllowRotation = false;
        this.AllowScaling = false;
        
        this.TempCanvas.font = this.FontSize + "px " + this.Font;
        this.#CalculTailleBulle(BulleDialogue.MaxW)
    }

    //#region GETTER SETTER

    /**
     * Renvoie la liste des lignes de texte de la bulle.
     * @type {Array<string>}
     */
    get Lines()
    {
        return this.#Lines;
    }
    /**
     * Texte à afficher
     * @type {string}
     */
    get Texte()
    {
        return this.#Texte
    }
    set Texte(v)
    {
        this.#Texte = v;
        this.#CalculTailleBulle(BulleDialogue.MaxW)
    }
    /**
     * Font du texte
     * @type {string}
     */
    get Font()
    {
        return this.#Font
    }
    set Font(v)
    {
        this.#Font = v;
        this.TempCanvas.font = this.FontSize + "px " + this.Font;
        this.#CalculTailleBulle(BulleDialogue.MaxW)
    }
    /**
     * Taille du texte
     * @type {float}
     */
    get FontSize()
    {
        return this.#FontSize
    }
    set FontSize(v)
    {
        this.#FontSize = v;
        this.TempCanvas.font = this.FontSize + "px " + this.Font;
        this.#CalculTailleBulle(BulleDialogue.MaxW)
    }
    /**
     * Largeur de la texture
     * @override
     * @type {float}
     */
    get TextWidth()
    {
        return this.W;
    }
    /**
     * Hauteur de la texture
     * @override
     * @type {float}
     */
    get TextHeight()
    {
        return this.H;
    }

    //#endregion

    /**
     * Prépare le contenue et la bulle pour l'affichage d'un texte. Un contexte de canvas est nécessaire pour effectuer les mesures.
     * La largeur maximal de la bulle est 250 px par default
     * @param {CanvasRenderingContext2D} Context Context d'un canvas
     * @param {number} MaxW Largeur maximum de la bulle de dialogue
     */
    #CalculTailleBulle(MaxW)
    {
        let Context = document.createElement("canvas").getContext("2d");
        Context.font = this.FontSize + "px " + this.Font;
        MaxW = MaxW - 18;
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
                if (actualline === "")
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

            this.#Lines = line
            this.Reajuster(MaxW + 18, (this.FontSize + 2) * line.length + 32)
        }
        else
        {
            this.#Lines = [this.Texte];
            this.Reajuster(Context.measureText(this.Texte).width + 18, this.FontSize + 34)
        }
        this.CentreRotation = new Vector(34 / this.W, 1);
    }
    /**
     * Recréer la bulle en cas de modification de taille ou de texte
     */
    ResizeDessin()
    {
        super.ResizeDessin();

        this.TempCanvas.font = this.FontSize + "px " + this.Font;
        if (this.Lines)
        {
            for (let line = 0; line < this.Lines.length; line++) {
                const element = this.Lines[line];
                this.TempCanvas.fillText(element, 9, 5 + (line + 1) * (this.FontSize + 2));
            }
        }
    }
}