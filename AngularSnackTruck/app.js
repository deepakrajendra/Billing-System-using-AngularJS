
var routerApp = angular.module('routerApp', ['ui.router', 'chart.js', 'ngAnimate', 'ui.bootstrap']);
var actualQuantity; 

routerApp.config(function ($stateProvider, $urlRouterProvider) {
    console.log("its working");
    $urlRouterProvider.otherwise('/billing');

    $stateProvider

        // billing STATES AND NESTED VIEWS ========================================
        .state('billing', {
            url: '/billing',
            templateUrl: 'partial-billing.html',
            controller: 'billingController'
        })


        // storeRoom PAGE AND MULTIPLE NAMED VIEWS =================================
      .state('storeRoom', {
          url: '/storeRoom',
          templateUrl: 'partial-storeRoom.html',
          controller: 'storeRoomController'


      })

    .state('collection', {
        url: '/collection',
        templateUrl: 'partial-collection.html',
        controller:'collectionController'
    });

}); // closes $routerApp.config()


//controller for billing
routerApp.controller('billingController', function ($scope,$http) {
    //$scope.itemList1 = [{ 'itemName': 'Plain Cheese Burger', 'imageSource': 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQTKieWt4R4GRcPrDf1-PVU98aykYPOGXQDNPJubJztJirOA6hyOA', 'cost': 40 }, { 'itemName': 'Veg Burger', 'imageSource': 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTog5xWTmTaheNRn9Vy0skQd-mFQnithBhTIyuglvmC1oO6PRoY', 'cost': 50 }
    //, { 'itemName': 'Veg Toasted Sandwich', 'imageSource': 'http://media.indiatimes.in/media/content/2013/Dec/1566836_1437738161.jpg', 'cost': 60 }, { 'itemName': 'Toasted Cheese Sandwich', 'imageSource': 'http://www.thetoastedsandwichcompany.co.uk/images/toasted-sandwich-large.jpg', 'cost': 70 }];

    //$scope.itemList2 = [{ 'itemName': 'Toasted Indian Special', 'imageSource': 'http://www.foodinaminute.co.nz/var/fiam/storage/images/recipes/breakfast-toasted-sandwiches/2551205-17-eng-US/Breakfast-Toasted-Sandwiches_recipeimage.jpg', 'cost': 40 }, { 'itemName': 'Cheese Crispy Sandwich', 'imageSource': 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRZtgmnExS-fvxy1UeuU9VLXI9cllLU9Oua8DfMFBYcFJHyxK55', 'cost': 50 }
    // , { 'itemName': 'Plain Veg Burger', 'imageSource': 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQGqXmbMZIezaptBUGBT8g2UkZjBtNeMhtLxFpGAwMZwdp0QasB', 'cost': 60 }, { 'itemName': 'Double Cheese Burger', 'imageSource': 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQLzE-HT-8BSWvYdva-qMoNUhyr6Qcjsc3NOCABDIowGcZEEPydaw', 'cost': 70 }];
   
    //using web service
    $scope.totalCost = 0;

        $http.post('SnackService.asmx/GetAllItems').then(function (response) {
            $scope.requestedItems = response.data;
            console.log("post called");

        });

        $http.post('SnackService.asmx/GetAllItemsFromCollection').then(function (response) {
            $scope.orderedItems = response.data;
            console.log("called post from storeRoomController");
            for (var i = 0; i < $scope.orderedItems.length; i++) {
                $scope.totalCost = $scope.totalCost + $scope.orderedItems[i].Cost;
            }

        });
 
      
    //storing ordereditems
    $scope.orderedItems = [];
  
    //clicking on the item 
    $scope.itemClick = function (itemId,itemName, itemCost) {
        swal({
            title: itemName,
            //text: "Number of " + itemName + "s bought",
            type: "input", showCancelButton: true,
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputPlaceholder: "Quantity"
        },
        function (quantity) {
            actualQuantity = quantity;

            if (quantity === false) return false;
            if (quantity === "") {
                swal.showInputError("You need to add the quantity!");
                return false
            }
            if (!parseInt(quantity)) {
                console.log("not integer");
                swal.showInputError("You need to add the quantity!");
                return false;
            }
            else {
                swal(quantity, itemName, "success");

                $http.post('SnackService.asmx/InsertItemToCollection', { 'Id': itemId, 'ItemName': itemName, 'Count': quantity, 'Cost': itemCost * quantity }).
              then(function () {
                  console.log("is t happening");
                  $http.post('SnackService.asmx/GetAllItemsFromCollection').then(function (response) {
                      $scope.orderedItems = response.data;
                      for (var i = 0; i < $scope.orderedItems.length; i++) {
                          $scope.totalCost = $scope.totalCost + $scope.orderedItems[i].Cost;

                      }
                      console.log("called post from storeRoomController");

                  });

              });
                //$scope.$apply(function () {
                //    $scope.orderedItems.push({
                //        'name': itemName,f
                //        'quantity': parseInt(quantity),
                //        'cost': itemCost
                //    });
                //});
            }
        });         //end of swal
    }                               //end of itemCLick scope

    $scope.doubleClick = function (CollectionId,Cost) {
        //var index = $scope.orderedItems.indexOf(item.name);
        //$scope.orderedItems.splice(index, 1);
        //$scope.totalCost=$scope.totalCost-(item.cost*item.quantity);
        $http.post('SnackService.asmx/DeleteItemFromCollection', { 'CollectionId': CollectionId }).then(
            function () {
                $http.post('SnackService.asmx/GetAllItemsFromCollection').then(function (response) {
                    $scope.orderedItems = response.data;
                    $scope.totalCost = 0;
                    //console.log("called post from storeRoomController");
                    for (var i = 0; i < $scope.orderedItems.length; i++) {
                        $scope.totalCost = $scope.totalCost + $scope.orderedItems[i].Cost;
                    }
                });
            }
            );
    };

    $scope.deleteTemp=function()
    {
        $http.post('SnackService.asmx/DeleteTemp').then(function () {
            $http.post('SnackService.asmx/GetAllItemsFromCollection').then(function (response) {
                $scope.orderedItems = response.data;
                //console.log("called post from storeRoomController");
                for (var i = 0; i < $scope.todaysCollection.length; i++) {
                    $scope.total = $scope.total + $scope.todaysCollection[i].Cost;
                }
            });
        });
       
    }
    //StoreRoom objects

   
});         //end of controller

