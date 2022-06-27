/**
 * Tile d'animation
 * @class
 * @extends Tile
 */
class Tile_Animation extends Tile
{
    /**
     * Créer un nouveau tile animation
     * @constructor
     * @param {string} Texture Nom du fichier image
     * @param {int} TailleTile Taille du tile
     */
    constructor(Texture, TailleTile)
    {
        super(Texture, TailleTile)

        this.Nombre = 1;
        this.Frames = this.Image.width / TailleTile
        this.Frame = 0;
        this.Vitesse = 10;
        this.NextUpdate = 0;
        this.Animation = true;
    }
    /**
     * Mets à jour l'animation
     * @param {float} Delta Frame depuis la précédentes mise à jour
     */
    Calcul(Delta)
    {
        super.Calcul(Delta)

        while(this.NextUpdate < Game.TotalTime)
        {
            this.Frame = (this.Frame + 1) % this.Frames;
            this.NextUpdate += 1 / this.Vitesse;
        }
    }
    /**
     * Effectue le dessin du tile à un emplacement précis du context
     * @param {CanvasRenderingContext2D} Context Contexte de dessin
     * @param {float} X Position X du tile
     * @param {float} Y Position Y du tile
     */
    Dessin(Context, X, Y)
    {
        let x = this.Frame * this.TailleTile;
        Context.drawImage(this.Image, x, 0, this.TailleTile, this.TailleTile, X, Y, this.TailleTile, this.TailleTile);
    }
}