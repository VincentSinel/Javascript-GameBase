
class Datas
{
    static TileMapsData = {};

    static AjoutTilemapData(Nom,W,H,Data)
    {
        let data = {Nom: Nom, Largeur: W, Hauteur: H, Data: Data};
        Datas.TileMapsData[Nom] = data
    }

    static DataTileMap(Nom)
    {
        if (Datas.TileMapsData[Nom])
        {
            return Datas.TileMapsData[Nom];
        }
        else
        {
            throw "Aucun tilemap ne portant ce nom n'as été trouvé : " + Nom
        }
    }


    static ChargerData()
    {
        Datas.TileMapsData = DataBase.Tilemaps;

        DataBase = null;
    }

    static #CreateData()
    {
        let Data = {};

        Data.Tilemaps = Datas.TileMapsData;

        return "var DataBase = " + JSON.stringify(Data)
    }

    static SauvegarderData()
    {
        let filename = "DataBase.js"
        let type = ".json"
        var file = new Blob([Datas.#CreateData()], {type: type});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var a = document.createElement("a"),
                    url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
            }, 0); 
        }
    }
}