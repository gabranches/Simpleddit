<?php 
	include("main.php"); 
?>

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="utf-8">
<title>simplereddit</title>
<link id="favicon" rel="shortcut icon" type="image/png" href="" />
<meta name="description" content="SimpleReddit is an easy and discreet way of browsing reddit using a two-column layout." />
<meta name="keywords" content="simplereddit,simple,reddit,work,discreet,efficient,columns" />

<link rel="shortcut icon" type="image/png" href="images/favicon.ico"/>
<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
<link href='http://fonts.googleapis.com/css?family=Open+Sans:600' rel='stylesheet' type='text/css'>
<link rel="stylesheet" href="style.css">

<script src="lib/handlebars-v2.0.0.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>

</head>

<body>

<nav id="topnav"class="row-fluid navbar navbar-fixed-top" role="navigation">
	<div class="container-fixed">
		<div id="formrow" class="row">
			<form id="form-sub" role="form">
				<div id="logo" class="col-xs-2 text-center">
					<a href="/"><img src="images/logo.png" /></a>
				</div>
				<div class="col-xs-2">
					<select id="select-sub" placeholder="Select Subreddit" class="form-control">
						<option selected="selected" disabled>Popular Subreddits</option>
						<option value="">Front Page</option>
					</select>
				</div>
				<div class="col-xs-2">
					<input type="input" class="form-control" id="input-sub" placeholder="Enter Subreddit">
				</div>
				<div class="col-xs-1">
					<select id="select-sort" class="form-control">
					    <option selected="selected" value="hot">hot</option>
					    <option value="new">new</option>
					    <option value="rising">rising</option>
					    <option value="day">top today</option>
					    <option value="week">top this week</option>
					    <option value="month">top this month</option>
					    <option value="year">top this year</option>]
					    <option value="all">top all time</option>
					</select>
				</div>
				<div class="col-xs-1">
					<button type="submit" class="btn btn-primary"><span class="glyphicon glyphicon-search"></span></button>
				</div>
				<div class="col-xs-2"></div>
				<div id="options-button" class="col-xs-1">options</div>
				<div id="about-button" class="col-xs-1">about</div>
			</form>
		</div>
		<div class="row" id="main-top">
			<div class="col-xs-6">
				<div class="col-xs-3 col-md-2 col-lg-1 text-center text-center"><span class="glyphicon glyphicon-arrow-up"></span></div>
				<div id="subnameheader" class="col-xs-6 col-md-8 col-lg-10 text-center text-center"></div>
				<div class="col-xs-3 col-md-2 col-lg-1 text-center text-center"><span class="glyphicon glyphicon-comment"></span></div>
			</div>
			<div class="col-xs-6">
				<div id="storyheader" class="col-xs-12 text-center"></div>
			</div>
		</div>
	</div>
</nav>

