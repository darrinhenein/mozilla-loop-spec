/** @jsx React.DOM */
BaseState = require('./BaseState.jsx');
PanelGroup = require('./PanelGroup.jsx');
TabBar = require('./TabBar.jsx');
Panel = require('./Panel.jsx');
Header = require('./Header.jsx');
Footer = require('./Footer.jsx');
NewCallView = require('./NewCallView.jsx');

module.exports = React.createClass({
  render: function() {
    return (
        <BaseState name={ this.props.name } index={ this.props.index }>
          <TabBar selected={this.props.tab} />
          <PanelGroup>
            <Panel items={ this.props.items }>
              <Header username={STRINGS.loggedOutUsername} editText={STRINGS.changeUsername} slideTo={this.props.slideTo}/>
              <Footer linkText={STRINGS.signIn}/>
            </Panel>
            <Panel items={ this.props.items }>
               <NewCallView/>
            </Panel>
          </PanelGroup>
        </BaseState>
    );
  }
});