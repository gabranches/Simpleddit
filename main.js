// Global Variables

maxNest = 15;
after = null;
count = 0;
limit = 47;
sort = "hot";
loadHtml = "Loading <img id='loadgif' src='images/ajax-loader.gif' />";
OP = "";
id="";
ResultLimit = 40;
ht = $(window).height();

$(function()
{
	init();
	hashLocation();
	setTitle();
	getPopularSubs();
	buildHandlebars();
	getItems(sub, sort);

}); 


// ** FUNCTIONS ** //

function init()
{
	if(readCookie("theme") == "light")
	{
		$('#theme-style').remove();
		$("#select-theme>option:eq(1)").attr("selected", true);
		$("#theme-select").html("Dark Theme");
		$("#theme-select").attr("data-theme", "dark");
	}

	if(readCookie("showLogo") == "0")
	{
		$("#logo").hide();
		$("#logo-filler").show();
		document.getElementById("hide-logo").checked = true;
	}
	else
	{
		createCookie("showLogo", "1", 30);
		document.getElementById("hide-logo").checked = false;
	}

	if(readCookie("nsfw")=="on")
	{
		document.getElementById("hide-nsfw").checked = false;
	}
	else
	{
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
	history.replaceState(undefined, undefined, "#"+sub);

	$("#input-sub").val("");

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
		$("#getmore").remove();

		listItems(data, sub);
		if(sort != "rising")
		{
			$("#getmore").show();
			$("#getmore").html("Load more...");
		}

		$("div[data-id='"+id+"']").attr("class","row entries selected");
		
		if(sub=="") // Change sub name header
		{
		  $("#subnameheader").html("<a target='_blank' href='http://www.reddit.com/'>Front Page</a>");
		} 
		else 
		{
		  $("#subnameheader").html("<a target='_blank' href='http://www.reddit.com/r/" + sub + "'>r/"+sub+"</a>");
		}

		$("#rightcolumn").focus();
		
	}).fail(function(data) 
	{
		ClearLeftSide();
		$("#subnameheader").html("<div class='col-xs-12'>Could not get data from subreddit '"+sub+"'. Please make sure that this subreddit exists, or try again in a few minutes.</div>");
	});

}

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

	$("#main").append("<div class='row'><div id='getmore' class='col-xs-12 text-center'>Load more...</div></div>");
}

function getStory(sub,id)
{

	$("#main > .entries").attr("class","row entries");
	$("div[data-id='"+id+"']").attr("class","row entries selected"); // Highlight entry

	history.replaceState(undefined, undefined, "#"+sub + "-" + id);

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

		$("#rightcolumn").focus();


	}).fail(function(data) 
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

function hashLocation()
{
	var hash = window.location.hash;

	//check if a hash is present
	if(hash!="")
	{
		var i = hash.search("-");
		if(i!=-1)
		{
			sub = hash.slice(1, i);
			ClearRightSide();
			id = hash.slice(i+1);
			getStory(sub, id);

		}
		else
		{
			sub = hash.slice(1);
		}
	}
}

function isImgurVid(url) // Returns true if url is .gifv, .webm, or .mp4
{
    var exts = [".gifv", ".webm", ".mp4"];
    for (var i in exts) 
    {
        if(url.indexOf(exts[i]) == url.length - exts[i].length) return true;
    }
    return false;
}

function searchReddits(query)
{
	if($("#input-sub").val() == "")
	{
		$("#results").hide();
	}
	else
	{
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