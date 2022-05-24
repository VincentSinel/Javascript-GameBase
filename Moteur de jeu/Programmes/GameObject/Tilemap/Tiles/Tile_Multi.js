/**
 * MultiTile depuis un spritesheet
 * @class
 * @extends Tile
 */
class Tile_Multi extends Tile
{
    /**
     * Créer un nouveau multi-tile
     * @param {string} Texture Nom du fichier image
     * @param {int} TailleTile Taille du tile
     */
    constructor(Texture, TailleTile)
    {
        super(Texture, TailleTile)

        this.W = Math.floor(this.Image.width / this.TailleTile);
        this.Nombre = this.W * Math.floor(this.Image.height / this.TailleTile);
    }
    /**
     * Effectue le dessin du tile à un emplacement précis du context
     * @param {CanvasRenderingContext2D} Context Contexte de dessin
     * @param {float} X Position X du tile
     * @param {float} Y Position Y du tile
     * @param {int} [index = 0] index du tile dans le spritesheet
     */
    Dessin(Context, X, Y, index = 0)
    {
        index = (index - this.OffSet)
        let x = index % this.W * this.TailleTile;
        let y = Math.floor(index / this.W) * this.TailleTile;
        Context.drawImage(this.Image, x, y, this.TailleTile, this.TailleTile, X, Y, this.TailleTile, this.TailleTile);
    }
}