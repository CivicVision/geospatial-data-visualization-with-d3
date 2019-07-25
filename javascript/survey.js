var Airtable = require('airtable');

var getFormValue = function(id) {
  return document.getElementById(id).value
}
var getFormValues = function(name) {
  var values = [];
  document.querySelectorAll('input[name='+name+']').forEach((function(currentValue, currentIndex, listObj) {
    if(listObj[currentIndex].checked) {
      values.push(currentValue.value);
    }
  }));
  return values;
}

window.sendSurveyResponse = function(id) {
  var base = new Airtable({apiKey: 'key500bQxvE9YGdYt'}).base('appAAzAmC8X8gav73');

  var form = document.getElementById(id);
  var topics = getFormValues('topic')
  var use_dataviz = getFormValues('use_dataviz')[0]
  var create_dataviz = getFormValues('create_dataviz')[0]
  var professional = getFormValues('professional')[0]
  var oneQuestion = getFormValue('one-question')
  var excitingArea = getFormValue('exciting-area')

  window.sendToRM('survey.topics', topics);
  window.sendToRM('survey.use_dataviz', use_dataviz);
  window.sendToRM('survey.create_dataviz', create_dataviz);
  window.sendToRM('survey.professional', professional);
  window.sendToRM('survey.one-question', oneQuestion);
  window.sendToRM('survey.exciting-area', excitingArea);

  base('Responses').create({
    "CK ID": window.localStorage.getItem('rmpanda.sources.convertkit.subscriberId'),
    "RM ID": window.localStorage.getItem('rmpanda.sources.metrics.visitorId'),
    "Topic": topics,
    "Professional": (professional === "true"),
    "Area": excitingArea,
    "use_dataviz": use_dataviz,
    "create_dataviz": create_dataviz,
    "One": oneQuestion
  }, function(err, record) {
      if (err) { console.error(err); return; }
      document.getElementById(id).style.display= 'none';
      document.getElementById(id+'-response').style.visibility= 'bvisible';
  });
};
