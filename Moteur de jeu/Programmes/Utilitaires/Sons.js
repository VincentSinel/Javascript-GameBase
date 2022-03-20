/**
 * Module de gestion des sons. Les fonctions principales sont :
 * Sons.Jouer_Bruit("nom.ogg")
 * Sons.Jouer_MusiqueCourte("nom.ogg")
 * Sons.Jouer_BruitFond("nom.ogg")
 * Sons.Jouer_MusiqueFond("nom.ogg")
 * Sons.Jouer_AutreSon("nom.ogg")
 */
class Sons
{
    static VolumeFondSonore = 1.0;
    static VolumeMusique = 1.0;
    static VolumeSons = 1.0;

    static #context;
    static #bufferLoader;
    static #buffer;

    static #SourceFondMusique;
    static #SourceFondSon;
    static #MusiqueCount = 0;
    static #SonCount = 0; 
    
    static SourceP_Musique = true;
    static SourceP_Bruit = true;

    // Fonction caché pour jouer un fond sonore
    static #JouerFondSonore(Nom, volume = 1.0)
    {
      if (Sons.#SourceFondSon)
        Sons.#SourceFondSon.source.stop();
      Sons.#SourceFondSon = Sons.#CreerSource(Nom, volume, true)
      if (!Sons.#SourceFondSon.source.start) {
        Sons.#SourceFondSon.source.noteOn(0);
      } else {
        Sons.#SourceFondSon.source.start(0);
      }
    }

    // Fonction caché pour jouer un son court
    static #JouerSonCourt(Nom, volume = 1.0)
    {
      Sons.SourceP_Bruit = false;
      Sons.#SonCount +=1;
      let source = Sons.#CreerSource(Nom,volume)
      source.source.start(0)
      source.source.onended = function() {
        Sons.#FinLectureSonCourt()
      }
    }

    // Fonction caché de détection de la fin d'un son cours
    static #FinLectureSonCourt()
    {
      Sons.#SonCount -= 1;
      if (Sons.#SonCount == 0)
      {
        Sons.SourceP_Bruit = true;
      }
    }

    // Fonction caché pour jouer une musique
    static #JouerMusique(Nom, volume = 1.0)
    {
      if (Sons.#SourceFondMusique)
        Sons.#SourceFondMusique.source.stop();
      Sons.#SourceFondMusique = Sons.#CreerSource(Nom, volume, true)
      if (!Sons.#SourceFondMusique.source.start) {
        Sons.#SourceFondMusique.source.noteOn(0);
      } else {
        Sons.#SourceFondMusique.source.start(0);
      }
    }

    // Fonction caché pour jouer une musique courte
    static #JouerMusiqueCourte(Nom, volume = 1.0)
    {
      Sons.SourceP_Musique = false;
      Sons.#MusiqueCount +=1;
      let source = Sons.#CreerSource(Nom, volume)
      source.source.start(0)
      source.source.onended = function() {
        Sons.#FinLectureMusiqueCourte()
      }
    }

    // Fonction caché de détection de la fin d'une musique courte
    static #FinLectureMusiqueCourte()
    {
      Sons.#MusiqueCount -= 1;
      if (Sons.#MusiqueCount == 0)
      {
        Sons.SourceP_Musique = true;
      }
    }

    // Fonction caché pour créer une source de son
    static #CreerSource(Nom, volume, loop = false) 
    {
      if (Librairie_Sons.indexOf(Nom) >= 0)
      {
        var source = Sons.#context.createBufferSource();
        var gainNode = Sons.#context.createGain ? Sons.#context.createGain() : Sons.#context.createGainNode();
        source.buffer = Sons.#buffer[Librairie_Sons.indexOf(Nom)];
        // Active la boucle du son
        source.loop = loop;
        // Ajout du gain à la source
        source.connect(gainNode);
        // Connection du gain et du contexte de son
        gainNode.connect(Sons.#context.destination);
    
        return {
          source: source,
          gainNode: gainNode,
          gainMax: volume
        };
      }
      else
      {
          console.error("Aucun fichier portant ce nom n'est présent dans la base de son")
      }
    }

    /**
     * Lance la lecture d'un bruit.
     * @param {string} Nom Nom du fichier audio à jouer. Ce doit être le nom du fichier se trouvant dans le dossier SE.
     * @param {float} volume Volume du son entre 0 et 1 (par default 1.0)
     */
    static Jouer_Bruit(Nom, volume = false)
    {
        Sons.#JouerSonCourt("././Sons/SE/" + Nom, volume || Sons.VolumeFondSonore)
    }
    /**
     * Lance la lecture d'une musique courte.
     * @param {string} Nom Nom du fichier audio à jouer. Ce doit être le nom du fichier se trouvant dans le dossier ME.
     * @param {float} volume Volume du son entre 0 et 1 (par default 1.0)
     */
    static Jouer_MusiqueCourte(Nom, volume = false)
    {
        Sons.#JouerMusiqueCourte("././Sons/ME/" + Nom, volume || Sons.VolumeMusique)
    }
    /**
     * Lance la lecture d'un bruit de fond.
     * @param {string} Nom Nom du fichier audio à jouer. Ce doit être le nom du fichier se trouvant dans le dossier BGS.
     * @param {float} volume Volume du son entre 0 et 1 (par default 1.0)
     */
    static Jouer_BruitFond(Nom, volume = false)
    {
        Sons.#JouerFondSonore("././Sons/BGS/" + Nom,  volume || Sons.VolumeSons)
    }
    /**
     * Lance la lecture d'une musique de fond
     * @param {string} Nom Nom du fichier audio à jouer. Ce doit être le nom du fichier se trouvant dans le dossier BGM.
     * @param {float} volume Volume du son entre 0 et 1 (par default 1.0)
     */
    static Jouer_MusiqueFond(Nom, volume = false)
    {
        Sons.#JouerMusique("././Sons/BGM/" + Nom, volume || Sons.VolumeMusique)
    }
    /**
     * Lance la lecture d'un autre son.
     * @param {string} Nom Nom du fichier audio à jouer. Ce doit être le nom du fichier se trouvant dans le dossier Autre.
     * @param {float} volume Volume du son entre 0 et 1 (par default 1.0)
     */
    static Jouer_AutreSon(Nom, volume = false)
    {
        Sons.#JouerSonCourt("././Sons/Autre/" + Nom, volume || Sons.VolumeSons)
    }

    /**
     * Initialisation du module son (lance le chargement des fichier choisis dans le SonsData.js)
     */
    static Initialisation()
    {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        Sons.#context = new AudioContext();

        LoadScreen.SonMax = Librairie_Sons.length;

        Sons.#bufferLoader = new BufferLoader(
            Sons.#context,
            Librairie_Sons,
            Sons.#ChargementFichier
            );

        Sons.#bufferLoader.load();
        if (LoadScreen.SonMax == 0)
          LoadScreen.Update_Son();
    }

    /**
     * Mise a jour de la musique et du son de fond
     * @param {float} dt Temps depuis la dernière mise à jour
     */
    static Update(dt)
    {
      if (Sons.SourceFondMusique)
      {
        if (Sons.SourceP_Musique)
        {
          if (Sons.SourceFondMusique.gainNode.gain.value < Sons.SourceFondMusique.gainMax)
          {
            Sons.SourceFondMusique.gainNode.gain.value = Math.min(Math.max(Sons.SourceFondMusique.gainNode.gain.value, 0.01) * 1.1, Sons.SourceFondMusique.gainMax)
          }
        }
        else
        {
          if (Sons.SourceFondMusique.gainNode.gain.value > Sons.SourceFondMusique.gainMax * 0.2)
          {
            Sons.SourceFondMusique.gainNode.gain.value = Math.max(Sons.SourceFondMusique.gainNode.gain.value * 0.9, Sons.SourceFondMusique.gainMax * 0.2)
          }
        }
      }
      
      if (Sons.SourceFondSon)
      {
        if (Sons.SourceP_Bruit)
        {
          if (Sons.SourceFondSon.gainNode.gain.value < Sons.SourceFondSon.gainMax)
          {
            Sons.SourceFondSon.gainNode.gain.value = Math.min(Sons.SourceFondSon.gainNode.gain.value * 1.1, Sons.SourceFondSon.gainMax)
          }
        }
        else
        {
          if (Sons.SourceFondSon.gainNode.gain.value > Sons.SourceFondSon.gainMax * 0.2)
          {
            Sons.SourceFondSon.gainNode.gain.value = Math.max(Sons.SourceFondSon.gainNode.gain.value * 0.9, Sons.SourceFondSon.gainMax * 0.2)
          }
        }
      }
      
    }

    static #ChargementFichier(bufferList) {
        Sons.#buffer = bufferList;
      }
}
//Permet de s'assurer que la variable Librairie_Sons est générer
if (typeof Librairie_Sons === 'undefined')
{
  var Librairie_Sons = []
}
/**
 * Objet de charge des fichiers audio.
 */
class BufferLoader
{
  constructor(context, urlList, callback)
  {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
  }

  loadBuffer(url, index)
  {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", "./././" + url, true);
    request.responseType = "arraybuffer";

    var loader = this;

    request.onload = function() {
      // Asynchronously decode the audio file data in request.response
      loader.context.decodeAudioData(
        request.response,
        function(buffer) {
          if (!buffer) {
            alert('error decoding file data: ' + url);
            return;
          }
          loader.bufferList[index] = buffer;
          if (++loader.loadCount == loader.urlList.length)
            loader.onload(loader.bufferList);
          LoadScreen.Update_Son();
        },
        function(error) {
          console.error('decodeAudioData error', error);
        }
      );
    }

    request.onerror = function(e) {
      alert('BufferLoader: XHR error');
      console.log(e);
    }

    request.send();
  }

  load()
  {
    for (var i = 0; i < this.urlList.length; ++i)
        this.loadBuffer(this.urlList[i], i);
  }
}