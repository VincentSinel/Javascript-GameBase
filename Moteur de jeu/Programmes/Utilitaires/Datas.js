/**
 * Module de gestion des données. Les fonctions principales sont :
 * Datas.AjoutTilemapData("nom", largeur, ahuteur, Data)
 * Datas.DataTileMap("nom")
 * Datas.AjoutElementSave("nom", Data)
 * Datas.Sauvegarder()
 * Datas.Charger()
 */
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
    static DataSave = {}; // Contenue de la sauvegarde actuel

    /**
     * Enregistre un tilemap dans la base de donnée.
     * @param {string} Nom Nom du tilemap
     * @param {integer} W Largeur
     * @param {integer} H Hauteur
     * @param {string} Data Données
     */
    static AjoutTilemapData(Nom,W,H,Data, Version)
    {
        let data = {Nom: Nom, Largeur: W, Hauteur: H, Data: Data, Version: Version};
        Datas.TileMapsData[Nom] = data
    }

    /**
     * Récupère les données d'un tilemap à partir de son nom
     * @param {string} Nom Nom du tilemap
     * @returns Données correspondante
     */
    static DataTileMap(Nom)
    {
        if (Datas.TileMapsData[Nom])
        {
            return Datas.TileMapsData[Nom];
        }
        else
        {
            console.log("Aucun tilemap ne portant ce nom n'as été trouvé : " + Nom)
            return false
        }
    }

    /**
     * Lance le chargement de toutes les données
     */
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

    /**
     * Lance la sauvegarde et le téléchargement de la base de donnée
     */
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

    /**
     * Ajoute des élèments à sauvegarder dans les données utilisateur.
     * @param {string} Nom Nom de la donnée à sauvegarder
     * @param {Object} Contenue Contenue à sauvegarder
     */
    static AjoutElementSave(Nom, Contenue)
    {
        Datas.DataSave[Nom] = Contenue;
    }

    /**
     * Sauvegarde les données utilisateur
     */
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

    /**
     * lance le chargement d'un fichier
     */
    static Charger()
    {
        document.getElementById('inp').click();
    }


    /**
     * Récupère les données depuis un fichier.
     * @param {Donnée} Data Donnée chargé
     */
    static ChargeComplete(Data) 
    {
        Datas.DataSave = JSON.parse(Data);
    }
}
//Permet de s'assurer que la variable DataBase est générer
if (typeof DataBase === 'undefined')
{
  var DataBase =  {"Tilemaps":{}}
}