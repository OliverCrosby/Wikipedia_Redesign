function bigPictures() {
	$('.thumbinner img').each(function() {
		//console.log($(this).attr("src"));
		var img = $(this).attr("src");
		img = img.replace("/thumb", '');
		img = img.replace(/\/([^/]*)$/, '');
		//console.log(img);
		$(this).attr("src", img);
	});
}



function  activeHeader() {
	// [1] store scroll pos of each header in array
	var i = 1;
	var arrHeads = [{
			text: "Intro", 
			id: i, 
			top: 20}
		];
	$('.mw-headline').each(function() {
		arrHeads.push({
			text: $(this).text(),
			id: i + 1,
			top: $(this).offset().top
		});
		i = i+1;
	});
	//console.log(arrHeads);
	// add testing line
	//$('body').prepend('<div id="scrolling"></div>');
	var active = 0;
	var activeText = null;
	// [2] get scroll position + 1/3 of the viewport
	$(window).scroll(function (event) {
	    var scroll = $(window).scrollTop() + ($(window).height()/3);
	    //console.log('scroll line is at', scroll);
	    $('#scrolling').css('top', scroll);
	    
	    
    	// adjust active in case you're scrolling back up
		if (active > scroll) {
			active = 0;
			//console.log('active is DOWN,', active);
		}
	    
	    
	    
	// [3] check the array to see which header should be 'active'
		$.each(arrHeads, function(id, text, top){
			if (this.top <= scroll && this.top > active) {
				// change active to this
				active = this.top;
				// set as activeText as well
				activeText = this.text;
				// set active id (id in the array)
				activeId = this.id;
			}
		});
		//console.log('current active is', activeId, activeText, active);
		// figure out scroll progress
		var secProgress = (scroll - active) / (arrHeads[activeId].top - active);
		//console.log('section progress is', secProgress);
		// [4] match activeText to toc item, give it a class
		$('#toc .toctext').each(function() {
			if 	($(this).text() == activeText) {
				$(this).addClass('active');
				$(this).find('.secProgress').css('width', $(window).width()*0.16 * secProgress);
			}
			else {
				$(this).removeClass('active');
			}
		});

	});
}

function navScroll() {
	$(window).scroll(function() {
		// if my nav ul is close to the top of the viewport, give it the scrolled class
		// set affix point to the top of my intro paragraph - 3 vw
		var affixPoint = $('#intro').offset().top - $(window).width()*0.03;
		// check if we've scrolled that much
		if ($(window).scrollTop() > affixPoint) {
			$('#toc > ul').addClass('scrolled');
		}
		else {
			$('#toc > ul').removeClass('scrolled');
		}
		/*
		var affixPoint = $(window).width()*0.03;
		if ($(window).scrollTop()  < affixPoint) {
			$('#toc > ul').addClass('scrolled');
		}
		else {
			$('#toc > ul').removeClass('scrolled');
		}
		console.log('affixPoint', affixPoint);
		*/
	});
}

// improve the infobox
function improveInfobox() {
	// infobox. remove padding from empty TD celkls
	$('#rightside .infobox td:empty').parent().remove();
	//add a class to the TR's that don't have headers for styling
	$('#rightside .infobox tr').each(function() {
		if ($(this).find('th').length === 0) {
			$(this).addClass('nonTHtr');
		}
	});
}

// changes shit based on time of day
function dayTime() { 
	var now = new Date(Date.now());
	var dayTime = now.getHours();
	console.log('hour is,', dayTime);
	if ((dayTime >= 17) || (dayTime <= 8)) {
		$('body').addClass('nightmode');
	}
}

// find and move matching image in rightside
function infoboxImg(mainImg) {
	// this pattern gets everything after the last / or - of the url
	var pattern = '(?!.*[\/\-]).+';
	// extract this from the mainImg url I pulled from the meta. I will use this to locate the img in the sidebar...
	var imgId = mainImg.match(new RegExp(pattern));
	// check all the images for the match...
	var sideId = "";
	$('#rightside img').each(function() {
		// get the src of this img
		sideSrc = $(this).attr('src');
		// pull the last part of the url out
		sideId = sideSrc.match(new RegExp(pattern));
		// check to see if it matches my imgId
		if (sideId[0].indexOf(imgId[0]) >= 0) {
			var imgRep = $(this).closest('.nonTHtr').detach();
			//console.log(imgId[0], "matches", sideId[0]);
			$('#rightside .infobox').append(imgRep);
		}
	});

}

// Setup top of every article
function makeIntro() {
	// gonna main the intro p out of a short description thing
	$('#bodyContent').prepend('<div id="intro" />');
	// add short desc to intro
	$('.shortdescription:first').detach().prependTo('#intro');
	$('.shortdescription').show();
	// give intro an image based on meta tag
	var mainImg = $('meta[property="og:image"]').attr('content');
	// check if there is a mainImg, and if yes add it to the intro, then call the function that removes it from the rightside.
	if (mainImg != null) {
		$('#intro').append('<img id="mainImg" src="' + mainImg + '" />');
		infoboxImg(mainImg);
	}
	// now I'm gonna get the actual first p and put it right after intro
	//remove this empty p that gets in the way sometimes.
	$('.mw-empty-elt').remove();
	// put coordinates p inside a div so it doesn't get picked
	$('#coordinates').closest('p').wrap('<div />');
	// move true intro paragraph
	$('.mw-parser-output > p:first').detach().prependTo('#mw-content-text');
	// give the orthographic img container a class
	$('#rightside a[href*="orthographic"]').addClass('orthographic');
}

