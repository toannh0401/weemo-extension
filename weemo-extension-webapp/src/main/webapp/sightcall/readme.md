### Multi Party Step 1: Simple Auto-Accept Multi Party Call


>Warning: Do not forget to have your configuration (tokens, web hosting, etc.) set up as described [in the main MD fo the repository](https://github.com/sightcall/multiparty-js-sample/blob/master/readme.md). **Do not forget to modify the code to add your applicationId as well as your own URL to get a token.**  

#### Summary

The Step 1 is the starting point for the Example.  
In that step the Host (host.html) creates a meeting point and then hosts it. The meeting point id is shown on the page.  
The Attendee (attendee1.html) has a field to fill the meeting point id and clicks the join button to join the conference once it is hosted.

####Implementation

#####On Host side

- The javascript code to create the meeting point is located in the ```create()``` function.

- Once created and saved in the cloud, the host is notified through the ```onConfCallHandler()``` function. At that point the meetingPoint.id contains the id of the meeting point. It is immediately set to autoaccept mode in the handler.

- The javascript code to host the conference is located in the ```host()```function.

#####On Attendee side

- The javascript code to join the conference is located in the ```join()``` function.

