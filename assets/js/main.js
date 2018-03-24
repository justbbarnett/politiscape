(function loadProfiles() {
    $("form").on("submit", function (e) {
        
        e.preventDefault();
        // prevents the automatic refresh on submit
        
        var input = $(this).find(".address").val();
        // sets the user input to a variable so we can check for correct length

        var queryURL = "https://www.googleapis.com/civicinfo/v2/representatives?address=" + input + "&key=AIzaSyBnSJK9UJlSfuLnLzo-85xDPDCRbjCHEM8";
        // sets the queryURL to a variable
        
        $.ajax({
            url: queryURL,
            method: "GET",
            success: function (response) {
                $(".scrolling-profiles").empty();
                // empties the page so that we don't repeat elements that are dynamically created after each zip entered

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
                        } 
                        else {
                            var photoSrc = photo
                        }

                        var socialMedia = response.officials[indexofName].channels

                        if (!socialMedia) {
                            // checks if there are social media associated with the officials and if not, nothing happens
                        } 
                        else {
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

                        var newOfficial = $("<div class='card profile-card animated fadeIn'>");
                        // creates a newOfficial variable with a class profile-card
                        var wrapper = $("<div class='imgwrapper'>");
                        // adds a div with a class imgwrapper and an id with the officials name
                        var officialPhoto = $("<img class='card-img-top img-fluid img-responsive profile-img'>").attr("src", photoSrc);
                        // adds a img with a class card-img-top img-fluid img-responsive profile-img and sets the source to the officials photo from the civic information api
                        var officialBody = $("<div class='card-body text-center'>").attr("id", nameID);
                        // adds a div with a class card-body text-center for formatting and adds an id name to the official body so that headlines can be appended to correct place
                        var officialName = $("<h5 class='card-title'>").text(name);
                        // adds a h5 with a class card-title with the officials name
                        var officialPosition = $("<p class='card-text text-muted'>").text(position + " --- " + party);
                        // adds a p with a class card-text text-muted with the officials position and party

                        var officialSocialDiv = $("<div class='social-links'>").attr("id", name);
                        officialSocialDiv.addClass(nameID)
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
                    } 
                } 

                $(".headlines").on("click", displayHeadlines)

            }, 
            error: function errorCallback(){
                $(".scrolling-profiles").html("<div class='jumbotron welcome animated fadeIn'>" +
                "<h1 class='display-4 text-center heading'>" +
                "<img class='display-4 mx-auto welcome-image' alt='logo' src='assets/images/politiscape-welcome.png'> </h1>" +
                "<hr class='my-4'>" +
                "<p class='lead'>Sorry, the Google Civic Information API doesn't believe that the zip code you entered is real. Please enter a different 5 digit zip code.</p>" +
                "<form class='form-inline my-2 my-lg-0'>" +
                "<input class='form-control mr-1 address no-spinners' type='number' placeholder='Your Zip Code' aria-label='zipcode'>" +
                "<button class='btn btn-outline-primary my-2 my-sm-0'>Zip</button>" +
                "</form>" +
                "</div>");
            // displays an error message that will display when the api returns an error on a "valid" zip code. Meaning they don't have information for that zip code.
                loadProfiles();
            }
        });
    })

    function buttonGenerator(twitterID, facebookID, photoSrc, nameID, position, name, officialSocialDiv, officialURL) {
        var cardLinks = ["https://twitter.com/" + twitterID, "https://facebook.com/" + facebookID, officialURL]
        var websiteIconClasses = ["fab fa-twitter fa-stack-1x fa-inverse", "fab fa-facebook-f fa-stack-1x fa-inverse", "fa fa-user fa-stack-1x fa-inverse", "fa fa-newspaper fa-stack-1x fa-inverse"]
        
        for (var i = 0; i < 4; i++) {
            // For loop to cycle through the arrays above
            var websiteBtn = $("<span class='fa-stack fa-lg'>")
            var websiteURL = cardLinks[i] // Grabs the button's website from the cardLinks array
            var buttonCircle = $("<i class='fa fa-circle fa-stack-2x'>") // Creates the button circle background
            var websiteIcon = $("<i>").addClass(websiteIconClasses[i]) // Creates the website icon 
            websiteBtn.append(buttonCircle).append(websiteIcon) // Adds circle and icon to button

            if (i < 3) {
                var website = $("<a target='_blank'>").attr("href", websiteURL) // Builds up the <a> tag to hold each button's link
                website.append(websiteBtn)
                officialSocialDiv.append(website);
            } 
            else { // Different button creation process for Headlines when hidden
                websiteBtn.addClass("headlines hidden").attr("id", nameID)
                var website = $("<a>").append(websiteBtn)
                officialSocialDiv.append(website);
            }
        }
        return officialSocialDiv // returns the div with added buttons back to the main body
    }

    function displayHeadlines() {

        var headlinesDivID = $(this).attr('id') + "headlines" // Grabs the ID of the specific button clicked

        if ($(this).hasClass('hidden')) { // ******Checks to see if Headlines button has class 'hidden' or 'displayed' 
            $(this).removeClass('hidden')
            $(this).addClass('displayed') //********hides or displays the headlines for each card appropriately

            var cardClickedID = $(this).attr('id') // Grabs ID of specific button's card clicked so headlines div can be added to the right card

            var headlinesDiv = $("<div class='text-left displayed animated fadeInDown'>").attr("id", headlinesDivID)
            // Creating div to hold list of headlines

            var headlinesList = $("<ul>")
            // Creating list of headlines

            var URL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=96a8c512eae346c58a56d7649ea2eef2";
            URL += ('&q="' + cardClickedID + '"') //this is the ID of the card (aka the name of the official)
            URL += "&news_desk:('Politics')&sort=newest"

            $.get(URL)
                .then(function (response) {
                    
                    for (var i = 0; i < 3; i++) {
                        headlinesList.append("<li><a target='_blank' href='" + response.response.docs[i].web_url + "'>" + response.response.docs[i].headline.main + "</a><br>")
                    }
                })

            $("#" + cardClickedID).append(headlinesDiv) //Appends the headlines div to the clicked-on card body
            $("#" + headlinesDivID).html(headlinesList) // Appends headlines to the newly created headlinesDiv
        } 
        else {
            $(this).removeClass('displayed') //removing displayed to show headlines are now hidden
            $(this).addClass('hidden')

            $("#" + headlinesDivID).remove() //removing div so official card goes back to original formatting
        }
    }
})();