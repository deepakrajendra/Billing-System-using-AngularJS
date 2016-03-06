
var routerApp = angular.module('routerApp', ['ui.router']);
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
        $http.post('SnackService.asmx/GetAllItems').then(function (response) {
            $scope.requestedItems = response.data;
            console.log("post called");

        });
 
      
    //storing ordereditems
    $scope.orderedItems = [];
    $scope.totalCost = 0;
  
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

                $scope.totalCost = $scope.totalCost + (itemCost * quantity);
                $http.post('SnackService.asmx/InsertItemToCollection', { 'Id': itemId, 'ItemName': itemName, 'Count': quantity, 'Cost': itemCost * quantity }).
              then(function () {
                  console.log("is t happening");
                  $http.post('SnackService.asmx/GetAllItemsFromCollection').then(function (response) {
                      $scope.orderedItems = response.data;
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
                $scope.totalCost=$scope.totalCost-Cost;
                $http.post('SnackService.asmx/GetAllItemsFromCollection').then(function (response) {
                    $scope.orderedItems = response.data;
                    //console.log("called post from storeRoomController");
                
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
                $scope.totalCost = 0;
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

    $scope.todaysCollection = [];
    http.post('SnackService.asmx/GetTodaysCollection').then(function (response)
    {
        $scope.todaysCollection = response.data;
    });

}); //end of controller


    