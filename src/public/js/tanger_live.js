(function(d, io, $) {
    'use strict'
    $('.sidenav').sidenav()

    var socket = io(),
        divp = $('.filter'),
        divppor = $('.filter-por'),
        dive = $('.div-experto'),
        divepor = $('.div-experto-por')

    socket.on('experto', data => {
        divp.html(null)
        divppor.html(null)
        view_experto(data)

        $.map(data, (question, index) => {
            if(question.idioma == "esp") {
                switch_experto(question, index, divp)
            }else if(question.idioma == "por") {
                switch_experto(question, index, divppor)
            }
        })
        
        $('.btn-mostrar').on('click', event => {
            var id = event.target.id.split('-')
            socket.emit('update experto',id)
        })

        $('.btn-archivar').on('click',() => {
            var id = event.target.id.split('-')
            console.log(id)
            socket.emit('archivar',id[0])
        })
    })

    function switch_experto(question, index, container) {
        if(question.estado == '0') {
            let disable = (question.mostrada == '1') ? 'disable' : ''
            
            container.append(`<div class='row collection-item ${disable} algo-${index}'><div class="col-md-12 my-4 text-question">${question.comentario}</div><div class="col-md-3 col-6 text-md-left text-center my-3"><button class="btn btn-mostrar waves-effect waves-light" id='${question.idtanger_live}-${question.estado}'><i class="material-icons right">visibility</i>Filtrar</button></div><div class="col-md-3 col-6 text-md-left text-center my-3"><button class="btn btn-archivar waves-effect waves-light" id='${question.idtanger_live}-${question.estado}'><i class="material-icons right">archive</i>Archivar</button></div></div>`)
        }else {
            container.append(`<div class='row collection-item algo-${index}'><div class="col-md-12 my-4 text-question">${question.comentario}</div><div class="col-md-12 col-6 my-3"><button class="btn btn-mostrar waves-effect waves-light red" id='${question.idtanger_live}-${question.estado}'><i class="material-icons right">visibility_off</i>Remover</button></div></div>`)
        }
    }
    
    function view_experto(data) {
        dive.html(null)
        divepor.html(null)

        $.map(data, (question, index) => {
            if(question.idioma == "esp") {
                filter_experto(question, dive)
            }else if(question.idioma == "por") {
                filter_experto(question, divepor)
            }
        })
    }

    function filter_experto(question, container) {
        if(question.estado == '1') 
            container.append(`<div class='row collection-item'><span class='my-3 text-expert'>${question.comentario}</span></div>`)
        // else
        //     container.html(`<div class='row collection-item'><div class='col-12 my-3 text-expert-2'>No hay preguntas!</div></div>`)
    }
    
})(document, io, jQuery)