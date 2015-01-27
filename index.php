<?php

$sub = "";

if(isset($_GET["r"])){
	$sub = $_GET["r"];
}

// Test commit

?>

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="utf-8">
<title>simplereddit.net: a simple reddit browser</title>
<link id="favicon" rel="shortcut icon" type="image/png" href="" />

<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
<link href='http://fonts.googleapis.com/css?family=Open+Sans:600' rel='stylesheet' type='text/css'>
<link rel="stylesheet" href="style.css">

<script src="lib/handlebars-v2.0.0.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
<script src="https://d3dy5gmtp8yhk7.cloudfront.net/2.1/pusher.min.js"></script>

</head>

<body>

<nav id="topnav"class="row-fluid navbar navbar-fixed-top" role="navigation">
	<div class="container-fixed">
		<div id="formrow" class="row">
			<form id="form-sub" role="form">
				<div id="logo" class="col-xs-1 text-center"><a href="/">simplereddit</a></div>
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
				<div class="col-xs-3"></div>
				<div class="col-xs-2"></div>
				
				
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
				Change page title: <br /><br />
				<input type="input" class="form-control" id="pagetitleinput" placeholder="rViewer">
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
<div class="col-xs-6 col-md-8 col-lg-10 title">{{{htmlHelper title}}} <small><span class="red">{{nsfwHelper over_18}} </span>{{subHelper this}}</small> </div>
	<div class="col-xs-3 col-md-2 col-lg-1 text-center">{{num_comments}}<br /></span></div>
	
</div>

</script>

<script id="story-template" type="text/x-handlebars-template">
	<div class="row">
		<div class='story-title col-xs-12'>
			<strong>{{{htmlHelper title}}}</strong><br /><small>{{author}} - {{timeHelper created_utc}}</small>
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
 	<div style="{{indentHelper this}} {{colorHelper numNest}}" class='comment col-xs-12 '>
 		<div class="row">
 			<div class="col-xs-12">
 				<small>{{ptsHelper ups}}</small>  <small>{{author}}</small>   <small>{{timeHelper created_utc}}</small>
 			</div>
 		</div>
 		<div class="row">
 			<div class="col-xs-12">
	 			{{{htmlHelper body_html}}}
	 		</div>
	 	</div>
 	</div>
</div>

</script>

<script>

	sub = ""; // For local version
	sub = <?php echo json_encode($sub); ?>;

</script>

<script src="main.js"></script>
<script src="handlebars_helpers.js"></script>

<!-- Google Analytics -->

<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-58991641-1', 'auto');
  ga('send', 'pageview');

</script>