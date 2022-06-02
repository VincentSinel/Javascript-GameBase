/**
 * Objet du jeu
 * @class
 */
class GameObject
{

    /**
     * Effectue une Update static d'object particulier
     * @param {float} Delta Nombre de frame depuis la précédente mise à jour
     */
    static Update(Delta)
    {
        Lutin_RPGMaker.AnimationTimer += Delta;
    }


    // Angle de l'objet
    #Direction = 0;
    // Racine des objets
    #Root = undefined;

    /**
     * Créer un GameObject à la position souhaitée
     * @constructor
     * @param {float} X Position X
     * @param {float} Y Position Y
     * @param {float} Z Position Z
     */
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

    //#region  Getter Setter

    /**
     * Root GameObject of the Scene.
     * @type {RootObject}
     */
    get Root()
    {
        return this.#Root
    }
    set Root(v)
    {
        this.#Root = v;
        this.PostSetRoot();
        this.Children.forEach(element => {
            element.Root = v;
        });
    }
    /**
     * Position X.
     * @type {float}
     */
    get X()
    {
        return this.Position.x
    }
    set X(value)
    {
        this.Position.x = value
    }
    /**
     * Position Y.
     * @type {float}
     */
    get Y()
    {
        return this.Position.y
    }
    set Y(value)
    {
        this.Position.y = value
    }
    /**
     * Position Z.
     * @type {float}
     */
    get Z()
    {
        return this.Position.z
    }
    set Z(value)
    {
        this.Position.z = value;
        if (this.Root)
            this.Root.SortDrawable();
    }
    /**
     * Angle en radian.
     * @type {float}
     */
    get RadDirection()
    {
        return this.#Direction;
    }
    set RadDirection(value)
    {
        this.#Direction = value;
    }
    /**
     * Angle en degré.
     * @type {float}
     */
    get Direction()
    {
        return this.#Direction * 180.0 / Math.PI;
    }
    set Direction(value)
    {
        this.#Direction = value * Math.PI / 180;
    }
    /**
     * Position Global dans la scene(vis à vis des objets parents).
     * @type {Vector}
     */
    get GPosition()
    {
        return new Vector(this.GX, this.GY, this.GZ);
    }
    /**
     * Position X Global dans la scene(vis à vis des objets parents).
     * @type {float}
     */
    get GX()
    {
        return this.Parent.GX + this.X * Math.cos(this.Parent.GRadDirection) - this.Y * Math.sin(this.Parent.GRadDirection);
    }
    /**
     * Position Y Global dans la scene(vis à vis des objets parents).
     * @type {float}
     */
    get GY()
    {
        return this.Parent.GY + this.X * Math.sin(this.Parent.GRadDirection) + this.Y * Math.cos(this.Parent.GRadDirection);
    }
    /**
     * Position Z Global dans la scene(vis à vis des objets parents).
     * @type {float}
     */
    get GZ()
    {
        return this.Z + this.Parent.GZ;
    }
    /**
     * Angle Global dans la scene en radian(vis à vis des objets parents).
     * @type {float}
     */
    get GRadDirection()
    {
        return this.Parent.GRadDirection + this.#Direction;
    }

    /**
     * Position X dans l'ecran (vis à vis de la camera).
     * @type {float}
     */
    get CX()
    {
        return Camera.AdapteX(this.GX)
    }
    /**
     * Position Y dans l'ecran (vis à vis de la camera).
     * @type {float}
     */
    get CY()
    {
        return Camera.AdapteX(this.CY)
    }

    //#endregion

    /**
     * Change le parent actuel du GameObject
     * @param {GameObject} parent Nouveau Parent
     */
    ChangeParent(parent)
    {
    if (this.Parent)
    {
        this.Parent.RemoveChildren(this);
    }
    this.Parent = Parent;
    if (this.Parent)
        this.Root = Parent.Root;
    }
    /**
     * Ajoute un enfant à l'objet actuel
     * @param {GameObject} object Enfant à ajouter
     * @returns {GameObject} Objet créé
     */
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
        return object;
    }
    /**
     * Supprime l'objet enfant selectionné
     * @param {GameObject} object Objet enfant à supprimer
     * @return {boolean} Represente si l'action c'est effectué avec succés.
     */
    RemoveChildren(object)
    {
        if (object.Parent == this)
        {
            if (this.Children.includes(object))
            {
                this.Children.splice(this.Children.indexOf(object), 1);
            }
            object.Parent = undefined;
            object.Root = undefined;
            return true
        }
        return false
    }
    /**
     * S'execute après l'assignation de la racine.
     */
    PostSetRoot()
    {
        // Add logic after parent set
    }
    /**
     * Supprime l'objet selectionné
     */
    Destroy()
    {
        this.Parent.RemoveChildren(this);
        while(this.Children.length > 0)
        {
            this.Children[0].Destroy();
        }
    }
    /**
     * Mets à jour le GameObject ainsi que ces enfants
     * @param {float} Delta Temps depuis la dernière frame
     */
    Update(Delta)
    {
        this.Time += Delta;
        for (let c = 0; c < this.Children.length; c++) {
            this.Children[c].Update(Delta);
        }
        this.Calcul(Delta);
    }
    /**
     * Appel la mise à jour de l'utilisateur
     * @param {float} Delta Temps depuis la dernière frame
     */
    Calcul(Delta)
    {
        // Override by element
    }
}