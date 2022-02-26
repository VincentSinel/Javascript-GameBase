class TileMap
{
    /**
     * Création d'un lutin manipulable avec des fonction simple
     * Mettre TileMap.Edit à true pour lancer l'édition du tilemap
     * Utiliser TileMap.Sauvegarder() pour sauvegarder le contenue du tilemap en un fichier .json
     * @param {number} X Position X du lutin
     * @param {number} Y Position Y du lutin
     * @param {Array<string>} Tiles Liste des tiles composant notre tilemap
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
        Tiles.forEach(tile => {
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

        this.Edit_SelectedTile = 0;
    }

    /**
     * Charge le contenue d'un fichier pour définir le tilemap
     * @param {String} Fichier Chemin d'accès du fichier
     */
    Charger(Fichier)
    {
        var result = null;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", Fichier, false);
        xmlhttp.send();
        if (xmlhttp.status==200) {
            result = xmlhttp.responseText;
        }
        this.#Charge(result)
    }

    #Charge(data)
    {
        let datas = data.split(",");
        this.W = parseInt(datas.shift())
        this.H = parseInt(datas.shift())
        this.Contenue = [];
        datas.forEach(s => {
            this.Contenue.push(parseInt(s))
        });
    }

    /**
     * Sauvegarde le contenue du Tilemap en un fichier .json
     */
    Sauvegarder()
    {
        let data = this.W.toString() + "," + this.H.toString()
        for(let i = 0; i < this.Contenue.length; i++)
        {
            data += "," + this.Contenue[i].toString();
        }

        let filename = "TilemapData.txt"
        let type = ".txt"
        var file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var a = document.createElement("a"),
                    url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
            }, 0); 
        }
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
                        if (this.Tiles[id].Contact)
                        {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }


    PositionIndex(X,Y)
    {
        let x = Math.floor((X - this.X) / this.TailleTile);
        let y = Math.floor((Y - this.Y) / this.TailleTile);
        return new Vecteur2(x, y);
    }


    ChangerTile(X,Y,Tile)
    {
        this.Contenue[X + Y * this.W]
    }

    Montrer()
    {
        this.Visible = true;
    }

    Cacher()
    {
        this.Visible = false;
    }

    Calcul(Delta)
    {
        this.Time += Delta;

        if (this.Edit)
        {
            if (Clavier.ToucheJusteBasse("p"))
            {
                this.Sauvegarder();
            }

            if (Souris.Scroll != 0)
            {
                this.Edit_SelectedTile = (this.Edit_SelectedTile + Souris.Scroll + this.Tiles.length) % this.Tiles.length;
                console.log(this.Edit_SelectedTile)
            }

            if (Souris.BoutonClic(0))
            {
                let x = Math.floor((Souris.X - this.X) / this.TailleTile);
                let y = Math.floor((Souris.Y - this.Y) / this.TailleTile);
                if (x >= 0 && y >= 0 && x < this.W && y < this.H)
                {
                    this.Contenue[x + y * this.W] = this.Edit_SelectedTile;

                }
            }
            if(Souris.BoutonJustClic(2))
            {
                let x = Math.floor((Souris.X - this.X) / this.TailleTile);
                let y = Math.floor((Souris.Y - this.Y) / this.TailleTile);
                if (x >= 0 && y >= 0 && x < this.W && y < this.H)
                {
                    this.Edit_SelectedTile = this.Contenue[x + y * this.W];
                }
            }
        }

        // Calcul de la partie visible pour limiter le cout en ressource lors de la phase dessin.
        let dx = Math.floor((Camera.X - this.X) / this.TailleTile + 0.5);
        let dy = Math.floor((Camera.Y + this.Y) / this.TailleTile + 0.5);
        let size = Math.max(5,Math.floor((Diagonal / (this.TailleTile * 2) + Math.sqrt(2)) * 100 / Camera.Zoom + 1));
        this.RectDraw = [dx - size, dy - size, dx + size, dy + size, size]

        /* DEBUG CONTACT fort impact sur les FPS
        for (let y = 0; y < this.H; y++) 
        {     
            for (let x = 0; x < this.W; x++) 
            {       
                let id = this.Contenue[x + y * this.W]
                if (this.Tiles[id].Contact)
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
            let y = (-this.RectDraw[4] * 2 - this.RectDraw[1] - 1) * this.TailleTile; // Position Y de dessin de l'image dans le canvas principal

            if (this.Teinte.A != 0)
            {
                // Applique une teinte au lutin
                let imageCtx = document.createElement("canvas").getContext("2d"); // Création d'un canvas temporaire
                imageCtx.canvas.width = this.Image.width; // Modification taille
                imageCtx.canvas.height = this.Image.height; // Modification taille

                imageCtx.fillStyle = this.Teinte.RGBA();// Définit la couleur de remplissage
                imageCtx.fillRect(0, 0, this.Image.width, this.Image.height);// Dessine un rectangle de couleur par dessus la figure
                imageCtx.globalCompositeOperation = "destination-atop";// Modifie le style d'ajout des couleurs
                imageCtx.drawImage(can ,0,0); // Dessin de l'image sur le canvas temporaire
                Context.drawImage(imageCtx.canvas, x, y); // Dessin du canvas temporaire dans le canvas original
            }
            else
            {
                Context.drawImage(can, x, y)
            }

            if (this.Edit)
            {
                x = Math.floor((Souris.X - this.X) / this.TailleTile);
                y = Math.floor((Souris.Y - this.Y) / this.TailleTile + 1 );
                this.Tiles[this.Edit_SelectedTile].Dessin(Context, x * this.TailleTile, -y * this.TailleTile)
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
        // Creation du canvas indépendant
        let imageCtx = document.createElement("canvas").getContext("2d"); // Création d'un canvas temporaire
        imageCtx.canvas.width = this.RectDraw[4] * 2 * this.TailleTile; // Modification taille
        imageCtx.canvas.height = this.RectDraw[4] * 2 * this.TailleTile; // Modification taille

        for (let y = this.RectDraw[1]; y < this.RectDraw[3]; y++) 
        {     
            for (let x = this.RectDraw[0]; x < this.RectDraw[2]; x++) 
            {       
                let id = this.Contenue[x + y * this.W];
                if (x >= 0 && y >= 0 && x < this.W && y < this.H)
                {
                    if (this.Tiles[id].InCamera(x * this.TailleTile, - (1 + y) * this.TailleTile))
                        this.Tiles[id].Dessin(imageCtx, (x - this.RectDraw[0]) * this.TailleTile, (this.RectDraw[4] * 2 - y + this.RectDraw[1]) * this.TailleTile);
                }
                
            }
        }
        return imageCtx.canvas
    }
}