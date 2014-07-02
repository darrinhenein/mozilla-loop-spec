/** @jsx React.DOM */
Marked = require('marked');

_users = require('./models/users.js');
STRINGS = require('./models/strings.js')
Utils = require('./utils/utils.js');
getTimeFromRange = Utils.getTimeFromRange;
TableOfContents = require('./views/TableOfContents.jsx');
NoteView = require('./views/NoteView.jsx');

PrecallNotSignedIn = require('./views/PrecallNotSignedIn.jsx');
PrecallNotSignedInQuick = require('./views/PrecallNotSignedInQuick.jsx');
PrecallNotSignedInFirstRun = require('./views/PrecallNotSignedInFirstRun.jsx');
PrecallSignedIn = require('./views/PrecallSignedIn.jsx');
PrecallSignedInQuick = require('./views/PrecallSignedInQuick.jsx');
CallHistory = require('./views/CallHistory.jsx');
InvitationManagement = require('./views/InvitationManagement.jsx');
InCallActive = require('./views/InCallActive.jsx');
InCallHold = require('./views/InCallHold.jsx');
InCallActiveAudio = require('./views/InCallActiveAudio.jsx');
ContactsDocked = require('./views/ContactsDocked.jsx');
ContactsView = require('./views/ContactsView.jsx');
IncomingCallView = require('./views/IncomingCallView.jsx');
IncomingCallUnknownView = require('./views/IncomingCallUnknownView.jsx');
OutgoingCallView = require('./views/OutgoingCallView.jsx');
StartCallView = require('./views/StartCallView.jsx');
StartCallUnavailableView = require('./views/StartCallUnavailableView.jsx');
StartCallAccountView = require('./views/StartCallAccountView.jsx');
LinkPromptView = require('./views/LinkPromptView.jsx');
Settings = require('./views/Settings.jsx');
FeedbackView = require('./views/FeedbackView.jsx');

moment.lang('en', {
  calendar : {
    lastDay : '[Yesterday at] LT',
    sameDay : '[Today at] LT',
    nextDay : '[Tomorrow at] LT',
    lastWeek : 'l [at] LT',
    nextWeek : 'l [at] LT',
    sameElse : 'L'
  }
});

var states = [
  {
    name: 'Precall (First Run)',
    view: PrecallNotSignedInFirstRun,
    tab: 0,
    slug: 'precall-firstrun'
  },
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
    name: 'Error Bar',
    view: PrecallSignedInQuick,
    tab: 0,
    slug: 'error',
    error: 'error'
  },
  {
    name: 'Warning Bar',
    view: PrecallSignedInQuick,
    tab: 0,
    slug: 'warning',
    error: 'warning'
  },
  {
    name: 'Contacts',
    view: ContactsView,
    tab: 2,
    slug: 'contacts'
  },
  {
    name: 'Call History',
    view: CallHistory,
    tab: 1,
    slug: 'callhistory'
  },
  {
    name: 'Settings',
    view: Settings,
    slug: 'settings'
  },
  {
    name: 'In Call (Video)',
    view: InCallActive,
    tab: 1,
    slug: 'call-active'
  },
  {
    name: 'In Call (on Hold)',
    view: InCallHold,
    tab: 1,
    slug: 'call-hold'
  },
  {
    name: 'In Call (Audio)',
    view: InCallActiveAudio,
    tab: 1,
    slug: 'call-active-audio'
  },
  {
    name: 'Incoming Call',
    view: IncomingCallView,
    tab: 1,
    slug: 'call-incoming'
  },
  {
    name: 'Incoming Call (Link, Unlabelled)',
    view: IncomingCallUnknownView,
    tab: 1,
    slug: 'call-incoming-unknown'
  },
  {
    name: 'Outgoing Call',
    view: OutgoingCallView,
    tab: 1,
    slug: 'call-outgoing'
  },
  {
    name: 'Call Failed/Link Prompt',
    view: LinkPromptView,
    tab: 1,
    slug: 'link-prompt'
  },
  {
    name: 'Start Call (link from accountless)',
    view: StartCallView,
    tab: 1,
    slug: 'start-call'
  },
  {
    name: 'Start Call (link from Loop user)',
    view: StartCallAccountView,
    tab: 1,
    slug: 'start-call-account'
  },
  {
    name: 'Link Clicked (URL unavailable)',
    view: StartCallUnavailableView,
    tab: 1,
    slug: 'start-call-unavailable'
  },
  {
    name: 'Feedback Form',
    view: FeedbackView,
    tab: 1,
    slug: 'feedback'
  }
];

setTimeout(function(){
  React.renderComponent(<TableOfContents items={states} />, $('#toc')[0]);
  _.each(states, function(state, index){

    var el = $('<div/>', {
      class: 'component-wrapper',
      id: state.slug
    })[0];

    var viewEl = $('<div/>', {
      class: 'View'
    })[0];

    var noteEl = $('<div/>', {
      class: 'NoteWrapper'
    })[0];

    $(el).append(viewEl);

    $('#wrapper').append(el);

    var View = state.view
    $.get('./notes/' + state.slug + '.md').success(function(data){
      React.renderComponent(<View items={_users} error={state.error} index={index} tab={state.tab} name={state.name} slug={state.slug} />, viewEl);
      var notes = Marked(data);
      $(el).append(noteEl)
      React.renderComponent(<NoteView note={notes} />, noteEl);
    }).error(function(error){
      React.renderComponent(<View items={_users} error={state.error} index={index} tab={state.tab} name={state.name} slug={state.slug} />, viewEl);
    });
  })

  $('.tip').tipr({
    mode: 'top',
    speed: 200
  });
}, 100);
