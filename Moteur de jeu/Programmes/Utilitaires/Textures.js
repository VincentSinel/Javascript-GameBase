/**
 * Module de gestion des Textures. Les fonctions principales sont :
 * Textures.Charger("Nom fichier")
 */
class Textures
{
    static #Buffer = {};

    /**
     * Initialisation du module son (lance le chargement des fichier choisis dans le SonsData.js)
     */
     static Initialisation()
     {
        LoadScreen.TextureMax = Librairie_Textures.length + 1;

        for (let im = 0; im < Librairie_Textures.length; im++) 
        {
            Textures.#AjoutBuffer(Librairie_Textures[im], Librairie_Textures[im])
        }
        Textures.#AjoutBuffer("System/Bulle", "Moteur de jeu/Programmes/GameObject/Lutin/Bulle.png");
        
     }

     /**
      * Ajoute un élément à chargé dans la buffer de texture.
      * @param {string} Nom Nom du fichier à enregistrer
      * @param {string} Chemin Chemin d'accé relatif au dossier racine du site
      */
     static #AjoutBuffer(Nom, Chemin)
     {
        Textures.#Buffer[Nom] = new Image();
        Textures.#Buffer[Nom].onload = function(e) {Textures.ImageCharge(e)};
        Textures.#Buffer[Nom].onerror = function(e) {throw "Le costume " + e.target.src + " n'a pas pu être chargé. Le fichier n'existe pas ou est corrompu."};
        Textures.#Buffer[Nom].src = Chemin;
     }

     /**
      * S'execute lorsqu'une image a fini de chargé
      * @param {loadEvent} e Evenement de chargement de fichier
      */
     static ImageCharge(e)
     {
        LoadScreen.Update_Texture();
     }

     /**
      * Récupère l'une des images du buffer
      * @param {string} Nom Nom du fichier (complet)
      * @returns Image contenant la texture chargé
      */
     static Charger(Nom)
     {
        if (Textures.#Buffer[Nom])
        {
            return Textures.#Buffer[Nom]
        }
        else
        {
            console.log("L'image " + Nom + " n'existe pas, Elle peut-être manquante de la librairie de texture.")
        }
     }
}
//Permet de s'assurer que la variable Librairie_Sons est générer
if (typeof Librairie_Textures === 'undefined')
{
  var Librairie_Textures = []
}