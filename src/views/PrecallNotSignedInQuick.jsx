/** @jsx React.DOM */
BaseState = require('./BaseState.jsx');
TabBar = require('./TabBar.jsx');
Panel = require('./Panel.jsx');
HeaderQuick = require('./HeaderQuick.jsx');
NewCallViewQuick = require('./NewCallViewQuick.jsx');
Footer = require('./Footer.jsx');

module.exports = React.createClass({
  render: function() {
    return (
        <BaseState name={ this.props.name } index={ this.props.index }>
          <TabBar selected={this.props.tab} disabled="[1,2]" />
            <Panel items={ this.props.items }>
              <NewCallViewQuick/>
              <Footer linkText={STRINGS.signIn} username={STRINGS.loggedOutUsername}/>
            </Panel>
        </BaseState>
    );
  }
});
