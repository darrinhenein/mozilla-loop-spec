/** @jsx React.DOM */
_users = require('./models/users.js');
STRINGS = require('./models/strings.js')
Utils = require('./utils/utils.js');
getTimeFromRange = Utils.getTimeFromRange;
TableOfContents = require('./views/TableOfContents.jsx');

PrecallNotSignedIn = require('./views/PrecallNotSignedIn.jsx');
PrecallNotSignedInQuick = require('./views/PrecallNotSignedInQuick.jsx');
PrecallSignedIn = require('./views/PrecallSignedIn.jsx');
PrecallSignedInQuick = require('./views/PrecallSignedInQuick.jsx');
CallHistory = require('./views/CallHistory.jsx');
InvitationManagement = require('./views/InvitationManagement.jsx');
InCallActive = require('./views/InCallActive.jsx');
ContactsDocked = require('./views/ContactsDocked.jsx');
IncomingCallView = require('./views/IncomingCallView.jsx');

var states = [
  {
    name: 'Precall (Not Signed In)',
    view: PrecallNotSignedInQuick,
    tab: 0,
    slug: 'precall'
  },
  {
    name: 'Precall (Signed In)',
    view: PrecallSignedInQuick,
    tab: 0,
    slug: 'precall-signedin'
  },
  {
    name: 'Call History',
    view: CallHistory,
    tab: 1,
    slug: 'callhistory'
  },
  {
    name: 'Invitation Management',
    view: InvitationManagement,
    tab: 2,
    slug: 'invitationlist'
  },
  {
    name: 'Contacts (Docked)',
    view: ContactsDocked,
    tab: 0,
    slug: 'contacts-docked'
  },
  {
    name: 'In Call (Active)',
    view: InCallActive,
    tab: 1,
    slug: 'call-active'
  },
  {
    name: 'Incoming Call',
    view: IncomingCallView,
    tab: 1,
    slug: 'call-incoming'
  }
];

setTimeout(function(){
  React.renderComponent(<TableOfContents items={states} />, $('#toc')[0]);
  _.each(states, function(state, index){

      var el = $('<div/>', {
        class: 'component-wrapper',
        id: state.slug
      })[0];

      $('#wrapper').append(el);

      var View = state.view

      React.renderComponent(<View items={_users} index={index} tab={state.tab} name={state.name} />, el);
      $('.tip').tipr({
        mode: 'top',
        speed: 200
      });

      $('.TableOfContents').ddscrollSpy({
        scrollduration: 0
      });

  })
}, 100);
