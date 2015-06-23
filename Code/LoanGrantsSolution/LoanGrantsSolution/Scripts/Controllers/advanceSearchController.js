/* Thic controller is for Advance Search Page.*/
(function () {
    // using http for ajax calls and interval for time interval function
    var AdvanceSearchController = function ($scope, $http, $interval) {
        $scope.data = '';
        $scope.states = [];
        $scope.federal = [];
        $scope.selectedState = 'empty';
        $scope.searchResult = [];
        $scope.selectedGovType = 'All';
        $scope.selectedIndustry = 'All';
        $scope.selectedLoanType = 'All';
        $scope.checkboxModel = {
            is_general_purpose: '0',
            is_development: '0',
            is_exporting: '0',
            is_contractor: '0',
            is_green: '0',
            is_militry: '0',
            is_minority: '0',
            is_disabled: '0',
            is_rural: '0',
            is_disaster: '0'
        };

        // Initialize function
        function Init() {
            loadLastSearch(); // call function to load Last search made by user
            //$('#lbl-user-name').text('Welcome ! ' + userProfile.userName()); // Display User Name
            //loadStatesData();
        }

        /* Retreive last search made from the localStorage */
        function loadLastSearch() {

            var searchArray = localStorage.getItem("searchArray") != null ? JSON.parse(localStorage.getItem("searchArray")) : [];

            if (searchArray.length > 0) { // if search array has items
                // get prv search frm localstorage by id
                var lastSearch = JSON.parse(localStorage.getItem('search_Id_' + searchArray.length));
                // load it in the model
                $scope.selectedGovType = lastSearch.GovType;
                if (lastSearch.GovType == 'State') {
                    loadStatesData();
                }
                $scope.selectedIndustry = lastSearch.Industry;
                $scope.selectedLoanType = lastSearch.LoanType;
                $scope.checkboxModel.is_general_purpose = lastSearch.IsGeneralPurpose;
                $scope.checkboxModel.is_development = lastSearch.IsDevelopment;
                $scope.checkboxModel.is_exporting = lastSearch.IsExporting;
                $scope.checkboxModel.is_contractor = lastSearch.IsContractor;
                $scope.checkboxModel.is_green = lastSearch.IsGreen;
                $scope.checkboxModel.is_militry = lastSearch.IsMilitry;
                $scope.checkboxModel.is_minority = lastSearch.IsMinority;
                $scope.checkboxModel.is_disabled = lastSearch.IsDisabled;
                $scope.checkboxModel.is_rural = lastSearch.IsRural;
                $scope.checkboxModel.is_disaster = lastSearch.IsDisaster;

            }

        }

        $scope.search = function () {

            var searchArray = [];
             // my search model 
            var mySearch = {
                GovType: $scope.selectedGovType,
                Industry: $scope.selectedIndustry,
                LoanType: $scope.selectedLoanType,
                IsGeneralPurpose: $scope.checkboxModel.is_general_purpose,
                IsDevelopment: $scope.checkboxModel.is_development,
                IsExporting: $scope.checkboxModel.is_exporting,
                IsContractor: $scope.checkboxModel.is_contractor,
                IsGreen: $scope.checkboxModel.is_green,
                IsMilitry: $scope.checkboxModel.is_militry,
                IsMinority: $scope.checkboxModel.is_minority,
                IsDisabled: $scope.checkboxModel.is_disabled,
                IsRural: $scope.checkboxModel.is_rural,
                IsDisaster: $scope.checkboxModel.is_disaster
            };


            searchArray = localStorage.getItem("searchArray") != null ? JSON.parse(localStorage.getItem("searchArray")) : [];

            var searchItemId = "search_Id_" + (searchArray.length + 1);
            searchArray.push(searchItemId);

            if (!IsItemExists(mySearch)) {
                localStorage.setItem(searchItemId, JSON.stringify(mySearch));
                localStorage.setItem("searchArray", JSON.stringify(searchArray));
            }

            $http.jsonp('http://api.sba.gov/loans_grants/federal.json').success(function (data) {
                // add data the search result
                $scope.searchResult = searchInCollectionWithItemsData(data, mySearch);                
            }).error(function () {
                // get data from the json and pass it to the data
                $http.get('/scripts/APIdata.js').success(function (data) {
                    $scope.searchResult = searchInCollectionWithItemsData(data, mySearch);
                }).error(function () {
                    console.log('Error Loading data.');
                });
            });

            // this function check duplicate in localStorage searched items.
            function IsItemExists(itemToBeSearched) {
                var isDuplicated = false;
                var searchArray = localStorage.getItem("searchArray") != null ? localStorage.getItem("searchArray") : [];

                if (searchArray.length > 0) {
                    searchArray = JSON.parse(searchArray);
                }

                for (var i = 0; i < searchArray.length; i++) {
                    var item = JSON.parse(localStorage.getItem(searchArray[i]));
                    if (angular.equals(itemToBeSearched, item)) {
                        isDuplicated = true;
                        break;
                    }
                }

                return isDuplicated;
            }

            // This function perform search on main data 
            function searchInCollectionWithItemsData(arr, item) {
                var itemsFound = [];
                $('#progress-bar').show();

                // loop through all cached items and return result
                for (var i = 0; i < arr.length; i++) {
                    if (
                        (item.GovType != null && arr[i].gov_type != null && item.GovType.toLowerCase() == arr[i].gov_type.toLowerCase()) ||
                        (item.Industry != null && arr[i].industry != null && item.Industry.toLowerCase() == arr[i].industry.toLowerCase()) ||
                        (item.LoanType != null && arr[i].loan_type != null && item.LoanType.toLowerCase() == arr[i].loan_type.toLowerCase()) ||
                        (item.IsGeneralPurpose == '1' && item.IsGeneralPurpose == arr[i].is_general_purpose) ||
                        (item.IsDevelopment == '1' && item.IsDevelopment == arr[i].is_development) ||
                        (item.IsExporting == '1' && item.IsExporting == arr[i].is_exporting) ||
                        (item.IsContractor == '1' && item.IsContractor == arr[i].is_contractor) ||
                        (item.IsGreen == '1' && item.IsGreen == arr[i].is_green) ||
                        (item.IsMilitry == '1' && item.IsMilitry == arr[i].is_military) ||
                        (item.IsMinority == '1' && item.IsMinority == arr[i].is_minority) ||
                        (item.IsDisabled == '1' && item.IsDisabled == arr[i].is_disabled) ||
                        (item.IsRural == '1' && item.IsRural == arr[i].is_rural) ||
                        (item.IsDisaster == '1' && item.IsDisaster == arr[i].is_disaster)
                        ) {
                        itemsFound.push(arr[i]);
                    }

                    var tmp = i;
                    var percent = ((tmp / arr.length) * 100);
                    $scope.resultprogress = Math.round(percent);

                    if (i == arr.length - 1) { // if loop is last
                        $interval(function () { // creating illusion to add delay in search
                            $scope.resultprogress = 100;
                        }, 500, 1);
                    }

                }
                return itemsFound;
            }


        }
        // From UI when user clicks on [Save to Fvourites] this function called.
        // It save the Loan/Grant to local storage
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

        $scope.selectState = function () {
            //console.log($scope.selectedState);
        }

        // Loads the list of Status
        function loadStatesData() {
            $http.get('/scripts/statesJson.js')
                .success(function (data) {
                $scope.states = data;
            }).error(function () {
            });
        }
       
        // Loads data from my Server, this is in case SBA site is down we have a local copy of data. 
        // Also the SBA api dose not allow to load data using ajax call from client browser. 
        // This code assumes the data is received in real time from the SBA server on web server and then available to serv.
        function loadSBAServiceDataForFederalRecords() {
            var url = "/scripts/APIdata.js";
            $http.get(url).success(function(data) {
                $scope.federal = data;
            });
        }


        // Event handler when Govt. Tupe switch from Federal to state
        // it displays State dropdown to user
        $scope.changeGovType = function() {

            // load data for the states
            if ($scope.selectedGovType == 'State') {
                loadStatesData();
            }
            // load data for the federal record
            if ($scope.selectedGovType == 'Federal') {
                loadSBAServiceDataForFederalRecords();
            }
        }

        $scope.searchItemExists = function (item) {

            //check item in collection if its there
            return itemExistsInFavSearch(item);

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

        // Disaplay details of Loan/Grant in a dialouge
        $scope.showInfoInDlg = function(item) {

            // setting mode for the dialog
            $scope.title = item.title;
            $scope.description = item.description;
            $scope.agency = item.agency;
            $scope.url = item.url;
            $scope.dlgCheckBoxModel = {
                        is_general_purpose : item.is_general_purpose,
                        is_development : item.is_development,
                        is_exporting : item.is_exporting,
                        is_contractor : item.is_contractor,
                        is_rural : item.is_rural,
                        is_disabled : item.is_disabled,
                        is_green : item.is_green,
                        is_military : item.is_military,
                        is_disaster : item.is_disaster,
                        is_minority : item.is_minority
            }

            // initialize the modal
            $('#myModal').modal();
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


        //Inint
        Init();

    };


    angular.module('loanGrantSearchApp').controller('AdvanceSearchController', AdvanceSearchController);
})();