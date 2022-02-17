class Joueur extends Lutin
{
    constructor(X,Y)
    {
        let Costumes =[
            "Images/Joueur/B_0.png",
            "Images/Joueur/B_1.png",
            "Images/Joueur/B_2.png",
            "Images/Joueur/D_0.png",
            "Images/Joueur/D_1.png",
            "Images/Joueur/D_2.png",
            "Images/Joueur/G_0.png",
            "Images/Joueur/G_1.png",
            "Images/Joueur/G_2.png",
            "Images/Joueur/H_0.png",
            "Images/Joueur/H_1.png",
            "Images/Joueur/H_2.png"
        ]

        super(X,Y,Costumes)
        this.Vue = 0
    }


    Calcul()
    {
        super.Calcul()
        let deplacementx = 0;
        let deplacementy = 0;

        if (Clavier.ToucheBasse("z"))
            deplacementy += 1
        if (Clavier.ToucheBasse("s"))
            deplacementy -= 1
        if (Clavier.ToucheBasse("q"))
            deplacementx -= 1
        if (Clavier.ToucheBasse("d"))
            deplacementx += 1

        this.X += deplacementx * 2
        this.Y += deplacementy * 2

        if (deplacementx > 0 && deplacementy == 0)
            this.Vue = 1
        if (deplacementx < 0 && deplacementy == 0)
            this.Vue = 2
        if (deplacementy > 0 && deplacementx == 0)
            this.Vue = 3
        if (deplacementy < 0 && deplacementx == 0)
            this.Vue = 0
        
        this.BasculerCostume(this.Vue * 3 + Math.floor(this.Time / 12) % 3)
    }


}