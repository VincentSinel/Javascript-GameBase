/**
 * Class de base pour tout les UI_Element. Celle-ci gère tout les événement et les paramètre standard.
 * @class
 */
class UI_Element
{

    //#CanvasChange = true;
    #SourisOldIn = false;
    #Actif = true;
    #Visible = UI_Element_Visibilty.Visible;
    #Z = 0;
    #W = UI_Element_Alignement.STRETCH;
    #H = UI_Element_Alignement.AUTO;
    #MinW = 0;
    #MaxW = Infinity;
    #MinH = 0;
    #MaxH = Infinity;
    #Margin = {left:0,right:0,up:0,down:0};
    #Padding = {left:0,right:0,up:0,down:0};
    #NeedRedraw = true;
    #Childrens = [];
    #Dirty = true;
    #Parent = undefined;
    #Capture_Souris = false;
    #Capture_Scroll = false;
    #Capture_Drag = false;
    #Capture_Drop = false;
    #Capture_Clavier = false;
    #Grid_Row = 0;
    #Grid_Column = 0;
    #Grid_RowsSpan = 1;
    #Grid_ColumnsSpan = 1;
    #HorAlign = HorizontalAlignementType.Center;
    #VerAlign = VerticalAlignementType.Center;
    #measureSize = new Vector(0,0);
    #prevSize = new Vector(0,0);
    #desiredSize = new Vector(0,0);
    #FinalSize = new Vector(0,0);
    #FinalContentSize = new Vector(0,0);
    #FinalMaxSize = new Vector(0,0);
    #RecreateCanvas = true;
    #Focusable = false;
    #Animate = false;
    


    
    // Assignation style par default
    #Font = UI_Window_Style.BaseFont;
    #FontSize = UI_Window_Style.BaseFontTaille;
    #FontColor = UI_Window_Style.BaseTexteCouleur;
    #FontColorBase = UI_Window_Style.BaseCouleur;
    #FontColorHover = UI_Window_Style.BaseHoverCouleur;
    #FontColorSelect = UI_Window_Style.BaseSelectionCouleur;
    #FontColorInactif = UI_Window_Style.BaseInactifCouleur;
    #BorderSize = UI_Window_Style.BaseEpaisseurBord;
    #CurrentColor = UI_Window_Style.BaseCouleur;


    /**
     * @typedef {Object} UIParam
     * @param {float} X position X du UI_Element (facultatif)
     * @param {float} Y position Y du UI_Element (facultatif)
     * @param {float} Z position Z du UI_Element (facultatif)
     * @param {float} Parent Parent de l'objet (facultatif)
     */

    /**
     * Créer un UI_Element. Classe mère des objets de création d'interface utilisateur.
     * @param {UIParam} [Param=undefined] Parametre de l'UI
     */
    constructor(Param)
    {
        if (Param)
        {
            this.Margin.left = Param.X ? Param.X : 0;
            this.Margin.up = Param.Y ? Param.Y : 0;
            this.#Z = Param.Z ? Param.Z : 0;
            if (Param.Parent)
                Param.Parent.AddChildren(this);
        }

        this.CreateEventArray();
    }

    /**
     * Crée les tableaux contenant les action a effectué lorsqu'un événement se produit
     */
    CreateEventArray()
    {
        this.onSouris_AuDessus = []; // Done
        this.onSouris_Entre = []; // Done
        this.onSouris_Quitte = []; //Done
        this.onSouris_Basse = [   [],    [],    [],    [],    []]; // Done
        this.onSouris_Clique = [   [],    [],    [],    [],    []]; // Done
        this.onSouris_Relache = [   [],    [],    [],    [],    []]; // Done
        this.onSouris_DragStart = [   [],    [],    [],    [],    []]; // Done
        this.onSouris_Dragging = [   [],    [],    [],    [],    []]; // Done
        this.onSouris_DragEnd = [   [],    [],    [],    [],    []]; // Done
        this.onSouris_HoverDrop = [   [],    [],    [],    [],    []]; // Done
        this.onSouris_Drop = [   [],    [],    [],    [],    []]; // Done
        this.onSouris_Scroll = []; // Done
        this.onFocus_Gain = []; //Done
        this.onFocus_Perte = []; //Done
        this.onClavier_ToucheJusteBasse = []; // Done
        this.onClavier_ToucheJusteHaute = []; // Done
        this.onClavier_ToucheBasse = []; // Done
        this.onFermeture = []; //Done
        this.onActivate = []; // Done
        this.onDeActivate = []; // Done
        this.onRefresh = []; // Done
        this.onChildResize = []; // Done
        this.onResize = []; // Done
    }


