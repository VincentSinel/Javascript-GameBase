class Niveau2 extends Scene 
{
    constructor()
    {
        super();
        this.LoadTilemap();

        this.TileMap = this.AjoutEnfant(new TileMap(0, 0,50,50));
        this.TileMap.Charger("Map1");
        this.TileMap.Edition();

        this.PNJ = this.AjoutEnfant(new PNJ(200,200,["Images/Joueur/B_1.png"]));
    }

    LoadTilemap()
    {
        Tilesets.Add_Auto("Images/Tilemap/A1_Eau1.png", "A1");
        Tilesets.Add_Auto("Images/Tilemap/A1_Eau2.png", "A1");
        Tilesets.Add_Auto("Images/Tilemap/A2_Extérieur2.png", "A2");
        Tilesets.Add_Auto("Images/Tilemap/A3_Mur3.png", "A3");
        Tilesets.Add_Auto("Images/Tilemap/A4_Mur3.png", "A4");
        Tilesets.Add_Auto("Images/Tilemap/A5_Extérieur12.png", "A5");
        Tilesets.Add_Auto("Images/Tilemap/A5_Extérieur8.png", "A5");
        Tilesets.Add_Auto("Images/Tilemap/A5_Intérieur9.png", "A5");
        Tilesets.Add_Auto("Images/Tilemap/A5_Donjon4.png", "A5");
        Tilesets.Add_Auto("Images/Tilemap/A5_Extérieur6.png", "A5");
    }

    Calcul(Delta)
    {
        super.Calcul(Delta);

        this.TileMap.Calcul(Delta);

        this.PNJ.Calcul(Delta);
        Player.Calcul(Delta);
    }
}