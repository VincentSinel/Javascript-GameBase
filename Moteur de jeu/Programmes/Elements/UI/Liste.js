class Liste extends UIElement
{
    static ScrollW = 15;

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
         this.Elements = [];
         this.ScrollPosition = 0;
         this.ScrollBar = false;
         this.Selection = -1;
         this.SelectionHover = -1;
         this.HTotal = 0;
         this.scrollsouris  = false;
         this.SourisCapture = true;
     }

     AjoutElement(Element)
     {
         if (typeof Element === 'string' || Element instanceof String)
         {
            let text = new TextBlock(0,0,this.W - 6, this.FontTaille + 4, Element);
            let o = new ListeElement(this.W - 6, this.FontTaille + 4, text, this)
            this.Elements.push(o)
         }
         else
         {
            let o = new ListeElement(Element.W, Element.H, Element, this)
            this.Elements.push(o)
         }
     }
 

 
     Calcul(Delta)
     {
         super.Calcul(Delta);
 
        if (this.Actif && this.IsTop)
        {
            this.Couleur = this.BaseCouleur
            
            this.HTotal = 0;
            for (let e = 0; e < this.Elements.length; e++) {
                this.HTotal += this.Elements[e].H;
            }

            if (this.HTotal > this.H - 6)
            {
                this.ScrollBar = true;
            }

            this.ScrollPosition -= Souris.Scroll * 30 * Delta;

            if (this.ScrollBar && Souris.CX >= this.GX(true) + this.W - 3 - Liste.ScrollW)
            {
                if (Souris.CX <= this.GX(true) + this.W - 3 && Souris.CY >= this.GY(true) + 3 && Souris.CY <= this.GY(true) + this.H - 3)
                {
                    if (Souris.BoutonJustClic(0))
                    {
                        this.MouseClic = Souris.CY;
                        if (Souris.CY < this.GY(true) + this.ScrollPosition / this.HTotal * (this.H - 6))
                        {
                            this.ScrollPosition = (Souris.CY - this.GY(true)) / (this.H - 6) * this.HTotal
                        }
                        if (Souris.CY > this.GY(true) + (this.ScrollPosition + this.H - 6) / this.HTotal * (this.H - 6))
                        {
                            this.ScrollPosition = (Souris.CY - this.GY(true)) / (this.H - 6) * this.HTotal - this.H + 6
                        }
                        this.OldScrollPos = this.ScrollPosition;
                    }
                    if (Souris.BoutonClic(0))
                    {
                        this.ScrollPosition = this.OldScrollPos - (this.MouseClic - Souris.CY) / (this.H-6) * this.HTotal
                        this.scrollsouris  = true;
                    }
                }
            }
            else if (Souris.BoutonClic(0) && this.scrollsouris == true)
            {
                this.ScrollPosition = this.OldScrollPos - (this.MouseClic - Souris.CY) / (this.H-6) * this.HTotal
                this.scrollsouris  = true;
            }
            else
            {
                this.scrollsouris = false;
                let y = (Souris.CY - this.CY() - 3)
                let x = (Souris.CX - this.CX() - 3)
                if (x > 0 && x < this.W - 6)
                {
                    if (y > 0 && y < this.H - 6)
                    {
                        y += this.ScrollPosition;
                        let pos = 0;
                        for (let e = 0; e < this.Elements.length; e++) 
                        {
                        const element = this.Elements[e];
                            if (y > pos && y < pos + element.H)
                            {
                                this.SelectionHover = e;
                                break;
                            }
                            pos += element.H
                        }
                    }
                }
    
                if (Souris.BoutonJustDeclic(0))
                {
                    this.Selection = this.SelectionHover
                }
            }

            
            this.ScrollPosition = Math.max(0,Math.min(this.HTotal - this.H + 6, this.ScrollPosition));
        }
        else
        {
            this.Couleur = this.InactifCouleur
        }

         
     }
 
     Dessin(Context)
     {
         this.DessinerPanneau(Context)
         this.DessinerContenue(Context)
         if (this.ScrollBar)
            this.DessinerScrollBar(Context)
     }

     DessinerScrollBar(Context)
     {
        let Contour = this.Couleur.RGBA2(46)//Color.CouleurByte(97,62,24,1);

        Context.save();
        Context.fillStyle = Color.Couleur(0,0,0,0.2)
        Context.strokeStyle = Color.Couleur(0,0,0,0.2)
        this.roundRect(Context, this.GX() + this.W - 3 - Liste.ScrollW, this.GY() + 3, Liste.ScrollW, this.H - 6, 2, true, true)

        let y = this.GY() + 3 + this.ScrollPosition / this.HTotal * (this.H - 6)
        let h = (this.H - 6) * (this.H - 6) / this.HTotal
        Context.fillStyle = this.Couleur.RGBA()
        Context.strokeStyle = Contour

        this.roundRect(Context, this.GX() + this.W - 3 - Liste.ScrollW, y, Liste.ScrollW, h, 2, true, true)

        Context.shadowOffsetY = 0;
        Context.shadowBlur = 0;
        Context.lineWidth = 1;
        Context.restore();
     }

     DessinerContenue(Context)
     {
         
        // Applique une teinte au lutin
        let imageCtx = document.createElement("canvas").getContext("2d"); // Création d'un canvas temporaire
        imageCtx.canvas.width = this.W - 6; // Modification taille
        imageCtx.canvas.height = this.HTotal; // Modification taille

        let y = 0;
        for (let e = 0; e < this.Elements.length; e++) {
            const element = this.Elements[e];
            if (this.Selection == e)
            {
                imageCtx.fillStyle = this.SelectionCouleur.RGBA()
                imageCtx.fillRect(0, y, this.W - 6, element.H);
            }
            if (e % 2 == 0)
            {
                imageCtx.fillStyle = Color.Couleur(1,1,1,0.1)
                imageCtx.fillRect(0, y, this.W - 6, element.H);
            }
            if (e == this.SelectionHover)
            {
                imageCtx.fillStyle = Color.Couleur(0,0,1,0.1)
                imageCtx.fillRect(0, y, this.W - 6, element.H);
            }
            element.Dessin(imageCtx, y)
            y += element.H;
        }
        //imageCtx.drawImage(can ,0,0); // Dessin de l'image sur le canvas temporaire
        Context.drawImage(imageCtx.canvas,0, this.ScrollPosition, this.W - 6, this.H - 6, 
            this.CX() + 3, this.CY() + 3, this.W - 6, this.H - 6); // Dessin du canvas temporaire dans le canvas original
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

class ListeElement extends UIElement
{
    constructor(W,H, Element, Parent)
    {
        super(-3,-3,W + 3,H + 3, Parent)

        this.Contenue = Element;
        Element.AssignerParent(this);

    }

    /**
     * Calcul la position X de cette objet vis à vis de son parent
     * @returns Position X relative au parent
     */
     GX(souris = false)
     {
         if (souris)
         {
            return this.X + this.Parent.CX();
         }
         else
         {
            return this.X;
         }
     }
 
     /**
      * Calcul la position Y de cette objet vis à vis de son parent
      * @returns Position Y relative au parent
      */
     GY(souris = false)
     {
        if (souris)
        {
           return this.Y + this.Parent.CY() - this.Parent.ScrollPosition;
        }
        else
        {
           return this.Y;
        }
     }

    Dessin(Context, offy)
    {
        this.Y = offy - 3
        super.Dessin(Context)
    }
        
}