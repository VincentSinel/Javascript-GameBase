class Tile
{
    constructor(Texture, Contact = false, TailleTile = undefined)
    {
        this.TileMap = undefined;
        this.Texture = Texture;
        this.TailleTile = TailleTile;
        this.Image = new Image();
        var _this = this;
        this.Image.onload = function(e) {_this.ImageCharge()};
        this.Image.src = Texture;
        this.DI = 0;
        this.Contact = Contact;
        this.Nombre = 1;
        this.OffSet = 0;
        this.ImageChargé = false;
    }

    ImageCharge()
    {
        this.ImageChargé = true;
    }

    SetTileMap(Tilemap)
    {
        this.TileMap = Tilemap;
        this.DI = Math.sqrt(2) * this.TileMap.TailleTile
    }

    Dessin(Context, X, Y, index = 0)
    {
        if (this.ImageChargé)
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