class TileMap extends Drawable
{

    #W;
    #H;

    static SauvegardeVersion = "2.0"
    /**
     * Création d'un lutin manipulable avec des fonction simple
     * Utiliser TileMap.Edition() activer l'édition du tilemap
     * Utiliser TileMap.Sauvegarder() pour sauvegarder le contenue du tilemap en un fichier .json
     * Utiliser TileMap.Charger() pour charger le contenue depuis la base de donnée
     * @param {number} X Position X du lutin
     * @param {number} Y Position Y du lutin
     * @param {Array<Tile>} Tiles Liste des tiles composant notre tilemap
     */
    constructor(X, Y, W, H)
    {
        super(X, Y, 0)
        
        this.#W = W;
        this.#H = H;

        this.Layers = {collision: new TileMap_Layer(TileMap_Layer.CollisionMaskName, this, 1000000000)};

        this.Edit = false;
        this.Teinte = new Color(0,0,0,0);
        this.RectDraw;
    }

    PostSetParent()
    {
        super.PostSetParent()
        this.AddChildren(this.Layers.collision)
    }

    get TextWidth()
    {
        return this.W * Tilesets.TileSize;
    }
    get TextHeight()
    {
        return this.H * Tilesets.TileSize;
    }

    get H()
    {
        return this.#H
    }
    get W()
    {
        return this.#W
    }

    get Edit_SelectedLayer()
    {
        return Object.keys(this.Layers)[this.EditUI.SelectedLayer];
    }
    
    get CollisionRect()
    {
        return Rectangle.FromPosition(0,0,0,0);
    }

    GetOverlapVector(rect, mouvement)
    {
        let p1 = this.PositionIndex(rect.x,rect.y);
        let p2 = this.PositionIndex(rect.x + rect.w,rect.y + rect.h);
        let o = new Vector(rect.x,rect.y);
        if (mouvement.x >= 0 && mouvement.y >= 0)
        {
            for(let i = p1.x; i <= p2.x; i++)
            {
                for(let j = p1.y; j <= p2.y; j++)
                {
                    if (i == p1.x || i == p2.x || j == p1.y || j == p2.y)
                    {
                        this.#GetOverlapVector_Do(i, j, rect);
                    }
                }
            }
        }
        else if (mouvement.x < 0 && mouvement.y >= 0)
        {
            for(let i = p2.x; i >= p1.x; i--)
            {
                for(let j = p1.y; j <= p2.y; j++)
                {
                    if (i == p1.x || i == p2.x || j == p1.y || j == p2.y)
                    {
                        this.#GetOverlapVector_Do(i, j, rect);
                    }
                }
            }
        }
        else if (mouvement.x < 0 && mouvement.y < 0)
        {
            for(let i = p2.x; i >= p1.x; i--)
            {
                for(let j = p2.y; j >= p1.y; j--)
                {
                    if (i == p1.x || i == p2.x || j == p1.y || j == p2.y)
                    {
                        this.#GetOverlapVector_Do(i, j, rect);
                    }
                }
            }
        }
        else if (mouvement.x >= 0 && mouvement.y < 0)
        {
            for(let i = p1.x; i <= p2.x; i++)
            {
                for(let j = p2.y; j >= p1.y; j--)
                {
                    if (i == p1.x || i == p2.x || j == p1.y || j == p2.y)
                    {
                        this.#GetOverlapVector_Do(i, j, rect);
                    }
                }
            }
        }
        return o.to(new Vector(rect.x,rect.y));
    }

    #GetOverlapVector_Do(i, j, rect)
    {
        if(this.Layers[TileMap_Layer.CollisionMaskName].GetTileAt(new Vector(i,j)) >= 0)
        {
            let x = i * Tilesets.TileSize + this.X - this.TextWidth * this.CentreRotation.x;
            let y = j * Tilesets.TileSize + this.Y - this.TextHeight * this.CentreRotation.y;
            let r = Rectangle.FromPosition(x,y,Tilesets.TileSize,Tilesets.TileSize)
            let e = rect.collisionWithOverlap(r); 
            rect.origin = rect.origin.add(e);
        }
    }


    /**
     * Ajoute une couche de dessin au tilemap
     * @param {String} Name Nom de la couche de dessin
     * @param {float} Z Position Z de la couche de dessin
     * @param {int} fill tile de préremplissage de la couche (-1 pour créer une couche vide)
     */
    AddLayer(Name, Z, fill = -1)
    {
        if (Object.keys(this.Layers).includes(Name))
        {
            console.log("Une couche du même nom a déjà été créée");
        }
        else if (Name == TileMap_Layer.CollisionMaskName)
        {
            throw "Une couche ne peut pas porter ce nom (utilisé pour définir les contacts)";
        }
        this.Layers[Name] = new TileMap_Layer(Name, this, Z, fill);
        this.AddChildren(this.Layers[Name]);
    }





