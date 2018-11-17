'use strict';

chrome.runtime.onInstalled.addListener(function() {
  //Notify user extension has been installed
  alert('News Tab has been installed.')
});


document.addEventListener('DOMContentLoaded', function() {
  //Generate today's current date and time
  const event = new Date();

  const dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  document.getElementById('dateDisplay').textContent =
    'Today is ' + event.toLocaleDateString('en-US', dateOptions);

  const timeOptions = {
    hour: 'numeric',
    minute: 'numeric',
  };
  document.getElementById('timeDisplay').textContent =
      event.toLocaleTimeString('en-US', timeOptions);

  //Obtain data from News API
  const url = 'https://newsapi.org/v2/top-headlines?' +
            'country=us&' +
            'apiKey=b21387080dd44acea4d4814d688da184';
  const req = new Request(url);
  fetch(req).then(function(response){
    response.json().then(function(json){
      const articles = json.articles;
      //Generate three random articles
      const indexset = new Set();
      let i;
      while (indexset.size <3){
        let ind = Math.floor(Math.random()*(articles.length));
        let art = articles[ind];
        if (art.urlToImage != null &&
        art.source.name != null &&
        art.url != null &&
        art.title != null){
          indexset.add(ind);
        }
      }
      //Create a section for each news article
      let j;
      let uniqueID = 1;
      for (j of indexset){
        let art = articles[j];
        let division = document.createElement('div');
        division.id = uniqueID;
        uniqueID++;

        let link = document.createElement('a');
        link.href = art.url;
        let img = document.createElement('IMG');
        img.src = art.urlToImage;
        link.appendChild(img);

        let nameText = document.createElement('h1');
        let t = document.createTextNode(art.title);
        nameText.appendChild(t);

        let sourceText = document.createElement('h2');
        let s = document.createTextNode(art.source.name);
        sourceText.appendChild(s);

        division.appendChild(link);
        division.appendChild(nameText);
        division.appendChild(sourceText);

        document.getElementById('news').appendChild(division);
      }
    }).catch(function(err) {
      //Print text in case of error
      const error1 = document.createElement('h1');
      const error1Text = document.createTextNode('Oops! Could not fetch news.');
      error1.appendChild(error1Text);
      document.getElementById('news').appendChild(error1);
    });
  });
});
