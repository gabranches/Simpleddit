var ResultLimit = 40;
$(function()
{
	// Global Variables
	maxNest = 15;
	after = null;
	count = 0;
	limit = 47;
	sort = "hot";
	loadHtml = "Loading <img id='loadgif' src='images/ajax-loader.gif' />";
	OP = "";
		
	// Run
	init();
	hashLocation();
	resize();
	setTitle();
	getPopularSubs();
	buildHandlebars();
	getItems(sub, sort);
	
}); 

// ** EVENT HANDLERS ** //

$("#form-sub").submit(function(e) // Subreddit form submit
{ 	
	e.preventDefault();
	sub = $("#input-sub").val();
	ClearLeftSide();
	window.location.hash = "#"+sub;
	getItems(sub, sort);
});

$(document).on("click", ".story-sublink span", function() // Go to subreddit on click
{ 	
	sub = $(this).html();
	ClearLeftSide();
	$("#input-sub").val(sub);
	getItems(sub, sort);
});

$(document).on("click", ".entries", function() // Go to story
{ 	
	ClearRightSide();
	id = $(this).attr("data-id");
	window.location.hash = "#"+sub + "-" + id;
	getStory($(this).attr("data-sub"),id);
});

$(document).on("click", "#options-button", function() // Show options
{ 	
	ClearRightSide();

	$("#options").show();
});

$(document).on("click", "#about-button", function() // Show about
{ 	
	ClearRightSide();
	$("#about").show();
});

$(document).on("click", ".nested-toggle", function() // Toggle nested thread comments
{ 	
	var toplevel = $(this).parents().eq(2).attr("id");

	$("#"+toplevel + " .comment").toggle();
	$("#"+toplevel + " .comment-body").toggle();

	if ($(this).attr("class") == "nested-toggle glyphicon glyphicon-minus")
	{
		$(this).attr("class" ,"nested-toggle glyphicon glyphicon-plus");
	}
	else
	{
		$(this).attr("class" ,"nested-toggle glyphicon glyphicon-minus");
	}

});

$(document).on('click', '.glyphicon-nsfw', function(){
	var nsfw = readCookie("nsfw");
	if(nsfw=="off")
	{
		createCookie("nsfw", "on", 2);
		$(".glyphicon-nsfw").css({opacity: "1"});
	}
	else
	{
		createCookie("nsfw", "off", 2);
		$(".glyphicon-nsfw").css({opacity: ".5"});
	}
	ClearLeftSide();
	getItems(sub, sort);
});


$(document).on("change", "#hide-images", function() // Auto-hide images toggle
{ 	
	readCookie("showImages") == "1" ? createCookie("showImages", "0", 30) : createCookie("showImages", "1", 30);
});

$(document).on("change", '#hide-logo', function(){
	var logo = readCookie("showLogo");
	if(logo == "1")
	{
		createCookie("showLogo", "0", 30);
		$("#logo").hide();
		$("#logo-filler").show()
	}else
	{
		createCookie("showLogo", "1", 30);
		$("#logo").show();
		$("#logo-filler").hide();
	}
});
$(document).on("change", '#hide-nsfw', function() {
	var nsfw = readCookie("nsfw");
	if(nsfw=="off")
	{
		createCookie("nsfw", "on", 2);
		$(".glyphicon-nsfw").css({opacity: "1"});
	}
	else
	{
		createCookie("nsfw", "off", 2);
		$(".glyphicon-nsfw").css({opacity: ".5"});
	}
	ClearLeftSide();
	getItems(sub, sort);
});

$(document).on("click", "#options-button", function() // Show options
{ 	
	ClearRightSide();
	if (readCookie("showImages") == "1")
	{
		$('#hide-images').attr('checked', false);
	}
	else
	{
		$('#hide-images').attr('checked', true);
	}
	$("#options").show();
});

