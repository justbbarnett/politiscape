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
                    var posistion = response.offices[k].name;
                    // person's official position
           console.log(posistion);
                    var name = response.officials[k].name;
                    // person's name
                    var party = response.officials[k].party;
                    // person's political party
                    var photo = response.officials[k].photoUrl;
                    // person's photo src
                console.log(name +"---"+ party);
            }
        })
    
})