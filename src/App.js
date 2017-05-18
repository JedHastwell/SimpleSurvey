import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';

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
      survey: null,
      answers: {},
      submitted: false
    }

    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.getSurveyQuestions.bind(this)();
  }

  getSurveyQuestions(){
    $.ajax({
      url: 'http://localhost:3000/questions.json',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({survey: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err);
        alert(err);
      }
    });
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
    var survey = this.state.survey;
    var display = '';
    var onChange = this.handleQuestionChange;

    if(this.state.name && this.state.submitted === false) {

      if(survey){
        display = survey.questions.map(function(item) {
          return (
            <div>
              <label key={item.qid}>{item.question}</label><br />
              { item.answers.map(function(ans) {
                  return (
                    <span key={ans}>
                      <input type="radio" name={item.qid} value={ans} onChange={onChange} />{ans} <br />
                    </span>
                  );
                })
              }
            </div>
          );
        });
      }

      user = (<h2> Welcome {this.state.name} </h2>);
      questions = (
        <span>
          <h3>Survey Questions</h3>
          <form onSubmit={this.handleQuestionSubmit.bind(this)}>

            {display}

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
      user = <span>
        <h2>Thanks {this.state.name}</h2>
        Your answers have been submitted.
      </span>
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
