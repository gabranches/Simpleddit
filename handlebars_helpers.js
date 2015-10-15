// ** HANDLEBARS HELPERS **  //

Handlebars.registerHelper("nsfwHelper", function (over_18)
{
    return over_18 == true ? "<span class='red'>NSFW</span>" : "";
});

Handlebars.registerHelper("subHelper", function (data)
{
    if (data.topsub == "" || data.topsub == "all" || data.topsub.indexOf("+") != "-1")
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
   return new Handlebars.SafeString(htmlDecode(data));
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
        var hidden = "";
        var imgAttr = "<img id='storyimage' src='";
        var picButton = "<div id='showimage'><span class='glyphicon glyphicon-picture'></span> Hide Image</div>";
    }
    else
    {
        var hidden = "style='display:none'";
        var imgAttr = "<img id='storyimage'" + hidden + " src='";
        var picButton = "<div id='showimage'><span class='glyphicon glyphicon-picture'></span> Show Image</div>";
    }
    
    var prefix = picButton + imgAttr + data.url;
    var suffix = "'' />";
    var prefixEmbed = picButton;

    if (isAnimated(data.url)) // check if it's a gif or video file
    {
        if ((data.domain == "gfycat.com")) // if it's gfycat
        {
            var embededVideo = "<div id='storyimage' " + hidden + "><iframe src="+data.url+" frameborder='0' scrolling='no' width='600' height='338' style='-webkit-backface-visibility: hidden;-webkit-transform: scale(1);'' ></iframe></div>";
            return readCookie("gif") ? "" : prefixEmbed + embededVideo; 
        }
        else if ((data.domain == "i.imgur.com" || data.domain == "imgur.com") && isImgurVid(data.url)) // if it's imgur and video
        {
            var nakedUrl = data.url.split(data.url.match(/\.([A-Za-z0-9]+)$/g)[0])[0];
            var embededVideo = "<div id='storyimage' " + hidden + "><video autoplay loop muted>";
            embededVideo += "<source src='" + nakedUrl + ".webm' type='video/webm'>";
            embededVideo += "<source src='" + nakedUrl + ".mp4' type='video/mp4'>";
            embededVideo += "</video></div>";

            return readCookie("gif")  ? "" : prefixEmbed + embededVideo; 
        }
        else if (data.domain == "i.imgur.com") // if it's from imgur and links to the file
        {
            return readCookie("gif") ? "" :  prefix + suffix;
        }
        else if (data.domain == "imgur.com") // if it's from imgur and links to the page
        {
            return readCookie("gif")  ? "" :  prefix + ".gif" + suffix;
        }
        else if (data.domain.indexOf("tumblr") != -1) // if it's from tumblr
        {
            return prefix + suffix;
        }
        else 
        {
            return "";
        }
    }
    else if (data.domain.indexOf("youtube") != -1 || data.domain.indexOf("youtu.be") != -1) // if it's a youtube link
    {
        var id = getYoutubeId(data.url);
        var youtubeEmbed = "<div id='storyimage' " + hidden + "><iframe width='560' height='315' src='http://www.youtube.com/embed/"+id[1]+"' frameborder='0' allowfullscreen></iframe></div>";
        return prefixEmbed + youtubeEmbed;
    }
    else // if it's not gif or video
    {
        if (data.url.indexOf("imgur.com/a/") != "-1") // if it's an imgur album
        {
            var albumId = data.url.split("/").pop();
            var embedThumbs = "";

            $.ajax({                                      
                url: 'https://api.imgur.com/3/album/'+albumId,       
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader ("Authorization", "Client-ID 53f530acc5e2988");
                    },            
                    dataType: 'json',   
                    success: function(data) 
                    {
                        $.each(data.data.images,function(index,element)
                        { 
                            console.log(element.id);
                            $("#albumthumbs").append("<a target='_blank' href='http://imgur.com/"+element.id+"'><img class='albumthumb' src='http://imgur.com/"+element.id+"b.jpg' /></a>");
                        });
                    },
                    error: function(data)
                    {
                        $("#albumthumbs").append("<br />Failed to load thumbnails. Please click album link below.");
                    }
            });


            return prefixEmbed + "<div id='albumthumbs'"+hidden+"></div>";
           
        }
        else if (data.url.indexOf("imgur.com/gallery/") != "-1" ) // if it's an imgur gallery
        {
            var splitUrl = data.url.split("/");
            splitUrl.splice(-1,1);
            var albumId = splitUrl.pop();
            var embedThumbs = "";

            $.ajax({                                      
                url: 'https://api.imgur.com/3/gallery/'+albumId,   
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader ("Authorization", "Client-ID 53f530acc5e2988");
                    }, 
                    dataType: 'json',   
                    success: function(data) 
                    {
                        $.each(data.data.images,function(index,element)
                        { 
                            console.log(element.id);
                            $("#albumthumbs").append("<a target='_blank' href='http://imgur.com/"+element.id+"'><img class='albumthumb' src='http://imgur.com/"+element.id+"b.jpg' /></a>");
                        });
                    },
                    error: function(data)
                    {
                        $("#albumthumbs").append("<br />Failed to load thumbnails. Please click album link below.");
                    }
            });

            return prefixEmbed + "<div id='albumthumbs'"+hidden+"></div>";
        }
        else if (data.domain == "imgur.com") // if it's imgur and doesn't link directly to the file
        {
            return prefix + ".jpg" + suffix;
        }
        else if (data.domain == "i.imgur.com") // if it's imgur and links to the file
        {
            return prefix + suffix;
        }
        else if (data.domain.indexOf("tumblr") != -1) // if it's from tumblr
        {
            return prefix + suffix;
        }
        else
        {
            return "";
        }
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