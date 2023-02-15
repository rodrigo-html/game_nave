//Elemento
const menu = document.querySelector('#menu')
const btOk = document.querySelector('#ok')
const campo = document.querySelector('#campo')
const nave = document.querySelector('#nave')
const life = document.querySelector('#life')
const res = document.querySelector('#res')
const most = document.querySelectorAll('.most')
var rec = document.querySelector('#rec')
var bombas
var pente
//Posição
var navePx = nave.offsetLeft
var navePy = nave.offsetTop
//Tamanho
var campoW = campo.offsetWidth
var campoH = campo.offsetHeight
var naveW = nave.offsetWidth
var naveH = nave.offsetHeight
//Direção
var naveDx = 0
var naveDy = 0
//Controle
var ct
var story
var pontos = 0
var bar = life.offsetWidth
var game = true
var velNave
var velTiro = 7
var velBomba
var chama
var ie = 0
document.addEventListener('keydown', down)
document.addEventListener('keyup', up)
btOk.addEventListener('click', ()=>{
    if(document.forms[0].elements[2].value=='facil'){
        start(1,5,1500,'facil')
    }else if(document.forms[0].elements[2].value=='normal'){
        start(2,5,750,'normal')
    }else if(document.forms[0].elements[2].value=='dificil'){
        start(5,7,500,'dificil')
    }else if(document.forms[0].elements[2].value=='selecione'){
        alert('selecione uma opção válida')
        return
    }
})

function start(vB,vN,tmp,dif){
    if(!localStorage.getItem(dif)){
        localStorage.setItem(dif,0)
    }
    campo.style.backgroundImage='linear-gradient(to bottom, #000,rgb(70,70,70))'
    most[0].style.visibility='visible'
    most[1].style.visibility='visible'
    nave.style.visibility='visible'
    menu.style.display='none'
    velBomba = vB
    velNave = vN
    story = localStorage.getItem(dif)
    ct = dif
    rec.innerHTML=story
    chama = setInterval(criaBomba,tmp)
    moveNave()
}
function down(){
    var tecla = event.key
    switch (tecla){
        case 'ArrowLeft':naveDx=-1
            break
        case 'ArrowRight':naveDx=1
            break
        case 'ArrowUp':naveDy=-1
            break
        case 'ArrowDown':naveDy=1
            break
        case 'Control':atira()
    }
}
function up(){
    var tecla = event.key
    switch (tecla){
        case 'ArrowLeft':naveDx=0
            break
        case 'ArrowRight':naveDx=0
            break
        case 'ArrowUp':naveDy=0
            break
        case 'ArrowDown':naveDy=0
    }
}
function atira(){
    var tiro = document.createElement('div')
    var att1 = document.createAttribute('class')
    var att2 = document.createAttribute('style')
    att1.value = 'tiro'
    att2.value = `left:${(navePx+(naveW/2))-3}px;top:${navePy-5}px;`
    tiro.setAttributeNode(att1)
    tiro.setAttributeNode(att2)
    campo.appendChild(tiro)
}
function criaBomba(){
    var bomba = document.createElement('div')
    var att1 = document.createAttribute('class')
    var att2 = document.createAttribute('style')
    att1.value = 'bomba'
    att2.value = `top:-40px;left:${(Math.floor(Math.random()*(campoW-60)))+20}px;`
    bomba.setAttributeNode(att1)
    bomba.setAttributeNode(att2)
    campo.appendChild(bomba)
}
function moveNave(){
    navePx += naveDx*velNave
    navePy += naveDy*velNave
    if(navePx+naveW>campoW||navePx<-2){
        navePx += naveDx*velNave*-1
    }
    if(navePy+naveH>campoH||navePy<-2){
        navePy += naveDy*velNave*-1
    }
    nave.style.left=navePx+'px'
    nave.style.top=navePy+'px'
    moveTiro()
    moveBomba()
    colisao(ct)
    if(bar<5){
        var over = document.createElement('h1')
        var att1 = document.createAttribute('id')
        over.textContent='Game Over'
        att1.value='telaOver'
        over.setAttributeNode(att1)
        campo.appendChild(over)
        if(pontos>story){
            localStorage.setItem(ct,pontos)
        }
        game = false
    }
    if(!game){
        clearInterval(chama)
    }
    if(game){
        var loop = requestAnimationFrame(moveNave)
        }
}
function moveTiro(){
    pente = document.querySelectorAll('.tiro')
    if(pente[0]){
        for(x=0;x<pente.length;x++){
            let tiroPy = pente[x].offsetTop
            tiroPy += -1*velTiro
            pente[x].style.top=tiroPy+'px'
            if(tiroPy<-20){
                campo.removeChild(pente[x])
            }
        }
    }
}
function moveBomba(){
    bombas = document.querySelectorAll('.bomba')
    if(bombas[0]){
        for(x=0;x<bombas.length;x++){
            let bombaPy = bombas[x].offsetTop
            bombaPy += 1*velBomba
            bombas[x].style.top=bombaPy+'px'
            if(bombaPy>campoH-bombas[x].offsetHeight){
                bar -= 9.6
                life.style.width=bar+'px'
                criaExplosao(2,bombas[x].offsetLeft,null)
                campo.removeChild(bombas[x])
            }
        }
    }
}
function colisao(ct){
    if(bombas[0]){
        for(b=0;b<bombas.length;b++){
            for(t=0;t<pente.length;t++){
                let tiroPy = pente[t].offsetTop
                let tiroPx = pente[t].offsetLeft
                let bombaPy = bombas[b].offsetTop
                let bombaPx = bombas[b].offsetLeft
                if(tiroPy<bombaPy+bombas[b].offsetHeight&&tiroPx<bombaPx+bombas[b].offsetWidth&&tiroPx+pente[t].offsetWidth>bombaPx&&tiroPy+pente[t].offsetHeight>tiroPy){
                    criaExplosao(1,bombaPx-25,bombaPy)
                    pontos++
                    if(pontos>story){
                        localStorage.setItem(ct,pontos)
                    }
                    res.value=pontos
                    campo.removeChild(bombas[b])
                    campo.removeChild(pente[t])
                }
            }
        }
    }
}
function criaExplosao(tipo,x,y){
    if(document.querySelector('#explosao'+(ie-4))){
        document.querySelector('#explosao'+(ie-4)).remove()
    }
    var explosao = document.createElement('div')
    var img = document.createElement('img')
    var att1 = document.createAttribute('class')
    var att2 = document.createAttribute('style')
    var att3 = document.createAttribute('id')
    var att4 = document.createAttribute('src')
    att3.value=`explosao${ie}`
    if(tipo==1){
        att1.value = 'explosaoAr'
        att2.value = `top:${y}px;left:${x}px;`
        att4.value = 'explosao_ar.gif?'+new Date()+ie
    }else{
        att1.value = 'explosaoChao'
        att2.value = `top:${campoH-57}px;left:${x-17}px;`
        att4.value = 'explosao_chao.gif?'+new Date()
    }
    explosao.setAttributeNode(att1)
    explosao.setAttributeNode(att2)
    explosao.setAttributeNode(att3)
    img.setAttributeNode(att4)
    explosao.appendChild(img)
    campo.appendChild(explosao)
    ie++
}
