// Vars
var div,
	posx,
	posy,
	initx = false,
	inity = false,
	blocked = false;
// Obj
var DS ={
	init : function(){
		imageArea = $("#imgArea");

		// Events
		$("#btnNewMarkup").bind("click", DS.activeAreaMarking);
		DS.dragMarkup();
	},

	/**
	 * Get mouse coordinates to build markings 
	 */
	getMouse : function(e){
		obj = $(this)
		e = window.event || e;
		//e = event;

		// Define initial positions
		posx = 0;
		posy = 0;
		
		// Declare variable for the event (treatment for older versions of FF and IE)
		var ev = (!e) ? window.event : e;
		
		// Ev FF
		if (ev.pageX){ 
			// Returns position of the pointer
			posx=ev.pageX+window.pageXOffset; 
			posy=ev.pageY+window.pageYOffset; 
		}
		// Ev IE
		else if(ev.clientX){
			// Returns position of the pointer
			posx=ev.clientX+document.body.scrollLeft; 
			posy=ev.clientY+document.body.scrollTop; 
		} 
		else{
			return false
		}
		
		// Method activated on mouse click
		this.onmousedown = function(){
			if(blocked == false){
				// Assigns positions from the beginning when the event was triggered
				initx = posx;
				inity = posy;
				
				// Checks the last index added to mount the next markup
				var lastChild = $("div.square").last();
				var lastIndex;

				if (lastChild.html() != undefined) {
					lastIndex = parseInt(lastChild.attr("index")); // Take the class for verification of last position
					lastIndex = lastIndex+1;
				}else{
					lastIndex = 1;
				}

				// Creates the element to be added
				div = $(document.createElement('div')); 
				div.addClass("square");		//class
				div.attr({
					"index" : lastIndex,
					"top"	: inity,
					"left"	: initx
				}).css({
					"left"	: initx+'px',
					"top"	: inity+'px'
				});
				imageArea.append(div);	// Inserts the DIV created within the image
				DS.dragMarkup();
				
			}
			
		} 
		// Method to be triggered when you release the mouse button
		this.onmouseup=function(){
			if(blocked == false){
				// Vars
				var btnNewMarkup = $("#btnNewMarkup");

				// Reset vars
				initx = false;
				inity = false;
				
				// 'callback' after the element will be inserted
				div.addClass("fixed");
				div.html("<span class='opt link' title='Insert link'>Link</span><span class='delete' title='Remove this markup'>x</span><span class='resize' title='Hold and drag to resize'></span>");
				$(".delete").unbind("click");
				$(".delete").bind("click", DS.removeMarkup);
				$(".opt.link").bind("click", DS.insertLink);
				$(".square").resizable();


				// Re-enables the new button markup
				btnNewMarkup.unbind("click");
				btnNewMarkup.bind("click", DS.activeAreaMarking);;
				btnNewMarkup.removeClass("active").text("New markup");

				// Removes the event image and block creation of new DIVs
				imageArea.onmousemove = null;
				imageArea.className = "";
				blocked = true;
				return false;
			}
		}
		// Inserts the formatting in the new DIV
		if(initx){
			div.css({
				"width"	: Math.abs(posx-initx)+'px', // Prevents negative number
				"height": Math.abs(posy-inity)+'px', // Prevents negative number
				"left"	: posx-initx<0?posx+'px':initx+'px',
				"top"	: posy-inity<0?posy+'px':inity+'px'
			});
		}
	},

	/**
	 * Activates the markup area
	 */
	activeAreaMarking : function(){
		var image = $("#imgArea");

		// Change text
		$(this).text("Awaiting marking...");
		$(this).addClass("active");

		// Prevent new click
		$(this).unbind("click");
		$(this).bind("click", function(){
			alert("Please finish the current markup before creating another");
			return false;
		});
		$("#imgArea").mousemove(DS.getMouse);
		image.addClass("active");
		blocked = false;

		$("#imgArea").animate({
			"margin" : "15px auto",
			"opacity" : "1"
		});
	},

	/**
	 * Remove markup
	 */
	removeMarkup : function(){
		var confirm = window.confirm("Are you sure you want to delete?");
		if (confirm) {
			markup = $(this).parent();
			$(markup).remove();
		}
	},
	
	/**
	 * Drag element
	 */
	dragMarkup : function(){
		
		// Beginning of the draggable function
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
	 * Insert link on the markup
	 */
	insertLink : function(){
		var link,
			currentLink = $(this).parent().attr("link");
		
		if(currentLink != undefined){
			link = window.prompt("Enter the link",currentLink);
		}else{
			link = window.prompt("Enter the link","http://");
		}
		
		// If the user has entered correct link, attaches to the parent element
		if(link != null){
			$(this).parent().attr("link",link);
		}
	}
};
$(DS.init);