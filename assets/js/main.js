$("form").on("submit", function(e) {
    e.preventDefault();
    // prevents the automatic refresh on submit
    $(".scrolling-profiles").empty();
    // empties the page so that we can repopulate it with info from a new zip code
    var input = $("#address").val();
    // sets the user input to a variable so we can check for correct length
    
    if (input.length != 5) {
        // validate user input here!!!
        // tell them invalid input with a modal
        $("#exampleModal").modal();
        // calls the modal to appear
        $("input").empty();
        // clear input field on okay from modal
        $(".scrolling-profiles").text("Welcome to Politiscape! Please enter a valid 5 digit zip code to see your elected representatives.");
        // displays the welcome message
        
        
    }
    else {
        var address = $("#address").val();
        // sets the user input to a variable so we can pass it into the queryURL
    }
    
    var apikey = "AIzaSyBnSJK9UJlSfuLnLzo-85xDPDCRbjCHEM8";
    var queryURL = "https://www.googleapis.com/civicinfo/v2/representatives?address=" + address + "&key=" + apikey;
    // sets the api to a const and the queryURL to a variable

    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(response) {

        for (var k = 0; k < response.offices.length; k++) {

            var position = response.offices[k].name;
            // person's official position

            var officialInd = [];
            // create an empty array

            for (var m = 0; m < response.offices[k].officialIndices.length; m++) {

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

                if (!response.officials[indexofName].photoUrl) { 
                    var photo = "../../assets/images/nophoto.png";
                    // sets the picture url to one of our pictures
                    var officialPhoto = $("<img class='card-img-top img-fluid img-responsive profile-img'>").attr("src", photo);
                    // adds a img with a class card-img-top img-fluid img-responsive profile-img and sets the source to the officials photo from the civic information api
                }
                else {
                    var photo = response.officials[indexofName].photoUrl;
                    // person's photo src
                    var officialPhoto = $("<img class='card-img-top img-fluid img-responsive profile-img'>").attr("src", photo);
                    // adds a img with a class card-img-top img-fluid img-responsive profile-img and sets the source to the officials photo from the civic information api
                }

                var newOfficial = $("<div class='card profile-card'>");
                // creates a newOfficial variable with a class profile-card

                var wrapper = $("<div class='imgwrapper' id='"+ name +"' >");
                // adds a div with a class imgwrapper and an id with the officials name

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

        }

    })

})