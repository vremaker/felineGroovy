// Name: Valerie Remaker
// Date: November 1st 2018
// Section: CSE 154 AD
//
// This is the javascript for my meme and cat content generator. It gets
// information from reddit and displays it on my own page!
//

(function() {
  "use strict";
  const URL_BASE = "https://www.reddit.com/r";
  let feedJSON;
  let catagory;
  window.addEventListener("load", initialize);

  /**
  *  Starts the function, and adds a click listener for content
  */
  function initialize() {
    $("search").addEventListener("click", setUpFeed);
  }

  /**
   * takes in user input on which content the user would like to see
   * and creates a custom feed based on that
   */
  function setUpFeed() {
    qs(".poop").classList.add("hidden");
    let feedType = qs('input[name = "feed"]:checked').value;
    let title = document.createElement("h2");
    if(feedType === "animals") {
      catagory = "/FromKittenToCat/";
    } else if(feedType == "memes") {
      catagory = "/memes/";
    }
    $("title").appendChild(title);
    makeRequest();
    $("more").addEventListener("click", more);
    $("home").addEventListener("click", reset);
  }

  /**
   * allows user to clear their feed, and look for a new topic
   */
  function reset() {
    $("content").innerHTML = '';
    $("error").innerHTML = '';
    qs(".poop").classList.remove("hidden");
    qs(".btns").classList.add("hidden");
  }

 /**
  * allows user to generate more random content for their page
  */
  function more() {
    for(let i = 0; i < 20; i++) {
      makeRandomRequest();
    }
  }

  /**
  *  makes a fetch request for information from the api, for the intial draw
  *  of api information
  */
  function makeRandomRequest() {
    let url = URL_BASE + catagory + "random/.json"; // if no params needed in request url
    fetch(url, {mode : "cors"})
    .then(checkStatus)
    .then(JSON.parse)       // uncomment if response returns JSON format instead of text
    .then(handleRandom)
    .catch(handleIt);
  }

  /**
  *  makes a fetch request for the randomly generated content that the user
  *  wants to add to their intial feed
  */
  function makeRequest() {
    let url = URL_BASE + catagory + ".json?limit=50";
    fetch(url, {mode : "cors"})
    .then(checkStatus)
    .then(JSON.parse)
    .then(successFunction)
    .catch(handleIt);
  }

  /**
  * finds the images from the called api and sets up the page with the requested
  * content
  * @param {JSON} responseData - the information gathered
  */
  function successFunction(responseData) {
    feedJSON = responseData;

    for(let i = 2; i < 50; i++) {
      let test = feedJSON.data.children[i].data.url;
     if(checkURL(test)) {
        let doc = document.createElement("div");
        doc.classList.add("displayMe");
        let title  = document.createElement("h3");
        let caption = document.createElement("h4");
        let image = document.createElement("img");
        caption.innerText = feedJSON.data.children[i].data.selftext;
        image.src = test;
        title.innerText = feedJSON.data.children[i].data.title;
        doc.appendChild(title);
        doc.appendChild(caption);
        doc.appendChild(image);
        $("content").appendChild(doc);
     }
    }
    qs(".btns").classList.remove("hidden");
  }

  /**
  * finds the images from the called api and sets up the page with the requested
  * content randomly
  * @param {JSON} responseData - the information gathered
  */
  function handleRandom(responseData) {
    let test = responseData[0].data.children[0].data.url;
    if(checkURL(test)) {
      let doc = document.createElement("div");
      doc.classList.add("displayMe");
      let title = document.createElement("h3");
      let body = document.createElement("h4");
      let image = document.createElement("img");
      title.innerText = responseData[0].data.children[0].data.title;
      body.innerText = responseData[0].data.children[0].data.selftext;
      image.src = test;
      image.alt = test;
      doc.appendChild(title);
      doc.appendChild(body);
      doc.appendChild(image);
      $("content").appendChild(doc);
    }
  }

  /**
   * handles errors with a gif about "we dont know what went wrong"
   * resets to the opening page
   */
  function handleIt() {
    let error = document.createElement("img");
    let text = document.createElement("p");
    text.innerText = "we're scratching our heads!";
    /*https://gifer.com/en/9j3U*/
    error.src = "error.gif";
    $("error").appendChild(error);
    $("error").appendChild(text);
    setTimeout(reset, 4000);
  }

  /**
   * checks to see if passed link is a link to an images
   * @param {string} url - the link we are checking
   * @return {boolean} - is the url an image?
   */
  function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
  }
  /* ------------------------------ Helper Functions  ------------------------------ */
  // Note: You may use these in your code, but do remember that your code should not have
  // any functions defined that are unused.

  /**
  * Returns the element that has the ID attribute with the specified value.
  * @param {string} id - element ID
  * @returns {object} DOM object associated with id.
  */
  function $(id) {
    return document.getElementById(id);
  }

  /**
  * Returns the first element that matches the given CSS selector.
  * @param {string} query - CSS query selector.
  * @returns {object} The first DOM object matching the query.
  */
  function qs(query) {
    return document.querySelector(query);
  }

  /**
  * Helper function to return the response's result text if successful, otherwise
  * returns the rejected Promise result with an error status and corresponding text
  * @param {object} response - response to check for success/error
  * @returns {object} - valid result text if response was successful, otherwise rejected
  *                     Promise result
  */
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300 || response.status == 0) {
      return response.text();
    } else {
      return Promise.reject(new Error(response.status + ": " + response.statusText));
    }
  }

})();
