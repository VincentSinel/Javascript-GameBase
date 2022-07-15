class UI_Draggable extends UI_Selectable
{
    #dragstart;
    #dragmove;
    #dragging = false;
    
    constructor(Param)
    {
        super(Param);

        this.Capture_Drag  =true;

        let _this = this;
        this.onSouris_DragStart[Souris.ClicGauche].push(function(e) {_this.Souris_DragStart(e)})
        this.onSouris_Dragging[Souris.ClicGauche].push(function(e) {_this.Souris_Dragging(e)})
        this.onSouris_DragEnd[Souris.ClicGauche].push(function(e) {_this.Souris_DragEnd(e)})
    }

    get DragStart() { return this.#dragstart }
    get DragMove() { return this.#dragmove }
    get Dragging() { return this.#dragging }

    Souris_DragStart(event)
    {
        this.#dragstart = event.Param.clone();
        this.#dragging = true;
    }
    Souris_Dragging(event)
    {
        this.#dragmove = this.#dragstart.to(event.Param);
    }
    Souris_DragEnd(event)
    {
        this.#dragging = false;
        this.#dragmove = this.#dragstart.to(event.Param);
        if (this.Focusable)
        {
            this.Focus();
        }
    }
}