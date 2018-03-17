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
            console.log (queryURL)
        
            for (var k = 0; k < response.offices.officialIndices.length; k++) {
                var position = response.offices[k].name;
                // person's official position
                
                var indices = [];
                //loop through the offices.officialIndices?
                indices = response.offices[k].officialIndices;
                console.log(indices);
                
                var name = response.officials[indices].name;
                // person's name
                var party = response.officials[indices].party;
                // person's political party
                
                if (response.officials[indices].photoUrl = undefined) {
                    var photo = "assets/images/psicon.png"
                }
                else {
                    var photo = response.officials[indices].photoUrl
                };
                // person's photo src
        
                var newOfficial = $("<div class='card profile-card'>");
                // creates a newOfficial variable with a class profile-card

                var wrapper = $("<div class='imgwrapper' id='"+ name +"' >");
                // adds a div with a class imgwrapper and an id with the officials name

                var officialPhoto = $("<img class='card-img-top img-fluid img-responsive profile-img'>").attr("src", photo);
                // adds a img with a class card-img-top img-fluid img-responsive profile-img and sets the source to the officials photo from the civic information api
                
                var officialBody = $("<div class='card-body text-center'>");
                // adds a div with a class card-body text-center for formatting

                var officialName = $("<h5 class='card-title'>").text(name);
                // adds a h5 with a class card-title with the officials name

                var officialPosition = $("<p class='card-text text-muted'>").text(position + " --- " + party);
                // adds a p with a class card-text text-muted with the officials position and party

                var officialSocialDiv = $("<div class='social-links' id='"+ name +"'>").text();//for loop here
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
        
        })
    
})