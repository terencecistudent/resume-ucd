/*-----------------------------------------------------function userInformationHTML------*/
// user is the object that's been returned from the GitHub API.
function userInformationHTML(user) {
    return `
        <h2>${user.name}
            <span class="small-name"</span>
                (@<a href="${user.html_url}" target = "_blank">${user.login}</a>)
            </span>
        </h2>
        <div class="gh-content">
            <div class="gh-avatar">
                <a href="${user.html_url}" target="_blank">
                    <img src="${user.avatar_url}" width="80" height="80 alt="${user.login}"/>
                </a>
            </div>
            <p>Followers: ${user.followers} - Following ${user.following} <br> Repos:${user.public_repos}</p>
        </div>`;
}


/*-----------------------------------------------------function repoInformationHTML------*/
// Takes one argument, which is repos, the object returned from our GitHub API.
function repoInformationHTML(repos) {
    if (repos.length == 0) {
        return `<div class="clearfix repo-list">No repos!</div>`
    }

    // If data has been returned, then since it's an array, we want to
    // iterate through it and get that information out.
    var listItemsHTML = repos.map(function(repo) {
        return `<li>
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                </li>`;
    });

    // map() returns an array - going to do is use the join() method
    // on that array and join everything with a new line.
    return `<div class="clearfix repo-list">
                <p>
                    <strong>Repo List:</strong>
                </p>
                <ul>
                    ${listItemsHTML.join("\n")}
                </ul>
            </div>`;
}



/*-----------------------------------------------------function fetchGitHubInformation------*/
function fetchGitHubInformation(event) {
    // Setting their HTML content to an empty string has the effect of emptying these divs.
    $("#gh-user-data").html("");
    $("#gh-repo-data").html("");

    // val() - value in the text field.
    var username = $("#gh-username").val();

    if (!username) {
        $("#gh-user-data").html(`<h2>Please enter a GitHub username</h2>`);
        return;
    }

    $("#gh-user-data").html(
        `<div id="loader">
            <img src="assets/css/loader.gif" alt="loading..."/>
        </div>`);

    // Issuing a promise.
    // when() takes function as first argument - is getJSON.
    $.when(
        $.getJSON(`https://api.github.com/users/${username}`),
        $.getJSON(`https://api.github.com/users/${username}/repos`)
    ).then(
        // When we do two calls like this, the when() method packs a response up into arrays.
        function(firstResponse, secondResponse) {
            var userData = firstResponse[0];
            var repoData = secondResponse[0];

            // Another function called userInformationHTML.
            // A second function called repoInformationHTML.
            $("#gh-user-data").html(userInformationHTML(userData));
            $("#gh-repo-data").html(repoInformationHTML(repoData));
        }, function (errorResponse) {
            // If the errorResponse.status === 404, then select our gh-user-data div
            // and set its HTML to an error message that says the user wasn't found.
            if (errorResponse.status === 404) {
                $("#gh-user-data").html(`<h2>No info found for user ${username}</h2>`);
            } else if (errorResponse.status === 403) {
                // toLocaleDateString() method - pick up your location from your browser and print the local time.
                var resetTime = new Date(errorResponse.getResponseHeader('X-RateLimit-Reset') * 1000);
                $("#gh-user-data").html(`<h4>Too many requests, please wait until ${resetTime.toLocaleTimeString()}</h4>`);
            } else {
                console.log(errorResponse);
                $("#gh-user-data").html(`<h2>Error: ${errorResponse}</h2>`);
            }
        });
}

// Displaying Octocat instead of an empty div.
$(document).ready(fetchGitHubInformation);