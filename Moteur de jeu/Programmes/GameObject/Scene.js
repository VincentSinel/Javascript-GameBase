class Scene
{

    /**
     * Créer une scene
     * @constructor
     * @param {string} Name Nom de la scene
     */
    constructor(Name)
    {
        this.Root = new RootObject(this);
        this.Name = Name;
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
        this.Calcul(Delta);
        this.Root.Update(Delta);
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
     * @param {CanvasRenderingContext2D} Context Context de dessin
     */
    Draw(Context)
    {
        this.Root.Draw(Context);
    }
}