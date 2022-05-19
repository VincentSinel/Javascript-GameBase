class GameObject
{
    #Direction = 0;
    #Root = undefined;

    constructor(X, Y, Z)
    {
        this.Position = new Vector(X,Y,Z);
        this.Zoom = 1.0;
        this.Time = 0;
        this.#Direction = 0;
        this.Visible = false;
        
        this.Parent = undefined;
        this.Children = [];
        this.Destroyed = false;
    }

    ChangeParent(parent)
    { // TODO Remove previous parent child
        this.Parent = Parent;
        if (this.Parent)
            this.Root = Parent.Root;
    }

    get Root()
    {
        return this.#Root
    }
    set Root(v)
    {
        this.#Root = v;
        this.PostSetParent();
        this.Children.forEach(element => {
            element.Root = v;
        });
    }

    get X()
    {
        return this.Position.x
    }
    set X(value)
    {
        this.Position.x = value
    }
    get Y()
    {
        return this.Position.y
    }
    set Y(value)
    {
        this.Position.y = value
    }
    get Z()
    {
        return this.Position.z
    }
    set Z(value)
    {
        this.Position.z = value
    }

    get RadDirection()
    {
        return this.#Direction;
    }
    set RadDirection(value)
    {
        this.#Direction = value;
    }
    get Direction()
    {
        return this.#Direction * 180.0 / Math.PI;
    }
    set Direction(value)
    {
        this.#Direction = value * Math.PI / 180;
    }

    get GPosition()
    {
        return new Vector(this.GX, this.GY, this.GZ);
    }
    get GX()
    {
        return this.Parent.GX + this.X * Math.cos(this.Parent.GRadDirection) - this.Y * Math.sin(this.Parent.GRadDirection);
    }
    get GY()
    {
        return this.Parent.GY + this.X * Math.sin(this.Parent.GRadDirection) + this.Y * Math.cos(this.Parent.GRadDirection);
    }
    get GZ()
    {
        return this.Z + this.Parent.GZ;
    }
    get GRadDirection()
    {
        return this.Parent.GRadDirection + this.#Direction;
    }

    get CX()
    {
        return Camera.AdapteX(this.GX)
    }
    get CY()
    {
        return Camera.AdapteX(this.CY)
    }

    AddChildren(object)
    {
        if (!(object instanceof GameObject))
        {
            throw "Seul un GameObject peut-être ajouter comme enfant"
        }

        object.Parent = this;
        object.Root = this.Root;
        if (!this.Children.includes(object))
            this.Children.push(object);
        object.PostSetParent();
        return object
    }

    PostSetParent()
    {
        // Add logic after parent set
    }

    RemoveChildren(object)
    {
        if (this.Children.includes(object))
        {
            this.Children.splice(this.Children.indexOf(object), 1);
        }
        if (object.Parent == this)
            object.Parent = undefined;
    }

    Destroy()
    {
        this.Parent.RemoveChildren(this);
    }

    Update(Delta)
    {
        this.Time += Delta;
        for (let c = 0; c < this.Children.length; c++) {
            this.Children[c].Update(Delta);
        }
        this.Calcul(Delta);
    }

    Calcul(Delta)
    {
        // Override by element
    }
}