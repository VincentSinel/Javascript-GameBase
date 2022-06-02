/**
 * Interface d'édition de tilemap
 * @extends UIElement
 * @class
 */
class UI_EditionTileMap extends UIElement
{
    static Instance;
    static ListHeight = UIElement.BaseEpaisseurBord * 2 + 8 * 12;

    #ScrollPosition;
    #SelectedTiles;
    #DragStart;
    #OldPositionPreview;
    #UID;
    #Edit_SelectedTile;
    #AnimatedTiles;

    /**
     * Créer un éditeur pour le tilemap séléctionné
     * @constructor
     * @param {TileMap} Tilemap Tilemap Cible de l'éditeur
     */
    constructor(Tilemap)
    {
        let w = 8 * Tilesets.TileSize + UIElement.BaseEpaisseurBord * 2 + UI_VerticalScrollBar.ScrollW;
        super(0,0,0, Ecran_Largeur, Ecran_Hauteur);


        let _this = this;
        UI_EditionTileMap.Instance = this;

        this.T = Tilemap;
        this.Padding = [0,0,0,0];
        this.SourisCapture = true;
        this.ScrollCapture = true;
        this.Draggable = true;
        this.MenuW = w;

        this.#ScrollPosition = 0;
        this.#SelectedTiles = [];
        this.#AnimatedTiles = [];
        this.#DragStart = undefined;
        this.#Edit_SelectedTile = [[-1]];
        this.#OldPositionPreview = new Vector(-1,-1,-2);

        this.DragSelectTiles = [];
        this.PositionPreview = new Vector(-1,-1,-2);


        this.ListeLayer = new UI_ListView(0,this.H - UI_EditionTileMap.ListHeight,20,w,UI_EditionTileMap.ListHeight, this);
        this.ListeLayer.onSelectionChanged = function(){_this.ToggleCollisionView()}
        let layers = Object.keys(this.T.Layers);
        for (let l = 0; l < layers.length; l++) {
            let layer = this.T.Layers[layers[l]];
            let p = new UIElement(0,0,0,this.ListeLayer.CW,this.FontTaille + 4);
            p.Padding = [0,0,0,0];
            //p.SourisCapture = true;
            let a = new UI_CheckBox(this.ListeLayer.CW - 70, 0, 1, "visible", p)
            a.Check = true;
            a.onCheck.push(function(e){_this.ToggleLayerVisibility(layer.Name, e.Check)})
            let lab =new UI_Label(0,0,1,w-70,this.FontTaille + 4, layer.Name, p);
            lab.HorizontalAlignement = HorizontalAlignementType.Gauche
            lab.SourisCapture = false;
            this.ListeLayer.AjoutElement(p)
        }
        this.ListeLayer.Select(0);
        

        this.Panel = new UI_Panel(0,0,0,w,this.H - UI_EditionTileMap.ListHeight, this);
        this.ScrollBar = new UI_VerticalScrollBar(
            this.Panel.Padding[0] + this.Panel.CW - UI_VerticalScrollBar.ScrollW, 
            this.Panel.Padding[1], 
            this.Panel.CH, 
            this);
        this.ScrollBar.TotalH = Math.ceil(Tilesets.TileNbr / 8) * Tilesets.TileSize;

        this.SetTile();

        this.onSouris_AuDessus.push(function(e) {_this.Souris_Hover(e)})
        this.onSouris_Scroll.push(function(e) { _this.Souris_Scroll(e)})
        this.onClavier_ToucheJusteBasse.push(function(e){_this.Clavier_ToucheJusteBasse(e)})
        this.onSouris_Clique[Souris.ClicGauche].push(function(e) {_this.Souris_Clique(e)})
        this.onSouris_Clique[Souris.ClicDroit].push(function(e) {_this.Souris_RightClique(e)})
        this.onSouris_DragStart[Souris.ClicGauche].push(function(e) {_this.Souris_DragStart(e)})
        this.onSouris_Dragging[Souris.ClicGauche].push(function(e) {_this.Souris_Dragging(e)})
        this.onSouris_DragEnd[Souris.ClicGauche].push(function(e) {_this.Souris_DragEnd(e)})
        this.onSouris_DragStart[Souris.ClicDroit].push(function(e) {_this.Souris_RightDragStart(e)})
        this.onSouris_Dragging[Souris.ClicDroit].push(function(e) {_this.Souris_RightDragging(e)})
        this.onSouris_DragEnd[Souris.ClicDroit].push(function(e) {_this.Souris_RightDragEnd(e)})

        this.Focus()
    }

