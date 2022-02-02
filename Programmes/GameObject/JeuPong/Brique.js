class Brique extends Lutin
{
    //Je peut changer les paramètre de ce lutin et générer son contenu ensuite
    constructor(X,Y) 
    {
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
    }


    // Redéfinition de la fonction calcul
    Calcul() 
    {
        super.Calcul();

    }
}