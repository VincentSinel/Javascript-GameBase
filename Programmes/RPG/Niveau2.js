class Niveau2 extends Map 
{
    constructor()
    {
        super("Niveau2");

        this.TileMap = this.AddChildren(new TileMap(0, 0,50,50));
        this.TileMap.Charger("Map1");
        this.TileMap.Edition();

        this.PNJ = this.AddChildren(new PNJ(200,200,["Images/Joueur/B_1.png"]));
    }
}