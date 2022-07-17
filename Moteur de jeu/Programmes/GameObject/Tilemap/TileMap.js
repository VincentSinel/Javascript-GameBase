/**
 * Représente un tilemap
 * @extends Drawable
 * @class
 */
class TileMap extends Drawable
{

    static SauvegardeVersion = "2.0"

    static #Edition = false;
    static Edition()
    {
        TileMap.#Edition = true;
    }

    static Calcul()
    {

    }

    static SceneChange()
    {
    }


    #W;
    #H;
    #Layers = {};
    #Edit = false;

    /**
     * Création d'un tilemap modifiable
     * @constructor
     * @param {float} X Position X du lutin
     * @param {float} Y Position Y du lutin
     * @param {int} W Largeur en tile du tilemap
     * @param {int} H hauteur en tile du tilemap
     */
    constructor(X, Y, W, H)
    {
        super(X, Y, 0)
        
        this.Name = "Map 1";
        this.#W = W;
        this.#H = H;

        this.#Layers = {};
        this.#Layers[TileMap_Layer.CollisionMaskName] = this.AddChildren(new TileMap_Layer(TileMap_Layer.CollisionMaskName, this, 1000000000));

        this.#Edit = false;
        this.Teinte = new Color(0,0,0,0);
        this.RectDraw;
    }

    //#region GETTER SETTER

    /**
     * Largeur du tilemap en pixel
     * @override
     * @type {float}
     */
    get TextWidth()
    {
        return this.W * Tilesets.TileSize;
    }
    /**
     * Hauteur du tilemap en pixel
     * @override
     * @type {float}
     */
    get TextHeight()
    {
        return this.H * Tilesets.TileSize;
    }
    /**
     * Largeur du tilemap en tile
     * @type {float}
     */
    get W()
    {
        return this.#W
    }
    /**
     * hauteur du tilemap en tile
     * @type {float}
     */
    get H()
    {
        return this.#H
    }
    /**
     * Couche selectionné
     * @type {TileMap_Layer}
     */
    get Edit_SelectedLayer()
    {
        return Object.keys(this.Layers)[this.EditUI.SelectedLayer];
    }
    /**
     * Supprime le tableau de collision en réinitialisant ses paramètre
     * @override
     * @type {Rectangle}
     */
    get CollisionRect()
    {
        return Rectangle.FromPosition(0,0,0,0);
    }
    /**
     * Renvoie la liste des couches de dessin.
     * @type {Object}
     */
    get Layers()
    {
        return this.#Layers;
    }
    /**
     * Indique si ce tilemap est en mode édition
     * @type {boolean}
     */
    get Edit()
    {
        return this.#Edit
    }

    //#endregion

    /**
     * S'execute après l'assignation de la racine.
     */
    PostSetParent()
    {
        super.PostSetParent()
        this.AddChildren(this.Layers.collision)
    }
    /**
     * Calcul la collision d'un objet rectangulaire sur le tilemap
     * @param {Rectangle} rect Rectangle de test de collision
     * @param {Vector} mouvement Mouvement de l'objet à tester
     * @returns {Vector} Mouvement à effectuer pour quitter la collision
     */
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
                    if (i === p1.x || i === p2.x || j === p1.y || j === p2.y)
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
                    if (i === p1.x || i === p2.x || j === p1.y || j === p2.y)
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
                    if (i === p1.x || i === p2.x || j === p1.y || j === p2.y)
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
                    if (i === p1.x || i === p2.x || j === p1.y || j === p2.y)
                    {
                        this.#GetOverlapVector_Do(i, j, rect);
                    }
                }
            }
        }
        return o.to(new Vector(rect.x,rect.y));
    }
    /**
     * Test la collision 
     * @param {int} i Tile X
     * @param {int} j Tile Y
     * @param {Rectangle} rect Rectangle à tester
     */
    #GetOverlapVector_Do(i, j, rect)
    {
        if(this.Layers[TileMap_Layer.CollisionMaskName].GetTileAt(new Vector(i,j)) >= 0)
        {
            let x = i * Tilesets.TileSize + this.X - this.TextWidth * this.CentreRotation.x;
            let y = j * Tilesets.TileSize + this.Y - this.TextHeight * this.CentreRotation.y;
            let r = Rectangle.FromPosition(x,y,Tilesets.TileSize,Tilesets.TileSize)
            let e = rect.collide_Overlap(r); 
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
        else if (Name === TileMap_Layer.CollisionMaskName)
        {
            throw "Une couche ne peut pas porter ce nom (utilisé pour définir les contacts)";
        }
        this.#Layers[Name] = new TileMap_Layer(Name, this, Z, fill);
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
        this.#Edit = true;
        this.EditUI = new UI_EditionTileMap(this);
    }
    /**
     * Effectue un mirroir du contenue des Layers verticalement
     */
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
    /**
     * Effectue un mirroir du contenue des Layers horizontalement
     */
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
        this.Name = Nom;
        let data = Datas.DataTileMap(Nom)
        if (data)
        {
            this.#Charge(data, Nom)
        }
        this.Calcul(0);
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
        if (v === undefined)
        {
            throw "La version n'est pas définit"
            /* let datas = data.Data.split(",");
            this.Contenue = [];
            datas.forEach(s => {
                this.Contenue.push(parseInt(s))
            }); */
        }
        else if (v === "1.0")
        {
            this.AddLayer(nom, z);
            this.Layers[nom].Load(data.Data);
        }
        else if (v === "2.0")
        {
            for (let l = 0; l < data.Data.length; l++) 
            {
                const element = data.Data[l];
                let name =  element[0];
                let z = element[1];
                let d = element[2];
                if (name === TileMap_Layer.CollisionMaskName)
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
     * @returns {Array<Array}Tableau des données pour le tilemap ([[Nom, Z, data]])
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
     * Convertie une position sur la camera en une position sur le tilemap.
     * @param {float} X Position X sur la camera
     * @param {float} Y Position Y sur la camera
     * @returns {Vector} Vecteur représentant la position en tile sur le tilemap
     */
    PositionIndex(X,Y)
    {
        let x = Math.floor((X - (this.X - this.TextWidth * this.CentreRotation.x)) / Tilesets.TileSize);
        let y = Math.floor((Y - (this.Y - this.TextHeight * this.CentreRotation.y)) / Tilesets.TileSize);
        return new Vector(x, y);
    }
    /**
     * Lance les calculs lié au tilemap
     * @override
     * @param {float} Delta Nombre de frame depuis la dernière mise à jour.
     */
    Calcul(Delta)
    {
        this.Time += Delta;
        // Calcul de la partie visible pour limiter le coût en ressource lors de la phase dessin.

        let newx = this.X - this.TextWidth * this.CentreRotation.x;
        let newy = this.Y - this.TextHeight * this.CentreRotation.y;
        let size = Math.max(Tilesets.TileSize,(Game.Diagonal + Tilesets.TileSize) / Camera.Zoom);
        let dx = Camera.X - size / 2 - newx
        let dy = Camera.Y - size / 2 - newy
        
        this.RectDraw = Rectangle.FromPosition(dx, dy, size, size);
    }
    /**
     * Effectue le dessin supplémentaire sur le tilemap
     * @param {CanvasRenderingContext2D} Context Contexte de dessin 
     */
    Dessin(Context)
    {
       // Tout est gérer par les TileMap_Layer 
    }

}