$(document).ready(function() {
	var socket = io.connect(),
		uid = $('#uid'),
		wordcloud = $('#wordcloud'),
		words = $('#words'),
		cwords = $('#canvas'),
		experto = $('#question_expert'),
		respuestas = $('.respuestas'),
		res = $('.collectionV'),
		pre = $('.pregunta'),
		votacion = $('.votacion'),
		votacion_response = $('.votacion-response'),
		reloj = $('#reloj_cuenta'),
		settime = ''

	if ( $(".sidenav").length > 0 ) {
		$('.sidenav').sidenav()	
	}
	
	$('.arrow-up').click(function(){
		$('body, html').animate({
			scrollTop: '0px'
		}, 300);
	});
	
	$(window).scroll(function(){
		if( $(this).scrollTop() > 0 ){
			$('.arrow-up').slideDown(300);
		} else {
			$('.arrow-up').slideUp(300);
		}
	});

	$('#signin-form').submit((event) => {
		const user = {
			fullname: $('#nombre').val(),
			username: $('#username').val()
		}
		
		if(user.fullname === "" || user.username === "") {
			event.preventDefault()
			alertify.set('notifier','position', 'top-right');
			alertify.notify('Lo sentimos, todos los campos son obligatorios.', 'custom', 122, function(){console.log('dismissed');});
		}
	})

	$('.circle-survey').click((event) => {
		let cadena = event.target.id,
			arreglo = cadena.split('-'),
			id = arreglo[0],
			escala = arreglo[1]
		
		$(`#survey-${id}`).val(escala)

		$(`.quest-${id}`).each((index) => {
			$(`.scala-${id}${(index + 1)}`).removeClass('active')
		})

		$(`.scala-${id}${escala}`).addClass('active')
	})

	$('.btn-send-survey').click((event) => {
		event.preventDefault()
		const survey = { uid: $('#uid').val()}
		let centinel = 1

		$('input[type=radio]').each(function () {
			if (this.checked) {
				let key = `question_${centinel}`
				
				survey[key] = $(this).val()
				centinel++
			}
 		})
		
		if(Object.values(survey).length > 10 ) {
			console.log(survey)
			console.log("Se envio algo!")

			socket.emit("save survey", survey, data => {
				if (data) {
					console.log(data)
					$('.container-surver').addClass('hide')
					$('.surver-congrats').removeClass('hide')
					localStorage.isSendSurvey = 1;
				}
			})
		}else {
			msg = "Lo sentimos, todos los campos son obligatorios."
			M.toast({html: msg , classes: 'rounded red darken-4'});
		}
	})

	$('.btn-expert').on('click', event => {
		event.preventDefault()
		
		if(experto.val() != "") {
			let question = {
				idioma: $('#idioma').val(),
				comentario: experto.val(),
				uid: uid.val()
			}

			envio_pregunta(question)
		}else {
			var msg = ($('#idioma').val() == "esp")? "Lo sentimos, el campo de pregunta no puede ir vacio!":"Lamentamos, mas o campo de pergunta não pode ficar em branco."
			
			M.toast({html: msg , classes: 'rounded red darken-4'});
		}		
	})

	$('.submit-wordcloud').on('click', (event) => {
		event.preventDefault()
		let wordcloud = words.val(),
			wid = $('#word-active').val()

		cwords.addClass('hide')

		if(wid != 0) {
			if(wordcloud != "") {
				let word = {
					words: wordcloud, 
					id_wordcloud: wid
				}
				
				socket.emit("wordcloud", word, response => {
					if(response) {
						M.toast({html: 'Palabra agregada!', classes: 'rounded light-blue darken-3'})
						words.val("")
						setTimeout(() => { 
							cwords.removeClass('hide')
						}, 500)
					}
				})
			}else {
				M.toast({html: 'Lo sentimos, el campo de wordcloud no puede ir vacio!', classes: 'rounded red darken-4'});
			}	
		}else {
			words.val("")
			M.toast({html: 'Lo sentimos, no hay una pregunta activa!', classes: 'rounded red darken-4'});
		}			
	})

	socket.on('hay alerta',data => {
		M.toast({html: data.msg, classes: 'rounded light-blue darken-3'})
	})

	socket.on('hay wordcloud', data => {
		if(data.state == '1') {
			console.log(data)
			$('#experto').addClass('hide')
			wordcloud.removeClass('animate__fadeOut hide').addClass('animate__fadeIn')
			$('.txt-worcloud').text(data.wordcloud[0].pregunta)
			$('#word-active').val(data.wordcloud[0].id_wordcloud)
			cwords.addClass('hide')

			down()
		}else {
			$('#experto').removeClass('hide')
			wordcloud.removeClass('animate__fadeIn').addClass('animate__fadeOut')
			top()
			setTimeout(() => {
				wordcloud.addClass('hide')
			}, 500);
		}
	})
	
	socket.on('hay voteo', data => {
		if(data.state == '1') {
			$('.overlay').addClass('hide')
			res.empty()
			$('._vote').removeClass('hide')
			votacion_response.addClass('hide')
			votacion.removeClass('hide animate__fadeOut').addClass('animate__fadeIn')
			pre.empty().html(data.questions[0].nombre)

			$.map(data.questions, (question, index) => {
				res.append(`<div class='collection-item ci-${question.idvoto_respuesta}'><label for='radio-${question.idvoto_respuesta}'><input class='with-gap css-checkbox' name='votacion' type='radio' id='radio-${question.idvoto_respuesta}' value='${question.idvoto_respuesta}' /><span>${question.opcion}</span></label></div>`)
			})

			down()
			clearTimeout(settime)
			reloj.val(60)
			cuenta_regresiva()
			
			$('.css-checkbox').off()				
			$('.css-checkbox').on('click', event => {
				var id = event.target.value,
					uid = ($('#uid').val() == "") ? '0' : $('#uid').val()
				$(`.ci-${id}`).addClass('active text-white')
				socket.emit('voto',{ id_respuesta :id, id_pregunta: data.questions[0].idvoto_pregunta, uid })
				$('.votacion').removeClass('animate__fadeIn').addClass('animate__fadeOut')
				pongo_off()

				setTimeout(() => { 
					votacion.addClass('hide')
					votacion_response.removeClass('hide')	
				}, 500)
				
				pre.empty().html(data.questions[0].nombre)
				respuestas.empty()

				$.map(data.questions, (question, index) => {
					respuestas.append(
					`<div class='row'>
						<div class='col-lg-7 col-md-7 col-12 format'>${question.opcion}</div>
						<div class='col-lg-4 col-md-4 col-10'>
							<div class='progress white mt-3'>
								<div class='determinate yellow darken-3' id='progressbar-${question.idvoto_respuesta}'></div>
							</div>
						</div>
						<div class='col-lg-1 col-md-1 col-2 text-center'>
							<div class='porcentaje-${question.idvoto_respuesta}  percent'></div>
						</div>
					</div><hr />`)
				})
			})
		}else {
			$('.overlay').removeClass('hide')
			$('._vote').addClass('animate__fadeOut')
			top()
			
			setTimeout(() => {
				$('._vote').addClass('hide').removeClass('animate__fadeOut')
			}, 600)
		}
	})

	socket.on('calculando',(data, total) => {
		$.map(data, (key, index) => {
			let percent = ( key * 100 ) / total
			
			$(`#progressbar-${index}`).animate({ width: `${percent}%` }, 1000 )
			$(`.porcentaje-${index}`).html( `${Math.round(percent)}%`)
		})
	})

	function pongo_off(){
		$('.css-checkbox').off().prop('disabled',true)
		$('.gracias').show()
	}
	
	function top() {
		$('html, body').animate({scrollTop: 0}, 600)
	}

	function down() {
		$('html, body').animate({
			scrollTop: $(document).height()
		}, 'slow')
	}

	function cuenta_regresiva(){
		var num = reloj.val()
		num <= 0 ? pongo_off() : num--
		
		reloj.val(num)
		$('.reloj').html(num)
		settime = setTimeout(() => { cuenta_regresiva() }, 1000)
	}

	function envio_pregunta(question){		
		socket.emit("pregunta live", question, data => {
			if (data) {
				experto.val("").blur()
				console.log(question)
				var msg = ""
				// Sua pergunta foi enviada com sucesso!
				if(question.idioma == "esp") {
					msg = "Su pregunta se envío con éxito!"
				}else {
					msg = "Sua pergunta foi enviada com sucesso!"
				}
				M.toast({html: msg , classes: 'rounded light-blue darken-3'})
			};
		})		
	}	

	socket.on('refresh',() => {
		location.reload();
	})
})