function readFile(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
      Datas.ChargeComplete(e.target.result)
    }
    reader.readAsText(file)
}

class Datas
{
    static TileMapsData = {};
    static DataSave = {};

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

    static AjoutElementSave(Nom, Contenue)
    {
        Datas.DataSave[Nom] = Contenue;
    }

    static Sauvegarder()
    {
        let filename = "Sauvegarde1.json"
        let type = ".json"
        var file = new Blob([JSON.stringify(Datas.DataSave)], {type: type});
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

    static Charger()
    {
        document.getElementById('inp').click();
    }

    static ChargeComplete(Data)
    {
        Datas.DataSave = JSON.parse(Data);
    }
}