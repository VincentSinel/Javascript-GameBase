class TileMap_Layer extends Drawable
{
    static #PartMaxSize = 1024;
    static #PartSize = 0;

    static CollisionMaskName = "collision"
    static CollisionDebug = false;
    static CollisionDebugColor = "#FF0000AA";

    #Parts;
    #HasAnimation;

    constructor(Name,Tilemap,Z = 0,fill = -1)
    {
        super(0,0,Z)
        this.Name = Name;
        this.Tilemap = Tilemap;

        this.Frame = 0;
        this.#HasAnimation = false;

        this.#Parts = [];

        
        let needfill = false;
        this.Contenue = [];
        if (fill instanceof TileMap_Layer)
        {
            if (fill.W == this.W && fill.H == this.H)
            {
                this.Contenue = fill.Contenue;
            }
            else
            {
                needfill = true;
            }
        }
        else
        {
            needfill = true;
        }

        if (needfill)
        {
            if (fill !== parseInt(fill, 10))
            {
                fill = -1;
            }
            for (let y = 0; y < this.H; y++) 
            {     
                for (let x = 0; x < this.W; x++) 
                {       
                    this.Contenue.push(fill)
                }
            }
        }

        if(this.Name != TileMap_Layer.CollisionMaskName)
        {
            this.#CutPart();
            this.#RedrawAllParts();
        }
    }

    get W()
    {
        return this.Tilemap.W;
    }
    get H()
    {
        return this.Tilemap.H;
    }
    get PositionPreview()
    {
        return UI_EditionTileMap.Instance.PositionPreview;
    }
    get Edit_TileToDraw()
    {
        return UI_EditionTileMap.Instance.Edit_SelectedTile;
    }

    
    get TextWidth()
    {
        return this.Tilemap.TextWidth;
    }
    get TextHeight()
    {
        return this.Tilemap.TextHeight;
    }
    get CentreRotation()
    {
        return this.Tilemap.CentreRotation
    }
    set CentreRotation(value)
    {
        super.CentreRotation = value;
    }

    EncodeData()
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
        return [this.Name, this.Z, data];
    }

    Load(data)
    {
        let datas = data.split(",");
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
        if(this.Name != TileMap_Layer.CollisionMaskName)
        {
            this.#RedrawAllParts();
        }
    }

    GetTileAt(vector)
    {
        if (this.PointIn(vector.x,vector.y))
            return this.Contenue[vector.x + vector.y * this.W];
        else
            return -1;
    }

    PointIn(X,Y)
    {
        return X >= 0 && X < this.W && Y >= 0 && Y < this.H;
    }

    ChangerTile(X,Y,TileID)
    {
        this.Contenue[X + Y * this.W] = TileID;
        if(this.Name != TileMap_Layer.CollisionMaskName)
        {
            for (let i = -1; i < 2; i++) 
            {
                for (let j = -1; j < 2; j++) 
                {
                    if (this.PointIn(X + i, Y + j))
                        this.#RedrawTile(X + i,Y + j);
                }
            }
        }
    }

    #CutPart()
    {
        TileMap_Layer.#PartSize = Math.floor(TileMap_Layer.#PartMaxSize / Tilesets.TileSize);
        let c = Math.ceil(this.W / TileMap_Layer.#PartSize);
        let l = Math.ceil(this.H / TileMap_Layer.#PartSize);

        let news = TileMap_Layer.#PartSize * Tilesets.TileSize;

        this.#Parts = [];
        for (let x = 0; x < c; x++) 
        {
            this.#Parts.push([])
            for (let y = 0; y < l; y++) 
            {
                this.#Parts[x].push([])
                for (let anim = 0; anim < 4; anim++) 
                {
                    let ctx = document.createElement("canvas").getContext("2d");
                    ctx.canvas.width = news;
                    ctx.canvas.height = news;
                    ctx.Empty = true;

                    this.#Parts[x][y].push(ctx)
                }
            }      
        }
    }

    #RedrawAllParts()
    {
        let news = TileMap_Layer.#PartSize * Tilesets.TileSize;
        for (let x = 0; x < this.#Parts.length; x++) 
        {
            for (let y = 0; y < this.#Parts[x].length; y++) 
            {
                for (let anim = 0; anim < 4; anim++) 
                {
                    this.#Parts[x][y][anim].clearRect(0,0,news,news)
                }
            }      
        }

        for (let x = 0; x < this.W; x++) {
            for (let y = 0; y < this.H; y++) 
            {
                this.#RedrawTile(x,y);
            } 
        }

    }

    #RedrawTile(x,y)
    {
        let cpx = Math.floor(x / TileMap_Layer.#PartSize);
        let cpy = Math.floor(y / TileMap_Layer.#PartSize);
        let id = this.Contenue[x + y * this.W];

        let tile = Tilesets.TileFromIndex(id);

        let dx = (x - cpx * TileMap_Layer.#PartSize) * Tilesets.TileSize;
        let dy = (y - cpy * TileMap_Layer.#PartSize) * Tilesets.TileSize;

        for (let anim = 0; anim < 4; anim  ++) 
        {
            this.#Parts[cpx][cpy][anim].clearRect(dx, dy, Tilesets.TileSize, Tilesets.TileSize);
        }
        
        if (tile)
        {
            if (tile instanceof Tile_Auto &&
                tile.Animation)
            {
                for (let anim = 1; anim < 4; anim  ++) 
                {
                    let v = 0;

                    if (tile.Voisin)
                    {
                        v = this.#CalculVoisin(id, x, y);
                    }
                    tile.Dessin(this.#Parts[cpx][cpy][anim], dx, dy, id, v, anim - 1);
                    this.#Parts[cpx][cpy][anim].Empty = false;
                }
            }
            else if (!tile.Animation)
            {
                let v = 0;

                if (tile.Voisin)
                {
                    v = this.#CalculVoisin(id, x, y);
                }
                tile.Dessin(this.#Parts[cpx][cpy][0], dx, dy, id, v);
                this.#Parts[cpx][cpy][0].Empty = false;
            }
            else
            {
                this.#HasAnimation = true;
            }
        }
    }

    #CalculVoisin(id, x, y)
    {
        let v = 0;
        if (x - 1 < 0 || y - 1 < 0 ||
            this.Contenue[x - 1 + (y - 1) * this.W] == id)
            v += 32
        if (y - 1 < 0 ||
            this.Contenue[x + 0 + (y - 1) * this.W] == id)
            v += 64
        if (x + 1 >= this.W ||y - 1 < 0 ||
            this.Contenue[x + 1 + (y - 1) * this.W] == id)
            v += 128
        if (x - 1 < 0 ||
            this.Contenue[x - 1 + (y + 0) * this.W] == id)
            v += 8
        if (x + 1 >= this.W  ||
            this.Contenue[x + 1 + (y + 0) * this.W] == id)
            v += 16
        if (x - 1 < 0 || y + 1 >= this.H ||
            this.Contenue[x - 1 + (y + 1) * this.W] == id)
            v += 1
        if (y + 1 >= this.H ||
            this.Contenue[x + 0 + (y + 1) * this.W] == id)
            v += 2
        if (x + 1 >= this.W  || y + 1 >= this.H ||
            this.Contenue[x + 1 + (y + 1) * this.W] == id)
            v += 4
        return v;
    }

    Calcul(Delta)
    {
        if (this.Animation)
        {
            while(this.NextUpdate < TotalTime)
            {
                this.Frame = (this.Frame + 1) % this.Frames;
                this.NextUpdate += 1 / this.Vitesse;
            }
        }
    }

    Dessin(Context)
    { 
        if (this.Name == TileMap_Layer.CollisionMaskName)
        {
            if (this.Tilemap.Edit)
            {
                Context.strokeStyle = Color.CouleurByte(255,100,255,1);
                Context.lineWidth = 2;
                Context.strokeRect(0,0,this.W * Tilesets.TileSize, this.H * Tilesets.TileSize)
            }
            if (TileMap_Layer.CollisionDebug &&
                Camera.Zoom > 0.5)
            {
                let rect = this.Tilemap.RectDraw;
                if (!rect)
                    return;
                let sx = Math.floor(rect.x / Tilesets.TileSize);
                let sy = Math.floor(rect.y / Tilesets.TileSize);
                let ex = Math.ceil((rect.x + rect.w) / Tilesets.TileSize);
                let ey = Math.ceil((rect.y + rect.h) / Tilesets.TileSize);
    
                Context.fillStyle = TileMap_Layer.CollisionDebugColor;
                for (let px = Math.max(0,sx); px < Math.min(this.W, ex); px++) 
                {
                    for (let py = Math.max(0,sy); py < Math.min(this.H, ey); py++) 
                    {
                        let id = this.Contenue[px + py * this.W];
                        if (id > -1)
                        {
                            Context.fillRect(px * Tilesets.TileSize, py * Tilesets.TileSize, Tilesets.TileSize, Tilesets.TileSize)
                        }
                    }
                }
                
                if (this.Tilemap.Edit &&
                    this.Tilemap.Edit_SelectedLayer == this.Name)
                {
                    for (let i = 0; i < this.Edit_TileToDraw.length; i++) 
                    {
                        for (let j = 0; j < this.Edit_TileToDraw[i].length; j++) 
                        {
                            let x = this.PositionPreview.x + i;
                            let y = this.PositionPreview.y + j;
                            if (this.PointIn(x,y))
                            {
                                if (this.Edit_TileToDraw[i][j] >= 0)
                                {
                                    Context.fillStyle = TileMap_Layer.CollisionDebugColor;
                                    Context.fillRect(x * Tilesets.TileSize, y * Tilesets.TileSize, Tilesets.TileSize, Tilesets.TileSize)
                                }
                                else
                                {
                                    Context.fillStyle = "Black";
                                    Context.fillRect(x * Tilesets.TileSize, y * Tilesets.TileSize, Tilesets.TileSize, Tilesets.TileSize)
                                }

                            }
                        }
                    }

                    if (UI_EditionTileMap.Instance.DragSelectTiles.length > 0)
                    {
                        let v1 = UI_EditionTileMap.Instance.DragSelectTiles[0];
                        let v2 = v1.to(UI_EditionTileMap.Instance.DragSelectTiles[1]);
                        Context.fillStyle = "white";
                        Context.fillStyle = Color.CouleurByte(100,255,255,0.2);
                        Context.strokeStyle = Color.CouleurByte(100,255,255);
                        Context.lineWidth = 2;
                        Context.fillRect(
                            v1.x * Tilesets.TileSize, 
                            v1.y * Tilesets.TileSize, 
                            (v2.x + 1) * Tilesets.TileSize, 
                            (v2.y + 1) * Tilesets.TileSize);
                        Context.strokeRect(
                            v1.x * Tilesets.TileSize, 
                            v1.y * Tilesets.TileSize, 
                            (v2.x + 1) * Tilesets.TileSize, 
                            (v2.y + 1) * Tilesets.TileSize);
                    }
                }
                return
            }
            else
            {
                return;
            }
        }
        else
        {
            let rect = this.Tilemap.RectDraw;
            if (!rect)
                return;
            let size = TileMap_Layer.#PartSize * Tilesets.TileSize;
            let sx = Math.floor(rect.x / size);
            let sy = Math.floor(rect.y / size);
            let ex = Math.ceil((rect.x + rect.w) / size);
            let ey = Math.ceil((rect.y + rect.h) / size);
    
            let fx = (rect.x + rect.w) - (ex - 1) * size;
            let fy = (rect.y + rect.h) - (ey - 1) * size;
    
            for (let px = Math.max(0,sx); px < Math.min(this.#Parts.length, ex); px++) 
            {
                for (let py = Math.max(0,sy); py < Math.min(this.#Parts[0].length, ey); py++) 
                {
                    
                    let ox = 0;
                    let oy = 0;
                    let w, h;
                    if (px == sx)
                        ox = rect.x - sx * size;
                    if (py == sy)
                        oy = rect.y - sy * size;
                    if (px == ex - 1)
                        w = fx;
                    else
                        w = size - ox;
                    if (py == ey - 1)
                        h = fy;
                    else
                        h = size - oy;
    
                    if (!this.#Parts[px][py][0].Empty)
                        Context.drawImage(this.#Parts[px][py][0].canvas, ox, oy, w, h, ox + px * size, oy + py * size, w, h);
                    
                    if (!this.#Parts[px][py][Tile_Auto.Frame + 1].Empty)
                        Context.drawImage(this.#Parts[px][py][Tile_Auto.Frame + 1].canvas, ox, oy, w, h, ox + px * size, oy + py * size, w, h);
                    

                    //for (let anim = 0; anim < 4; anim  ++) 
                    //{
                    //    if (!this.#Parts[px][py][anim].Empty)
                    //        Context.drawImage(this.#Parts[px][py][anim].canvas, ox, oy, w, h, ox + px * size, oy + py * size, w, h);
                    //}
                }
            }
    
            sx = Math.max(0, Math.floor(rect.x / Tilesets.TileSize));
            sy = Math.max(0, Math.floor(rect.y / Tilesets.TileSize));
            ex = Math.min(this.W, Math.ceil((rect.x + rect.w) / Tilesets.TileSize));
            ey = Math.min(this.H, Math.ceil((rect.y + rect.h) / Tilesets.TileSize));

            if (this.#HasAnimation)
            {
                for (let px = sx; px < ex; px++) 
                {
                    for (let py = sy; py < ey; py++) 
                    {
                        let id = this.Contenue[px + py * this.W];
                        let tile = Tilesets.TileFromIndex(id);
        
                        if (tile instanceof Tile_Animation)
                        {
                            tile.Dessin(Context, px * Tilesets.TileSize, py * Tilesets.TileSize, id);
                        }
                    }
                }
            }

            if (this.Tilemap.Edit &&
                this.Tilemap.Edit_SelectedLayer == this.Name)
            {
                Context.fillStyle = "Black";
                for (let i = 0; i < this.Edit_TileToDraw.length; i++) 
                {
                    for (let j = 0; j < this.Edit_TileToDraw[i].length; j++) 
                    {
                        let x = this.PositionPreview.x + i;
                        let y = this.PositionPreview.y + j;
                        if (this.PointIn(x,y))
                        {
                            let tile = Tilesets.TileFromIndex(this.Edit_TileToDraw[i][j]);
            
                            if (tile)
                                tile.Dessin(Context, x * Tilesets.TileSize, y * Tilesets.TileSize, this.Edit_TileToDraw[i][j]);
                            else
                                Context.fillRect(x * Tilesets.TileSize, y * Tilesets.TileSize, Tilesets.TileSize, Tilesets.TileSize);
                        }
                    }
                }

                if (UI_EditionTileMap.Instance.DragSelectTiles.length > 0)
                {
                    let v1 = UI_EditionTileMap.Instance.DragSelectTiles[0];
                    let v2 = v1.to(UI_EditionTileMap.Instance.DragSelectTiles[1]);
                    Context.fillStyle = "white";
                    Context.fillStyle = Color.CouleurByte(100,255,255,0.2);
                    Context.strokeStyle = Color.CouleurByte(100,255,255);
                    Context.lineWidth = 2;
                    Context.fillRect(
                        v1.x * Tilesets.TileSize, 
                        v1.y * Tilesets.TileSize, 
                        (v2.x + 1) * Tilesets.TileSize, 
                        (v2.y + 1) * Tilesets.TileSize);
                    Context.strokeRect(
                        v1.x * Tilesets.TileSize, 
                        v1.y * Tilesets.TileSize, 
                        (v2.x + 1) * Tilesets.TileSize, 
                        (v2.y + 1) * Tilesets.TileSize);
                }
            }
        }
        
    }

}