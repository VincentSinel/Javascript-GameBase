class Niveau1 extends Map 
{
    constructor()
    {
        super("Niveau1");

        this.TileMap = this.AddChildren(new TileMap(0, 0,50,50));
        this.TileMap.Charger("TestContact");
        this.TileMap.Edition();

        this.PNJ = this.AddChildren(new PNJ(200,200,["Images/Joueur/B_1.png"]));
        this.PNJ.onSpeak = function() { Scene.ChangeScene(Niveau2, 0, 60)}

    }
}