class Voiture extends Lutin
{

    constructor()
    {
        //let X = Voiture.Test * 50;
        //let Y = 100 - Voiture.Test;
        let X = Math.random() * 5000
        let Y = Math.random() * 200 - 100

        super(X,Y,["Images/Moto/Voiture.png"])

        this.Vitesse = 0;//1 + Math.random() * 5;
        this.Zoom = 50;


        this.CentreRotation = new Vecteur2(0.5,1)
    }

    Calcul(Delta)
    {
        super.Calcul(Delta)

        this.X -= this.Vitesse * Delta

        this.Z = - this.Y 
        
        let IW =  this.Image.width * this.Zoom / 100;
        let IH =  this.Image.height * this.Zoom / 100;
        Debug.AjoutRectangle([Camera.AdapteX(this.X - IW / 2), Camera.AdapteY(this.Y + IH / 2), IW, IH / 2])
    }

    Collision()
    {
        let IW =  this.Image.width * this.Zoom / 100;
        let IH =  this.Image.height * this.Zoom / 100;
        return [this.X - IW / 2, this.Y + IH / 2, IW, IH / 2]
    }
}