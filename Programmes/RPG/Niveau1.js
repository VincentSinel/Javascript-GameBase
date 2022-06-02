class Niveau1 extends Map 
{
    constructor()
    {
        super("Niveau1");

        this.TileMap = this.AddChildren(new TileMap(0, 0,50,50));
        this.TileMap.Charger("Maison1");
        //this.TileMap.Edition();

        this.PNJ = this.AddChildren(new PNJ(200,200,["Images/Joueur/B_1.png"]));
        this.PNJ.onSpeak = function() { Scene.ChangeScene(Niveau2, 0, 60)}

        this.CreerCailloux();
    }

    CreerCailloux()
    {
        let nbr = 50;
        for (let i = 0; i < nbr; i++) 
        {
            let x = (Math.random() - 0.5) * 1600;
            let y = (Math.random() - 0.5) * 1600;
            this.AddChildren(new Pierre(x,y));
        }
    }
}