    //#region Getter Setter

    
    /**
     * Position X de l'objet
     * @type {float}
     */
    get X() { return this.#Margin.left }
    set X(v) { this.#Margin.left = v; this.SetDirty(); }
    /**
     * Position Y de l'objet
     * @type {float}
     */
    get Y() { return this.#Margin.up }
    set Y(v) { this.#Margin.up = v; this.SetDirty(); }
    /**
     * Position Z de l'objet
     * @type {float}
     */
    get Z() { return this.#Z }
    set Z(v) { this.#Z = v; this.Refresh() }
    /**
     * Largeur de l'objet
     * @type {float}
     */
    get W() { return this.#W }
    set W(v) { if (v < -2) v = 0; this.#W = v; this.SetDirty(); }
    /**
     * Largeur minimal de l'objet
     * @type {float}
     */
    get MinW() { return this.#MinW }
    set MinW(v) { if (v < 0) v = 0; this.#MinW = v; this.SetDirty(); }
    /**
     * Largeur maximal de l'objet
     * @type {float}
     */
    get MaxW() { return this.#MaxW }
    set MaxW(v) { if (v < 0) v = 0; this.#MaxW = v; this.SetDirty(); }
    /**
     * Hauteur de l'objet
     * @type {float}
     */
    get H() { return this.#H }
    set H(v) { if (v < -2) v = 0; this.#H = v;  this.SetDirty(); }
    /**
     * Hauteur minimal de l'objet
     * @type {float}
     */
    get MinH() { return this.#MinH }
    set MinH(v) { if (v < 0) v = 0;  this.#MinH = v;  this.SetDirty(); }
    /**
     * Hauteur maximal de l'objet
     * @type {float}
     */
    get MaxH() { return this.#MaxH }
    set MaxH(v) { if (v < 0) v = 0;  this.#MaxH = v;  this.SetDirty(); }
    /**
     * @typedef {Object} MarginData
     * @property {float} left Décalage gauche
     * @property {float} right Décalage droite
     * @property {float} up Décalage haut
     * @property {float} down Décalage bas
     */
    /**
     * Définit la marge de cette élément
     * @type {MarginData}
     */
    get Margin() { return this.#Margin }
    set Margin(v) { 
        if (typeof(v) === "number" )
        {
            this.#Margin = {left:v,right:v,up:v,down:v};
        }
        else
        this.#Margin = v; 
        this.SetDirty() }
    /**
     * Définit le padding de cette élément
     * @type {MarginData}
     */
    get Padding() { return this.#Padding }
    set Padding(v) { 
        if (typeof(v) === "number" )
        {
            this.#Padding = {left:v,right:v,up:v,down:v};
        }
        else
            this.#Padding = v; 
        this.SetDirty() 
    }
    /**
     * Renvoie la liste des enfants de cet objet
     */
    get Childrens() { return this.#Childrens; }
    /**
     * Calcul la position X de cette objet vis à vis de son parent
     * @type {float}
     */
    get GX()
    {
        
        let offsetX = 0;
        if (this.HorizontalAlignement === HorizontalAlignementType.Center)
            offsetX = Math.max(0,this.FinalMaxSize.x - this.FinalSize.x - this.X) / 2;
        else if (this.HorizontalAlignement === HorizontalAlignementType.Right)
            offsetX = Math.max(0,this.FinalMaxSize.x - this.FinalSize.x - this.X);

        if (this.Parent)
            return this.X + this.Parent.CX(this) + offsetX;
        else
            return this.X + offsetX;
    }
    /**
     * Calcul la position Y de cette objet vis à vis de son parent
     * @type {float}
     */
    get GY()
    {
        let offsetY = 0;
        if (this.VerticalAlignement === VerticalAlignementType.Center)
            offsetY = Math.max(0,this.FinalMaxSize.y - this.FinalSize.y - this.Y) / 2;
        else if (this.VerticalAlignement === VerticalAlignementType.Down)
            offsetY = Math.max(0,this.FinalMaxSize.y - this.FinalSize.y - this.Y);

        if (this.Parent)
            return this.Y + this.Parent.CY(this) + offsetY;
        else
            return this.Y + offsetY;
    }
    /**
     * Calcul la position Z de cette objet vis à vis de son parent
     * @type {float}
     */
    get GZ()
    {
        if (this.Parent)
            return this.Z + this.Parent.GZ;
        else
            return this.Z;
    }
    /**
     * Calcul la largeur disponible pour un enfant
     * @type {float}
     */
    get CW() { return this.FinalContentSize.x; }
    /**
     * Calcul la hauteur disponible pour un enfant
     * @type {float}
     */
    get CH() { return this.FinalContentSize.y; }
    /**
     * Renvoie la taille autorisé de l'objet
     * @type {Vector}
     */
    get FinalSize() { return this.#FinalSize; }
    /**
     * Renvoie la taille autorisé du contenu
     * @type {Vector}
     */
    get FinalContentSize() { return this.#FinalContentSize; }
    /**
     * Renvoie la racine de cette objet dans une fenêtre
     * @type {UI_Root}
     */
    get Root()
    {
        if (this.Parent)
            return this.Parent.Root;
        else
            return undefined;
    }
    /**
     * Renvoie la fenêtre associé a cette objet
     * @type {UI_Window}
     */
    get Window()
    {
        if (this.Root)
            return this.Root.Window;
        else
            return undefined;
    }
    /**
     * Renvoie si l'élément à besoin d'étre recréer visuellement
     * @type {boolean}
     */
    get NeedRedraw() { return this.#NeedRedraw; }
    /**
     * Renvoie si l'élément est animé
     * @type {boolean}
     */
    get Animate() { return this.#Animate; }
    set Animate(v) { this.#Animate = v; }
    /**
     * Renvoie si l'élément doit être arrangé.
     * @type {boolean}
     */
    get Dirty() { return this.#Dirty; }
    /**
     * Renvoie si l'élément est actuellement visible.
     * @type {UI_Element_Visibilty}
     */
    get Visible()
    {
        if (this.#Visible === UI_Element_Visibilty.Visible)
        {
            if (this.W === 0 || this.H === 0 || this.FinalSize.x === 0 || this.FinalSize.y === 0)
            {
                return UI_Element_Visibilty.Hidden;
            }
            return UI_Element_Visibilty.Visible;
        }
        return this.#Visible;
    }
    set Visible(v)
    {
        if ((this.#Visible !== UI_Element_Visibilty.Collapsed && v === UI_Element_Visibilty.Collapsed) ||
            (this.#Visible === UI_Element_Visibilty.Collapsed && v !== UI_Element_Visibilty.Collapsed))
            this.SetDirty();
        this.#Visible = v;
    }
    /**
     * Renvoie si l'élément a actuellement le focus
     * @type {boolean}
     */
    get isFocus() { return this.Root ? this.Root.FocusObject === this : false; }
    /**
     * Renvoie si la souris est actuellement au dessus de l'élément
     * @type {boolean}
     */
    get Hover()
    {
        if (this.Actif && this.SourisCapture)
        {
            return this.PointIn(Souris.CPosition)
        }
        return false;
    }
    /**
     * Renvoie / Définit si l'objet est actif en prenant en compte l'état du parent
     * @type {boolean}
     */
    get Actif()
    {
        if(this.Parent)
        {
            return this.#Actif && this.Parent.Actif
        }
        return this.#Actif;
    }
    set Actif(v)
    {
        if (v != this.#Actif)
        {
            this.#Actif = v;
            this.Refresh();
            if (v)
            {
                this.Activate()
            }
            else
            {
                this.Deactivate()
            }
        }
    }
    /**
     * Renvoie l'objet parent de celui-ci.
     * @type {UI_Element}
     */
    get Parent() { return this.#Parent; }
    set Parent(v) { this.#Parent = v; this.SetDirty(); }
    /**
     * Définit si l'objet prend en compte le déplacement de la souris.
     * @type {boolean}
     */
    get Capture_Souris() { return this.#Capture_Souris || this.#Capture_Drag; }
    set Capture_Souris(v) { this.#Capture_Souris = v; }
    /**
     * Définit si l'objet prend en compte le scroll de la souris
     * @type {boolean}
     */
    get Capture_Scroll() { return this.#Capture_Scroll; }
    set Capture_Scroll(v) { this.#Capture_Scroll = v; }
    /**
     * Définit si l'objet prend en compte le drag;
     * @type {boolean}
     */
    get Capture_Drag() { return this.#Capture_Drag; }
    set Capture_Drag(v) { this.#Capture_Drag = v; }
    /**
     * Définit si l'objet autorise le drop d'objet
     * @type {boolean}
     */
    get Capture_Drop() { return this.#Capture_Drop; }
    set Capture_Drop(v) { this.#Capture_Drop = v; }
    /**
     * Définit si l'objet autorise le drop d'objet
     * @type {boolean}
     */
    get Capture_Clavier() { return this.#Capture_Clavier; }
    set Capture_Clavier(v) { this.#Capture_Clavier = v; }
    /**
     * Définit la ligne dans une grille
     * @type {int}
     */
    get Grid_Row() { return this.#Grid_Row; }
    set Grid_Row(v) { this.#Grid_Row = v; }
    /**
     * Définit la colonne dans une grille
     * @type {int}
     */
    get Grid_Column() { return this.#Grid_Column; }
    set Grid_Column(v) { this.#Grid_Column = v; }
    /**
     * Définit le nombre de ligne sur lesquel se placer
     * @type {int}
     */
    get Grid_RowsSpan() { return this.#Grid_RowsSpan; }
    set Grid_RowsSpan(v) { this.#Grid_RowsSpan = v; }
    /**
     * Définit le nombre de colonne sur lesquel se placer
     * @type {int}
     */
    get Grid_ColumnsSpan() { return this.#Grid_ColumnsSpan; }
    set Grid_ColumnsSpan(v) { this.#Grid_ColumnsSpan = v; }
    /**
     * Définit la taille de la police d'écriture
     * @type {float}
     */
    get FontTaille(){return this.#FontSize;}
    set FontTaille(v) { this.#FontSize = v; this.Refresh(); }
    /**
     * Définit la police d'écriture
     * @type {string}
     */
    get Font(){return this.#Font;}
    set Font(v) { this.#Font = v; this.Refresh(); }
    /**
     * Couleur font
     */
    get FontCouleur() {return this.#FontColor;}
    set FontCouleur(v){ this.#FontColor = v; this.Refresh(); }
    /**
     * Couleur de base
     */
    get BaseCouleur() {return this.#FontColorBase;}
    set BaseCouleur(v){ this.#FontColorBase = v; this.Refresh(); }
    /**
     * Couleur Hover
     */
    get HoverCouleur() {return this.#FontColorHover;}
    set HoverCouleur(v){ this.#FontColorHover = v; this.Refresh(); }
    /**
     * Couleur inactif
     */
    get InactifCouleur() {return this.#FontColorInactif;}
    set InactifCouleur(v){ this.#FontColorInactif = v; this.Refresh(); }
    /**
     * Couleur de selection
     */
    get SelectionCouleur() {return this.#FontColorSelect;}
    set SelectionCouleur(v){ this.#FontColorSelect = v; this.Refresh(); }
    /**
     * Couleur actuel
     */
    get CurrentColor() {return this.#CurrentColor;}
    set CurrentColor(v){ this.#CurrentColor = v; this.Refresh(); }
    /** 
     * Alignement horizontal de l'objet 
     */
    get HorizontalAlignement() {return this.#HorAlign;}
    set HorizontalAlignement(v){ this.#HorAlign = v; this.Refresh(); }
    /**
     * Alignement vertical de l'objet
     */
    get VerticalAlignement() {return this.#VerAlign;}
    set VerticalAlignement(v){ this.#VerAlign = v; this.Refresh(); }
    /**
     * Epaisseur bord
     */
    get EpaisseurBord() {return this.#BorderSize;}
    set EpaisseurBord(v){ this.#BorderSize = v; this.Refresh(); }
    /**
     * Taille précédente
     */
    get PrevSize() { return this.#prevSize; }
    set PrevSize(v) { this.#prevSize = v; }
    /**
     * Taille voulue
     */
    get Desiredsize() { return this.#desiredSize; }
    /**
     * Taille maximal alloué
     */
    get FinalMaxSize() { return this.#FinalMaxSize ;}

    get Focusable() { return this.#Focusable; }
    set Focusable(v) { this.#Focusable = v; }

    //#endregion


    //#region Event Handler

    /**
     * Gestion du départ de la souris
     */
    Handle_MouseLeave()
    {
        this.#SourisOldIn = false;
        let event = new UIEvenement(UIEvenementType.Souris_Quitte, this);
        for (let ev = 0; ev < this.onSouris_Quitte.length; ev++)
        {
            this.onSouris_Quitte[ev](event)
        }
    }
    /**
     * Gestion du déplacement de la souris
     * @param {Vector} position Position de la souris
     */
    Handle_MouseMove(position)
    {
        if (!this.#SourisOldIn)
        {
            let event = new UIEvenement(UIEvenementType.Souris_Entre, this, position);
            for (let ev = 0; ev < this.onSouris_Entre.length; ev++)
            {
                this.onSouris_Entre[ev](event)
            }
            this.#SourisOldIn = true;
        }
        let event = new UIEvenement(UIEvenementType.Souris_AuDessus, this, position);
        for (let ev = 0; ev < this.onSouris_AuDessus.length; ev++)
        {
            this.onSouris_AuDessus[ev](event)
        }
    }
    /**
     * Gestion des clique de la souris
     * @param {int} id index du clique de souris
     * @param {Vector} position Position de la souris
     */
    Handle_Clique(id, position)
    {
        let event = new UIEvenement(UIEvenementType.Souris_Clique, this, position);
        for (let ev = 0; ev < this.onSouris_Clique[id].length; ev++)
        {
            this.onSouris_Clique[id][ev](event)
        }
    }
    /**
     * Gestion de l'appuie des cliques de la souris
     * @param {int} id index du clique de souris
     * @param {Vector} position Position de la souris
     */
    Handle_Basse(id, position)
    {
        let event = new UIEvenement(UIEvenementType.Souris_Basse, this, position);
        for (let ev = 0; ev < this.onSouris_Basse[id].length; ev++)
        {
            this.onSouris_Basse[id][ev](event)
        }
    }
    /**
     * Gestion du relachement des cliques de la souris
     * @param {int} id index du clique de souris
     * @param {Vector} position Position de la souris
     */
    Handle_Relache(id, position)
    {
        let event = new UIEvenement(UIEvenementType.Souris_Relache, this, position);
        for (let ev = 0; ev < this.onSouris_Relache[id].length; ev++)
        {
            this.onSouris_Relache[id][ev](event)
        }
    }
    /**
     * Gestion du début de drag de la souris
     * @param {int} id index du clique de souris
     * @param {Vector} position Position de la souris
     */
    Handle_DragStart(id, position)
    {
        let event = new UIEvenement(UIEvenementType.Souris_DragStart, this, position);
        for (let ev = 0; ev < this.onSouris_DragStart[id].length; ev++)
        {
            this.onSouris_DragStart[id][ev](event)
        }
    }
    /**
     * Gestion du fin de drag de la souris
     * @param {int} id index du clique de souris
     * @param {Vector} position Position de la souris
     */
    Handle_DragEnd(id, position)
    {
        let event = new UIEvenement(UIEvenementType.Souris_DragEnd, this, position);
        for (let ev = 0; ev < this.onSouris_DragEnd[id].length; ev++)
        {
            this.onSouris_DragEnd[id][ev](event)
        }
    }
    /**
     * Gestion du drag de la souris
     * @param {int} id index du clique de souris
     * @param {Vector} position Position de la souris
     */
    Handle_Dragging(id, position)
    {
        let event = new UIEvenement(UIEvenementType.Souris_Dragging, this, position);
        for (let ev = 0; ev < this.onSouris_Dragging[id].length; ev++)
        {
            this.onSouris_Dragging[id][ev](event)
        }
    }
    /**
     * Gestion du scroll de la souris
     * @param {Vector} position Position de la souris
     * @param {float} dx Scroll Horizontal
     * @param {float} dx Scroll Verticale
     */
    Handle_Scroll(position, dx, dy)
    {
        let event = new UIEvenement(UIEvenementType.Souris_Scroll, this, {position: position,dx: dx,dy: dy});
        for (let ev = 0; ev < this.onSouris_Scroll.length; ev++)
        {
            this.onSouris_Scroll[ev](event)
        }
    }
    /**
     * Gestion de l'appuie d'une touche de clavier
     * @param {KeyboardEvent} e Evenement du clavier
     */
    Handle_KeyJustDown(e)
    {
        let event = new UIEvenement(UIEvenementType.Clavier_ToucheJusteBasse, this, e);
        for (let ev = 0; ev < this.onClavier_ToucheJusteBasse.length; ev++)
        {
            this.onClavier_ToucheJusteBasse[ev](event)
        }
    }
    /**
     * Gestion du maintient d'une touche de clavier
     * @param {KeyboardEvent} e Evenement du clavier
     */
    Handle_KeyDown(e)
    {
        let event = new UIEvenement(UIEvenementType.Clavier_ToucheBasse, this, e);
        for (let ev = 0; ev < this.onClavier_ToucheBasse.length; ev++)
        {
            this.onClavier_ToucheBasse[ev](event)
        }
    }
    /**
     * Gestion du relachement d'une touche de clavier
     * @param {KeyboardEvent} e Evenement du clavier
     */
    Handle_KeyJustUp(e)
    {
        let event = new UIEvenement(UIEvenementType.Clavier_ToucheJusteHaute, this, e);
        for (let ev = 0; ev < this.onClavier_ToucheJusteHaute.length; ev++)
        {
            this.onClavier_ToucheJusteHaute[ev](event)
        }
    }
    /**
     * Gestion du changement de taille d'un objet enfant
     * @param {UIEvenement} e Evenement lié
     */
    Handle_ChildResize(e)
    {
        for (let ev = 0; ev < this.onChildResize.length; ev++)
        {
            this.onChildResize[ev](e)
        }
        if (this.Parent)
        {
            this.Parent.Handle_ChildResize(e);
        }
    }

    //#endregion

    
    /**
     * Calcul la position X de point de départ d'un contenue d'objet (padding)
     * @type {float}
     */
    CX(sender)
    {
        return this.GX + this.Padding.left;
    }
    /**
     * Calcul la position Y de point de départ d'un contenue d'objet (padding)
     * @type {float}
     */
    CY(sender)
    {
        return this.GY + this.Padding.up;
    }
    /**
     * Définit cet objet comme Dirty (nécessitant une mise a jour de l'arrangement)
     * @param {boolean} root L'objet est la racine de la fenêtre
     */
    SetDirty(root = false)
    {
        this.#Dirty = true;
        this.Refresh();
        if (this.Root && !root)
            this.Root.SetDirty();
    }
    /**
     * Lance la mesure de cette objet
     * @param {Vector} availableSize Taille disponible pour l'enfant
     * @returns {Vector} Taille souhaité de l'enfant
     */
    Measure(availableSize)
    {
        if (this.#Visible === UI_Element_Visibilty.Collapsed)
        {
            this.#desiredSize = Vector.Zero;
            return Vector.Zero;
        }
        // Si la taille n'as pas changer, on retourne la taille
        //if (VMath.Equals(availableSize, this.#desiredSize)){ return availableSize; }
        this.#measureSize = availableSize;
        this.#desiredSize = this.MeasureCore(availableSize,VMath.Equals(availableSize, this.#desiredSize));
        return this.#desiredSize;
    }
    /**
     * Coeur de la mesure de l'objet. Cette fonction demande à l'objet la taille qu'il souhaite prendre
     * !!!!!!!  Cette fonction doit appelé la fonction Measure sur l'ensemble des objets enfants.
     * @param {Vector} availableSize Taille disponible actuellement
     * @param {boolean} skip Définit si la mesure doit être sauté
     * @returns {Vector} Taille souhaité par cet objet
     */
    MeasureCore(availableSize, skip)
    {
        //Calcul de la taille du contenue dans ce cas
        let contentsize = availableSize.clone();
        let offw = this.Padding.left + this.Padding.right + this.X + this.Margin.right;
        let offh = this.Padding.up + this.Padding.down + this.Y + this.Margin.down;
        contentsize.x -= offw;
        contentsize.y -= offh;

        // Ajustement si la largeur ou hauteur est définit
        if (this.W >= 0)
            contentsize.x = Math.min(Math.max(this.W,this.MinW),this.MaxW) - this.Padding.left - this.Padding.right;
        if (this.H >= 0)
            contentsize.y = Math.min(Math.max(this.H,this.MinH),this.MaxH) - this.Padding.up - this.Padding.down;
        
        contentsize.x = this.W === UI_Element_Alignement.AUTO ? Math.max(0,this.MinW - this.Padding.left - this.Padding.right) : contentsize.x;
        contentsize.y = this.H === UI_Element_Alignement.AUTO ? Math.max(0,this.MinH - this.Padding.up - this.Padding.down) : contentsize.y;


        //Calcul de la taille voulue des enfants
        let desiredsize = new Vector(0,0);
        this.Childrens.forEach(child => 
            {
                let a = child.Measure(contentsize.clone());
                desiredsize.x = Math.max(a.x,desiredsize.x);
                desiredsize.y = Math.max(a.y,desiredsize.y);
            });
        desiredsize.x += offw;
        desiredsize.y += offh;
        contentsize.x += offw;
        contentsize.y += offh;

        let x = Math.max(contentsize.x, desiredsize.x, this.MinW);
        let y = Math.max(contentsize.y, desiredsize.y, this.MinH);

        // Renvoie la taille maximal voulue
        return new Vector(x, y);
    }
    /**
     * Lance l'arrangement de cets éléments.
     * @param {Vector} finalRect Taille alloué à l'objet
     */
    Arrange(finalRect)
    {
        if (this.#Visible === UI_Element_Visibilty.Collapsed)
        {
            this.#FinalSize = Vector.Zero;
            this.#FinalContentSize = Vector.Zero;
            this.#FinalMaxSize = Vector.Zero;
        }

        this.PrevSize = finalRect;
        finalRect.x -= this.Margin.left + this.Margin.right;
        finalRect.y -= this.Margin.up + this.Margin.down;

        this.#FinalMaxSize = finalRect.clone();

        this.ArrangeCore(finalRect,VMath.Equals(finalRect, this.#measureSize));
    }
    /**
     * Coeur de l'arrangement des éléments. Cette fonction demande à l'objet de s'adapter à la taille choisie.
     * !!!! Celle-ci doit aussi appelé Arrange sur l'ensemble de ses enfants.
     * @param {Vector} finalRect Taille alloué a l'objet
     * @param {boolean} sameAsMesure Définit si la taille final est identique a la taille de mesure
     */
    ArrangeCore(finalRect,sameAsMesure)
    {
        // Ajustement si la largeur ou hauteur est définit
        if (this.W >= 0)
            finalRect.x = Math.min(Math.max(Math.min(finalRect.x,this.W),this.MinW),this.MaxW);// - this.Padding.left - this.Padding.right;
        if (this.H >= 0)
            finalRect.y = Math.min(Math.max(Math.min(finalRect.y,this.H),this.MinH),this.MaxH);// - this.Padding.up - this.Padding.down;
         
        
        let x = this.W === UI_Element_Alignement.AUTO ? Math.min(finalRect.x, this.Desiredsize.x - this.X) : finalRect.x;
        let y = this.H === UI_Element_Alignement.AUTO ? Math.min(finalRect.y, this.Desiredsize.y - this.Y) : finalRect.y;

        this.SetFinalSize(new Vector(x, y));
        this.Childrens.forEach(child => {
            child.Arrange(this.FinalContentSize.clone());
        });
    }

    /**
     * Définit la taille total de l'élément et calcul la taille du contenue
     * @param {Vector} Size Taille final de l'élément
     */
    SetFinalSize(Size)
    {
        Size.x = Math.max(0, Size.x);
        Size.y = Math.max(0, Size.y);
        this.Set_FinalSize(Size)

        let t = Size.clone();
        t.x -= this.Padding.left + this.Padding.right;
        t.y -= this.Padding.up + this.Padding.down;
        this.Set_FinalContentSize(t)
        this.#RecreateCanvas = true;
        this.Refresh();
        this.#Dirty = false;
    }

    Set_FinalSize(value)
    {
        this.#FinalSize = value;
    }
    Set_FinalContentSize(value)
    {
        this.#FinalContentSize = value;
    }

    /**
     * Active cet objet
     */
    Activate()
    {
        let event = new UIEvenement(UIEvenementType.Activation, this);
        for (let ev = 0; ev < this.onActivate.length; ev++) {
            this.onActivate[ev](event);
        }
        this.Childrens.forEach(element => {
            element.Activate();
        });
    }
    /**
     * Desactive cet objet
     */
    Deactivate()
    {
        let event = new UIEvenement(UIEvenementType.Desactivation, this);
        for (let ev = 0; ev < this.onDeActivate.length; ev++) {
            this.onDeActivate[ev](event);
        }
        this.Childrens.forEach(element => {
            element.Deactivate();
        });
    }
    /**
     * Test si un point est au dessus de l'objet
     * @param {Vector} Point Vecteur position à tester
     * @returns {boolean}
     */
    PointIn(Point)
    {
        //if(!this.SourisCapture)
        //    return false;
        if (this.Visible === UI_Element_Visibilty.Visible)
        {
            if (Point.x >= this.GX && Point.x <= this.GX + this.FinalSize.x && Point.y >= this.GY && Point.y <= this.GY + this.FinalSize.y)
            {
                return true;
            }
        }
        return false;
    }
    /**
     * Renvoie l'objet le plus haut à l'emplacement donnée
     * @param {Vector} pos Position à tester
     * @returns {UI_Element} Objet le plus haut
     */
    GetTopElement(pos)
    {
        if (this.PointIn(pos) && this.Actif)
        {
            for (let ui = this.Childrens.length - 1; ui >= 0; ui--) 
            {
                const el = this.Childrens[ui];

                let e = el.GetTopElement_CaptureSouris(pos);
                if (e != undefined)
                    return e;
            }
            return this;
        }
        return undefined;
    }
    /**
     * Renvoie l'objet cliquable le plus haut à l'emplacement donnée
     * @param {Vector} pos Position à tester
     * @returns {UI_Element} Objet le plus haut
     */
    GetTopElement_CaptureSouris(pos)
    {
        if (this.PointIn(pos) && this.Actif)
        {
            for (let ui = this.Childrens.length - 1; ui >= 0; ui--) 
            {
                const el = this.Childrens[ui];

                
                //console.log(this.constructor.name,el);

                let e = el.GetTopElement_CaptureSouris(pos);
                if (e != undefined)
                    return e;
            }
            if (this.Capture_Souris)
                return this;
        }
        return undefined;
    }
    /**
     * Renvoie l'objet draggable le plus haut à l'emplacement donnée
     * @param {Vector} pos Position à tester
     * @returns {UI_Element} Objet le plus haut
     */
    GetTopElement_CaptureDrag(pos)
    {
        if (this.PointIn(pos) && this.Actif)
        {
            for (let ui = this.Childrens.length - 1; ui >= 0; ui--) 
            {
                const el = this.Childrens[ui];

                let e = el.GetTopElement_CaptureDrag(pos);
                if (e != undefined)
                    return e;
            }
            if (this.Capture_Drag)
                return this;
        }
        return undefined;
    }
    /**
     * Renvoie l'objet acceptant les drops le plus haut à l'emplacement donnée
     * @param {Vector} pos Position à tester
     * @returns {UI_Element} Objet le plus haut
     */
    GetTopElement_CaptureDrop(pos)
    {
        if (this.PointIn(pos) && this.Actif)
        {
            for (let ui = this.Childrens.length - 1; ui >= 0; ui--) 
            {
                const el = this.Childrens[ui];

                let e = el.GetTopElement_CaptureDrop(pos);
                if (e != undefined)
                    return e;
            }
            if (this.Capture_Drop)
                return this;
        }
        return undefined;
    }
    /**
     * Renvoie l'objet scrollable le plus haut à l'emplacement donnée
     * @param {Vector} pos Position à tester
     * @returns {UI_Element} Objet le plus haut
     */
    GetTopElement_CaptureScroll(pos)
    {
        if (this.PointIn(pos) && this.Actif)
        {
            for (let ui = this.Childrens.length - 1; ui >= 0; ui--) 
            {
                const el = this.Childrens[ui];

                let e = el.GetTopElement_CaptureScroll(pos);
                if (e != undefined)
                    return e;
            }
            if (this.Capture_Scroll)
                return this;
        }
        return undefined;
    }
    /**
     * Renvoie l'objet scrollable le plus haut à l'emplacement donnée
     * @param {Vector} pos Position à tester
     * @returns {UI_Element} Objet le plus haut
     */
    GetTopElement_CaptureClavier(pos)
    {
        if (this.PointIn(pos) && this.Actif)
        {
            for (let ui = this.Childrens.length - 1; ui >= 0; ui--) 
            {
                const el = this.Childrens[ui];

                let e = el.GetTopElement_CaptureClavier(pos);
                if (e != undefined)
                    return e;
            }
            if (this.Capture_Clavier)
                return this;
        }
        return undefined;
    }
    /**
     * Test si un point est dans un objet scrollable
     * @param {Vector} Point Point à tester
     * @returns {boolean}
     */
    ScrollIn(Point)
    {
        if(!this.ScrollCapture)
            return false;
        if (Point.x >= this.GX && Point.x <= this.GX + this.FinalSize.x && Point.y >= this.GY && Point.y <= this.GY + this.FinalSize.y)
        {
            return true;
        }
        return false;
    }
    /**
     * Renvoie l'objet scrollable le plus haut à l'emplacement donnée
     * @param {Vector} pos Position à tester
     * @returns {UI_Element} Objet le plus haut
     */
    GetScrollTopElement(pos)
    {
        for (let ui = this.Childrens.length - 1; ui >= 0; ui--) 
        {
            const el = this.Childrens[ui];

            if (el.ScrollIn(pos))
            {
                if (el.Actif)
                {
                    return el.GetScrollTopElement(pos);
                }
                return undefined;
            }
        }
        return this;
    }
    /**
     * Trie les objets enfant selon leur position Z (pour le dessin)
     */
    #SortChildren()
    {
        // For performance reasons, we will first map to a temp array, sort and map the temp array to the objects array.
        var map = this.#Childrens.map(function (el, index) {
            return { index : index, value : el.Z };
        });

        // Now we need to sort the array by z index.
        map.sort(function (a, b) {
            return a.value - b.value;
        });

        let objects = this.#Childrens;
        // We finaly rebuilt our sorted objects array.
        this.#Childrens = map.map(function (el) {
            return objects[el.index];
        });
    }

    /**
     * Lance la fermeture de l'élément
     */
    Dispose()
    {
        let event = new UIEvenement(UIEvenementType.Fermeture, this);
        for (let ev = 0; ev < this.onFermeture.length; ev++) {
            this.onFermeture[ev](event);
        }
        if (this.Parent != undefined)
        {
            this.Parent.RemoveChildren(this)
        }
    }
    /**
     * Ajoute un élément enfant à cette élément
     * @param {UI_Element} Element Element Enfant
     */
    AddChildren(Element)
    {
        if(Element.Parent)
        {
            Element.Parent.RemoveChildren(Element);
        }
        Element.Parent = this;
        this.#Childrens.push(Element);
        this.Refresh();
        this.#SortChildren()
        return Element
    }
    /**
     * Supprimer un élément enfant
     * @param {UI_Element} Element Element enfant
     */
    RemoveChildren(Element)
    {
        if (this.#Childrens.indexOf(Element) > -1)
            this.#Childrens.splice(this.#Childrens.indexOf(Element), 1);
        else
            Debug.Log("Tentative de suppression d'un enfant qui n'en ai pas un : " + Element, 1);
        this.Refresh();
        this.#SortChildren()
    }
    /**
     * Focus cet élément
     */
    Focus()
    {
        if (this.Actif && this.Focusable && this.Root)
        {
            if (this.Root.FocusObject !== this)
            {
                let event = new UIEvenement(UIEvenementType.Focus_Gain, this, this.Root.FocusObject);
                this.Root.FocusObject = this;
                for (let ev = 0; ev < this.onFocus_Gain.length; ev++)
                {
                    this.onFocus_Gain[ev](event)
                }
            }
        }
    }
    /**
     * Unfocus cet élément
     */
    Unfocus()
    {
        if (this.isFocus && this.Root)
        {
            let event = new UIEvenement(UIEvenementType.Focus_Perte, this);
            for (let ev = 0; ev < this.onFocus_Perte.length; ev++)
            {
                this.onFocus_Perte[ev](event)
            }
            this.Root.FocusObject = undefined;
        }
    }
    /**
     * Demande un rafraichissement du canvas et de son contenue
     */
    Refresh()
    {
        this.#NeedRedraw = true;
        if (this.Root && this != this.Root)
            this.Root.Refresh();
        let event = new UIEvenement(UIEvenementType.Refresh, this);
        for (let ev = 0; ev < this.onRefresh.length; ev++)
        {
            this.onRefresh[ev](event)
        }
    }
    /**
     * Calcul le rectangle contenant l'objet actuel
     * @returns {Rectangle} Rectangle contenant l'objet actuel
     */
    BoundingBox()
    {
        return Rectangle.FromPosition(this.X, this.Y,this.FinalSize.x,this.FinalSize.y);
    }
    /**
     * Calcul le rectangle contenant l'objet (et ces enfants si voulu)
     * @param {boolean} child_Recursif Prise en compte des enfants
     * @returns {Rectangle} Rectangle contenant l'objet et ses enfants si précisé
     */
    BoundingBoxChild(child_Recursif = false)
    {
        let bb = this.BoundingBox();
        let x1 = 0;
        let y1 = 0;
        let x2 = bb.w;
        let y2 = bb.h;
        for (let c = 0; c < this.Childrens.length; c++) 
        {
            if(child_Recursif)
            {
                const element = this.Childrens[c].BoundingBoxChild(true);
                x1 = Math.min(x1, element.x);
                y1 = Math.min(y1, element.y);
                x2 = Math.max(x2, element.x + element.w);
                y2 = Math.max(y2, element.y + element.h);
            }
            else
            {
                const element = this.Childrens[c];
                bb = element.BoundingBox();
                x1 = Math.min(x1, bb.x);
                y1 = Math.min(y1, bb.y);
                x2 = Math.max(x2, bb.x + bb.w);
                y2 = Math.max(y2, bb.y + bb.h);
            }
        }
        return Rectangle.FromPosition(x1, y1, x2 - x1, y2 - y1);
    }
    /**
     * Effectue les calcul de changement de taille pour cet élément et ces enfants
     * @param {float} Delta Nombre de frame depuis la précédentes mise à jour
     */
    Calcul(Delta)
    {
        this.Childrens.forEach(element => {
            element.Calcul(Delta)
        });
    }
    /**
     * Lance le dessin de tout les UIElement
     * @param {CanvasRenderingContext2D} Context Context de dessin
     * @param {boolean} RecreateCanvas Définit si le canvas doit être recrée
     */
    Draw(Context, RecreateCanvas, offsetX = 0, offsetY = 0)
    {
        this.Dessin(Context, RecreateCanvas || this.#RecreateCanvas, offsetX, offsetY)
    }

    /**
     * Effectue le dessin de ce canvas ainsi que de ses enfants
     * @param {CanvasRenderingContext2D} Context Context de dessin
     * @param {boolean} RecreateCanvas Définit si le canvas doit être recrée
     */
    Dessin(Context, RecreateCanvas, offsetX = 0, offsetY = 0)
    {
        if(!(this.Visible === UI_Element_Visibilty.Visible))
            return;
        if (RecreateCanvas)
        {
            this.CreateCanvas();
            this.#RecreateCanvas = false;
            this.#NeedRedraw = true;
        }
        if (this.#NeedRedraw || this.#Animate)
        {
            this.Backctx.clearRect(0,0,this.Backctx.canvas.width,this.Backctx.canvas.height);
            this.Frontctx.clearRect(0,0,this.Frontctx.canvas.width,this.Frontctx.canvas.height);
            this.DessinBackUI(this.Backctx);
            this.DessinFrontUI(this.Frontctx);
            this.#NeedRedraw = false;
        }
        this.DessinChildLocal(RecreateCanvas);

        if (this.HorizontalAlignement === HorizontalAlignementType.Center)
            offsetX += Math.max(0,this.FinalMaxSize.x - this.FinalSize.x - this.X) / 2;
        else if (this.HorizontalAlignement === HorizontalAlignementType.Right)
            offsetX += Math.max(0,this.FinalMaxSize.x - this.FinalSize.x - this.X);
        if (this.VerticalAlignement === VerticalAlignementType.Center)
            offsetY += Math.max(0,this.FinalMaxSize.y - this.FinalSize.y - this.Y) / 2;
        else if (this.VerticalAlignement === VerticalAlignementType.Down)
            offsetY += Math.max(0,this.FinalMaxSize.y - this.FinalSize.y - this.Y);

        if (this.Backctx.canvas.width > 0 && this.Backctx.canvas.height > 0)
            Context.drawImage(this.Backctx.canvas, 
                Math.round(this.X + offsetX), Math.round(this.Y + offsetY));

        Context.save();
        Context.translate(this.Padding.left, this.Padding.up)
        this.DessinChild(Context, Math.round(offsetX), Math.round(offsetY))
        Context.restore();

        if (this.Frontctx.canvas.width > 0 && this.Frontctx.canvas.height > 0)
            Context.drawImage(this.Frontctx.canvas, 
                Math.round(this.X + offsetX), Math.round(this.Y + offsetY));
    }
    /**
     * Effectue le dessin des enfants sur le canvas contenue local
     */
    DessinChildLocal(RecreateCanvas)
    {
        this.Childctx.clearRect(0,0,this.Childctx.canvas.width, this.Childctx.canvas.height);
        for (let e = 0; e < this.Childrens.length; e++) {
            this.Childrens[e].Draw(this.Childctx, RecreateCanvas);
        }
    }
    /**
     * Effectue le dessin du canvas enfants sur le canvas parent
     * @param {CanvasRenderingContext2D} Context Context de dessin
     */
    DessinChild(Context, offsetX = 0, offsetY = 0)
    {
        if (this.Childctx.canvas.width > 0 && this.Childctx.canvas.height > 0)
            Context.drawImage(this.Childctx.canvas, Math.round(this.X + offsetX), Math.round(this.Y + offsetY));
    }
    /**
     * Effectue le dessin du contenue arrière de cette objet (vis à vis des enfants)
     * @param {CanvasRenderingContext2D} Context Context de dessin
     */
    DessinBackUI(Context)
    {
    }
    /**
     * Effectue le dessin du contenue avant de cette objet (vis à vis des enfants)
     * @param {CanvasRenderingContext2D} Context Context de dessin
     */
    DessinFrontUI(Context)
    {
    }
    /**
     * Initialise les canvas temporaire
     */
    CreateCanvas()
    {
        this.Backctx = document.createElement("canvas").getContext("2d");
        this.Backctx.canvas.width = this.#FinalSize.x;
        this.Backctx.canvas.height = this.#FinalSize.y;

        this.CreateChildCanvas();

        this.Frontctx = document.createElement("canvas").getContext("2d");
        this.Frontctx.canvas.width = this.#FinalSize.x;
        this.Frontctx.canvas.height = this.#FinalSize.y;
    }
    /**
     * Créer le canvas des enfants de cet élément
     */
    CreateChildCanvas()
    {
        this.Childctx = document.createElement("canvas").getContext("2d");
        this.Childctx.canvas.width = this.#FinalContentSize.x;
        this.Childctx.canvas.height = this.#FinalContentSize.y;
    }

    
}
/**
 * Objet Evenement lié au gestionnaire
 * @class
 */
class UIEvenement
{
    /**
     * Créer un nouvelle événement d'UI
     * @constructor
     * @param {UIEvenementType} Type Typde d'événement
     * @param {UI_Element} objet Objet cible
     * @param {Object} parameters Paramètres supplémentaires
     */
    constructor(Type, objet, parameters = undefined)
    {
        this.Type = Type;
        this.Target = objet;
        this.Param = parameters
    }
    /**
     * Renvoie si l'objet cible à le focus
     * @type {boolean}
     */
    get isFocus()
    {
        return this.Target.isFocus
    }

}
/**
 * Class gérant tout les type d'événement d'UI
 * @enum
 */
class UIEvenementType {
    // Create new instances of the same class as static attributes
    static Souris_AuDessus = new UIEvenementType("Souris_AuDessus")
    static Souris_Entre = new UIEvenementType("Souris_Entre")
    static Souris_Quitte = new UIEvenementType("Souris_Quitte")
    static Souris_Clique = new UIEvenementType("Souris_Clique")
    static Souris_Basse = new UIEvenementType("Souris_Basse")
    static Souris_Relache = new UIEvenementType("Souris_Relache")
    static Souris_DragStart = new UIEvenementType("Souris_DragStart")
    static Souris_Dragging = new UIEvenementType("Souris_Dragging")
    static Souris_DragEnd = new UIEvenementType("Souris_DragEnd")
    static Souris_Scroll = new UIEvenementType("Souris_Scroll")
    static Focus_Gain = new UIEvenementType("Focus_Gain")
    static Focus_Perte = new UIEvenementType("Focus_Perte")
    static Clavier_ToucheJusteBasse = new UIEvenementType("Clavier_ToucheJusteBasse")
    static Clavier_ToucheJusteHaute = new UIEvenementType("Clavier_ToucheJusteHaute")
    static Clavier_ToucheBasse = new UIEvenementType("Clavier_ToucheBasse")

    static Fermeture = new UIEvenementType("Fermeture")
    static Activation = new UIEvenementType("Activation")
    static Desactivation = new UIEvenementType("Desactivation")
    static Refresh = new UIEvenementType("Refresh")
    static ChildResize = new UIEvenementType("ChildResize")
    static Resize = new UIEvenementType("Resize")
  
    constructor(name) {
      this.Name = name
    }
}

class UI_Element_Alignement
{
    static STRETCH = "stretch";
    static AUTO = "auto";
}

class UI_Element_Visibilty
{
    static Visible = "visible"
    static Hidden = "hidden"
    static Collapsed = "collapsed"
}