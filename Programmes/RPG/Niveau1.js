class Niveau1 extends Scene
{
    static Joueur;


    constructor()
    {
        super();
        Niveau1.Joueur = new Joueur(0,-300, this)

        let Tiles = [];
        Tiles.push(new Tile_Auto("Images/Tilemap/Tile-TileA1.png", 32, "A1", true))
        Tiles.push(new Tile_Auto("Images/Tilemap/Tile-TileA2.png", 32, "A2", true))
        Tiles.push(new Tile_Auto("Images/Tilemap/Tile-TileA3.png", 32, "A3", true))
        Tiles.push(new Tile_Auto("Images/Tilemap/Tile-TileA4.png", 32, "A4", true))
        Tiles.push(new Tile_Auto("Images/Tilemap/Tile-TileA5.png", 32, "A5", true))
        Tiles.push(new Tile_Auto("Images/Tilemap/Tile-TileBVX-ace sapin.png", 32, "A5", true))
        Tiles.push(new Tile_Auto("Images/Tilemap/Tile-TileCVX.png", 32, "A5", true))
        Tiles.push(new Tile_Auto("Images/Tilemap/Tile-TileDVX.png", 32, "A5", true))
        Tiles.push(new Tile_Auto("Images/Tilemap/Tile-TileEVX.png", 32, "A5", true))


        this.TileMaps = [];
        for (let t = 0; t < 5; t++) 
        {
            let tilemap = new TileMap(-25 * 32,-25 * 32,50,50, Tiles);
            tilemap.Charger("Maison1_" + t)
            tilemap.Edition();
            this.TileMaps.push(tilemap);
        }

        this.MiddleTileMap = this.TileMaps[2];

        this.PNJ = new PNJ(200,200,["Images/Joueur/B_1.png"], Niveau1)

        this.ZObject.push(Niveau1.Joueur);
        this.ZObject.push(this.PNJ)
    }

    Calcul(Delta)
    {
        super.Calcul(Delta)

        for (let t = 0; t < this.TileMaps.length; t++) {
            this.TileMaps[t].Calcul(Delta);
        }

        Niveau1.Joueur.Calcul(Delta);
        this.PNJ.Calcul(Delta);

        Camera.X = Niveau1.Joueur.X;
        Camera.Y = Niveau1.Joueur.Y;

        this.PNJ.Z = -this.PNJ.Y;
        Niveau1.Joueur.Z = -Niveau1.Joueur.Y

    }

    Dessin(Context)
    {
        for (let t = 0; t <= 2; t++) {
            this.TileMaps[t].Dessin(Context);
        }
        super.Dessin(Context);
        for (let t = 3; t < this.TileMaps.length; t++) {
            this.TileMaps[t].Dessin(Context);
        }
    }


}