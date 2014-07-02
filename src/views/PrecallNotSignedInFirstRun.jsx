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
            <Panel extraClass="LegalPanel" items={ this.props.items }>
              <NewCallViewQuick/>
              <div className="Legal">
                <p>By using this product, you agree to the <a href="https://accounts.firefox.com/en-us/legal/terms">Terms of Use</a> and <a href="https://accounts.firefox.com/en-us/legal/privacy">Privacy Notice</a>.</p>
              </div>
              <Footer linkText={STRINGS.signIn} username={STRINGS.loggedOutUsername}/>
            </Panel>
        </BaseState>
    );
  }
});
