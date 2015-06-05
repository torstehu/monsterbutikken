app.controller('ShopController', ['$scope', '$modal', 'monsterService', 'basketService', 'authService', '$location', 'orderService',
    function($scope, $modal, monsterService, basketService, authService, $location, orderService) {

    authService.customer().success(function(customer){
        $scope.customerName = customer.customerName;
    });

    $scope.logOut = function(){
        authService.logOut().success(function(){
            $location.url('/');
        });
    };

    getBasket();

    function getBasket() {
        basketService.getBasket().success(function(basket){
            $scope.basket = basket;
        })
    }

    $scope.getMonsterPrice = function(monsterType){
        if ($scope.monsterTypes){
            var arrayLength = $scope.monsterTypes.length;
            for (var i = 0; i < arrayLength; i++) {
                if ($scope.monsterTypes[i].name === monsterType)
                    return $scope.monsterTypes[i].price
            }
        }
    };

    $scope.addItem = function(monsterType, e){
        $scope.thanksForYourOrder = false;
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        basketService.addItem(monsterType).then(getBasket);
    };

   $scope.removeItem = function(monsterType){
       basketService.removeItem(monsterType).then(getBasket);
    };

    $scope.basketEmpty = true;
    $scope.$watch('basket', function() {
        var basketEmpty = true;
        for (var prop in $scope.basket){
            if ($scope.basket.hasOwnProperty(prop))
                basketEmpty = false;
        }
        $scope.basketEmpty = basketEmpty;
    }, true);

    $scope.$watch('basket', function() {

        var sum = 0;
        if ($scope.basket){
            var arrayLength = $scope.basket.length;
            for (var i = 0; i < arrayLength; i++) {
                sum = sum + ($scope.getMonsterPrice($scope.basket[i].monsterType) * $scope.basket[i].quantity)
            }
        }
        $scope.basketSum = sum;
    }, true);



    $scope.order = function(){
        var confirmationModal = $modal.open({
            templateUrl: 'confirmOrderModal.html',
            controller: 'ConfirmOrderModalCtrl',
            resolve: {
                basket: function () {
                    return basketService.getBasket();
                },
                getMonsterPrice : function () {
                    return $scope.getMonsterPrice;
                },
                sum: function () {
                    return $scope.basketSum;
                }
            }
        });

        confirmationModal.result.then(function () {
            orderService.checkout().success(function(){
                getBasket();
                getOrders();
                $scope.thanksForYourOrder = true;
            });
        });
    };

    $scope.cancelOrder = function(orderId){
        var cancelOrderModal = $modal.open({
            templateUrl: 'cancelOrderModal.html',
            controller: 'CancelOrderModalCtrl',
            resolve: {
                orders: function () {
                    return orderService.getOrder(orderId);
                }
            }
        });

        cancelOrderModal.result.then(function () {
            orderService.cancelOrder(orderId).success(function(){
                getOrders();
            });
        });
    };

    getOrders();

    $scope.viewOrder = function(orderId){
        $modal.open({
            templateUrl: 'viewOrderModal.html',
            controller: 'ViewOrderModalCtrl',
            resolve: {
                orders: function () {
                    return orderService.getOrder(orderId);
                }
            }
        });
    };

    function getOrders() {
        orderService.getOrders().success(function(orders){
            $scope.orders = orders;
        })
    }

    monsterService.getMonsterTypes().success(function(monsterTypes){
        $scope.monsterTypes = monsterTypes;
    })

}]);

app.controller('ConfirmOrderModalCtrl', ['$scope', '$modalInstance', 'basket', 'getMonsterPrice', 'sum', function($scope, $modalInstance, basket, getMonsterPrice, sum) {
    $scope.basket = basket.data;
    $scope.getMonsterPrice = getMonsterPrice;
    $scope.sum = sum;

    $scope.confirm = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

app.controller('CancelOrderModalCtrl', ['$scope', '$modalInstance', 'orders', function($scope, $modalInstance, order) {
    $scope.order = order.data;

    $scope.confirm = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

app.controller('ViewOrderModalCtrl', ['$scope', '$modalInstance', 'orders', function($scope, $modalInstance, order) {
    $scope.order = order.data;

    $scope.close = function () {
        $modalInstance.dismiss();
    };
}]);

