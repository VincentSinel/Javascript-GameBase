class UI_Window_Style
{
    // Couleur de base des objets
    static BaseCouleur = new Color(200,157,57,1);
    // Couleur de base lorsqu'un objet est en surbrillance
    static BaseSelectionCouleur = new Color(100,255,255,0.2);
    // Couleur de base lorsqu'un objet est en surbrillance
    static BaseHoverCouleur = new Color(229,177,77,1);
    // Couleur de base lorsu'un objet n'est pas actif
    static BaseInactifCouleur = new Color(177,177,177,1);
    // Couleur de base du texte dans un UI
    static BaseTexteCouleur = new Color(255,255,255,1);
    // Police de base pour le texte
    static BaseFont = "Arial";
    // Taille de base du texte (en pixel)
    static BaseFontTaille = 12;
    // Taille de base du texte (en pixel)
    static BaseFontAlign = "center";
    // Taille de base du texte (en pixel)
    static BaseEpaisseurBord = 3;

    #Window;

    #FontSize
    #Font
    #FontColor
    #FontColorBase
    #FontColorHover
    #FontColorSelect
    #FontColorInactif
    #HorAlign
    #VerAlign
    #BorderSize

    constructor(window)
    {
        this.#Window = window;

        this.#Font = UI_Window_Style.BaseFont;
        this.#FontSize = UI_Window_Style.BaseFontTaille;
        this.#FontColor = UI_Window_Style.BaseTexteCouleur;
        this.#FontColorBase = UI_Window_Style.BaseCouleur;
        this.#FontColorHover = UI_Window_Style.BaseHoverCouleur;
        this.#FontColorSelect = UI_Window_Style.BaseSelectionCouleur;
        this.#FontColorInactif = UI_Window_Style.BaseInactifCouleur;
        this.#BorderSize = UI_Window_Style.BaseEpaisseurBord;
    }

    #RefreshWindow()
    {
        this.#Window.Refresh();
    }

    get FontTaille(){return this.#FontSize;}
    set FontTaille(v)
    {
        this.#FontSize = v;
        this.#RefreshWindow();
    }
    get Font(){return this.#Font;}
    set Font(v)
    {
        this.#Font = v;
        this.#RefreshWindow();
    }

    get FontCouleur() {return this.#FontColor;}
    set FontCouleur(v){
        this.#FontColor = v;
        this.#RefreshWindow();
    }

    get BaseCouleur() {return this.#FontColorBase;}
    set BaseCouleur(v){
        this.#FontColorBase = v;
        this.#RefreshWindow();
    }

    get HoverCouleur() {return this.#FontColorHover;}
    set HoverCouleur(v){
        this.#FontColorHover = v;
        this.#RefreshWindow();
    }

    get InactifCouleur() {return this.#FontColorInactif;}
    set InactifCouleur(v){
        this.#FontColorInactif = v;
        this.#RefreshWindow();
    }

    get SelectionCouleur() {return this.#FontColorSelect;}
    set SelectionCouleur(v){
        this.#FontColorSelect = v;
        this.#RefreshWindow();
    }

    get EpaisseurBord() {return this.#BorderSize;}
    set EpaisseurBord(v){
        this.#BorderSize = v;
        this.#RefreshWindow();
    }
}
/**
 * Class gérant tout les type d'alignement horizontaux
 * @enum
 */
 class HorizontalAlignementType
 {
     static Left = "left";
     static Center = "center";
     static Right = "right";
 }
 /**
  * Class gérant tout les type d'alignement verticaux
  * @enum
  */
 class VerticalAlignementType
 {
     static Up = "Up";
     static Center = "Center";
     static Down = "Down";
 }