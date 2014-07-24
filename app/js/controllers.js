'use strict';

/* Controllers */

angular.module('myApp.controllers', [])

.controller('MyCtrl1', ['$scope', function($scope) {

  // model variables
  $scope.input = getInitialInput(); // input from user
  $scope.budget = getBudget(); // established budget
  $scope.forecast = {}; // expense forecast / analysis

  // create callback for when input changes
  $scope.update = function() {
    $scope.forecast = getForecast($scope.input, $scope.budget)
    $scope.chartObject.data = getChartData($scope.budget, $scope.forecast)
 }

  setChartParams($scope);
  $scope.update();

}])

.controller('MyCtrl2', ['$scope', function($scope) {

}]);

function getInitialInput() {
  var input = {};
  input.assistedLivingType = "independentLiving";
  input.careType = "healthAide";
  input.daysPerWeek = 1;
  input.medicationAssistance = "no";
  input.mealAssistance = "no";
  input.bathingAssistance = "no";
  return input;
}


function getBudget() {
  var budget = {};
  budget.assets = 57000;
  budget.yearly = 1500;
  budget.span = 3;
  return budget;
}

function getForecast(input, budget) {
  var forecast = {};
  forecast.data = [
    {"year": 2014, "cost": 1000},
    {"year": 2015, "cost": 1100},
    {"year": 2016, "cost": 1200},
    {"year": 2017, "cost": 1300},
    {"year": 2018, "cost": 1500},
    {"year": 2019, "cost": 1700},
    {"year": 2020, "cost": 1900},
    {"year": 2021, "cost": 2200},
    {"year": 2022, "cost": 2600},
    {"year": 2023, "cost": 3000},
    ];

  var assistedLivingMultiplier = {"independentLiving": 1.0, "assistedLiving": 1.1,
    "alzheimersDementiaCare": 1.2, "continuingCareRetirementCommunity": 1.3, 
    "skilledNursingCenter": 1.4, "personalCare": 1.5};

  for (var i = 0; i < forecast.data.length; i++) {
    var cost = forecast.data[i].cost;

    cost = cost * assistedLivingMultiplier[input.assistedLivingType];
    cost = cost * (1 + .1 * input.daysPerWeek);

    forecast.data[i].cost = cost;
  }

  return forecast;
}


function getChartData(budget, forecast) {
  var chartData = {};

  chartData.cols = [
    {"id": "year", "label": "Year", "type": "number"},
    {"id": "budget", "label": "Budget", "type": "number"},
    {"id": "forecast", "label": "Forecast", "type": "number"}
  ]

  var rows = [];

  for (var i = 0; i < forecast.data.length; i++) {
    var forecastDatum = forecast.data[i];
    var chartDatum = {};
    chartDatum.c = [ {"v": forecastDatum.year},
                     {"v": budget.yearly},
                     {"v": forecastDatum.cost} ]
    rows[i] = chartDatum;
  }


  chartData.rows = rows;

  return chartData;
}


function setChartParams($scope) {

  $scope.chartObject = {
    "type": "AreaChart",
    "displayed": true,
    
    "options": {
      "title": "Projected Cost of Care",
      "isStacked": "false",
      "fill": 20,
      "displayExactValues": true,
      "vAxis": {
        "title": "Cost",
        "minValue": 0,
        "maxValue": 8000,
        "format": "$###,###",
        "gridlines": {
          "count": 10
        }
      },
      "hAxis": {
        "title": "Year",
        "format": "####"
      }
    },
    "formatters": {}
  }

}



