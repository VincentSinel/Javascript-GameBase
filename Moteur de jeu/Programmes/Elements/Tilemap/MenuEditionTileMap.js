class MenuEditionTileMap extends Panneau
{
    static Instance;
    static ScrollW = 15;

    constructor(Tilemap, Taille = 100)
    {
        super(0,0, 8 * Tilemap.TailleTile + 6, Ecran_Hauteur);
        this.T = [Tilemap];
        this.SelectionTilemap = 0;
        this.TileMapSelectZoneH = 0;

        this.index = 0;
        this.ScrollPosition = 0;
        this.scrollsouris = false;
        this.ScrollBar = false;
        if ((Tilemap.TilesLength + 1) > 8*(Ecran_Hauteur - 6) / Tilemap.TailleTile)
        {
            this.ScrollBar  = true;
            this.W += MenuEditionTileMap.ScrollW;
        }
        this.HTotal = Math.ceil((Tilemap.TilesLength) / 8) * Tilemap.TailleTile;
        this.Selection = undefined;
        this.SelectionDragZone = [[]];
        this.SelectionHoverListe = [];
        MenuEditionTileMap.Instance = this;
    }

    AjoutTilemap(Tilemap)
    {
        this.T.push(Tilemap);
        this.TileMapSelectZoneH = this.T.length * 12 + 6;
        this.H = Ecran_Hauteur - this.TileMapSelectZoneH;
    }

    Sauvegarder()
    {
        let name =  prompt("Donner un nom à ce tilemap.\nAttention ce nom doit être unique, si un tilemap du même nom existe, il sera supprimé.\nLe fichier téléchargé ne doit lui pas changer de nom est vient remplacer celui présent dans le dossier Fichier du site Web", "Maison1");
        for (let i = 0; i < this.T.length; i++) {
            this.T[i].Sauvegarder(name + "_" + i)
        }
    }

    Calcul(Delta)
    {
        super.Calcul(Delta)

        if (Clavier.ToucheJusteBasse("p"))
        {
            this.Sauvegarder();
        }

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
                        this.ScrollPosition = (Souris.CY - this.GY(true)) / (this.H - 6) * this.HTotal;
                    }
                    if (Souris.CY > this.GY(true) + (this.ScrollPosition + this.H - 6) / this.HTotal * (this.H - 6))
                    {
                        this.ScrollPosition = (Souris.CY - this.GY(true)) / (this.H - 6) * this.HTotal - this.H + 6;
                    }
                    this.OldScrollPos = this.ScrollPosition;
                    this.scrollsouris  = true;
                }
                if (Souris.BoutonClic(0) && this.scrollsouris)
                {
                    this.ScrollPosition = this.OldScrollPos - (this.MouseClic - Souris.CY) / (this.H-6) * this.HTotal;
                    this.scrollsouris  = true;
                }
            }
        }
        else if(Souris.CX < this.GX(true) + this.W &&Souris.CY <= this.GY(true) + this.H - 3 )
        {
            if (Souris.BoutonClic(0) && this.scrollsouris == true)
            {
                this.ScrollPosition = this.OldScrollPos - (this.MouseClic - Souris.CY) / (this.H-6) * this.HTotal;
                this.scrollsouris  = true;
            }
            else
            {
                this.scrollsouris = false;
                let y = (Souris.CY - this.CY() - 3);
                let x = (Souris.CX - this.CX() - 3);
                if (x > 0 && x < this.W - 6 - MenuEditionTileMap.ScrollW && !this.SelectionDrag)
                {
                    if (y > 0 && y < this.H - 6)
                    {
                        y += this.ScrollPosition;
                        this.SelectionHover = [[
                            Math.floor(x / this.T[this.SelectionTilemap].TailleTile) + 
                            Math.floor(y / this.T[this.SelectionTilemap].TailleTile) * 8]];
                        this.SelectionHoverListe = this.SelectionHover[0];
                    }
                }

                if (Souris.BoutonJustClic(0))
                {
                    x = Math.floor(x / this.T[this.SelectionTilemap].TailleTile);
                    y = Math.floor(y / this.T[this.SelectionTilemap].TailleTile);
                    this.SelectionDrag = true;
                    this.SelectionDragStart = [x,y];
                }
                else if (Souris.BoutonClic(0) && this.SelectionDrag)
                {
                    y += this.ScrollPosition;
                    x = Math.floor(x / this.T[this.SelectionTilemap].TailleTile);
                    y = Math.floor(y / this.T[this.SelectionTilemap].TailleTile);
                    let a = Math.min(this.SelectionDragStart[0], x);
                    let b = Math.min(this.SelectionDragStart[1], y);
                    let c = Math.abs(this.SelectionDragStart[0] - x) + 1;
                    let d = Math.abs(this.SelectionDragStart[1] - y) + 1;
                    this.PositionPreview = [a,b + 1];
                    this.SelectionHover = [];
                    this.SelectionHoverListe = [];
                    for(let j = 0; j < d; j++)
                    {
                        this.SelectionHover.push([]);
                        for(let i = 0; i < c; i++)
                        {
                            let id = (a + i) + (b + j) * 8;
                            this.SelectionHover[j].push(id);
                            if (!this.SelectionHoverListe.includes(id))
                                this.SelectionHoverListe.push(id);
                        }
                    }
                }
                else if (Souris.BoutonJustDeclic(0))
                {
                    this.T[this.SelectionTilemap].Edit_SelectedTile = this.SelectionHover;
                    this.SelectionDrag = false;
                }
                else if (this.SelectionDrag)
                {
                    this.DragSelect = false;
                    this.Edit_SelectedTile = [[-1]];
                    this.SelectionHoverListe = [];
                }
            }
        }
        else if(Souris.CX < this.GX(true) + this.W && Souris.CY > this.GY(true) + this.H )
        {
            if (Souris.BoutonClic(0))
            {
                this.T[this.SelectionTilemap].Edit = false;
                this.SelectionTilemap = Math.min(Math.floor((Souris.CY  - this.H) / 12), this.T.length - 1);
                this.T[this.SelectionTilemap].Edit = true;
                this.ScrollPosition = 0;
                if ((this.T[this.SelectionTilemap].TilesLength + 1) > 8*(Ecran_Hauteur - 6) / this.T[this.SelectionTilemap].TailleTile)
                {
                    this.ScrollBar  = true;
                    this.W = 8 * this.T[this.SelectionTilemap].TailleTile + 6 + MenuEditionTileMap.ScrollW;
                }
                else
                {
                    this.ScrollBar  = false;
                    this.W = 8 * this.T[this.SelectionTilemap].TailleTile + 6;
                }
                this.HTotal = Math.ceil((this.T[this.SelectionTilemap].TilesLength) / 8) * this.T[this.SelectionTilemap].TailleTile;
            }
        }

        this.Selection = [];
        for(let j = 0; j < this.T[this.SelectionTilemap].Edit_SelectedTile.length; j++)
        {
            for(let i = 0; i < this.T[this.SelectionTilemap].Edit_SelectedTile[j].length; i++)
            {
                let id = this.T[this.SelectionTilemap].Edit_SelectedTile[j][i];
                if (!this.Selection.includes(id))
                    this.Selection.push(id);
            }
        }
            
        this.ScrollPosition = Math.max(0, Math.min(this.HTotal - this.H + 6, this.ScrollPosition));
    }

    Dessin(Context)
    {
        super.Dessin(Context);

        this.DessinerContenue(Context);
        if (this.ScrollBar)
           this.DessinerScrollBar(Context);
        this.DessinerPanneauListeTilemap(Context);
        this.DessinerListeTileMap(Context);
    }

    DessinerListeTileMap(Context)
    {
        for (let t = 0; t < this.T.length; t++) 
        {
            if (t == this.SelectionTilemap)
            {
                Context.strokeStyle = Color.Couleur(0.2,0.7,1,1);
                Context.fillStyle = Color.Couleur(0.2,0.7,1,0.2);
                Context.fillRect(4, this.H + 3 + t * 12, this.W - 8, 12);
                Context.strokeRect(4, this.H + 3 + t * 12, this.W - 8, 12);
            }
            Context.fillStyle = "White";
            Context.textAlign = "left";
            Context.font = "12px Arial";
            Context.fillText("Tilemap " + t, 3, this.H + 1 + (t + 1) * 12);
        }
    }

    DessinerPanneauListeTilemap(Context)
    {
        let Contour = this.Couleur.RGBA2(46)//Color.CouleurByte(97,62,24,1);
        let Fond2 = this.Couleur.RGBA()//Color.CouleurByte(229,177,77,1);
        let Fond1 = this.Couleur.RGBA2(120)//Color.CouleurByte(226,163,42,1);


        var grd = ctx.createLinearGradient(0, 0, 0, this.TileMapSelectZoneH);
        grd.addColorStop(0, Fond1);
        grd.addColorStop(1, Fond2);

        Context.save();
        Context.strokeStyle = Contour
        Context.fillStyle = grd
        Context.lineWidth = 3;
        Context.shadowOffsetY = 5;
        Context.shadowBlur = 10;
        Context.shadowColor = "black";
        this.roundRect(Context, this.GX() + 1.5, this.GY() + 1.5 + this.H, this.W - 3, this.TileMapSelectZoneH - 3, 2, true, true)
        
        Context.shadowOffsetY = 0;
        Context.shadowBlur = 0;
        Context.lineWidth = 1;
        Context.restore();
    }

    DessinerScrollBar(Context)
     {
        let Contour = this.Couleur.RGBA2(46);//Color.CouleurByte(97,62,24,1);

        Context.save();
        Context.fillStyle = Color.Couleur(0,0,0,0.2);
        Context.strokeStyle = Color.Couleur(0,0,0,0.2);
        this.roundRect(Context, this.GX() + this.W - 3 - MenuEditionTileMap.ScrollW, this.GY() + 3, MenuEditionTileMap.ScrollW, this.H - 6, 2, true, true);

        let y = this.GY() + 3 + this.ScrollPosition / this.HTotal * (this.H - 6);
        let h = (this.H - 6) * (this.H - 6) / this.HTotal;
        Context.fillStyle = this.Couleur.RGBA();
        Context.strokeStyle = Contour;

        this.roundRect(Context, this.GX() + this.W - 3 - MenuEditionTileMap.ScrollW, y, MenuEditionTileMap.ScrollW, h, 2, true, true);

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


        let taille = this.T[this.SelectionTilemap].TailleTile

        for (let e = 0; e <= this.T[this.SelectionTilemap].TilesLength; e++) {
            const element = this.T[this.SelectionTilemap].TileDepuisIndex(e);
            let x = (e % 8) * taille;
            let y = Math.floor(e / 8) * taille;
            element.Dessin(imageCtx, x, y, e);
            if (this.SelectionHoverListe.includes(e))
            {
                imageCtx.fillStyle = Color.Couleur(0,0,1,0.1);
                imageCtx.fillRect(x, y, taille, taille);
            }
            if (this.Selection.includes(e))
            {
                imageCtx.fillStyle = Color.Couleur(0.2,0.7,1,0.2);
                imageCtx.strokeStyle = Color.Couleur(0.2,0.7,1,1);
                imageCtx.fillRect(x, y, taille, taille);
                imageCtx.strokeRect(x, y, taille, taille);
            }
        }
        //imageCtx.drawImage(can ,0,0); // Dessin de l'image sur le canvas temporaire
        Context.drawImage(imageCtx.canvas,0, this.ScrollPosition, this.W - 6, this.H - 6, 
            this.CX() + 3, this.CY() + 3, this.W - 6, this.H - 6); // Dessin du canvas temporaire dans le canvas original
     }
}