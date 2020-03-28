var media_use_char = 0;
var link_use_char = 23;
var tweet_length_limit = 280;

var clipboard = new Clipboard('.clipp');

clipboard.on('success', function(e) {
    swal({
        title: "Copied!",
        type: 'success',
        text: "Your Tweet has been copied to your clipboard",
        timer: 2000,
        showConfirmButton: false
    });
});
var link_clipboard = new Clipboard('.link-clipp');

link_clipboard.on('success', function(e) {
    swal({
        title: "Placeholder Copied!",
        text: "Link placeholder copied to clipboard",
        timer: 1000,
        showConfirmButton: false
    });
});

populate_tweet_list();




function assess_tweet() {
    // Pull tweet text from input form
    var tweet = $('#tweet-text').val();
    // Find initial char count using twitter-text lib
    var tweet_length = twttr.txt.getTweetLength(tweet);
    var remaining_characters = tweet_length_limit - twttr.txt.getTweetLength(tweet);
    var tweet_valid = true;

    // Scan tweet text for link placeholder text
    // Remove link usage char count
    // Add char usage from link placeholder back in
    var test_tweet = tweet.toLowerCase();

    if (
        test_tweet.indexOf('[link]') !== -1 && 
        test_tweet.indexOf(' [link] ') === -1 && 
        test_tweet.indexOf('[link] ') === -1 && 
        test_tweet.indexOf('[link]\n') === -1 && 
        test_tweet.indexOf('\n[link]') === -1 && 
        test_tweet.indexOf(' [link]') === -1 &&
        test_tweet !== '[link]'
    ) {
        $('#tweet-text-container').addClass('has-danger');
        $('#tweet-text').addClass('form-control-danger');
        $('#tweet-text-label').text('URL Error - needs a space between link and text');
        tweet_valid = false;
        // alert('error');
    } else {
        $('#tweet-text-container').removeClass('has-danger');
        $('#tweet-text').removeClass('form-control-danger');
        $('#tweet-text-label').html('&nbsp;');
        tweet_valid = true;
    }


    if (
        test_tweet.indexOf('[link] ') == 0 || 
        test_tweet.indexOf(' [link] ') !== -1 || 
        test_tweet.indexOf('\n[link]') !== -1 || 
        test_tweet.indexOf('[link]\n') !== -1 || 
        test_tweet.indexOf(' [link]') == (tweet_length - 7)
    ) {
        remaining_characters = remaining_characters - link_use_char + 6;
    }

    // Update char count text
    $('#remaining-count').html(remaining_characters + ' characters remaining');

    if(remaining_characters == tweet_length_limit || tweet_valid == false) {
        $('#copy-btn').attr('disabled', true);
    } else {
        $('#copy-btn').attr('disabled', false);
    }

    if (remaining_characters < 0 || remaining_characters == tweet_length_limit || tweet_valid == false) {
        $('#save-btn').attr('disabled', true);
    } else {
        $('#save-btn').attr('disabled', false);
    }

    // If char count has been overused
    if (remaining_characters < 0) {
        $('#remaining-count').addClass('remaining-count--over').removeClass('remaining-count--low');
    // If char count is running low
    } else if (remaining_characters <= 10) {
        $('#remaining-count').addClass('remaining-count--low').removeClass('remaining-count--over');
    // Char count is still allowed
    } else {
        $('#remaining-count').removeClass('remaining-count--low remaining-count--over');
    }


    // Reset hashtag list and hashtag count
    $('#hashtag-list').html('');
    var hashtagCount = 0;

    // Extract hashtags from tweet text
    var hashtags = twttr.txt.extractHashtags(tweet);


    // If any hashtags have been found
    if (hashtags.length > 0) {
        // Loop them

        var filtered_hashtags = hashtags.filter(function(item, pos){
            return hashtags.indexOf(item)== pos; 
        });

        for (i = 0; i < filtered_hashtags.length; i++) {
            // Append link to hashtag list
            var hashtagID = 'hashtag-' + hashtagCount;
            $('#hashtag-list').append('<a href="https://twitter.com/search?q=%23' + encodeURIComponent(filtered_hashtags[i]) + '" target="_blank" class="list-group-item" id="' + hashtagID + '"><span>' + filtered_hashtags[i] + '</span> <span class="badge">View Hashtag</span></a>');
            hashtagCount++;
        }

    // If no hashtags have been found
    } else {
        // Display empty list message
        $('#hashtag-list').append('<div class="list-group-item disabled">No hashtags found</div>');
    }
}


