// NYT API
var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=96a8c512eae346c58a56d7649ea2eef2";
queryURL += ('&q="' +'Greg Abbott' + '"')
queryURL += "&news_desk:('Politics')&sort=newest"



$.get(queryURL)
    .then(function (response) {
        console.log(response)
        $(".headlines").html("<p>NYT Headlines: </p>")
        for (var i = 0; i < 3; i++) {
            $(".headlines").append("<a target='_blank' href='" + response.response.docs[i].web_url + "'>" + response.response.docs[i].headline.main + "</a><br>")
            // $(".headlines").append("<a target='_blank' href='" + response.articles[i].url + "'>" + response.articles[i].title + "</a><br>")
        }

    })

// News API
// // var queryURL = 'https://newsapi.org/v2/top-headlines?' +
// //     'q=comey&' +
// //     'sources=associated-press&' +
// //     'sortBy=popularity&' +
// //     'pageSize=3&' + 
// //     'apiKey=3e728247fce1421ea56b60d55ffa9e94';

//     var name = 'name name';
//     var nameSplit = [];

// // Split the letters of the word up and add them to an array, and create array with letters hidden
// for (var i = 0; i < name.length; i++) {
//     nameSplit.push(name[i])
    
// }
// console.log(nameSplit)