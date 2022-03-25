class Tile_Multi extends Tile
{
    constructor(Texture, TailleTile, Contact = false)
    {
        super(Texture, Contact, TailleTile)

        this.W = Math.floor(this.Image.width / this.TailleTile);
        this.Nombre = this.W * Math.floor(this.Image.height / this.TailleTile);
        if (this.TileMap)
            this.TileMap.RecalculTileLength()
    }

    Dessin(Context, X, Y, index = 0, voisin = 0)
    {
        index = (index - this.OffSet)
        let x = index % this.W * this.TailleTile;
        let y = Math.floor(index / this.W) * this.TailleTile;
        Context.drawImage(this.Image, x, y, this.TailleTile, this.TailleTile, X, Y, this.TailleTile, this.TailleTile);
    }
}