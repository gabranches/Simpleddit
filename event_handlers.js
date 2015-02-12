// ** EVENT HANDLERS ** //

$("#form-sub").submit(function(e) // Subreddit form submit
{ 	
	e.preventDefault();
	sub = $("#input-sub").val();
	ClearLeftSide();
	getItems(sub, sort);
});

$(document).on("click", ".story-sublink span", function() // Go to subreddit on click
{ 	
	sub = $(this).html();
	ClearLeftSide();
	$("#input-sub").val(sub);
	getItems(sub, sort);
});

$(document).on("click", ".entries", function() // Go to story (div handler)
{ 	
	ClearRightSide();
	id = $(this).attr("data-id");
	getStory($(this).attr("data-sub"),id);
});

$(document).on("click", ".entries a", function(event) // Go to story (anchor handler)
{ 	
	event.stopPropagation();
	ClearRightSide();
	id = $(this).parent().parent().attr("data-id");
	getStory($(this).parent().parent().attr("data-sub"),id);
});

$(document).keyup(function(e) {   // Keyboard navigation

	if(e.which==75 && !($("#input-sub").is(':focus')))  // Next story
	{
    	var currentStory = $(".entries.selected");
    	if (currentStory.attr("data-id") == undefined) // If no current story is set
    	{
    		var nextStoryId = $(".entries:first").attr("data-id");  // Use first story
    		var nextStorySub = $(".entries:first").attr("data-sub");
    	}
    	else
    	{
	        var nextStoryId = currentStory.next().attr("data-id"); // Select next story
	        var nextStorySub = currentStory.next().attr("data-sub");
    	}
        if (nextStoryId !== undefined)
        {
	        ClearRightSide();
	        getStory(nextStorySub,nextStoryId);
        }
    }
    else if (e.which==74 && !($("#input-sub").is(':focus')))  // Previous story
    {
    	var currentStory = $(".entries.selected");
        var prevStoryId = currentStory.prev().attr("data-id");  // Select previous story
        var prevStorySub = currentStory.prev().attr("data-sub");
	    if (prevStoryId !== undefined)
        {
	        ClearRightSide();
	        getStory(prevStorySub,prevStoryId);
        }
    }
    else if (e.which==72 && !($("#input-sub").is(':focus'))) // Hide or show image
    {
    	$('#storyimage').toggle();
		$('#showimage').text() == " Show Image" ? $('#showimage').html("<span class='glyphicon glyphicon-picture'></span> Hide Image") : $('#showimage').html("<span class='glyphicon glyphicon-picture'></span> Show Image");
    }
    else if (e.which==76 && !($("#input-sub").is(':focus'))) // Hide or show image
    {
    	var goUrl = $(".story-url a").attr("href");
    	window.open(goUrl,'_blank');
    }
    

});

$(document).keydown(function(e) {   
	if (e.which==40 && !($("#input-sub").is(':focus')))// Hide or show image
    {

    	 $("#rightcolumn").slimScroll({ height: ht-91 + "px", scrollBy: '40px' });
    }
    else if (e.which==38 && !($("#input-sub").is(':focus')))// Hide or show image
    {
    	 $("#rightcolumn").slimScroll({ height: ht-91 + "px", scrollBy: '-40px' });
    }
});

$(document).on("click", "#options-button", function() // Show options
{ 	
	ClearRightSide();

	$("#options").show();
});

$(document).on("click", "#about-button", function() // Show about
{ 	
	ClearRightSide();
	$("#rightcolumn").slimScroll({ height: ht-91 + "px"});
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
		document.title = "simplereddit.net";
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

$(document).on("click", "#getmore", function() // Load more
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
	$("#input-sub").val(sub);
	getItems(sub, sort);
});

$("#select-theme").change(function() // Theme select (options)
{
	theme = $('#select-theme').val();

	if(theme.length) // If it's the light theme
	{
		$('#theme-style').remove();
		createCookie("theme", "light", 30);
		$("#theme-select").html("Dark Theme");
		$("#theme-select").attr("data-theme", "dark");
	} 
	else
	{
		$("#theme-select").html("Light Theme");
		$("#theme-select").attr("data-theme", "light");
		$('<link/>', {rel: 'stylesheet', href: 'themes/dark.css', id: 'theme-style'}).appendTo('head');
		eraseCookie("theme");
		
	}
});

$("#theme-select").click(function() // Theme select (nav bar)
{
	theme = $('#theme-select').attr("data-theme");

	if(theme == "light") // If the light theme is selected
	{
		$('#theme-style').remove();
		createCookie("theme", "light", 30);
		$("#theme-select").html("Dark Theme");
		$("#theme-select").attr("data-theme", "dark");
		$("#select-theme>option:eq(1)").attr("selected", true);
	} 
	else
	{
		$('<link/>', {rel: 'stylesheet', href: 'themes/dark.css', id: 'theme-style'}).appendTo('head');
		eraseCookie("theme");
		$("#theme-select").html("Light Theme");
		$("#theme-select").attr("data-theme", "light");
		$("#select-theme>option:eq(0)").attr("selected", true);
	}
});

$(window).resize(function(){
	resize();
});

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
			$("#input-sub").val(name);
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
	var s = $(this)[0].innerHTML;
	s = s.replace("<span class=\"match\">", "");
	s = s.replace("</span>", "");
	sub = s;
	getItems(s, sort);
});