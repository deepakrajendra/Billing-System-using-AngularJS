
var routerApp = angular.module('routerApp', ['ui.router']);
var actualQuantity; 

routerApp.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/billing');

    $stateProvider

        // billing STATES AND NESTED VIEWS ========================================
        .state('billing', {
            url: '/billing',
            templateUrl: 'partial-billing.html',
            controller:'billingController'
        })


        // storeRoom PAGE AND MULTIPLE NAMED VIEWS =================================
      .state('storeRoom', {
          url: '/storeRoom',
          views: {

              // the main template will be placed here (relatively named)
              '': { templateUrl: 'partial-storeRoom.html' }
          },
          controller:'billingController'
          

      })

}); // closes $routerApp.config()


//controller for billing
routerApp.controller('billingController', function ($scope,$http) {
    $scope.itemList1 = [{ 'itemName': 'Plain Cheese Burger', 'imageSource': 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQTKieWt4R4GRcPrDf1-PVU98aykYPOGXQDNPJubJztJirOA6hyOA', 'cost': 40 }, { 'itemName': 'Veg Burger', 'imageSource': 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTog5xWTmTaheNRn9Vy0skQd-mFQnithBhTIyuglvmC1oO6PRoY', 'cost': 50 }
    , { 'itemName': 'Veg Toasted Sandwich', 'imageSource': 'http://media.indiatimes.in/media/content/2013/Dec/1566836_1437738161.jpg', 'cost': 60 }, { 'itemName': 'Toasted Cheese Sandwich', 'imageSource': 'http://www.thetoastedsandwichcompany.co.uk/images/toasted-sandwich-large.jpg', 'cost': 70 }];

    $scope.itemList2 = [{ 'itemName': 'Toasted Indian Special', 'imageSource': 'http://www.foodinaminute.co.nz/var/fiam/storage/images/recipes/breakfast-toasted-sandwiches/2551205-17-eng-US/Breakfast-Toasted-Sandwiches_recipeimage.jpg', 'cost': 40 }, { 'itemName': 'Cheese Crispy Sandwich', 'imageSource': 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRZtgmnExS-fvxy1UeuU9VLXI9cllLU9Oua8DfMFBYcFJHyxK55', 'cost': 50 }
     , { 'itemName': 'Plain Veg Burger', 'imageSource': 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQGqXmbMZIezaptBUGBT8g2UkZjBtNeMhtLxFpGAwMZwdp0QasB', 'cost': 60 }, { 'itemName': 'Double Cheese Burger', 'imageSource': 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQLzE-HT-8BSWvYdva-qMoNUhyr6Qcjsc3NOCABDIowGcZEEPydaw', 'cost': 70 }];
   
    //storing ordereditems
    $scope.orderedItems = [];
    $scope.totalCost = 0;
    //clicking on the item 
    $scope.itemClick = function (itemName, itemCost) {
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

                $scope.$apply(function () {
                    $scope.orderedItems.push({
                        'name': itemName,
                        'quantity': parseInt(quantity),
                        'cost': itemCost
                    });
                });
            }
        });         //end of swal
    },                               //end of itemCLick scope

    //StoreRoom objects

    $scope.addClick = function ()
    {
        console.log("add called");
        swal.withForm({
            title: 'Cool Swal-Forms example',
            text: 'Any text that you consider useful for the form',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Get form data!',
            closeOnConfirm: true,
            formFields: [
                { id: 'name', placeholder: 'Name Field' },
                { id: 'nickname', placeholder: 'Add a cool nickname' }
            ]
        }, function (isConfirm) {
            // do whatever you want with the form data
            console.log(this.swalForm) // { name: 'user name', nickname: 'what the user sends' }
        });
    }         // end of addClick
});         //end of controller






routerApp.controller('billingController', function ($scope,$http) {
    $scope.itemList1 = [{ 'itemName': 'Plain Cheese Burger', 'imageSource': 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQTKieWt4R4GRcPrDf1-PVU98aykYPOGXQDNPJubJztJirOA6hyOA', 'cost': 40 }, { 'itemName': 'Veg Burger', 'imageSource': 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTog5xWTmTaheNRn9Vy0skQd-mFQnithBhTIyuglvmC1oO6PRoY', 'cost': 50 }
    , { 'itemName': 'Veg Toasted Sandwich', 'imageSource': 'http://media.indiatimes.in/media/content/2013/Dec/1566836_1437738161.jpg', 'cost': 60 }, { 'itemName': 'Toasted Cheese Sandwich', 'imageSource': 'http://www.thetoastedsandwichcompany.co.uk/images/toasted-sandwich-large.jpg', 'cost': 70 }];

    $scope.itemList2 = [{ 'itemName': 'Toasted Indian Special', 'imageSource': 'http://www.foodinaminute.co.nz/var/fiam/storage/images/recipes/breakfast-toasted-sandwiches/2551205-17-eng-US/Breakfast-Toasted-Sandwiches_recipeimage.jpg', 'cost': 40 }, { 'itemName': 'Cheese Crispy Sandwich', 'imageSource': 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRZtgmnExS-fvxy1UeuU9VLXI9cllLU9Oua8DfMFBYcFJHyxK55', 'cost': 50 }
     , { 'itemName': 'Plain Veg Burger', 'imageSource': 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQGqXmbMZIezaptBUGBT8g2UkZjBtNeMhtLxFpGAwMZwdp0QasB', 'cost': 60 }, { 'itemName': 'Double Cheese Burger', 'imageSource': 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQLzE-HT-8BSWvYdva-qMoNUhyr6Qcjsc3NOCABDIowGcZEEPydaw', 'cost': 70 }];
   
    //storing ordereditems
    $scope.orderedItems = [];
    $scope.totalCost = 0;
    //clicking on the item 
    $scope.itemClick = function (itemName, itemCost) {
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

                $scope.$apply(function () {
                    $scope.orderedItems.push({
                        'name': itemName,
                        'quantity': parseInt(quantity),
                        'cost': itemCost
                    });
                });
            }
        });         //end of swal
    },                               //end of itemCLick scope

    //StoreRoom objects

    $scope.addClick = function ()
    {
        console.log("add called");
        swal.withForm({
            title: 'Cool Swal-Forms example',
            text: 'Any text that you consider useful for the form',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Get form data!',
            closeOnConfirm: true,
            formFields: [
                { id: 'name', placeholder: 'Name Field' },
                { id: 'nickname', placeholder: 'Add a cool nickname' }
            ]
        }, function (isConfirm) {
            // do whatever you want with the form data
            console.log(this.swalForm) // { name: 'user name', nickname: 'what the user sends' }
        });
    }         // end of addClick
});         //end of controller

// let's define the scotch controller that we call up in the storeRoom state
routerApp.controller('scotchController', function ($scope) {

    $scope.message = 'test';

    $scope.scotches = [
        {
            name: 'Macallan 12',
            price: 50
        },
        {
            name: 'Chivas Regal Royal Salute',
            price: 10000
        },
        {
            name: 'Glenfiddich 1937',
            price: 20000
        }
    ];

});