function save_tweet() {
    // Pull tweet text from input form
    var tweet_text = $('#tweet-text').val();

    if (tweet_text) {
        var local_stored = localStorage.getItem('stored_tweets');
        local_stored = JSON.parse(local_stored);
        var existing_tweet_id = parseInt($('#tweet-text').attr('data-tweet'), 10);

        // If edited tweet id is present
        // Update said tweet id with updated content
        if (existing_tweet_id >= 0) {
            localStorage.setItem('tweet_' + existing_tweet_id, tweet_text);

            // Post alert to indicate successful save
            swal({
                title: "Tweet Updated",
                type: 'success',
                text: "Tweet text has been updated",
                timer: 2000,
                showConfirmButton: true
            });

        // If is a new tweet to be saved
        } else {

            // If saved tweet list is array but empty
            // Manually set tweet id to 0
            if (Array.isArray(local_stored) && local_stored.length == 0) {
                var stored_tweets = [0];
                var tweet_id = 0;
            
            // If saved tweet list is array with multiple saved values
            // Sort tweet ids from smallest to largest
            // Create new id of next largest int
            } else if (Array.isArray(local_stored) && local_stored.length > 0) {
                var stored_tweets = local_stored;
                stored_tweets.sort(function(a, b) { return a - b; });
                var last_tweet_id = parseInt(stored_tweets[stored_tweets.length - 1], 10);
                var tweet_id = last_tweet_id + 1;
                stored_tweets.push(tweet_id);

            // If tweet list isn't yet defined
            // Manually set tweet id to 0
            } else {
                var stored_tweets = [0];
                var tweet_id = 0;
            }

            // Restringify tweet id list and update stored id's
            localStorage.setItem('stored_tweets', JSON.stringify(stored_tweets));
            // Save tweet content against defined id
            localStorage.setItem('tweet_' + tweet_id, tweet_text);

            // Post alert to indicate successful save
            swal({
                title: "Tweet Saved",
                type: 'success',
                text: "Tweet saved to your list",
                timer: 2000,
                showConfirmButton: true
            });
        }

        // Reset input form
        clear_form();
        // Repopulate sidebar list with new tweet list
        populate_tweet_list();
    }
}


function clear_form() {
    // Reset form to blank and remove any defined edit id's
    $('#tweet-text').val('').attr('data-tweet', false);
    // Reassess tweet text to reset hashtag and char count
    assess_tweet();
}



function prepare_clear_list() {
    swal({
        title: "Are you sure?",
        text: "You will not be able to recover these tweets",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete them",
        closeOnConfirm: false
    },
    function(){
        clear_list();
        swal("Deleted!", "Your imaginary file has been deleted.", "success");
    });
}




function clear_list() {
    // Pull list of stored variables
    var local_stored = localStorage.getItem('stored_tweets');

    // If any stored tweets have been found
    if (local_stored) {

        // Parse stored tweet array
        var stored_tweets = JSON.parse(local_stored);

        // Loop through stored tweets
        // Remove local storage item for that tweet id
        for (i = 0; i < stored_tweets.length; i++) {
            localStorage.removeItem('tweet_' + stored_tweets[i]);
        }

        // Reset possible edit tweet id
        $('#tweet-text').attr('data-tweet', false);
        // Clear sidebar
        $('.sidebar').html('');
        // Reset clear tweet button text
        $('#clear-tweets').text('Clear Tweets');
        // Overwrite stored tweets with blank array
        localStorage.setItem('stored_tweets', '[]');

        // Disable export and clear buttons
        $('#export-btn').attr('disabled', true);
        $('#clear-tweets').attr('disabled', true);

        // Display success message
        swal({
            title: "List Cleared",
            type: 'success',
            text: "Your tweet list has been cleared",
            timer: 2000,
            showConfirmButton: false
        });
    }
}


function copy_list() {
    // Pull list of stored tweets
    var local_stored = localStorage.getItem('stored_tweets');
    // Reset compiled text string variable
    var copied_list = '';

    // If any tweets are stored
    if (local_stored) {

        // Parse stored tweet array
        var stored_tweets = JSON.parse(local_stored);

        // Loop through stored tweets
        for (i = 0; i < stored_tweets.length; i++) {

            // Pull tweet text content
            var tweet_text = localStorage.getItem('tweet_' + stored_tweets[i]);
            // If tweet has any content and append to compiled text string variable
            if (tweet_text) {
                if(i !== 0) {
                    copied_list += '\n\n\n';
                }
                copied_list += tweet_text;
            }
        }

        // If any compiled tweets
        // Add compiled text string variable to modal textarea 
        // Focus on field and select all text
        if(copied_list !== '') {
            $('#copied-list').val(copied_list).focus(function() { $(this).select(); });
            $('#generate-btn').attr('disabled', false);
        }

        // Show export modal
        $('#myModal').modal('show')
    }
}





function remove_tweet(id) {
    // Pull list of stored tweets
    var local_stored = localStorage.getItem('stored_tweets');

    // If any tweets are stored
    if (local_stored) {

        // Parse stored tweet array
        var stored_tweets = JSON.parse(local_stored);

        // Search stored tweet array for passed tweet id
        var index = stored_tweets.indexOf(id);

        // If tweet id is found
        if (index !== -1) {

            // Remove tweet id from the stored tweet id
            stored_tweets.splice(index, 1);

            // If the removed tweet is the same as one being currently edited
            // Reset edit tweet id
            if(parseInt($('#tweet-text').attr('data-tweet'), 10) == id) {
                $('#tweet-text').attr('data-tweet', false);
            }

            // Remove individual stored tweet
            localStorage.removeItem('tweet_' + id);
            // Resave stringified tweet list id
            localStorage.setItem('stored_tweets', JSON.stringify(stored_tweets));
            // Repopulate tweet sidebar
            populate_tweet_list();
        }
    }
}


