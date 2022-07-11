class Map extends Scene
{
    constructor(Name)
    {
        super(Name);

    }

    Exit()
    {
        this.RemoveChildren(Actor.Current);
    }

    Enter(X,Y)
    {
        super.Enter(X,Y)
        Actor.Current.X = X;
        Actor.Current.Y = Y;
        this.AddChildren(Actor.Current);
    }
}