/**
 * Représente un PNJ permettant de définir des actions
 */
class PNJ_RPGMaker extends Lutin_RPGMaker
{
    #ListeAction = [];
    #RunningAction = [];
    #ActionActuel = 0;
    #Etat = "Starting";
    #StartTargetCamera;
    #CameraFollow = false;
    #CameraTarget = this;

    /**
     * 
     * @param {number} X Position X du PNJ
     * @param {number} Y Position Y du PNJ
     * @param {string} Texture Texture à utiliser;
     * @param {boolean} [Simple = true] Type de texture (true pour une seul perso, false pour 8 perso);
     * @param {int} [IdCostum = 0] ID perso de départ;
     * @param {int} [DirVue = 0] Direction du personnage (0 vers le bas; 1 gauche; 2 droite; 3 bas);
     */
    constructor(X,Y, Texture, Simple = true, IdCostum = 0, DirVue = 0)
    {
        super(X,Y, Texture, Simple, IdCostum, DirVue)

        this.DistanceInteraction = 60;
        this.Running = false;
        this.WaitID = 0;
        this.Waiter = new Waiter();

        this.PausePlayer = true;
    }

    /**
     * Modification Assignation Y pour modifier le Z.
     * @override
     */
    get Y()
    {
        return super.Y;
    }
    set Y(v)
    {
        super.Y = v;
        this.Z = v;
    }

    /**
     * Crée les actions à effectuer
     */
    Action()
    {
        this.A_Dire("C'est ici qu'il faut définir les actions", 3);
        this.A_Dire("C'est ici qu'il faut définir les actions", 0.5);


    }

    //#region GENERATEUR

    /**
     * Demande l'affichage d'une bulle de dialogue.
     * @param {string} Text Texte a afficher.
     * @param {float} Speed Vitesse d'affichage (frame par character)
     * @param {boolean} NeedEnter Définit si l'appuie sur entrer est attendue en fin de texte.
     * @param {boolean} WaitAtEnd Définit si une attente final est nécessaire pour executer l'action suivante.
     */
    A_Dire(Text,Speed = 3, NeedEnter = true, WaitAtEnd = true)
    {
        Text = Text.replace(/\/./g, "​​​")
        this.AddAction("Dire", [Text, Speed], WaitAtEnd || NeedEnter);
        if (NeedEnter)
            this.AddAction("WaitEnter", []);
    }
    /**
     * Demande un temps d'attente de x secondes
     * @param {float} seconde Temps en seconde
     */
    A_Wait(seconde)
    {
        this.AddAction("Wait", [seconde * Game.FPS]);
    }
    /**
     * Demande un temps d'attente jusqu'a ce qu'une condition soit vérifié
     * @param {string} Condition Condition sous forme d'un texte évaluable
     */
    A_WaitFor(Condition)
    {
        this.AddAction("WaitFor", [Condition]);
    }
    /**
     * Demande un temps d'attente de x frames.
     * @param {float} frame Nombre de frame
     */
    A_WaitFrame(frame)
    {
        this.AddAction("Wait", [frame]);
    }
    /**
     * Demande le déplacement de la camera
     * @param {float} X Déplacement relatif X de la camera
     * @param {float} Y Déplacement relatif Y de la camera
     * @param {float} Speed Vitesse de déplacement en seconde
     * @param {boolean} WaitAtEnd Définit si l'action suivantes doit attendre que celle-ci soit terminé
     */
    A_MoveCamera(X,Y,Speed = 2, WaitAtEnd = true)
    {
        this.AddAction("MoveCamera", [X,Y,Speed], WaitAtEnd);
        if (WaitAtEnd)
            this.AddAction("WaitEnter");
    }
    /**
     * Demande le suivit d'un objet par la camera
     * @param {GameObject} Target Objet cible de la camera
     */
    A_CameraFollow(Target = this)
    {
        this.AddAction("CameraFollow", [Target]);
    }
    /**
     * Demande le déplacement de ce PNJ
     * @param {float} X Déplacement relatif X du PNJ
     * @param {float} Y Déplacement relatif Y du PNJ
     * @param {float} Speed Vitesse de déplacement en seconde
     * @param {boolean} WaitAtEnd Définit si l'action suivantes doit attendre que celle-ci soit terminé
     */
    A_MoveTo(X,Y,Speed = 2, WaitAtEnd = true)
    {
        this.AddAction("MoveTo", [X,Y,Speed], WaitAtEnd);
    }
    /**
     * Demande le déplacement du Joueur
     * @param {float} X Déplacement relatif X du Joueur
     * @param {float} Y Déplacement relatif Y du Joueur
     * @param {float} Speed Vitesse de déplacement en seconde
     * @param {boolean} WaitAtEnd Définit si l'action suivantes doit attendre que celle-ci soit terminé
     */
    A_MovePlayerTo(X,Y,Speed = 2, WaitAtEnd = true)
    {
        this.AddAction("MovePlayerTo", [X,Y,Speed], WaitAtEnd);
    }
    /**
     * Demande un appel de fonction.
     * @param {string} Expression String évaluable
     */
    A_CallFunction(Expression)
    {
        this.AddAction("CallFunction", [Expression]);
    }
    /**
     * Demande l'execution forcé des actions d'un PNJ
     * @param {PNJ} PNJ PNJ cible de l'appel
     */
    A_RunPNJ(PNJ)
    {
        this.AddAction("RunPNJ", [PNJ]);
    }
    /**
     * Ajoute une action à la liste des actions
     * @param {string} Name Nom de l'action
     * @param {Array} Parameters Liste des paramètres
     * @param {boolean} WaitAtEnd Définit si l'action suivantes doit attendre que celle-ci soit terminé
     */
    AddAction(Name, Parameters = [], WaitNext = true)
    {
        this.#ListeAction.push({name: Name ,param: Parameters ,waitnext: WaitNext});
    }

