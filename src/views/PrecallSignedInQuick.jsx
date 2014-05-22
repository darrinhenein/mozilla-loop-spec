/** @jsx React.DOM */
BaseState = require('./BaseState.jsx');
TabBar = require('./TabBar.jsx');
Panel = require('./Panel.jsx');
HeaderQuick = require('./HeaderQuick.jsx');
Footer = require('./Footer.jsx');
NewCallView = require('./NewCallView.jsx');

module.exports = React.createClass({
  render: function() {
    return (
        <BaseState name={ this.props.name } index={ this.props.index }>
          <TabBar selected={this.props.tab} />
          <Panel extraClass="Contacts" items={ this.props.items }>
            <NewCallViewQuick/>
            <BuddyList items={this.props.items} />
            <Footer linkText={STRINGS.signOut} username={STRINGS.loggedInUsername}/>
          </Panel>
        </BaseState>
    );
  }
});
