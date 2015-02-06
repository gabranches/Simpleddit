// ** HANDLEBARS HELPERS **  //

Handlebars.registerHelper("nsfwHelper", function (over_18)
{
       return over_18 == true ? "<span class='red'>NSFW</span>" : "";
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
    if (readCookie("showImages") == "1")
    {
        var imgAttr = "<img id='storyimage' src='";
        var picButton = "<div id='showimage'><span class='glyphicon glyphicon-picture'></span> Hide Image</div>";
    }
    else
    {
        var imgAttr = "<img id='storyimage' style='display:none' src='";
        var picButton = "<div id='showimage'><span class='glyphicon glyphicon-picture'></span> Show Image</div>";
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
    else if (data.domain == "i.imgur.com" && !isImgurVid(data.url))
    {
        return prefix + suffix;
    }
    else if (data.domain == "i.imgur.com" && isImgurVid(data.url))
    {
        var nakedUrl = data.url.split(data.url.match(/\.([A-Za-z0-9]+)$/g)[0])[0];
        var embededVideo = "<video autoplay loop muted preload id='storyimage'>";
		embededVideo += "<source src='" + nakedUrl + ".webm' type='video/webm'>";
        embededVideo += "<source src='" + nakedUrl + ".mp4' type='video/mp4'>";
		embededVideo += "</video>";

		return embededVideo;
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
    } else if (diff >= (60*60*24*30)) {
        unit = "months";
        diff = Math.round(diff/(60*60*24*30));
        if (diff == 1){
            unit = "month";
        }
    } 

    return (diff + " " + unit + " ago");
});

Handlebars.registerHelper("authorHelper", function (data)
{
   return data == OP ? "<span class='author'>" + data + "</span>" : "<span>" + data + "</span>";
});

Handlebars.registerHelper("stickyHelper", function (sticky)
{
   return sticky == true ? "<span class='green'>sticky </span>" : "";
});

