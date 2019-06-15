var currencyApp = angular.module("currencyApp",['ngMaterial','ngMessages','ngRoute']);

currencyApp.config(['$routeProvider', function($routeProvider){
    $routeProvider
    .when("/getCountries",{
        templateUrl: "getCountries.html",
        controller: "getCountriesController"
    })
    .when("/historicalRates",{
        templateUrl: "historicalRates.html",
        controller: "historicalRatesController"
    })
    .when("/latestRates",{
        templateUrl: "latestRates.html",
        controller: "latestRatesController"
    })
    .when("/currencyConvert",{
        templateUrl: "currencyConvert.html",
        controller: "currencyConvertController"
    })
    .otherwise({
        redirectTo: '/'
    })
}]);

currencyApp.controller("mainController", function($scope, $mdSidenav){
    $scope.toggleLeftMenu = function()
    {
        $mdSidenav('left').toggle();
    }
});

currencyApp.controller("getCountriesController", function($scope,$http){
    var url = "http://localhost:8000/api/countries";
    var req = {
        method: 'GET',
        url: url,
        headers:{
            'Content-Type': 'application/json',
        },
    }
    $http(req)
    .then(function successCallBack(response){
        $scope.countriesObj = response.data;
        $scope.countries = $scope.countriesObj.countries;
    }, function errorCallBack(){
        alert("API Call Failed");
    });
});

currencyApp.controller("historicalRatesController", function($scope,$http){

    $scope.mode="";
    $scope.singleCountryMode = false;
    $scope.batchCountryMode = false;
    $scope.radioChanged = function(){
        $scope.responseObj = "";
        if($scope.mode==="single")
        {
            $scope.singleCountryMode = true;
            $scope.batchCountryMode = false;
        }

        if($scope.mode==="batch")
        {
            $scope.singleCountryMode = false;
            $scope.batchCountryMode = true;
        }
    }

    $scope.dateChanged = function(){
        $scope.date = new Date($scope.historyExchangeDate);
        var year = ($scope.date.getFullYear()).toString();
        if($scope.date.getMonth()+1<10)
        {
            var month = "0"+($scope.date.getMonth()+1).toString();
        }
        else
            var month = ($scope.date.getMonth()+1).toString();
        if($scope.date.getDate()<10)
        {
            var day = "0"+($scope.date.getDate()).toString();
        }
        else
            var day = ($scope.date.getDate()).toString();
        $scope.datePart = "date=";
        $scope.datePart += year+ "-"+month+"-"+day;
    }

    $scope.batchHistoryRate = function(){
        $scope.baseUrl = "";
        var countryCodesPart = "codes=";
        countryCodesPart += $scope.countryCodes;

        $scope.baseUrl = "http://localhost:8000/api/currencies/history";
        $scope.baseUrl +="?"+$scope.datePart+"&"+countryCodesPart;

        var req = {
            method: 'GET',
            url: $scope.baseUrl,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        $scope.apiCall(req,$http);
    }

    $scope.singleHistoryRate = function(){
        $scope.baseUrl = "";
        var countryCode = $scope.countryCode;

        $scope.baseUrl = "http://localhost:8000/api/currencies/history/";
        $scope.baseUrl += countryCode +"?"+ $scope.datePart;
        console.log($scope.baseUrl);
        var req = {
            method: 'GET',
            url: $scope.baseUrl,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        $scope.apiCall(req,$http);
    }

      $scope.apiCall = function(req,$http,) {
        $http(req)
            .then(function successCallBack(response){
                console.log(response.data);
                $scope.responseObj = response.data;
                $scope.responseStatus = $scope.responseObj.success;
                $scope.responseTime = $scope.responseObj.timestamp;
                $scope.exchangeRateDate = $scope.responseObj.date;
                $scope.exchangeRateType = "historical";
                $scope.baseCurrency = $scope.responseObj.base;
                $scope.exchangeRates = $scope.responseObj.currencies;
            }, function errorCallBack(){
                alert('API Call fails')
            });
    }
});

currencyApp.controller("latestRatesController", function($scope){

});

currencyApp.controller("currencyConvertController", function($scope){

});