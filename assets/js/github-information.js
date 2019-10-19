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


function fetchGitHubInformation(event) {
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
        $.getJSON(`https://api.github.com/users/${username}`)
    ).then(
        // First argument is the response that came back from our getJSON() method.
        function(response) {
            var userData = response;
            // Another function called userInformationHTML.
            $("#gh-user-data").html(userInformationHTML(userData));
        }, function (errorResponse) {
            // If the errorResponse.status === 404, then select our gh-user-data div
            // and set its HTML to an error message that says the user wasn't found.
            if (errorResponse.status === 404) {
                $("#gh-user-data").html(`<h2>No info found for user ${username}</h2>`);
            } else {
                console.log(errorResponse);
                $("#gh-user-data").html(`<h2>Error: ${errorResponse}</h2>`);
            }
        });
}