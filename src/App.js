import React, { Component } from 'react';
import './App.css';

var uuid = require('uuid');
var firebase = require('firebase');

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAzNuypvYm28mN3cNCDwmUHah-GdZbRXy4",
  authDomain: "simplesurvey-240c5.firebaseapp.com",
  databaseURL: "https://simplesurvey-240c5.firebaseio.com",
  projectId: "simplesurvey-240c5",
  storageBucket: "simplesurvey-240c5.appspot.com",
  messagingSenderId: "636956648615"
};
firebase.initializeApp(config);

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      id:uuid.v1(),
      name: '',
      answers: {
        q1:'',
        q2:'',
        q3:'',
        q4:''
      },
      submitted: false
    }

    this.handleQuestionChange = this.handleQuestionChange.bind(this);
  }

  handleNameSubmit(event){
    var name = this.refs.name.value;
    this.setState({name: name}, function () {
      console.log(this.state);
    });

    event.preventDefault();
  }

  handleQuestionSubmit(event) {
    firebase.database().ref('surveys/'+this.state.id).set({
      name: this.state.name,
      answers: this.state.answers
    });
    this.setState({
      submitted: true
    }, function () { console.log('Questions submitted...');});
    event.preventDefault();
  }

  handleQuestionChange(event) {

    var answers = this.state.answers;
    answers[event.target.name] = event.target.value;
    this.setState({
      answers: answers
    });
  }

  render() {

    var user;
    var questions;

    if(this.state.name && this.state.submitted === false) {
      user = (<h2> Welcome {this.state.name} </h2>);
      questions = (
        <span>
          <h3>Survey Questions</h3>
          <form onSubmit={this.handleQuestionSubmit.bind(this)}>
            <div>
              <label>What is your favorite desktop operating system?</label><br />
              <input type="radio" name="q1" value="Windows" onChange={this.handleQuestionChange} />Windows <br />
              <input type="radio" name="q1" value="MacOS" onChange={this.handleQuestionChange} />MacOS <br />
              <input type="radio" name="q1" value="Linux" onChange={this.handleQuestionChange} />Linux <br />
              <input type="radio" name="q1" value="Solaris" onChange={this.handleQuestionChange} />Solaris <br />
              <input type="radio" name="q1" value="Other" onChange={this.handleQuestionChange} />Other <br />
            </div>
            <div>
              <label>What is your favorite brand of TV?</label><br />
              <input type="radio" name="q2" value="Sony" onChange={this.handleQuestionChange} />Sony <br />
              <input type="radio" name="q2" value="Samsung" onChange={this.handleQuestionChange} />Samsung <br />
              <input type="radio" name="q2" value="Panasonic" onChange={this.handleQuestionChange} />Panasonic <br />
              <input type="radio" name="q2" value="Visio" onChange={this.handleQuestionChange} />Visio <br />
              <input type="radio" name="q2" value="Other" onChange={this.handleQuestionChange} />Other <br />
            </div>
            <div>
              <label>What is your favorite smartphone brand?</label><br />
              <input type="radio" name="q3" value="Apple" onChange={this.handleQuestionChange} />Apple <br />
              <input type="radio" name="q3" value="Samsung" onChange={this.handleQuestionChange} />Samsung <br />
              <input type="radio" name="q3" value="HTC" onChange={this.handleQuestionChange} />HTC <br />
              <input type="radio" name="q3" value="Huawei" onChange={this.handleQuestionChange} />Huawei <br />
              <input type="radio" name="q3" value="Other" onChange={this.handleQuestionChange} />Other <br />
            </div>
            <input type="submit" value="submit" />
          </form>
        </span>
      );
    } else if(!this.state.name && this.state.submitted === false) {
      user = <span>
        <h2>Please enter your name to begin the survey</h2>
        <form onSubmit={this.handleNameSubmit.bind(this)}>
          <input type="text" placeholder="Enter Name..." ref="name" />
        </form>
      </span>
      questions = '';
    } else if(this.state.submitted === true) {

    }

    return (
      <div className="App">
        <div className="App-header text-center">
          <h2>SimpleSurvey</h2>
        </div>
        <div className="text-center">
          {user}
        </div>
        <div className="container">
          {questions}
        </div>
      </div>
    );
  }
}

export default App;
