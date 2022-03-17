/**
 * Gère l'écran de chargement
 */
class LoadScreen
{
    static Chargement = 0;
    static SonMax = 0;
    static SonLoaded = 0;

    // Mise a jour des sons chargé
    static Update_Son()
    {
        LoadScreen.SonLoaded += 1;
        LoadScreen.Update();
    }


    // Mise a jour de l'écran de chargement
    static Update()
    {
        LoadScreen.Chargement = LoadScreen.SonLoaded / LoadScreen.SonMax * 100.0;
        console.log(LoadScreen.SonMax)
        if (LoadScreen.Chargement >= 100 || LoadScreen.SonMax == 0)
        {
            DemarrerBouclePrincipal();
        }
        LoadScreen.Dessin();
    }

    // Rafraichissement de l'ecran.
    static Dessin()
    {
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
        ctx.fillRect(w / 2 - 60, h / 2, 120 * LoadScreen.Chargement / 100.0, 10);
        ctx.strokeRect(w / 2 - 60, h / 2, 120, 10);
    }
}