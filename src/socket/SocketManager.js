const socket = require('socket.io'),
    mast = require('../model/mast')

let io

exports.listen = server => {
    io = socket.listen(server)
    io.sockets.on('connection', socket => {
        initializeConnection(socket)
        socket.on('pregunta live',(data, callback) => {
            mast.insertTangerLive(data, err => {
                if(!err) {
                    experto()
                    callback(true)
                }else
                    console.log(err)                
            })                        
        })

        socket.on('save survey',(data, callback) => {
            mast.saveSurvey(data, err => {
                if(!err) {
                    callback(true)
                }else
                    console.log(err)                
            })                        
        })

        socket.on('update experto',(data) => {
            let qexpert = {
                id : data[0],
                state : !parseInt(data[1])
            }

            mast.updateTangerLive(qexpert , err => {
                if(!err) 
                    experto()
                else 
                    console.log(err)
            })
        });
        
        socket.on('archivar',(data) => {
            mast.archive(data , err => {
                if(!err) 
                    experto()
                else 
                    console.log(err)
            })
        });
        
        socket.on('archivar votacion',function (data) {
            mast.archiveVotacion(data , err => {
                if(!err) 
                    votacion()
                else 
                    console.log(err)
            })
        })

        //Alertas 
        socket.on('mando alerta', (data) => {
            io.sockets.emit('hay alerta', data)
        })

        //Votación 
        socket.on('mando votacion', (data) => {
            //Este if envia la votación
            if(data.state == '1') {
                mast.updateVotacion(data.id, err => {
                    if(!err)
                        mast.getQuestionsByState((err, rows) => {
                            io.sockets.emit('hay voteo', { questions: rows, state: data.state })
                        })
                    else 
                        console.log(err) 
                })
            }else if(data.state == '0') { //Este else cierra el sistema de votación
                mast.resetVotacion(err => {
                    io.sockets.emit('hay voteo', { state: data.state })
                })
            }	
        })

        //Wordcloud
        socket.on('mando wordcloud', (data) => {
            //Este if envia la votación
            if(data.state == '1') {
                mast.resetWordcloud(err => {
                    if(!err) {
                        mast.updateWordclouds(data.id, (err, rows) => {
                            if(!err) {
                                words()
                                io.sockets.emit('hay wordcloud', { wordcloud: rows, state: data.state })
                            }
                        }) 
                    }
                })
                
            }else if(data.state == '0') { //Este else cierra el sistema de votación
                io.sockets.emit('hay wordcloud', { state: data.state })
            }	
        })
        
        socket.on('voto',data => {
            let voto = { idvoto_pregunta : data.id_pregunta, idrespuesta : data.id_respuesta, uid: data.uid }
            mast.insertVoto(voto, err => {
                if(!err) 
                    mast.getVotosById(data.id_pregunta, (err, rows) => {
                        let votos = {},
                            total = 0
                    
                        rows.map((voto, index) => {
                            votos[voto.idrespuesta] = voto.repeticiones
                            total += voto.repeticiones
                        })
                        io.sockets.emit('calculando', votos, total)
                    })
                else 
                    console.log(err) 
            })
        })

        socket.on('add question', function( data, callback ) {
            mast.insertPreguntaVotacion(data, err => {
                if(!err)
                    callback(true)
                else
                    console.log(err) 
            })
        })

        socket.on("wordcloud", (data, callback) => {
            mast.wordcloud(data, err => {
                console.log(err)
                if(!err) {
                    callback(true)
                    words()
                } else 
                    console.log(err)
            })
        })

        //Reload app
        socket.on('reloadApp',() => {
            io.sockets.emit('refresh')
        })
    })
}

function initializeConnection(socket) {
    votacion(socket)
    experto(socket)
    admin_wordcloud(socket)
    words(socket)
    concurso(socket)
}

function words(socket) {    
    mast.getWords((err, rows) => {
        if(!err) {
            socket.emit('wordcloud', rows)
        } else 
            console.log(err)
    })
}

function admin_wordcloud(socket) {
    mast.getQuestionsWordcloud((err, rows)=> {
        if(!err) 
            socket.emit('adminWordcloud', rows)
        else 
            console.log(err) 
    })
}

function votacion(socket) {
    mast.getQuestionsVotacion((err, rows)=> {
        if(!err) 
            socket.emit('votacion', rows)
        else 
            console.log(err) 
    })
}

function concurso(socket) {
    mast.getQuestionsConcurso((err, rows)=> {
        if(!err) 
            socket.emit('concurso', rows)
        else 
            console.log(err) 
    })
}

function experto(socket) {
    mast.getQuestions((err, rows) => {
        if(!err) 
            io.sockets.emit('experto', rows)   
        else 
            console.log(err)                
    })
}