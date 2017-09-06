import React, { Component } from 'react';
import $ from 'jquery';
import update from 'immutability-helper';

class Users extends Component {
  constructor(props){
      super(props);
      this.state = {
          list: [], 
          nowChoose: 0,
          addName: "",
          addUsername: "", 
          addEmail: "",
          editName: "",
          editUsername: "",
          editEmail: ""
      };

      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleEditSubmit = this.handleEditSubmit.bind(this);
      this.handleSelectClicked = this.handleSelectClicked.bind(this);
      this.handleDeleted = this.handleDeleted.bind(this);
  }

  componentWillMount(){
      this.loadDataFromServer();
  }

  loadDataFromServer(){
      $.ajax({
          url: "http://jsonplaceholder.typicode.com/users",
          data: {},
          type: "GET",
          dataType: "json",
          success: function(data) {
              if(data === 0){
                console.log(data);
              }else{
                this.setState({list: data});
              }
          }.bind(this),
          error: function(xhr, status, err) {
              console.log(xhr.status);
              console.log(err);
          }
      });
  }

  addDataToServer(){
      var addName = this.state.addName;
      var addUsername = this.state.addUsername;
      var addEmail = this.state.addEmail;

    $.ajax({
          url: "http://jsonplaceholder.typicode.com/users",
          data: {
            name: addName,
            username: addUsername,
            email: addEmail
          },
          type: "POST",
          dataType: "json",
          success: function(data) {
              console.log(data);
              var addedList = this.state.list.slice();
              addedList.push(data);
              console.log(addedList);
              this.setState({list: addedList});
              this.cleanAddInput();
              /*if(data === 0){
                console.log(data);
              }else{
                this.setState({list: data});
              }*/
          }.bind(this),
          error: function(xhr, status, err) {
              console.log(xhr.status);
              console.log(err);
          }
      });
  }

  updateDataToServer(){
      var nowChoose = this.state.nowChoose;
      var editName = this.state.editName;
      var editUsername = this.state.editUsername;
      var editEmail = this.state.editEmail;
      const initialArray = this.state.list;

    $.ajax({
          url: "http://jsonplaceholder.typicode.com/users/"+nowChoose,
          data: {
              id: nowChoose,
            name: editName,
            username: editUsername,
            email: editEmail
          },
          type: "POST",
          method: 'PUT',
          dataType: "json",
          success: function(data) {
              const newData = update(initialArray,{$merge: {[nowChoose-1]: data}});
              this.setState({list: newData});
          }.bind(this),
          error: function(xhr, status, err) {
              console.log(xhr.status);
              console.log(err);
          }
      });
  }

  deleteDataFrom(id){
    //console.log(id);
    var initialArray = this.state.list;
    var index = initialArray.findIndex(function(obj){
            return obj['id'] === id; 
        });
    //console.log(index);    
    $.ajax({
          url: "http://jsonplaceholder.typicode.com/users/"+id,
          type: "POST",
          method: 'DELETE',
          dataType: "json",
          success: function(data) {
              //console.log(data);
            const newData = initialArray.splice(index, 1);
            this.setState({list: initialArray});
            console.log(this.state.list);
            this.cleanSelected();
          }.bind(this),
          error: function(xhr, status, err) {
              console.log(xhr.status);
              console.log(err);
          }
    });

    /*$.ajax('http://jsonplaceholder.typicode.com/users/'+id, {
      method: 'DELETE'
    });*/
  }

  cleanSelected(){
    this.setState({nowChoose: ""});
    this.setState({editName: ""});
    this.setState({editUsername: ""});
    this.setState({editEmail: ""});
  }

  cleanAddInput(){
    this.setState({addName: ""});
    this.setState({addUsername: ""});
    this.setState({addEmail: ""});
  }

  handleSelectClicked(user){
    this.setState({nowChoose: user.id});
    this.setState({editName: user.name});
    this.setState({editUsername: user.username});
    this.setState({editEmail: user.email});
  }

  handleDeleted(id){
      this.deleteDataFrom(id);
      event.preventDefault();
  }

  handleInputChange(event){
      const target = event.target;
      const value = target.value.toString();
      const name = target.name;

      this.setState({[name]: value });
  }

  handleSubmit(event){
      this.addDataToServer();
      event.preventDefault();
  }

  handleEditSubmit(event){
    this.updateDataToServer();
    event.preventDefault();
  }

  render() {
    return (
      <div className="users">
        <h1>使用者列表</h1>
        <ul className="users-list">
          {
            this.state.list.map((user)=> 
                <li key={user.id} onClick={this.handleSelectClicked.bind(this, user)}> 
                    <h3>{user.name}</h3>
                    <ol>
                        <li>Username: {user.username}</li>
                        <li>Email: {user.email}</li>
                    </ol>
                </li>)
          }
        </ul>

        <div className="edit-users">
          <h1>修改使用者區塊</h1>
          <form onSubmit={this.handleEditSubmit}>
            <label>ID: {this.state.nowChoose}</label>
            <label>Name:</label>
            <input type="text" name="editName" value={this.state.editName} onChange={this.handleInputChange} />
            <label>Username:</label>
            <input type="text" name="editUsername" value={this.state.editUsername} onChange={this.handleInputChange} />
            <label>Email:</label>
            <input type="text" name="editEmail" value={this.state.editEmail} onChange={this.handleInputChange} />
            <input type="submit" value="儲存修改" />
          </form>
          <button onClick={this.handleDeleted.bind(this, this.state.nowChoose)}>刪除此使用者</button>
        </div>

        <div className="add-users">
          <h1>新增使用者區塊</h1>
          <form onSubmit={this.handleSubmit}>
            <label>Name:</label>
            <input type="text" name="addName" value={this.state.addName} onChange={this.handleInputChange} />
            <label>Username:</label>
            <input type="text" name="addUsername" value={this.state.addUsername} onChange={this.handleInputChange} />
            <label>Email:</label>
            <input type="text" name="addEmail" value={this.state.addEmail} onChange={this.handleInputChange} />
            <input type="submit" value="新增" />
          </form>
        </div>

      </div>
    );
  }
}

export default Users;