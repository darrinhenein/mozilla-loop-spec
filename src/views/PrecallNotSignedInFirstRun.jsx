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
          <TabBar selected={this.props.tab} />
            <Panel extraClass="LegalPanel" items={ this.props.items }>
              <div className="Legal">
                <p>By proceeding, you accept the <a href="https://accounts.firefox.com/en-us/legal/terms">Terms and Services</a> and <a href="https://accounts.firefox.com/en-us/legal/privacy">Privacy Notice</a>.</p>
                <Button text="OK" id="legal-ok-button" style="default" />
              </div>
              <NewCallViewQuick/>
              <Footer linkText={STRINGS.signIn} username={STRINGS.loggedOutUsername}/>
            </Panel>
        </BaseState>
    );
  }
});
