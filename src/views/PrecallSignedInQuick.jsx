/** @jsx React.DOM */
BaseState = require('./BaseState.jsx');
TabBar = require('./TabBar.jsx');
Panel = require('./Panel.jsx');
HeaderQuick = require('./HeaderQuick.jsx');
Footer = require('./Footer.jsx');
NewCallView = require('./NewCallView.jsx');
ErrorBar = require('./ErrorBar.jsx');

module.exports = React.createClass({
  render: function() {
    var view, errorView;
    if(this.props.error)
    {
      errorView = <ErrorBar type={ this.props.error } />;
    } else
      {
        view = <BuddyList items={this.props.items} delegate={this} noBlocked />
      }
    return (
        <BaseState name={ this.props.name } index={ this.props.index }>
          <TabBar selected={this.props.tab} />
          { errorView }
          <Panel extraClass="Contacts" items={ this.props.items }>
            <NewCallViewQuick/>
            { view }
            <Footer linkText={STRINGS.signOut} username={STRINGS.loggedInUsername}/>
          </Panel>
        </BaseState>
    );
  }
});