function populate_tweet_list() {

    // Pull list of stored tweets
    var local_stored = localStorage.getItem('stored_tweets');
    var stored_tweets = JSON.parse(local_stored);

    // If any tweets are stored
    if (Array.isArray(stored_tweets) && stored_tweets.length > 0) {
        // Clear sidebar
        $('.sidebar').html('');
        // Parse stored tweet array

        // Loop through stored tweets
        for (i = 0; i < stored_tweets.length; i++) {
            // Pull stored tweet copy
            var tweet_copy = localStorage.getItem('tweet_' + stored_tweets[i]);
            // Construct tweet card markup
            var tweet_html = '<div class="card"><div class="card-block"><p class="card-text">';
            tweet_html += tweet_copy;
            tweet_html += '</p><a href="javascript:void(0)" class="card-link" onclick="load_tweet(' + stored_tweets[i] + ');">Edit</a> <a href="javascript:void(0)" class="card-link clipp" data-clipboard-text="' + tweet_copy + '">Copy</a> <a href="javascript:void(0)" class="card-link" onclick="remove_tweet(' + stored_tweets[i] + ');">Remove</a></div></div>';
            // Add to sidebar
            $('.sidebar').prepend(tweet_html);
        }

        // Scroll sidebar back to the top
        $('.sidebar').scrollTop(0);
        $('#export-btn').attr('disabled', false);
        $('#clear-tweets').attr('disabled', false);
    } else {
        $('.sidebar').html('');
        $('#export-btn').attr('disabled', true);
        $('#clear-tweets').attr('disabled', true);
    }
}

function load_tweet(id) {

    var local_stored = localStorage.getItem('stored_tweets');

    if (local_stored) {
        var stored_tweets = JSON.parse(local_stored);


        var index = stored_tweets.indexOf(id);

        if (index !== -1) {
            $('#tweet-text').attr('data-tweet', index).val(localStorage.getItem('tweet_' + index));
            assess_tweet();
        }
    }
}

function prepare_data() {
    var tweet_array = [];
    $('.sidebar .card-text').each(function() {
        tweet_array.push($(this).text());
    });

    $.ajax({
        type: "POST",
        url: "export.php",
        data: { tweet_data: tweet_array },
        success: function(data) {
            if(data == 'error') {

            } else {
                prepare_download_file(data);
            }
        }
    });
}

function prepare_download_file(url) {
    $('#download-btn').attr('href', url).show();
    $('#generate-btn').hide().attr('disabled', true);
}




(function($) {

    $('#support-link').click(function() {
        $('#support-modal').modal('show')
    });

    $('#sidebar-btn').click(function() {
        $('body').toggleClass('sidebar-open');
    });

    $('#myModal').on('hidden.bs.modal', function (e) {
        $('#download-btn').attr('href', false).hide();
        $('#generate-btn').show().attr('disabled', true);
    });


    $('#support-modal').on('hidden.bs.modal', function (e) {
        $('#form-messages').hide().text('');
    });

    assess_tweet();

    $('#tweet-text').keyup(function() {
        assess_tweet();
    });

    $('#image-checkbox').change(function() {
        assess_tweet();
    });

    // Get the form.
    var form = $('#ajax-contact');

    // Get the messages div.
    var formMessages = $('#form-messages');

// Set up an event listener for the contact form.
$(form).submit(function(event) {
    // Stop the browser from submitting the form.
    event.preventDefault();
    // Serialize the form data.
    var formData = $('#ajax-contact').serialize();

    // TODO

    // Submit the form using AJAX.
    $.ajax({
        type: 'POST',
        url: $(form).attr('action'),
        data: formData
    })
    .done(function(response) {
        // Make sure that the formMessages div has the 'success' class.
        $(formMessages).removeClass('error');
        $(formMessages).addClass('success');

        // Set the message text.
        // $(formMessages).show().text(response);

        // Clear the form.
        $('#name').val('');
        $('#email').val('');
        $('#message').val('');
        $('#support-modal').modal('hide')
        swal({
            title: "Support Ticket Sent",
            type: 'success',
            text: "I will try to get back to you ASAP",
            timer: 2000,
            showConfirmButton: false
        });
    })
    .fail(function(data) {
        // Make sure that the formMessages div has the 'error' class.
        $(formMessages).removeClass('success');
        $(formMessages).addClass('error');

        // Set the message text.
        if (data.responseText !== '') {
            $(formMessages).show().text(data.responseText);
        } else {
            $(formMessages).show().text('Oops! An error occured and your message could not be sent.');
        }
    });
});


}(jQuery));

$('#download-btn').click(function() {
    window.location.href = $(this).attr('rel');
});