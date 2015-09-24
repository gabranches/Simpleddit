<?php 

if(isset($_GET['oa'])) {
    if ($_GET['oa']==1) {
        require('reddit-php-sdk/reddit.php');
        $reddit = new reddit();
    }
}

$sub = "";
$logged_in = 0;

if (isset($_GET["r"])) {	
    $sub = $_GET["r"];	
}

if (isset($reddit)) {  // Check if user logged in through oauth
    $r = $reddit->getSubscriptions();
    $logged_in = 1;
    $defsubs = "";

    foreach($r->data->children as $key => $value) {
        if($defsubs != "") {
            $defsubs .= "+";
        }
        $defsubs .= ($value->data->display_name);
    }
    if ($defsubs == "") {// Logout if there is no default sub list
        $logged_in = 0;
    }

} else {
    $defsubs = "";
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Simpleddit</title>
  <link id="favicon" rel="shortcut icon" type="image/png" href="" />
  <meta name="description" content="simpleddit is a simple and efficient way of browsing reddit using a two-column layout.">
  <meta name="keywords" content="simpleddit,simple,reddit,work,discreet,efficient,columns">
  <link rel="image_src" href="images/logo.png">
  <link rel="shortcut icon" type="image/png" href="images/favicon.ico">
  <!-- STYLESHEETS -->
  <link href='http://fonts.googleapis.com/css?family=Open+Sans:600' rel='stylesheet' type='text/css'>
  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
  <link rel="stylesheet" href="style.css">
  <!-- JAVASCRIPT -->
  <script src="lib/handlebars-v2.0.0.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
  <script src="lib/bootstrap-typeahead.js"></script>
</head>
<body>
  <!-- NAVIGATION -->
  <nav id="topnav" class="navbar navbar-fixed-top" role="navigation">
    <div class="container-fixed">
      <div id="formrow" class="row">
        <form id="form-sub" role="form">
          <div id="logo" class="hidden-xs col-sm-2 text-center" tabindex="1">
            <a href="/">Simpleddit</a>
          </div>
          <div id="logo-filler" class="col-xs-2 text-center" style="display: none;">
          </div>
          <div class="col-xs-3 col-lg-2">
            <select id="select-sub" placeholder="Select Subreddit" class="form-control">
              <option selected="selected" disabled tabindex="2">Popular Subreddits</option>
              <option value="">Front Page</option>
            </select>
          </div>
          <div class="col-xs-3 col-sm-2" tabindex="3">
            <input type="input" class="form-control" id="input-sub" placeholder="Enter Subreddit">
          </div>
          <div id="results" style="display: none">
          </div>
          <div class="col-xs-1">
            <button type="submit" class="btn btn-primary"><span class="glyphicon glyphicon-search"></span>
            </button>
          </div>
          <div class="col-xs-1">
            <select id="select-sort" class="form-control">
              <option selected="selected" value="hot" tabindex="4">hot</option>
              <option value="new">new</option>
              <option value="rising">rising</option>
              <option value="day">top today</option>
              <option value="week">top week</option>
              <option value="month">top month</option>
              <option value="year">top year</option>]
              <option value="all">top all</option>
            </select>
          </div>
           <div id="login-button" class="col-xs-1 text-center" tabindex="5"><span id='login'><a href='?oa=1'>login</a></span></div>
          <div id="options-button" class="col-xs-1 text-center" tabindex="5">options</div>
          <div id="about-button" class="col-xs-1 text-center" tabindex="6">about</div>
        </form>
      </div>
      <div class="row" id="main-top">
        <div class="col-xs-6">
          <div id="subnameheader" class="col-xs-12 text-center"></div>
        </div>
        <div class="col-xs-6">
          <div id="storyheader" class="col-xs-12 text-center"></div>
        </div>
      </div>
    </div>
  </nav>
	<!-- MAIN CONTAINER -->
  <div class="container-fixed">
    <!-- LEFT COLUMN -->
    <div id="leftcolumn" class="col-xs-6" tabindex="7">
      <div class="row">
        <div id="main" class="col-xs-12"></div>
      </div>
    </div>
    <!-- RIGHT COLUMN -->
    <div id="rightcolumn" class="col-xs-6 scrollbar-outer" tabindex="8">
      <div id="options" style="display:none" class="row">
        <div class="col-xs-6">
          <div class="form-group">
            <div id="options-header">
            	<h4>options</h4>
            	<small>Will be saved in your browser cookies for 30 days</small>
            </div>
          </div>
          <div class="form-group">
          	<input type="checkbox" id="hide-images" checked>
            <label for="hide-images">Auto-hide thread images</label>
          </div>
          <div class="form-group">
          	<input type="checkbox" id="hide-logo" checked>
            <label for="hide-logo">Hide the site logo</label>
          </div>
          <div class="form-group">
          	<input type="checkbox" id="hide-nsfw" checked>
            <label for="hide-nsfw">Hide NSFW threads</label>
          </div>
          <div class="form-group">
            <input type="checkbox" id="hide-gif" checked>
            <label for="hide-gif">Embed gifs and videos</label><br />
            <small>(uncheck if your browser lags when viewing gifs or videos)</small>
          </div>
          <br />
          <label>Site theme:</label>
          <select id="select-theme" class="form-control">
              <option value="">Light Theme</option>
              <option value="dark">Dark Theme</option>
          </select><br />
          <label>Left column size (Large is default):</label>
          <select id="column-size" class="form-control">
              <option value=6>Large</option>
              <option value=5>Medium</option>
              <option value=4>Small</option>
              <option value=3>Tiny</option>
          </select><br />
          <label>Page title:</label>
          <input type="input" class="form-control" id="input-title" placeholder="Change the title of the page">
        </div>
        <div class="col-xs-12">
          <p>Would you like to see more functionality added here? Please feel free to fill out this <a target="_blank" href="http://goo.gl/forms/SZ6w8x0Mnc">Feedback Sheet</a> on Google Forms.</p>
        </div>
      </div>
      <div id="about" class="row">
        <div class="col-xs-12">
          <h4>About Simpleddit</h4>
          <p>Simpleddit is a simple and efficient way of browsing <a target="_blank" href="http://reddit.com">reddit</a>.</p>
          <p>The source code is available on my <a target="_blank" href="http://github.com/gvdasolutions/simpleddit">Github page</a>.</p>
          <h4>Browsing Tips</h4>
          <ul>
            <li>Link directly to a subreddit with simpleddit.com/{sub}, simpleddit.com/r/{sub} Example: <a href="pics">simpleddit.com/pics</a>
            </li>
            <li>You can view multiple subreddits at once by using "+" in the Enter Subreddit box. Example: "pics+funny+askreddit"
            </li>
            <li>Login with reddit to see your subscribed subreddits</li>
            <li>See the options page for more features</li>
          </ul>
          <h4>Keyboard Shortcuts</h4>
          <ul class="list-unstyled">
            <li><span class="spaced">H</span>Show/Hide Image</li>
            <li><span class="spaced">J</span>Next Thread</li>
            <li><span class="spaced">K</span>Previous Thread</li>
            <li><span class="spaced">L</span>Open URL</li>
          </ul>
          <h4>Feedback</h4>
          <p>If you have any questions or comments, please feel free to fill out this <a target="_blank" href="http://goo.gl/forms/SZ6w8x0Mnc">Feedback Sheet</a> on Google Forms.</p>       
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

