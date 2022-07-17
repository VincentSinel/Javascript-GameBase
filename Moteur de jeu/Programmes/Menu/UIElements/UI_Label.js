class UI_Label extends UI_Element
{
    #Texte
    #Lines = [];
    /**
     * Créer un TextBlock pour interface utilisateur. C'est un block de texte.
     * Utiliser Slider.ModifierTexte(Texte) pour modifier le contenue (effectue un rafraichissement du découpage).
     * @param {string} Texte Texte à afficher, les lignes sont automatiquement découper selon la largeur de l'objet
     * @param {UIParam} [Param=undefined] Parametre de l'UI
     */
    constructor(Texte = "", Param)
    {
        super(Param)

        this.MultiLine = false;
        this.Texte = Texte.toString();
        this.CreateCanvas();
    }

    get Texte()
    {
        return this.#Texte;
    }
    set Texte(v)
    {
        if (this.Texte != v)
        {
            this.#Texte = v;
            this.SetDirty();
        }
    }
    /**
     * Coeur de la mesure de l'objet. Cette fonction demande à l'objet la taille qu'il souhaite prendre
     * !!!!!!!  Cette fonction doit appelé la fonction Measure sur l'ensemble des objets enfants.
     * @param {Vector} availableSize Taille disponible actuellement
     * @param {boolean} skip Définit si la mesure doit être sauté
     * @returns {Vector} Taille souhaité par cet objet
     */
    MeasureCore(availableSize, skip)
    {
        let childsize = super.MeasureCore(availableSize, skip);
        let texteSize = this.CalculateTexteSize(availableSize.x);


        // Renvoie la taille maximal voulue
        return new Vector(
            Math.max(childsize.x, texteSize.x, this.MinW),
            Math.max(childsize.y, texteSize.y, this.MinH))
    }
    /**
     * Coeur de l'arrangement des éléments. Cette fonction demande à l'objet de s'adapter à la taille choisie.
     * !!!! Celle-ci doit aussi appelé Arrange sur l'ensemble de ses enfants.
     * @param {Vector} finalRect Taille alloué a l'objet
     * @param {boolean} sameAsMesure Définit si la taille final est identique a la taille de mesure
     */
    ArrangeCore(finalRect,sameAsMesure)
    {
        super.ArrangeCore(finalRect, sameAsMesure);
    }

    CalculateTexteSize(maxW)
    {
        let fs = Vector.Zero;
        this.#Lines = [];
        let lines = this.#Texte.split("\n");
        for (let i = 0; i < lines.length; i++) 
        {
            this.#CalculateTexteSizeWithoutLinebreak(lines[i], this.MultiLine ? Math.max(maxW, this.MaxW) : Infinity);
        }
        let h = (this.FontTaille + 2) * this.#Lines.length + 2;
        return new Vector(maxW, h);
    }

    #CalculateTexteSizeWithoutLinebreak(texte, maxW)
    {
        this.Backctx.font = this.FontTaille + "px " + this.Font;
        if (this.Backctx.measureText(texte).width > maxW)
        {
            let actualline = "";
            let mots = texte.split(" ");
    
            for (let m = 0; m < mots.length; m++) {
                let mot = mots[m];
                
                if (actualline != "")
                {
                    if (this.Backctx.measureText(actualline + " " + mot).width > maxW)
                    {
                        this.#Lines.push(actualline);
                        actualline = "";
                    }
                    else
                    {
                        actualline += " " + mot;
                    }
                }
                if (actualline === "")
                {
                    if (this.Backctx.measureText(mot).width > maxW)
                    {
                        actualline = mot[0]
                        for (let l = 1; l < mot.length; l++) 
                        {
                            let lettre = mot[l];
                            if (this.Backctx.measureText(actualline + lettre).width > maxW)
                            {
                                this.#Lines.push(actualline);
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
                this.#Lines.push(actualline);
            }
        }
        else
        {
            this.#Lines.push(texte)
        }
    }
     
    DessinBackUI(Context)
    {
        if (this.Actif)
            Context.fillStyle = this.FontCouleur.RGBA();
        else
            Context.fillStyle = this.InactifCouleur.RGBA();

        Context.font = this.FontTaille + "px " + this.Font;

        Context.textAlign = this.HorizontalAlignement;

        let h = (this.FontTaille + 2) * this.#Lines.length + 2;
        let offx = 0;
        if(this.HorizontalAlignement === HorizontalAlignementType.Center)
        {
            offx = this.FinalSize.x / 2;
        }
        if(this.HorizontalAlignement === HorizontalAlignementType.Right )
        {
            offx = this.FinalSize.x;
        }
        
        let offy = 0;
        if(this.VerticalAlignement === VerticalAlignementType.Center)
        {
            offy = (this.FinalSize.y - h)/ 2;
        }



        for (let line = 0; line < this.#Lines.length; line++) {
            const element = this.#Lines[line];
            let pos = - 2 + (line + 1) * (this.FontTaille + 2)
            Context.fillText(element, offx, offy + pos);
        }
    }
}