/// <reference path="ant.js" />
/// <reference path="grid.js" />
/// <reference path="pattern.js" />
/// <reference path="simulation.js" />

class Langton {
    constructor() {
        this.Pattern = new Pattern()
        this.Simulation = new Simulation()
    }
    RegisterOnReady() {
        this.Pattern.RegisterOnReady()
        this.Simulation.RegisterOnReady()

        $($.proxy(this.onReady, this))

    }
    onReady() {
        this.Grid = new Grid("Grid", this.Simulation.Size)
        this.Ant = new Ant(this.Grid.MiddleX, this.Grid.MiddleY)
        this.displayAntInfo()

        $(this.Ant).on("move", $.proxy(this.displayAntInfo, this))
        $("#Reset").on("click", $.proxy(this.Reset, this))
        $("#MoveForward").on("click", $.proxy(this.MoveForward, this))
        $("#Start").on("click", $.proxy(this.StartInterval, this))
        $("input[type='radio']").on("click", $.proxy(this.Reset, this))

        console.log("Langton.onReady")
    }
    displayAntInfo() {
        this.Grid.SetColor(this.Ant.X, this.Ant.Y, Ant.Color)
        $(".ant-x").html(this.Ant.X)
        $(".ant-y").html(this.Ant.Y)
        $(".ant-direction").html(this.Ant.Direction)
        $(".ant-nb-steps").html(this.Ant.NbSteps)
        
    }
    Reset(){
        this.Grid.Size = this.Simulation.Size
        this.Ant.Reset(this.Grid.MiddleX, this.Grid.MiddleY)
        this.StopInterval()
    }
    MoveForward(){
        var nbsteps = $("#NbSteps").val()
        this.SetInterval(this, nbsteps)
    }
    SetInterval(currentObject, nbsteps = null){
        var currentIndex = 1;
        intervalID = setInterval(function() {
            currentIndex++;
            /*** Première partie du TD ***/
            /*
            if(color === "#FFFFFF"){
                currentObject.Grid.SetColor(currentObject.Ant.X, currentObject.Ant.Y, "#000000")
                currentObject.Ant.TurnRight();
            }else{
                currentObject.Grid.SetColor(currentObject.Ant.X, currentObject.Ant.Y, "#FFFFFF")
                currentObject.Ant.TurnLeft();
            }*/
            var currentColor = currentObject.Grid.GetColor(currentObject.Ant.X, currentObject.Ant.Y)
            var trCurrentColor = $("#CurrentPattern tbody").find(`tr[data-if-color='${currentColor}']`)
            if(typeof trCurrentColor !== undefined ){
                $.each($(trCurrentColor).find('td select'), function(i, element){
                    var value = $(element).val()
                    if(value.includes('#')){
                        currentObject.Grid.SetColor(currentObject.Ant.X, currentObject.Ant.Y, value)
                    }else{
                        if(value === 'left'){
                            currentObject.Ant.TurnLeft();
                        }else{
                            currentObject.Ant.TurnRight();
                        }
                    }
                })

                
            }

            if((nbsteps !== null && currentIndex > nbsteps)
                || currentObject.Grid.GetColor(currentObject.Ant.X, currentObject.Ant.Y) === ""){
                    clearInterval(intervalID)
            }
        }, $("#Interval").val());
    }
    StopInterval(){
        $("#Start").html('D&eacute;marrer').off("click").on("click", $.proxy(this.StartInterval, this))
        clearInterval(intervalID)
    }
    StartInterval(){
        $("#Start").html('Arr&ecirc;ter').off("click").on("click", $.proxy(this.StopInterval, this))
        this.SetInterval(this)
    }
}

let intervalID;
let langton = new Langton()
langton.RegisterOnReady()
