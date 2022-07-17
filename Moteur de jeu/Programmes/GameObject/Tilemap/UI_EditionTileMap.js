/**
 * Interface d'édition de tilemap
 * @extends UI_Window
 * @class
 */
class UI_EditionTileMap extends UI_Window
{
    static Instance = undefined;

    /**
     * Crée un éditeur pour le tilemap séléctionné
     * @constructor
     * @param {TileMap} Tilemap Tilemap Cible de l'éditeur
     */
    constructor(Tilemap)
    {
        super (0,0,100,Game.Ecran_Largeur, Game.Ecran_Hauteur)

        UI_EditionTileMap.Instance = this;
        let _this = this;
        this.T = Tilemap;
        this.DragSelectTiles = [];

        // Création du panneau laterale
        let panel = new UI_Panel();
        panel.H = Game.Ecran_Hauteur;
        panel.W = 8 * Tilesets.TileSize + panel.EpaisseurBord * 2 + UI_VerticalScrollBar.ScrollW;
        panel.HorizontalAlignement = HorizontalAlignementType.Left;
        this.AddChildren(panel);
        // Création de la zone d'action au dessus de la map
        this.ActionZone = new UI_MapAction();
        this.AddChildren(this.ActionZone);
        // Création d'un grille dans le panneau latérale
        let g = new UI_Grid();
        g.H = UI_Element_Alignement.STRETCH;
        g.AddColumn(UI_Grid_Column.Star(1))
        g.AddRow(UI_Grid_Row.Auto())
        g.AddRow(UI_Grid_Row.Star(1))
        g.AddRow(UI_Grid_Row.Auto())
        g.AddRow(UI_Grid_Row.Auto())
        panel.AddChildren(g);
        // Ajout du nom de la map
        this.NameEdit = new UI_TextBox();
        this.NameEdit.Texte = this.T.Name;
        this.NameEdit.CursorPosition = this.NameEdit.Texte.length;
        this.NameEdit.Tooltip = "Nom du tilemap"
        this.NameEdit.MultiLine = false;
        this.NameEdit.AllowedCharacter = UI_TextBox.Alphabets_Extends + UI_TextBox.Numeric + " :-_!?()[]=°'#@$£¤%.,";
        this.NameEdit.Grid_Row = 0;
        this.NameEdit.onTextChanged.push(function(e) { _this.T.Name = _this.NameEdit.Texte;})
        this.NameEdit.onEnterAction.push(function(e) { _this.Sauvegarder(); })
        g.AddChildren(this.NameEdit);
        // Ajout du selecteur de tile
        this.TileSelector = new UI_TileSelector()
        this.TileSelector.Grid_Row = 1;
        g.AddChildren(this.TileSelector)
        // Ajout d'un séparateur
        let r = new UI_Rectangle()
        r.H = 3;
        r.Grid_Row = 2;
        r.CurrentColor = r.CurrentColor.ChangeLight(46);
        g.AddChildren(r);
        // Création de la liste des layers
        this.ListeLayer = new UI_ListView()
        this.ListeLayer.Grid_Row = 3;
        this.ListeLayer.onSelectionChanged.push(function(){_this.ToggleCollisionView()})
        this.ListeLayer.SelectedIndex = 0;
        g.AddChildren(this.ListeLayer);
        // Création de la liste des layers
        let layers = Object.keys(this.T.Layers);
        for (let l = 0; l < layers.length; l++) 
        {
            // Création de la grille contenant les objets
            let layer = this.T.Layers[layers[l]];
            let g2 = new UI_Grid();
            g2.H = UI_Element_Alignement.AUTO;
            g2.AddColumn(UI_Grid_Column.Star(1))
            g2.AddColumn(UI_Grid_Column.Auto())
            g2.AddRow(new UI_Grid_Row(16))
            this.ListeLayer.AddChildren(g2);
            // Ajout du nom de la couche
            let n = new UI_Label()
            n.Texte = layer.Name;
            n.HorizontalAlignement = HorizontalAlignementType.Left;
            g2.AddChildren(n);
            // Ajout d'une checkbox pour définir la visibilité
            let m = new UI_CheckBox()
            m.SetTexte("Visible");
            m.Check = true;
            m.CurrentMarkSize = 14;
            m.onCheck.push(function(e){_this.ToggleLayerVisibility(layer.Name, e.Check)})
            m.Grid_Column = 1;
            m.MinW = 60;
            g2.AddChildren(m);
        }
        this.ListeLayer.MinH = Math.min(5,Math.max(layers.length,4)) * 16;

        // Affichage de la fenêtre
        this.Show();
    }

