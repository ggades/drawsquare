var div;
var posx;
var posy;
var initx = false;
var inity = false;
bloq = false;
imagem = document.querySelector("#imgArea");

function getMouse(obj,e){
	// Define posições iniciais
	posx = 0;
	posy = 0;
	
	// Declara variavel para o evento (tratamento para versões antigas do FF e IE)
	var ev = (!e) ? window.event : e;
	
	// Ev FF
	if (ev.pageX){ 
		// Retorna posição do ponteiro
		posx=ev.pageX+window.pageXOffset; 
		posy=ev.pageY+window.pageYOffset; 
	}
	// Ev IE
	else if(ev.clientX){
		// Retorna posição do ponteiro
		posx=ev.clientX+imagem.scrollLeft; 
		posy=ev.clientY+imagem.scrollTop; 
	} 
	else{
		return false
	}
	
	// Função a ser dispara no clique do mouse
	obj.onmousedown = function(){
		if(bloq == false){
			// Atribui posições do inicio de acordo quando o evento foi disparado
			initx = posx;
			inity = posy;
			
			// Verifica qual o último indice adicionado para montar a próxima marcação
			var lastChild = imagem.lastChild;
			var lastIndex;
			if (lastChild) {
				lastIndex = parseInt(lastChild.getAttribute("index")); // pega a classe para verificação da útima posição
				lastIndex = lastIndex+1;
			}else{
				lastIndex = 1;
			}

			// Cria o elemeto a ser adicionado
			div = document.createElement('div'); 
			div.className='square';		//classe
			div.setAttribute("index",lastIndex)
			div.style.left=initx+'px';	//left
			div.style.top=inity+'px'; 	//top
			div.setAttribute("top",inity);
			div.setAttribute("left",initx);
			imagem.appendChild(div);	// joga a div criada dentro da imagem
		}
		
	} 
	// Função a ser disparada ao soltar o botão do mouse
	obj.onmouseup=function(){
		if(bloq == false){
			// Vars
			var classe = div.className;
			var btnNovaMarcacao = document.querySelector("#btnNovaMarcacao");

			// Reseta variaveis
			initx = false;
			inity = false;
			
			// 'callback' após o elemento sera dicionado
			div.className = classe + " fixed";
			div.innerHTML = "<span onclick='removeMarcacao(this)' class='delete' title='Remover esta marcação'>x</span>";


			// Habilita novamente o botão de nova marcação
			btnNovaMarcacao.setAttribute("onclick","ativaAreaMarcacao(this)");
			btnNovaMarcacao.className = "nova-marcacao";
			btnNovaMarcacao.innerHTML = "Nova marcação";
			
			// Remove evento da imagem e bloqueia criação de novas divs
			imagem.onmousemove = null;
			imagem.className = "";
			bloq = true;
			return false;
		}
	}
	// Estiliza a div criada
	if(initx){
		div.style.width = Math.abs(posx-initx)+'px'; // Previne numero negativo
		div.style.height = Math.abs(posy-inity)+'px'; // Previne numero negativo
		div.style.left = posx-initx<0?posx+'px':initx+'px';
		div.style.top = posy-inity<0?posy+'px':inity+'px';
	}
}

/**
 * Ativa área de marcação
 */
function ativaAreaMarcacao(obj){
	// Muda texto
	obj.innerHTML = "Aguardando marcação...";
	var classeObj = obj.className;
	obj.className = classeObj+" active";

	// Previne novo clique
	obj.setAttribute("onclick","alert('Por favor, termine a marcação atual')");

	imagem = document.querySelector("#imgArea");
	imagem.setAttribute("onmousemove","getMouse(this,event)");
	imagem.className = "active";
	bloq = false;
}

/**
 * Remove marcação
 */
function removeMarcacao(obj){
	var confirm = window.confirm("Tem certeza que deseja exlcuir esta marcação?");
	if (confirm) {
		marcacao = obj.parentNode;
		imagem.removeChild(marcacao);
	}
}