/** @jsx React.DOM */
SearchBar = require('./SearchBar.jsx');
Profile = require('./Profile.jsx');
ProfileDetail = require('./ProfileDetail.jsx');
Button = require('./Button.jsx');
Defaults = require('../utils/defaults');

module.exports = React.createClass({
  getInitialState: function(){
    return {
      filterText: '',
      selectedIndex: -1,
      isOpen: false
    }
  },
  handleChange: function(){
    this.setState(
      {
        filterText: this.refs.filterSearchBar.refs.searchInput.getDOMNode().value,
        selectedIndex: 0
      }
    );
  },
  openPanel: function(){
    $(this.refs.listSlider.getDOMNode()).velocity({
      translateX: '-50%'
    }, Defaults.animation);
  },
  closePanel: function(){
    $(this.refs.listSlider.getDOMNode()).velocity({
      translateX: '0'
    }, Defaults.animation);
  },
  togglePanel: function(e){
    this.setState({
      isOpen: !this.state.isOpen
    });

    if(!this.state.isOpen) {
      this.openPanel();
    } else {
      this.closePanel();
    }
  },
  render: function(){
    var onClick = function(idx){
      this.setState(
        {
          selectedIndex: idx
        }
      );
    }.bind(this);

    var viewForItem = function(item, index){
      var isSelected = (this.state.selectedIndex === index) ? 'selected' : null;
      if(this.props.detail) {
        return <ProfileDetail onClickEdit={this.togglePanel} onClick={onClick} key={index} user={item} selected={isSelected} />
      } else {
        return <Profile onClickEdit={this.togglePanel} onClick={onClick} key={index} user={item} selected={isSelected} />
      }
    }.bind(this);

    var shownItems = this.props.items;

    if(this.state.filterText !== '')
    {
      var filter = this.state.filterText.toUpperCase();
      shownItems = _.filter(this.props.items, function(i){
        return (i.name.toUpperCase().indexOf(filter) !== -1)
      });
    }

    var contact = this.props.items[this.state.selectedIndex] || { name: '', email: ''};

    return (
      <div ref="listSlider" className="ListPanels">
        <div className={"List " + (this.props.faded ? 'faded': '')}>
            <SearchBar isOpen={this.state.isOpen} onClick={this.togglePanel} ref="filterSearchBar" val={this.state.filterText} handleChange={this.handleChange} />
            <ul className="scrollable">
             {shownItems.map(viewForItem)}
            </ul>
        </div>
        <div className="EditContact">
          <div className="Header">Edit Contact</div>
          <div className="Form">
            <label>Name</label>
            <input defaultValue={contact.name} />
            <label>Email</label>
            <input defaultValue={contact.email} />
            <Button text="Done" onClick={this.togglePanel} style="action"/>
          </div>
        </div>
      </div>
    )
  }
});
