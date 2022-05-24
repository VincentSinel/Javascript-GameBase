/**
 * Gestionnaire de Tile. 
 * Cela permet de ne pas créer de tile en double et d'avoir 
 * toujours la même liste de dessin lors de l'édition d'un tilemap.
 */
class Tilesets
{
    static LoadedTilesets = []
    static TileSize = 32;
    static #TilesLength = 0;
    static #TilesNumber = [];
    static #LoadedTilesetsName = [];

    /**
     * Nombre total de tile
     * @type {int}
     */
    static get TileNbr()
    {
        return Tilesets.#TilesLength;
    }
    /**
     * Ajoute un tile d'animation si celui-ci n'existe pas
     * @param {string} name Nom du fichier image
     */
    static Add_Animation(name)
    {
        if (!Tilesets.#LoadedTilesetsName.includes(name + "_Animation"))
        {
            let tile = new Tile_Animation(name, Tilesets.TileSize)
            Tilesets.LoadedTilesets.push(tile)
            Tilesets.#RecalculTileLength()
            Tilesets.#LoadedTilesetsName.push(name + "_Animation");
        }
    }
    /**
     * Ajoute un auto tile si celui-ci n'existe pas
     * @param {string} name Nom du fichier image
     * @param {string} [type = "A5"] Type du tilemap 
     */
    static Add_Auto(name, type = "A5")
    {
        if (!Tilesets.#LoadedTilesetsName.includes(name + "_Auto_" + type))
        {
            Tilesets.LoadedTilesets.push(new Tile_Auto(name, Tilesets.TileSize, type))
            Tilesets.#RecalculTileLength()
            Tilesets.#LoadedTilesetsName.push(name + "_Auto_" + type);
        }
    }
    /**
     * Ajoute un multi-tile si celui-ci n'existe pas
     * @param {string} name Nom du fichier image
     */
    static AddMulti(name)
    {
        if (!Tilesets.#LoadedTilesetsName.includes(name + "_Multi"))
        {
            Tilesets.LoadedTilesets.push(new Tile_Multi(name, Tilesets.TileSize))
            Tilesets.#RecalculTileLength()
            Tilesets.#LoadedTilesetsName.push(name + "_Multi");
        }
    }
    /**
     * Ajoute un tile si celui-ci n'existe pas
     * @param {string} name Nom du fichier image
     */
    static AddTile(name)
    {
        if (!Tilesets.#LoadedTilesetsName.includes(name + "_Normal"))
        {
            Tilesets.LoadedTilesets.push(new Tile_Auto(name))
            Tilesets.#RecalculTileLength()
            Tilesets.#LoadedTilesetsName.push(name + "_Normal");
        }
    }
    /**
     * Recalcul le nombre total de tile
     */
    static #RecalculTileLength()
    {
        Tilesets.#TilesLength = 0;
        Tilesets.#TilesNumber = [];
        let j = 0;
        Tilesets.LoadedTilesets.forEach(tile => {
            tile.OffSet = Tilesets.#TilesLength;
            Tilesets.#TilesLength += tile.Nombre;
            for (let i = 0; i < tile.Nombre; i++) 
            {     
                Tilesets.#TilesNumber.push(j);  
            }
            j++;
        });
    }
    /**
     * Récupère un tile à partir de son index global
     * @param {int} id index global du tile
     * @returns {Tile|boolean} Tile selectionné ou faux si inexistant
     */
    static TileFromIndex(id)
    {
        if (id < 0 || id >= Tilesets.#TilesNumber.length )
            return false//Tilesets.LoadedTilesets[0];
        return Tilesets.LoadedTilesets[Tilesets.#TilesNumber[id]];
    }
    /**
     * Mets à jour les tiles
     * @param {float} Delta Frame depuis la précédentes mise à jour
     */
    static Update(Delta)
    {
        Tile_Auto.Calcul(Delta);
        for (let t = 0; t < Tilesets.LoadedTilesets.length; t++) 
        {
            Tilesets.LoadedTilesets[t].Calcul(Delta);
        }
    }
}