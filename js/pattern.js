
class Pattern {
    constructor() {
    }
    RegisterOnReady() {
        $($.proxy(this.onReady, this))
    }
    onReady() {
        console.log("Pattern.onReady")
        this.displayConditions()

        $("#Pattern").on("change", $.proxy(this.displayCurrentPattern, this))
    }
    static GetSelect(json, selected) {
        let html = '<select>'
        for (var property in json) {
            html += '<option value="' + property + '"'
            if (selected === property) {
                html += ' selected="selected"'
            }

            html += '>' + json[property] + '</option>'
        }

        html += '</select>'
        return html
    }
    static GetHtmlRow(step) {
        let settings = $.extend({
            if: "#FFFFFF",
            then: {
                color: "#FFFFFF",
                direction: "left"
            }
        }, step)

        let html = '<tr data-if-color="' + settings.if + '">'
        html += '<td class="if-color">' + PatternColor[settings.if] + '</td>'
        html += '<td class="then-color">' + Pattern.GetSelect(PatternColor, settings.then.color) + '</td>'
        html += '<td class="then-direction">' + Pattern.GetSelect(PatternDirection, settings.then.direction) + '</td>'
        html += '</tr>'
        return html
    }
    displayConditions(){
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: "https://api.myjson.com/bins/crrrn",
            crossDomain: true,
            success: function(response){
                JSON_object = $.map(response, function(el) { return el; })
                $(".condition").fadeIn(1000)
                $('#Pattern').append($('<option>', { 
                    value: "",
                    text : "--- Select pattern ---" 
                }));
                $.each(response.patterns, function (i, item) {
                    $('#Pattern').append($('<option>', { 
                        value: item.name,
                        text : item.name 
                    }));
                })
            },
            error: function(error, status){
                console.error(error)
            }
        })
    }
    displayCurrentPattern(){
        langton.Reset();
        var value = $("#Pattern").val()
        var tbody = $("#CurrentPattern tbody");

        $("#CurrentPattern tbody tr").remove()
        $.each(JSON_object, function(el){
            if(JSON_object[el].name === value){
                $.each(JSON_object[el].steps, function (i, sub){
                    tbody.append(Pattern.GetHtmlRow(sub));
                });
            } 
        })
        $("td.then-color select").on("change", $.proxy(this.editCurrentPattern, this))
    }
    editCurrentPattern(){
        var tbody = $("#CurrentPattern tbody");
        var alreadyfind = [];
        $(event.target).parent().parent().nextAll('tr').remove();
        if($(event.target).val() !== "#FFFFFF"){
            var addRow = {
                if: $(event.target).val(),
                    then: {
                        color: "#FFFFFF",
                        direction: "left"
                    }
                }

                $.each($('#CurrentPattern tbody tr'), function(i, element){
                    if($(event.target).val() === $(element).data('if-color') && $(event.target).val() !== "#FFFFFF"){
                        $(element).children('td.if-color').css('color', 'red').css('font-weight', '600')
                        alreadyfind.push(true)
                    }else{
                        $(element).children('td.if-color').css('color', 'initial').css('font-weight', '400')
                        console.log("ROW OK")
                        alreadyfind.push(false)
                    }
                })

                tbody.append(Pattern.GetHtmlRow(addRow));
                $("td.then-color select").on("change", $.proxy(this.editCurrentPattern, this))
            }else{
                $.each($('#CurrentPattern tbody tr'), function(i, element){
                    $(element).children('td.if-color').css('color', 'initial').css('font-weight', '400')
                    alreadyfind.push(false)
                })
            }

            //Vérification de doublon
            if(alreadyfind.includes(true)){
                $("#Start, #MoveForward, #Pattern").attr('disabled', "disabled")
            }else{
                $("#Start, #MoveForward, #Pattern").removeAttr('disabled')
            }
            
            langton.Reset()
        }
    
}

const PatternColor = Object.freeze({
    "#FFFFFF": "Blanc",
    "#6D9ECE": "Bleu Clair",
    "#1F5FA0": "Bleu Fonc&eacute;",
    "#6D071A": "Bordeaux",
    "#606060": "Gris",
    "#F0C300": "Jaune",
    "#000000": "Noir",
    "#FF7F00": "Orange",
    "#E0115F": "Rose",
    "#DB1702": "Rouge",
    "#008020": "Vert",
    "#7F00FF": "Violet"
})

const PatternDirection = Object.freeze({
    "left": "Gauche",
    "right": "Droite"
})

let JSON_object;