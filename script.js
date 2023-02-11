//Elementos
const campo = document.querySelector('#campo')
const obj = document.querySelector('#obj')
const life = document.querySelector('#life')
const res = document.querySelector('#res')
var rec = document.querySelector('#rec')
//Posição
var objPx = obj.offsetLeft
var objPy = obj.offsetTop
var campoPx = campo.offsetLeft
var campoPy = campo.offsetTop
//Direção
var objDx = 0
var objDy = 0
//Controle
var pontos = 0
var bar = life.offsetWidth
var pente
var ini
var loop
var velObj = 7
var velBala = 10
var velIni = 1
var game = true

rec.innerHTML=localStorage.story
document.addEventListener('keydown',down)
document.addEventListener('keyup',up)
moveJogador()
var intervalo = setInterval(criaInimigo,400)
function down(){
    var tecla = event.key
    switch (tecla){
        case 'ArrowLeft':objDx=-1
            break
        case 'ArrowRight':objDx=1
            break
        case 'ArrowUp':objDy=-1
            break
        case 'ArrowDown':objDy=1
            break
        case 'Control':atira()
    }
}
function up(){
    var tecla = event.key
    switch (tecla){
        case 'ArrowLeft':objDx=0
            break
        case 'ArrowRight':objDx=0
            break
        case 'ArrowUp':objDy=0
            break
        case 'ArrowDown':objDy=0
    }
}
function moveJogador(){
    objPx += objDx*velObj
    objPy += objDy*velObj
    obj.style.left=objPx+'px'
    obj.style.top=objPy+'px'
    if(objPx+50>campo.offsetWidth||objPx<10){
        objPx += objDx*velObj*-1
    }else if(objPy+50>campo.offsetHeight+30){
        objPy += objDy*velObj*-1
    }
    moveTiro()
    moveInimigo()
    colisao()
    if(bar<5){
        var over = document.createElement('h1')
        var att1 = document.createAttribute('id')
        over.textContent='Game Over'
        att1.value='telaOver'
        over.setAttributeNode(att1)
        campo.appendChild(over)
        if(pontos>Number(localStorage.story)){
            window.localStorage.story=pontos
        }
        game = false
    }
    if(!game){
        clearInterval(intervalo)
    }
    if(game){
        loop = requestAnimationFrame(moveJogador)
    }
}
function atira(){
    var bala = document.createElement('div')
    var att1 = document.createAttribute('class')
    var att2 = document.createAttribute('style')
    att1.value = 'proj'
    att2.value = `left:${objPx+15}px;top:${objPy-12}px;`
    bala.setAttributeNode(att1)
    bala.setAttributeNode(att2)
    campo.appendChild(bala)
}
function moveTiro(){
    pente = document.querySelectorAll('.proj')
    if(pente[0]){
        for(x=0;x<pente.length;x++){
            let balaPy = pente[x].offsetTop
            balaPy += -1*velBala
            pente[x].style.top=balaPy+'px'
            if(balaPy<-10){
                campo.removeChild(pente[x])
            }
        }
    }
}
function moveInimigo(){
    ini = document.querySelectorAll('.clIni')
    if(ini[0]){
        for(x=0;x<ini.length;x++){
            let iniPy = ini[x].offsetTop
            iniPy += 1*velIni
            ini[x].style.top=iniPy+'px'
            if(iniPy>campo.offsetHeight){
                campo.removeChild(ini[x])
                bar+=-9.6
                life.style.width=bar+'px'
            }
        }
    }
}
function colisao(){
    if(pente[0]){
        for(t=0;t<pente.length;t++){
            for(i=0;i<ini.length;i++){
                if(pente[t].offsetTop<ini[i].offsetTop+ini[i].offsetHeight&&pente[t].offsetTop+pente[t].offsetHeight>ini[i].offsetTop&&pente[t].offsetLeft<ini[i].offsetLeft+ini[i].offsetWidth&&pente[t].offsetLeft+pente[t].offsetWidth>ini[i].offsetLeft){
                    campo.removeChild(ini[i])
                    campo.removeChild(pente[t])
                    pontos++
                    res.value=pontos
                }
            }
        }
    }
}
function criaInimigo(){
    var inimigo = document.createElement('div')
    var att1 = document.createAttribute('class')
    var att2 = document.createAttribute('style')
    att1.value = 'clIni'
    att2.value = `top:-20px;left:${(Math.floor(Math.random()*(campo.offsetWidth-60)))+30}px;`
    inimigo.setAttributeNode(att1)
    inimigo.setAttributeNode(att2)
    campo.appendChild(inimigo)
}   
