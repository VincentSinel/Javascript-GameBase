class Route extends Lutin
{
    constructor(decalage)
    {
        super(0,0,["Images/Moto/Route.jpg"])

        this.decalage = decalage;
        this.Zoom = 160;
    }

    Calcul(Delta)
    {
        let w = this.Image.width * this.Zoom / 100
        let c = Camera.X - 512
        this.X = w * this.decalage + c - c % w
    }
}