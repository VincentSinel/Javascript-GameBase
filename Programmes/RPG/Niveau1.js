class Niveau1 extends Scene 
{
    constructor()
    {
        super();

        this.TileMap = this.AddChildren(new TileMap(0, 0,50,50));
        this.TileMap.Charger("TestContact");
        this.TileMap.Edition();

        this.PNJ = this.AddChildren(new PNJ(200,200,["Images/Joueur/B_1.png"]));
        this.PNJ.onSpeak = function() { Teleportation(Niveau2, 0, 60)}

    }
}