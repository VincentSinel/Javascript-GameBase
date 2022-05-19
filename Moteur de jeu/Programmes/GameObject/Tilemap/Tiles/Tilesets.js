class Tilesets
{
    static LoadedTilesets = []
    static TileSize = 32;
    static #TilesLength = 0;
    static #TilesNumber = [];
    static #LoadedTilesetsName = [];

    static get TileNbr()
    {
        return Tilesets.#TilesLength;
    }

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
    static Add_Auto(name, type = "A5")
    {
        if (!Tilesets.#LoadedTilesetsName.includes(name + "_Auto_" + type))
        {
            Tilesets.LoadedTilesets.push(new Tile_Auto(name, Tilesets.TileSize, type))
            Tilesets.#RecalculTileLength()
            Tilesets.#LoadedTilesetsName.push(name + "_Auto_" + type);
        }
    }
    static AddMulti(name)
    {
        if (!Tilesets.#LoadedTilesetsName.includes(name + "_Multi"))
        {
            Tilesets.LoadedTilesets.push(new Tile_Multi(name, Tilesets.TileSize))
            Tilesets.#RecalculTileLength()
            Tilesets.#LoadedTilesetsName.push(name + "_Multi");
        }
    }
    static AddTile(name)
    {
        if (!Tilesets.#LoadedTilesetsName.includes(name + "_Normal"))
        {
            Tilesets.LoadedTilesets.push(new Tile_Auto(name))
            Tilesets.#RecalculTileLength()
            Tilesets.#LoadedTilesetsName.push(name + "_Normal");
        }
    }

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

    static TileFromIndex(id)
    {
        if (id < 0 || id >= Tilesets.#TilesNumber.length )
            return false//Tilesets.LoadedTilesets[0];
        return Tilesets.LoadedTilesets[Tilesets.#TilesNumber[id]];
    }

    static Update(Delta)
    {
        Tile_Auto.Calcul(Delta);
        for (let t = 0; t < Tilesets.LoadedTilesets.length; t++) 
        {
            Tilesets.LoadedTilesets[t].Calcul(Delta);
        }
    }
}