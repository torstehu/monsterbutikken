app.factory('basketService',['$http', function($http) {
    return {
        getBasket: function(){
            return $http.get('/service/basket/');
        },

        addItem: function(monsterType){
            return $http.post('/service/basket/' + encodeURIComponent(monsterType));
        },

        removeItem: function(monsterType){
            return $http.delete('/service/basket/' + encodeURIComponent(monsterType));
        }
    };
}]);
