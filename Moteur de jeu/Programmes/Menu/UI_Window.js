class UI_Window
{
    static #Windows = [];
    static #TopWindow;
    static #PreviousTopWindow;
    static #PressingWindow;
    static #DraggingWindow;
    static #FocusWindow;

    static Update(Delta)
    {
        UI_Window.#Windows.forEach(window => {
            window.Update(Delta);
        });
    }
    static Draw(Context)
    {
        UI_Window.#Windows.forEach(window => {
            window.Draw(Context);
        });
    }
    static SortWindow()
    {
        // For performance reasons, we will first map to a temp array, sort and map the temp array to the objects array.
        var map = UI_Window.#Windows.map(function (el, index) {
            return { index : index, value : el.Z };
        });

        // Now we need to sort the array by z index.
        map.sort(function (a, b) {
            return a.value - b.value;
        });

        let objects = UI_Window.#Windows;
        // We finaly rebuilt our sorted objects array.
        UI_Window.#Windows = map.map(function (el) {
            return objects[el.index];
        });
    }
    static DisposeWindow(window)
    {
        UI_Window.#Windows.splice(UI_Window.#Windows.indexOf(window), 1);
    }
    static #GetTopWindow(position)
    {
        UI_Window.#PreviousTopWindow = UI_Window.#TopWindow;
        let x = position.x;
        let y = position.y;
        for (let index = 0; index < UI_Window.#Windows.length; index++) {
            const element = UI_Window.#Windows[index];
            if (element.X <= x && element.Y <= y && element.X + element.W >= x && element.Y + element.H >= y)
            {
                UI_Window.#TopWindow = element;
                return;
            }
        }
        UI_Window.#TopWindow = undefined;
        return;// undefined;
    }
    // static MouseMove(position)
    // {
    //     UI_Window.#PreviousTopWindow = UI_Window.#TopWindow;
    //     UI_Window.#TopWindow = UI_Window.#GetTopWindow();
    //     if (UI_Window.TopWindow)
    //     {
    //         UI_Window.TopWindow.Handle_MouseMove(position)
    //     }
    // }
    static get TopWindow()
    {
        if (this.#TopWindow)
            return this.#TopWindow;
        return undefined;
    }

    //#region STATIC Event Handler

    /**
     * Gestionnaire de déplacement de la souris pour les UI_Window
     * @param {Vector} position Position de la souris
     */
    static SHandle_MouseMove(position)
    {
        UI_Window.#GetTopWindow(position);
        if (UI_Window.#TopWindow)
            UI_Window.#TopWindow.Handle_MouseMove(position);
        UI_Window.SHandle_MouseLeave(position);
    }
    /**
     * Gestionnaire du clique de la souris pour les UI_Window
     * @param {Int} id Index du boutton de la souris préssé
     * @param {Vector} position Position de la souris
     */
    static SHandle_Clique(id, position)
    {
        UI_Window.#GetTopWindow(position);
        if (UI_Window.#TopWindow)
            UI_Window.#TopWindow.Handle_Clique(id, position);
        UI_Window.SHandle_MouseLeave(position);
        if (UI_Window.#PreviousTopWindow && 
            UI_Window.#TopWindow != UI_Window.#PreviousTopWindow)
        {
            UI_Window.#PreviousTopWindow.Unfocus();
        }
    }
    /**
     * Gestionnaire des touches enfoncé de la souris pour les UI_Window
     * @param {Int} id Index du boutton de la souris préssé
     * @param {Vector} position Position de la souris
     */
    static SHandle_Basse(id, position)
    {
        UI_Window.#GetTopWindow(position);
        if (UI_Window.#TopWindow)
        {
            UI_Window.#PressingWindow = UI_Window.#TopWindow;
            UI_Window.#TopWindow.Handle_Basse(id, position);
        }
        UI_Window.SHandle_MouseLeave(position);
    }
    /**
     * Gestionnaire des touches relaché de la souris pour les UI_Window
     * @param {Int} id Index du boutton de la souris préssé
     * @param {Vector} position Position de la souris
     */
    static SHandle_Relache(id, position)
    {
        if (UI_Window.#PressingWindow)
            UI_Window.#PressingWindow.Handle_Relache(id, position);
        //UI_Window.#GetTopWindow(position);
        //UI_Window.SHandle_MouseLeave(position);
    }
    /**
     * Gestionnaire du début de drag de la souris pour les UI_Window
     * @param {Int} id Index du boutton de la souris préssé
     * @param {Vector} position Position de la souris
     */
    static SHandle_DragStart(id, position)
    {
        
        UI_Window.#GetTopWindow(position);
        if (UI_Window.#TopWindow)
        {
            UI_Window.#DraggingWindow = UI_Window.#TopWindow;
            UI_Window.#DraggingWindow.Handle_DragStart(id, position);
            if (UI_Window.#TopWindow)
                UI_Window.#TopWindow.Handle_HoverDrop(id, position,UI_Window.#DraggingWindow.DraggableElement);
        }
        UI_Window.SHandle_MouseLeave(position);
    }
    /**
     * Gestionnaire de la fin de drag de la souris pour les UI_Window
     * @param {Int} id Index du boutton de la souris préssé
     * @param {Vector} position Position de la souris
     */
    static SHandle_DragEnd(id, position)
    {
        UI_Window.#GetTopWindow(position);
        if (UI_Window.#DraggingWindow)
        {
            if (UI_Window.#TopWindow)
                UI_Window.#TopWindow.Handle_Drop(id, position,UI_Window.#DraggingWindow.DraggableElement);
            if(UI_Window.#DraggingWindow === UI_Window.#TopWindow)
                UI_Window.#DraggingWindow.Handle_Clique(id, position);
            UI_Window.#DraggingWindow.Handle_DragEnd(id, position);
            UI_Window.#DraggingWindow = undefined;
        }
        UI_Window.SHandle_MouseLeave(position);
    }
    /**
     * Gestionnaire du drag de la souris pour les UI_Window
     * @param {Int} id Index du boutton de la souris préssé
     * @param {Vector} position Position de la souris
     */
    static SHandle_Dragging(id, position)
    {
        UI_Window.#GetTopWindow(position);
        if (UI_Window.#DraggingWindow)
        {
            UI_Window.#DraggingWindow.Handle_Dragging(id, position);
            if (UI_Window.#TopWindow)
                UI_Window.#TopWindow.Handle_HoverDrop(id, position, UI_Window.#DraggingWindow.DraggableElement);
        }
        UI_Window.SHandle_MouseLeave(position);
    }
    /**
     * Gestionnaire du scroll de la souris pour les UI_Window
     * @param {Vector} position Position de la souris
     */
    static SHandle_Scroll(position, deltaX, deltaY)
    {
        UI_Window.#GetTopWindow(position);
        if (UI_Window.#TopWindow)
            UI_Window.#TopWindow.Handle_Scroll(position, deltaX, deltaY);
        UI_Window.SHandle_MouseLeave(position);
    }
    /**
     * Gestionnaire des touches appuyés du clavier
     * @param {KeyboardEvent} keyboardEvent Evénement clavier associé
     */
    static SHandle_KeyJustDown(keyboardEvent)
    {
        if (UI_Window.#TopWindow)
        {
            UI_Window.#TopWindow.Handle_KeyJustDown(keyboardEvent);
        }
    }
    /**
     * Gestionnaire des touches enfoncés du clavier
     * @param {KeyboardEvent} keyboardEvent Evénement clavier associé
     */
    static SHandle_KeyDown(keyboardEvent)
    {
        if (UI_Window.#TopWindow)
        {
            UI_Window.#TopWindow.Handle_KeyDown(keyboardEvent);
        }
    }
    /**
     * Gestionnaire des touches relachés du clavier
     * @param {KeyboardEvent} keyboardEvent Evénement clavier associé
     */
    static SHandle_KeyJustUp(keyboardEvent)
    {
        if (UI_Window.#TopWindow)
        {
            UI_Window.#TopWindow.Handle_KeyJustUp(keyboardEvent);
        }
    }

    static SHandle_MouseLeave(position)
    {
        if(UI_Window.#PreviousTopWindow  && 
            UI_Window.#PreviousTopWindow != UI_Window.#TopWindow)
        {
            UI_Window.#PreviousTopWindow.Handle_MouseLeave();
        }
    }
    

    //#endregion

    #Root
    #Visible = false;
    #Actif = true;
    #Position = new Vector(0,0,0);
    #W;#H;
    #Padding = {left:0,right:0,up:0,down:0};
    #NeedRedraw = true;
    #winContext;
    #PauseUntilClosed = false;
    #Style = new UI_Window_Style(this);
    #Draggable = false;
    #Title = "New Window";  

    #PreviousTopElement;
    #TopElement;
    #PressingElement;
    #DraggableElement;
    #FocusElement;
    

    constructor(X,Y,Z,W,H,PauseUntilClosed = false)
    {
        UI_Window.#Windows.push(this);

        this.#winContext = document.createElement("canvas").getContext("2d");
        this.#Root = new UI_Root(this);
        this.X = X;
        this.Y = Y;
        this.Z = Z;
        this.W = W;
        this.H = H;
    }

    CreateEvent()
    {
        this.onClosing = [];
    }

    //#region GETTER SETTER

    /**
     * Position X.
     * @type {float}
     */
    get X()
    {
        return this.#Position.x
    }
    set X(value)
    {
        if (typeof(value) === "number")
        {
            this.#Position.x = value;
            this.Refresh();
        }
        else
        {
            Debug.LogErreurType("X", "number", value)
        }
    }
    /**
     * Position Y.
     * @type {float}
     */
    get Y()
    {
        return this.#Position.y
    }
    set Y(value)
    {
        if (typeof(value) === "number")
        {
            this.#Position.y = value
            this.Refresh();
        }
        else
        {
            Debug.LogErreurType("Y", "number", value)
        }
    }
    /**
     * Position Z.
     * @type {float}
     */
    get Z()
    {
        return this.#Position.z
    }
    set Z(value)
    {
        if (typeof(value) === "number")
        {
            this.#Position.z = value;
            UI_Window.SortWindow();
        }
        else
        {
            Debug.LogErreurType("Z", "number", value)
        }
    }
    /**
     * Largeur de la fenetre.
     * @type {float}
     */
    get W()
    {
        return this.#W
    }
    set W(value)
    {
        if (typeof(value) === "number")
        {
            this.#W = value;
            this.#winContext.canvas.width = value;
            this.Refresh();
        }
        else
        {
            Debug.LogErreurType("W", "number", value)
        }
    }
    /**
     * Largeur de la fenetre.
     * @type {float}
     */
    get H()
    {
        return this.#H
    }
    set H(value)
    {
        if (typeof(value) === "number")
        {
            this.#H = value;
            this.#winContext.canvas.height = value;
            this.Refresh();
        }
        else
        {
            Debug.LogErreurType("H", "number", value)
        }
    }
    get Root()
    {
        return this.#Root;
    }
    get Visible()
    {
        return this.#Visible && this.W > 0 && this.H > 0;
    }
    set Visible(v)
    {
        if (typeof(v) === "boolean")
        {
            this.#Visible = v;
        }
        else
        {
            Debug.LogErreurType("Visible", "boolean", v);
        }
    }
    get Actif()
    {
        return this.#Actif;
    }
    set Actif(v)
    {
        if (typeof(v) === "boolean")
        {
            this.#Actif = v;
            this.Refresh();
        }
        else
        {
            Debug.LogErreurType("Actif", "boolean", v);
        }
    }
    get PauseUntilClosed()
    {
        return this.#PauseUntilClosed;
    }
    set PauseUntilClosed(v)
    {
        if (typeof(v) === "boolean")
        {
            this.#PauseUntilClosed = v;
        }
        else
        {
            Debug.LogErreurType("Actif", "boolean", v);
        }
    }
    get Padding()
    {
        return this.#Padding;
    }
    get Style()
    {
        return this.#Style;
    }
    get NeedRedraw()
    {
        return this.#NeedRedraw || this.#Root.NeedRedraw;
    }
    get Draggable() { return this.#Draggable; }
    set Draggable(v) { this.#Draggable = v; }
    get Title() { return this.#Title; }
    set Title(v) { this.#Title = v; }
    get DraggableElement() { return this.#DraggableElement; }

    //#endregion


    //#region EVENT HANDLER

    /**
     * Gestion du départ de la souris
     */
    Handle_MouseLeave(position)
    {
        this.Root.Childrens.forEach(
            element => 
            {
                element.Handle_MouseLeave(position);
            }
        );
    }
    /**
     * Gestion du déplacement de la souris
     * @param {Vector} position Position de la souris
     */
    Handle_MouseMove(position)
    {
        this.#PreviousTopElement = this.#TopElement;
        this.#TopElement = this.Root.GetTopElement_CaptureSouris(position);
        if (this.#TopElement)
            this.#TopElement.Handle_MouseMove(position);
        if (this.#PreviousTopElement && 
            this.#PreviousTopElement !== this.#TopElement)
            this.#PreviousTopElement.Handle_MouseLeave(position);

    }
    /**
     * Gestion des clique de la souris
     * @param {int} id index du clique de souris
     * @param {Vector} position Position de la souris
     */
    Handle_Clique(id, position)
    {
        this.#PreviousTopElement = this.#TopElement;
        this.#TopElement = this.Root.GetTopElement_CaptureSouris(position);
        if (this.#TopElement && this.#PreviousTopElement === this.#TopElement &&
            (this.#DraggableElement === undefined || this.#DraggableElement === this.#TopElement))
            this.#TopElement.Handle_Clique(id, position);
        if (this.#PreviousTopElement && 
            this.#PreviousTopElement !== this.#TopElement)
            this.#PreviousTopElement.Handle_MouseLeave(position);
    }
    /**
     * Gestion de l'appuie des cliques de la souris
     * @param {int} id index du clique de souris
     * @param {Vector} position Position de la souris
     */
    Handle_Basse(id, position)
    {
        this.#PreviousTopElement = this.#TopElement;
        this.#TopElement = this.Root.GetTopElement_CaptureSouris(position);
        if (this.#TopElement && this.#PressingElement === undefined)
        {
            this.#PressingElement = this.#TopElement
        }
        if (this.#PressingElement)
            this.#PressingElement.Handle_Basse(id, position);
        if (this.#PreviousTopElement && 
            this.#PreviousTopElement !== this.#TopElement)
            this.#PreviousTopElement.Handle_MouseLeave(position);
    }
    /**
     * Gestion du relachement des cliques de la souris
     * @param {int} id index du clique de souris
     * @param {Vector} position Position de la souris
     */
    Handle_Relache(id, position)
    {
        if (this.#PressingElement)
        {
            this.#PressingElement.Handle_Relache(id, position);
            this.#PressingElement = undefined;
        }
    }
    /**
     * Gestion du début de drag de la souris
     * @param {int} id index du clique de souris
     * @param {Vector} position Position de la souris
     */
    Handle_DragStart(id, position)
    {
        if (this.#TopElement)
        {
            this.#DraggableElement = this.#TopElement;
            this.#DraggableElement.Handle_DragStart(id, position);
        }
    }
    /**
     * Gestion du fin de drag de la souris
     * @param {int} id index du clique de souris
     * @param {Vector} position Position de la souris
     */
    Handle_DragEnd(id, position)
    {
        if (this.#DraggableElement)
        {
            this.#DraggableElement.Handle_DragEnd(id, position);
            this.#DraggableElement = undefined;
        }
    }
    /**
     * Gestion du drag de la souris
     * @param {int} id index du clique de souris
     * @param {Vector} position Position de la souris
     */
    Handle_Dragging(id, position)
    {
        if (this.#DraggableElement)
        {
            this.#DraggableElement.Handle_Dragging(id, position);
        }
    }

    Handle_HoverDrop(id, position, dropelement)
    {
        // this.#PreviousTopElement = this.#TopElement;
        // this.#TopElement = this.Root.GetTopElement_CaptureDrop(position);
        // if (dropelement)
        // {
        //     if (this.#TopElement)
        //         this.#TopElement.Handle_HoverDrop(id, position, this.#DraggableElement);
        // }
        // if (this.#PreviousTopElement && 
        //     this.#PreviousTopElement !== this.#TopElement)
        //     this.#PreviousTopElement.Handle_MouseLeave(position);

        let a = this.Root.GetTopElement_CaptureDrop(position);
        if (dropelement)
        {
            if (a)
                a.Handle_HoverDrop(id, position, this.#DraggableElement);
        }
    }

    Handle_Drop(id, position, dropelement)
    {
        // this.#PreviousTopElement = this.#TopElement;
        // this.#TopElement = this.Root.GetTopElement_CaptureDrop(position);
        // if (dropelement)
        // {
        //     if (this.#TopElement)
        //         this.#TopElement.Handle_Drop(id, position, this.#DraggableElement);
        // }
        // if (this.#PreviousTopElement && 
        //     this.#PreviousTopElement !== this.#TopElement)
        //     this.#PreviousTopElement.Handle_MouseLeave(position);

        let a = this.Root.GetTopElement_CaptureDrop(position);
        if (dropelement)
        {
            if (a)
                a.Handle_Drop(id, position, this.#DraggableElement);
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
        let scroll = this.Root.GetTopElement_CaptureScroll(position);
        if (scroll)
        {
            scroll.Handle_Scroll(position, dx, dy);
        }
    }
    /**
     * Gestion de l'appuie d'une touche de clavier
     * @param {KeyboardEvent} e Evenement du clavier
     */
    Handle_KeyJustDown(e)
    {
        
    }
    /**
     * Gestion du maintient d'une touche de clavier
     * @param {KeyboardEvent} e Evenement du clavier
     */
    Handle_KeyDown(e)
    {
        
    }
    /**
     * Gestion du relachement d'une touche de clavier
     * @param {KeyboardEvent} e Evenement du clavier
     */
    Handle_KeyJustUp(e)
    {
        
    }

    Unfocus()
    {
        this.#FocusElement.Unfocus();
    }
 
    //#endregion

    Close()
    {
        let _this = this;
        let event = new UI_Window_Event("closing", _this);
        
        for (let ev = 0; ev < this.onClosing.length; ev++)
        {
            this.onClosing[ev](event)
        }
        if (event.Closing)
        {
            if (this.PauseUntilClosed)
            {
                Game.Pause_Game = false;
            }
            this.#Dispose();
        }
    }
    #Dispose()
    {
        UI_Window.DisposeWindow(this);
    }
    Show()
    {
        this.Visible = true;
        if (this.PauseUntilClosed)
        {
            Game.Pause_Game = true;
        }
    }
    Hide()
    {
        this.#Visible = false;
        if (this.PauseUntilClosed)
        {
            Game.Pause_Game = false;
        }
    }
    Refresh()
    { 
        this.#NeedRedraw = true;
        this.Root.SetDirty();
    }
    
    /**
     * Ajoute un élément enfant à cette élément
     * @param {UIElement} Element Element Enfant
     */
    AddChildren(Element)
    {
        return this.Root.AddChildren(Element);
    }
    /**
     * Supprimer un élément enfant
     * @param {UIElement} Element Element enfant
     */
    RemoveChildren(Element)
    {
        this.Root.RemoveChildren(Element);
    }

    Update(Delta)
    {
        if (this.Visible)
        {
            this.#Root.Update(Delta);
        }
    }

    Draw(Context)
    {
        if (this.Visible)
        {
            if (this.NeedRedraw)
            {
                this.#winContext.clearRect(0,0,this.#W,this.#H);
                this.DessinFond(this.#winContext);
                this.#Root.Draw(this.#winContext);
                this.#NeedRedraw = false;
            }
            Context.drawImage(this.#winContext.canvas,Math.round(this.X), Math.round(this.Y));
        }
    }
    /**
     * Effectue le dessin de la fenetre et de son contenue
     * @param {CanvasRenderingContext2D} Context Context de dessin
     */
    DessinFond(Context)
    {
        // Context.fillStyle = "brown"
        // Context.strokeStyle = "black"
        // Context.lineWidth = 3;
        // Context.fillRect(0,0,this.W,this.H);
        // Context.strokeRect(0,0,this.W,this.H);
    }
}

class UI_Window_Event
{
    constructor(type, sender)
    {
        switch(type)
        {
            case "closing": this.Closing_Event();
        }
        this.Sender = sender;
    }

    Closing_Event()
    {
        this.Closing = true;
    }
}