$(document).on("keyup", "#input-title", function() // Change page title
{ 	
	var newTitle = $("#input-title").val();
	if (newTitle == "")
	{
		eraseCookie("title");
	}
	else
	{
		document.title = newTitle;
		createCookie("title", newTitle, 30);
	}
});

$(document).on("click", "#showimage", function() // Show story image
{ 	
	$('#storyimage').toggle();
	$('#showimage').text() == " Show Image" ? $('#showimage').html("<span class='glyphicon glyphicon-picture'></span> Hide Image") : $('#showimage').html("<span class='glyphicon glyphicon-picture'></span> Show Image");
});

$("#getmore").click(function() // Load more
{
	getItems(sub, sort);
});

$("#select-sort").change(function() // Sort dropdown submit
{ 	
	sort = $("#select-sort").find(":selected").val();
	ClearLeftSide();
	getItems(sub, sort);
});

$("#select-sub").change(function() // Dropdown submit
{ 	
	sub = $("#select-sub").val();
	ClearLeftSide();
	window.location.hash = "#"+sub;
	$("#input-sub").val(sub);
	getItems(sub, sort);
});

$("#select-theme").change(function() // Theme select
{
	theme = $('#select-theme').val();
	$('#theme-style').remove();
	if(theme.length) $('<link/>', {rel: 'stylesheet', href: 'themes/'+theme+'.css', id: 'theme-style'}).appendTo('head');
});

$(window).resize(function(){
	resize();
});

// ** FUNCTIONS ** //

function init()
{
	console.log(readCookie("showLogo"));
	if(readCookie("showLogo") == "0"){
		$("#logo").hide();
		$("#logo-filler").show();
		document.getElementById("hide-logo").checked = true;
	}else{
		createCookie("showLogo", "1", 30);
		document.getElementById("hide-logo").checked = false;
	}
	if(readCookie("nsfw")=="on")
	{
		document.getElementById("hide-nsfw").checked = false;
	}else{
		$(".glyphicon-nsfw").css({opacity: ".5"});
		createCookie("nsfw", "off", 2);
	}

	if(readCookie("title")!=null)
	{
		$("#input-title").val(readCookie("title"));
	}
}

function buildHandlebars()
{
	var raw_template = $('#entry-template').html();
	entryTemplate = Handlebars.compile(raw_template);
	entryPlaceHolder = $("#main");

	var raw_template = $('#comment-template').html();
	commentTemplate = Handlebars.compile(raw_template);

	var raw_template = $('#story-template').html();
	storyTemplate = Handlebars.compile(raw_template);
	storyPlaceHolder = $("#story");
}

function resize()	// Resize containers when window changes
{
	var ht = $(window).height();
	$("#leftcolumn").css("height", ht-91 + "px");
	$("#rightcolumn").css("height", ht-91 + "px");
}

function setTitle() // Set page title if cookie exists
{
	if (readCookie("title") != null)
	{
		document.title = readCookie("title");
	}
}

function ClearLeftSide() // Clear all stories
{
	$("#getmore").hide();
	$("#main").html("");
	count = 0;
	after = "";
}

function ClearRightSide() // Clear all stories
{
	$("#storyheader").html("");
	$("#about").hide();
	$("#options").hide();
	$("#story").html("");
	$("#comments").html("");
}