<div class="container-fixed">
	<div id="leftcolumn" class="col-xs-6">
		<div class="row">
			<div id="main" class="col-xs-12"></div>
		</div>
		<div class="row">
			<div id="getmore" class="col-xs-12 text-center">Load more...</div>
		</div>
		
	</div>
	<div id="rightcolumn" class="col-xs-6">
		<div id="options" style="display:none" class="row">
			<div class="col-xs-6">
				<h4>Options</h4>
				<div class="form-group">
					<input type="checkbox" id="hide-images" checked> Auto-hide thread images<br>
				</div>
				<div class="form-group">
					<input type="input" class="form-control" id="input-title" placeholder="Change the title of the page">
				</div>
			</div>
			<div class="col-xs-6">
			</div>
			<div class="col-xs-12">
				<p>Would you like to see more functionality added here? Please feel free to fill out this <a target="_blank" href="http://goo.gl/forms/SZ6w8x0Mnc">Feedback Sheet</a> on Google Forms.</p>
			</div>
		</div>
		<div id="about" class="row">
			<div class="col-xs-12">
				<h4>About SimpleReddit.net</h4>
				<p>SimpleReddit is an easy and discreet way of browsing <a target="_blank" href="http://reddit.com">Reddit</a>.</p>
				<br />
				<p>This site is built with Javascript and uses the Reddit API. The source code is available on my <a target="_blank" href="http://github.com/gvdasolutions/simplereddit">Github page</a>.</p>
				<br />
				<h4>Browsing Tips</h4>
				<ul>
					<li>You can link directly to a subreddit with simplereddit.net/{sub} or simplereddit.net/r/{sub} Example: <a href="pics">simplereddit.net/pics</a></li>
					<li>The "Popular Subreddits" dropdown reflects the current subs with the most activity and is sorted in order of popularity</li>
					<li>You can view multiple subreddits at once by using "+" in the Enter Subreddit box. Example: "pics+funny+askreddit"</li>
				</ul>

				<br />
				<h4>Recent updates</h4>
				<ul>
					<li>Feb 03 2015 - Users are now able to hide/show nested thread comments</li>
					<li>Feb 02 2015 - Author usernames now are now highlighted in red in thread titles and comments</li>
					<li>Jan 30 2015 - Users are now able to change the page title from the options page</li>
					<li>Jan 27 2015 - Options are now saved in your browser's cookies for 30 days</li>
					<li>Jan 26 2015 - Site is live!</li>
				</ul>
				<br />
				<h4>Future plans</h4>
				<ul>
					<li>Allow users to log in their reddit account and view subscribed subreddits</li>
				</ul>
				<br />
				<h4>Feedback</h4>
				<p>If you have any questions or comments, please feel free to fill out this <a target="_blank" href="http://goo.gl/forms/SZ6w8x0Mnc">Feedback Sheet</a> on Google Forms.</p>
				<br />
				<h4>Contributions</h4>
				<p>This site does not have and will never have ads. If you enjoy using SimpleReddit, please consider donating to the developer!</p>
				<img id="btclogo" src="images/btc.png" />1KdtdaA9NXu6Pgf7cW3iCkiw7yWos9hz5k
				<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
				<input type="hidden" name="cmd" value="_s-xclick">
				<input type="hidden" name="hosted_button_id" value="E7JNNEU4WCBN2">
				<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
				<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
				</form>
				<br />
			</div>
		</div>
		<div class="row">
			<div id="story" class="col-xs-12"></div>
		</div>
		<div class="row">
			<div id="comments" class="col-xs-12"></div>
		</div>
	</div>
</div>

</body>

</html>

<script id="entry-template" type="text/x-handlebars-template">

	<div data-id="{{id}}" data-sub="{{subreddit}}" class="row entries">
		<div class="col-xs-3 col-md-2 col-lg-1 text-center">{{score}}</span></div>
		<div class="col-xs-6 col-md-8 col-lg-10 title">{{{htmlHelper title}}} <small>{{{nsfwHelper over_18}}} {{{stickyHelper stickied}}} {{subHelper this}}</small> </div>
		<div class="col-xs-3 col-md-2 col-lg-1 text-center">{{num_comments}}<br /></span></div>
	</div>

</script>

<script id="story-template" type="text/x-handlebars-template">
	<div class="row">
		<div class='story-title col-xs-12'>
			<strong>{{{htmlHelper title}}}</strong><br /><small>{{{authorHelper author}}} - {{timeHelper created_utc}}</small>
 	</div>
</div>
<div class="row">
	<div class='story-selftext col-xs-12'>
		{{{htmlHelper selftext_html}}}
		{{{picHelper this}}}
	</div>
</div>
<div class="row">
 	<div class='story-url col-xs-12'>
 		<a href="{{url}}" target="_blank">{{url}}</a>
 	</div>
 </div>
 <div class="row">
 	<div class='story-sublink col-xs-12'>
 		<strong><span>{{subreddit}}</span></strong>
 	</div>
 </div>
 
</div>

</script>

<script id="comment-template" type="text/x-handlebars-template">
 	<div id="{{id}}" class='comment col-xs-12 '>
 		<div class="row">
 			<div class="col-xs-12 comment-header">
 				<span class='nested-toggle glyphicon glyphicon-minus'></span> <small> {{ptsHelper ups}}</small>  <small>{{{authorHelper author}}}</small>   <small>{{timeHelper created_utc}}</small>
 			</div>
 		</div>
 		<div class="row">
 			<div class="col-xs-12 comment-body">
	 			{{{htmlHelper body_html}}}
	 		</div>
	 	</div>
 	</div>

</script>

<script>

	// For local version
	sub = ""; 

	// For server version
	sub = <?php echo json_encode($sub); ?>;

</script>

<script src="main.js"></script>
<script src="handlebars_helpers.js"></script>
<script src="lib/cookies.js"></script>

<!-- Google Analytics -->

<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-58991641-1', 'auto');
  ga('send', 'pageview');

</script>