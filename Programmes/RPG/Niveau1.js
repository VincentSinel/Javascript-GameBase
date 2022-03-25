class Niveau1 extends Scene
{
    static Joueur;


    constructor()
    {
        super();
        Niveau1.Joueur = new Joueur(0,0)

        let Tiles = [];
        //Tiles.push(new Tile_Animation("Images/Tilemap/Water.png", 32))
        //Tiles.push(new Tile("Images/Tilemap/Dirt1.png"))
        //Tiles.push(new Tile("Images/Tilemap/Grass1.png"))
        //Tiles.push(new Tile("Images/Tilemap/Grass2.png"))
        //Tiles.push(new Tile("Images/Tilemap/Sand1.png"))
        //Tiles.push(new Tile("Images/Tilemap/Snow1.png"))
        //Tiles.push(new Tile("Images/Tilemap/Stone1.png"))
        //Tiles.push(new Tile("Images/Tilemap/Water1.png", true))
        Tiles.push(new Tile_Auto("Images/Tilemap/Tile-TileA1.png", 32, "A1"))
        Tiles.push(new Tile_Auto("Images/Tilemap/Tile-TileA2.png", 32, "A2"))
        Tiles.push(new Tile_Auto("Images/Tilemap/Tile-TileA3.png", 32, "A3"))
        Tiles.push(new Tile_Auto("Images/Tilemap/Tile-TileA4.png", 32, "A4"))
        this.Tilemap = new TileMap(-32 * 100,-32 * 100, 200, 200, Tiles)
        this.Tilemap.Charger("TestMap1")
        this.Tilemap.Edition();

        this.PNJ = new PNJ(200,200,["Images/Joueur/B_1.png"], Niveau1)

        this.ZObject.push(Niveau1.Joueur);
        this.ZObject.push(this.PNJ)
    }

    Calcul(Delta)
    {
        super.Calcul(Delta)
        this.Tilemap.Calcul(Delta);
        Niveau1.Joueur.Calcul(Delta);
        this.PNJ.Calcul(Delta);

        Camera.X = Niveau1.Joueur.X;
        Camera.Y = Niveau1.Joueur.Y;

        this.PNJ.Z = -this.PNJ.Y;
        Niveau1.Joueur.Z = -Niveau1.Joueur.Y

        this.Tilemap.Contact_AABB(Niveau1.Joueur);
    }

    Dessin(Context)
    {
        this.Tilemap.Dessin(Context);
        super.Dessin(Context);
    }
}