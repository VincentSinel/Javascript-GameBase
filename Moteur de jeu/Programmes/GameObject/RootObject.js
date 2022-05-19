class RootObject extends GameObject
{
    constructor(Scene)
    {
        super(0,0,0)
        this.Parent = this;
        this.Visible = true;
        this.Root = this;
        this.Scene = Scene;

        this.DrawAbleObject = [];
    }

    RemoveChildren(object)
    {
        super.RemoveChildren(object);
        if (this.DrawAbleObject.includes(object))
        {
            this.DrawAbleObject.splice(this.DrawAbleObject.indexOf(object), 1);
        }
    }

    get GX()
    {
        return this.X;
    }
    get GY()
    {
        return this.Y;
    }
    get GZ()
    {
        return this.Z;
    }
    get GRadDirection()
    {
        return this.RadDirection;
    }


    Destroy()
    {
        throw "Vous ne pouvez pas supprimer la racine des GameObject"
    }

    Update(Delta)
    {
        super.Update(Delta)
        this.SortDrawable()
    }

    SortDrawable()
    {
        // For performance reasons, we will first map to a temp array, sort and map the temp array to the objects array.
        var map = this.DrawAbleObject.map(function (el, index) {
            return { index : index, value : el.GZ };
        });
        
        // Now we need to sort the array by z index.
        map.sort(function (a, b) {
            return a.value - b.value;
        });
        
        let objects = this.DrawAbleObject;
        // We finaly rebuilt our sorted objects array.
        this.DrawAbleObject = map.map(function (el) {
            return objects[el.index];
        });
    }

    Draw(Context)
    {
        if (this.Visible)
        {
            // Sauvegarde la position actuel du canvas 
            Context.save();
            // Adapte la position à celle de la camera
            Camera.DeplacerCanvas(Context)

            for (let child = 0; child < this.DrawAbleObject.length; child++)
            {
                this.DrawAbleObject[child].Draw(Context);
            }

            // Retourne à la position initiale du canvas
            Context.restore(); 
        }
    }

}