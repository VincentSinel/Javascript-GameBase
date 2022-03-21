class Niveau2 extends Scene
{
    static Joueur;


    constructor()
    {
        super();
        Niveau2.Joueur = new Joueur(0,0)

        let Tiles = [];
        Tiles.push(new Tile("Images/Tilemap/Dirt1.png"))
        Tiles.push(new Tile("Images/Tilemap/Grass1.png"))
        Tiles.push(new Tile("Images/Tilemap/Grass2.png"))
        Tiles.push(new Tile("Images/Tilemap/Sand1.png"))
        Tiles.push(new Tile("Images/Tilemap/Snow1.png"))
        Tiles.push(new Tile("Images/Tilemap/Stone1.png"))
        Tiles.push(new Tile("Images/Tilemap/Water1.png", true))
        Tiles.push(new MultiTile("Images/Tilemap/Tile-exterieur.png", 32))
        this.Tilemap = new TileMap(-3200,-3200,200,200,Tiles)
        //this.Tilemap.Edition();
        this.Tilemap.Charger("Maison1")

        this.PNJ = new PNJ(200,200,["Images/Joueur/B_1.png"], Niveau2)

        this.ZObject.push(Niveau2.Joueur);
        this.ZObject.push(this.PNJ)
    }

    Calcul(Delta)
    {
        super.Calcul(Delta)
        this.Tilemap.Calcul(Delta);
        Niveau2.Joueur.Calcul(Delta);
        this.PNJ.Calcul(Delta);

        Camera.X = Niveau2.Joueur.X;
        Camera.Y = Niveau2.Joueur.Y;

        this.PNJ.Z = -this.PNJ.Y;
        Niveau2.Joueur.Z = -Niveau2.Joueur.Y

        this.Tilemap.Contact_AABB(Niveau2.Joueur);
    }

    Dessin(Context)
    {
        this.Tilemap.Dessin(Context);
        super.Dessin(Context);
    }
}