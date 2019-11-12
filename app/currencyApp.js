var currencyApp = angular.module("currencyApp",['ngMaterial','ngMessages','ngRoute','md.data.table']);
currencyApp.value("hostUrl", "http://192.168.1.20:8000");

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
    };

});

currencyApp.controller("getCountriesController", function($scope,$http,hostUrl){
    $scope.selected = [];
    let url = hostUrl + "/api/countries";
    let req = {
        method: 'GET',
        url: url,
        headers:{
            'Content-Type': 'application/json',
        },
    };
    $http(req)
    .then(function successCallBack(response){
        $scope.countriesObj = response.data;
        $scope.countries = $scope.countriesObj.countries;
    }, function errorCallBack(){
        alert("API Call Failed");
    });
});

currencyApp.controller("historicalRatesController", function($scope,$http,hostUrl){
    $scope.responseObj = "";
    $scope.mode="";
    $scope.singleCountryMode = false;
    $scope.batchCountryMode = false;
    $scope.allCountryMode = false;

    $scope.radioChanged = function(){
        $scope.responseObj = "";
        $scope.historyExchangeDate = "";
        $scope.countryCode = "";
        $scope.countryCodes = "";
        if($scope.mode==="single")
        {
            $scope.singleCountryMode = true;
            $scope.batchCountryMode = false;
            $scope.allCountryMode = false;
        }

        if($scope.mode==="batch")
        {
            $scope.singleCountryMode = false;
            $scope.batchCountryMode = true;
            $scope.allCountryMode = false;
        }

        if($scope.mode==="all")
        {
            $scope.singleCountryMode = false;
            $scope.batchCountryMode = false;
            $scope.allCountryMode = true;
        }
    };

    $scope.dateChanged = function(){
        $scope.date = new Date($scope.historyExchangeDate);
        let year = ($scope.date.getFullYear()).toString();
        let month;
        let day;
        if($scope.date.getMonth()+1<10)
        {
            month = "0"+($scope.date.getMonth()+1).toString();
        }
        else
            month = ($scope.date.getMonth()+1).toString();
        if($scope.date.getDate()<10)
        {
            day = "0"+($scope.date.getDate()).toString();
        }
        else
            day = ($scope.date.getDate()).toString();
        $scope.datePart = "date=";
        $scope.datePart += year+ "-"+month+"-"+day;
    };

    $scope.batchHistoryRate = function(){
        $scope.baseUrl = "";
        let countryCodesPart = "codes=";
        countryCodesPart += $scope.countryCodes;

        $scope.baseUrl = hostUrl + "/api/currencies/history/batch";
        $scope.baseUrl +="?"+$scope.datePart+"&"+countryCodesPart;
        console.log($scope.baseUrl);
        let req = {
            method: 'GET',
            url: $scope.baseUrl,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        $scope.apiCall(req,$http);
    };

    $scope.singleHistoryRate = function(){
        $scope.baseUrl = "";
        let countryCode = $scope.countryCode;

        $scope.baseUrl = hostUrl + "/api/currencies/history/";
        $scope.baseUrl += countryCode +"?"+ $scope.datePart;
        console.log($scope.baseUrl);
        let req = {
            method: 'GET',
            url: $scope.baseUrl,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        $scope.apiCall(req,$http);
    };

    $scope.allHistoryRate = function() {
        $scope.baseUrl = "";
        $scope.baseUrl = hostUrl + "/api/currencies/history";
        $scope.baseUrl += "?"+$scope.datePart;
        let req = {
            method: 'GET',
            url: $scope.baseUrl,
            headers: {
                'Content-type': 'application/json',
            }
        };

        $scope.apiCall(req,$http);
    };

      $scope.apiCall = function(req,$http) {
        $http(req)
            .then(function successCallBack(response){
                console.log(response.data);
                $scope.responseObj = response.data;
            }, function errorCallBack(){
                $scope.responseObj = "";
                alert('API Call fails');
            });
    }

});

currencyApp.controller("latestRatesController", function($scope,$http,hostUrl){
    $scope.responseObj = "";
    $scope.mode="";
    $scope.singleCountryMode = false;
    $scope.batchCountryMode = false;
    $scope.allCountryMode = false;

    $scope.radioChanged = function(){
        $scope.responseObj = "";
        $scope.countryCode = "";
        $scope.countryCodes = "";
        if($scope.mode==="single")
        {
            $scope.singleCountryMode = true;
            $scope.batchCountryMode = false;
            $scope.allCountryMode = false;
        }

        if($scope.mode==="batch")
        {
            $scope.singleCountryMode = false;
            $scope.batchCountryMode = true;
            $scope.allCountryMode = false;
        }

        if($scope.mode==="all")
        {
            $scope.singleCountryMode = false;
            $scope.batchCountryMode = false;
            $scope.allCountryMode = true;
        }
    };

    $scope.batchLatestRate = function(){
        $scope.baseUrl = "";
        let countryCodesPart = "codes=";
        countryCodesPart += $scope.countryCodes;

        $scope.baseUrl = hostUrl + "/api/currencies/latest/batch";
        $scope.baseUrl +="?"+countryCodesPart;
        console.log($scope.baseUrl);
        let req = {
            method: 'GET',
            url: $scope.baseUrl,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        $scope.apiCall(req,$http);
    };

    $scope.singleLatestRate = function(){
        $scope.baseUrl = "";
        let countryCode = $scope.countryCode;

        $scope.baseUrl = hostUrl + "/api/currencies/latest/";
        $scope.baseUrl += countryCode;
        console.log($scope.baseUrl);
        let req = {
            method: 'GET',
            url: $scope.baseUrl,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        $scope.apiCall(req,$http);
    };

    $scope.allLatestRate = function(){
        $scope.baseUrl = "";
        $scope.baseUrl = hostUrl + "/api/currencies/latest";
        let req = {
            method: 'GET',
            url: $scope.baseUrl,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        $scope.apiCall(req,$http);
    };

    $scope.apiCall = function(req,$http) {
        $http(req)
            .then(function successCallBack(response){
                console.log(response.data);
                $scope.responseObj = response.data;
            }, function errorCallBack(){
                $scope.responseObj = "";
                alert('API Call fails');
            });
    }

});

currencyApp.controller("currencyConvertController", function($scope,$http,hostUrl){
    $scope.fromCode = "";
    $scope.toCode = "";
    $scope.convertAmount = 1.0;

    $scope.convertCurrencies = function () {
        if($scope.convertDate)
        {
            console.log($scope.convertDate);
            let year = ($scope.convertDate.getFullYear()).toString();
            let month;
            let day;
            if($scope.convertDate.getMonth()+1<10)
            {
                month = "0"+($scope.convertDate.getMonth()+1).toString();
            }
            else
                month = ($scope.convertDate.getMonth()+1).toString();
            if($scope.convertDate.getDate()<10)
            {
                day = "0"+($scope.convertDate.getDate()).toString();
            }
            else
                day = ($scope.convertDate.getDate()).toString();
            $scope.datePart = "&date="+year+"-"+month+"-"+day;
        }

        $scope.baseUrl = hostUrl + "/api/currencies/convert?";
        let toPart = "to="+$scope.toCode;
        let fromPart = "&from="+$scope.fromCode;
        let amountPart = "&amount="+$scope.convertAmount;
        $scope.baseUrl += toPart+fromPart+amountPart;
        if($scope.datePart){
            $scope.baseUrl += $scope.datePart;
        }
        console.log($scope.baseUrl);

        let req = {
            method: 'GET',
            url: $scope.baseUrl,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        $scope.apiCall(req,$http);
    };

    $scope.apiCall = function (req,$http) {
        $http(req)
            .then(function successCallBack(response){
                console.log(response.data);
                $scope.responseObj = response.data;
            }, function errorCallBack(){
                $scope.responseObj = "";
                alert('API Call fails');
            });
    }
});