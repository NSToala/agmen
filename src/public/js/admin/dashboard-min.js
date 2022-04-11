(function(d, io, $) {
    'use strict'

    var socket = io(),
        not = $('#msg-notificacion')

    $('.save-questions').click(e => {
        e.preventDefault()
		let array = new Array(),
		    question = $('#pregunta').val()

		if(question != "") {
			$(".ip-1").each(function() { if($(this).val() != "" ) { array.push($(this).val()) } })	

	        if( array.length != 0 ) 
	        	if( array.length >= 2 ) 	        	
	        		socket.emit('add question', { question: question, answers: array }, data => {
	        			if(data) {
                            alert("Su pregunta ha sido agregada con éxito!")
                            location.href = '/admin/votacion'
	        			}
			        })
	        	else
		        	alert("lo sentimos, debes agregar por lo menos 2 respuestas!")	
	        else
	        	alert("lo sentimos, debes agregar respuestas!")
		}else 
			alert("lo sentimos, el campo de pregunta no puede estar vacio!")
	})
    
    $('.btn-reload').on('click',() => socket.emit('reloadApp'))

    
    socket.on('votacion', data => {
        let table = ''        
        if( data.length != 0 )
            $.map( data, ( value, index ) => {
                table += `<tr><td colspan='3'>${value.nombre}</td><td class='text-center'><div class='badge badge-success mandar-voteo' id='${value.idvoto_pregunta}'>Mandar</div></td><td class='text-center'><div class='badge badge-danger cerrar-voteo' id='${value.idvoto_pregunta}'>Cerrar</div></td><td class='text-center'><div class='badge badge-primary btn-archivar' id='${value.idvoto_pregunta}'>Archivar</div></td></tr>`
            })
        else
            table = "<tr><td colspan='6' class='text-center'>No hay datos...</td></tr>"

        $('#table').empty().append(table)

        $('.mandar-voteo').click(e => {
            e.preventDefault()
            let id = event.target.id            
            socket.emit('mando votacion', { state: 1, id: id })
        })

         $('.btn-archivar').on('click', e => {
            e.preventDefault()
            var id = event.target.id
            socket.emit('archivar votacion',id)
        })

        $('.cerrar-voteo').on('click', e => {
            e.preventDefault()
            var id = event.target.id            
            socket.emit('mando votacion', { state: 0, id: id })
        })
    })

    socket.on('adminWordcloud', data => {
        console.log(data)
        let table = ''        
        if( data.length != 0 )
            $.map( data, ( value, index ) => {
                table += `<tr><td colspan='3'>${value.pregunta}</td><td class='text-center'><div class='badge badge-success mandar-wordcloud' id='${value.id_wordcloud}'>Mandar</div></td><td class='text-center'><div class='badge badge-danger cerrar-wordcloud' id='${value.id_wordcloud}'>Cerrar</div></td><td class='text-center'><div class='badge badge-primary btn-archivar-wordcloud' id='${value.id_wordcloud}'>Archivar</div></td></tr>`
            })
        else
            table = "<tr><td colspan='6' class='text-center'>No hay datos...</td></tr>"

        $('#table-wordcloud').empty().append(table)

        $('.mandar-wordcloud').click(e => {
            e.preventDefault()
            let id = event.target.id
            console.log(id)
            socket.emit('mando wordcloud', { state: 1, id: id })
        })

         $('.btn-archivar-wordcloud').on('click', e => {
            // e.preventDefault()
            // var id = event.target.id
            // socket.emit('archivar votacion',id)
        })

        $('.cerrar-wordcloud').on('click', e => {
            e.preventDefault()
            var id = event.target.id            
            socket.emit('mando wordcloud', { state: 0, id: id })
        })
    })

    $('.notification').on('click', e => {
        e.preventDefault()
        let notification = { msg : not.val(), option  : (e.target.id == 1)? true : false }
        socket.emit('mando alerta', notification)
    })
})(document, io, jQuery)