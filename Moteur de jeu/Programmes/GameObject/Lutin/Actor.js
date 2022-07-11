class Actor extends Lutin_RPGMaker
{
    static Current = undefined;
    static Pause = 0;

    constructor(X,Y, Texture, Simple = true, IdCostum = 0, DirVue = 0)
    {
        super(X,Y,Texture,Simple,IdCostum, DirVue)

        Actor.Current = this;
    }

    Update(Delta)
    {
        if (Actor.Pause === 0)
        {
            super.Update(Delta);
        }
    }
}