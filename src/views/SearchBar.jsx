/** @jsx React.DOM */
module.exports = React.createClass({
  render: function(){
    return (
      <div className="SearchBarWrapper">
        <input ref="searchInput" className="SearchBar" value={this.props.val} onChange={this.props.handleChange} placeholder={STRINGS.searchPlaceholder}/>
        <i className="fa fa-book tip" data-tip="Add, Import Contacts"></i>
      </div>
    )
  }
});
