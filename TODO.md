## Todo



## Database Schema

Users
 - name
 - roles [] // may want multiple roles - eg user / admin / user + admin combo?
 - profile pic
 - projects / departments
 

 Roles
  - _id
  - role name

Issue
 - created by
 - severity
 - open / closed
 - project / department ? 
 - assignees
 - message_id



Messages:
 - timestanmp
 - content
 - attachments


 

Actions:
 - 



how do we do the timeline? is it a linked list, timestamps - show actions history / when user added to project, tags updated, messages added etc?
how to provide notifications on actions, etc?




example issue

* Contact Page Shows Incorrect Phone Number -open *severity-moderate* #tag1 #tag2
- Submitted by: User1
- Message: The number should be 123456 not 12456
- Attachments

  |
  | - User1 added the x label
  |
  | - User3 is assigned to this issue
  | 
  |
- User3 wrote:
  - message



ISSUE -> message -> action -> 



node.js set up done with 
https://www.youtube.com/watch?v=H91aqUHn8sE

