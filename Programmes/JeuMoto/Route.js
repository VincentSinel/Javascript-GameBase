class Route extends Lutin
{
    constructor(decalage)
    {
        super(0,0,["Images/Moto/Route.jpg"])

        this.Z = -20000
        this.decalage = decalage;
        this.Zoom = 1.60;
    }

    /**
     * Effectue la mise à jour
     * @param {float} Delta Nombre de frame depuis la dernière mise à jour
     */
    Calcul(Delta)
    {
        let w = this.TextWidth * this.Zoom
        let c = Camera.X - 512
        this.X = w * this.decalage + c - c % w
    }
}