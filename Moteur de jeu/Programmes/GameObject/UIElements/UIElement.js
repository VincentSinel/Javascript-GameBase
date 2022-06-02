class UIElement
{
    //#region STATIC Element

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

    static #Menus = [];
    static #FocusObject = undefined;
    static #topElement = undefined;
    static #topScrollElement = undefined;
    static #DraggingElement = undefined;

    /**
     * Ajoute un Menu à la liste des menus globaux. La mise a jour et le dessin sont alors automatiquement géré.
     * @param {UIElement} menu Menu a ajouter.
     */
    static AddMenu(menu)
    {
        UIElement.#Menus.push(menu);

        // For performance reasons, we will first map to a temp array, sort and map the temp array to the objects array.
        var map = UIElement.#Menus.map(function (el, index) {
            return { index : index, value : el.GZ };
        });

        // Now we need to sort the array by z index.
        map.sort(function (a, b) {
            return a.value - b.value;
        });

        let objects = UIElement.#Menus;
        // We finaly rebuilt our sorted objects array.
        UIElement.#Menus = map.map(function (el) {
            return objects[el.index];
        });
    }
    /**
     * Supprime un menu de la liste des menus globaux.
     * @param {UIElement} menu Menu à supprimer.
     */
    static RemoveMenu(menu)
    {
        UIElement.#Menus.splice(UIElement.#Menus.indexOf(menu), 1);
    }
    /**
     * Renvoie l'object ayant le focus
     */
    static get FocusObject()
    {
        return UIElement.#FocusObject;
    }
    /**
     * Définit l'object ayant le focus
     */
    static set FocusObject(value)
    {
        if (UIElement.#FocusObject)
        {
            UIElement.#FocusObject.Unfocus();
        }
        UIElement.#FocusObject = value;
    }
    /**
     * Renvoie l'object juste sous la souris
     */
    static get TopElement(){
        UIElement.#topElement;
    }
    /**
     * Cherche l'objet le plus haut à une position donnée
     * @param {Vector} pos Position à tester
     * @returns UIElement le plus haut à cette position
     */
    static #GetTopElement(pos)
    {
        UIElement.#topElement = undefined;
        for (let ui = UIElement.#Menus.length - 1; ui >= 0; ui--) 
        {
            let el = UIElement.#Menus[ui];
            if (el.Actif)
            {
                if (el.PointIn(pos))
                {
                    let t = el.GetTopElement(pos);
                    if (t != undefined)
                    {
                        UIElement.#topElement = t;
                        return;
                    }

                }
            }
        }
    }
    /**
     * Cherche l'objet le plus haut à une position donnée
     * @param {Vector} pos Position à tester
     * @returns UIElement le plus haut à cette position
     */
     static #GetScrollTopElement(pos)
     {
         UIElement.#topScrollElement = undefined;
         for (let ui = UIElement.#Menus.length - 1; ui >= 0; ui--) 
         {
             let el = UIElement.#Menus[ui];
             if (el.ScrollIn(pos))
             {
                 if (el.Actif)
                 {
                         UIElement.#topScrollElement = el.GetScrollTopElement(pos);
                 }
                 return;
             }
             
         }
     }
    /**
     * Gestionnaire de déplacement de la souris pour les UIElement
     * @param {Vector} position Position de la souris
     */
    static SHandle_MouseMove(position)
    {
        let oldelement = UIElement.#topElement;
        UIElement.#GetTopElement(position);
        if (UIElement.#topElement)
            UIElement.#topElement.Handle_MouseMove(position);
        if(oldelement && oldelement != UIElement.#topElement && oldelement.Actif)
        {
            oldelement.Handle_MouseLeave();
        }
    }
    /**
     * Gestionnaire du clique de la souris pour les UIElement
     * @param {Int} id Index du boutton de la souris préssé
     * @param {Vector} position Position de la souris
     */
    static SHandle_Clique(id, position)
    {
        UIElement.#GetTopElement(position);
        if (UIElement.#topElement)
            UIElement.#topElement.Handle_Clique(id, position);
    }
    /**
     * Gestionnaire des touches enfoncé de la souris pour les UIElement
     * @param {Int} id Index du boutton de la souris préssé
     * @param {Vector} position Position de la souris
     */
    static SHandle_Basse(id, position)
    {
        UIElement.#GetTopElement(position);
        if (UIElement.#topElement)
            UIElement.#topElement.Handle_Basse(id, position);
    }
    /**
     * Gestionnaire des touches relaché de la souris pour les UIElement
     * @param {Int} id Index du boutton de la souris préssé
     * @param {Vector} position Position de la souris
     */
    static SHandle_Relache(id, position)
    {
        UIElement.#GetTopElement(position);
        if (UIElement.#topElement)
            UIElement.#topElement.Handle_Relache(id, position);
    }
    /**
     * Gestionnaire du début de drag de la souris pour les UIElement
     * @param {Int} id Index du boutton de la souris préssé
     * @param {Vector} position Position de la souris
     */
    static SHandle_DragStart(id, position)
    {
        UIElement.#GetTopElement(position);
        if (UIElement.#topElement)
        {
            UIElement.#DraggingElement = UIElement.#topElement;
            if(UIElement.#DraggingElement.Draggable)
            {
                UIElement.#DraggingElement.Handle_DragStart(id, position);
            }
        }
    }
    /**
     * Gestionnaire de la fin de drag de la souris pour les UIElement
     * @param {Int} id Index du boutton de la souris préssé
     * @param {Vector} position Position de la souris
     */
    static SHandle_DragEnd(id, position)
    {
        UIElement.#GetTopElement(position);
        if (UIElement.#DraggingElement)
        {
            if(UIElement.#DraggingElement.Draggable)
                UIElement.#DraggingElement.Handle_DragEnd(id, position);
            else if(UIElement.#DraggingElement == UIElement.#topElement)
                UIElement.#DraggingElement.Handle_Clique(id, position);
            UIElement.#DraggingElement = undefined;
        }
    }
    /**
     * Gestionnaire du drag de la souris pour les UIElement
     * @param {Int} id Index du boutton de la souris préssé
     * @param {Vector} position Position de la souris
     */
    static SHandle_Dragging(id, position)
    {
        let oldelement = UIElement.#topElement;
        UIElement.#GetTopElement(position);
        if (UIElement.#DraggingElement && UIElement.#DraggingElement.Draggable)
        {
            UIElement.#DraggingElement.Handle_Dragging(id, position);
        }
        if(oldelement && oldelement != UIElement.#topElement)
        {
            oldelement.Handle_MouseLeave();
        }
    }
    /**
     * Gestionnaire du scroll de la souris pour les UIElement
     * @param {Vector} position Position de la souris
     */
    static SHandle_Scroll(position, deltaX, deltaY)
    {
        if(UIElement.#topElement &&  UIElement.#topElement.Actif)
        {
            UIElement.#topElement.Handle_MouseLeave();
        }

        UIElement.#GetScrollTopElement(position);
        
        if (UIElement.#topScrollElement)
        {
            UIElement.#topScrollElement.Handle_Scroll(position, deltaX, deltaY);
        }
    }
    /**
     * Gestionnaire des touches appuyés du clavier
     * @param {KeyboardEvent} keyboardEvent Evénement clavier associé
     */
    static SHandle_KeyJustDown(keyboardEvent)
    {
        if (UIElement.#FocusObject)
        {
            UIElement.#FocusObject.Handle_KeyJustDown(keyboardEvent);
        }
    }
    /**
     * Gestionnaire des touches enfoncés du clavier
     * @param {KeyboardEvent} keyboardEvent Evénement clavier associé
     */
    static SHandle_KeyDown(keyboardEvent)
    {
        if (UIElement.#FocusObject)
        {
            UIElement.#FocusObject.Handle_KeyDown(keyboardEvent);
        }
    }
    /**
     * Gestionnaire des touches relachés du clavier
     * @param {KeyboardEvent} keyboardEvent Evénement clavier associé
     */
    static SHandle_KeyJustUp(keyboardEvent)
    {
        if (UIElement.#FocusObject)
        {
            UIElement.#FocusObject.Handle_KeyJustUp(keyboardEvent);
        }
    }


    /**
     * Mise a jour global des UIElement
     * @param {float} Delta Nombre de frame écoulé depuis le dernier rafraichissement d'écran
     */
    static Calcul(Delta)
    {
        UIElement.#Menus.forEach(menu => {
            menu.Calcul(Delta)
        });
    }
    /**
     * Lance le dessin de tout les UIElement
     * @param {canvasContext2D} Context Context de dessin
     */
    static Dessin(Context)
    {
        for (let o = 0; o < UIElement.#Menus.length; o++) {
            UIElement.#Menus[o].Dessin(Context)
        }
    }

    //#endregion



    #SourisOldIn;
    #CanvasChange;
    #Actif;
    #X;
    #Y;
    #Z;
    #W;
    #H;
    #SizeChanged;

    /**
     * Créer un UIElement. Classe mère des objets de création d'interface utilisateur.
     * @param {Number} X Position X relative au parent
     * @param {Number} Y Position Y relative au parent
     * @param {Number} Z Position Z dans le parent (indépendant des différents menus)
     * @param {Number} W Largeur de l'objet
     * @param {Number} H Hauteur de l'objet
     * @param {UIElement} Parent Objet Parent (facultatif)
     */
    constructor(X,Y,Z,W,H, Parent = undefined)
    {
        // Assignation style par default
        this.Font = UIElement.BaseFont;
        this.FontTaille = UIElement.BaseFontTaille;
        this.FontCouleur = UIElement.BaseTexteCouleur;
        this.BaseCouleur = UIElement.BaseCouleur;
        this.HoverCouleur = UIElement.BaseHoverCouleur;
        this.SelectionCouleur = UIElement.BaseSelectionCouleur;
        this.InactifCouleur = UIElement.BaseInactifCouleur;
        this.HorizontalAlignement = HorizontalAlignementType.Etendu;
        this.VerticalAlignement = VerticalAlignementType.Etendu;
        this.EpaisseurBord = UIElement.BaseEpaisseurBord;
        

        this.#X = X;
        this.#Y = Y;
        this.#Z = Z;
        this.#W = W;
        this.#H = H;
        this.#SizeChanged = true;
        this.Padding = [this.EpaisseurBord, this.EpaisseurBord, this.EpaisseurBord, this.EpaisseurBord];
        this.Parent = Parent;
        this.Childrens = []; // Cette variable contient la liste des enfants de cette UIElement
        if (Parent != undefined)
        {
            this.Parent.AddChildren(this);
        }
        else
        {
            UIElement.AddMenu(this);
        }
        this.#SourisOldIn = false;
        this.#CanvasChange = true;

        // Cette variable permet d'activer ou desactiver un objet UI
        this.#Actif = true;
        this.Visible = true;
        this.SourisCapture = false;
        this.ScrollCapture = false;
        this.Draggable = false;
        this.AllowDrop = false;
        this.GridPosition = [0,0,1,1];

        this.CreateCanvas();
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
        this.onSouris_Scroll = []; // Done
        this.onFocus_Gain = []; //Done
        this.onFocus_Perte = []; //Done
        this.onClavier_ToucheJusteBasse = []; // Done
        this.onClavier_ToucheJusteHaute = []; // Done
        this.onClavier_ToucheBasse = []; // Done
        this.onFermeture = []; //Done
        this.onActivate = []; // Done
        this.onDeActivate = []; // Done
        this.onRecreate = []; // Done
        this.onChildResize = []; // Done
        this.onResize = []; // Done
    }


    //#region Getter Setter

    get X() { return this.#X }
    get Y() { return this.#Y }
    get Z() { return this.#Z }
    get W() { return this.#W }
    get H() { return this.#H }

    set X(v) { this.#X = v; this.#SizeChanged = true; }
    set Y(v) { this.#Y = v; this.#SizeChanged = true; }
    set Z(v) { this.#Z = v; this.#SizeChanged = true; }
    set W(v) { this.#W = v; this.#SizeChanged = true; }
    set H(v) { this.#H = v; this.#SizeChanged = true; }

    // Calcul la position X de cette objet vis à vis de son parent
    get GX()
    {
        if (this.Parent)
            return this.X + this.Parent.CX;
        else
            return this.X;
    }
    // Calcul la position Y de cette objet vis à vis de son parent
    get GY()
    {
        if (this.Parent)
            return this.Y + this.Parent.CY;
        else
            return this.Y;
    }
    // Calcul la position Z de cette objet vis à vis de son parent
    get GZ()
    {
        if (this.Parent)
            return this.Z + this.Parent.GZ;
        else
            return this.Z;
    }
    // Calcul la position X de point de départ d'un contenue d'objet (padding)
    get CX()
    {
        return this.GX + this.Padding[0];
    }
    // Calcul la position Y de point de départ d'un contenue d'objet (padding)
    get CY()
    {
        return this.GY + this.Padding[1];
    }
    // Calcul la largeur disponible pour un enfant
    get CW()
    {
        return this.W - this.Padding[0] - this.Padding[2];
    }
    // Calcul la hauteur disponible pour un enfant
    get CH()
    {
        return this.H - this.Padding[1] - this.Padding[3];
    }
    // Revoie si l'élément a actuellement le focus
    get isFocus()
    {
        return UIElement.FocusObject == this
    }
    // Renvoie si la souris est actuellement au dessus de l'élément
    get Hover()
    {
        if (this.Actif && this.SourisCapture)
        {
            if (Souris.CX >= this.GX && Souris.CX <= this.GX + this.W && Souris.CY >= this.GY && Souris.CY <= this.GY + this.H)
            {
                return true;
            }
        }
        return false;
    }
    // Renvoie si le canvas a besoin d'être regénéré
    get CanvasChanged()
    {
        if(this.#CanvasChange)
            return true;
        for (let c = 0; c < this.Childrens.length; c++)
        {
            if (this.Childrens[c].CanvasChanged)
                return true;
        }
        return false;
    }
    // Renvoie si l'objet est actif en prenant en compte l'état du parent
    get Actif()
    {
        if(this.Parent)
        {
            return this.#Actif || this.Parent.Actif
        }
        return this.#Actif;
    }
    // Définit l'état de l'objet et appel les retours d'événements
    set Actif(v)
    {
        if (v != this.#Actif)
        {
            this.#Actif = v;
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
    //#endregion


    //#region Handler

    Handle_MouseLeave()
    {
        if(!this.SourisCapture)
            return;
        this.#SourisOldIn = false;
        let event = new UIEvenement(UIEvenementType.Souris_Quitte, this);
        for (let ev = 0; ev < this.onSouris_Quitte.length; ev++)
        {
            this.onSouris_Quitte[ev](event)
        }
    }
    Handle_MouseMove(position)
    {
        if(!this.SourisCapture)
            return;
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
    Handle_Clique(id, position)
    {
        if(!this.SourisCapture)
            return;
        let event = new UIEvenement(UIEvenementType.Souris_Clique, this, position);
        for (let ev = 0; ev < this.onSouris_Clique[id].length; ev++)
        {
            this.onSouris_Clique[id][ev](event)
        }
    }
    Handle_Basse(id, position)
    {
        if(!this.SourisCapture)
            return;
        let event = new UIEvenement(UIEvenementType.Souris_Basse, this, position);
        for (let ev = 0; ev < this.onSouris_Basse[id].length; ev++)
        {
            this.onSouris_Basse[id][ev](event)
        }
    }
    Handle_Relache(id, position)
    {
        if(!this.SourisCapture)
            return;
        let event = new UIEvenement(UIEvenementType.Souris_Relache, this, position);
        for (let ev = 0; ev < this.onSouris_Relache[id].length; ev++)
        {
            this.onSouris_Relache[id][ev](event)
        }
    }
    Handle_DragStart(id, position)
    {
        if(!this.SourisCapture)
            return;
        let event = new UIEvenement(UIEvenementType.Souris_DragStart, this, position);
        for (let ev = 0; ev < this.onSouris_DragStart[id].length; ev++)
        {
            this.onSouris_DragStart[id][ev](event)
        }
    }
    Handle_DragEnd(id, position)
    {
        if(!this.SourisCapture)
            return;
        let event = new UIEvenement(UIEvenementType.Souris_DragEnd, this, position);
        for (let ev = 0; ev < this.onSouris_DragEnd[id].length; ev++)
        {
            this.onSouris_DragEnd[id][ev](event)
        }
    }
    Handle_Dragging(id, position)
    {
        if(!this.SourisCapture)
            return;
        let event = new UIEvenement(UIEvenementType.Souris_Dragging, this, position);
        for (let ev = 0; ev < this.onSouris_Dragging[id].length; ev++)
        {
            this.onSouris_Dragging[id][ev](event)
        }
    }
    Handle_Scroll(position, dx, dy)
    {
        if(!this.SourisCapture)
            return;
        let event = new UIEvenement(UIEvenementType.Souris_Scroll, this, {position: position,dx: dx,dy: dy});
        for (let ev = 0; ev < this.onSouris_Scroll.length; ev++)
        {
            this.onSouris_Scroll[ev](event)
        }
    }
    Handle_KeyJustDown(e)
    {
        let event = new UIEvenement(UIEvenementType.Clavier_ToucheJusteBasse, this, e);
        for (let ev = 0; ev < this.onClavier_ToucheJusteBasse.length; ev++)
        {
            this.onClavier_ToucheJusteBasse[ev](event)
        }
    }
    Handle_KeyDown(e)
    {
        let event = new UIEvenement(UIEvenementType.Clavier_ToucheBasse, this, e);
        for (let ev = 0; ev < this.onClavier_ToucheBasse.length; ev++)
        {
            this.onClavier_ToucheBasse[ev](event)
        }
    }
    Handle_KeyJustUp(e)
    {
        let event = new UIEvenement(UIEvenementType.Clavier_ToucheJusteHaute, this, e);
        for (let ev = 0; ev < this.onClavier_ToucheJusteHaute.length; ev++)
        {
            this.onClavier_ToucheJusteHaute[ev](event)
        }
    }
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

    PointIn(Point)
    {
        //if(!this.SourisCapture)
        //    return false;
        if (Point.x >= this.GX && Point.x <= this.GX + this.W && Point.y >= this.GY && Point.y <= this.GY + this.H)
        {
            return true;
        }
        return false;
    }
    GetTopElement(pos)
    {
        for (let ui = this.Childrens.length - 1; ui >= 0; ui--) 
        {
            const el = this.Childrens[ui];

            if (el.Actif)
            {
                if (el.PointIn(pos))
                {
                    let e = el.GetTopElement(pos);
                    if (e != undefined)
                        return e;
                }
            }
        }
        if (this.SourisCapture)
            return this;
        return undefined;
    }
    ScrollIn(Point)
    {
        if(!this.ScrollCapture)
            return false;
        if (Point.x >= this.GX && Point.x <= this.GX + this.W && Point.y >= this.GY && Point.y <= this.GY + this.H)
        {
            return true;
        }
        return false;
    }
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

    #SortChildren()
    {
        // For performance reasons, we will first map to a temp array, sort and map the temp array to the objects array.
        var map = this.Childrens.map(function (el, index) {
            return { index : index, value : el.Z };
        });

        // Now we need to sort the array by z index.
        map.sort(function (a, b) {
            return a.value - b.value;
        });

        let objects = this.Childrens;
        // We finaly rebuilt our sorted objects array.
        this.Childrens = map.map(function (el) {
            return objects[el.index];
        });
    }

    /**
     * Lance la fermeture de l'élément
     */
    Fermer()
    {
        let event = new UIEvenement(UIEvenementType.Fermeture, this);
        for (let ev = 0; ev < this.onFermeture.length; ev++) {
            this.onFermeture[ev](event);
        }
        if (this.Parent != undefined)
        {
            this.Parent.RemoveChildren(this)
        }
        else
        {
            UIElement.RemoveMenu(this);
        }
    }
    /**
     * Ajoute un élément enfant à cette élément
     * @param {UIElement} Element Element Enfant
     */
    AddChildren(Element)
    {
        if(Element.Parent)
        {
            Element.Parent.RemoveChildren(Element);
        }
        else
        {
            UIElement.RemoveMenu(Element)
        }
        Element.Parent = this;
        this.Childrens.push(Element);
        this.#CanvasChange = true;
        this.#SortChildren()
    }
    /**
     * Supprimer un élément enfant
     * @param {UIElement} Element Element enfant
     */
    RemoveChildren(Element)
    {
        if (this.Childrens.indexOf(this) > -1)
            this.Childrens.splice(this.Childrens.indexOf(this), 1);
        this.#CanvasChange = true;
        this.#SortChildren()
    }
    /**
     * Focus cet élément
     */
    Focus()
    {
        if (this.Actif)
        {
            let event = new UIEvenement(UIEvenementType.Focus_Gain, this);
            for (let ev = 0; ev < this.onFocus_Gain.length; ev++)
            {
                this.onFocus_Gain[ev](event)
            }
            UIElement.FocusObject = this;
            this.#CanvasChange = true;
        }
    }
    /**
     * Unfocus cet élément
     */
    Unfocus()
    {
        if (this.isFocus)
        {
            let event = new UIEvenement(UIEvenementType.Focus_Perte, this);
            for (let ev = 0; ev < this.onFocus_Perte.length; ev++)
            {
                this.onFocus_Perte[ev](event)
            }
            UIElement.#FocusObject = undefined;
            this.#CanvasChange = true;
        }
    }
    
    RefreshUI()
    {
        this.#CanvasChange = true;
        let event = new UIEvenement(UIEvenementType.Recreate, this);
        for (let ev = 0; ev < this.onRecreate.length; ev++)
        {
            this.onRecreate[ev](event)
        }
    }

    BoundingBoxChild(child_Recursif = false)
    {
        let x1 = 0;
        let y1 = 0;
        let x2 = this.W;
        let y2 = this.H;
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
                x1 = Math.min(x1, element.X);
                y1 = Math.min(y1, element.Y);
                x2 = Math.max(x2, element.X + element.W);
                y2 = Math.max(y2, element.Y + element.H);
            }
        }
        return Rectangle.FromPosition(x1, y1, x2 - x1, y2 - y1);
    }
   

    Calcul(Delta)
    {
        if (this.#SizeChanged)
        {
            let event = new UIEvenement(UIEvenementType.Resize, this);
            for (let ev = 0; ev < this.onResize.length; ev++)
            {
                this.onResize[ev](event)
            }
            if (this.Parent)
            {
                event = new UIEvenement(UIEvenementType.ChildResize, this);
                this.Parent.Handle_ChildResize(event);
            }
            this.#SizeChanged = false;   
        }
        this.Childrens.forEach(element => {
            element.Calcul(Delta)
        });
    }

    Dessin(Context)
    {
        if(!this.Visible || this.W == 0 || this.H == 0)
            return;
        if (this.CanvasChanged)
        {
            this.CreateCanvas();
            this.DessinBackUI(this.Backctx);
            this.DessinFrontUI(this.Frontctx);
        }
        this.Childctx.clearRect(0,0,this.Childctx.canvas.width, this.Childctx.canvas.height);
        for (let e = 0; e < this.Childrens.length; e++) {
            this.Childrens[e].Dessin(this.Childctx);
        }
        this.#CanvasChange = false;

        Context.drawImage(this.Backctx.canvas, this.X, this.Y)
        this.DessinChild(Context)
        Context.drawImage(this.Frontctx.canvas, this.X, this.Y)
    }

    DessinChild(Context)
    {
        Context.drawImage(this.Childctx.canvas, this.X + this.Padding[0], this.Y + this.Padding[1])
    }

    DessinBackUI(Context)
    {
    }
    DessinFrontUI(Context)
    {
    }

    CreateCanvas()
    {
        this.Backctx = document.createElement("canvas").getContext("2d");
        this.Backctx.canvas.width = this.W;
        this.Backctx.canvas.height = this.H;

        this.CreateChildCanvas();

        this.Frontctx = document.createElement("canvas").getContext("2d");
        this.Frontctx.canvas.width = this.W;
        this.Frontctx.canvas.height = this.H;
    }

    CreateChildCanvas()
    {
        this.Childctx = document.createElement("canvas").getContext("2d");
        this.Childctx.canvas.width = this.W - this.Padding[0] - this.Padding[2];
        this.Childctx.canvas.height = this.H - this.Padding[1] - this.Padding[3];
    }
 
    /**
     * Dessine un rectangle avec des coin rond.
     * Si les trois dernier paremètre sont omis, un rectangle avec des 
     * coin de 5 pixel de rayon sera dessiné
     * @param {CanvasRenderingContext2D} ctx Contexte de dessin
     * @param {Number} x Coordonné X du coin haut gauche du rectangle
     * @param {Number} y Coordonné Y du coin haut gauche du rectangle
     * @param {Number} width Largeur du rectangle
     * @param {Number} height Hauteur du rectangle
     * @param {Number} [radius = 5] L'angle du coin; cela peut aussi être un objet 
                                * pour définir des angles différents au quatre coin
     * @param {Number} [radius.tl = 0] Coin au haut gauche
     * @param {Number} [radius.tr = 0] Coin au haut droit
     * @param {Number} [radius.br = 0] Coin au bas droit
     * @param {Number} [radius.bl = 0] Coin au bas gauche
     * @param {Boolean} [fill = false] Définit si le rectangle doit être rempli.
     * @param {Boolean} [stroke = true] Définit si le rectangle doit avoir un contour.
     */
    roundRect(ctx, x, y, width, height, radius, fill, stroke) {
        if (typeof stroke === 'undefined') 
        {
            stroke = true;
        }
        if (typeof radius === 'undefined') 
        {
            radius = 5;
        }
        if (typeof radius === 'number') 
        {
            radius = {tl: radius, tr: radius, br: radius, bl: radius};
        } 
        else 
        {
            var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
            for (var side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
        if (fill) {
            ctx.fill();
        }
        if (stroke) {
            ctx.stroke();
        }
    
    }

    /**
     * Dessine un polygone sur le canvas en arrondissant ses angles selon le rayon souhaité. 
     * Si l'angle d'un angle est trop faible, le rayon est adapté pour être le mieux rendu possible.
     * @param {Context} ctx Context du canvas
     * @param {Array<Vector2>} points Liste des points composant le polygone
     * @param {Number} [radius = 5] Rayon de l'arrondie à dessiner
     * @param {Boolean} [fill = false] Whether to fill the rectangle.
     * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
     */
    roundedPoly(ctx, points, radius = 5, fill, stroke){
        ctx.beginPath();
        var i, x, y, len, p1, p2, p3, v1, v2, sinA, sinA90, radDirection, drawDirection, angle, halfAngle, cRadius, lenOut;
        var asVec = function (p, pp, v) { // convert points to a line with len and normalised
            v.x = pp.x - p.x; // x,y as vec
            v.y = pp.y - p.y;
            v.len = Math.sqrt(v.x * v.x + v.y * v.y); // length of vec
            v.nx = v.x / v.len; // normalised
            v.ny = v.y / v.len;
            v.ang = Math.atan2(v.ny, v.nx); // direction of vec
        }
        v1 = {};
        v2 = {};
        len = points.length;                         // number points
        p1 = points[len - 1];                        // start at end of path
        for (i = 0; i < len; i++) {                  // do each corner
            p2 = points[(i) % len];                  // the corner point that is being rounded
            p3 = points[(i + 1) % len];
            // get the corner as vectors out away from corner
            asVec(p2, p1, v1);                       // vec back from corner point
            asVec(p2, p3, v2);                       // vec forward from corner point
            // get corners cross product (asin of angle)
            sinA = v1.nx * v2.ny - v1.ny * v2.nx;    // cross product
            // get cross product of first line and perpendicular second line
            sinA90 = v1.nx * v2.nx - v1.ny * -v2.ny; // cross product to normal of line 2
            angle = Math.asin(sinA);                 // get the angle
            radDirection = 1;                        // may need to reverse the radius
            drawDirection = false;                   // may need to draw the arc anticlockwise
            // find the correct quadrant for circle center
            if (sinA90 < 0) {
                if (angle < 0) {
                    angle = Math.PI + angle; // add 180 to move us to the 3 quadrant
                } else {
                    angle = Math.PI - angle; // move back into the 2nd quadrant
                    radDirection = -1;
                    drawDirection = true;
                }
            } else {
                if (angle > 0) {
                    radDirection = -1;
                    drawDirection = true;
                }
            }
            halfAngle = angle / 2;
            // get distance from corner to point where round corner touches line
            lenOut = Math.abs(Math.cos(halfAngle) * radius / Math.sin(halfAngle));
            if (lenOut > Math.min(v1.len / 2, v2.len / 2)) { // fix if longer than half line length
                lenOut = Math.min(v1.len / 2, v2.len / 2);
                // ajust the radius of corner rounding to fit
                cRadius = Math.abs(lenOut * Math.sin(halfAngle) / Math.cos(halfAngle));
            } else {
                cRadius = radius;
            }
            x = p2.x + v2.nx * lenOut; // move out from corner along second line to point where rounded circle touches
            y = p2.y + v2.ny * lenOut;
            x += -v2.ny * cRadius * radDirection; // move away from line to circle center
            y += v2.nx * cRadius * radDirection;
            // x,y is the rounded corner circle center
            ctx.arc(x, y, cRadius, v1.ang + Math.PI / 2 * radDirection, v2.ang - Math.PI / 2 * radDirection, drawDirection); // draw the arc clockwise
            p1 = p2;
            p2 = p3;
        }
        ctx.closePath();
        if (fill) {
            ctx.fill();
        }
        if (stroke) {
            ctx.stroke();
        }
    }

    
}

class UIEvenement
{
    constructor(Type, objet, parameters = undefined)
    {
        this.Type = Type;
        this.Target = objet;
        this.Param = parameters
    }

    get isFocus()
    {
        return this.Target.isFocus
    }

}

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
    static Recreate = new UIEvenementType("Recreate")
    static ChildResize = new UIEvenementType("ChildResize")
    static Resize = new UIEvenementType("Resize")
  
    constructor(name) {
      this.Name = name
    }
}

class HorizontalAlignementType
{
    static Gauche = new HorizontalAlignementType("Gauche", "left");
    static Centre = new HorizontalAlignementType("Centre", "center");
    static Droite = new HorizontalAlignementType("Droite", "right");
    static Etendu = new HorizontalAlignementType("Etendu", "center");
    constructor(name, value)
    {
        this.Name = name;
        this.Value = value;
    }
}

class VerticalAlignementType
{
    static Haut = new VerticalAlignementType("Gauche");
    static Centre = new VerticalAlignementType("Centre");
    static Bas = new VerticalAlignementType("Droite");
    static Etendu = new VerticalAlignementType("Etendu");
    constructor(name)
    {
        this.Name = name;
    }
}