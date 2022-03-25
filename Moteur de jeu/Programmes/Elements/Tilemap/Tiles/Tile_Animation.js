class Tile_Animation extends Tile
{
    constructor(Texture, TailleTile, Contact = false)
    {
        super(Texture, Contact, TailleTile)

        this.Nombre = 1;
        this.Frames = this.Image.width / TailleTile
        this.Frame = 0;
        this.Vitesse = 10;
        this.NextUpdate = 0;
    }

    Calcul(Delta)
    {
        super.Calcul(Delta)

        while(this.NextUpdate < TotalTime)
        {
            this.Frame = (this.Frame + 1) % this.Frames;
            this.NextUpdate += 1 / this.Vitesse;
            this.TileMap.NeedRefresh()
        }
    }

    Dessin(Context, X, Y, index = 0, voisin = 0)
    {
        let x = this.Frame * this.TailleTile;
        Context.drawImage(this.Image, x, 0, this.TailleTile, this.TailleTile, X, Y, this.TailleTile, this.TailleTile);
    }
}