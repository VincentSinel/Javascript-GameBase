/**
 * Base pour générer un tile de tilemap
 * @class
 */
class Tile
{
    /**
     * Créer un nouveau tile
     * @constructor
     * @param {string} Texture Nom du fichier image
     * @param {int} TailleTile Taille du tile
     */
    constructor(Texture, TailleTile = undefined)
    {
        this.Texture = Texture;
        this.TailleTile = TailleTile;
        this.Animation = false;
        
        this.Image = Textures.Charger(Texture);

        this.Nombre = 1;
        this.OffSet = 0;
        this.Voisin = false;
    }
    /**
     * Mets à jour le tile
     * @param {float} Delta Frame depuis la précédente mise à jour
     */
    Calcul(Delta)
    {
        
    }
    /**
     * Effectue le dessin du tile à un emplacement précis du context
     * @param {CanvasRenderingContext2D} Context Contexte de dessin
     * @param {float} X Position X du tile
     * @param {float} Y Position Y du tile
     */
    Dessin(Context, X, Y)
    {
        Context.drawImage(this.Image, X, Y);
    }
}