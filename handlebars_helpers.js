// ** HANDLEBARS HELPERS **  //

Handlebars.registerHelper("nsfwHelper", function (over_18)
{
    if (over_18 == true)
    {
        return "NSFW";
    }
    else
    {
        return "";
    }
});

Handlebars.registerHelper("subHelper", function (data)
{
    if (data.topsub == "" || data.topsub == "all")
    {
        return data.subreddit;
    }
    else
    {
        return data.domain;
    }
});

Handlebars.registerHelper("htmlHelper", function (data)
{
   return htmlDecode(data);
});

Handlebars.registerHelper("ptsHelper", function (ups)
{
   if (ups == 1)
   {
    return ups + " pt";
   }

   return ups + " pts";
});

Handlebars.registerHelper("picHelper", function (data)
{
    if (hideImages)
    {
        var imgAttr = "<img id='storyimage' style='display:none' src='";
        var picButton = "<div id='showimage'><span class='glyphicon glyphicon-picture'></span> Show Image</div>";
    }
    else
    {
        var imgAttr = "<img id='storyimage' src='";
        var picButton = "<div id='showimage'><span class='glyphicon glyphicon-picture'></span> Hide Image</div>";
    }
    
	var prefix = picButton + imgAttr + data.url;
	var suffix = "'' />";

    if (data.url.indexOf("imgur.com/a/") != "-1")
    {
        return "";
    }
    else if (data.domain == "imgur.com")
    {
        return prefix + ".jpg" + suffix;
    }
    else if (data.domain == "i.imgur.com")
    {
        return prefix + suffix;
    }
    else if (data.domain.indexOf("tumblr") != -1)
    {
        return prefix + suffix;
    }
    else if (data.domain.indexOf("youtube") != -1)
    {
    	var id = getYoutubeId(data.url);
    	return "<iframe width='560' height='315' src='http://www.youtube.com/embed/"+id[1]+"' frameborder='0' allowfullscreen></iframe>";
    }
    else
    {
        return "";
    }
});

Handlebars.registerHelper("timeHelper", function (created_utc)
{
    created_utc = parseInt(created_utc);
    var time_utc = new Date().getTime();
    time_utc = time_utc/1000;
    var diff = time_utc - created_utc;
    var unit = "";

    if (diff < 60) {
        unit = "seconds";
        diff = Math.round(diff);
        if (diff == 1){
            unit = "second";
        }
    } else if (diff >= 60 && diff < (60*60)) {
        unit = "minutes";
        diff = Math.round(diff/60);
        if (diff == 1){
            unit = "minute";
        }
    } else if (diff >= (60*60) && diff < (60*60*24)) {
        unit = "hours";
        diff = Math.round(diff/(60*60));
        if (diff == 1){
            unit = "hour";
        }
    } else if (diff >= (60*60*24) && diff < (60*60*24*30)) {
        unit = "days";
        diff = Math.round(diff/(60*60*24));
        if (diff == 1){
            unit = "day";
        }
    } else if (diff >= (60*60*24*30) && diff < (60*60*24*30*12)) {
        unit = "months";
        diff = Math.round(diff/(60*60*24));
        if (diff == 1){
            unit = "month";
        }
    } else if (diff >= (60*60*24*30*12)) {
        unit = "years";
        diff = Math.round(diff/(60*60*24*30));
        if (diff == 1){
            unit = "year";
        }
    }

    return (diff + " " + unit + " ago");
});


Handlebars.registerHelper("indentHelper", function (data)
{
   return "margin-left:"+data.indent1+"px; padding-right:"+data.indent2+"px;";
});

Handlebars.registerHelper("colorHelper", function (numNest)
{
    var i = numNest % 5;
   return "border-left:"+numNest+"px solid #eee;";
});