routerApp.controller('storeRoomController', function ($scope, $http) {
   
    console.log("called storeRoomController");
    
    $http.post('SnackService.asmx/GetAllItems').then(function (response) {
        $scope.requestedItems = response.data;
        console.log("called post from storeRoomController");

    });
 

    $scope.addItem = function () {
        swal.withForm({
            title: 'Add Item',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Get form data!',
            closeOnConfirm: true,
            formFields: [
                { id: 'itemName', placeholder: 'Item Name' },
                { id: 'imageSource', placeholder: 'Image source' },
                { id: 'cost', placeholder: 'Cost' },

            ]
        }, function (isConfirm) {
            // do whatever you want with the form data
            console.log(this.swalForm) // { name: 'user name', nickname: 'what the user sends' }
            var newItem = this.swalForm;
            console.log(newItem);
            $http.post('SnackService.asmx/InsertItem', { 'ItemName': newItem.itemName, 'ImageSource': newItem.imageSource, 'Cost': newItem.cost }).
            then(function ()
            {
             
                
            });

         
            $http.post('SnackService.asmx/GetAllItems').then(function (response) {
                $scope.requestedItems = response.data;
                console.log("called post from storeRoomController");

            });
        })

    };  // end addItem


    //update item
    $scope.updateItem = function (Id,itemName,imageSource,cost) {
        swal.withForm({
            title: 'Update Item',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Update',
            closeOnConfirm: true,
            formFields: [
                { id: 'itemName', placeholder: 'Item Name' ,value:itemName},
                { id: 'imageSource', placeholder: 'Image source' ,value:imageSource},
                { id: 'cost', placeholder: 'Cost' ,value:cost},

            ]
        }, function (isConfirm) {
            // do whatever you want with the form data
            console.log(this.swalForm) // { name: 'user name', nickname: 'what the user sends' }
            var newItem = this.swalForm;
            console.log(newItem);
            $http.post('SnackService.asmx/UpdateItem', { 'Id':Id,'ItemName': newItem.itemName, 'ImageSource': newItem.imageSource, 'Cost': newItem.cost }).
            then(function () {


            });

            $http.post('SnackService.asmx/GetAllItems').then(function (response) {
                $scope.requestedItems = response.data;
                console.log("called post from storeRoomController");

            });
        })

    };

    //delete item
    $scope.deleteItem=function()
    {
        swal.withForm({
            title: 'Deleted Item',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Delete',
            closeOnConfirm: true,
            formFields: [
                { id: 'itemName', placeholder: 'Item Name' }           
            ]
        }, function (isConfirm) {
            // do whatever you want with the form data
            console.log(this.swalForm) // { name: 'user name', nickname: 'what the user sends' }
            var newItem = this.swalForm;
            console.log(newItem);
            $http.post('SnackService.asmx/DeleteItem', {'ItemName': newItem.itemName}).
            then(function () {

            });

            $http.post('SnackService.asmx/GetAllItems').then(function (response) {
                $scope.requestedItems = response.data;
                console.log("called post from storeRoomController");

            });
        })
    };
  
});         //end of controller

