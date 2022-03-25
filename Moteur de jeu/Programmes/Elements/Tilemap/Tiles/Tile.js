class Tile
{
    constructor(Texture, Contact = false, TailleTile = undefined)
    {
        this.TileMap = undefined;
        this.Texture = Texture;
        this.TailleTile = TailleTile;
        
        this.Image = Textures.Charger(Texture);

        this.DI = 0;
        this.Contact = Contact;
        this.Nombre = 1;
        this.OffSet = 0;
        this.Voisin = false;
    }

    Calcul(Delta)
    {
        
    }

    SetTileMap(Tilemap)
    {
        this.TileMap = Tilemap;
        this.DI = Math.sqrt(2) * this.TileMap.TailleTile
    }

    Dessin(Context, X, Y, index = 0, voisin = 0)
    {
        Context.drawImage(this.Image, X, Y);
    }
}