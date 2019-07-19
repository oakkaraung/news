$.getJSON("/articles", (data) => {
    for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        $(".article-container").append(`<div class="card">`);
        $(".article-container").append(`<div class="card-header"> <h3> <a class="article-link" target="_blank" rel="noopener noreferrer" href="${data[i].link}">${data[i].title}</a><a data-saved= ${data[i].saved} data-id= ${data[i]._id} class="btn btn-success save">Save Article</a></h3></div>`);
        $(".article-container").append(`<div class="card-body">${data[i].summary}</div></div>`);
    }
})

$(document).on("click", ".save", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    var thisSaved = Boolean($(this).attr("data-saved"));
    thisSaved = !thisSaved
    console.log(thisSaved);

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId,
        data: {
            saved: thisSaved
        }
    })
        .then((data) => {
            console.log(data);
            console.log("this ran")
        });
});

$(document).on("click", ".saved", function() {
    $.ajax({
        method: "GET",
        url: "/saved",
    }).then(data => {
        console.log(data);
    })
})