/* This controller is used at home page for the Quick Search */

(function (angular) {

    var SearchController = function ($scope, $http, $interval) {

        // On DOM Load this function runs
        function Init() {

            $('#txtSearchText').focus();
            $scope.data = '';
            $scope.helloAngularJS = 'I work!';
            $scope.searchResult = [''];
           
        }


        //This function first try to attempt data from the SBA online API,
        // If site is down or hve issues, it servers the data form the downloaded version (from APIData.js file).
        $scope.search = function () {
            $scope.data = '';
            $('#search-logo').hide('slow');
            $('#search-bar').removeClass('searchbar-vertical-center');
            if ($scope.searchText == '' || $scope.searchText == undefined) {
                $scope.emtysearchText = true;
            } else {
                // search from api
                $http.jsonp('http://api.sba.gov/loans_grants/federal.json').success(function (data) {
                    // add data the search result
                }).error(function () {
                    // get data from the json and pass it to the data
                    $http.get('/scripts/mydata.js').success(function(data) {

                        //$scope.searchResult = data;
                        $scope.searchResult = searchInCollectionWithQuery(data, $scope.searchText);

                    }).error(function() {

                    });


                });
//                $('div.alert').hide(); // please check its ripple effect . i commented this
            }
        }



        // Save the Loan to my Favorites, also checks for duplicate before persisting the data in local storage
        $scope.saveToMySearches = function (item) {

            function IsItemExists(itemToBeSearched) {
                var isDuplicated = false;
                var myFavSearchArray = localStorage.getItem("myFavSearch") != null ? localStorage.getItem("myFavSearch") : [];

                if (myFavSearchArray.length > 0) {
                    myFavSearchArray = JSON.parse(myFavSearchArray);
                }

                for (var i = 0; i < myFavSearchArray.length; i++) {
                    var mySearchArrayItem = JSON.parse(localStorage.getItem(myFavSearchArray[i]));
                    if (angular.equals(itemToBeSearched, mySearchArrayItem)) {
                        isDuplicated = true;
                        break;
                    }
                }
                $('#saved-search-items').text(myFavSearch.length);
                return isDuplicated;
            }


            var myFavSearch = [];
            myFavSearch = localStorage.getItem("myFavSearch") != null ? JSON.parse(localStorage.getItem("myFavSearch")) : [];

            var mySearchItemId = "myFav_Id_" + (myFavSearch.length + 1);
            myFavSearch.push(mySearchItemId);

            if (!IsItemExists(item)) {
                localStorage.setItem(mySearchItemId, JSON.stringify(item));
                localStorage.setItem("myFavSearch", JSON.stringify(myFavSearch));
            }
        }

        $scope.searchItemExists = function (item) {

            //check item in collection if its there
            return itemExistsInFavSearch(item);

        }

        // Delete the items form local storage
        $scope.deleteFromMySearches = function (item) {

            var myFavSearchArray = localStorage.getItem("myFavSearch") != null ? JSON.parse(localStorage.getItem("myFavSearch")) : [];
            var key = ''; 
            for (var i = 0; i < myFavSearchArray.length; i++) {                
                var itemInFavSearch = JSON.parse(localStorage.getItem(myFavSearchArray[i]));
                if (angular.equals(itemInFavSearch, item)) {  
                    key = myFavSearchArray[i];
                    localStorage.removeItem(key);
                    break;
                }
            }
            if (key != '') { // delete from keys List myFavSearch
                var index = myFavSearchArray.indexOf(key);
                myFavSearchArray.splice(index, 1);
                localStorage.setItem("myFavSearch", JSON.stringify(myFavSearchArray));
            }

        }


        // Populates the item in scope which AngularJS render on Dialouge box
        // to display details of Loan/Grant.
        $scope.showInfoInDlg = function (item) {

            // setting mode for the dialog
            $scope.title = item.title;
            $scope.description = item.description;
            $scope.agency = item.agency;
            $scope.url = item.url;
            $scope.dlgCheckBoxModel = {
                is_general_purpose: item.is_general_purpose,
                is_development: item.is_development,
                is_exporting: item.is_exporting,
                is_contractor: item.is_contractor,
                is_rural: item.is_rural,
                is_disabled: item.is_disabled,
                is_green: item.is_green,
                is_military: item.is_military,
                is_disaster: item.is_disaster,
                is_minority: item.is_minority
            }

            // initialize the modal
            $('#myModal').modal();
        }


        // This function dose the searching in cached list of Loans/Grants        
        function searchInCollectionWithQuery(arr, searchText) {
            var itemsFound = [];
            $('#progress-bar').show();

            for (var i = 0; i < arr.length; i++) {

                if (searchText.toLowerCase() == arr[i].gov_type.toLowerCase() ||
                    arr[i].agency.toLowerCase().indexOf(searchText.toLowerCase()) != -1 ||
                    arr[i].loan_type.toLowerCase().indexOf(searchText.toLowerCase()) != -1 ||
                    arr[i].title.toLowerCase().indexOf(searchText.toLowerCase()) != -1 ||
                    arr[i].description.toLowerCase().indexOf(searchText.toLowerCase()) != -1) {
                    itemsFound.push(arr[i]);
                }

                var tmp = i;
                var percent = ((tmp / arr.length) * 100);
                $scope.resultprogress = Math.round(percent);

                if (i == arr.length - 1) { // if loop is last
                    $interval(function () { // creating illusion to add delay in search
                        $scope.resultprogress = 100;
                    }, 1500, 1);
                }

            }

            return itemsFound;
        }

        function itemExistsInFavSearch(item) {
            var myFavSearchArray = localStorage.getItem("myFavSearch") != null ? JSON.parse(localStorage.getItem("myFavSearch")) : [];

            for (var i = 0; i < myFavSearchArray.length; i++) {
                var itemInFavSearch = JSON.parse(localStorage.getItem(myFavSearchArray[i]));
                if (angular.equals(itemInFavSearch, item)) {
                    return true;
                }
            }
            return false;
        }


        // Initialize 
        Init();
    };

    // register SearchController with Angular
    angular.module('loanGrantSearchApp').controller('SearchController', SearchController);

})(window.angular);