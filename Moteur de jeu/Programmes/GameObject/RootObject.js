class RootObject extends GameObject
{
    /**
     * Crée un objet racine dans la scene voulu.
     * @constructor
     * @param {Scene} Scene Scene lié a cette racine.
     */
    constructor(Scene)
    {
        super(0,0,0)
        this.Parent = this;
        this.Visible = true;
        this.Root = this;
        this.Scene = Scene;

        this.DrawAbleObject = [];
    }

    //#region GETTER SETTER
    
    /**
     * Position X Global dans la scene(vis à vis des objets parents).
     * @override
     * @type {float}
     */
    get GX()
    {
        return this.X;
    }
    /**
     * Position Y Global dans la scene(vis à vis des objets parents).
     * @override
     * @type {float}
     */
    get GY()
    {
        return this.Y;
    }
    /**
     * Position Z Global dans la scene(vis à vis des objets parents).
     * @override
     * @type {float}
     */
    get GZ()
    {
        return this.Z;
    }
    /**
     * Angle Global dans la scene en radian(vis à vis des objets parents).
     * @override
     * @type {float}
     */
    get GRadDirection()
    {
        return this.RadDirection;
    }

    //#endregion


    /**
     * Supprime l'objet enfant selectionné.
     * @override
     * @param {GameObject} object Objet enfant à supprimer.
     * @return {boolean} Represente si l'action c'est effectué avec succés.
     */
    RemoveChildren(object)
    {
        if (object.Parent == this)
        {
            this.DeleteDrawable(object);
            super.RemoveChildren(object);
            return true;
        }
        return false;
    }
    /**
     * Supprime l'objet et ces enfants de la liste des objets dessinable.
     * @param {GameObject} object Objet enfant à supprimer.
     */
    DeleteDrawable(object)
    {
        object.Children.forEach(element => {
            this.DeleteDrawable(element);
        });
        console.log(this.DrawAbleObject)
        if (this.DrawAbleObject.includes(object))
        {
            console.log("remove")
            this.DrawAbleObject.splice(this.DrawAbleObject.indexOf(object), 1);
        }
        console.log(object)
        console.log(this.DrawAbleObject)
        this.SortDrawable()
    }
    /**
     * Supprime l'objet selectionné
     * @override
     */
    Destroy()
    {
        throw "Vous ne pouvez pas supprimer la racine des GameObject"
    }
    /**
     * Mets à jour le GameObject ainsi que ces enfants
     * @override
     * @param {float} Delta Temps depuis la dernière frame
     */
    Update(Delta)
    {
        super.Update(Delta)
        //this.SortDrawable()
    }
    /**
     * Trie les objets dessinable par ordre du Z.
     */
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
    /**
     * Effectue le dessin de cette objet en prenant en compte la position de la camera.
     * @param {CanvasRenderingContext2D} Context Context de dessin
     */
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