    /**
     * Lance l'édition du TileMap
     */
    Edition()
    {
        if (UI_EditionTileMap.Instance)
        {
            UI_EditionTileMap.Instance.Fermer();
        }
        this.Edit = true;
        this.EditUI = new UI_EditionTileMap(this);
    }

    FlipLayersVerticaly()
    {
        Object.values(this.TileMap.Layers).forEach( value => {
            let array = [];
            for (let y = value.H - 1; y >= 0; y--) 
            {     
                for (let x = 0; x < value.W; x++) 
                {
                    array.push(value.Contenue[x + y * value.W]);
                }
            }
            value.Contenue = array;
            value.Load(value.EncodeData()[2])
        })
    }
    FlipLayersHorizontaly()
    {
        Object.values(this.TileMap.Layers).forEach( value => {
            let array = [];
            for (let y = 0; y < value.H; y++) 
            {     
                for (let x = value.W - 1; x >= 0; x--) 
                {
                    array.push(value.Contenue[x + y * value.W]);
                }
            }
            value.Contenue = array;
            value.Load(value.EncodeData()[2])
        })
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
            this.#Charge(data, Nom)
        }
    }

    /**
     * Lance le chargement du tilemap.
     * @param {Array} data Donnée à charger
     * @param {string} nom Nom de la sauvegarde
     */
    #Charge(data, nom = "")
    {
        this.#W = data.Largeur;
        this.#H = data.Hauteur;
        let v = data.Version;
        if (v == undefined)
        {
            throw "La version n'est pas définit"
            /* let datas = data.Data.split(",");
            this.Contenue = [];
            datas.forEach(s => {
                this.Contenue.push(parseInt(s))
            }); */
        }
        else if (v == "1.0")
        {
            this.AddLayer(nom, z);
            this.Layers[nom].Load(data.Data);
        }
        else if (v == "2.0")
        {
            for (let l = 0; l < data.Data.length; l++) 
            {
                const element = data.Data[l];
                let name =  element[0];
                let z = element[1];
                let d = element[2];
                if (name == TileMap_Layer.CollisionMaskName)
                {
                    this.Layers[name].Load(d);
                }
                else
                {
                    this.AddLayer(name, z);
                    this.Layers[name].Load(d);
                }
            }
        }
    }

    /**
     * Sauvegarde le contenue du Tilemap en un fichier .json
     */
    Sauvegarder(Nom)
    {
        let data = this.#EncodeData();

        Datas.AjoutTilemapData(Nom, this.W, this.H, data, TileMap.SauvegardeVersion)
    }

    /**
     * Encode chaque couche (TileMap_Layers) du tilemap pour l'enregistrement.
     * @returns Tableau des données pour le tilemap
     */
    #EncodeData()
    {
        let ar = [];

        Object.keys(this.Layers).forEach(key => {
            ar.push(this.Layers[key].EncodeData())
        });
        return ar;
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
        let dx = Math.floor(ar[1] / Tilesets.TileSize * dec);
        let dy = Math.floor(ar[2] / Tilesets.TileSize * dec);
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
                        if (id != -1 && this.TileDepuisIndex(id).Contact)
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
        let x = Math.floor((X - (this.X - this.TextWidth * this.CentreRotation.x)) / Tilesets.TileSize);
        let y = Math.floor((Y - (this.Y - this.TextHeight * this.CentreRotation.y)) / Tilesets.TileSize);
        return new Vector(x, y);
    }

    /**
     * Lance les calculs lié au tilemap
     * @param {float} Delta Nombre de frame depuis la dernière mise à jour.
     */
    Calcul(Delta)
    {
        this.Time += Delta;
        // Calcul de la partie visible pour limiter le coût en ressource lors de la phase dessin.

        let newx = this.X - this.TextWidth * this.CentreRotation.x;
        let newy = this.Y - this.TextHeight * this.CentreRotation.y;
        let size = Math.max(Tilesets.TileSize,(Diagonal + Tilesets.TileSize) / Camera.Zoom);
        let dx = Camera.X - size / 2 - newx
        let dy = Camera.Y - size / 2 - newy
        
        this.RectDraw = Rectangle.FromPosition(dx, dy, size, size);
    }

    Dessin(Context)
    {
       // Tout est gérer par les TileMap_Layer 
    }

}