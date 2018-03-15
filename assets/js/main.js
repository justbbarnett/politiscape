$("form").on("submit", function(e) {
    e.preventDefault();
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
            for (var k = 0; k < response.offices.length; k++) {
                var position = response.offices[k].name;
                // person's official position
                console.log(position);
                var name = response.officials[k].name;
                // person's name
                var party = response.officials[k].party;
                // person's political party
                var photo = response.officials[k].photoUrl;
                // person's photo src
                console.log(name +"---"+ party);
            
        
                var newOfficial = $("<div class='card profile-card'>");
                //creates a newOfficial variable with a class profile-card

                var wrapper = $("<div class='imgwrapper' id='"+ name +"' >");
                //

                var officialPhoto = $("<img class='card-img-top img-fluid img-responsive profile-img'>").attr("src", photo);
                //

                var officialName = $("<h5 class='card-title'>").text(name);
                //

                var officialPosition = $("<p class='card-text text-muted'>").text(position + " --- " + party);
                //

                var officialSocialDiv = $("<div class='social-links' id='"+ name +"'>").text();//for loop here
                //

                wrapper.append(officialPhoto);
                //

                newOfficial.append(wrapper)
                           .append(officialName)
                           .append(officialPosition)
                           .append(officialSocialDiv);
                //adds the new elements to the newOfficial

                $(".scrolling-profiles").append(newOfficial);
                // dynamically creates new cards with official data
            }
        
        })
    
})