    //#region GETTER SETTER
    
    /**
     * Tiles selectionné dans la liste des tiles
     * @type {int[]}
     */
    get SelectedTiles()
    {
        return this.TileSelector.SelectedTiles;
    }
    set SelectedTiles(v)
    {
        this.TileSelector.SelectedTiles = v;
    }
    /**
     * Tiles selectionné dans le tilemap
     * @type {Array<int[]>}
     */
    get Edit_SelectedTile()
    {
        return this.TileSelector.Edit_SelectedTile;
    }
    set Edit_SelectedTile(v)
    {
        this.TileSelector.Edit_SelectedTile = v;
    }
    /**
     * index de la couche selectionné dans la liste des couches
     * @type {int}
     */
    get SelectedLayer()
    {
        return this.ListeLayer.SelectedIndex;
    }
    /**
     * Nom de la couche selectionné dans la liste des couches
     * @type {string}
     */
    get Edit_SelectedLayer()
    {
        return Object.keys(this.T.Layers)[this.SelectedLayer];
    }
    /**
     * Couche selectionné dans la liste des couches (TileMap_Layer)
     * @type {TileMap_Layer}
     */
    get CurrentLayer()
    {
        return this.T.Layers[this.Edit_SelectedLayer];
    }
    /**
     * Renvoie la position de la preview sur le tilemap
     * @type {Vector}
     */
    get PositionPreview() { return this.ActionZone.PositionPreview; }
    set PositionPreview(v) { this.ActionZone.PositionPreview = v; }

    //#endregion

    /**
     * Gestion de l'appuie d'une touche de clavier
     * @param {KeyboardEvent} e Evenement du clavier
     */
     Handle_KeyJustDown(e)
     {
        super.Handle_KeyJustDown(e);
        if (e.key === "p" && !this.NameEdit.isFocus)
        {
            this.Sauvegarder();
        }
     }

    /**
     * Change la visibilité d'une couche
     * @param {string} name Nom du layer
     * @param {boolean} value Vraie si visible, faux sinon
     */
    ToggleLayerVisibility(name, value)
    {
        this.T.Layers[name].Visible = value;
    }
    /**
     * Active ou désactive la vision des collision du tilemap
     */
    ToggleCollisionView()
    {
        if (this.SelectedLayer === 0)
            TileMap_Layer.CollisionDebug = true;
        else
            TileMap_Layer.CollisionDebug = false;
    }

    /**
     * Sauvegarde le tilemap dans la base de donnée et sauvegarde la base de donnée
     */
    Sauvegarder()
    {
        let name =  prompt("Donner un nom à ce tilemap.\nAttention ce nom doit être unique, si un tilemap du même nom existe, il sera supprimé.\nLe fichier téléchargé ne doit lui pas changer de nom est vient remplacer celui présent dans le dossier Fichier du site Web", this.NameEdit.Texte);
        console.log(name)
        if (name != null)
        {
            this.T.Sauvegarder(name)
            Datas.SauvegarderData();
        }
    }
}

/**
 * Interface de gestion des actions sur le tilemap (invisible)
 * @extends UI_Draggable
 * @class
 */
class UI_MapAction extends UI_Draggable
{
    #OldPositionPreview = new Vector(-1,-1,-2);
    #StartDragTilePoint = new Vector(0,0,0);