<!-- HANDLEBARS TEMPLATES -->

<script id="entry-template" type="text/x-handlebars-template">

	<div data-id="{{id}}" data-sub="{{subreddit}}" class="row entries">
		<div class="col-xs-3 col-md-2 entry-info text-center">
      <div class="row">
       <div class="col-xs-12 text-right score">{{score}} <span class="glyphicon glyphicon-arrow-up"></div>
      </div>
      <div class="row text-right">
       <div class="col-xs-12"> {{num_comments}} <span class="glyphicon glyphicon-comment"></div>
      </div>
    </div>
		<div class="col-xs-9 col-md-10 title"><a>{{{title}}}</a> <small>{{{nsfwHelper over_18}}} {{{stickyHelper stickied}}} {{subHelper this}}</small> </div>
	</div>

</script>

<script id="story-template" type="text/x-handlebars-template">

	<div class="row">
		<div class='story-title col-xs-12'>
			<strong>{{{title}}}</strong><br /><small>{{{authorHelper author}}} - {{timeHelper created_utc}}</small>
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
 		<a href="{{url}}" target="_blank">Link <small>(Source: {{domain}})<small></a>
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

sub = <?php echo json_encode($sub); ?>;
logged_in = <?php echo($logged_in); ?>;
defsubs = <?php echo('"' . $defsubs . '"'); ?>;



</script>

<script src="main.js"></script>
<script src="event_handlers.js"></script>
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