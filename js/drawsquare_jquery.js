// Vars
var div,
	posx,
	posy,
	initx = false,
	inity = false,
	bloq = false,
	imagem = $("#imgArea");

// Obj
var DS ={
	init : function(){
		
		imagem = $("#imgArea");

		// Eventos
		$("#btnNovaMarcacao").bind("click", DS.ativaAreaMarcacao);
		DS.dragProduto();
	},

	/**
	 * Pega coordenadas do mouse para construir as marcações
	 */
	getMouse : function(e){
		obj = $(this)
		e = window.event || e;
		//e = event;

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
			posx=ev.clientX+document.body.scrollLeft; 
			posy=ev.clientY+document.body.scrollTop; 
		} 
		else{
			return false
		}
		
		// Função a ser dispara no clique do mouse
		this.onmousedown = function(){
			if(bloq == false){
				// Atribui posições do inicio de acordo quando o evento foi disparado
				initx = posx;
				inity = posy;
				
				// Verifica qual o último indice adicionado para montar a próxima marcação
				var lastChild = $("div.square").last();
				var lastIndex;

				if (lastChild.html() != undefined) {
					lastIndex = parseInt(lastChild.attr("index")); // pega a classe para verificação da útima posição
					lastIndex = lastIndex+1;
				}else{
					lastIndex = 1;
				}

				// Cria o elemeto a ser adicionado
				div = $(document.createElement('div')); 
				div.addClass("square");		//classe
				div.attr({
					"index" : lastIndex,
					"top"	: inity,
					"left"	: initx
				}).css({
					"left"	: initx+'px',
					"top"	: inity+'px'
				});
				imagem.append(div);	// joga a div criada dentro da imagem
				DS.dragProduto();
				
			}
			
		} 
		// Função a ser disparada ao soltar o botão do mouse
		this.onmouseup=function(){
			if(bloq == false){
				// Vars
				var btnNovaMarcacao = $("#btnNovaMarcacao");

				// Reseta variaveis
				initx = false;
				inity = false;
				
				// 'callback' após o elemento sera dicionado
				div.addClass("fixed");
				div.html("<span class='opt link' title='Inserir link'>Link</span><span class='delete' title='Remover esta marcação'>x</span><span class='resize' title='Segure e arraste para redimensionar'></span>");
				$(".delete").unbind("click");
				$(".delete").bind("click", DS.removeMarcacao);
				$(".opt.link").bind("click", DS.insertLink);
				$(".square").resizable();


				// Habilita novamente o botão de nova marcação
				btnNovaMarcacao.unbind("click");
				btnNovaMarcacao.bind("click", DS.ativaAreaMarcacao);;
				btnNovaMarcacao.removeClass("active").text("Nova marcação");

				// Remove evento da imagem e bloqueia criação de novas divs
				imagem.onmousemove = null;
				imagem.className = "";
				bloq = true;
				return false;
			}
		}
		// Estiliza a div criada
		if(initx){
			div.css({
				"width"	: Math.abs(posx-initx)+'px', // Previne numero negativo
				"height": Math.abs(posy-inity)+'px', // Previne numero negativo
				"left"	: posx-initx<0?posx+'px':initx+'px',
				"top"	: posy-inity<0?posy+'px':inity+'px'
			});
		}
	},

	/**
	 * Ativa área de marcação
	 */
	ativaAreaMarcacao : function(){
		var imagem = $("#imgArea");

		// Muda texto
		$(this).text("Aguardando marcação...");
		$(this).addClass("active");

		// Previne novo clique
		$(this).unbind("click");
		$(this).bind("click", function(){
			alert("Por favor, termine a marcação atual antes de criar outra");
			return false;
		});
		$("#imgArea").mousemove(DS.getMouse);
		imagem.addClass("active");
		bloq = false;

		$("#imgArea").animate({
			"margin" : "15px auto"
		});
	},
	
	/**
	 * Desativa marcação da área para poder mover os elementos com dragdrop
	 */
	desativaAreaMarcacao : function(){
		$("#imgArea").mousemove(function(){});
		$("#imgArea").removeEventListener;
		alert("Desativou!");
	},

	/**
	 * Remove marcação
	 */
	removeMarcacao : function(){
		var confirm = window.confirm("Tem certeza que deseja exlcuir esta marcação?");
		if (confirm) {
			marcacao = $(this).parent();
			$(marcacao).remove();
		}
	},
	
	/**
	 * Drag element
	 */
	dragProduto : function(){
		
		// Inicio da função draggable
		$(".square").draggable({
			scroll : false,
			start: function(){
				
			},
			drag : function(){
				var top = parseInt($(this).position().top);
				var left = parseInt($(this).position().left);
				
				$(this).css({
					"top" : top + "px",
					"left": left + "px"
				}).attr({
					"top" : top,
					"left": left
				});
			},
			stop : function(){
				
			},
			containment: "#imgArea"
		});
	},
	
	/**
	 * Insere link 
	 */
	insertLink : function(){
		var link,
			linkAtual = $(this).parent().attr("link");
		
		if(linkAtual != undefined){
			link = window.prompt("Digite o link",linkAtual);
		}else{
			link = window.prompt("Digite o link","http://");
		}
		
		// Caso o usuário tenha digitado link correto, atribui ao elemento pai
		if(link != null){
			$(this).parent().attr("link",link);
		}
	}
};
$(DS.init);