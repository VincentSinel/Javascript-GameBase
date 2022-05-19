/**
 * Une scene est une zone d'objet qui gére la profondeur.
 * Tout les objet à prendre en compte sont à ajouter dans le tableaux this.ZObject.
 * this.ZObject.append(ELEMENT)
 * 
 * Les object ajouté doivent avoir une caractéristique "Z".
 * Il n'est alors pas nécessaire d'effectuer le dessin des objects, cela est calculé et effectué par la scene.
 */
class Scene
{

    constructor(Name)
    {
        this.Root = new RootObject(this);
        this.Name = Name;
    }

    AjoutEnfant(object)
    {
        this.Root.AddChildren(object);
        return object;
    }

    SupprimerEnfant(object)
    {
        this.Root.RemoveChildren(object)
    }




    Update(Delta)
    {
        this.Calcul(Delta);
        this.Root.Update(Delta);
    }

    Calcul(Delta)
    {
        // Override by element
    }

    Draw(Context)
    {
        this.Root.Draw(Context);
    }
}