    /**
     * Crée une interface de gestion des actions sur le tilemap
     * @constructor
     */
    constructor()
    {
        super()

        this.PositionPreview = new Vector(-1,-1,-2);

        this.X = 8 * Tilesets.TileSize + this.EpaisseurBord * 2 + UI_VerticalScrollBar.ScrollW;
        this.W = UI_Element_Alignement.STRETCH;
        this.H = UI_Element_Alignement.STRETCH;
        let _this = this;
        this.onSouris_AuDessus.push(function(e) {_this.Souris_Hover(e)})
        this.onSouris_Clique[Souris.ClicDroit].push(function(e) { _this.SourisD_Clique(e)})
        this.onSouris_DragStart[Souris.ClicDroit].push(function(e) { _this.SourisD_DragStart(e)})
        this.onSouris_Dragging[Souris.ClicDroit].push(function(e) { _this.SourisD_Dragging(e)})
        this.onSouris_DragEnd[Souris.ClicDroit].push(function(e) { _this.SourisD_DragEnd(e)})
    }

    //#region GETTER SETTER

    /** Tilemap @param {TileMap} */
    get T() { return this.Window.T; }
    /** UID de choix des tiles (évite de générer les tiles lors d'un drag sur un même carreau) @param {int} */
    get UID() { return this.Window.UID; }
    /** Couche actuellement selectionné @param {TileMap_Layer} */
    get CurrentLayer() { return this.Window.CurrentLayer; }
    /** Index de la couche selectionné @param {int} */
    get Edit_SelectedLayer() { return this.Window.Edit_SelectedLayer; }
    /** Liste des tiles selectionné @param {int[]} */
    get SelectedTiles() { return this.Window.SelectedTiles; }
    set SelectedTiles(v) { this.Window.SelectedTiles = v; }
    /** Tiles selectionné dans le tilemap @param {Array<int[]>} */
    get Edit_SelectedTile() { return this.Window.Edit_SelectedTile; }
    set Edit_SelectedTile(v) { this.Window.Edit_SelectedTile = v; }
    /** Position de départ de fin de la selection tilemap @param {Vector[]} */
    get DragSelectTiles() { return this.Window.DragSelectTiles; }
    set DragSelectTiles(v) { this.Window.DragSelectTiles = v; }

    //#endregion

    //#region EVENT HANDLER

