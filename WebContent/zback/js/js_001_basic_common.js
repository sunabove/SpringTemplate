/** basic common java script file **/

/*
Number.prototype.format = function(n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};
*/

Number.prototype.format = function( ) {
	return this.toString().split( /(?=(?:\d{3})+(?:\.|$))/g ).join( "," );
};

// string prototype append 

String.prototype.replaceAll = function(target, replacement) {
	  return this.split(target).join(replacement);
};
 
String.prototype.format = function(){
    var num = parseFloat( this );
    if( isNaN(num) ) return "0";
 
    return num.format();
};

String.prototype.formatNumber = function(){
    var num = parseFloat(this);
    if( isNaN(num) ) return "0";
 
    return num.format();
};

String.prototype.isAlphaNumeric = function (){
    return this.match( /^[A-Za-z0-9]+$/ ) ;
};

String.prototype.parseInt = function(){
	var num = null ;
	
	try {  
		num = parseFloat( this.trim().split(",").join( "" ) );
	} catch ( e ) {
	}
    
	if( isNaN(num) ) return 0 ;
 
    return num ;
};

String.prototype.toInt = function(){
	var num = null ;
	
	try {  
		num = parseFloat( this.trim().split(",").join( "" ) );
	} catch ( e ) {
	}
    
	if( isNaN(num) ) return 0 ;
 
    return num ;
};

String.prototype.startsWith = function (str){
    return ( 0 === this.indexOf(str) ) ;
};

String.prototype.printf = function() {
    var formatted = this ;

    for(arg in arguments) {
        formatted = formatted.replace("{" + arg + "}", arguments[arg]);
    }

    return formatted;
};

// -- string prototype append

/** utility functions **/

// is double click
function isDblClick( e ) {
	var dbg = false ;
	
	var src = event.target || event.srcElement;
	
	var now = new Date().valueOf() ; 
	
	var then = null == src.then__ ? 0 : src.then__ ;
	
	var elap = now - then ; 
	
	dbg = dbg && debug( "elap = " + elap ) ; 
	
	src.then__ = now ; 
	
	if( 523 > elap ) {
		return true ; 
	}
	
	return false ; 
}
//-- is double click

function isDoubleClick( e ) {
	return isDblClick( e ); 
}

function isSingleClick( e ) {
	return ! isDblClick( e ) ;
}

function setTimeOut( callback ,delay ) {
	setTimeout( callback, delay );
}

function getWindowSizeFromSpec( spec ) {
	var width = null ;
	var height = null ;
	
	if( -1 < spec.indexOf( "width" ) ) {  
		var w = spec ; 
		w = w.substring( w.indexOf( "width" ) ) ;
		if( -1 < w.indexOf( "," ) ) {
			w = w.substring( 0, w.indexOf( "," ) ) ;
		}
		w = w.replace( /width/g, "" );
		w = w.replace( /=/g , "" );
		w = w.replace( /,/g , "" );
		w = w.replace( / /g , "" );
		
		w = ( "" + w ).parseInt() ;
		width = w ; 
		
		if( -1 < spec.indexOf( "height") ) { 
			var h = spec ; 
			h = h.substring( h.indexOf( "height" ) ) ;
			if( -1 < h.indexOf( "," ) ) {
				h = h.substring( 0, h.indexOf( "," ) ) ;
			}
			h = h.replace( /height/g, "" );
			h = h.replace( /=/g , "" );
			h = h.replace( /,/g , "" );
			h = h.replace( / /g , "" );
			
			h = ( "" + h ).parseInt() ;
			
			height = h ; 
		}
	}
	
	width 	= 1 > width 	? null : width 	;
	heigtht = 1 > height 	? null : height ; 
	
	return { "width" : width , "height" : height } ; 
}

//set window size manually after parsing the spec
function windowResizeBySpec( win , spec ) {
	var winSize = getWindowSizeFromSpec( spec ) ;
	if( null != winSize && null != winSize.width && null != winSize.height ) {  
		win.resizeTo( w, h );	
	}
}
// -- set window size manually after parsing the spec

// synchIframeSizeToScrollSize
function synchIframeSizeToScrollSize( iframe ) {
	iframe.style.height = iframe.contentWindow.document.body.scrollHeight + 'px'; 
	iframe.style.width  = iframe.contentWindow.document.body.scrollWidth + 'px';
}
// -- synchIframeSizeToScrollSize

/** -- utility functions **/

// debug function

function consoleClear() {
	try { 
		console.clear();
	} catch( e ) { 
	}

	console.log( "console cleared." );
}

function clearConsole() {
	consoleClear() ; 
}

// debug message count
var debugMsgCnt = 0 ; 

function debugMsg( msg ) {
	return debug( msg ) ; 
}

function debug( msg ) {
	
	var clearConsoleAtStart = false ; 
	
	if( false == clearConsoleAtStart ) {
		// do nothing.
	} else if( 0 == debugMsgCnt ) { 
		consoleClear();
	} else if( ( 0 != debugMsgCnt ) && 0 == ( debugMsgCnt % 1000 ) ) {
		consoleClear();
	}
	
	try {  
		console.log( "[" + debugMsgCnt + "] " + msg );
		debugMsgCnt ++ ;
	} catch ( e ) { 
	}
	
	return true;
}

// -- debug function

// -- basic java script functions

/** -- basic common java script file **/