function getItems(sub, sort) // Get stories
{
	$("#input-sub").val("");

	if (readCookie("title") == null)
	{
	document.title = sub;
	}

	var subUrl 		= (sub == "" ) ? "" : "/r/"+sub;
	var limitUrl 	= "limit=" + limit;
	var afterUrl 	= (after == null) ? "" : "&after="+after;
	var countUrl 	= (count == 0) ? "" : "&count="+count;

	$("#subnameheader").html(loadHtml);

	switch(sort) 
	{	
		case "hot":
			var sortType = "hot";
			var sortUrl = "sort=hot";
			break;
		case "new":
			var sortType = "new";
			var sortUrl = "sort=new";
			break;
		case "rising":
			var sortType = "rising";
			var sortUrl = "sort=rising";
			break;
		case "day":
			var sortType = "top";
			var sortUrl = "sort=top&t=day";
			break;
		case "week":
			var sortType = "top";
			var sortUrl = "sort=top&t=week";
			break;
		case "month":
			var sortType = "top";
			var sortUrl = "sort=top&t=month";
			break;
		case "year":
			var sortType = "top";
			var sortUrl = "sort=top&t=year";
			break;
		case "all":
			var sortType = "top";
			var sortUrl = "sort=top&t=all";
			break;
	}
	
	$("#subnameheader").html(loadHtml);
	$("#getmore").html(loadHtml);
	
	var url = "https://www.reddit.com" + subUrl + "/" + sortType + "/.json?" + sortUrl + "&" + limitUrl + afterUrl + countUrl;

	$.getJSON( url, function(data) 
	{
		listItems(data, sub);
		if(sort != "rising")
		{
			$("#getmore").show();
			$("#getmore").html("Load more...");
		}
		
		if(sub=="") // Change sub name header
		{
		  $("#subnameheader").html("<a target='_blank' href='http://www.reddit.com/'>Front Page</a>");
		} 
		else 
		{
		  $("#subnameheader").html("<a target='_blank' href='http://www.reddit.com/r/" + sub + "'>r/"+sub+"</a>");
		}
	}
	).fail(function(data) 
	{
		ClearLeftSide();
		$("#subnameheader").html("<div class='col-xs-12'>Could not get data from subreddit '"+sub+"'. Please make sure that this subreddit exists, or try again in a few minutes.</div>");
	});

}
$(document).on("click", "", function(){
	$("#results").empty();
	$("#results").hide();
});
$('#input-sub').keyup(function(e) {
	if((e.keyCode >= 37 && e.keyCode <= 40)
	   || e.keyCode == 13)
	{
		// no arrow keys
		return;
	}
	var query = $(this).val();
	searchReddits($(this).val());
	
}).keydown(function (e) {
	if(e.keyCode == 40 || e.keyCode == 38)
	{	
		// Up/down keys
		if($('#results .result').length)
		{
			var delta = (e.keyCode == 40 ? 1 : -1);
			// down arrow
			var selected = $('#results .result.selected');
			if(selected.length > 0)
			{
				var num = parseInt(selected.attr('num'));
				num  = num + delta;
				var next = $('#results .result[num='+num+']');
				if(next.length > 0)
				{
					selected.removeClass('selected');
					next.addClass('selected');
				}
				else if(delta < 0)
				{
					selected.removeClass('selected');
				}
				
			}
			else
			{
				// select first result
				$('#results .result').first().addClass('selected');
			}
		}
	}
	else if(e.keyCode == 13)
	{
		// Enter
		var selected = $('#results .result.selected');
		if(selected.length > 0)
		{
			var name = selected.attr('reddit');
			window.location = 'http://www.reddit.com/r/' + name;
		}
		else
		{
			// select first result
			$('#results .result').first().addClass('selected');
		}
	}
});

$(document).on("click", ".result", function(){
	ClearLeftSide();
	window.location.hash = "#"+$(this)[0].innerText;
	getItems($(this)[0].innerText, sort);	
});

function getPopularSubs()
{
	$.getJSON("https://www.reddit.com/subreddits/popular/.json?limit=100", function(data)
	{
		$.each(data.data.children,function(index,element)
		{ 
			$("#select-sub").append("<option value='"+element.data.display_name+"' label='"+element.data.display_name+"'>"+element.data.display_name+"</option>");
		});
	});
}

function listItems(data,sub)
{
	$.each(data.data.children,function(index,element)
	{ 
		if((element.data.over_18==true&&readCookie("nsfw")=="on")||element.data.over_18==false)
		{
			element.data.topsub = sub;
			var html = entryTemplate(element.data);
			entryPlaceHolder.append(html);
			count++;
			after = element.data.name;
		}
	});
}

