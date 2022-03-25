class TileMap
{
    #LastCanvas
    #LastRectangle

    static SauvegardeVersion = "1.0"
    /**
     * Création d'un lutin manipulable avec des fonction simple
     * Utiliser TileMap.Edition() activer l'édition du tilemap
     * Utiliser TileMap.Sauvegarder() pour sauvegarder le contenue du tilemap en un fichier .json
     * Utiliser TileMap.Charger() pour charger le contenue depuis la base de donnée
     * @param {number} X Position X du lutin
     * @param {number} Y Position Y du lutin
     * @param {Array<Tile>} Tiles Liste des tiles composant notre tilemap
     */
    constructor(X,Y, W, H, Tiles)
    {
        this.X = X;
        this.Y = Y;
        this.Z = 0;
        this.W = W;
        this.H = H;
        this.Zoom = 100;
        this.Tiles = Tiles;
        this.TailleTile = 32;
        this.TilesLength = 0;
        this.TilesNumber = [];
        let j = 0;
        this.Tiles.forEach(tile => {
            tile.SetTileMap(this);
        });
        this.Visible = true;
        this.Time = 0;

        this.Contenue = [];
        for (let y = 0; y < H; y++) 
        {     
            for (let x = 0; x < W; x++) 
            {       
                this.Contenue.push(0)//x % this.Tiles.length);
            }
        }

        this.Edit = false
        this.Teinte = new Color(0,0,0,0);
        this.RectDraw = [0,0,this.W, this.H]

        this.Edit_SelectedTile = [[-1]];
        this.RecalculTileLength();

        this.#LastCanvas = undefined;
        this.#LastRectangle = undefined;
    }

    /**
     * Lance l'édition du TileMap
     */
    Edition()
    {
        this.Edit = true;
        this.EditUI = new MenuEditionTileMap(this);
    }

    /**
     * Recalcul le nombre de Tile total
     */
    RecalculTileLength()
    {
        this.TilesLength = 0;
        this.TilesNumber = [];
        let j = 0;
        this.Tiles.forEach(tile => {
            tile.OffSet = this.TilesLength;
            this.TilesLength += tile.Nombre;
            for (let i = 0; i < tile.Nombre; i++) 
            {     
                this.TilesNumber.push(j);  
            }
            j++;
        });
        this.#LastRectangle = undefined;
    }

    /**
     * Récupère un tile à partir d'un ID de texture
     * @param {int} id ID de la texture à choisir
     * @returns Tile contenant la texture avec l'id choisi
     */
    TileDepuisIndex(id)
    {
        if (id < 0 || id >= this.TilesNumber.length )
            return this.Tiles[0];
        return this.Tiles[this.TilesNumber[id]];
    }

    /**
     * Charge le contenue de la base de donnée pour définir le tilemap
     * @param {String} Nom Nom du Tilemap
     */
    Charger(Nom)
    {
        let data = Datas.DataTileMap(Nom)
        if (data)
        {
            this.#Charge(data)
        }
    }

    #Charge(data)
    {
        this.W = data.Largeur;
        this.H = data.Hauteur;
        let v = data.Version;
        if (v == undefined)
        {
            let datas = data.Data.split(",");
            this.Contenue = [];
            datas.forEach(s => {
                this.Contenue.push(parseInt(s))
            });
        }
        else if (v == "1.0")
        {
            let datas = data.Data.split(",");
            this.Contenue = [];
            datas.forEach(s => {
                if (s.includes("x"))
                {
                    let x = s.split("x");
                    let l = parseInt(x[0]);
                    let v = parseInt(x[1]);
                    for (let i = 0; i < l; i++) 
                    {
                        this.Contenue.push(v)             
                    }
                }
                else
                {
                    this.Contenue.push(parseInt(s)) 
                }
                
            });
        }
    }

    /**
     * Sauvegarde le contenue du Tilemap en un fichier .json
     */
    Sauvegarder()
    {
        let data = this.#EncodeData();

        Datas.AjoutTilemapData(prompt("Donner un nom à ce tilemap.\nAttention ce nom doit être unique, si un tilemap du même nom existe, il sera supprimé.\nLe fichier téléchargé ne doit lui pas changer de nom est vient remplacer celui présent dans le dossier Fichier du site Web", "Maison1"), this.W, this.H, data, TileMap.SauvegardeVersion)
        Datas.SauvegarderData();
    }

    #EncodeData()
    {
        let l = 1;
        let v = this.Contenue[0];
        let data = ""
        for(let i = 1; i < this.Contenue.length; i++)
        {
            if (this.Contenue[i] == v)
                l+= 1;
            else
            {
                if (l == 1)
                    data += v.toString() + ",";
                else
                    data += l.toString() + "x" + v.toString() + ",";
                l = 1;
                v = this.Contenue[i];
            }
        }
        if (l == 1)
            data += v.toString();
        else
            data += l.toString() + "x" + v.toString();
        return data;
    }

    /**
     * Test si un contact est présent entre un lutin non tourné et le tilemap;
     * @param {Lutin} Lutin Lutin a tester
     * @returns Boolean représentant si il y a contact ou non
     */
    Contact_AABB(Lutin)
    {
        let dec = 2; // Cette valeur est arbitraire, le contact se fait en découpant le rectangle du lutin en 9 point de test.
        let ar = Lutin.RectangleWH();
        let dx = Math.floor(ar[1] / this.TailleTile * dec);
        let dy = Math.floor(ar[2] / this.TailleTile * dec);
        for (let x = 0; x <= dx; x++) {
            for (let y = 0; y <= dy; y++) {
                let ox = Math.min(ar[0].X + x * ar[1] / dx, ar[0].X + ar[1]);
                let oy = Math.max(ar[0].Y - y * ar[2] / dy, ar[0].Y - ar[2]);
                // Montre le découpage du lutin
                //Debug.AjoutVecteur(new Vecteur2(Camera.AdapteX(ox),Camera.AdapteY(oy)), new Vecteur2(0,0))
                let t = this.PositionIndex(ox, oy);
                if (t.X >= 0 && t.X < this.W)
                {
                    if (t.Y >= 0 && t.Y < this.H)
                    {
                        let id = this.Contenue[t.X + t.Y * this.W];
                        if (id == -1 || this.TileDepuisIndex(id).Contact)
                        {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }


    /**
     * Convertie une position sur la camera en une position sur le tilemap.
     * @param {float} X Position X sur la camera
     * @param {float} Y Position Y sur la camera
     * @returns Vecteur2 représentant la position en tille sur le tilemap
     */
    PositionIndex(X,Y)
    {
        let x = Math.floor((X - this.X) / this.TailleTile);
        let y = Math.floor((Y - this.Y) / this.TailleTile);
        return new Vecteur2(x, y);
    }

    /**
     * Remplace un des tiles du tilemap 
     * @param {int} X Position X sur le tilemap
     * @param {int} Y Position Y sur le tilemap
     * @param {int} Tile ID de la nouvelle texture
     */
    ChangerTile(X,Y,Tile)
    {
        this.Contenue[X + Y * this.W]
    }

    /**
     * Permet de montrer le tilemap
     */
    Montrer()
    {
        this.Visible = true;
    }

    /**
     * Permet de cacher le tilemap
     */
    Cacher()
    {
        this.Visible = false;
    }

    /**
     * Lance les calculs lié au tilemap
     * @param {float} Delta Nombre de frame depuis la dernière mise à jour.
     */
    Calcul(Delta)
    {
        this.Time += Delta;

        if (this.Edit)
        {
            if (Clavier.ToucheJusteBasse("p"))
            {
                this.Sauvegarder();
            }

            if (Souris.BoutonClic(0) && Souris.CX > this.EditUI.W)
            {
                let x = Math.floor((Souris.X - this.X) / this.TailleTile);
                let y = Math.floor((Souris.Y - this.Y) / this.TailleTile);
                if (x >= 0 && y >= 0 && x < this.W && y < this.H)
                {
                    for(let j = 0; j < this.Edit_SelectedTile.length; j++)
                    {
                        for(let i = 0; i< this.Edit_SelectedTile[j].length; i++)
                        {
                            if (x + i < this.W && y - j >= 0 && this.Edit_SelectedTile[j][i] > -2)
                                this.Contenue[x + i + (y - j) * this.W] = this.Edit_SelectedTile[j][i];
                        }
                    }
                    this.#LastRectangle = undefined;
                }
            }
            
            let sx = Math.floor((Souris.X - this.X) / this.TailleTile);
            let sy = Math.floor((Souris.Y - this.Y) / this.TailleTile + 1 );
            this.PositionPreview = [sx,sy]


            if(Souris.BoutonJustClic(2))
            {
                let x = Math.floor((Souris.X - this.X) / this.TailleTile);
                let y = Math.floor((Souris.Y - this.Y) / this.TailleTile);
                if (x >= 0 && y >= 0 && x < this.W && y < this.H)
                {
                    this.DragSelect = true;
                    this.DragStart = [x,y];
                    this.Edit_SelectedTile = [[-2]];
                }
            }
            else if (Souris.BoutonClic(2) && this.DragSelect && Souris.CX > this.EditUI.W)
            {
                let x = Math.min(this.W - 1,Math.max(0, Math.floor((Souris.X - this.X) / this.TailleTile)));
                let y = Math.min(this.H - 1,Math.max(0, Math.floor((Souris.Y - this.Y) / this.TailleTile)));
                let a = Math.min(this.DragStart[0], x)
                let b = Math.max(this.DragStart[1], y)
                let c = Math.abs(this.DragStart[0] - x) + 1
                let d = Math.abs(this.DragStart[1] - y) + 1
                this.PositionPreview = [a,b + 1];
                this.Edit_SelectedTile = [];
                for(let j = 0; j < d; j++)
                {
                    this.Edit_SelectedTile.push([]);
                    for(let i = 0; i < c; i++)
                    {
                        this.Edit_SelectedTile[j].push(-2);
                    }
                }
            }
            else if (Souris.BoutonJustDeclic(2) && this.DragSelect && Souris.CX > this.EditUI.W)
            {
                let x = Math.min(this.W - 1,Math.max(0, Math.floor((Souris.X - this.X) / this.TailleTile)));
                let y = Math.min(this.H - 1,Math.max(0, Math.floor((Souris.Y - this.Y) / this.TailleTile)));

                let a = Math.min(this.DragStart[0], x)
                let b = Math.max(this.DragStart[1], y)
                let c = Math.abs(this.DragStart[0] - x) + 1
                let d = Math.abs(this.DragStart[1] - y) + 1
                this.Edit_SelectedTile = [];
                for(let j = 0; j < d; j++)
                {
                    this.Edit_SelectedTile.push([]);
                    for(let i = 0; i < c; i++)
                    {
                        this.Edit_SelectedTile[j].push(this.Contenue[a + i + (b - j) * this.W]);
                    }
                }
                this.DragSelect = false;
            }
            else if (this.DragSelect)
            {
                this.DragSelect = false;
                this.Edit_SelectedTile = [[-1]];

            }

        }

        // Calcul de la partie visible pour limiter le cout en ressource lors de la phase dessin.
        let dx = Math.floor((Camera.X - this.X) / this.TailleTile + 0.5)
        let dy = Math.floor((Camera.Y - this.Y) / this.TailleTile + 0.5)
        let size = Math.max(5,Math.floor((Diagonal / (this.TailleTile * 2) + Math.sqrt(2)) * 100 / Camera.Zoom + 1));
        this.RectDraw = [dx - size, dy - size, dx + size, dy + size, size]

        for (let t = 0; t < this.Tiles.length; t++) 
        {
            this.Tiles[t].Calcul(Delta);
        }

        /* DEBUG CONTACT fort impact sur les FPS
        for (let y = 0; y < this.H; y++) 
        {     
            for (let x = 0; x < this.W; x++) 
            {       
                let id = this.Contenue[x + y * this.W]
                if (this.TileDepuisIndex(id).Contact)
                {
                    Debug.AjoutRectangle(
                        [Camera.AdapteX(this.X) + this.TailleTile * x,
                        Camera.AdapteY(this.Y) - this.TailleTile * (1 + y),
                         this.TailleTile,
                         this.TailleTile])
                }
            }
        }
        */
    }

    NeedRefresh()
    {
        this.#LastRectangle = undefined;
    }

    Dessin(Context)
    {
        if (this.Visible)
        {

            // Sauvegarde la position actuel du canvas 
            Context.save();
            // Adapte la position à celle de la camera
            Camera.DeplacerCanvas(Context)
            // Translate le canvas au centre de notre lutin 
            Context.translate(Camera.AdapteX(this.X), Camera.AdapteY(this.Y));
            // Agrandis le canvas suivant la taille de notre objet
            Context.scale(this.Zoom / 100.0, this.Zoom / 100.0)
            // Déplace le canvas à l'angle haut droit de l'image
            //Context.translate(-this.Image.width * 0.5, -this.Image.height * 0.5);  

            // Creation de la partie de map à dessiner
            let can = this.CreerCanvasPartMap()
            let x = this.RectDraw[0] * this.TailleTile; // Position X de dessin de l'image dans le canvas principal
            let y = (-this.RectDraw[4] * 2 - this.RectDraw[1]) * this.TailleTile; // Position Y de dessin de l'image dans le canvas principal

            if (this.Edit)
            {
                for(let j = 0; j < this.Edit_SelectedTile.length; j++)
                {
                    for(let i = 0; i< this.Edit_SelectedTile[j].length; i++)
                    {
                        let id = this.Edit_SelectedTile[j][i];
                        let sx = this.PositionPreview[0];
                        let sy = this.PositionPreview[1];
                        if (id >= 0)
                        {
                            this.TileDepuisIndex(id).Dessin(can, (sx + i) * this.TailleTile - x, (-sy + j) * this.TailleTile - y, id)
                        }
                        else
                        {
                            if (id == -1)
                            {
                                can.fillStyle = "Black";
                            }
                            else if (id == -2)
                            {
                                can.fillStyle = Color.Couleur(0.2,0,7,1,0.1);
                            }
                            can.fillRect((sx + i) * this.TailleTile - x,(-sy + j) * this.TailleTile - y, this.TailleTile, this.TailleTile)
                        }
                    }
                }
                
                this.#LastRectangle = undefined;
            }


            if (this.Teinte.A != 0)
            {
                // Applique une teinte au lutin
                let imageCtx = document.createElement("canvas").getContext("2d"); // Création d'un canvas temporaire
                imageCtx.canvas.width = this.Image.width; // Modification taille
                imageCtx.canvas.height = this.Image.height; // Modification taille

                imageCtx.fillStyle = this.Teinte.RGBA();// Définit la couleur de remplissage
                imageCtx.fillRect(0, 0, this.Image.width, this.Image.height);// Dessine un rectangle de couleur par dessus la figure
                imageCtx.globalCompositeOperation = "destination-atop";// Modifie le style d'ajout des couleurs
                imageCtx.drawImage(can.canvas ,0,0); // Dessin de l'image sur le canvas temporaire
                Context.drawImage(imageCtx.canvas, x, y); // Dessin du canvas temporaire dans le canvas original
            }
            else
            {
                Context.drawImage(can.canvas, x, y)
            }

            // Retourne à la position initiale du canvas
            Context.restore(); 
        }
    }

    /**
     * Creer une parti du tilemap sur un canvas temporaire pour eviter les pixels manquants entre deux tiles.
     * Le canvas est ensuite dessiner en un seul bloc dans le canvas principal avec les déplacement camera.
     */
    CreerCanvasPartMap()
    {
        // ignore la création du canvas si celui-ci est identique
        if (JSON.stringify(this.RectDraw) === JSON.stringify(this.#LastRectangle) && this.#LastCanvas != undefined)
        {
            return this.#LastCanvas
        }

        // Création d'un canvas temporaire
        if (this.#LastCanvas === undefined)
        {
            this.#LastCanvas = document.createElement("canvas").getContext("2d");
        }

        // Creation du canvas indépendant
        this.#LastCanvas.canvas.width = this.RectDraw[4] * 2 * this.TailleTile; // Modification taille
        this.#LastCanvas.canvas.height = this.RectDraw[4] * 2 * this.TailleTile; // Modification taille

        for (let y = this.RectDraw[1]; y < this.RectDraw[3]; y++) 
        {     
            for (let x = this.RectDraw[0]; x < this.RectDraw[2]; x++) 
            {       
                let id = this.Contenue[x + y * this.W];
                if (id >= 0 && x >= 0 && y >= 0 && x < this.W && y < this.H)
                {
                    let nx = (x - this.RectDraw[0]) - this.RectDraw[4] + 0.5;
                    let ny = (y - this.RectDraw[1]) - this.RectDraw[4] + 0.5;
                    if ((nx*nx + ny*ny) < this.RectDraw[4] * this.RectDraw[4])
                    {
                        let tile = this.TileDepuisIndex(id);
                        let v = 0;
    
                        if (tile.Voisin)
                        {
                            v = this.CalculVoisin(id, x, y);
                        }
                        tile.Dessin(this.#LastCanvas, (x - this.RectDraw[0]) * this.TailleTile, (this.RectDraw[4] * 2 - 1 - (y - this.RectDraw[1])) * this.TailleTile, id, v);
                    }
                }
                
            }
        }
        this.#LastRectangle = this.RectDraw;
        return this.#LastCanvas
    }

    CalculVoisin(id, x, y)
    {
        let v = 0;
        if (x - 1 < 0 || y - 1 < 0 ||
            this.Contenue[x - 1 + (y - 1) * this.W] == id)
            v += 1
        if (y - 1 < 0 ||
            this.Contenue[x + 0 + (y - 1) * this.W] == id)
            v += 2
        if (x + 1 >= this.W ||y - 1 < 0 ||
            this.Contenue[x + 1 + (y - 1) * this.W] == id)
            v += 4
        if (x - 1 < 0 ||
            this.Contenue[x - 1 + (y + 0) * this.W] == id)
            v += 8
        if (x + 1 >= this.W  ||
            this.Contenue[x + 1 + (y + 0) * this.W] == id)
            v += 16
        if (x - 1 < 0 || y + 1 >= this.H ||
            this.Contenue[x - 1 + (y + 1) * this.W] == id)
            v += 32
        if (y + 1 >= this.H ||
            this.Contenue[x + 0 + (y + 1) * this.W] == id)
            v += 64
        if (x + 1 >= this.W  || y + 1 >= this.H ||
            this.Contenue[x + 1 + (y + 1) * this.W] == id)
            v += 128
        return v;
    }
}