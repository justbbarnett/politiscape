(function () {

    var headlinesDisplayed = false; // Switch to determine whether to show or hide headlines on button click
    function displayHeadlines() {

        var headlinesDivID = $(this).attr('id') + "headlines" // Grabs the ID of the specific button clicked
        if (headlinesDisplayed === false) {
            var cardClickedID = $(this).attr('id') // Grabs ID of specific button's card clicked so headlines div can be added to the right card

            // Creating div to hold list of headlines
            var headlinesDiv = $("<div class='text-left'>")
            // Gives that div a specific ID
            headlinesDiv.attr("id", headlinesDivID)

            // Creating list of headlines
            var headlinesList = $("<ul>")


            var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=96a8c512eae346c58a56d7649ea2eef2";
            queryURL += ('&q="' + cardClickedID + '"')
            queryURL += "&news_desk:('Politics')&sort=newest"


            $.get(queryURL)
                .then(function (response) {
                    // $("#" + headlinesDivID).html("<p>NYT Headlines: </p>")
                    for (var i = 0; i < 3; i++) {
                        headlinesList.append("<li><a target='_blank' href='" + response.response.docs[i].web_url + "'>" + response.response.docs[i].headline.main + "</a><br>")
                    }
                })

            $("#" + cardClickedID).append(headlinesDiv) //Appends the headlines div to the clicked-on card body
            $("#" + headlinesDivID).html(headlinesList) // Appends headlines to the newly created headlinesDiv
            headlinesDisplayed = true;
        } else {
            $("#" + headlinesDivID).empty()
            headlinesDisplayed = false;
        }
    }


    function buttonGenerator(twitterID, facebookID, photoSrc, nameID, position, name, officialSocialDiv, officialURL) {
        var cardLinks = ["https://twitter.com/" + twitterID, "https://facebook.com/" + facebookID, officialURL]
        var websiteIconClasses = ["fab fa-twitter fa-stack-1x fa-inverse", "fab fa-facebook-f fa-stack-1x fa-inverse", "fa fa-user fa-stack-1x fa-inverse", "fa fa-newspaper fa-stack-1x fa-inverse"]

        // For loop to cycle through the arrays above
        for (var i = 0; i < 4; i++) {
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
                // Different button creation process for Headlines
                websiteBtn.addClass("headlines")
                websiteBtn.attr("id", nameID)
                var website = $("<a>")
                website.append(websiteBtn)

                officialSocialDiv.append(website);
            }
        }
        // returns the div with added buttons back to the main body
        return officialSocialDiv
    }



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
            );
            // displays the welcome message
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
                // create an empty array

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

                            nameArr.splice([n], 1)
                        }
                        if (nameArr[n] === " ") {

                            nameArr[n] = "-";
                        } else {
                            nameArr[n] = nameArr[n]
                        }
                    }

                    var nameID = nameArr.join("")

                    var party = response.officials[indexofName].party;
                    // person's political party
                    var photo = response.officials[indexofName].photoUrl;
                    // person's photo src


                    if (!response.officials[indexofName].photoUrl) {
                        var photoSrc = "assets/images/nophoto.png"
                    } else {
                        var photoSrc = photo
                    }
                    var nameID = nameArr.join("")

                    var socialMedia = response.officials[indexofName].channels


                    if (!socialMedia) {
                        // do nothing

                    } else {
                        for (sm = 0; sm < socialMedia.length; sm++) {
                            if (socialMedia[sm].type === "Twitter") {
                                var twitterID = socialMedia[sm].id
                            }
                            if (socialMedia[sm].type === "Facebook") {
                                var facebookID = socialMedia[sm].id
                            }
                        }
                    }

                    //*********Create social media buttons**************



                    var newOfficial = $("<div class='card profile-card'>");
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

                    // Grabs link for official website button
                    var officialURL = response.officials[indexofName].urls

                    // var officialWebsite = $("<a>")
                    // officialWebsite.attr("href", response.officials[indexofName].url)
                    // officialWebsite.attr("target", "_blank")
                    // console.log("outside: " + officialWebsite)
                    // console.log(response.officials[indexofName].urls)

                    // Generates buttons


                    buttonGenerator(twitterID, facebookID, photoSrc, nameID, position, name, officialSocialDiv, officialURL)

                    // adds a div with a class social-links and an id with the officials name with their specific social media links

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

                } //ends for loop on line 50

            } // ends for loop on line 33


            $(".headlines").on("click", displayHeadlines)

        }) //ends $.ajax on line 25
    }) //ends "form on line 1
})();