class Voiture extends Lutin
{
    constructor(X, Y)
    {
        //let X = Math.random() * 500000
        //let Y = Math.random() * 200 - 100

        let textures = ["Images/Moto/Voiture1.png",
        "Images/Moto/Voiture2.png",
        "Images/Moto/Voiture3.png",
        "Images/Moto/Voiture4.png"];


        super(X,Y,textures)

        this.Vitesse = 3 +  Math.random()

        this.BasculerCostume(Math.floor(Math.random() * textures.length))

        this.CentreRotation = new Vecteur2(0.5,1)

        this.ColRect = [0,0,0,0]

        this.MultiplicateurAjouté = false;
    }

    Calcul(Delta)
    {
        super.Calcul(Delta)

        this.X -= this.Vitesse * Delta

        this.Z = - this.Y 
       
        
        let L = this.Image.width * this.Zoom / 100;
        let H = this.Image.height * this.Zoom / 100;
        let decalageX = L / 2;
        let decalageY = 0;
        
        this.ColRect = [this.X - decalageX, this.Y - decalageY + H/3, L, H/3] 
    }
}