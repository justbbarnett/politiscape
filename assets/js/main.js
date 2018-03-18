$("form").on("submit", function(e) {
    e.preventDefault();
    // prevents the automatic refresh on submit
    $(".scrolling-profiles").empty();
    // empties the page so that we can repopulate it with info from a new zip code
    var input = $("#address").val();
    // sets the user input to a variable so we can check for correct length
    
    if (input.length != 5) {
        // validate user input here
        $("#invalidInputModal").modal();
        // tell them invalid input with a modal
        $(".scrolling-profiles").text("Welcome to Politiscape! Please enter a valid 5 digit zip code to see your elected representatives.");
        // displays the welcome message
    }
    else {
        var address = $("#address").val();
        // sets the user input to a variable so we can pass it into the queryURL
    }
    
    var apikey = "AIzaSyBnSJK9UJlSfuLnLzo-85xDPDCRbjCHEM8";
    var queryURL = "https://www.googleapis.com/civicinfo/v2/representatives?address=" + address + "&key=" + apikey;
    // sets the api to a var and the queryURL to a variable

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {

        for (var k = 0; k < response.offices.length; k++) {

            var position = response.offices[k].name;
            // person's official position

            var officialInd = [];
            // create an empty array

            for(var m = 0; m < response.offices[k].officialIndices.length; m++) {

                officialInd.push(
                    {position: position, 
                    index: response.offices[k].officialIndices[m]}
                );   
                // pushes an object into the empty array
            }

            for (var b = 0; b < officialInd.length; b++) {
                var indexofName = officialInd[b].index;
                // get's the associated index value
                var name = response.officials[indexofName].name;
                // person's name
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

                var  socialMedia = response.officials[indexofName].channels


                if (!socialMedia) {
                    // do nothing
                }
                else {
                    for (sm = 0; sm< socialMedia.length; sm++) {
                        if (socialMedia[sm].type === "Twitter") {
                            var twitterID = socialMedia[sm].id
                        }
                        if (socialMedia[sm].type === "Facebook") {
                            var facebookID = socialMedia[sm].id
                        }
                    }
                }

            //*********Create social media buttons**************

            //****creating the twitter button
                var twitterBtn = $("<span class='fa-stack fa-lg'>")
                var twitterURL = ("https://twitter.com/" + twitterID)
                    console.log(facebookURL)
                var buttonCircle = $("<i>")
                    buttonCircle.addClass("fa fa-circle fa-stack-2x")
                var twitterIcon = $("<i>")
                    twitterIcon.addClass("fab fa-twitter fa-stack-1x fa-inverse")
                
                twitterBtn.append(buttonCircle).append(twitterIcon)

                var twitter = $("<a>")
                    twitter.attr("href", twitterURL)
                    twitter.attr("target", "_blank")
                twitter.append(twitterBtn)

            //*****creating the facebook button
                var facebookBtn = $("<span class='fa-stack fa-lg'>")
                var facebookURL = ("https://facebook.com/" + facebookID)
                    console.log(facebookURL)
                var buttonCircle = $("<i>")
                    buttonCircle.addClass("fa fa-circle fa-stack-2x")
                var facebookIcon = $("<i>")
                    facebookIcon.addClass("fab fa-facebook-f fa-stack-1x fa-inverse")
                
                facebookBtn.append(buttonCircle).append(facebookIcon)

                var facebook = $("<a>")
                    facebook.attr("href", facebookURL)
                    facebook.attr("target", "_blank")
                facebook.append(facebookBtn)
            
            //****creating the website button
                var url = response.officials[indexofName].urls                        
                var websiteBtn = $("<span class='fa-stack fa-lg'>")
                            
                var websiteIcon = $("<i>")
                    websiteIcon.addClass("fa fa-user fa-stack-1x fa-inverse")
                buttonCircle = $("<i>")
                    buttonCircle.addClass("fa fa-circle fa-stack-2x")
                websiteBtn.append(buttonCircle).append(websiteIcon)

                var website = $("<a>")
                    website.attr("href", url)
                    website.attr("target", "_blank")

                website.append(websiteBtn)
            
            //****creating the website button                      
                    var moreBtn = $("<span class='fa-stack fa-lg'>")
                    var moreIcon = $("<i>")
                        moreIcon.addClass("fa fa-newspaper fa-stack-1x fa-inverse")
                    buttonCircle = $("<i>")
                        buttonCircle.addClass("fa fa-circle fa-stack-2x")
                    moreBtn.append(buttonCircle).append(moreIcon)


                    var moreID = name.trim() + "-button"
                    var more = $("<a>")
                    more.addClass("moreBtn")
                    // more.attr("id", moreID) //adding iD for ease of GET on second API
                    // more.attr("href", url)
                    // more.attr("target", "_blank")

                    console.log(moreID)
                    more.append(moreBtn)
                    website.append(websiteBtn)

                    var newOfficial = $("<div class='card profile-card'>");
                    // creates a newOfficial variable with a class profile-card
                    var wrapper = $("<div class='imgwrapper'>");
                    // adds a div with a class imgwrapper and an id with the officials name
                    var officialPhoto = $("<img class='card-img-top img-fluid img-responsive profile-img'>").attr("src", photoSrc);
                    // adds a img with a class card-img-top img-fluid img-responsive profile-img and sets the source to the officials photo from the civic information api
                    var officialBody = $("<div class='card-body text-center'>");
                    // adds a div with a class card-body text-center for formatting
                    var officialName = $("<h5 class='card-title'>").text(name);
                    // adds a h5 with a class card-title with the officials name
                    var officialPosition = $("<p class='card-text text-muted'>").text(position + " --- " + party);
                    // adds a p with a class card-text text-muted with the officials position and party

                    var officialSocialDiv = $("<div class='social-links'>");
                        // officialSocialDiv.attr("id", name)
                        officialSocialDiv.append(twitter)
                                        .append(facebook)
                                        .append(website)
                                        .append(more)
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
                
            } //ends for loop on line 38

        } // ends for loop on line 30

        $(".moreBtn").on("click", function (){
            var moreDiv = $("<div>")
                moreDiv.addClass("moreDiv")
            var moreLinksList = $("<ul>")
            var moreLinks = $("<li>")
                moreLinks.text("test test test")
            
            moreLinksList.append(moreLinks)
            moreDiv.append(moreLinksList)

            $(".social-links").append(moreDiv)
        });
         
    }) //ends $.ajax on line 25

}) //ends "form on line 1