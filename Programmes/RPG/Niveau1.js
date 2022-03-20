class Niveau1
{
    static Joueur;

    constructor()
    {
        Niveau1.Joueur = new Joueur(0,0)

        let Tiles = [];
        Tiles.push(new Tile("Images/Tilemap/Dirt1.png"))
        Tiles.push(new Tile("Images/Tilemap/Grass1.png"))
        Tiles.push(new Tile("Images/Tilemap/Grass2.png"))
        Tiles.push(new Tile("Images/Tilemap/Sand1.png"))
        Tiles.push(new Tile("Images/Tilemap/Snow1.png"))
        Tiles.push(new Tile("Images/Tilemap/Stone1.png"))
        Tiles.push(new Tile("Images/Tilemap/Water1.png"))
        this.Tilemap = new TileMap(0,0,200,200,Tiles)
        this.Tilemap.Edit = false;

        this.PNJ = new PNJ(200,200,["Images/Joueur/B_1.png"], Niveau1)
    }

    Calcul(Delta)
    {
        this.Tilemap.Calcul(Delta);
        Niveau1.Joueur.Calcul(Delta);
        this.PNJ.Calcul(Delta);

        Camera.X = Niveau1.Joueur.X;
        Camera.Y = Niveau1.Joueur.Y;

    }

    Dessin(Context)
    {
        this.Tilemap.Dessin(Context);
        Niveau1.Joueur.Dessin(Context);
        this.PNJ.Dessin(Context);
    }
}