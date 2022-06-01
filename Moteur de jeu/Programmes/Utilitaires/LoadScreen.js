/**
 * Gère l'écran de chargement
 */
class LoadScreen
{
    static #Chargement = [0,0];
    static SonMax = 1;
    static #SonCharge = 0;
    static TextureMax = 1;
    static #TextureCharge = 0;

    /**
     * Mise a jour des sons à charger
     */
    static Update_Son()
    {
        LoadScreen.#SonCharge += 1;
        if (LoadScreen.#SonCharge >= LoadScreen.SonMax)
            console.log("[INFO] - Banque de son chargé")
        LoadScreen.Update();
    }

    
    /**
     * Mise a jour textures à charger
     */
    static Update_Texture()
    {
        LoadScreen.#TextureCharge += 1;
        if (LoadScreen.#TextureCharge >= LoadScreen.TextureMax)
            console.log("[INFO] - Banque d'image chargé")
        LoadScreen.Update();
    }


    /**
     * Mise a jour de l'écran de chargement
     */
    static Update()
    {
        LoadScreen.#Chargement[0] = LoadScreen.#SonCharge / LoadScreen.SonMax * 100.0
        LoadScreen.#Chargement[1] = LoadScreen.#TextureCharge / LoadScreen.TextureMax * 100.0;
        if ((LoadScreen.#Chargement[0] >= 100 || LoadScreen.SonMax == 0) && 
            (LoadScreen.#Chargement[1] >= 100 || LoadScreen.TextureMax == 0))
        {
            console.log("[INFO] - Lancement de la boucle principale")
            Game.DemarrerBouclePrincipal();
        }
        LoadScreen.#Dessin();
    }

    /**
     * Rafraichissement de l'ecran.
     */
    static #Dessin()
    {
        let c = 0;
        for (let a = 0; a < LoadScreen.#Chargement.length; a++) 
        {
            c += LoadScreen.#Chargement[a];
        }
        c = c / LoadScreen.#Chargement.length;
        let w = ctx.canvas.width / 2;
        let h = ctx.canvas.height / 2;
        ctx.fillStyle = "Black";
        ctx.fillRect(0, 0, w, h);

        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "red";
        ctx.fillText("Chargement des sons",w / 2, h / 2 - 10);

        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
        ctx.fillRect(w / 2 - 60, h / 2, 120, 10);
        ctx.fillStyle = "red";
        ctx.fillRect(w / 2 - 60, h / 2, 120 * c / 100.0, 10);
        ctx.strokeRect(w / 2 - 60, h / 2, 120, 10);
    }
}