$("form").on("submit", function(e) {
    e.preventDefault();
    $(".scrolling-profiles").empty();
    var input = $("#address").val();
    if (input.length != 5) {
        // validate user input here!!!
        //tell them invalid input with a modal
        // clear input field on okay from modal
    }
    else {
        var address = $("#address").val();
    }
    var apikey = "AIzaSyBnSJK9UJlSfuLnLzo-85xDPDCRbjCHEM8";
    var queryURL = "https://www.googleapis.com/civicinfo/v2/representatives?address=" + address + "&key=" + apikey;
    $.ajax({
        url: queryURL,
        method: "GET"
      })
        .then(function(response) {
        console.log(response);
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
                    
                    var buttonCircle = $("<i>")
                        buttonCircle.addClass("fa fa-circle fa-stack-2x")
                    

                    var  socialMedia = response.officials[indexofName].channels
                        console.log(socialMedia)

                        if (!socialMedia) {
                            console.log("not very social")
                            //     var noSocial = $("<span class='fa-stack fa-lg'>")
                            //     var noSocialBtn = $("<i class='fa fa-circle fa-stack-2x'>")
                            //     var noSocianIcon = $("<i class='fa fa-window-close fa-stack-1x fa-inverse'>")
                            // noSocialBtn.append(noSocianIcon)
                            // noSocial.append(noSocialBtn)

                        }
                        else {
                            for (sm = 0; sm< socialMedia.length; sm++) {
                                if (socialMedia[sm].type === "Twitter") {
                                    var twitterID = socialMedia[sm].id
                                    console.log(twitterID + "  - twitter")
                                    // var twitterURL = $("<a href='https://twitter.com/" + twitterID)
                                    // var twitterBtn = $("<span class='fa-stack fa-lg'>")
                            
                                    // var twitterIcon = $("<i>")
                                    //     twitterIcon.addClass("fa fa-twitter fa-stack-1x fa-inverse")
                            
                                    // twitterBtn.append(buttonCircle).append(twitterIcon)

                                    // var twitter = $("<a>")
                                    //     twitter.attr("href", twitterURL)
                                    //     twitter.attr("target", "_blank")
        
                                    // twitter.append(twitterBtn)

                                }
                                if (socialMedia[sm].type === "Facebook") {
                                    var facebookID = socialMedia[sm].id
                                    console.log(facebookID + "  - facebook")

                                    // var facebook = $("<a href='https://twitter.com/" + twitterID)
                                    // var facebookBtn = $("<span class='fa-stack fa-lg'><i class='fa fa-circle fa-stack-2x'></i><i class='fa fa-facebook fa-stack-1x fa-inverse'></i></span>")

                                    // facebook.append(facebookBtn)
                                }

                                
                            }
                        }
                    
                    
                        var url = response.officials[indexofName].urls    
                        var websiteBtn = $("<span class='fa-stack fa-lg'>")
                            
                            var websiteIcon = $("<i>")
                                websiteIcon.addClass("fa fa-user fa-stack-1x fa-inverse")
                            
                            websiteBtn.append(buttonCircle).append(websiteIcon)

                        var website = $("<a>")
                            website.attr("href", url)
                            website.attr("target", "_blank")
        
                        website.append(websiteBtn)
                        


                    var newOfficial = $("<div class='card profile-card'>");
                    // creates a newOfficial variable with a class profile-card
                    var wrapper = $("<div class='imgwrapper' id='"+ name +"' >");
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
                        officialSocialDiv.append(website)
                                        //  .append(twitter)
                        //                .append(facebook)
                                        
                    //for loop here
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
                }
                
                }
        
        })
    
})