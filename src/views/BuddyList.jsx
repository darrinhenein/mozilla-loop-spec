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
      selectedIndex: -1
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
        return <ProfileDetail onClick={onClick} key={index} user={item} selected={isSelected} />
      } else {
        return <Profile onClick={onClick} key={index} user={item} selected={isSelected} />
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

    return (
      <div className={"List " + (this.props.faded ? 'faded': '')}>
          <SearchBar isOpen={this.state.isOpen} onClick={this.togglePanel} ref="filterSearchBar" val={this.state.filterText} handleChange={this.handleChange} />
          <ul className="scrollable">
           {shownItems.map(viewForItem)}
          </ul>
      </div>
    )
  }
});
