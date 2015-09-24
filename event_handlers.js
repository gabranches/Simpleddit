// ** EVENT HANDLERS ** //

$("#form-sub").submit(function(e) // Subreddit form submit
{ 	
	e.preventDefault();
	sub = $("#input-sub").val();
	ClearLeftSide();
	getItems(sub, sort);
});

$('#input-sub').typeahead( // Autofill
{
	onSelect: function(item) 
	{
		ClearLeftSide();
        getItems(item.value, sort);
    },
    ajax: 'lib/suggestions.js'
});

$(document).on("click", ".story-sublink span", function() // Go to subreddit on click
{ 	
	sub = $(this).html();
	ClearLeftSide();
	$("#input-sub").val(sub);
	getItems(sub, sort);
});

$(document).on("click", "#reload-button", function() // Go to subreddit on click
{ 	
	ClearLeftSide();
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

	if (options_mode == 0){
		
		if(e.which==74 && !($("#input-sub").is(':focus')))  // Next story
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
		      	currentStory.next().get(0).scrollIntoView();

	    	}
	        if (nextStoryId !== undefined)
	        {
		        ClearRightSide();
		        getStory(nextStorySub,nextStoryId);
	        }
	    }
	    else if (e.which==75 && !($("#input-sub").is(':focus')))  // Previous story
	    {
	    	var currentStory = $(".entries.selected");
	        var prevStoryId = currentStory.prev().attr("data-id");  // Select previous story
	        var prevStorySub = currentStory.prev().attr("data-sub");
	        currentStory.prev().get(0).scrollIntoView();
		    if (prevStoryId !== undefined)
	        {
		        ClearRightSide();
		        getStory(prevStorySub,prevStoryId);
	        }
	    }
	    else if (e.which==72 && !($("#input-sub").is(':focus'))) // Hide or show image
	    {
	    	$('#storyimage').toggle();
	    	$('#albumthumbs').toggle();
			$('#showimage').text() == " Show Image" ? $('#showimage').html("<span class='glyphicon glyphicon-picture'></span> Hide Image") : $('#showimage').html("<span class='glyphicon glyphicon-picture'></span> Show Image");
	    }
	    else if (e.which==76 && !($("#input-sub").is(':focus'))) // Hide or show image
	    {
	    	var goUrl = $(".story-url a").attr("href");
	    	window.open(goUrl,'_blank');
	    }
	}
});

$(document).on("click", "#logout", function() // Logout
{ 	
	eraseCookie("reddit_token");
	window.location.href = "http://simpleddit.com";
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
	}
	else
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
		createCookie("nsfw", "on", 30);
		$(".glyphicon-nsfw").css({opacity: "1"});
	}
	else
	{
		createCookie("nsfw", "off", 30);
		$(".glyphicon-nsfw").css({opacity: ".5"});
	}
	ClearLeftSide();
	getItems(sub, sort);
});

$(document).on("change", '#hide-gif', function() {
	if(readCookie("gif"))
	{
		eraseCookie("gif");
	}
	else
	{
		createCookie("gif", "on", 30);
	}
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
		document.title = "simpleddit.com";
	}
	else
	{
		document.title = newTitle;
		createCookie("title", newTitle, 30);
	}
});

$(document).on("focus", "#input-title", function() // Change page title, change to options_mode = 1 so that "L" doesn't open a new page
{ 	
	options_mode = 1;
});

$(document).on("click", "#showimage", function() // Show story image
{ 	
	$('#storyimage').toggle();
	$('#albumthumbs').toggle();
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

	if (sub == "" && logged_in == 1)
	{
		sub = defsubs;
	}

	getItems(sub, sort);
});

$("#select-theme").change(function() // Theme select (options)
{
	theme = $('#select-theme').val();

	if(!theme.length) // If it's the light theme
	{
		$('#theme-style').remove();
		createCookie("theme", "light", 30);
		$("#theme-select").html("Dark Theme");
		$("#theme-select").attr("data-theme", "dark");
	} 
	else
	{
		$("#theme-select").html("Light Theme");
		$("#theme-select").attr("data-theme", "");
		$('<link/>', {rel: 'stylesheet', href: 'themes/dark.css', id: 'theme-style'}).appendTo('head');
		createCookie("theme", "dark", 30);
	}
});

$("#column-size").change(function() // Theme select (options)
{
	size = $('#column-size').val();
	setColumnWidth(size);
	createCookie("column", size, 30);

});

$(window).resize(function(){
	resize();
});

$(document).on("click", "", function(){
	$("#results").empty();
	$("#results").hide();
});