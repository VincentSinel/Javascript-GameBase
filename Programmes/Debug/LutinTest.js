class LutinTest extends Lutin
{
    constructor(X,Y, name = "Images/Moto/Voiture.png")
    {
        super(X,Y,[name])

        this.Z = -this.Y
    }
}