(function () {

    var counter = 0;
    $("form").on("submit", function (e) {
        e.preventDefault();
        // prevents the automatic refresh on submit
        $(".scrolling-profiles").empty();
        // empties the page so that we can repopulate it with info from a new zip code
        var input = $(this).find(".address").val();
        // sets the user input to a variable so we can check for correct length

        if (input.length != 5) {
            // validate user input here
            $("#invalidInputModal").modal();
            // tell them invalid input with a modal
            $(".scrolling-profiles").html(
                "<div class='row'>" +
                "<div class='container'>" +
                "<div class='col-md-8 mx-auto scrolling-profiles'>" +
                "<div class='jumbotron welcome'>" +
                "<h1 class='display-4 text-center'>" +
                "<img class='display-4 mx-auto welcome-image' alt='logo' src='assets/images/politiscape.png'> </h1>" +
                "<p class='lead'>Type in your zip-code on the search bar!</p>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>"
            ); // displays the welcome message
        }

        var apikey = "AIzaSyBnSJK9UJlSfuLnLzo-85xDPDCRbjCHEM8";
        var queryURL = "https://www.googleapis.com/civicinfo/v2/representatives?address=" + input + "&key=" + apikey;
        // sets the api to a var and the queryURL to a variable

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            for (var k = 0; k < response.offices.length; k++) {

                var position = response.offices[k].name;
                // person's official position

                var officialInd = [];
                // create an empty array to hold the titles of offices referenced by index in the name array

                for (var m = 0; m < response.offices[k].officialIndices.length; m++) {

                    officialInd.push({
                        position: position,
                        index: response.offices[k].officialIndices[m]
                    });
                    // pushes an object into the empty array
                }

                for (var b = 0; b < officialInd.length; b++) {
                    var indexofName = officialInd[b].index;
                    // get's the associated index value
                    var name = response.officials[indexofName].name;
                    // person's name



                    var nameArr = name.split("") //building out array to remove spaces and punctuation for id names

                    for (var n = 0; n < nameArr.length; n++) {
                        if (nameArr[n] === ".") {

                            nameArr.splice([n], 1) //removing punctuation for initials first
                        }
                        if (nameArr[n] === " ") {

                            nameArr[n] = "-"; //removing spaces to replace with hypens to create IDs and 
                        } else {
                            nameArr[n] = nameArr[n] //keeping all letters
                        }
                    }

                    var nameID = nameArr.join("") //rejoining the names for IDs

                    var party = response.officials[indexofName].party;
                    // person's political party
                    var photo = response.officials[indexofName].photoUrl;
                    // person's photo src


                    if (!response.officials[indexofName].photoUrl) {
                        var photoSrc = "assets/images/nophoto.png"
                    } else {
                        var photoSrc = photo
                    }

                    var socialMedia = response.officials[indexofName].channels

                    if (!socialMedia) {
                        // do nothing so links will not show up

                    } else {
                        for (sm = 0; sm < socialMedia.length; sm++) {
                            if (socialMedia[sm].type === "Twitter") {
                                var twitterID = socialMedia[sm].id
                            }
                            if (socialMedia[sm].type === "Facebook") {
                                var facebookID = socialMedia[sm].id
                            }
                            //defining social media handles to use in the button generator
                        }
                    }

                    //*********Create social media buttons**************

                    var newOfficial = $("<div class='card profile-card animated fadeIn'>");
                    // creates a newOfficial variable with a class profile-card
                    var wrapper = $("<div class='imgwrapper'>");
                    // adds a div with a class imgwrapper and an id with the officials name
                    var officialPhoto = $("<img class='card-img-top img-fluid img-responsive profile-img'>").attr("src", photoSrc);
                    // adds a img with a class card-img-top img-fluid img-responsive profile-img and sets the source to the officials photo from the civic information api
                    var officialBody = $("<div class='card-body text-center'>");
                    // adds a div with a class card-body text-center for formatting
                    officialBody.attr("id", nameID)
                    // adds name to the official body so that headlines can be appended to correct place
                    var officialName = $("<h5 class='card-title'>").text(name);
                    // adds a h5 with a class card-title with the officials name
                    var officialPosition = $("<p class='card-text text-muted'>").text(position + " --- " + party);
                    // adds a p with a class card-text text-muted with the officials position and party

                    var officialSocialDiv = $("<div class='social-links'>");
                    officialSocialDiv.addClass(nameID)
                    officialSocialDiv.attr("id", name)
                    //creates the social div to hold buttons for the link to external sites
                    
                    var officialURL = response.officials[indexofName].urls
                    // Grabs link for official website button
                    
                    buttonGenerator(twitterID, facebookID, photoSrc, nameID, position, name, officialSocialDiv, officialURL)
                    // Generates buttons


                    wrapper.append(officialPhoto);
                    // puts the officialPhoto into the wrapper div
                    officialBody.append(officialName)
                        .append(officialPosition)
                        .append(officialSocialDiv);
                    // puts the officialName, officialPosition and the officialSocialDiv into the officialBody div
                    
                    newOfficial.append(wrapper)
                        .append(officialBody);
                    //adds the wrapper with the image and the officialBody to the newOfficial

                    $(".scrolling-profiles").append(newOfficial);
                    // dynamically creates new cards with each official's data

                } //ends for loop on line 57

            } // ends for loop on line 40


            $(".headlines").on("click", displayHeadlines)

        }) //ends $.ajax on line 35
    }) //ends "form on line 4

    function buttonGenerator(twitterID, facebookID, photoSrc, nameID, position, name, officialSocialDiv, officialURL) {
        var cardLinks = ["https://twitter.com/" + twitterID, "https://facebook.com/" + facebookID, officialURL]
        var websiteIconClasses = ["fab fa-twitter fa-stack-1x fa-inverse", "fab fa-facebook-f fa-stack-1x fa-inverse", "fa fa-user fa-stack-1x fa-inverse", "fa fa-newspaper fa-stack-1x fa-inverse"]

        
        for (var i = 0; i < 4; i++) {
            // For loop to cycle through the arrays above
            var websiteBtn = $("<span class='fa-stack fa-lg'>")
            var websiteURL = cardLinks[i] // Grabs the button's website from the cardLinks array
            var buttonCircle = $("<i>") // Creates the button circle background
            buttonCircle.addClass("fa fa-circle fa-stack-2x")
            var websiteIcon = $("<i>") // Creates the website icon 
            websiteIcon.addClass(websiteIconClasses[i])
            websiteBtn.append(buttonCircle).append(websiteIcon) // Adds circle and icon to button

            if (i < 3) {
                var website = $("<a>") // Builds up the <a> tag to hold each button's link
                website.attr("href", websiteURL)
                website.attr("target", "_blank")
                website.append(websiteBtn)

                officialSocialDiv.append(website);
            } else {
                // Different button creation process for Headlines when hidden
                websiteBtn.addClass("headlines hidden")
                websiteBtn.attr("id", nameID)
                var website = $("<a>")
                website.append(websiteBtn)

                officialSocialDiv.append(website);
            }
        }
        // returns the div with added buttons back to the main body
        return officialSocialDiv
    }

    function displayHeadlines() {

        var headlinesDivID = $(this).attr('id') + "headlines" // Grabs the ID of the specific button clicked

        // ******Checks to see if Headlines button has class 'hidden' or 'displayed' 
        //********hides or displays the headlines for each card appropriately
        if ($(this).hasClass('hidden')) {
            $(this).removeClass('hidden')
            $(this).addClass('displayed')

            var cardClickedID = $(this).attr('id') // Grabs ID of specific button's card clicked so headlines div can be added to the right card

            var headlinesDiv = $("<div class='text-left displayed'>").attr("id", headlinesDivID)
            headlinesDiv.addClass("animated fadeIn")
            // Creating div to hold list of headlines

            var headlinesList = $("<ul>")
            // Creating list of headlines

            var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=96a8c512eae346c58a56d7649ea2eef2";
            queryURL += ('&q="' + cardClickedID + '"') //this is the ID of the card (aka the name of the official)
            queryURL += "&news_desk:('Politics')&sort=newest"

            $.get(queryURL)
                .then(function (response) {
                    
                    for (var i = 0; i < 3; i++) {
                        headlinesList.append("<li><a target='_blank' href='" + response.response.docs[i].web_url + "'>" + response.response.docs[i].headline.main + "</a><br>")
                    }
                })

            $("#" + cardClickedID).append(headlinesDiv) //Appends the headlines div to the clicked-on card body
            $("#" + headlinesDivID).html(headlinesList) // Appends headlines to the newly created headlinesDiv
        } else {
            $(this).removeClass('displayed') //removing displayed to show headlines are now hidden
            $(this).addClass('hidden')

            $("#" + headlinesDivID).remove() //removing div so official card goes back to original formatting
        }
    }

})();