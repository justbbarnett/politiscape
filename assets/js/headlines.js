var queryURL = 'https://newsapi.org/v2/top-headlines?' +
    'q=trump&' +
    'sources=associated-press&' +
    'sortBy=popularity&' +
    'pageSize=3&' + 
    'apiKey=3e728247fce1421ea56b60d55ffa9e94';

var newsLink;

$.get(queryURL)
    .then(function (response) {
        $(".headlines").html("<p>AP News Headlines: </p>")
        for (var i = 0; i <=3 ; i++){
        
        $(".headlines").append("<a target='_blank' href='" + response.articles[i].url + "'>" + response.articles[i].title + "</a><br>")
        
        console.log(response)
    }

    })

