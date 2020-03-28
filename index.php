<!DOCTYPE html>
<html>

<head>
    <title>Twitter Message Drafter</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://rawgit.com/wenzhixin/bootstrap-table/master/src/bootstrap-table.css">
    <link rel="stylesheet" href="sweetalert.css">
    <meta property="og:title" content="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />
    <meta property="og:description" content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vel eros nec ipsum convallis elementum." />
    <meta property="og:url" content="http://socialmediacreator.co.uk" />
    <meta property="og:image" content="http://placehold.it/200x600/" />
    <style>
        .sidebar-header {
            width: 100%;
            position: fixed;
            bottom: 0;
            left: -100%;
            height: 50px;
            background: #f7f7f7;
            padding: 10px 20px;
            z-index: 2;
            overflow: auto;
            font-size: 0.8em;
            transition: left 0.25s ease;
        }
        
        .sidebar {
            width: 100%;
            position: fixed;
            bottom: 50px;
            left: -100%;
            top: 55px;
            background: #ccc;
            padding: 20px;
            overflow: auto;
            z-index: 1;
            transition: left 0.25s ease;
        }
        
        .sidebar-open .sidebar-header,
        .sidebar-open .sidebar {
            left: 0;
        }
        
        .card {
            margin: 20px 0 0;
            font-size: 0.8em;
        }
        
        .card:first-child {
            margin: 0;
        }
        
        .card-text {
            word-break: break-word;
        }
        
        .twitter-form-container {
            padding: 75px 20px 20px;
        }
        
        hr {
            margin: 30px 0;
        }
        
        h1 {
            font-size: 1.75em;
            margin: 0 0 30px;
        }
        
        .remaining-count {
            display: block;
            margin: 10px 0 0;
            color: green;
        }
        
        .remaining-count--low {
            color: orange;
        }
        
        .remaining-count--over {
            color: red;
        }
        
        .list-group-item {
            justify-content: space-between;
        }
        
        .badge {
            color: inherit;
        }
        
        #form-messages {
            margin: 0 0 20px;
            font-size: 0.8em;
            display: none;
        }
        
        @media screen and (min-width: 600px) {
            .navbar {
                padding-right: 320px;
                height: 55px;
            }
            .nav-link {
                padding-top: 0;
                padding-bottom: 0;
            }
            .sidebar-header {
                top: 0;
                bottom: auto;
                z-index: 1030;
                height: 55px;
                border-left: 1px #ccc solid;
            }
            .sidebar {
                top: 55px;
                bottom: 0;
                z-index: 1030;
            }
            .sidebar-open .sidebar-header {
                top: 0;
            }
            .sidebar-open .sidebar-header,
            .sidebar-open .sidebar {
                left: auto;
            }
            .twitter-form-container {
                padding: 40px;
                padding-top: 80px;
                padding-right: 340px;
            }
            h1 {
                font-size: 2.25em;
            }
            .sidebar-header {
                left: auto;
                width: 300px;
                right: 0;
            }
            .sidebar {
                left: auto;
                width: 300px;
                right: 0;
            }
        }
        
        @media screen and (min-width: 800px) {
            h1 {
                font-size: 3em;
            }
        }
    </style>
</head>

<body>

    <nav class="navbar fixed-top navbar-light bg-faded">
        <span class="navbar-text">
    Twitter Message Drafter
    <a class="nav-link float-right hidden-sm-down" href="javascript:void(0)" id="support-link">Support</a>
  </span>
        <button id="sidebar-btn" class="navbar-toggler navbar-toggler-right" type="button" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
    </nav>

    <aside class="sidebar-header">
        <div style="text-align: right">
            <button type="button" class="btn btn-info btn-sm" onclick="copy_list();" style="float:left" id="export-btn" disabled>Export</button>
            <button type="button" class="btn btn-danger btn-sm" onclick="prepare_clear_list();" id="clear-tweets" disabled>Clear Tweets</button>
        </div>
    </aside>
    <aside class="sidebar"></aside>

    <div class="twitter-form-container">

        <p>Use <a href="javascript:void(0)" class="link-clipp" data-clipboard-text="[LINK]">[LINK]</a> as a placeholder if you are unsure about the URL to include.</p>

        <div class="form-group" id="tweet-text-container">
            <label class="form-control-label" id="tweet-text-label">&nbsp;</label>
            <textarea class="form-control" rows="5" id="tweet-text"></textarea>
            <span class="remaining-count" id="remaining-count">140 characters remaining</span>
        </div>

        <div class="form-group" style="display:none">
            <label class="custom-control custom-checkbox">
          <input type="checkbox" class="custom-control-input" id="image-checkbox">
          <span class="custom-control-indicator"></span>
          <span class="custom-control-description">Is there additional media? (e.g. Image, GIF, Video or Poll)</span>
        </label>
        </div>

        <hr>
        <div>
            <button type="button" class="btn btn-success" onclick="save_tweet();" id="save-btn" disabled>Save</button>
            <button type="button" class="btn btn-info clipp" id="copy-btn" data-clipboard-target="#tweet-text" disabled>Copy</button>


            <button type="button" class="btn btn-danger" onclick="clear_form();" style="float: right;">Clear</button>
        </div>
        <hr>


        <div class="form-group" id="hashtags-section">
            <h3>Hashtags</h3>
            <p>Links to the hashtag results page. Make sure to check what they are being used for!</p>
            <div class="list-group" id="hashtag-list">
                <div class="list-group-item disabled">No hashtags found</div>
            </div>
        </div>

    </div>

    <div class="modal fade" id="myModal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Tweet List</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
                </div>
                <div class="modal-body">
                    <textarea name="" id="copied-list" cols="30" rows="10" class="form-control" rows="5" readonly></textarea>
                </div>
                <div class="modal-footer">
                    <a href="javascript:void(0)" class="btn btn-primary" style="color: white; display: none;" id="download-btn">Download CSV</a>
                    <button type="button" class="btn btn-success" onclick="prepare_data();" id="generate-btn" disabled>Generate CSV</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="support-modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Submit Support Question</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
                </div>
                <div class="modal-body">
                    <div id="form-messages"></div>
                    <form id="ajax-contact" method="post" action="mailer.php">
                        <div class="form-group">
                            <label for="name"><small>Name*</small></label>
                            <input type="text" class="form-control" id="name" name="name" aria-describedby="nameHelp" required>
                        </div>
                        <div class="form-group">
                            <label for="exampleInputEmail1"><small>Email address*</small></label>
                            <input type="email" class="form-control" id="email" name="email" aria-describedby="emailHelp" required>
                        </div>
                        <div class="form-group">
                            <label for="message"><small>Message*</small></label>
                            <textarea class="form-control" id="message" name="message" rows="5" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossorigin="anonymous"></script>
    <script src="tether.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js"></script>
    <script src="twitter-text.js"></script>
    <script src="clipboard.min.js"></script>
    <script src="sweetalert.min.js"></script>
    <script src="script.js?v=2"></script>


</body>

</html>