class MenuEditionTileMap extends Panneau
{
    static ScrollW = 15;

    constructor(Tilemap, Taille = 100)
    {
        super(0,0, 8 * Tilemap.TailleTile + 6, Ecran_Hauteur)
        this.T = Tilemap;

        this.index = 0;
        this.ScrollPosition = 0;
        this.scrollsouris = false;
        this.ScrollBar = false;
        if ((Tilemap.TilesLength + 1) > 8*(Ecran_Hauteur - 6) / Tilemap.TailleTile)
        {
            this.ScrollBar  = true;
            this.W += MenuEditionTileMap.ScrollW
        }
        this.HTotal = Math.ceil((Tilemap.TilesLength + 1) / 8) * Tilemap.TailleTile;
        this.Selection = undefined;
        this.SelectionDragZone = [[]];
        this.SelectionHoverListe = [];
    }

    Calcul(Delta)
    {
        super.Calcul(Delta)

        this.ScrollPosition -= Souris.Scroll * 30 * Delta;

        if (this.ScrollBar && Souris.CX >= this.GX(true) + this.W - 3 - MenuEditionTileMap.ScrollW)
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
                    this.scrollsouris  = true;
                }
                if (Souris.BoutonClic(0) && this.scrollsouris)
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
            if (x > 0 && x < this.W - 6 - MenuEditionTileMap.ScrollW && !this.SelectionDrag)
            {
                if (y > 0 && y < this.H - 6)
                {
                    y += this.ScrollPosition;
                    this.SelectionHover = [[-1 + Math.floor(x / this.T.TailleTile) + Math.floor(y / this.T.TailleTile) * 8]];
                    this.SelectionHoverListe = this.SelectionHover[0];
                }
            }

            if (Souris.BoutonJustClic(0))
            {
                x = Math.floor(x / this.T.TailleTile)
                y = Math.floor(y / this.T.TailleTile)
                this.SelectionDrag = true;
                this.SelectionDragStart = [x,y];
            }
            else if (Souris.BoutonClic(0) && this.SelectionDrag)
            {
                y += this.ScrollPosition;
                x = Math.floor(x / this.T.TailleTile)
                y = Math.floor(y / this.T.TailleTile)
                let a = Math.min(this.SelectionDragStart[0], x)
                let b = Math.min(this.SelectionDragStart[1], y)
                let c = Math.abs(this.SelectionDragStart[0] - x) + 1
                let d = Math.abs(this.SelectionDragStart[1] - y) + 1
                this.PositionPreview = [a,b + 1];
                this.SelectionHover = [];
                this.SelectionHoverListe = [];
                for(let j = 0; j < d; j++)
                {
                    this.SelectionHover.push([]);
                    for(let i = 0; i < c; i++)
                    {
                        let id = -1 + (a + i) + (b + j) * 8
                        this.SelectionHover[j].push(id);
                        if (!this.SelectionHoverListe.includes(id))
                            this.SelectionHoverListe.push(id);
                    }
                }
            }
            else if (Souris.BoutonJustDeclic(0))
            {
                this.T.Edit_SelectedTile = this.SelectionHover;
                this.SelectionDrag = false;
            }
            else if (this.SelectionDrag)
            {
                this.DragSelect = false;
                this.Edit_SelectedTile = [[-1]];
                this.SelectionHoverListe = [];
            }
        }

        this.Selection = [];
        for(let j = 0; j < this.T.Edit_SelectedTile.length; j++)
        {
            for(let i = 0; i < this.T.Edit_SelectedTile[j].length; i++)
            {
                let id = this.T.Edit_SelectedTile[j][i];
                if (!this.Selection.includes(id))
                this.Selection.push(id);
            }
        }
            
        this.ScrollPosition = Math.max(0,Math.min(this.HTotal - this.H + 6, this.ScrollPosition));
    }

    Dessin(Context)
    {
        super.Dessin(Context)

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
        this.roundRect(Context, this.GX() + this.W - 3 - MenuEditionTileMap.ScrollW, this.GY() + 3, MenuEditionTileMap.ScrollW, this.H - 6, 2, true, true)

        let y = this.GY() + 3 + this.ScrollPosition / this.HTotal * (this.H - 6)
        let h = (this.H - 6) * (this.H - 6) / this.HTotal
        Context.fillStyle = this.Couleur.RGBA()
        Context.strokeStyle = Contour

        this.roundRect(Context, this.GX() + this.W - 3 - MenuEditionTileMap.ScrollW, y, MenuEditionTileMap.ScrollW, h, 2, true, true)

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



        for (let e = 0; e <= this.T.TilesLength; e++) {
            const element = this.T.TileDepuisIndex((e-1));
            let x = (e % 8) * this.T.TailleTile;
            let y = Math.floor(e / 8) * this.T.TailleTile
            if (e > 0)
                element.Dessin(imageCtx, x, y, (e-1));
            else
            {
                imageCtx.fillStyle = "Black"
                imageCtx.fillRect(x,y,this.T.TailleTile,this.T.TailleTile)
                imageCtx.fillStyle = "White"
                imageCtx.textAlign = "center";
                imageCtx.font = "12px Arial";
                imageCtx.fillText("Vide", x + this.T.TailleTile / 2,y + this.T.TailleTile / 2 + 5)
            }
            if (this.SelectionHoverListe.includes(e-1))
            {
                imageCtx.fillStyle = Color.Couleur(0,0,1,0.1)
                imageCtx.fillRect(x, y, this.T.TailleTile, this.T.TailleTile);
            }
            if (this.Selection.includes(e-1))
            {
                imageCtx.fillStyle = Color.Couleur(0.2,0.7,1,0.2)
                imageCtx.strokeStyle = Color.Couleur(0.2,0.7,1,1)
                imageCtx.fillRect(x, y, this.T.TailleTile, this.T.TailleTile);
                imageCtx.strokeRect(x, y, this.T.TailleTile, this.T.TailleTile);
            }
        }
        //imageCtx.drawImage(can ,0,0); // Dessin de l'image sur le canvas temporaire
        Context.drawImage(imageCtx.canvas,0, this.ScrollPosition, this.W - 6, this.H - 6, 
            this.CX() + 3, this.CY() + 3, this.W - 6, this.H - 6); // Dessin du canvas temporaire dans le canvas original
     }
}