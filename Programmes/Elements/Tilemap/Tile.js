class Tile
{
    constructor(Texture)
    {
        this.TileMap = undefined;
        this.Texture = Texture;
        this.Image = new Image();
        this.Image.src = Texture;
        this.DI = 0;
    }

    SetTileMap(Tilemap)
    {
        this.TileMap = Tilemap;
        this.DI = Math.sqrt(2) * this.TileMap.TailleTile
    }

    Dessin(Context, X, Y)
    {
        Context.drawImage(this.Image, X, Y);
    }

    InCamera(X,Y)
    {
        let dx = (Camera.X - X) * Camera.Zoom / 100 * this.TileMap.Zoom / 100;
        let dy = (Camera.Y + Y) * Camera.Zoom / 100 * this.TileMap.Zoom / 100;
        let d = Math.sqrt(dx * dx + dy * dy);
        if (d < (Diagonal / 2 + this.DI * Camera.Zoom / 100 + 20))
            return true;
        else
            return false;
    }
}