    //#region GETTER SETTER

    /**
     * Position Scroll liste des tiles
     * @type {float}
     */
    get ScrollPosition()
    {
        return this.#ScrollPosition;
    }
    set ScrollPosition(v)
    {
        this.#ScrollPosition = v;
    }
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
        this.RefreshUI();
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

    //#endregion

    //#region Handler

    /**
     * Evenement lié à l'appuye d'une touche
     * @param {UIEvenement} e Evenement associé
     */
    Clavier_ToucheJusteBasse(e)
    {
        if (e.Param.key == "p")
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
     * Evenement lié au déplacement de la souris
     * @param {UIEvenement} e Evenement associé
     */
    Souris_Hover(e)
    {
        this.PositionPreview = this.T.PositionIndex(Souris.X, Souris.Y, this.#UID);
    }
    /**
     * Evenement lié au scroll de la souris
     * @param {UIEvenement} e Evenement associé
     */
    Souris_Scroll(e)
    {
        this.ScrollBar.ScrollPosition += e.Param.dy * 30;
    }
    /**
     * Evenement lié au clique gauche de la souris
     * @param {UIEvenement} e Evenement associé
     */
    Souris_Clique(e)
    {
        if (Souris.CX <= this.MenuW)
        {
            this.Clique_MenuTile();
        }
        else // Edition sur tilemap
        {
            this.Clique_Tilemap();
        }
    }
    /**
     * Evenement lié au clique droit de la souris
     * @param {UIEvenement} e Evenement associé
     */
    Souris_RightClique(e)
    {
        if (Souris.CX <= this.MenuW)
        {
            this.ClearSelectedTile();
        }
        else
        {
            this.CliqueD_Tilemap();
        }
    }
    /**
     * Evenement lié au début de drag gauche de la souris
     * @param {UIEvenement} event Evenement associé
     */
    Souris_DragStart(event)
    {
        if (Souris.CX <= this.MenuW)
        {
            let x = Math.floor((event.Param.x - this.CX) / Tilesets.TileSize);
            let y = Math.floor((event.Param.y - this.CY + this.ScrollPosition) / Tilesets.TileSize);
            let id = x + y * 8;
            if(x > -1 && x < 8)
            {
                this.SelectedTiles = [id];
                this.#DragStart = new Vector(x,y)// event.Param 
                this.#DragStart.z = 0;
            }
        }
        else
        {
            this.Clique_Tilemap();
        }
    }
    /**
     * Evenement lié a la fin de drag gauche de la souris
     * @param {UIEvenement} event Evenement associé
     */
    Souris_DragEnd(event)
    {
        if (Souris.CX <= this.MenuW)
        {
            if(this.#DragStart && this.#DragStart.z == 0)
            {
                let x = Math.floor((event.Param.x - this.CX) / Tilesets.TileSize);
                let y = Math.floor((event.Param.y - this.CY + this.ScrollPosition) / Tilesets.TileSize);
                if(x > -1 && x < 8)
                {
                    this.SelectedTiles = [];
                    this.Edit_SelectedTile = [];
                    for(let i = Math.min(x,this.#DragStart.x); i <= Math.max(x,this.#DragStart.x); i++)
                    {
                        this.Edit_SelectedTile.push([]);
                        for(let j = Math.min(y,this.#DragStart.y); j <= Math.max(y,this.#DragStart.y); j++)
                        {
                            this.SelectedTiles.push(i + j * 8);
                            this.Edit_SelectedTile[this.Edit_SelectedTile.length - 1].push(i + j * 8);
                        }
                    }
                }
            }
        }
        else // Edition sur tilemap
        {
            this.Clique_Tilemap();
        }
    }
    /**
     * Evenement lié au drag gauche de la souris
     * @param {UIEvenement} event Evenement associé
     */
    Souris_Dragging(event)
    {
        if (Souris.CX <= this.MenuW)
        {
            if(this.#DragStart && this.#DragStart.z == 0)
            {
                let x = Math.floor((event.Param.x - this.CX) / Tilesets.TileSize);
                let y = Math.floor((event.Param.y - this.CY + this.ScrollPosition) / Tilesets.TileSize);
                if(x > -1 && x < 8)
                {
                    this.SelectedTiles = [];
                    for(let i = Math.min(x,this.#DragStart.x); i <= Math.max(x,this.#DragStart.x); i++)
                    {
                        for(let j = Math.min(y,this.#DragStart.y); j <= Math.max(y,this.#DragStart.y); j++)
                        {
                            this.SelectedTiles.push(i + j * 8);
                        }
                    }
                }
            }
        }
        else // Edition sur tilemap
        {
            this.Clique_Tilemap();
        }
    }
    /**
     * Evenement lié au début de drag droit de la souris
     * @param {UIEvenement} event Evenement associé
     */
    Souris_RightDragStart(event)
    {
        if (Souris.CX <= this.MenuW)
        {
            this.ClearSelectedTile();
            this.#DragStart = this.PositionPreview;
            this.#DragStart.z = 1;
        }
        else
        {
            if(this.CurrentLayer.PointIn(this.PositionPreview.x, this.PositionPreview.y))
            {
                this.DragSelectTiles = [this.PositionPreview, this.PositionPreview];
                //this.SelectedTiles = [this.CurrentLayer.GetTileAt(this.PositionPreview)];
                this.#DragStart = this.PositionPreview;
                this.#DragStart.z = 2;
            }
        }
    }
    /**
     * Evenement lié a la fin de drag droit de la souris
     * @param {UIEvenement} event Evenement associé
     */
    Souris_RightDragEnd(event)
    {
        if (Souris.CX <= this.MenuW)
        {
            if(this.#DragStart && this.#DragStart.z == 1)
            {
                this.ClearSelectedTile();
            }
        }
        else // Edition sur tilemap
        {
            if(this.#DragStart && this.#DragStart.z == 2)
            {
                let x = Math.min(this.CurrentLayer.W - 1, Math.max(0,this.PositionPreview.x));
                let y = Math.min(this.CurrentLayer.H - 1, Math.max(0,this.PositionPreview.y));
                this.SelectedTiles = [];
                this.Edit_SelectedTile = [];
                for(let i = Math.min(x,this.#DragStart.x); i <= Math.max(x,this.#DragStart.x); i++)
                {
                    this.Edit_SelectedTile.push([]);
                    for(let j = Math.min(y,this.#DragStart.y); j <= Math.max(y,this.#DragStart.y); j++)
                    {
                        let id = this.CurrentLayer.GetTileAt(new Vector(i,j));
                        this.SelectedTiles.push(id);
                        this.Edit_SelectedTile[this.Edit_SelectedTile.length - 1].push(id);
                    }
                }
                this.DragSelectTiles = [];
            }
        }
    }
    /**
     * Evenement lié au drag droit de la souris
     * @param {UIEvenement} event Evenement associé
     */
    Souris_RightDragging(event)
    {
        if (Souris.CX <= this.MenuW)
        {
            if(this.#DragStart && this.#DragStart.z == 1)
            {
                this.ClearSelectedTile();
            }
        }
        else // Edition sur tilemap
        {
            if(this.#DragStart && this.#DragStart.z == 2)
            {
                let x = Math.min(this.CurrentLayer.W - 1, Math.max(0,this.PositionPreview.x));
                let y = Math.min(this.CurrentLayer.H - 1, Math.max(0,this.PositionPreview.y));
                this.DragSelectTiles = [
                    new Vector(Math.min(x,this.#DragStart.x), Math.min(y,this.#DragStart.y)),
                    new Vector(Math.max(x,this.#DragStart.x), Math.max(y,this.#DragStart.y))];
            }
        }
    }

    //#endregion

    /**
     * Sauvegarde le tilemap dans la base de donnée et sauvegarde la base de donnée
     */
    Sauvegarder()
    {
        let name =  prompt("Donner un nom à ce tilemap.\nAttention ce nom doit être unique, si un tilemap du même nom existe, il sera supprimé.\nLe fichier téléchargé ne doit lui pas changer de nom est vient remplacer celui présent dans le dossier Fichier du site Web", "Maison1");
        console.log(name)
        this.T.Sauvegarder(name)
        Datas.SauvegarderData();
    }
    /**
     * Dessine la liste des tiles
     */
    SetTile()
    {
        this.AllTiles = document.createElement("canvas").getContext("2d");
        this.AllTiles.canvas.width = Tilesets.TileSize * 8;
        this.AllTiles.canvas.height = Math.ceil(Tilesets.TileNbr / 8) * Tilesets.TileSize;;

        for (let t = 0; t < Tilesets.TileNbr; t++) 
        {
            let x = Tilesets.TileSize * (t % 8)
            let y = Tilesets.TileSize * Math.floor(t / 8)
            let tile = Tilesets.TileFromIndex(t);
            if (tile.Animation)
                this.#AnimatedTiles.push(t);

            tile.Dessin(this.AllTiles, x, y, t, 0);
        }
    }
    /**
     * Dessine la liste des tiles;
     * @override
     * @param {CanvasRenderingContext2D} Context Front context
     */
    DessinFrontUI(Context)
    {
        for (let a = 0; a < this.#AnimatedTiles.length; a++) 
        {
            let x = Tilesets.TileSize * (a % 8)
            let y = Tilesets.TileSize * Math.floor(a / 8)
            let tile = Tilesets.TileFromIndex(a);
            tile.Dessin(this.AllTiles, x, y, a, 0);
        }


        Context.drawImage(this.AllTiles.canvas, 
            0, this.ScrollPosition, this.AllTiles.canvas.width, this.Panel.CH, 
            this.Panel.Padding[0], this.Panel.Padding[1], this.AllTiles.canvas.width, this.Panel.CH)


        let ctx = document.createElement("canvas").getContext("2d");
        ctx.canvas.width = this.AllTiles.canvas.width;
        ctx.canvas.height = this.Panel.CH;

        let done = [];
        for (let i = 0; i < this.SelectedTiles.length; i++) 
        {
            let a = this.SelectedTiles[i];
            if (!done.includes(a))
            {
                done.push(a);
                let x = Tilesets.TileSize * (a % 8)
                let y = Tilesets.TileSize * Math.floor(a / 8) - this.ScrollPosition
    
                ctx.fillStyle = this.SelectionCouleur.RGBA()
                ctx.strokeStyle = this.SelectionCouleur.RGB()
                ctx.lineWidth = 2;
                ctx.fillRect(x, y, Tilesets.TileSize, Tilesets.TileSize);
                ctx.strokeRect(x, y, Tilesets.TileSize, Tilesets.TileSize);
            }
        }

        Context.drawImage(ctx.canvas, 
            0, 0, ctx.canvas.width, this.Panel.CH, 
            this.Panel.Padding[0], this.Panel.Padding[1], ctx.canvas.width, this.Panel.CH)

    }
    /**
     * Effectue une mise à jour du UI
     * @override
     * @param {float} Delta Nombre de frame depuis la dernière mise a jour
     */
    Calcul(Delta)
    {
        super.Calcul(Delta)
        this.RefreshUI();
        this.Souris_Hover()
    }
    /**
     * Active ou desactive la vision des collision du tilemap
     */
    ToggleCollisionView()
    {
        if (this.SelectedLayer == 0)
            TileMap_Layer.CollisionDebug = true;
        else
            TileMap_Layer.CollisionDebug = false;
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
     * Action du clique gauche sur le menu latérale dans la liste des tiles
     */
    Clique_MenuTile()
    {
        let x = Math.floor((Souris.CX - this.CX) / Tilesets.TileSize);
        let y = Math.floor((Souris.CY - this.CY + this.ScrollPosition) / Tilesets.TileSize);
        let id = x + y * 8;
        if(x >= 0 && x < 8)
        {
            this.SelectedTiles = [id];
            this.Edit_SelectedTile = [[id]];
        }
    }
    /**
     * Action du clique gauche sur le tilemap
     */
    Clique_Tilemap()
    {
        this.PositionPreview = this.T.PositionIndex(Souris.X, Souris.Y);
        this.PositionPreview.z = this.#UID;
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
                        if (this.Edit_SelectedLayer == TileMap_Layer.CollisionMaskName)
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