class Map extends Scene
{
    constructor(Name)
    {
        super(Name);

    }

    Exit()
    {
        this.RemoveChildren(Player);
    }

    Enter(X,Y)
    {
        super.Enter(X,Y)
        Player.X = X;
        Player.Y = Y;
        this.AddChildren(Player);
    }
}