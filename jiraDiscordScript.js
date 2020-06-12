function doPost(request) {
    var urlDiscordWebhook = "ADD THE LINK FROM DISCORD WEBHOOK HERE";

    // get the sting value of the data sent from Jira
    var postJSON = request.postData.getDataAsString();

    //turn this string in an object
    var jiraObject = JSON.parse(postJSON);

    //get some data that interests you from the jira object 
    var eventType = jiraObject.webhookEvent;
    var userDisplayName = jiraObject.user.displayName;
    var ticketNum = jiraObject.issue.key;
    var ticketDescription = jiraObject.issue.fields.summary;

    //this is just so we can easily post a link to the ticket
    var jiraURL = "ADD YOUR JIRA URL HERE"; //should be something like https://myawesomeproject.atlassian.net/browse/
    var message = '';

    //no depending on what type of an event it is (ticket created, modified or deleted) we will post different messages in the discord channel
    if (eventType == 'jira:issue_created') {
        message = message + 'User ' + userDisplayName + ' has created Jira Ticket ' + ticketNum + ': \n [' + ticketDescription + '](' + jiraURL + ticketNum + ')';
    } else
    if (eventType == 'jira:issue_deleted') {
        message = message + 'User ' + userDisplayName + ' has deleted Jira Ticket ' + ticketNum + ': \n [' + ticketDescription + '](' + jiraURL + ')';
    } else {
        message = message + 'User ' + userDisplayName + ' has made a change to Jira Ticket ' + ticketNum + ': \n [' + ticketDescription + '](' + jiraURL + ticketNum + ')';
    }

    //turn the message into a JSON string
    var messageJson = JSON.stringify({ content: message });

    var options = {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        payload: messageJson

    };

    var response = UrlFetchApp.fetch(url, options);
}