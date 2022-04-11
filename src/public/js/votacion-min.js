(function(d, io, $) {
    'use strict'
	
	var socket = io(),
		   pre = $('.pregunta'),
		   res = $('.respuestas'),
		   prepor = $('.pregunta-por'),
		   respor = $('.respuestas-por')

	socket.on('hay voteo', data => {
		if(data.state == '1') {
			res.empty().removeClass('text-center')
			pre.empty().html(`<h5>${data.questions[0].nombre}</h5>`)

			$.map(data.questions, (question, index) => {
				res.append(
				`<div class='row'>
					<div class='col-lg-7 col-md-7 col-12 format'>${question.opcion}</div>
					<div class='col-lg-4 col-md-4 col-10'>
						<div class='progress red lighten-4'>
							<div class='determinate red darken-3' id='progressbar-${question.idvoto_respuesta}'></div>
						</div>
					</div>
					<div class='col-lg-1 col-md-1 col-2 text-center'>
						<div class='porcentaje-${question.idvoto_respuesta}  percent'></div>
					</div>
				</div><hr />`)
			})
		}
	});

	socket.on('hay voteo por', data => {
		if(data.state == '1') {
			respor.empty().removeClass('text-center')
			prepor.empty().html(`<h5>${data.questions[0].nombre}</h5>`)

			$.map(data.questions, (question, index) => {
				respor.append(
				`<div class='row'>
					<div class='col-lg-7 col-md-7 col-12 format'>${question.opcion}</div>
					<div class='col-lg-4 col-md-4 col-10'>
						<div class='progress white'>
							<div class='determinate yellow darken-3' id='progressbar-${question.idvoto_respuesta}'></div>
						</div>
					</div>
					<div class='col-lg-1 col-md-1 col-2 text-center'>
						<div class='porcentaje-${question.idvoto_respuesta}  percent'></div>
					</div>
				</div><hr />`)
			})
		}
	});
	
	socket.on('calculando',(data, total) => {
		$.map(data, (key, index) => {
			let percent = ( key * 100 ) / total
			
			$(`#progressbar-${index}`).animate({ width: `${percent}%` }, 1000 )
			$(`.porcentaje-${index}`).html( `${Math.round(percent)}%`)
		})
	})
})(document, io, jQuery)