    //#endregion

    //#region GESTION

    /**
     * Lance les actions de ce PNJ (Forcé)
     */
    Start()
    {
        this.#StartAction();
    }
    /**
     * Lance les actions de ce PNJ (Non Forcé)
     */
    #StartAction()
    {
        if (this.PausePlayer)
        {
            Actor.Pause += 1;
        }
        this.Running = true;
        this.#Etat = "Starting"
        this.#CameraFollow = true;
        this.#CameraTarget = this;
        this.#StartTargetCamera = Actor.Current;
    }
    /**
     * Mise a jour principale
     */
    #UpdateAction()
    {
        if(this.#Etat === "Starting")
        {
            this.#UpdateStarting();
        }
        else if (this.#Etat === "Updating")
        {
            this.#UpdateStep();
        }
        else
        {
            this.#UpdateEnding();
        }
    }
    /**
     * Mise a jour des étapes d'actions
     */
    #UpdateStep()
    {
        if (this.#CameraFollow)
        {
            Camera.X = (Camera.X * 5 + this.#CameraTarget.X) / 6;
            Camera.Y = (Camera.Y * 5 + this.#CameraTarget.Y) / 6;
        }

        this.Waiter.Next();
        let run = true;
        while(run)
        {
            let i = 0;
            while (i < this.#RunningAction.length) 
            {
                let a = this.#Run(this.#RunningAction[i]);
                if(a !== R.Pause)
                {
                    this.#RunningAction.splice(i, 1);
                }
                else
                {
                    i++;
                }
            }
            if (this.#ListeAction.length > this.#ActionActuel)
            {
                let action = this.#ListeAction[this.#ActionActuel];
                if (!action.starttime) action.starttime = this.Waiter.Current;
                if(action.waitnext)
                {
                    let result = this.#Run(action);
                    if (result === R.Pause)
                    {
                        run = false;
                    }
                    else if (result === R.Next)
                    {
                        this.#ActionActuel++;
                        this.WaitID = this.Waiter.Next();
                    }
                    else if (result === R.Stop)
                    {
                        this.Running = false;
                        run = false;
                    }
                    else if (result === R.Error)
                    {
                        throw "Erreur"
                    }
                }
                else
                {
                    this.#RunningAction.push(action);
                    this.#ActionActuel++;
                }
            }
            else if (Clavier.ToucheJusteBasse("Enter"))
            {
                run = false;
                this.#ActionActuel++;
            }
            else if (this.#RunningAction.length === 0)
            {
                run = false;
                this.#Etat = "Ending"
            }
            else
            {
                run = false;
            }
        }
    }
    /**
     * Mise a jour préparation
     */
    #UpdateStarting()
    {
        this.#ActionActuel = 0;
        this.#ListeAction = [];
        this.Action();
        this.WaitID = this.Waiter.Next();
        this.#Etat = "Updating"
    }
    /**
     * Mise a jour fin d'actions
     */
    #UpdateEnding()
    {
        if( (Math.abs(Camera.X - this.#StartTargetCamera.X) > 2 ||
        Math.abs(Camera.Y - this.#StartTargetCamera.Y) > 2))
        {
            Camera.X = (Camera.X * 5 + this.#StartTargetCamera.X) / 6;
            Camera.Y = (Camera.Y * 5 + this.#StartTargetCamera.Y) / 6;
        }
        else
        {
            Camera.X = this.#StartTargetCamera.X;
            Camera.Y = this.#StartTargetCamera.Y;
            this.Running = false;
            if (this.PausePlayer)
            {
                Actor.Pause -= 1;
            }
        }
    }
    /**
     * Avance une action d'une frame
     * @param {Object} action Action a effectuer
     * @returns {R} Etat de retour
     */
    #Run(action)
    {
        let param = action.param;
        this.WaitID = action.starttime;
        switch (action.name) {
            case 'Dire':            return this.#Action_Dire(param[0], param[1]);
            case 'Wait':            return this.#Action_Wait(param[0]);
            case 'WaitFor':         return this.#Action_WaitFor(param[0]);
            case 'WaitEnter':       return this.#Action_WaitFor("Clavier.ToucheJusteBasse('Enter')");
            case 'MoveCamera':      return this.#Action_MoveCamera(param[0],param[1],param[2]);
            case 'CameraFollow':    return this.#Action_CameraFollow(param[0]);
            case 'MoveTo':          return this.#Action_MoveTo(param[0],param[1],param[2]);
            case 'MovePlayerTo':    return this.#Action_MovePlayerTo(param[0],param[1],param[2]);
            case 'CallFunction':    return this.#Action_CallFunction(param[0]);
            case 'RunPNJ':          return this.#Action_RunPNJ(param[0]);
            default: return this.AutreAction(action.Name, param);
        }
    }
    /**
     * Permet de gerer des actions supplémentaires créer par l'utilisateur du moteur
     * @param {string} Name Nom de l'action
     * @param {Array} Param Parametre de l'action
     * @returns {R} Etat de retour
     */
    AutreAction(Name, Param)
    {
        return R.Error
    }

    //#endregion

    //#region ACTIONS

    /**
     * Effectue l'affichage du texte
     * @param {string} Texte Texte a afficher
     * @param {number} Speed Vitesse d'affichage (frame par character)
     * @returns {R} Etat de retour
     */
    #Action_Dire(Texte,Speed)
    {
        let t = this.Waiter.Current - this.WaitID;
        this.Dire(Texte.slice(0, Speed === 0 ? Texte.length : Math.floor(t / Speed)));
        if (t <= Texte.length * Speed)
            return R.Pause
        else
            return R.Next
    }
    /**
     * Effectue une pause de x frames
     * @param {float} frame Nombre de frame a attendre
     * @returns {R} Etat de retour
     */
    #Action_Wait(frame)
    {
        let t = this.Waiter.Current - this.WaitID;
        if (t < frame)
            return R.Pause
        else
            return R.Next
    }
    /**
     * Effectue une pause jusqu'a ce qu'une condition soit remplie
     * @param {string} expression Texte evaluable (javascript)
     * @returns {R} Etat de retour
     */
    #Action_WaitFor(expression)
    {
        if (eval(expression))
        {
            this.Parle = false;
            return R.Next;
        }
        else
        {
            return R.Pause;
        }
    }
    /**
     * Effectue le déplacement de la camera
     * @param {float} X Déplacement relatif X de la camera
     * @param {float} Y Déplacement relatif Y de la camera
     * @param {float} Speed Vitesse de déplacement en seconde
     * @returns {R} Etat de retour
     */
    #Action_MoveCamera(X,Y,Speed)
    {
        this.#CameraFollow = false;
        if (Speed > 0)
        {
            let mx = X / (Game.FPS * Speed);
            let my = Y / (Game.FPS * Speed);
            let t = this.Waiter.Current - this.WaitID;
            Camera.X += mx;
            Camera.Y += my;
            if (t <= Game.FPS * Speed)
                return R.Pause
            else
                return R.Next
        }
        else
        {
            Camera.X += X;
            Camera.Y += Y;
            return R.Next
        }
    }
    /**
     * Effectue le suivit d'un objet par la camera
     * @param {GameObject} Target Objet cible de la camera
     * @returns {R} Etat de retour
     */
    #Action_CameraFollow(target)
    {
        this.#CameraFollow = true;
        this.#CameraTarget = target;
        return R.Next;
    }
    /**
     * Effectue le déplacement de ce PNJ
     * @param {float} X Déplacement relatif X du PNJ
     * @param {float} Y Déplacement relatif Y du PNJ
     * @param {float} Speed Vitesse de déplacement en seconde
     * @returns {R} Etat de retour
     */
    #Action_MoveTo(X,Y,Speed)
    {
        let mx = X / (Game.FPS * Speed);
        let my = Y / (Game.FPS * Speed);
        let t = this.Waiter.Current - this.WaitID;

        if(Math.abs(mx) > Math.abs(my))
        {
            if(mx > 0)
                this.DirectionVue = 2;
            else
                this.DirectionVue = 1;
        }
        else
        {
            if(my > 0)
                this.DirectionVue = 0;
            else
                this.DirectionVue = 3;
        }

        this.FrameSuivante();

        this.X += mx;
        this.Y += my;
        if (t <= Game.FPS * Speed)
            return R.Pause
        else
        {
            this.FrameIDLE();
            return R.Next
        }
    }
    /**
     * Effectue le déplacement du Joueur
     * @param {float} X Déplacement relatif X du Joueur
     * @param {float} Y Déplacement relatif Y du Joueur
     * @param {float} Speed Vitesse de déplacement en seconde
     * @returns {R} Etat de retour
     */
    #Action_MovePlayerTo(X,Y,Speed)
    {
        let mx = X / (Game.FPS * Speed);
        let my = Y / (Game.FPS * Speed);
        let t = this.Waiter.Current - this.WaitID;

        if(Math.abs(mx) > Math.abs(my))
        {
            if(mx > 0)
                Actor.Current.DirectionVue = 2;
            else
                Actor.Current.DirectionVue = 1;
        }
        else
        {
            if(my > 0)
                Actor.Current.DirectionVue = 0;
            else
                Actor.Current.DirectionVue = 3;
        }

        Actor.Current.FrameSuivante();

        Actor.Current.X += mx;
        Actor.Current.Y += my;
        if (t <= Game.FPS * Speed)
            return R.Pause
        else
        {
            Actor.Current.FrameIDLE();
            return R.Next
        }
    }
    /**
     * Effectue un appel de fonction.
     * @param {string} Expression String évaluable
     * @returns {R} Etat de retour
     */
    #Action_CallFunction(Expression)
    {
        eval(Expression);
        return R.Next;
    }
    /**
     * Effectue l'execution forcé des actions d'un PNJ
     * @param {PNJ} PNJ PNJ cible de l'appel
     * @returns {R} Etat de retour
     */
    #Action_RunPNJ(Pnj)
    {
        Pnj.Start();
        return R.Next;
    }

    //#endregion


    /**
     * Appel la mise à jour de l'utilisateur
     * @param {float} Delta Temps depuis la dernière frame
     */
    Calcul(Delta)
    {
        super.Calcul(Delta)

        if (this.Running)
            this.#UpdateAction();

        let x = Actor.Current.X - this.X;
        let y = Actor.Current.Y - this.Y;
        let distance = Math.sqrt(x*x + y*y)

        if (distance < this.DistanceInteraction && !this.Running)
        {
            if(Clavier.ToucheJusteBasse("Enter"))
            {
                this.#StartAction();
            }
        }
    }
}

/**
 * Gere le temps d'attente lors de l'execution d'un script
 */
class Waiter 
{
    #WaiterHolder;
    /**
     * Génére une instance de waiter
     */
    constructor()
    {
        this.#WaiterHolder = this.Wait();
        this.Current = 0;
    }

    /**
     * Récupère l'index de mise a jour suivants
     */
    * Wait()
    {
        var index = 0;
        while(true)
            yield index++;
    }
    /**
     * Génére la frame suivante
     * @returns {int} frame actuel
     */
    Next()
    {
        this.Current = this.#WaiterHolder.next().value
        return this.Current;
    }
}

/**
 * Etat de retour des actions
 * @enum
 */
class R
{
    static Pause = 1;
    static Stop = 2;
    static Error = 3;
    static Next = 4;
}