function getStory(sub,id)
{
	if (sub == "")
	{
		var url = "comments/"+id;
	}
	else
	{
		var url = "r/"+sub+"/comments/"+id;
	}

	$("#storyheader").html(loadHtml);

	var requestUrl = "https://www.reddit.com/"+url+"/.json";

	$.getJSON(requestUrl, function(data)
	{
		$("#storyheader").html("<a target='_blank' href='http://www.reddit.com/"+url+"'>"+url+"</a>");

		$.each(data,function(index,element)
		{ 
			$.each(element.data.children, function(index, element)
			{
				if(element.data.title)
				{
					if (readCookie("title") == null)
					{
					document.title = sub+" - "+element.data.title;
					}
					OP = element.data.author;
					printTitle(element);
				}
				else
				{
					printComment(element, 0, "comments");
				}
			});
		});

		// Change links to open in new window
		$("a[href^='http://']").attr("target","_blank");
		$("a[href^='https://']").attr("target","_blank");
	}
	).fail(function(data) 
	{
		ClearRightSide();
		$("#story").html("<div class='row'><div class='col-xs-12'>Could not fetch data from Reddit. Reddit may be experiencing heavy traffic. Please try again in a few minutes.</div></div>");
	});
}

function printTitle(data)
{
	var html = storyTemplate(data.data);
	storyPlaceHolder.append(html); 
}

function printComment(data, numNest, lastComment) // Recursive function to print comments
{
	data = data.data;

	if(data.body)
	{
		data.numNest = numNest;
		var html = commentTemplate(data);
		$("#" + lastComment).append(html);
	}

	lastComment = data.id;

	if(data.replies)
	{
		$.each(data.replies.data.children, function(index, element)
		{
			if(numNest<maxNest)
			{
				printComment(element, numNest+1, lastComment);
			}
		});
	} 
}

function htmlDecode(input)  // Unescape html
{
  var e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

function getYoutubeId(url)  // Returns youtube data-id
{
	var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
	if(videoid != null) 
	{
	   return videoid;
	} 
	else
	{ 
	    console.log("The youtube url is not valid.");
	}
}

function hashLocation(){
	var hash = window.location.hash;
	//check if a hash is present
	if(hash!=""){
		var i = hash.search("-");
		if(i!=-1){
			sub = hash.slice(1, i);
			ClearRightSide();
			var post = hash.slice(i+1);
			getStory(sub, post);
		}else{
			sub = hash.slice(1);
		}
	}
}

function isImgurVid(url) // Returns true if url is .gifv, .webm, or .mp4
{
    var exts = [".gifv", ".webm", ".mp4"];
    for (var i in exts) {
        if(url.indexOf(exts[i]) == url.length - exts[i].length) return true;
    }
    return false;
}

function searchReddits(query)
{
	if($("#input-sub").val() == ""){
		$("#results").hide();
	}else{
		$("#results").show();
	}
	var html = '';
	if(query.length > 0)
	{
		var re = new RegExp('[^:]*'+query+'[^:]*','g');
		matches = getResults(re);
		if(matches != null && matches.length > 0)
		{
			for(var i = 0; i < matches.length; i++)
			{
				var name = matches[i];
				var start = name.search(query);
				var displayName = name.substring(0,start) + '<span class="match">' + name.substring(start,start + query.length) + '</span>' + name.substring(start + query.length);
				html += '<div class="result" num="'+i+'" reddit="'+name+'">' + displayName + '</div>';
				if(i == ResultLimit - 1)
					break;
			}			
		}
		
		if(html.length == 0)
		{
			html = '<div class="no_results">No results</div>';
		}
	}
		
	$('#results').html(html);
}

function getResults(re)
{
	var matches = RedditSearch.match(re);
	var matches2 = RedditSearch2.match(re);
	var results = [];
	if (matches != null) results = results.concat(matches);
	if (matches2 != null) results = results.concat(matches2);
	return results;
}