function series() {
	console.log('series function starts');
	// identify and of the in-series tables, and give them a class
	$('*:contains("Part of a series of articles about")').each(function() {
		$(this).closest('table').addClass('seriesTable');
		$(this).closest('table').addClass('infobox');
	});
	// get height from bottom of the infoMain
	var infoMainBottom = $('#infoMain').offset().top + $('#infoMain').height();
	console.log('infobottom is', infoMainBottom);
	// get series tables' distance from top of the page, and then move them into the rightside
	$('.seriesTable').each(function() {
		var seriesTop = $(this).offset().top;
		$(this).appendTo('#rightside');
		console.log('series offset is', seriesTop);
		if (seriesTop > infoMainBottom) {
			$(this).addClass('series-below-infobox');
			$(this).css("margin-top", seriesTop - infoMainBottom);
		}
		$('.NavFrame').closest('tr').addClass('series-item');
	});
}


function inSeries() {
	// My attempt to select the 'of a series' box...
	var inSeries = $('.mw-parser-output > table.vertical-navbox.nowraplinks[style="float:right;clear:right;width:22.0em;margin:0 0 1.0em 1.0em;background:#f9f9f9;border:1px solid #aaa;padding:0.2em;border-spacing:0.4em 0;text-align:center;line-height:1.4em;font-size:88%;border-collapse:collapse;"]');
	if (inSeries.length == 1) {
		console.log("found an 'of a series' tables");
		// detach it, add class, append the innerhtml to my rightside.
		inSeries.detach();
		$(inSeries).addClass('asdf');
		$('#rightside .infobox').append($(inSeries));		
	}
	console.log(inSeries);
	/*
	// bring the 'in a series' table into the rightside 
	var inSeries = $('.mw-parser-output > table.vertical-navbox.nowraplinks').detach();
	$(inSeries).addClass('asdf');
	$('#rightside .infobox').append(inSeries);
	// check if there are multiple tables matching, just in case that happens.
	if ($('.mw-parser-output > table.vertical-navbox.nowraplinks').length > 1) {
		alert('multiple "in a series" boxes');
	}
	else ($('.mw-parser-output > table.vertical-navbox.nowraplinks').length > 1) {
	}
	*/
}

function fixCite() {
	// add a class to all the cite-style nowraplinks
	$('#content sup a').addClass('ref');
	$('#content sup i a').addClass('ref');
	$('#content .mw-editsection a').addClass('ref');
	//remove them square brackets
	function fuckBrackets(thisObj) {
		//console.log($(thisObj).text());
		var text = $(thisObj).text().replace(/\[|\]/g, '');
		$(thisObj).text(text);
		//console.log($(thisObj).text());
	}
	$('#content sup.reference a').each(function() {fuckBrackets($(this));});
	//$('#content sup').each(function() {fuckBrackets($(this));});
	// remove them square brackets from the edit buttons
	$('.mw-editsection-bracket').remove();
	$('.mw-editsection-bracket').remove();

}

function addFonts() {
	$('head').append('<link href="https://fonts.googleapis.com/css2?family=Raleway:wght@500&display=swap" rel="stylesheet">');
};



window.onload = function() {
    if (window.jQuery) {  
        // jQuery is loaded  
        console.log("jquery loaded!");
    } else {
        // jQuery is not loaded
        console.log("jquery didna load");
    }
}

console.log('jsMods has loaded...');

$(document).ready(function() {
	console.log('document ready');
	// add loaded to #content so it unhides

	$('#content').addClass('loaded');
	//detatch the search bar
	var search = $('#p-search').detach();

	// remove shit
	$('#mw-navigation, #mw-page-base, #mw-head-base, #siteSub, #toctogglecheckbox, .toctitle').remove();
	// add these progress bars to the sections
	$('.toctext').prepend('<div class="secProgress"></div>');
	// put content inside main	
	$('#content, #rightside').wrapAll( "<main></main>" );
	// move table of content to before the content
	$('#toc').detach().insertBefore('#content');
	$('#toc').wrap('<div id="leftside" />');
	$('#content').wrap('<div id="middleside" />');
	// add new header
	$('body').prepend('<header><img id="logo" src="https://upload.wikimedia.org/wikipedia/commons/5/5a/Wikipedia%27s_W.svg" /></header>');
	// re-attach search to header
	//$('header').prepend(search);
	// remove random empty paragraph
	$('body.mw-hide-empty-elt .mw-empty-elt').remove();
	//remove BR paragraphs
	$('p > br').parent().css('background', 'red');
	// right-side bar for data-like content
	$('#middleside').after('<div id="rightside"></div>');
	// move infobox into rightside
	$('.infobox:first').detach().appendTo('#rightside');
	//move search into #rightside
	$('#rightside').prepend(search);
	// give my infobox an ID so it doesn't get confuxed with shit
	$('.infobox').attr('id', 'infoMain');
	checkNavTog()
	navScroll();
	improveInfobox(); 
	dayTime();
	makeIntro();
	fixCite();
	bigPictures();
	//series()
	activeHeader(); // this has to be after anything that changes the position of elements in the DOM
	//inSeries();
	addFonts();
});

function checkNavTog() {
	if ($('#NavToggle1').length) {
		console.log('navTog exists');
		series();
	}
	else {
		console.log('navTog doesnt exist');
		setTimeout("checkNavTog()", 1);	
	}
};


$(window).on('load', function() {
	console.log('window loaded');
});





/* some ideas

- make sure I'm not making shit that much slower
- make loading feel better

- do some logic to discern which elements should go in the rightside

- if nav li has 2 lines, the progress bar should span the first then the second.

- More carefully crafted intro p, with a max length... remove distracting things, and then repeat the original one later.

- zero-distraction mode, removes anything that distracts from the text/image content

- MODES. 
-- asses page, figure out which mode to use by default:
--- Read mode (text-centric)
--- image mode (big thumbs)
--- technical (lots of the details display, verbose)
*/