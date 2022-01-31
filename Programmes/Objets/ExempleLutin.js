class ExempleLutin extends Lutin 
{
    //Je peut changer les paramètre de ce lutin et générer son contenue ensuite
    constructor() 
    {
        var X = -Ecran_Largeur / 2 + Math.random() * Ecran_Largeur // Position X au hasard sur l'écran
        var Y = -Ecran_Hauteur / 2 + Math.random() * Ecran_Hauteur // Position Y au hasard sur l'écran

        var Costumes = [
            "Images/Brique1.png",
            "Images/Brique2.png",
            "Images/Brique3.png",
            "Images/Brique4.png",
            "Images/Brique5.png"
        ]
        //Cette fonction appel le constructeur de la class Lutin
        super(X,Y, Costumes);

        this.BasculerCostume(EntierAleat(5))
        this.Time = EntierAleat(255) // Temps de génération aléatoire
        this.Direction = NombreAleat(360); // Prend une direction aléatoire
        // Création d'un nouveau paramètre vitesse
        this.Vitesse =NombreAleat(5);

        EntierAleat(255);
    }


    // Redéfinition de la fonction calcul
    Calcul() 
    {
        super.Calcul(); // Appel la fonction calcul de la class parente

        this.Avancer(this.Vitesse)
        this.Tourner(Math.cos(this.Time / 20) * 2)

    }

}