    /**
     * Evenement lié au déplacement de la souris
     * @param {UIEvenement} event Evenement associé
     */
    Souris_Hover(event)
    {
        this.PositionPreview = this.T.PositionIndex(Souris.X, Souris.Y);
    }
    /**
     * Evenement lié au clique gauche de la souris
     * @param {UIEvenement} event Evenement associé
     * @override
     */
    Souris_Clique(event)
    {
        super.Souris_Clique(event);
        this.Clique_Tilemap(event);
        this.Window.Unfocus();
    }
    /**
     * Evenement lié au début de drag gauche de la souris
     * @param {UIEvenement} event Evenement associé
     * @override
     */
    Souris_DragStart(event)
    {
        super.Souris_DragStart(event);
        this.Clique_Tilemap(event);
    }
    /**
     * Evenement lié au drag gauche de la souris
     * @param {UIEvenement} event Evenement associé
     * @override
     */
    Souris_Dragging(event)
    {
        super.Souris_Dragging(event);
        this.Clique_Tilemap(event);
    }
    /**
     * Evenement lié a la fin de drag gauche de la souris
     * @param {UIEvenement} event Evenement associé
     * @override
     */
    Souris_DragEnd(event)
    {
        super.Souris_DragEnd(event);
        this.Clique_Tilemap(event);
    }
    /**
     * Evenement lié au clique droit de la souris
     * @param {UIEvenement} event Evenement associé
     * @override
     */
    SourisD_Clique(event)
    {
        this.CliqueD_Tilemap(event);
    }
    /**
     * Evenement lié au début de drag droit de la souris
     * @param {UIEvenement} event Evenement associé
     * @override
     */
    SourisD_DragStart(event)
    {
        super.Souris_DragStart(event);
        if(this.CurrentLayer.PointIn(this.PositionPreview.x, this.PositionPreview.y))
        {
            this.DragSelectTiles = [this.PositionPreview, this.PositionPreview];
            this.#StartDragTilePoint = this.PositionPreview;
        }
    }
    /**
     * Evenement lié au drag droit de la souris
     * @param {UIEvenement} event Evenement associé
     * @override
     */
    SourisD_Dragging(event)
    {
        super.Souris_Dragging(event);
        let x = Math.min(this.CurrentLayer.W - 1, Math.max(0,this.PositionPreview.x));
        let y = Math.min(this.CurrentLayer.H - 1, Math.max(0,this.PositionPreview.y));
        let x2 = this.DragSelectTiles[0].x
        this.DragSelectTiles = [
            new Vector(Math.min(x,this.#StartDragTilePoint.x), Math.min(y,this.#StartDragTilePoint.y)),
            new Vector(Math.max(x,this.#StartDragTilePoint.x), Math.max(y,this.#StartDragTilePoint.y))];
    }
    /**
     * Evenement lié a la fin de drag droit de la souris
     * @param {UIEvenement} event Evenement associé
     * @override
     */
    SourisD_DragEnd(event)
    {
        super.Souris_DragEnd(event);
        
        let x = Math.min(this.CurrentLayer.W - 1, Math.max(0,this.PositionPreview.x));
        let y = Math.min(this.CurrentLayer.H - 1, Math.max(0,this.PositionPreview.y));
        this.SelectedTiles = [];
        this.Edit_SelectedTile = [];
        for(let i = Math.min(x,this.#StartDragTilePoint.x); i <= Math.max(x,this.#StartDragTilePoint.x); i++)
        {
            this.Edit_SelectedTile.push([]);
            for(let j = Math.min(y,this.#StartDragTilePoint.y); j <= Math.max(y,this.#StartDragTilePoint.y); j++)
            {
                let id = this.CurrentLayer.GetTileAt(new Vector(i,j));
                this.SelectedTiles.push(id);
                this.Edit_SelectedTile[this.Edit_SelectedTile.length - 1].push(id);
            }
        }
        this.DragSelectTiles = [];
    }

    //#endregion

    /**
     * Action du clique gauche sur le tilemap
     */
    Clique_Tilemap()
    {
        this.PositionPreview = this.T.PositionIndex(Souris.X, Souris.Y);
        this.PositionPreview.z = this.UID;
        if ((this.#OldPositionPreview.x != this.PositionPreview.x || 
            this.#OldPositionPreview.y != this.PositionPreview.y || 
            this.#OldPositionPreview.z != this.PositionPreview.z))
        {
            this.#OldPositionPreview = this.PositionPreview;
            let x, y;
            let layer = this.CurrentLayer;
            for(let i = 0; i < this.Edit_SelectedTile.length; i++)
            {
                for(let j = 0; j < this.Edit_SelectedTile[i].length; j++)
                {
                    x = this.PositionPreview.x + i;
                    y = this.PositionPreview.y + j;
                    if (x >= 0 && y >= 0 && x < layer.W && y < layer.H)
                    {
                        if (this.Edit_SelectedLayer === TileMap_Layer.CollisionMaskName)
                        {
                            layer.ChangerTile(x, y, Math.min(0,this.Edit_SelectedTile[i][j]));
                        }
                        else
                        {
                            layer.ChangerTile(x, y, this.Edit_SelectedTile[i][j])
                        }
                    }
                }
            }
        }
    }
    /**
     * Action du clique droit sur le tilemap (prise d'un tile en pipette)
     */
     CliqueD_Tilemap()
     {
         let layer = this.CurrentLayer;
         let id = layer.GetTileAt(this.PositionPreview)
         this.SelectedTiles = [id];
         this.Edit_SelectedTile = [[id]];
     }
}

/**
 * Liste des tiles disponibles
 * @extends UI_ScrollView
 * @class
 */
class UI_TileSelector extends UI_ScrollView 
{
    #UID;
    #TileList;
    #HoverIndex = -1;
    #BackTopCanvas;
    #SelectedTiles = [-1];
    #Edit_SelectedTile = [[-1]];
    #dragstart;
    #dragmove;
    #dragging = false;

    /**
     * Crée une liste des tiles diponibles avec les différentes actions de selections.
     * @constructor
     */
    constructor()
    {
        super()

        this.ScrollHorizontal = false;
        this.Capture_Souris = true;
        this.Capture_Drag = true;

        // Création de la liste des tiles
        this.#TileList = new UI_TileListe();
        this.#TileList.HorizontalAlignement = HorizontalAlignementType.Center;
        this.#TileList.VerticalAlignement = VerticalAlignementType.Up;
        super.AddChildren(this.#TileList);

        this.onSelectionChanged = [];
        let _this = this;
        this.onSouris_Clique[Souris.ClicGauche].push(function(e) {_this.SourisG_Clique(e)})
        this.onSouris_Clique[Souris.ClicDroit].push(function(e) {_this.SourisD_Clique(e)})
        this.onSouris_AuDessus.push(function(e) {_this.Souris_Hover(e)})
        this.onSouris_DragStart[Souris.ClicGauche].push(function(e) {_this.Souris_DragStart(e); })
        this.onSouris_Dragging[Souris.ClicGauche].push(function(e) {_this.Souris_Dragging(e); })
        this.onSouris_DragEnd[Souris.ClicGauche].push(function(e) {_this.Souris_DragEnd(e); })
    }

    //#region GETTER SETTER

    /**
     * Tiles selectionné dans la liste des tiles
     * @type {int[]}
     */
    get SelectedTiles()
    {
        return this.#SelectedTiles;
    }
    set SelectedTiles(v)
    {
        this.#SelectedTiles = v;
        this.Refresh();
    }
    /**
     * Tiles selectionné dans le tilemap
     * @type {Array<int[]>}
     */
    get Edit_SelectedTile()
    {
        return this.#Edit_SelectedTile;
    }
    set Edit_SelectedTile(v)
    {
        this.#UID = Date.now();
        this.#Edit_SelectedTile = v;
    }
    /**
     * Renvoie la position de départ du drag
     */
    get DragStart() { return this.#dragstart }
    /**
    * Renvoie la position du drag
    */
    get DragMove() { return this.#dragmove }
    /**
     * Renvoie la position de fin du drag
     */
    get Dragging() { return this.#dragging }
    /**
     * Renvoie l'indentifiant de la dernière modification de selection.
     */
    get UID() { return this.#UID; }

    //#endregion

    //#region EVENT HANDLER

    /**
     * Evenement lié au clique gauche de la souris
     * @param {UIEvenement} event Evenement associé
     */
    SourisG_Clique(event)
    {
        if (this.#TileList.PointIn(Souris.CPosition))
        {
            this.SelectedTiles = [this.#TileList.GetTileAt(Souris.CPosition)];
            this.Edit_SelectedTile = [[this.#TileList.GetTileAt(Souris.CPosition)]];
        }
        this.Window.Unfocus();
    }
    /**
     * Evenement lié au clique droit de la souris
     * @param {UIEvenement} event Evenement associé
     */
    SourisD_Clique(event)
    {
        if (this.#TileList.PointIn(Souris.CPosition))
        {
            this.ClearSelectedTile();
        }
        this.Window.Unfocus();
    }
    /**
     * Evenement lié au déplacement de la souris
     * @param {UIEvenement} event Evenement associé
     */
    Souris_Hover(event)
    {
        if (this.#TileList.PointIn(Souris.CPosition))
        {
            this.#HoverIndex = this.#TileList.GetTileAt(Souris.CPosition);
            this.Refresh();
        }
    }
    /**
     * Evenement lié au début de drag de la souris
     * @param {UIEvenement} event Evenement associé
     */
    Souris_DragStart(event)
    {
        this.#dragstart = event.Param.clone();
        this.#dragging = true;
        
        if (this.#TileList.PointIn(Souris.CPosition))
        {
            this.SelectedTiles = [this.#TileList.GetTileAt(Souris.CPosition)];
        }
        this.Window.Unfocus();
    }
    /**
     * Evenement lié au drag de la souris
     * @param {UIEvenement} event Evenement associé
     */
    Souris_Dragging(event)
    {
        this.#dragmove = this.#dragstart.to(event.Param);

        if (this.#TileList.PointIn(Souris.CPosition))
        {
            let idS = this.#TileList.GetTileAt(this.#dragstart)
            let idE = this.#TileList.GetTileAt(Souris.CPosition)
            this.SelectTile(idS,idE);
        }
    }
    /**
     * Evenement lié a la fin de drag de la souris
     * @param {UIEvenement} event Evenement associé
     */
    Souris_DragEnd(event)
    {
        this.#dragging = false;
        this.#dragmove = this.#dragstart.to(event.Param);
        
        if (this.#TileList.PointIn(Souris.CPosition))
        {
            let idS = this.#TileList.GetTileAt(this.#dragstart)
            let idE = this.#TileList.GetTileAt(Souris.CPosition)
            this.SelectTile(idS,idE);
        }
        else
        {
            this.SelectedTiles = [];
            this.Edit_SelectedTile = [];
        }
    }

    //#endregion

    /**
     * Effectue la selection d'un rectangle de tile entre deux index de tile
     * @param {int} from ID du premier tile de la selection
     * @param {int} to ID du dernier tile de la selection
     */
    SelectTile(from, to)
    {
        let x1 = Math.floor(from % 8);
        let y1 = Math.floor(Math.floor(from / 8));
        let x2 = Math.floor(to % 8);
        let y2 = Math.floor(Math.floor(to / 8));
        this.SelectedTiles = [];
        this.Edit_SelectedTile = [];
        for(let i = Math.min(x1,x2); i <= Math.max(x1,x2); i++)
        {
            this.Edit_SelectedTile.push([]);
            for(let j = Math.min(y1,y2); j <= Math.max(y1,y2); j++)
            {
                this.SelectedTiles.push(i + j * 8);
                this.Edit_SelectedTile[this.Edit_SelectedTile.length - 1].push(i + j * 8);
            }
        }
    }
    
    /**
     * Vide la selection de tile
     */
    ClearSelectedTile()
    {
        this.SelectedTiles = [-1];
        this.Edit_SelectedTile = [[-1]];
    }

    /**
     * Effectue une translation de la vue horizontalement
     * @param {float} x Mouvement horizontal
     * @override
     */
    MoveViewX(x)
    {
        super.MoveViewX(x);
        this.Refresh();
    }
    /**
     * Effectue une translation de la vue verticalement
     * @param {float} y Mouvement vertical
     * @override
     */
    MoveViewY(y)
    {
        super.MoveViewY(y);
        this.Refresh();
    }

    /**
     * Créé le canvas de contenue
     * @override
     */
    CreateCanvas()
    {
        super.CreateCanvas();

        this.#BackTopCanvas = document.createElement("canvas").getContext("2d");
        this.#BackTopCanvas.canvas.width = this.#TileList.FinalSize.x;
        this.#BackTopCanvas.canvas.height = this.#TileList.FinalSize.y;
    }
    /**
     * Effectue le dessin de la partie visible des tiles
     * @param {CanvasRenderingContext2D} Context Context de dessin
     */
    DessinFrontUI(Context)
    {
        this.#BackTopCanvas.clearRect(0,0,this.#BackTopCanvas.canvas.width,this.#BackTopCanvas.canvas.height);
        this.#BackTopCanvas.fillStyle = this.SelectionCouleur.RGBA();
        this.#BackTopCanvas.strokeStyle = this.SelectionCouleur.RGB();
        this.#BackTopCanvas.lineWidth = 2;

        this.SelectedTiles.forEach(tile => {
            if (tile > -1)
            {
                let a = tile % 8 * Tilesets.TileSize;
                let b = Math.floor(tile / 8) * Tilesets.TileSize;

                this.#BackTopCanvas.fillRect(a, b, Tilesets.TileSize, Tilesets.TileSize);
                this.#BackTopCanvas.strokeRect(a, b, Tilesets.TileSize, Tilesets.TileSize);
            }
        });
                
        Context.drawImage(this.#BackTopCanvas.canvas, 0, -this.Scroll_VPosition);

        if (this.#HoverIndex > -1)
        {
            let a = this.#HoverIndex % 8 * Tilesets.TileSize;
            let b = Math.floor(this.#HoverIndex / 8) * Tilesets.TileSize;

            this.#BackTopCanvas.fillStyle = Color.Couleur(0,0,1,0.1)
            this.#BackTopCanvas.fillRect(a, b, Tilesets.TileSize, Tilesets.TileSize);
            
            Context.drawImage(this.#BackTopCanvas.canvas, 0, -this.Scroll_VPosition);
        }
    }
}

/**
 * UI_Element simple créant une grande texture regroupant tous les tiles
 * @extends UI_Element
 * @class
 */
class UI_TileListe extends UI_Element
{
    #AnimatedTiles;

    /**
     * Créer un atlas des tiles disponibles
     * @constructor
     */
    constructor()
    {
        super();
        this.W = Tilesets.TileSize * 8;
        this.H = Math.ceil(Tilesets.TileNbr / 8) * Tilesets.TileSize;
        this.#AnimatedTiles = [];
    }
    /**
     * Renvoie le tile se trouvant à une position définit
     * @param {Vector} Point Position souhaité
     * @returns {int} ID du tile ce trouvant à la position fourni
     */
    GetTileAt(Point)
    {
        if (Point.x >= this.GX && Point.x <= this.GX + this.FinalSize.x && Point.y >= this.GY && Point.y <= this.GY + this.FinalSize.y)
        {
            let x = Math.min(7, Math.floor((Point.x - this.GX) / Tilesets.TileSize));
            let y = Math.floor((Point.y - this.GY) / Tilesets.TileSize);
            return x + y * 8;
        }
        return -1;
    }

    Dessin(Context, RecreateCanvas, offsetX = 0, offsetY = 0)
    {
        super.Dessin(Context, RecreateCanvas, offsetX, offsetY);
    }

    /**
     * Créer l'image de la liste
     * @param {CanvasRenderContext2D} Context Context de dessin
     * @override
     */
    DessinBackUI(Context)
    {
        Context.fillStyle = "black";
        Context.fillRect(0,0,Context.canvas.width, Context.canvas.height);
        this.#AnimatedTiles = [];
        for (let t = 0; t < Tilesets.TileNbr; t++) 
        {
            let x = Tilesets.TileSize * (t % 8)
            let y = Tilesets.TileSize * Math.floor(t / 8)
            let tile = Tilesets.TileFromIndex(t);
            if (tile.Animation)
                this.#AnimatedTiles.push(t);

            tile.Dessin(Context, x, y, t, 0);
        }
    }
    /**
     * Mets à jour les animations
     * @param {float} Delta Frame depuis la précédentes mise a jour
     * @override
     */
    Calcul(Delta)
    {
        super.Calcul(Delta);
        if (Tilesets.AnimationUpdated)
        {
            for (let a = 0; a < this.#AnimatedTiles.length; a++) 
            {
                let x = Tilesets.TileSize * (a % 8)
                let y = Tilesets.TileSize * Math.floor(a / 8)
                let tile = Tilesets.TileFromIndex(a);
                tile.Dessin(this.Backctx, x, y, a, 0);
                this.Window.ForceRedraw();
            }
        }
    }
}