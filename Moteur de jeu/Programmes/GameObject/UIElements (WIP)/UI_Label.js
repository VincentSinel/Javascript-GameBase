class UI_Label extends UIElement
{
    #Texte
    #MaxW
    #TotalH;
    /**
     * Créer un TextBlock pour interface utilisateur. C'est un block de texte.
     * Utiliser Slider.ModifierTexte(Texte) pour modifier le contenue (effectue un rafraichissement du découpage).
     * @param {Number} X Position X relative à l'objet parent
     * @param {Number} Y Position Y relative à l'objet parent
     * @param {Number} Z Position Z relative à l'objet parent
     * @param {Number} W Largeur du TextBlock
     * @param {Number} H Hauteur du TextBlock
     * @param {Number} Texte Texte à afficher, les lignes sont automatiquement découper selon la largeur de l'objet
     * @param {UIElement} Parent Objet Parent (facultatif)
     */
     constructor(X,Y,Z,W,H, Texte, Parent = undefined)
     {
        super(X,Y,Z,W,H, Parent)

        this.#MaxW = W;
        this.#TotalH = 0;
        this.Lines = [];
        this.Texte = Texte;
     }

     get MaxW()
     {
        return this.#MaxW
     }
     set MaxW(v)
     {
        this.#MaxW = v;
        this.CalculateTexteSize();
        this.RefreshUI();
     }
     get TotalH()
     {
         return this.#TotalH;
     }

     get Texte()
     {
        return this.#Texte;
     }
     set Texte(v)
     {
        this.#Texte = v;
        this.CalculateTexteSize();
        this.RefreshUI();
     }

    CalculateTexteSize()
    {
        this.Backctx.font = this.FontTaille + "px " + this.Font;
        //MaxW = MaxW - 16;
        if (this.Backctx.measureText(this.#Texte).width > this.MaxW)
        {
            let line = [];
            let actualline = "";
            let mots = this.#Texte.split(" ");
    
            for (let m = 0; m < mots.length; m++) {
                let mot = mots[m];
                
                if (actualline != "")
                {
                    if (this.Backctx.measureText(actualline + " " + mot).width > this.MaxW)
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
                    if (this.Backctx.measureText(mot).width > this.MaxW)
                    {
                        actualline = mot[0]
                        for (let l = 1; l < mot.length; l++) 
                        {
                            let lettre = mot[l];
                            if (this.Backctx.measureText(actualline + lettre).width > this.MaxW)
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
        this.#TotalH = (this.FontTaille + 2) * this.Lines.length + 2;
        if(this.VerticalAlignement == VerticalAlignementType.Etendu &&
            this.H != this.#TotalH)
        {
            this.H = this.#TotalH;
        }
    }
     
    DessinBackUI(Context)
    {
        Context.fillStyle = this.FontCouleur.RGBA();
        Context.font = this.FontTaille + "px " + this.Font;

        Context.textAlign = this.HorizontalAlignement.Value;

        let offx = 0;
        if(this.HorizontalAlignement == HorizontalAlignementType.Etendu ||
           this.HorizontalAlignement == HorizontalAlignementType.Centre)
        {
            offx = this.W / 2;
        }
        if(this.HorizontalAlignement == HorizontalAlignementType.Droite )
        {
            offx = this.W;
        }
        
        let offy = 0;
        if(this.VerticalAlignement == VerticalAlignementType.Etendu ||
           this.VerticalAlignement == VerticalAlignementType.Centre)
        {
            offy = (this.H - this.#TotalH)/ 2;
        }



        for (let line = 0; line < this.Lines.length; line++) {
            const element = this.Lines[line];
            let pos = - 2 + (line + 1) * (this.FontTaille + 2)
            if (pos < this.H)
            {
                Context.fillText(element, offx, offy + pos);
            }
        }
    }
}