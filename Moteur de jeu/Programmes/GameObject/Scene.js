/**
 * Un scene gére les GameObject qui lui sont rattaché, effectue le dessin et le calcul
 * @class
 */
class Scene
{
    static #Exiting = false
    static #ChangingFunction = Scene.#WaitForExiting();

    //static CurrentScene = new Scene("Main")
    
    /**
     * Effectue le changement de scene (avec fade in et fade out)
     * @param {Scene} scene Nouvelle Scene (instanciable)
     * @param {float} X Nouvelle Position X camera
     * @param {float} Y Nouvelle Position Y camera
     */
    static ChangeScene(scene, X = 0,Y = 0)
    {
        Scene.#Exiting = [scene, X, Y];
    }

    /**
     * Gère la transition entre la scene actuel et la nouvelle
     * @param {float} Delta Frame depuis la dernière mise à jour
     */
    static * #WaitForExiting(Delta)
    {
        while(true)
        {
            Game.Fading = 1;
            if (Game.SceneActuel)
            {
                while(Game.Fading != 0)
                {
                    yield 0;
                }
                Game.SceneActuel.Exit();
            }
            else
            {
                Game.Fade = 1.0
            }
            Game.SceneActuel = new Scene.#Exiting[0]()
            Game.SceneActuel.Enter(Scene.#Exiting[1],Scene.#Exiting[2]);
            Game.Fading = -1;
            while(Game.Fading != 0)
            {
                yield 0;
            }
            Scene.#Exiting = false;
            yield 1;
        }
    }
    /**
     * Mets à jour global pour le changement de scene
     * @param {float} Delta Nombre de frame depuis la dernière mise à jour
     */
    static Update(Delta)
    {
        if (Scene.#Exiting)
        {
            Scene.#ChangingFunction.next(Delta)
        }
    }

    #GameSpeed = 1.0;
    #Pause = false;
    #TotalFrame = 0;
    #KeepUpdating = false;
    #Name = "";
    #Root;

    /**
     * Créer une scene
     * @constructor
     * @param {string} Name Nom de la scene
     */
    constructor(Name)
    {
        this.#Root = new RootObject(this);
        this.#Name = Name;
    }

    //#region GETTER SETTER

    /**
     * Vitesse de calcul de la scene
     * @type {float}
     */
    get GameSpeed()
    {
        return this.Pause ? 0 : this.#GameSpeed;
    }
    set GameSpeed(v)
    {
        if (typeof(v) === "number")
        {
            if (v >= 0)
                this.#GameSpeed = v;
            else
                Debug.Log("La valeur choisie pour GameSpeed n'est pas correct. Celle-ci doit être compris entre 0 et 1  valeur ► " + v, 1);
        }
        else
        {
            Debug.LogErreurType("GameSpeed", "number", v);
        }
    }
    /**
     * Définit si la scene est en pause
     * @type {boolean}
     */
    get Pause()
    {
        return this.#Pause || this.#GameSpeed === 0;
    }
    set Pause(v)
    {
        if (typeof(v) === "boolean")
        {
            this.#Pause = v;
        }
        else
        {
            Debug.LogErreurType("Pause", "boolean", v);
        }
    }
    /**
     * Nombre de frame total depuis la création de la scene
     * @type {int}
     */
    get TotalFrame()
    {
        return Math.floor(this.#TotalFrame);
    }
    /**
     * Définit si la scene doit continuer d'être mise à jour lors du fadein fadeout
     * @type {boolean}
     */
    get KeepUpdating()
    {
        return this.#KeepUpdating;
    }
    set KeepUpdating(v)
    {
        if (typeof(v) === "boolean")
        {
            this.#KeepUpdating = v;
        }
        else
        {
            Debug.LogErreurType("KeepUpdating", "boolean", v);
        }
    }
    /**
     * Nom de la scene
     * @type {string}
     */
    get Name()
    {
        return this.#Name;
    }
    /**
     * Racine des GameObject
     * @type {RootObject}
     */
    get Root()
    {
        return this.#Root;
    }


    //#endregion

    /**
     * Ajoute un GameObject dans la scene
     * @param {GameObject} object Objet à ajouté
     * @returns {GameObject} Objet créer
     */
    AddChildren(object)
    {
        this.Root.AddChildren(object);
        return object;
    }
    /**
     * Supprime l'objet enfant choisie
     * @param {GameObject} object Objet à supprimer
     * @return {boolean} Represente si l'action c'est effectué avec succés.
     */
    RemoveChildren(object)
    {
        return this.Root.RemoveChildren(object)
    }
    /**
     * Mets à jour la scene ainsi que ces enfants.
     * @param {float} Delta Temps depuis la dernière frame.
     */
    Update(Delta)
    {
        this.#TotalFrame += Delta * this.GameSpeed;
        if (this.KeepUpdating || (Game.Fading === 0 && Game.Fade === 0))
        {
            this.Calcul(Delta * this.GameSpeed);
            this.Root.Update(Delta * this.GameSpeed);
        }
    }
    /**
     * Calcul dans la scene à override.
     * @param {float} Delta Temps depuis la dernière frame.
     */
    Calcul(Delta)
    {
        // Override by element
    }
    /**
     * Effectue le dessin de l'élément racine ainsi que tout les éléments de la scene
     * @param {CanvasRenderingContext2D} Context Contexte de dessin
     */
    Draw(Context)
    {
        this.Root.Draw(Context);
        this.Dessin(Context);
    }

    /**
     * Effectue un dessin suplémentaire après le dessin de tout les éléments.
     * @param {CanvasRenderingContext2D} Context Contexte de dessin
     */
    Dessin(Context)
    {
        // Override by element
    }

    /**
     * S'execute lorsque la scene est sur le point d'être quitté
     */
    Exit()
    {
        // Override by element
    }

    /**
     * S'execute lorsque la scene est chargé
     * @param {Float} X Nouvelle position X Camera
     * @param {float} Y Nouvelle position Y Camera
     */
    Enter(X, Y)
    {
        Camera.X = X;
        Camera.Y = Y;
        TileMap.SceneChange();
    }

    GetChildrens(Type)
    {
        return this.GetAllChildren().filter(function(x) { return x instanceof Type; });
    }

    GetAllChildren()
    {
        return this.#GetChildOf(this.Root);
    }

    #GetChildOf(Element)
    {
        if (Element.Children.length === 0)
        {
            return [Element];
        }
        else
        {
            let c = this.#GetChildOf(Element);
            let t = [Element];
            c.forEach(element => {
                t.push(element)
            });
            return c;
        }
    }
}