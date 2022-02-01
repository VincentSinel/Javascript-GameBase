class ExempleLutin extends Lutin 
{
    //Je peut changer les paramètre de ce lutin et générer son contenu ensuite
    constructor() 
    {
        var X = EntierAleat(-Ecran_Largeur / 2, Ecran_Largeur / 2) // Position X au hasard sur l'écran
        var Y = EntierAleat(-Ecran_Hauteur / 2, Ecran_Hauteur / 2) // Position Y au hasard sur l'écran

        var Costumes = [
            "Images/Brique1.png",
            "Images/Brique2.png",
            "Images/Brique3.png",
            "Images/Brique4.png",
            "Images/Brique5.png"
        ]
        //Cette fonction appel le constructeur de la class Lutin
        // Le "super" de manière général permet d'appeler des élèments de la class parents
        super(X,Y, Costumes);

        this.BasculerCostume(EntierAleat(5))
        this.Time = EntierAleat(255) // Temps de génération aléatoire
        //this.Direction = NombreAleat(360); // Prend une direction aléatoire
        // Création d'un nouveau paramètre vitesse
        //this.Vitesse =NombreAleat(5);

        //EntierAleat(255);
    }


    // Redéfinition de la fonction calcul
    Calcul() 
    {
        super.Calcul(); // Appel la fonction calcul de la class parente

        // Il est possible de faire des actions ici comme les script sur scratch
        // Quelque exemple :
        //this.Avancer(this.Vitesse)
        //this.Tourner(Math.cos(this.Time / 20) * 2)

    }

}