routerApp.controller('collectionController', function ($scope,$http) {

   
    $scope.names = ["Today", "Total"];
    $scope.todaysCollection = [];
    $scope.totalCollection = [];

    $scope.update = function () {
        $scope.labels = [];
        $scope.data = [];
        if ($scope.selectedName == 'Today')
            $http.post('SnackService.asmx/GetTodaysCollection').then(function (response) {
                $scope.collection = response.data;
                $scope.total = 0;
                for (var i = 0; i < $scope.collection.length; i++) {
                    $scope.total = $scope.total + $scope.collection[i].Cost;
                }

                //fill labels array
                for (var i = 0; i < $scope.collection.length; i++) {
                    console.log($scope.collection[i].ItemName);
                    $scope.labels.push($scope.collection[i].ItemName);
                 
                }

                //fill data array
                for (var i = 0; i < $scope.collection.length; i++) {
                  
                    ($scope.collection[i].Count);
                    $scope.data.push($scope.collection[i].Count);
                }
            });
        else
            $http.post('SnackService.asmx/GetTotalCollection').then(function (response) {
                $scope.collection = response.data;
                $scope.total = 0;
                for (var i = 0; i < $scope.collection.length; i++) {
                    $scope.total = $scope.total + $scope.collection[i].Cost;
                }
                //fill labels array
                for (var i = 0; i < $scope.collection.length; i++) {
                  
                    $scope.labels.push($scope.collection[i].ItemName);
                   
                }

                //fill data array
                for (var i = 0; i < $scope.collection.length; i++) {

                    $scope.data.push($scope.collection[i].Count);
                }
            });
    };
    $scope.chartNames = ['doughnut', 'pie'];
   

    //collection by date
   

    

    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();

    $http.post('SnackService.asmx/GetCollectionByDate', { 'Date': $scope.dt }).then(function (response) {
        $scope.collection = response.data;
    });

    $scope.clear = function () {
        $scope.dt = null;
    };

    $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
    };

    $scope.dateOptions = {
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };

    // Disable weekend selection
    function disabled(data) {
        var date = data.date,
          mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }

    $scope.toggleMin = function () {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };

    $scope.toggleMin();

    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function () {
        $scope.popup2.opened = true;
    };

    $scope.setDate = function (year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events = [
      {
          date: tomorrow,
          status: 'full'
      },
      {
          date: afterTomorrow,
          status: 'partially'
      }
    ];

    function getDayClass(data) {
        var date = data.date,
          mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    }



}); //end of controller


    