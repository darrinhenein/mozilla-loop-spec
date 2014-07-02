/** @jsx React.DOM */
BaseState = require('./BaseState.jsx');
TabBar = require('./TabBar.jsx');
Panel = require('./Panel.jsx');
HeaderQuick = require('./HeaderQuick.jsx');
Footer = require('./Footer.jsx');
NewCallView = require('./NewCallView.jsx');

module.exports = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function(){
    return {
      isVisible: false
    }
  },
  openView: function(){
    $(this.refs.newContactView.getDOMNode()).css({display: 'flex'});
  },
  closeView: function(){
    $(this.refs.newContactView.getDOMNode()).hide();
  },
  toggleView: function(){
    this.setState({
      isVisible: !this.state.isVisible
    });
    if(this.state.isVisible) {
      this.closeView();
    } else {
      this.openView();
    }
  },
  componentDidMount: function(){
    this.closeView();
  },
  addContact: function(){
    this.toggleView();
    this.setState({
      name: '',
      email: ''
    });
    if(!this.state.name || !this.state.email ) return;
    var contact = {
      name: this.state.name,
      email: this.state.email
    };

    this.props.items.push(contact);
  },
  panelOpened: function(){
    $(this.refs.buttons.getDOMNode()).hide();
  },
  panelClosed: function(){
    $(this.refs.buttons.getDOMNode()).show();
  },
  render: function() {
    return (
      <BaseState name={ this.props.name } index={ this.props.index }>
        <TabBar selected={this.props.tab} />
        <Panel extraClass="Contacts" items={ this.props.items }>

          <div ref="buttons" className="ContactManagement">
            <div className="Header">
              <div>{STRINGS.contactManagement}</div>
            </div>

            <div className="ContactManagementView">
              <div className="ButtonGroup">
                <Button id="import-contacts" text="Import Contacts" style="default"/>
                <Button text="New Contact" onClick={this.toggleView} style={this.state.isVisible ? 'default-active' : 'default'}/>
              </div>

              <div className="NewContactView" ref="newContactView">
                <hr />
                <input valueLink={this.linkState('name')} placeholder="Name" />
                <input valueLink={this.linkState('email')} placeholder="Email" />
                <div className="ButtonGroup">
                  <Button onClick={this.addContact} text="Add Contact" style="action"/>
                </div>
              </div>
            </div>
          </div>

          <BuddyList delegate={this} faded={this.state.isVisible ? true : false} items={this.props.items} detail="true"/>
          <Footer linkText={STRINGS.signOut} username={STRINGS.loggedInUsername}/>
        </Panel>
      </BaseState>
    );
  }
});
