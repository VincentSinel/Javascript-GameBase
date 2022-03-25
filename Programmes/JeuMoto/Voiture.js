class Voiture extends Lutin
{

    constructor()
    {
        //let X = Voiture.Test * 50;
        //let Y = 100 - Voiture.Test;
        let X = 1000 + Math.random() * 50000
        let Y = Math.random() * 200 - 100

        super(X,Y,["Images/Moto/Voiture.png"])

        this.Vitesse = 1 + Math.random() * 5;
        this.Zoom = 50;


        this.CentreRotation = new Vecteur2(0.5,1)
    }

    Calcul(Delta)
    {
        super.Calcul(Delta)

        this.X -= this.Vitesse * Delta

        this.Z = - this.Y 
        
        let L =  this.Image.width * this.Zoom / 100;
        let H =  this.Image.height * this.Zoom / 100;
        Debug.AjoutRectangle([this.X - L / 2, this.Y + H / 2, L, H / 2])
    }

    Collision()
    {
        let L =  this.Image.width * this.Zoom / 100;
        let H =  this.Image.height * this.Zoom / 100;
        return [this.X - L / 2, this.Y + H / 2, L, H / 2]
    }
}