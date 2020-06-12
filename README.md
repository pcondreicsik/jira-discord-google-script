# Jira to Discord Notifications


These are instructions for setting up a discord bot that posts changes to a specific jira board as messages to a discord channel.
I am using google scripts for formatting. It's free, and relatevly easy to setup.

## Discord part

1. Create a webhook for the channel you want the bot to post

* Open the Server Settings and select the Webhook tab 

![Discord Webhook Tag](https://support.discord.com/hc/article_attachments/360007455811/1_.jpg)

* Click the button to create a new webhook

![alt text](https://support.discord.com/hc/article_attachments/360007455831/2_.jpg)

* Customize your Webhook
    * __Edit the avatar__ : Click on the image next to the Webhook name.
    * __Name your Webhook__ : It's helpful to give it a distinct name so you know what the bot does.
    * __Choose in which channel the Webhook will post__ : The bot will post the updates in this channel.

2. Copy the Webhook URL

We will need this one later. Don't worry, you can open the Webhook anytime to copy the link.

## Google Script part

1. Create a script

* Go to [Google Scripts](https://script.google.com/home) and create a new project

You will need to have a google account for this.

![Create new Project](/images/newproject.png)

2. Add following code

```javascript
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
      message = message + 'User ' + userDisplayName + ' has deleted Jira Ticket ' + ticketNum + ': \n [' + ticketDescription + '](' + jiraURL +')';
    } else {
      message = message + 'User ' + userDisplayName + ' has made a change to Jira Ticket ' + ticketNum + ': \n [' + ticketDescription + '](' + jiraURL + ticketNum + ')';
    }
  
  //turn the message into a JSON string
  var messageJson = JSON.stringify({content: message});
  
  var options = {
    method: "post",
    headers: {"Content-Type": "application/json"
    },
    payload: messageJson
    
  };

  var response = UrlFetchApp.fetch(url, options);  
}
```