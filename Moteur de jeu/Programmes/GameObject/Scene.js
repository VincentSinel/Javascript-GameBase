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
            fading = 1;
            if (SceneActuel)
            {
                while(fading != 0)
                {
                    yield 0;
                }
                SceneActuel.Exit();
            }
            else
            {
                fade = 1.0
            }
            SceneActuel = new Scene.#Exiting[0]()
            SceneActuel.Enter(Scene.#Exiting[1],Scene.#Exiting[2]);
            fading = -1;
            while(fading != 0)
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

    /**
     * Créer une scene
     * @constructor
     * @param {string} Name Nom de la scene
     */
    constructor(Name)
    {
        this.Root = new RootObject(this);
        this.Name = Name;
        this.Pause = false;
        this.KeepUpdating = false;

        this.Exiting = false;
    }
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
        if (this.KeepUpdating || (fading == 0 && fade == 0) && !this.Pause)
        {
            this.Calcul(Delta);
            this.Root.Update(Delta);
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
    }

    // * #LocalWaitForExiting()
    // {

    // }
}